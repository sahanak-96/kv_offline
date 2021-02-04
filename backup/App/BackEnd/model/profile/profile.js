const Pool = require('pg').Pool
config = require("../dbconfig");
db = config.database;
const pool = new Pool(db);
const fs = require('fs');
var path_proimg = "./assets/profile"


const getprofile = (request, response) => {
    const { uid } = request.body;
    console.log(uid)
    var username, schname, uname, secname, gradename, lang_flag, rank, imgexist = false, imagename = "Profile.png";
    var allFiletemp = []
    var allFile = []
    try {
        pool.connect((err, client, done) => {
            if (err) {
                console.log(err)
                done();
                return response.status(200).json({ status: "failed", message: "Internal Server Error" });
            }
            else {
                client.query(' Select skillangels_users.user_name,skillangels_users.name,skillangels_schoolbranch.branchname,skillangels_schoolbranch.lang_flag,\
                skillangels_schoolgradesections.sectionname,skillangels_grade.gradename,skillangels_users.profile_img_name,skillangels_schoolgrade.gradeid\
                from skillangels_users\
                INNER JOIN skillangels_schoolbranch ON skillangels_schoolbranch.id = skillangels_users.branch_id\
                INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.id = skillangels_users.section_id \
                INNER JOIN skillangels_schoolgrade ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
                INNER JOIN skillangels_grade ON skillangels_schoolgrade.gradeid = skillangels_grade.id \
                where skillangels_users.id =$1 and skillangels_users.current_year_status=$2', [uid, 1], (error, results) => {
                    if (error) {
                        done();
                        console.log(error)
                        response.status(200).json({ status: 'Failure', code: 'SA003', message: 'Profile get failed' });
                    }
                    else {

                        // fs.readdirSync(path_proimg).forEach(file => {
                        //     allFiletemp.push(file)
                        // });
                        // for (i = 0; i < allFiletemp.length; i++) {
                        //     allFile.push(allFiletemp[i].split('.').slice(0, -1).join('.'))
                        // }
                        // console.log(results.rows)
                        try {
                            username = results.rows[0].user_name
                            uname = results.rows[0].name
                            imagename=results.rows[0].profile_img_name+".png"
                            // for (i = 0; i < allFile.length; i++) {
                            //     if (allFile[i] == username) {
                            //         imgexist = true;
                            //         imagename = allFiletemp[i];
                            //     }
                            // }

                            // if (imgexist != true) {
                            //     fs.readFile('./assets/gallery/Profile.png', function (err, data) {
                            //         if (err) throw err;
                            //         fs.writeFile('./assets/profile/' + username + ".png", data, function (err) {
                            //             if (err) throw err;
                            //             console.log('It\'s saved!');
                            //         });
                            //     });
                            // }

                            schname = results.rows[0].branchname
                            secname = results.rows[0].sectionname
                            gradename = results.rows[0].gradename
                            lang_flag = results.rows[0].lang_flag

                            client.query(' select table1.rank as rank,table1.user_id,table1.totalscore from\
                            (select rank() over (order by skillangels_usertotalvalue.totalscore desc ) as rank,user_id,skillangels_users.current_year_status,\
                              skillangels_usertotalvalue.totalscore FROM skillangels_usertotalvalue  join \
                               skillangels_users on skillangels_usertotalvalue.user_id = skillangels_users.id and \
                                 skillangels_users.branch_id = (Select branch_id from skillangels_users where \
                                  skillangels_users.id = $1 and skillangels_users.current_year_status=$2 \
                                  and  skillangels_usertotalvalue.totalscore!=0)) as table1 \
                                   where table1.user_id = $1 and table1.current_year_status=$2', [uid, 1], (error, results1) => {
                                if (error) {
                                    done();
                                    console.log(error)
                                    response.status(200).json({ status: 'Failure', code: 'SA003', message: 'Profile get failed' });
                                }
                                else {
                                    done();
                                    if (results1.rows.length == 0) {
                                        rank = 0
                                        response.status(200).json({ status: 'success', code: 'SA000', lang_flag, username, uname, schname, secname, gradename, rank, imgexist, imagename, msg: 'Got profile' });
                                    } else {
                                        rank = results1.rows[0].rank
                                        response.status(200).json({ status: 'success', code: 'SA000', lang_flag, username, uname, schname, secname, gradename, rank, imgexist, imagename, msg: 'Got profile' });
                                    }

                                    console.log(results1.rows)
                                }
                            })

                        } catch (e) {
                            console.log("There is no profile..")
                        }

                    }
                })
            }
        })
    } catch (e) {
        console.log(e)
        return response.status(200).json({
            code: "SA120",
            status: "failed",
            message: "getprofile caused exception"
        });
    }
}

const getLanguagesProf = (request, response) => {

    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ code: "SA100", status: "failed", message: "Internal Server Error" });
            }
            else {
                client.query('Select * from skillangels_langconfig', (error, results) => {
                    if (error) {
                        done();
                        response.status(200).json({ status: 'Failure', code: 'SA015', message: 'Languages retrieval failed' });
                    }
                    else {
                        done();
                        response.status(200).json({ status: 'Success', code: 'SA000', result: results.rows, message: 'Languages retrieval successful' });
                    }
                })
            }
        })
    } catch (e) {
        console.log(e)
        return response.status(200).json({
            code: "SA120",
            status: "failed",
            message: "getLanguagesProf caused exception"
        });
    }
}

const updatetheme = (request, response) => {
    const { uid, themename } = request.body;
    console.log(uid + "       " + themename)
    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ status: "failed", message: "Internal Server Error" });
            }
            else {
                client.query('UPDATE skillangels_users SET selected_theme = (select skillangels_themeconfig.theme_id from skillangels_themeconfig where\
                 theme_name=$1) where id=$2 and current_year_status=$3', [themename, uid, 1], (error, results) => {
                    if (error) {
                        done();
                        response.status(200).json({ status: 'Failure', code: 'SA004', message: 'Theme not updated' });
                    }
                    else {
                        console.log(results.rows)
                        done();
                        response.status(200).json({ status: 'success', code: 'SA000', msg: 'Theme updated' });
                    }
                })
            }
        })
    } catch (e) {
        console.log(e)
        return response.status(200).json({
            code: "SA120",
            status: "failed",
            message: "updatetheme caused exception"
        });
    }
}

const updateaudio = (request, response) => {
    const { uid, audioname } = request.body;
    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ status: "failed", message: "Internal Server Error" });
            }
            else {
                client.query('UPDATE skillangels_users SET selected_music = (select skillangels_musicconfig.music_id from skillangels_musicconfig where\
                 music_name=$1) where id=$2 and current_year_status=$3', [audioname, uid, 1], (error, results) => {
                    if (error) {
                        console.log(error)
                        done();
                        response.status(200).json({ status: 'Failure', code: 'SA006', message: 'Audio not updated' });
                    }
                    else {
                        done();
                        response.status(200).json({ status: 'success', code: 'SA000', msg: 'Audio updated' });
                    }
                })
            }
        })
    } catch (e) {
        console.log(e)
        return response.status(200).json({
            code: "SA120",
            status: "failed",
            message: "updateaudio caused exception"
        });
    }
}
const updatelang = (request, response) => {
    const { uid, langid } = request.body;
    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ status: "failed", message: "Internal Server Error" });
            }
            else {
                // client.query('UPDATE skillangels_users SET selected_lang = (select skillangels_langconfig.lang_id from skillangels_langconfig where\
                //      lang_name=$1) where id=$2 returning skillangels_langconfig.lang_id', [langname, uid], (error, results) => {
                client.query('UPDATE skillangels_users SET selected_lang = $1 where id = $2 and current_year_status=$3', [langid, uid, 1], (error, results) => {
                    if (error) {
                        console.log(error)
                        done();
                        response.status(200).json({ status: 'Failure', code: 'SA007', message: 'Language not updated' });
                    }
                    else {
                        done();
                        response.status(200).json({ status: 'success', code: 'SA000', msg: 'Language updated' });
                    }
                })
            }
        })
    } catch (e) {
        console.log(e)
        return response.status(200).json({
            code: "SA120",
            status: "failed",
            message: "updatelang caused exception"
        });
    }
}

const getthemeusertotscore = (request, response) => {
    const { uid } = request.body;
    // uid = 12
    var themeresult
    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                console.log(err)
                return response.status(200).json({ status: "failed", message: "Internal Server Error" });
            }
            else {
                client.query('select * from skillangels_themeconfig', (error, results) => {
                    if (error) {
                        console.log(error)
                        done();
                        response.status(200).json({ status: 'Failure', code: 'SA022', message: 'Theme configuration get failed' });
                    }
                    else {

                        themeresult = results.rows;

                        client.query('select sum(m_score) as m_tot_score,sum(v_score)as v_tot_score,sum(f_score)as f_tot_score,sum(p_score)as p_tot_score,sum(l_score)as l_tot_score from skillangels_userfinishcycle where user_id=$1 and current_year_status=$2', [uid, 1], (error, results) => {
                            if (error) {
                                console.log(error)
                                done();
                                response.status(200).json({ status: 'Failure', code: 'SA023', message: 'Theme open or lock score get failed ' });
                            }
                            else {
                                done();
                                totalscore = parseInt(results.rows[0].m_tot_score) + parseInt(results.rows[0].v_tot_score) + parseInt(results.rows[0].f_tot_score) + parseInt(results.rows[0].p_tot_score) + parseInt(results.rows[0].l_tot_score)
                                response.status(200).json({ status: 'success', code: 'SA000', themeresult, totalscore, msg: 'Theme open or lock score got' });
                            }
                        })
                    }
                })
            }
        })
    } catch (e) {
        console.log(e)
        return response.status(200).json({
            code: "SA120",
            status: "failed",
            message: "getthemeusertotscore caused exception"
        });
    }
}


const getProfileImg = (request, response) => {
    const { newname, uid } = request.body;
    // uid = 12
 console.log(request.body)
    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                console.log(err)
                return response.status(200).json({  code: "SA100",status: "failed", message: "Internal Server Error" });
            }
            else {
                client.query('UPDATE skillangels_users SET profile_img_name = $1 where \
                id= $2 and current_year_status=$3', [newname, uid, 1], (error, results) => {
                    if (error) {
                        console.log(error)
                        done();
                        response.status(200).json({ status: 'Failure', code: 'SA452', message: 'Profile image get failed' });
                    }
                    else {
                        done();
                        console.log(newname)
                        console.log(uid)
                        response.status(200).json({ status: 'Success', code: 'SA000', message: 'Profile image updated' });

                    }
                })
            }
        })
    } catch (e) {
        console.log(e)
        return response.status(200).json({
            code: "SA453",
            status: "failed",
            message: "Profile image get caused exception"
        });
    }
    // try{
    // fs.readFile('./assets/gallery/' + oldname, function (err, data) {
    //     if (err) throw err;
    //     fs.writeFile('./assets/profile/' + newname, data, function (err) {
    //         if (err) throw err;
    //         console.log('It\'s saved!');
    //     });
    // });
    // }catch(e){
    //    console.log(e)
    // }

}

module.exports = {
    getprofile,
    getLanguagesProf,
    updatetheme,
    updateaudio,
    updatelang,
    getthemeusertotscore,
    getProfileImg
};