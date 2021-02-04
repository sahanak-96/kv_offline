const Pool = require('pg').Pool
config = require("../dbconfig");
db = config.database;
const pool = new Pool(db);
const bcrypt = require("bcryptjs")
//====================================================================================================
var today = new Date();
var daychkvalvar = 0;
const checkskilllist = (request, response) => {
    const { uid, skid, year_status } = request.body
    var get_grade
    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ code: "SA100", status: "failed", message: "Internal Server Error" });
            }
            else {
                client.query('select skillangels_schoolgrade.gradeid from skillangels_schoolgrade \
                INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid  =  \
                skillangels_schoolgrade.id \
                INNER JOIN skillangels_users ON skillangels_users.section_id =  skillangels_schoolgradesections.id  \
                where skillangels_users.id=$1'
                    , [uid], (error4, results4) => {
                        if (error4) {
                            done();
                            response.status(200).json({ status: 'failed', code: 'SA156', message: 'Internal Server Error on query selecting skillkit grade on getskillkitstatus' });
                        }
                        else {
                            get_grade = results4.rows[0].gradeid
                            client.query('SELECT count(*) FROM public.skillangels_skillkitgames_cylce_entry where Date((select actual_start_date \
                                from skillangels_skillkitgames_cylce_entry where user_id =$1  and  \
                                event_id =$3  and current_year_status =$2 order by actual_start_date desc LIMIT 1))= \
                                Date( (select actual_start_date from skillangels_games_cylce_entry where user_id =$1  and  \
                                event_id =$3 and current_year_status =$2 order by actual_start_date desc LIMIT 1))  \
                                and  user_id =$1 and  event_id =$3 and current_year_status =$2',
                                [uid, year_status, 1], (error3, results3) => {
                                    if (error3) {
                                        done();
                                        response.status(200).json({ status: 'Failure', code: 'SA428', message: 'Actual_start_date selection error in checkskilllist' });
                                    }
                                    else {
                                        if (results3.rows[0].count > 0) {

                                            client.query('SELECT count(*) FROM public.skillangels_skillkitgames_cylce_entry where (select getserverdate())<=\
                                                                    Date( (select actual_end_date from skillangels_skillkitgames_cylce_entry where user_id =$1  and \
                                                                    event_id =$2  and current_year_status =$3 order by actual_start_date desc LIMIT 1)) \
                                                                    and  user_id =$1 and    event_id =$2 and current_year_status =$3',
                                                [uid, year_status, 1], (error5, results5) => {
                                                    if (error5) {
                                                        done();
                                                        response.status(200).json({ status: 'Failure', code: 'SA429', message: 'onsameday < date chk query error on checkskilllist' });
                                                    }
                                                    else {
                                                        if (results5.rows[0].count > 0) {
                                                            daychkvalvar = 2;
                                                            done();
                                                            response.status(200).json({ status: 'Success', code: 'SA000', grade: get_grade, daychkval: daychkvalvar, message: 'Skillkit status data retrieval successful' });
                                                        } else {
                                                            client.query('SELECT count(*) FROM public.skillangels_games_cylce_entry where (select getserverdate())=\
                                                                            Date( (select played_end_date from skillangels_games_cylce_entry where user_id =$1  and \
                                                                            event_id =$2  and current_year_status =$3 order by actual_start_date desc LIMIT 1)) \
                                                                            and  user_id =$1 and    event_id =$2 and current_year_status =$3',
                                                                [uid, year_status, 1], (error6, results6) => {
                                                                    if (error6) {
                                                                        done();
                                                                        response.status(200).json({ status: 'Failure', code: 'SA430', message: 'Status selection error on checkskilllist' });
                                                                    }
                                                                    else {
                                                                        if (results6.rows[0].count > 0) {
                                                                            daychkvalvar = 2;
                                                                            done();
                                                                            response.status(200).json({ status: 'Success', code: 'SA000', grade: get_grade, daychkval: daychkvalvar, message: 'Skillkit status data retrieval successful' });
                                                                        } else {
                                                                            // daychkvalvar = 0;
                                                                            // console.log("coming")
                                                                            // done();
                                                                            // response.status(200).json({ status: 'Success', code: 'SA000', grade: get_grade, daychkval: daychkvalvar, message: 'Skillkit status data retrieval successful' });

                                                                            client.query('SELECT status FROM public.skillangels_games_cylce_entry where Date(actual_start_date)=\
                                                                            Date( (select actual_start_date from skillangels_games_cylce_entry where user_id =$1  and \
                                                                            event_id =$2  and current_year_status =$3 order by actual_start_date desc LIMIT 1)) \
                                                                            and  user_id =$1 and    event_id =$2 and current_year_status =$3',
                                                                                [uid, year_status, 1], (error12, results12) => {
                                                                                    if (error12) {
                                                                                        done();
                                                                                        response.status(200).json({ status: 'Failure', code: 'SA434', message: 'Skillangels_games_cylce_entry status error on checkskilllist' });
                                                                                    }
                                                                                    else {
                                                                                        if (results12.rows[0].status == 1) {
                                                                                            daychkvalvar = 0;
                                                                                            console.log("coming")
                                                                                            done();
                                                                                            response.status(200).json({ status: 'Success', code: 'SA000', grade: get_grade, daychkval: daychkvalvar, message: 'Skillkit status data retrieval successful' });

                                                                                        } else {
                                                                                            done();
                                                                                            daychkvalvar = 2;
                                                                                            response.status(200).json({ status: 'Success', code: 'SA000', grade: get_grade, daychkval: daychkvalvar, message: 'Skillkit status data retrieval successful' });

                                                                                        }
                                                                                    }
                                                                                })

                                                                        }
                                                                    }
                                                                })
                                                        }
                                                    }
                                                })

                                        } else {
                                            client.query('SELECT status FROM public.skillangels_skillkitgames_cylce_entry where Date(actual_start_date )=\
                                            Date( (select actual_start_date from skillangels_skillkitgames_cylce_entry where user_id =$1  and \
                                            event_id =$2  and current_year_status =$3 order by actual_start_date desc LIMIT 1)) \
                                            and  user_id =$1 and    event_id =$2 and current_year_status =$3 ',
                                                [uid, year_status, 1], (error10, results10) => {
                                                    if (error10) {
                                                        done();
                                                        response.status(200).json({ status: 'Failure', code: 'SA431', message: 'Status from skillkit cyle error on checkskilllist' });
                                                    }
                                                    else {

                                                        if (results10.rows.length > 0) {
                                                            console.log("coming this" + results10.rows[0].status)

                                                            if (results10.rows[0].status == 1) {
                                                                client.query('SELECT count(*) FROM public.skillangels_skillkitgames_cylce_entry where (select getserverdate())<=\
                                                                Date( (select actual_end_date from skillangels_skillkitgames_cylce_entry where user_id =$1  and \
                                                                event_id =$2  and current_year_status =$3 order by actual_start_date desc LIMIT 1)) \
                                                                and  user_id =$1 and    event_id =$2 and current_year_status =$3',
                                                                    [uid, year_status, 1], (error7, results7) => {
                                                                        if (error7) {
                                                                            done();
                                                                            response.status(200).json({ status: 'Failure', code: 'SA432', message: 'Skillangels_games_cylce_entry with in the cycle date error on checkskilllist' });
                                                                        }
                                                                        else {
                                                                            if (results7.rows[0].count > 0) {
                                                                                console.log("coming1")

                                                                                daychkvalvar = 2;
                                                                                done();
                                                                                response.status(200).json({ status: 'Success', code: 'SA000', grade: get_grade, daychkval: daychkvalvar, message: 'Skillkit status data retrieval successful' });
                                                                            } else {
                                                                                client.query('SELECT count(*) FROM public.skillangels_skillkitgames_cylce_entry where (select getserverdate())=\
                                                                                Date( (select played_end_date from skillangels_skillkitgames_cylce_entry where user_id =$1  and \
                                                                                event_id =$2  and current_year_status =$3 order by actual_start_date desc LIMIT 1)) \
                                                                                and  user_id =$1 and    event_id =$2 and current_year_status =$3',
                                                                                    [uid, year_status, 1], (error8, results8) => {
                                                                                        if (error8) {
                                                                                            done();
                                                                                            response.status(200).json({ status: 'Failure', code: 'SA433', message: 'Skillangels_games_cylce_entry  same cycle date error on checkskilllist ' });
                                                                                        }
                                                                                        else {
                                                                                            if (results8.rows[0].count > 0) {
                                                                                                console.log("coming1")

                                                                                                daychkvalvar = 2;
                                                                                                done();
                                                                                                response.status(200).json({ status: 'Success', code: 'SA000', grade: get_grade, daychkval: daychkvalvar, message: 'Skillkit status data retrieval successful' });
                                                                                            } else {
                                                                                                client.query('SELECT status FROM public.skillangels_skillkitgames_cylce_entry where Date(actual_start_date)=\
                                                                                                Date( (select actual_start_date from skillangels_skillkitgames_cylce_entry where user_id =$1  and \
                                                                                                event_id =$2  and current_year_status =$3 order by actual_start_date desc LIMIT 1)) \
                                                                                                and  user_id =$1 and    event_id =$2 and current_year_status =$3',
                                                                                                    [uid, year_status, 1], (error9, results9) => {
                                                                                                        if (error9) {
                                                                                                            done();
                                                                                                            response.status(200).json({ status: 'Failure', code: 'SA434', message: 'Skillangels_games_cylce_entry status error on checkskilllist' });
                                                                                                        }
                                                                                                        else {
                                                                                                            if (results9.rows[0].status == 1) {
                                                                                                                console.log("coming")
                                                                                                                daychkvalvar = 0;
                                                                                                                done();
                                                                                                                response.status(200).json({ status: 'Success', code: 'SA000', grade: get_grade, daychkval: daychkvalvar, message: 'Skillkit status data retrieval successful' });
                                                                                                            } else {
                                                                                                                done();
                                                                                                                daychkvalvar = 1;
                                                                                                                response.status(200).json({ status: 'Success', code: 'SA000', grade: get_grade, daychkval: daychkvalvar, message: 'Skillkit status data retrieval successful' });
                                                                                                            }
                                                                                                        }
                                                                                                    })

                                                                                            }
                                                                                        }
                                                                                    })
                                                                            }
                                                                        }
                                                                    })
                                                            } else {
                                                                daychkvalvar = 0;
                                                                done();
                                                                response.status(200).json({ status: 'Success', code: 'SA000', grade: get_grade, daychkval: daychkvalvar, message: 'Skillkit status data retrieval successful' });

                                                            }
                                                        } else {
                                                            // daychkvalvar = 0;
                                                            // done();
                                                            // response.status(200).json({ status: 'Success', code: 'SA000', grade: get_grade, daychkval: daychkvalvar, message: 'Skillkit status data retrieval successful' });

                                                            client.query('SELECT count(*) FROM public.skillangels_games_cylce_entry where (select getserverdate())<=\
                                                            Date( (select actual_end_date from skillangels_games_cylce_entry where user_id =$1  and \
                                                            event_id =$2  and current_year_status =$3 order by actual_start_date desc LIMIT 1)) \
                                                            and  user_id =$1 and    event_id =$2 and current_year_status =$3',
                                                                [uid, year_status, 1], (error7, results7) => {
                                                                    if (error7) {
                                                                        done();
                                                                        response.status(200).json({ status: 'Failure', code: 'SA435', message: 'Skillangels_games_cylce_entry  same cycle date error on checkskilllist lost' });
                                                                    }
                                                                    else {
                                                                        if (results7.rows[0].count > 0) {
                                                                            daychkvalvar = 1;
                                                                            done();
                                                                            response.status(200).json({ status: 'Success', code: 'SA000', grade: get_grade, daychkval: daychkvalvar, message: 'Skillkit status data retrieval successful' });
                                                                        } else {
                                                                            client.query('SELECT count(*) FROM public.skillangels_games_cylce_entry where (select getserverdate())=\
                                                                            Date( (select played_end_date from skillangels_games_cylce_entry where user_id =$1  and \
                                                                            event_id =$2  and current_year_status =$3 order by actual_start_date desc LIMIT 1)) \
                                                                            and  user_id =$1 and    event_id =$2 and current_year_status =$3',
                                                                                [uid, year_status, 1], (error8, results8) => {
                                                                                    if (error8) {
                                                                                        done();
                                                                                        response.status(200).json({ status: 'Failure', code: 'SA436', message: 'Skillangels_games_cylce_entry status error on checkskilllist lost' });
                                                                                    }
                                                                                    else {
                                                                                        if (results8.rows[0].count > 0) {
                                                                                            daychkvalvar = 1;
                                                                                            done();
                                                                                            response.status(200).json({ status: 'Success', code: 'SA000', grade: get_grade, daychkval: daychkvalvar, message: 'Skillkit status data retrieval successful' });
                                                                                        } else {
                                                                                            client.query('SELECT status FROM public.skillangels_games_cylce_entry where Date(actual_start_date)=\
                                                                                            Date( (select actual_start_date from skillangels_games_cylce_entry where user_id =$1  and \
                                                                                            event_id =$2  and current_year_status =$3 order by actual_start_date desc LIMIT 1)) \
                                                                                            and  user_id =$1 and    event_id =$2 and current_year_status =$3',
                                                                                                [uid, year_status, 1], (error9, results9) => {
                                                                                                    if (error9) {
                                                                                                        done();
                                                                                                        response.status(200).json({ status: 'Failure', code: 'SA437', message: 'Skillangels_games_cylce_entry status error on checkskilllist lost' });
                                                                                                    }
                                                                                                    else {

                                                                                                        if (results9.rows[0].status == 1) {
                                                                                                            console.log("coming1")
                                                                                                            daychkvalvar = 0;
                                                                                                            done();
                                                                                                            response.status(200).json({ status: 'Success', code: 'SA000', grade: get_grade, daychkval: daychkvalvar, message: 'Skillkit status data retrieval successful' });
                                                                                                        } else {
                                                                                                            daychkvalvar = 2;
                                                                                                            done();
                                                                                                            response.status(200).json({ status: 'Success', code: 'SA000', grade: get_grade, daychkval: daychkvalvar, message: 'Skillkit status data retrieval successful' });
                                                                                                        }
                                                                                                    }
                                                                                                })

                                                                                        }
                                                                                    }
                                                                                })
                                                                        }
                                                                    }
                                                                })
                                                        }
                                                    }
                                                })
                                        }
                                    }
                                })
                        }
                        ////////////////////////////////////////
                    })
            }
        })
    } catch (e) {
        console.log(e)
        return response.status(200).json({
            code: "SA120",
            status: "failed",
            message: "checkskilllist caused exception"
        });
    }
}

var skillkitstatuschk = 0;
var skillkitgamesplayelg = 0;
const putskillkitscore = (request, response) => {
    const { uid, gameid, eid, score, ccnt, wcnt, aqcnt, tqcnt, rtime, crtime, wrtime, gtime,
        skillkit, year_status, testtype } = request.body;
    const status = 1;
    console.log("ass_stsus-id" + (Number(skillkit) - (Number(skillkit) * Number(2))))
    console.log("uid" + uid + "gameid" + gameid + "eid" + eid + "score" + score + "ccnt" + ccnt + "wcnt" + wcnt +
        "aqcnt" + aqcnt + "tqcnt" + tqcnt + "rtime" + rtime + "crtime" + crtime +
        "wrtime" + wrtime + "gtime" + gtime + "skillkit" + skillkit + "status" + status + "year_status" + year_status + "testtype" + testtype)

    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ status: "failed", code: 'SA100', message: "Internal Server Error on putskillscore" });
            }
            else {
                client.query('select * from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
					and current_year_status =$3 order by actual_start_date desc LIMIT 1',
                    [uid, eid, year_status], (error, results) => {
                        if (error) {
                            console.log(error)
                            done();
                            response.status(200).json({ status: 'failed', code: 'SA383', message: 'selction of skillangels_skillkitgames_cylce_entry on userscore of skillkit' });
                        }
                        else {
                            if (results.rows.length > 0) {
                                skillkitstatuschk = results.rows[0].status;
                            }
                            else {
                                skillkitstatuschk = 0;
                            }

                            client.query('select count(*),(select count(skillangels_skillkitscore.ansquescnt) as scorecnt \
                            from (select * from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$3  \
                            and current_year_status =$5 order by actual_start_date desc LIMIT 1) as tab3  \
                            INNER JOIN skillangels_skillkitscore ON skillangels_skillkitscore.user_id = tab3.user_id   \
                            where skillangels_skillkitscore.user_id=$1 and skillangels_skillkitscore.event_id=$3  \
                             and skillangels_skillkitscore.current_year_status =$5 and  skillangels_skillkitscore.game_id = $2  \
                            and DATE(skillangels_skillkitscore.played_date)>= Date(tab3.actual_start_date)),  \
                            (select sum(skillangels_skillkitscore.ansquescnt) as res  \
                            from (select * from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$3 \
                            and current_year_status =$5 order by actual_start_date desc LIMIT 1) as tab2 \
                            INNER JOIN skillangels_skillkitscore ON skillangels_skillkitscore.user_id = tab2.user_id  \
                            where skillangels_skillkitscore.user_id=$1 and skillangels_skillkitscore.event_id=$3 \
                             and skillangels_skillkitscore.current_year_status =$5 and  skillangels_skillkitscore.game_id = $2 \
                            and DATE(skillangels_skillkitscore.played_date)>= Date(tab2.actual_start_date)) \
                            from (select * from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$3 \
                            and current_year_status =$5 order by actual_start_date desc LIMIT 1) as tab1 \
                            INNER JOIN skillangels_gameques_entry ON skillangels_gameques_entry.user_id = tab1.user_id \
                            where skillangels_gameques_entry.user_id =$1 and skillangels_gameques_entry.game_id = $2 \
                            and skillangels_gameques_entry.ass_status_id = $4 and skillangels_gameques_entry.event_id =$3 \
                            and skillangels_gameques_entry.current_year_status=$5 and  \
                            Date(skillangels_gameques_entry.answeredtime) >= Date(tab1.actual_start_date)',
                                [uid, gameid, eid, (Number(skillkit) - (Number(skillkit) * Number(2))), year_status], (error, results) => {
                                    if (error) {
                                        console.log(error);
                                        done();
                                        response.status(200).json({ status: 'failed', code: 'SA135', message: 'internal server error on query selecting count & res of skillkit' });
                                    }
                                    else {

                                        if (results.rows[0].res == null) {
                                            results.rows[0].res = 0;
                                        }

                                        if (skillkitstatuschk == 1) {
                                            skillkitgamesplayelg = 5;
                                        }
                                        else {
                                            skillkitgamesplayelg = 1;
                                        }

                                        console.log(results.rows[0].scorecnt + " cccccccccc" + skillkitgamesplayelg);
                                        console.log(results.rows[0].count + " cccccccccc" + (Number(results.rows[0].res) + Number(aqcnt)))
                                        if ((results.rows[0].count == (Number(results.rows[0].res) + Number(aqcnt))) &&
                                            (results.rows[0].scorecnt < skillkitgamesplayelg)) {
                                            client.query('Insert into skillangels_skillkitscore(user_id, game_id,event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, \
                                                                    correctresponsetime, gametime,  skillkit, status,current_year_status,testtype) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,$16)',
                                                [uid, gameid, eid, score, ccnt, wcnt, aqcnt, tqcnt, rtime, crtime, wrtime, gtime,
                                                    skillkit, status, year_status, testtype], (error, results) => {
                                                        if (error) {
                                                            done();
                                                            console.log(error)
                                                            response.status(200).json({ status: 'failed', code: 'SA012', message: 'Internal Server Error on query skillkit score insertion failed' });
                                                        }
                                                        else {
                                                            done();
                                                            console.log(results.rows)
                                                            response.status(200).json({ status: 'Success', code: 'SA000', msg: 'Skillkit score insertion successful' });
                                                        }
                                                    })
                                        }
                                        else {
                                            done();
                                            return response.status(200).json({ status: "failed", code: 'SA136', message: "count != res of skillkit failed" });
                                        }
                                    }
                                })


                        }
                    })


            }
        })
    } catch (e) {
        return response.status(200).json({
            code: "SA120",
            status: "failed",
            message: "putskillkitscore caused exception"
        });
    }
}



const getskillkitscore = (request, response) => {
    const { uid, eid, skid, year_status } = request.body;

    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ code: "SA100", status: "failed", message: "Internal Server Error on selecting skillkit Score" });
            }
            else {
                client.query('SELECT max(skillangels_skillkitscore.score),sum(skillangels_skillkitscore.score), \
                count(skillangels_skillkitscore.score), \
                skillangels_skillkitscore.game_id,skillangels_gamemaster.skill_id as skillid FROM \
                (select * from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
                and current_year_status =$3 order by actual_start_date desc LIMIT 1) as tab \
                INNER JOIN skillangels_skillkitscore ON skillangels_skillkitscore.user_id = tab.user_id \
                INNER JOIN skillangels_gamemaster ON skillangels_gamemaster.game_id = skillangels_skillkitscore.game_id \
                where skillangels_skillkitscore.user_id=$1 and skillangels_skillkitscore.event_id=$2 \
               and DATE(skillangels_skillkitscore.played_date)>= DATE(tab.actual_start_date) \
                GROUP BY skillangels_skillkitscore.game_id,skillangels_gamemaster.skill_id \
                ORDER BY skillangels_gamemaster.skill_id ASC', [uid, eid, year_status],
                    (error, results) => {
                        if (error) {
                            done();
                            return response.status(200).json({ status: "failed", code: 'SA384', message: "Internal Server Error on query selecting score skillkit" });
                        }
                        else {
                            console.log(results.rows)
                            done();
                            return response.status(200).json({ status: 'success', code: 'SA000', getskillkitscore: results.rows, message: "Score Selected Successfully skillkit" });

                        }
                    })
            }
        })

    } catch (e) {
        console.log(e)
        return response.status(200).json({
            code: "SA120",
            status: "failed",
            message: "getskillkitscore caused exception"
        });
    }
}



const getskillkitquescnt = (request, response) => {
    const { uid, eid, ass_status_id, skid, year_status } = request.body;

    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ code: "SA100", status: "failed", message: "Internal Server Error on selecting skillkit quescnt" });
            }
            else {

                client.query('select count(skillangels_gameques_entry.game_id),(skillangels_gamemaster.skill_id) \
						from (select * from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
						and current_year_status =$4 order by actual_start_date desc LIMIT 1) as tab \
						INNER JOIN skillangels_gameques_entry ON skillangels_gameques_entry.user_id = tab.user_id \
						INNER JOIN skillangels_gamemaster ON skillangels_gamemaster.game_id = skillangels_gameques_entry.game_id \
						where skillangels_gameques_entry.user_id=$1 \
						and DATE(skillangels_gameques_entry.answeredtime)>= DATE(tab.actual_start_date) \
						and skillangels_gameques_entry.finish_status=0 \
						and skillangels_gameques_entry.event_id=$2 and skillangels_gameques_entry.ass_status_id=$3 \
						and skillangels_gameques_entry.current_year_status=$4 \
						group by skillangels_gameques_entry.game_id,skillangels_gamemaster.skill_id \
						ORDER BY skillangels_gamemaster.skill_id ASC',
                    [uid, eid, ass_status_id, year_status],
                    (error, results) => {
                        if (error) {
                            console.log("error")
                            done();
                            return response.status(200).json({ status: "failed", code: 'SA385', message: "Internal Server Error on query selecting skillkitgamesquescnt" });
                        }
                        else {
                            console.log(results.rows)
                            done();
                            return response.status(200).json({ status: 'success', code: 'SA000', getskillkitquescnt: results.rows, message: "skillkitgamesquescnt Selected Successfully" });

                        }
                    })


            }
        })

    } catch (e) {
        console.log(e)
        return response.status(200).json({
            code: "SA120",
            status: "failed",
            message: "getskillkitquescnt caused exception"
        });
    }
}




var skillkitcyclecnt = 0;
var gamecyclecnt = 0;
const getskillkitgames = (request, response) => {
    const { uid, eid, skid, gamecnt, year_status, mgrade, vgrade,
        fgrade, pgrade, lgrade } = request.body
    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ code: "SA100", status: "failed", message: "Internal Server Error on getting skillkit games" });
            }
            else {


                client.query('select *,(select count(*) as skillkitcyclecnt from skillangels_skillkitgames_cylce_entry where \
                    user_id =$1 and event_id =$2  \
               and current_year_status =$3) from skillangels_skillkitgames_cylce_entry where \
                user_id =$1 and event_id =$2  \
           and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                    (error, results) => {
                        if (error) {
                            done();
                            return response.status(200).json({ status: "failed", code: 'SA386', message: "Internal Server Error on query selecting skillangels_skillkitgames_cylce_entry status" });
                        }
                        else {

                            if (results.rows.length > 0) {
                                skillkitcyclecnt = results.rows[0].skillkitcyclecnt;
                                client.query('select *,(select count(*) as gamecyclecnt from skillangels_games_cylce_entry where \
                                    user_id =$1 and event_id =$2  \
                               and current_year_status =$3) from skillangels_games_cylce_entry where \
                                user_id =$1 and event_id =$2  \
                           and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                                    (error, results) => {
                                        if (error) {
                                            done();
                                            return response.status(200).json({ status: "failed", code: 'SA387', message: "Internal Server Error on query selecting skillangels_games_cylce_entry on skillkit status" });
                                        }
                                        else {

                                            if (results.rows.length > 0) {
                                                if (skid > 1 && skillkitcyclecnt < 9) {
                                                    gamecyclecnt = Number(results.rows[0].gamecyclecnt) - (Number(skid) * 8);
                                                }
                                                else {
                                                    gamecyclecnt = Number(results.rows[0].gamecyclecnt) - 8;
                                                }

                                                if (skillkitcyclecnt == gamecyclecnt) {

                                                    if (results.rows[0].status == 1) {

                                                        client.query('select * from (select * from skillangels_games_cylce_entry where \
                                                            user_id =$1 and event_id =$2  \
                                                       and current_year_status =$3 order by actual_start_date desc LIMIT 1) as newtb \
                                                       where (select getserverdate()) > Date(actual_end_date)', [uid, eid, year_status],
                                                            (error, results) => {
                                                                if (error) {
                                                                    done();
                                                                    return response.status(200).json({ status: "failed", code: 'SA388', message: "Internal Server Error on query selecting skillkit >date" });
                                                                }
                                                                else {
                                                                    if (results.rows.length > 0) {

                                                                        client.query('select * from (select * from skillangels_games_cylce_entry where \
                                                                            user_id =$1 and event_id =$2  \
                                                                       and current_year_status =$3 order by actual_start_date desc LIMIT 1) as newtb \
                                                                       where (select getserverdate()) = Date(played_end_date)', [uid, eid, year_status],
                                                                            (error, results) => {
                                                                                if (error) {
                                                                                    done();
                                                                                    return response.status(200).json({ status: "failed", code: 'SA389', message: "Internal Server Error on query selecting todaychk skillkit" });
                                                                                }
                                                                                else {
                                                                                    if (results.rows.length > 0) {
                                                                                        client.query('select * from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
                                                        and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                                                                                            (error, results) => {
                                                                                                if (error) {
                                                                                                    done();
                                                                                                    return response.status(200).json({ status: "failed", code: 'SA390', message: "Internal Server Error on query selecting skillkit on todaychk" });
                                                                                                }
                                                                                                else {

                                                                                                    if (results.rows.length > 0) {
                                                                                                        done();
                                                                                                        return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, getskillkitgames: results.rows, message: "Games Selected Successfully skillkit games onsameday on todaychk" });
                                                                                                    }
                                                                                                    else {
                                                                                                        done();
                                                                                                        return response.status(200).json({ status: 'failed', code: 'SA391', mychkattempt: "", getskillkitgames: "", message: "Games not found skillkit games onsameday on todaychk" });
                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                    }
                                                                                    else {
                                                                                        client.query('select *,(select count(distinct game_id) as gamecount \
                                                                                        from getskillkitgrades($1,$2,$3,$4,$5,$6,$7,$8) as t(gamename varchar, \
                                                                                           skill_id int,game_id int)  where skill_id >0) \
                                                                                        from getskillkitgrades($1,$2,$3,$4,$5,$6,$7,$8) as t(gamename varchar, \
                                                                                           skill_id int,game_id int)  where skill_id >0 order by skill_id ', [uid, 2, year_status, mgrade, vgrade,
                                                                                            fgrade, pgrade, lgrade],
                                                                                            (error, results) => {
                                                                                                if (error) {
                                                                                                    done();
                                                                                                    return response.status(200).json({ status: "failed", code: 'SA392', message: "Internal server Error on query selecting skillkit games nxt" });
                                                                                                }
                                                                                                else {

                                                                                                    if (results.rows.length > 0) {
                                                                                                        done();
                                                                                                        return response.status(200).json({ status: 'success', code: 'SA000', getskillkitgames: results.rows, mychkattempt: 0, message: "Games Selected Successfully skillkit games nxt" });
                                                                                                    }
                                                                                                    else {
                                                                                                        done();
                                                                                                        return response.status(200).json({ status: 'failed', code: 'SA393', getskillkitgames: "", mychkattempt: "", message: "Games not found skillkit games nxt" });
                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                    }


                                                                                }
                                                                            })



                                                                    }
                                                                    else {
                                                                        client.query('select * from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
                                                        and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                                                                            (error, results) => {
                                                                                if (error) {
                                                                                    done();
                                                                                    return response.status(200).json({ status: "failed", code: 'SA394', message: "Internal server Error on query selecting skillkit games onsameday on >date =0" });
                                                                                }
                                                                                else {

                                                                                    if (results.rows.length > 0) {
                                                                                        done();
                                                                                        return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, getskillkitgames: results.rows, message: "Games Selected Successfully skillkit games onsameday >date =0" });
                                                                                    }
                                                                                    else {
                                                                                        done();
                                                                                        return response.status(200).json({ status: 'failed', code: 'SA395', mychkattempt: "", getskillkitgames: "", message: "Games not found skillkit games onsameday >date =0" });
                                                                                    }
                                                                                }
                                                                            })
                                                                    }
                                                                }
                                                            })


                                                    }
                                                    else {

                                                        client.query('select * from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
                                                        and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                                                            (error, results) => {
                                                                if (error) {
                                                                    done();
                                                                    return response.status(200).json({ status: "failed", code: 'SA396', message: "Internal server Error on query selecting skillkit games onsameday if status=0" });
                                                                }
                                                                else {

                                                                    if (results.rows.length > 0) {
                                                                        done();
                                                                        return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, getskillkitgames: results.rows, message: "Games Selected Successfully skillkit games onsameday if status=0" });
                                                                    }
                                                                    else {
                                                                        done();
                                                                        return response.status(200).json({ status: 'failed', code: 'SA397', mychkattempt: "", getskillkitgames: "", message: "Games not found skillkit games onsameday if status=0" });
                                                                    }
                                                                }
                                                            })
                                                    }


                                                }
                                                else {
                                                    client.query('select * from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
                                                    and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                                                        (error, results) => {
                                                            if (error) {
                                                                done();
                                                                return response.status(200).json({ status: "failed", code: 'SA398', message: "Internal server Error on query selecting skillkit games onsameday on skillkitcyclecnt!=gamecyclecnt" });
                                                            }
                                                            else {

                                                                if (results.rows.length > 0) {
                                                                    done();
                                                                    return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, getskillkitgames: results.rows, message: "Games Selected Successfully skillkit games onsameday skillkitcyclecnt!=gamecyclecnt" });
                                                                }
                                                                else {
                                                                    done();
                                                                    return response.status(200).json({ status: 'failed', code: 'SA399', mychkattempt: "", getskillkitgames: "", message: "Games not found skillkit games onsameday skillkitcyclecnt!=gamecyclecnt" });
                                                                }
                                                            }
                                                        })
                                                }

                                            }
                                            else {
                                                client.query('select * from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
                                                and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                                                    (error, results) => {
                                                        if (error) {
                                                            done();
                                                            return response.status(200).json({ status: "failed", code: 'SA400', message: "Internal server Error on query selecting skillkit games onsameday if gamecycle=0" });
                                                        }
                                                        else {

                                                            if (results.rows.length > 0) {
                                                                done();
                                                                return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, getskillkitgames: results.rows, message: "Games Selected Successfully skillkit games onsameday if gamecycle=0" });
                                                            }
                                                            else {
                                                                done();
                                                                return response.status(200).json({ status: 'failed', code: 'SA401', mychkattempt: "", getskillkitgames: "", message: "Games not found skillkit games onsameday if gamecycle=0" });
                                                            }
                                                        }
                                                    })
                                            }
                                        }
                                    })


                            }
                            else {

                                client.query('select *,(select count(distinct game_id) as gamecount \
                                 from getskillkitgrades($1,$2,$3,$4,$5,$6,$7,$8) as t(gamename varchar, \
                                    skill_id int,game_id int)  where skill_id >0) \
                                 from getskillkitgrades($1,$2,$3,$4,$5,$6,$7,$8) as t(gamename varchar, \
                                    skill_id int,game_id int)  where skill_id >0 order by skill_id ', [uid, 2, year_status, mgrade, vgrade,
                                    fgrade, pgrade, lgrade],
                                    (error, results) => {
                                        if (error) {
                                            done();
                                            return response.status(200).json({ status: "failed", code: 'SA402', message: "Internal server Error on query selecting skillkit games" });
                                        }
                                        else {

                                            if (results.rows.length > 0) {
                                                done();
                                                return response.status(200).json({ status: 'success', code: 'SA000', getskillkitgames: results.rows, mychkattempt: 0, message: "Games Selected Successfully skillkit first" });
                                            }
                                            else {
                                                done();
                                                return response.status(200).json({ status: 'failed', code: 'SA403', getskillkitgames: "", mychkattempt: "", message: "Games not found skillkit first" });
                                            }
                                        }
                                    })
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
            message: "getskillkitgames caused exception"
        });
    }
}

var dateData;
const getskillkitsnd = (request, response) => {
    const { uid, eid, year_status } = request.body;

    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ status: "failed", code: 'SA100', message: "Internal Server Error on selecting skillkit snd" });
            }
            else {
                // client.query('select actual_end_date,(select count(*) from (select actual_end_date as mydate  \
                //     from skillangels_skillkitgames_cylce_entry where  \
                //     user_id =$1 and event_id =$2 \
                //     and current_year_status =$3 order by actual_start_date desc LIMIT 1) as newtb \
                //     where (select getserverdate()) > Date(mydate))  \
                //     from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
                //     and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                //     (error1, results1) => {
                    client.query('select * \
                        from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
                        and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                        (error1, results1) => {
                        if (error1) {
                            console.log("error1")
                            done();
                            return response.status(200).json({ status: "failed", code: 'SA137', message: "Internal Server Error on query selecting Date details on getsnd skillkit" });
                        }
                        else {
                            // if (results1.rows[0].count > 0) {
                            //     dateData = addDays(today, 1);
                            // }
                            // else {
                            //     dateData = addDays(results1.rows[0].actual_end_date, 1);
                            // }
                            if(results1.rows[0].played_end_date != null){
                                dateData=results1.rows[0].played_end_date;
                            }
                            else{
                                dateData=0;
                            }
                            today = new Date();
                            client.query('select * from skillangels_users where id=$1 and current_year_status=$2 ', [uid, year_status],
                                (error, results) => {
                                    if (error) {
                                        console.log("error")
                                        done();
                                        return response.status(200).json({ status: "failed", code: 'SA137', message: "Internal Server Error on query selecting getsnd skillkit" });
                                    }
                                    else {
                                        console.log(results.rows)
                                        done();
                                        return response.status(200).json({ status: 'success', code: 'SA000', getskillkitsnd: results.rows, datedetails: dateData, message: "skillkit getsnd Selected Successfully" });

                                    }
                                })
                        }
                    })
            }
        })
    } catch (e) {
        return response.status(200).json({
            code: "SA120",
            status: "failed",
            message: "getskillkitsnd caused exception"
        });
    }
}

var mychkstatus = 0;
const getgamesstatus = (request, response) => {
    const { uid, eid, year_status } = request.body;

    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ status: "failed", code: 'SA100', message: "Internal Server Error on selecting getgamesstatus" });
            }
            else {

                client.query('select * from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
                and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                    (error, results) => {
                        if (error) {
                            done();
                            return response.status(200).json({ status: "failed", code: 'SA447', message: "Internal server Error on query selecting skillkit cycle on getgamesstatus" });
                        }
                        else {

                            if (results.rows.length > 0) {
                                client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
                                and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                                    (error, results) => {
                                        if (error) {
                                            done();
                                            return response.status(200).json({ status: "failed", code: 'SA448', message: "Internal server Error on query selecting game cycle on getgamesstatus" });
                                        }
                                        else {

                                            if (results.rows.length > 0) {
                                                mychkstatus = results.rows[0].status;
                                                client.query('select count(*)  from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
                                                and current_year_status =$3 and Date((select actual_start_date from skillangels_skillkitgames_cylce_entry \
                                                    where user_id =$1 and event_id =$2 \
                                                    and current_year_status =$3 order by actual_start_date desc LIMIT 1))=Date((select actual_start_date \
                                                         from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
                                                    and current_year_status =$3 order by actual_start_date desc LIMIT 1))', [uid, eid, year_status],
                                                    (error, results) => {
                                                        if (error) {
                                                            console.log("error")
                                                            done();
                                                            return response.status(200).json({ status: "failed", code: 'SA449', message: "Internal Server Error on query selecting skillkitcycledate=gamecycledate on getgamesstatus" });
                                                        }
                                                        else {
                                                            console.log("results.rows[0].count" + results.rows[0].count)
                                                            if (results.rows[0].count > 0) {
                                                                if (mychkstatus == 1) {
                                                                    done();
                                                                    return response.status(200).json({ status: 'success', code: 'SA000', status: 1, message: "gamefinish games stausval 1 status=1 on getgamesstatus" });
                                                                }
                                                                else {
                                                                    done();
                                                                    return response.status(200).json({ status: 'success', code: 'SA000', status: 0, message: "gamefinish games stausval 0 status=0 on getgamesstatus" });
                                                                }
                                                            }
                                                            else {
                                                                done();
                                                                return response.status(200).json({ status: 'success', code: 'SA000', status: 0, message: "select staus skillkitcycledate!=gamecycledate on getgamesstatus" });
                                                            }

                                                        }
                                                    })

                                            }
                                            else {
                                                done();
                                                return response.status(200).json({ status: 'success', code: 'SA000', status: 0, message: "gamefinish games row 0 status=0 on getgamesstatus" });
                                            }
                                        }
                                    })

                            }
                            else {
                                done();
                                return response.status(200).json({ status: 'success', code: 'SA000', status: 0, message: "gamefinish skillkit row 0 status=0 on getgamesstatus" });
                            }
                        }
                    })
            }
        })
    } catch (e) {
        return response.status(200).json({
            code: "SA120",
            status: "failed",
            message: "getgamesstatus caused exception"
        });
    }
}
var skillkitupdatestratdate;
var skillkitplayactualchk = 0;
var orgskillcyclecnt = 0;
var orggamescyclecnt = 0;
const getskillkitorggame = (request, response) => {
    const { uid, eid, year_status, ass_status_id, date, mem, vp, fa, ps, lin, memnam, vpnam, fanam, psnam, linnam, skillcnt, skid } = request.body;
    console.log(" uid, eid, year_status, ass_status_id, date," + uid + eid + year_status + ass_status_id + date)
    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ status: "failed", code: 'SA100', message: "Internal Server Error on selecting skillkitgetorggamechk" });
            }
            else {
                client.query('select getserverdate()',
                    (error, results) => {
                        if (error) {
                            console.log("error")
                            done();
                            return response.status(200).json({ status: "failed", code: 'SA404', message: "Internal Server Error on query serverdate skillkitgetorggamechk" });
                        }
                        else {
                            skillkitupdatestratdate = results.rows[0].getserverdate;
                            client.query('select *,(select count(*) as orgskillcyclecnt from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
                                and current_year_status =$3) from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
					and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                                (errorI, resultsI) => {
                                    if (errorI) {
                                        console.log("errorI")
                                        done();
                                        return response.status(200).json({ status: "failed", code: 'SA405', message: "Internal Server Error on query selecting sttaus skillkitgetorggamechk " });
                                    }
                                    else {
                                        console.log(resultsI.rows)
                                        if (resultsI.rows.length > 0) {
                                            orgskillcyclecnt = resultsI.rows[0].orgskillcyclecnt;
                                            client.query('select *,(select count(*) as orggamescyclecnt from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
                                                and current_year_status =$3) from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
                                            and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                                                (error, results) => {
                                                    if (error) {
                                                        console.log("error")
                                                        done();
                                                        return response.status(200).json({ status: "failed", code: 'SA406', message: "Internal Server Error on query selecting sttaus skillkitgetorggamechk " });
                                                    }
                                                    else {
                                                        if (results.rows.length > 0) {
                                                            if (skid > 1 && orgskillcyclecnt < 9) {
                                                                orggamescyclecnt = Number(results.rows[0].orggamescyclecnt) - (Number(skid) * 8);
                                                            }
                                                            else {
                                                                orggamescyclecnt = Number(results.rows[0].orggamescyclecnt) - 8;
                                                            }

                                                            if (orgskillcyclecnt == orggamescyclecnt) {

                                                                if (results.rows[0].status == 1) {

                                                                    client.query('select * from (select * from skillangels_games_cylce_entry where \
                                                                                    user_id =$1 and event_id =$2  \
                                                                               and current_year_status =$3 order by actual_start_date desc LIMIT 1) as newtb \
                                                                               where (select getserverdate()) > Date(actual_end_date)', [uid, eid, year_status],
                                                                        (error, results) => {
                                                                            if (error) {
                                                                                console.log("error")
                                                                                done();
                                                                                return response.status(200).json({ status: "failed", code: 'SA407', message: "Internal Server Error on query selecting > date skillkitgetorggamechk " });
                                                                            }
                                                                            else {

                                                                                if (results.rows.length > 0) {

                                                                                    client.query('select * from (select * from skillangels_games_cylce_entry where \
                                                                                    user_id =$1 and event_id =$2  \
                                                                               and current_year_status =$3 order by actual_start_date desc LIMIT 1) as newtb \
                                                                               where (select getserverdate()) = Date(played_end_date)', [uid, eid, year_status],
                                                                                        (error, results) => {
                                                                                            if (error) {
                                                                                                done();
                                                                                                return response.status(200).json({ status: "failed", code: 'SA408', message: "Internal Server Error on query selecting todaychk skillkitgetorggamechk " });
                                                                                            }
                                                                                            else {
                                                                                                if (results.rows.length > 0) {

                                                                                                    client.query('select * from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
                                                                                                and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                                                                                                        (error, results) => {
                                                                                                            if (error) {
                                                                                                                console.log("error")
                                                                                                                done();
                                                                                                                return response.status(200).json({ status: "failed", code: 'SA409', message: "Internal Server Error on query selecting todaychk data skillkitgetorggamechk " });
                                                                                                            }
                                                                                                            else {
                                                                                                                console.log(results.rows)
                                                                                                                done();
                                                                                                                return response.status(200).json({ status: 'success', code: 'SA000', skillkitorggamechk: 1, getskillkitorggame: results.rows, message: "todaychk data skillkitgetorggamechk Selected Successfully " });
                                                                                                            }
                                                                                                        })

                                                                                                }
                                                                                                else {

                                                                                                    client.query('select count(*) from (select * from skillangels_games_cylce_entry where \
                                                                                                            user_id =$1 and event_id =$2  \
                                                                                                       and current_year_status =$3 order by actual_start_date desc LIMIT 1) as newtb \
                                                                                                       where Date(newtb.played_end_date) < Date(newtb.actual_end_date)', [uid, eid, year_status],
                                                                                                        (error, results) => {
                                                                                                            if (error) {
                                                                                                                console.log("error")
                                                                                                                done();
                                                                                                                return response.status(200).json({ status: "failed", code: 'SA410', message: "Internal Server Error on query selecting played<actual skillkitgetorggamechk nxt" });
                                                                                                            }
                                                                                                            else {
                                                                                                                skillkitplayactualchk = results.rows[0].count;
                                                                                                                if (results.rows[0].count > 0) {
                                                                                                                    client.query('select *,(select actual_end_date from skillangels_games_cylce_entry \
                                                                                                                            where user_id =$1 and event_id =$2 \
                                                                                                                            and current_year_status =$3 order by actual_start_date desc LIMIT 1) as storedplayed_end_date \
                                                                                                                             from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
                                                                                                                        and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                                                                                                                        (error, results) => {
                                                                                                                            if (error) {
                                                                                                                                console.log("error")
                                                                                                                                done();
                                                                                                                                return response.status(200).json({ status: "failed", code: 'SA411', message: "Internal Server Error on query selecting skillkitgetorggamechk nxt actualend" });
                                                                                                                            }
                                                                                                                            else {
                                                                                                                                client.query('Insert into skillangels_skillkitgames_cylce_entry\
                                                                                                                                        (user_id, mem_game_id, vp_game_id , fa_game_id , ps_game_id, lin_game_id ,mem_name,vp_name,  \
                                                                                                                                       fa_name,ps_name,lin_name,ass_status_id, event_id , \
                                                                                                                               current_year_status ,actual_start_date,actual_end_date,played_start_date,skillcnt \
                                                                                                                                   ) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)',
                                                                                                                                    [uid, mem, vp, fa, ps, lin, memnam, vpnam, fanam, psnam, linnam, ass_status_id,
                                                                                                                                        eid, year_status, addDays(results.rows[0].actual_end_date, 1), addDays(results.rows[0].storedplayed_end_date, 7), skillkitupdatestratdate, skillcnt], (error, results) => {
                                                                                                                                            if (error) {
                                                                                                                                                console.log(error)
                                                                                                                                                done();
                                                                                                                                                response.status(200).json({ status: 'failed', code: 'SA412', message: 'query insert failed in skillkitgetorggamechk nxt actualend' });
                                                                                                                                            }
                                                                                                                                            else {
                                                                                                                                                done();
                                                                                                                                                response.status(200).json({ status: 'success', code: 'SA000', skillkitorggamechk: 0, message: 'skillkitgetorggamechk nxt actualend inserted successfully' });
                                                                                                                                            }
                                                                                                                                        })
                                                                                                                            }
                                                                                                                        })
                                                                                                                }
                                                                                                                else {

                                                                                                                    client.query('select *,(select played_end_date from skillangels_games_cylce_entry \
                                                                                                where user_id =$1 and event_id =$2 \
                                                                                                and current_year_status =$3 order by actual_start_date desc LIMIT 1) as storedplayed_end_date \
                                                                                                 from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
                                                                                            and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                                                                                                                        (error, results) => {
                                                                                                                            if (error) {
                                                                                                                                console.log("error")
                                                                                                                                done();
                                                                                                                                return response.status(200).json({ status: "failed", code: 'SA413', message: "Internal Server Error on query selecting skillkitgetorggamechk nxt playedend" });
                                                                                                                            }
                                                                                                                            else {
                                                                                                                                client.query('Insert into skillangels_skillkitgames_cylce_entry\
                                                                                                            (user_id, mem_game_id, vp_game_id , fa_game_id , ps_game_id, lin_game_id ,mem_name,vp_name,  \
                                                                                                           fa_name,ps_name,lin_name,ass_status_id, event_id , \
                                                                                                   current_year_status ,actual_start_date,actual_end_date,played_start_date,skillcnt \
                                                                                                       ) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)',
                                                                                                                                    [uid, mem, vp, fa, ps, lin, memnam, vpnam, fanam, psnam, linnam, ass_status_id,
                                                                                                                                        eid, year_status, addDays(results.rows[0].played_end_date, 1), addDays(results.rows[0].storedplayed_end_date, 7), skillkitupdatestratdate, skillcnt], (error, results) => {
                                                                                                                                            if (error) {
                                                                                                                                                console.log(error)
                                                                                                                                                done();
                                                                                                                                                response.status(200).json({ status: 'failed', code: 'SA414', message: 'query insert failed in skillkitgetorggamechk nxt playedend' });
                                                                                                                                            }
                                                                                                                                            else {
                                                                                                                                                done();
                                                                                                                                                response.status(200).json({ status: 'success', code: 'SA000', skillkitorggamechk: 0, message: 'skillkitgetorggamechk nxt playedend inserted successfully' });
                                                                                                                                            }
                                                                                                                                        })
                                                                                                                            }
                                                                                                                        })
                                                                                                                }

                                                                                                            }
                                                                                                        })




                                                                                                }
                                                                                            }
                                                                                        })

                                                                                }
                                                                                else {

                                                                                    client.query('select * from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
                                                                                        and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                                                                                        (error, results) => {
                                                                                            if (error) {
                                                                                                console.log("error")
                                                                                                done();
                                                                                                return response.status(200).json({ status: "failed", code: 'SA415', message: "Internal Server Error on query selecting > date =0 skillkitgetorggamechk " });
                                                                                            }
                                                                                            else {
                                                                                                console.log(results.rows)
                                                                                                done();
                                                                                                return response.status(200).json({ status: 'success', code: 'SA000', skillkitorggamechk: 1, getskillkitorggame: results.rows, message: "skillkitgetorggamechk Selected Successfully > date =0" });
                                                                                            }
                                                                                        })



                                                                                }
                                                                            }
                                                                        })


                                                                }
                                                                else {
                                                                    client.query('select * from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
                                                                    and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                                                                        (error, results) => {
                                                                            if (error) {
                                                                                console.log("error")
                                                                                done();
                                                                                return response.status(200).json({ status: "failed", code: 'SA416', message: "Internal Server Error on query selecting status=0 " });
                                                                            }
                                                                            else {
                                                                                console.log(results.rows)
                                                                                done();
                                                                                return response.status(200).json({ status: 'success', code: 'SA000', skillkitorggamechk: 1, getskillkitorggame: results.rows, message: "skillkitgetorggamechk Selected Successfully status=0" });
                                                                            }
                                                                        })
                                                                }


                                                            }
                                                            else {
                                                                client.query('select * from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
                                                                                    and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                                                                    (error, results) => {
                                                                        if (error) {
                                                                            console.log("error")
                                                                            done();
                                                                            return response.status(200).json({ status: "failed", code: 'SA417', message: "Internal Server Error on query selecting orgskillcyclecnt!=orggamescyclecnt " });
                                                                        }
                                                                        else {
                                                                            console.log(results.rows)
                                                                            done();
                                                                            return response.status(200).json({ status: 'success', code: 'SA000', skillkitorggamechk: 1, getskillkitorggame: results.rows, message: "skillkitgetorggamechk Selected Successfully orgskillcyclecnt!=orggamescyclecnt" });
                                                                        }
                                                                    })
                                                            }


                                                        }
                                                        else {
                                                            client.query('select * from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
                                                                    and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                                                                (error, results) => {
                                                                    if (error) {
                                                                        console.log("error")
                                                                        done();
                                                                        return response.status(200).json({ status: "failed", code: 'SA418', message: "Internal Server Error on query selecting gamecycle=0 " });
                                                                    }
                                                                    else {
                                                                        console.log(results.rows)
                                                                        done();
                                                                        return response.status(200).json({ status: 'success', code: 'SA000', skillkitorggamechk: 1, getskillkitorggame: results.rows, message: "skillkitgetorggamechk Selected Successfully gamecycle=0" });
                                                                    }
                                                                })
                                                        }
                                                    }
                                                })





                                        }
                                        else {

                                            client.query('select count(*) from (select * from skillangels_games_cylce_entry where \
                                                user_id =$1 and event_id =$2  \
                                           and current_year_status =$3 order by actual_start_date desc LIMIT 1) as newtb \
                                           where Date(newtb.played_end_date) < Date(newtb.actual_end_date)', [uid, eid, year_status],
                                                (error, results) => {
                                                    if (error) {
                                                        console.log("error")
                                                        done();
                                                        return response.status(200).json({ status: "failed", code: 'SA419', message: "Internal Server Error on query selecting played<actual skillkitgetorggamechk first" });
                                                    }
                                                    else {
                                                        skillkitplayactualchk = results.rows[0].count;
                                                        if (results.rows[0].count > 0) {
                                                            client.query('select *,(select actual_end_date from skillangels_games_cylce_entry \
                                                                where user_id =$1 and event_id =$2 \
                                                                and current_year_status =$3 order by actual_start_date desc LIMIT 1) as storedplayed_end_date \
                                                                 from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
                                                            and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                                                                (error, results) => {
                                                                    if (error) {
                                                                        console.log("error")
                                                                        done();
                                                                        return response.status(200).json({ status: "failed", code: 'SA420', message: "Internal Server Error on query selecting skillkitgetorggamechk first actualend" });
                                                                    }
                                                                    else {
                                                                        client.query('Insert into skillangels_skillkitgames_cylce_entry\
                                                                            (user_id, mem_game_id, vp_game_id , fa_game_id , ps_game_id, lin_game_id ,mem_name,vp_name,  \
                                                                           fa_name,ps_name,lin_name,ass_status_id, event_id , \
                                                                   current_year_status ,actual_start_date,actual_end_date,played_start_date,skillcnt \
                                                                       ) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)',
                                                                            [uid, mem, vp, fa, ps, lin, memnam, vpnam, fanam, psnam, linnam, ass_status_id,
                                                                                eid, year_status, addDays(results.rows[0].actual_end_date, 1), addDays(results.rows[0].storedplayed_end_date, 7), skillkitupdatestratdate, skillcnt], (error, results) => {
                                                                                    if (error) {
                                                                                        console.log(error)
                                                                                        done();
                                                                                        response.status(200).json({ status: 'failed', code: 'SA421', message: 'query insert failed in skillkitgetorggamechk first actualend' });
                                                                                    }
                                                                                    else {
                                                                                        done();
                                                                                        response.status(200).json({ status: 'success', code: 'SA000', skillkitorggamechk: 0, message: 'skillkitgetorggamechk first actualend inserted successfully' });
                                                                                    }
                                                                                })
                                                                    }
                                                                })
                                                        }
                                                        else {

                                                            client.query('select *,(select played_end_date from skillangels_games_cylce_entry \
                                    where user_id =$1 and event_id =$2 \
                                    and current_year_status =$3 order by actual_start_date desc LIMIT 1) as storedplayed_end_date \
                                     from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
                                and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
                                                                (error, results) => {
                                                                    if (error) {
                                                                        console.log("error")
                                                                        done();
                                                                        return response.status(200).json({ status: "failed", code: 'SA422', message: "Internal Server Error on query selecting skillkitgetorggamechk first playedend" });
                                                                    }
                                                                    else {
                                                                        client.query('Insert into skillangels_skillkitgames_cylce_entry\
                                                (user_id, mem_game_id, vp_game_id , fa_game_id , ps_game_id, lin_game_id ,mem_name,vp_name,  \
                                               fa_name,ps_name,lin_name,ass_status_id, event_id , \
                                       current_year_status ,actual_start_date,actual_end_date,played_start_date,skillcnt \
                                           ) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)',
                                                                            [uid, mem, vp, fa, ps, lin, memnam, vpnam, fanam, psnam, linnam, ass_status_id,
                                                                                eid, year_status, addDays(results.rows[0].played_end_date, 1), addDays(results.rows[0].storedplayed_end_date, 7), skillkitupdatestratdate, skillcnt], (error, results) => {
                                                                                    if (error) {
                                                                                        console.log(error)
                                                                                        done();
                                                                                        response.status(200).json({ status: 'failed', code: 'SA423', message: 'query insert failed in skillkitgetorggamechk first playedend' });
                                                                                    }
                                                                                    else {
                                                                                        done();
                                                                                        response.status(200).json({ status: 'success', code: 'SA000', skillkitorggamechk: 0, message: 'skillkitgetorggamechk first playedend inserted successfully' });
                                                                                    }
                                                                                })
                                                                    }
                                                                })
                                                        }

                                                    }
                                                })




                                        }


                                    }
                                })



                        }
                    })

            }
        })
    } catch (e) {
        return response.status(200).json({
            code: "SA120",
            status: "failed",
            message: "getskillkitorggame caused exception"
        });
    }
}


function addDays(dateObj, numDays) {
    dateObj.setDate(dateObj.getDate() + numDays);
    console.log(dateObj);
    return dateObj;
}

const checkskillkittoday = (request, response) => {
    const { uid } = request.body
    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ code: "SA100", status: "failed", message: "Internal Server Error on getting skillkit games" });
            }
            else {
                client.query('select isskillkit from skillangels_users where id=$1  ', [uid], (error, results) => {
                    if (error) {
                        console.log(error)
                        done();
                        response.status(200).json({ status: 'Failure', code: 'SA382', message: 'Skillkit failed' });
                    }
                    else {
                        done();
                        response.status(200).json({ status: 'success', code: 'SA000', isskillkit: results.rows[0].isskillkit, message: 'Skillkit got successfully' });
                    }
                })
            }
        })
    } catch (e) {
        return response.status(200).json({
            code: "SA381",
            status: "failed",
            message: "getskillkit caused exception"
        });
    }
}


const get_skill_detail = (request, response) => {
    const { uid, skid, year_status } = request.body
    var startval = 8 * (skid - 1)
    var endval = (8 * skid) + 1
    var skill_id
    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ code: "SA100", status: "failed", message: "Internal Server Error on getting skillkit games" });
            }
            else {
                client.query('select count(*) from skillangels_usermaxscore \
                where   user_id = $1 and current_year_status = $2 ', [uid, year_status], (error, results) => {
                    if (error) {
                        done();
                        response.status(200).json({ status: 'Failure', code: 'SA438', message: 'Skillangels_usermaxscore count failed' });
                    }
                    else {
                        if (results.rows[0].count % 8 == 0) {
                            client.query('SELECT status FROM public.skillangels_games_cylce_entry where Date(actual_start_date)=\
                            Date( (select actual_start_date from skillangels_games_cylce_entry where user_id =$1  and \
                            event_id =$3  and current_year_status =$2 order by actual_start_date desc LIMIT 1)) \
                            and  user_id =$1 and    event_id =$3 and current_year_status =$2 ', [uid, year_status, 1], (error1, results1) => {
                                if (error) {
                                    done();
                                    response.status(200).json({ status: 'Failure', code: 'SA439', message: 'Skillangels_games_cylce_entry with in the date' });
                                }
                                else {
                                    if (results1.rows[0].status == 1) {

                                        client.query('SELECT count(*) FROM public.skillangels_skillkitgames_cylce_entry where (select getserverdate())<=\
                                            Date( (select actual_end_date from skillangels_skillkitgames_cylce_entry where user_id =$1  and \
                                            event_id =$2  and current_year_status =$3 order by actual_start_date desc LIMIT 1)) \
                                            and  user_id =$1 and    event_id =$2 and current_year_status =$3',
                                            [uid, year_status, 1], (error5, results5) => {
                                                if (error5) {
                                                    done();
                                                    response.status(200).json({ status: 'Failure', code: 'SA440', message: 'Skillangels_games_cylce_entry same date' });
                                                }
                                                else {
                                                    if (results5.rows.count > 0) {
                                                        skill_id = skid - 1;
                                                        startval = 8 * (skill_id - 1)
                                                        endval = (8 * skill_id) + 1
                                                        client.query('select ((sum(max_m_score))/count(max_m_score)) as avg_m_score, \
                                                        ((sum(max_v_score))/count(max_v_score)) as avg_v_score,\
                                                        ((sum(max_f_score))/count(max_f_score)) as avg_f_score, \
                                                        ((sum(max_p_score))/count(max_p_score)) as avg_p_score, \
                                                        ((sum(max_l_score))/count(max_m_score)) as avg_l_score  \
                                                        from ( select ROW_NUMBER () OVER (ORDER BY date) as order_id,* from skillangels_usermaxscore \
                                                        where   user_id = $1 and current_year_status = $4) as newtb \
                                                        where order_id>$2 and order_id<$3', [uid, startval, endval, year_status], (error, results) => {
                                                            if (error) {
                                                                done();
                                                                response.status(200).json({ status: 'Failure', code: 'SA321', message: 'Skillscores for skillkit retrieval failed' });
                                                            }
                                                            else {

                                                                console.log(startval + "results.rows" + endval)
                                                                console.log(results.rows)
                                                                client.query('select skillangels_schoolgrade.medianval,skillangels_schoolgrade.mem_medianval, \
                                                                skillangels_schoolgrade.vp_medianval,skillangels_schoolgrade.fa_medianval,skillangels_schoolgrade.ps_medianval, \
                                                                skillangels_schoolgrade.lin_medianval from skillangels_users join skillangels_schoolgradesections\
                                                                on skillangels_schoolgradesections.id = skillangels_users.section_id and  skillangels_users.id = $1 join skillangels_schoolgrade \
                                                                on skillangels_users.branch_id = skillangels_schoolgrade.branch_id and skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id',
                                                                    [uid], (error1, results1) => {
                                                                        if (error1) {
                                                                            done();
                                                                            response.status(200).json({ status: 'Failure', code: 'SA322', message: 'Medianval retrieval failed' });
                                                                        }
                                                                        else {
                                                                            done();
                                                                            response.status(200).json({ status: 'Success', code: 'SA000', result: results.rows, medianval: results1.rows, message: 'Skillkit status data retrieval successful' });
                                                                        }
                                                                    })
                                                            }
                                                        })
                                                    } else {
                                                        client.query('SELECT count(*) FROM public.skillangels_games_cylce_entry where (select getserverdate())=\
                                                        Date( (select played_end_date from skillangels_games_cylce_entry where user_id =$1  and \
                                                        event_id =$2  and current_year_status =$3 order by actual_start_date desc LIMIT 1)) \
                                                        and  user_id =$1 and    event_id =$2 and current_year_status =$3',
                                                            [uid, year_status, 1], (error8, results8) => {
                                                                if (error8) {
                                                                    done();
                                                                    response.status(200).json({ status: 'Failure', code: 'SA442', message: 'onsameday = date chk query error on checkskilllist lost' });
                                                                }
                                                                else {
                                                                    if (results8.rows.count > 0) {
                                                                        skill_id = skid - 1;
                                                                        startval = 8 * (skill_id - 1)
                                                                        endval = (8 * skill_id) + 1
                                                                        client.query('select ((sum(max_m_score))/count(max_m_score)) as avg_m_score, \
                                                                            ((sum(max_v_score))/count(max_v_score)) as avg_v_score,\
                                                                            ((sum(max_f_score))/count(max_f_score)) as avg_f_score, \
                                                                            ((sum(max_p_score))/count(max_p_score)) as avg_p_score, \
                                                                            ((sum(max_l_score))/count(max_m_score)) as avg_l_score  \
                                                                            from ( select ROW_NUMBER () OVER (ORDER BY date) as order_id,* from skillangels_usermaxscore \
                                                                            where   user_id = $1 and current_year_status = $4) as newtb \
                                                                            where order_id>$2 and order_id<$3', [uid, startval, endval, year_status], (error, results) => {
                                                                            if (error) {
                                                                                done();
                                                                                response.status(200).json({ status: 'Failure', code: 'SA321', message: 'Skillscores for skillkit retrieval failed' });
                                                                            }
                                                                            else {

                                                                                console.log(startval + "results.rows" + endval)
                                                                                console.log(results.rows)
                                                                                client.query('select skillangels_schoolgrade.medianval,skillangels_schoolgrade.mem_medianval, \
                                                                                    skillangels_schoolgrade.vp_medianval,skillangels_schoolgrade.fa_medianval,skillangels_schoolgrade.ps_medianval, \
                                                                                    skillangels_schoolgrade.lin_medianval from skillangels_users join skillangels_schoolgradesections\
                                                                                    on skillangels_schoolgradesections.id = skillangels_users.section_id and  skillangels_users.id = $1 join skillangels_schoolgrade \
                                                                                    on skillangels_users.branch_id = skillangels_schoolgrade.branch_id and skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id',
                                                                                    [uid], (error1, results1) => {
                                                                                        if (error1) {
                                                                                            done();
                                                                                            response.status(200).json({ status: 'Failure', code: 'SA322', message: 'Medianval retrieval failed' });
                                                                                        }
                                                                                        else {
                                                                                            done();
                                                                                            response.status(200).json({ status: 'Success', code: 'SA000', result: results.rows, medianval: results1.rows, message: 'Skillkit status data retrieval successful' });
                                                                                        }
                                                                                    })
                                                                            }
                                                                        })
                                                                    } else {
                                                                        client.query('select ((sum(max_m_score))/count(max_m_score)) as avg_m_score, \
                                                                            ((sum(max_v_score))/count(max_v_score)) as avg_v_score,\
                                                                            ((sum(max_f_score))/count(max_f_score)) as avg_f_score, \
                                                                            ((sum(max_p_score))/count(max_p_score)) as avg_p_score, \
                                                                            ((sum(max_l_score))/count(max_m_score)) as avg_l_score  \
                                                                            from ( select ROW_NUMBER () OVER (ORDER BY date) as order_id,* from skillangels_usermaxscore \
                                                                            where   user_id = $1 and current_year_status = $4) as newtb \
                                                                            where order_id>$2 and order_id<$3', [uid, startval, endval, year_status], (error, results) => {
                                                                            if (error) {
                                                                                done();
                                                                                response.status(200).json({ status: 'Failure', code: 'SA321', message: 'Skillscores for skillkit retrieval failed' });
                                                                            }
                                                                            else {

                                                                                console.log(startval + "results.rows" + endval)
                                                                                console.log(results.rows)
                                                                                client.query('select skillangels_schoolgrade.medianval,skillangels_schoolgrade.mem_medianval, \
                                                                                    skillangels_schoolgrade.vp_medianval,skillangels_schoolgrade.fa_medianval,skillangels_schoolgrade.ps_medianval, \
                                                                                    skillangels_schoolgrade.lin_medianval from skillangels_users join skillangels_schoolgradesections\
                                                                                    on skillangels_schoolgradesections.id = skillangels_users.section_id and  skillangels_users.id = $1 join skillangels_schoolgrade \
                                                                                    on skillangels_users.branch_id = skillangels_schoolgrade.branch_id and skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id',
                                                                                    [uid], (error1, results1) => {
                                                                                        if (error1) {
                                                                                            done();
                                                                                            response.status(200).json({ status: 'Failure', code: 'SA322', message: 'Medianval retrieval failed' });
                                                                                        }
                                                                                        else {
                                                                                            done();
                                                                                            response.status(200).json({ status: 'Success', code: 'SA000', result: results.rows, medianval: results1.rows, message: 'Skillkit status data retrieval successful' });
                                                                                        }
                                                                                    })
                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                            })
                                                    }
                                                }
                                            })
                                    } else {
                                        client.query('select ((sum(max_m_score))/count(max_m_score)) as avg_m_score, \
                                            ((sum(max_v_score))/count(max_v_score)) as avg_v_score,\
                                            ((sum(max_f_score))/count(max_f_score)) as avg_f_score, \
                                            ((sum(max_p_score))/count(max_p_score)) as avg_p_score, \
                                            ((sum(max_l_score))/count(max_m_score)) as avg_l_score  \
                                            from ( select ROW_NUMBER () OVER (ORDER BY date) as order_id,* from skillangels_usermaxscore \
                                            where   user_id = $1 and current_year_status = $4) as newtb \
                                            where order_id>$2 and order_id<$3', [uid, startval, endval, year_status], (error, results) => {
                                            if (error) {
                                                done();
                                                response.status(200).json({ status: 'Failure', code: 'SA321', message: 'Skillscores for skillkit retrieval failed' });
                                            }
                                            else {

                                                console.log(startval + "results.rows" + endval)
                                                console.log(results.rows)
                                                client.query('select skillangels_schoolgrade.medianval,skillangels_schoolgrade.mem_medianval, \
                                                    skillangels_schoolgrade.vp_medianval,skillangels_schoolgrade.fa_medianval,skillangels_schoolgrade.ps_medianval, \
                                                    skillangels_schoolgrade.lin_medianval from skillangels_users join skillangels_schoolgradesections\
                                                    on skillangels_schoolgradesections.id = skillangels_users.section_id and  skillangels_users.id = $1 join skillangels_schoolgrade \
                                                    on skillangels_users.branch_id = skillangels_schoolgrade.branch_id and skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id',
                                                    [uid], (error1, results1) => {
                                                        if (error1) {
                                                            done();
                                                            response.status(200).json({ status: 'Failure', code: 'SA322', message: 'Medianval retrieval failed' });
                                                        }
                                                        else {
                                                            done();
                                                            response.status(200).json({ status: 'Success', code: 'SA000', result: results.rows, medianval: results1.rows, message: 'Skillkit status data retrieval successful' });
                                                        }
                                                    })
                                            }
                                        })

                                    }
                                }
                            })

                        } else {
                            console.log("Entered")
                            client.query('select ((sum(max_m_score))/count(max_m_score)) as avg_m_score, \
                            ((sum(max_v_score))/count(max_v_score)) as avg_v_score,\
                            ((sum(max_f_score))/count(max_f_score)) as avg_f_score, \
                            ((sum(max_p_score))/count(max_p_score)) as avg_p_score, \
                            ((sum(max_l_score))/count(max_m_score)) as avg_l_score  \
                            from ( select ROW_NUMBER () OVER (ORDER BY date) as order_id,* from skillangels_usermaxscore \
                            where   user_id = $1 and current_year_status = $4) as newtb \
                            where order_id>$2 and order_id<$3', [uid, startval, endval, year_status], (error, results) => {
                                if (error) {
                                    done();
                                    response.status(200).json({ status: 'Failure', code: 'SA321', message: 'Skillscores for skillkit retrieval failed' });
                                }
                                else {

                                    console.log(startval + "results.rows" + endval)
                                    console.log(results.rows)
                                    client.query('select skillangels_schoolgrade.medianval,skillangels_schoolgrade.mem_medianval, \
                                    skillangels_schoolgrade.vp_medianval,skillangels_schoolgrade.fa_medianval,skillangels_schoolgrade.ps_medianval, \
                                    skillangels_schoolgrade.lin_medianval from skillangels_users join skillangels_schoolgradesections\
                                    on skillangels_schoolgradesections.id = skillangels_users.section_id and  skillangels_users.id = $1 join skillangels_schoolgrade \
                                    on skillangels_users.branch_id = skillangels_schoolgrade.branch_id and skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id',
                                        [uid], (error1, results1) => {
                                            if (error1) {
                                                done();
                                                response.status(200).json({ status: 'Failure', code: 'SA322', message: 'Medianval retrieval failed' });
                                            }
                                            else {
                                                done();
                                                console.log("coming here ...................")
                                                response.status(200).json({ status: 'Success', code: 'SA000', result: results.rows, medianval: results1.rows, message: 'Skillkit status data retrieval successful' });
                                            }
                                        })
                                }
                            })
                        }
                    }
                })
            }
        })
    } catch (e) {
        return response.status(200).json({
            code: "SA381",
            status: "failed",
            message: "getskillkit caused exception"
        });
    }
}

const check_lost_cycle = (request, response) => {
    const { uid } = request.body
    var year_status = 1;
    var isskillset = 0;
    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ code: "SA100", status: "failed", message: "Internal Server Error on getting skillkit games" });
            }
            else {
                client.query('SELECT status FROM public.skillangels_games_cylce_entry where Date(actual_start_date)=\
                            Date( (select actual_start_date from skillangels_games_cylce_entry where user_id =$1  and \
                            event_id =$3  and current_year_status =$2 order by actual_start_date desc LIMIT 1)) \
                            and  user_id =$1 and    event_id =$3 and current_year_status =$2 ', [uid, 1, 1], (error1, results1) => {
                    if (error1) {
                        done();
                        response.status(200).json({ status: 'Failure', code: 'SA443', message: 'Skillangels_games_cylce_entry status in check_lost_cycle' });
                    }
                    else {
                        if (results1.rows[0].status == 1) {
                            client.query('SELECT count(*) FROM public.skillangels_skillkitgames_cylce_entry where (select getserverdate())<=\
                                Date( (select actual_end_date from skillangels_skillkitgames_cylce_entry where user_id =$1  and \
                                event_id =$2  and current_year_status =$3 order by actual_start_date desc LIMIT 1)) \
                                and  user_id =$1 and    event_id =$2 and current_year_status =$3',
                                [uid, year_status, 1], (error5, results5) => {
                                    if (error5) {
                                        done();
                                        response.status(200).json({ status: 'Failure', code: 'SA444', message: 'Skillangels_games_cylce_entry within the date in check_lost_cycle' });
                                    }
                                    else {
                                        if (results5.rows.count > 0) {
                                            isskillset = 1;
                                            done();
                                            response.status(200).json({ status: 'Success', code: 'SA000', isskillset: isskillset, message: 'Skillkit status data retrieval successful' });

                                        } else {
                                            client.query('SELECT count(*) FROM public.skillangels_games_cylce_entry where (select getserverdate())=\
                                                Date( (select played_end_date from skillangels_games_cylce_entry where user_id =$1  and \
                                                event_id =$2  and current_year_status =$3 order by actual_start_date desc LIMIT 1)) \
                                                and  user_id =$1 and    event_id =$2 and current_year_status =$3',
                                                [uid, year_status, 1], (error8, results8) => {
                                                    if (error8) {
                                                        done();
                                                        response.status(200).json({ status: 'Failure', code: 'SA445', message: 'Skillangels_games_cylce_entry same day in check_lost_cycle' });
                                                    }
                                                    else {
                                                        if (results8.rows.count > 0) {
                                                            isskillset = 1;//skillkit true
                                                            done();
                                                            response.status(200).json({ status: 'Success', code: 'SA000', isskillset: isskillset, message: 'Skillkit status data retrieval successful' });

                                                        } else {
                                                            isskillset = 0;//skillkit false
                                                            done();
                                                            response.status(200).json({ status: 'Success', code: 'SA000', isskillset: isskillset, message: 'Skillkit status data retrieval successful' });

                                                        }
                                                    }
                                                })
                                        }
                                    }
                                })
                        } else {
                            isskillset = 1;
                            done();
                            response.status(200).json({ status: 'Success', code: 'SA000', isskillset: isskillset, message: 'Skillkit status data retrieval successful' });

                        }

                    }
                })

            }
        })
    } catch (e) {
        return response.status(200).json({
            code: "SA441",
            status: "failed",
            message: "getskillkit lost cycle caused exception"
        });
    }
}

module.exports = {
    checkskilllist,
    putskillkitscore,
    getskillkitscore,
    getskillkitgames,
    getskillkitsnd,
    getskillkitquescnt,
    getskillkitorggame,
    checkskillkittoday,
    get_skill_detail,
    check_lost_cycle,
    getgamesstatus
};