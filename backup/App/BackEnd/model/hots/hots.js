const Pool = require('pg').Pool
config = require("../dbconfig");
db = config.database;
const pool = new Pool(db);


const getHots = (request, response) => {
    const { uid, eid } = request.body;
    console.log(uid)
    var gradeid, hots_count, score, gameques = [], games_List = [], timeover_chk = 0;
    try {
        pool.connect((err, client, done) => {
            if (err) {
                console.log(err)
                done();
                return response.status(200).json({ status: "failed", message: "Internal Server Error" });
            }
            else {
                client.query(' Select skillangels_users.user_name,\
                skillangels_schoolgradesections.sectionname,skillangels_grade.gradename,skillangels_schoolgrade.gradeid\
                from skillangels_users\
                INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.id = skillangels_users.section_id \
                INNER JOIN skillangels_schoolgrade ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
                INNER JOIN skillangels_grade ON skillangels_schoolgrade.gradeid = skillangels_grade.id \
                where skillangels_users.id =$1 and current_year_status=$2', [uid, eid], (error, results) => {
                    if (error) {
                        done();
                        console.log(error)
                        response.status(200).json({ status: 'Failure', code: 'SA097', message: 'Grade id not get in hots' });
                    }
                    else {

                        gradeid = results.rows[0].gradeid
                        //   response.status(200).json({ status: 'success', code: 'SA000', gradeid , msg: 'Got grade' });
                        ////////////////////////////////////                       
                        client.query(' SELECT game_id,gamename FROM public.skillangels_gamemaster where \
                                game_id=$1 OR game_id=$2 order by game_id DESC ', [-1, -2], (error1, results1) => {
                            if (error1) {
                                done();
                                console.log(error1)
                                response.status(200).json({ status: 'Failure', code: 'SA144', message: 'Hots games get failed' });
                            }
                            else {
                                for (i = 0; i < results1.rows.length; i++) {
                                    games_List.push({
                                        gameid: results1.rows[i].game_id,
                                        gamename: results1.rows[i].gamename
                                    })
                                }

                                client.query(' SELECT count(user_id) as hots_count,sum(score) as score FROM skillangels_userscore where user_id=$1\
                                and ass_status_id =$2 and current_year_status=$3 and event_id=$4', [uid, 4, 1, eid], (error, results) => {
                                    if (error) {
                                        done();
                                        console.log(error)
                                        response.status(200).json({ status: 'Failure', code: 'SA106', message: 'Hots detail not get' });
                                    }
                                    else {
                                        hots_count = results.rows[0].hots_count
                                        score = results.rows[0].score
                                        // if (hots_count > 0) {
                                        client.query('SELECT ansvalidation,quesno FROM skillangels_gameques_entry where\
                                        user_id=$1 and ass_status_id =$2 and current_year_status=$3 and event_id=$4 order by answeredtime', [uid, 4, 1, eid], (error, results) => {
                                            if (error) {
                                                done();
                                                console.log(error)
                                                response.status(200).json({ status: 'Failure', code: 'SA107', message: 'Each question detail not get' });
                                            }
                                            else {

                                                if (results.rows.length > 0) {
                                                    for (i = 0; i < results.rows.length; i++) {
                                                        gameques.push({
                                                            ans: results.rows[i].ansvalidation,
                                                            quesno: results.rows[i].quesno
                                                        })
                                                    }
                                                    done();
                                                    response.status(200).json({ status: 'success', code: 'SA000', timeover_chk, gradeid, hots_count, score, gameques, games_List, msg: 'Got grade' });

                                                } else {

                                                    done();
                                                    if (hots_count == 1) {
                                                        timeover_chk = 1
                                                        response.status(200).json({ status: 'success', code: 'SA000', timeover_chk, gradeid, hots_count, score, gameques, games_List, msg: 'Hots get timeover' });
                                                    } else {
                                                        response.status(200).json({ status: 'success', code: 'SA000', timeover_chk, gradeid, hots_count, score, gameques, games_List, msg: 'Got grade' });
                                                    }


                                                }
                                            }
                                        })
                                        // } else {
                                        //     done();
                                        //     response.status(200).json({ status: 'success', code: 'SA000', gradeid, hots_count, score, gameques, msg: 'Got grade' });
                                        // }

                                    }
                                })
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
			message: "getHots caused exception"
		  });
    }
}



const gethotssnd = (request, response) => {
    const { uid, year_status } = request.body;

    try{
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ status: "failed", code: 'SA100', message: "Internal Server Error on selecting gethotssnd" });
            }
            else {

                client.query('select * from skillangels_users where id=$1 and current_year_status=$2 ', [uid, year_status],
                    (error, results) => {
                        if (error) {
                            console.log("error")
                            done();
                            return response.status(200).json({ status: "failed", code: 'SA144', message: "Internal Server Error on query selecting gethotssnd" });
                        }
                        else {
                            console.log(results.rows)
                            done();
                            return response.status(200).json({ status: 'success', code: 'SA000', gethotssnd: results.rows, message: "gethotssnd Selected Successfully" });

                        }
                    })
            }
        })
    }catch(e){
        return response.status(200).json({
			code: "SA120",
			status: "failed",
			message: "gethotssnd caused exception"
		  });
    }
}


module.exports = {
    getHots,
    gethotssnd
};