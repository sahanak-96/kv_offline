const Pool = require('pg').Pool
config = require("../dbconfig");
db = config.database;
const pool = new Pool(db);

const getreport = (request, response) => {
    const { uid, eid } = request.body;
    console.log("uid" + uid)
    console.log("eid" + eid)
    var postVal = [], iaVal = [], bspi_ia, bspi_post;
    var ass_name = [], avg_bspi = [], avg_score_val = []
    try {
        pool.connect((err, client, done) => {

            if (err) {
                done();
                return response.status(200).json({ code: 'SA100', status: "failed", message: "Internal Server Error" });
            }
            else {
                client.query('select assessname from skillangels_assessment order by assessid', (error, results) => {
                    if (error) {
                        console.log(error)
                        done();
                        response.status(200).json({ status: 'Failure', code: 'SA005', message: 'Report retrieval failed' });
                    }
                    else {
                        console.log("Coming")
                        for (i = 0; i < results.rows.length; i++) {
                            ass_name.push(results.rows[i].assessname)
                        }
                        // client.query('select * from assessmentwisescore($1) as t(ass_num integer,ass_m_score bigint,ass_v_score bigint,\
                        //     ass_f_score bigint,ass_p_score bigint,ass_l_score bigint,avg_m_score bigint,avg_v_score bigint,\
                        //     avg_f_score bigint,avg_p_score bigint,avg_l_score bigint,bspi_avg bigint) ORDER BY ass_num', [uid], (error, results) => {
                        client.query(' select * from gameassessmentwisescore_maxbased($1,$2,$3) as t(ass_status_id bigint,\
                            m_score bigint,v_score bigint,f_score bigint,p_score bigint,l_score bigint,\
                            avg_m_score text ,avg_v_score text,avg_f_score text,avg_p_score text,avg_l_score text,\
                            bspi_avg text)', [uid, eid, 1], (error, results) => {

                            if (error) {
                                console.log(error)
                                done();
                                response.status(200).json({ status: 'Failure', code: 'SA005', message: 'Report retrieval failed' });
                            }
                            else {
                                done();
                                console.log(results.rows)
                                if (results.rows.length != 0) {
                                    for (i = 0; i < results.rows.length; i++) {
                                        if (results.rows[i].ass_status_id == 1) {
                                            iaVal.push([results.rows[i].m_score, results.rows[i].v_score, results.rows[i].f_score, results.rows[i].p_score, results.rows[i].l_score])
                                            bspi_ia = (parseInt(results.rows[i].m_score) + parseInt(results.rows[i].v_score) + parseInt(results.rows[i].f_score) + parseInt(results.rows[i].p_score) + parseInt(results.rows[i].l_score)) / 5
                                        } else if (results.rows[i].ass_status_id == 3) {
                                            postVal.push([results.rows[i].m_score, results.rows[i].v_score, results.rows[i].f_score, results.rows[i].p_score, results.rows[i].l_score])
                                            bspi_post = (parseInt(results.rows[i].m_score) + parseInt(results.rows[i].v_score) + parseInt(results.rows[i].f_score) + parseInt(results.rows[i].p_score) + parseInt(results.rows[i].l_score)) / 5
                                        } else if (results.rows[i].ass_status_id == 2) {
                                            avg_score_val.push([results.rows[i].avg_m_score, results.rows[i].avg_v_score, results.rows[i].avg_f_score, results.rows[i].avg_p_score,
                                            results.rows[i].avg_l_score])
                                            avg_bspi.push(results.rows[i].bspi_avg)
                                        }
                                    }
                                    console.log(bspi_ia)
                                    console.log(bspi_post)
                                    console.log(iaVal)
                                    console.log(postVal)
                                    console.log(avg_score_val)
                                    console.log(avg_bspi)

                                    response.status(200).json({ status: 'success', ass_name, bspi_ia, bspi_post, iaVal, postVal, avg_score_val, avg_bspi, code: 'SA000', msg: 'Got report' });
                                } else {
                                    response.status(200).json({ status: 'success', ass_name, code: 'SA026', msg: 'There is no report.. New user!' });
                                }

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
            message: "getreport caused exception"
        });
    }
}

const getRank = (request, response) => {
    const { uid, eid } = request.body;
    console.log("uid" + uid)
    console.log("eid" + eid)
    // uid='EDSIX001SAS12'
    // eid=1
    var rank_list = [];

    // var ass_name = [], avg_bspi = [], avg_score_val = []
    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                console.log(err)
                return response.status(200).json({ code: 'SA100', status: "failed", message: "Internal Server Error" });
            }
            else {
                client.query('select table1.rank,table1.user_id,table1.sum,table2.user_name,table2.name  ,table2.id from \
                (select rank() over (order by sum(skillangels_userscore.score) desc ) as rank,\
                               user_id , sum(skillangels_userscore.score) FROM skillangels_userscore  \
                               join skillangels_users on skillangels_userscore.user_id=skillangels_users.id and  skillangels_userscore.user_id in \
                               (Select id from skillangels_users\
                               where branch_id=(Select branch_id from skillangels_users\
                               where skillangels_users.id =$1 and skillangels_users.current_year_status=$3)\
                               and section_id=(Select section_id from skillangels_users\
                               where skillangels_users.id =$1 and skillangels_users.current_year_status=$3 ) )\
                               where ass_status_id=$4 and event_id=$2\
                               group by skillangels_userscore.user_id)as table1 join (Select user_name,name,id from skillangels_users\
                               where branch_id=(Select branch_id from skillangels_users\
                               where skillangels_users.id =$1 and skillangels_users.current_year_status=$3)\
                               and section_id=(Select section_id from skillangels_users\
                               where skillangels_users.id =$1 and skillangels_users.current_year_status=$3 )\
                               group by user_name,id) as table2   on table1.user_id=table2.id order by rank', [uid, eid, 1, 1],
                    (error, results) => {
                        if (error) {
                            console.log(error)
                            done();
                            response.status(200).json({ status: 'Failure', code: 'SA117', message: 'Rank retrieval failed' });
                        }
                        else {
                            done();
                            console.log("coming rank_list")


                            for (i = 0; i < results.rows.length; i++) {
                                rank_list.push({
                                    rank: results.rows[i].rank,
                                    uid: results.rows[i].user_id,
                                    score: results.rows[i].sum,
                                    name: results.rows[i].user_name,
                                    username: results.rows[i].name
                                })
                            }
                            console.log(rank_list)
                            response.status(200).json({ status: 'success', code: 'SA000', rank_list, msg: 'Got rank' });

                        }
                    }
                )
            }
        })
    }

    catch (e) {
        console.log(e)
        return response.status(200).json({
            code: "SA120",
            status: "failed",
            message: "getRank caused exception"
        });
    }
}

const getskillkit = (request, response) => {
    const { uid, eid } = request.body;
    var skillkitval = []
    try {
        pool.connect((err, client, done) => {

            if (err) {
                done();
                return response.status(200).json({ code: 'SA100', status: "failed", message: "Internal Server Error" });
            }
            else {

                client.query(' select * from gamesskillkitscore_maxbased($1,$2,$3) as t(\
                    skillkit int, avg_m_score text ,avg_v_score text,avg_f_score text,avg_p_score text,avg_l_score text) order by skillkit'
                    , [uid, eid, 1], (error, results) => {

                        if (error) {
                            console.log(error)
                            console.log(error)
                            done();
                            response.status(200).json({ status: 'Failure', code: 'SA450', message: 'Report retrieval failed' });
                        }
                        else {
                            done();
                            console.log(results.rows)
                            if (results.rows.length != 0) {
                                if (results.rows[0].skillkit != 1) {
                                    skillkitval.push([0, 0, 0, 0, 0])
                                }
                                for (i = 0; i < results.rows.length; i++) {
                                    skillkitval.push([results.rows[i].avg_m_score, results.rows[i].avg_v_score, results.rows[i].avg_f_score, results.rows[i].avg_p_score,
                                    results.rows[i].avg_l_score])
                                }
                                console.log(skillkitval)
                                response.status(200).json({ status: 'success', skillkitval, code: 'SA000', msg: 'Got report' });
                            } else {
                                response.status(200).json({ status: 'success', code: 'SA026', msg: 'There is no skillkit.. No skillkit!' });
                            }

                        }
                    })

            }
        })
    } catch (e) {
        console.log(e)
        return response.status(200).json({
            code: "SA451",
            status: "failed",
            message: "getskillkit caused exception"
        });
    }
}



module.exports = {
    getreport,
    getRank,
    getskillkit
};