const Pool = require('pg').Pool
config = require("../dbconfig");
db = config.database;
const pool = new Pool(db);
const bcrypt = require("bcryptjs")
//====================================================================================================
var today = new Date();
const getsbcScore = (request, response) => {
    const { uid, eid, ass_status, year_status } = request.body;

    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ code: "SA100", status: "failed", message: "Internal Server Error on selecting sbc Score" });
            }
            else {

                client.query('SELECT sum(skillangels_userscore.score),count(skillangels_userscore.score), \
				skillangels_userscore.game_id,skillangels_gamemaster.skill_id as skillid FROM skillangels_userscore \
			INNER JOIN skillangels_gamemaster ON skillangels_gamemaster.game_id = skillangels_userscore.game_id \
			where user_id=$1 and event_id=$2 and ass_status_id=$3 and current_year_status=$4 \
			 GROUP BY skillangels_userscore.game_id,skillangels_gamemaster.skill_id \
			 ORDER BY skillangels_gamemaster.skill_id ASC ', [uid, eid, ass_status, year_status], (error, results) => {
                    if (error) {
                        done();
                        response.status(200).json({ status: 'failed', code: 'SA103', message: 'Internal Server Error on query selecting sbc Score' });
                    }
                    else {
                        console.log(results.rows)
                        done();
                        response.status(200).json({ status: 'Success', code: 'SA000', getsbcScore: results.rows, message: 'sbc score retrieval successful' });
                    }
                })

            }
        })

    } catch (e) {
        console.log(e)
        return response.status(200).json({
            code: "SA120",
            status: "failed",
            message: "getsbcScore caused exception"
            });
    }
}



const getsbcgame = (request, response) => {
    const { uid, eid, year_status } = request.body
    try {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ code: "SA100", status: "failed", message: "Internal Server Error on getting sbc games" });
            }
            else {

                client.query('SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.game_id,\
                skillangels_gamemaster.skill_id ,skillangels_sbc_game.grade_id \
                as grade_id FROM skillangels_gamemaster \
                  INNER JOIN skillangels_sbc_game ON skillangels_sbc_game.game_id = skillangels_gamemaster.game_id \
                 where skillangels_sbc_game.grade_id in (select skillangels_schoolgrade.gradeid from skillangels_schoolgrade \
                    INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
                INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
                    where skillangels_users.id=$1) \
                ORDER BY skillangels_gamemaster.skill_id ASC', [uid], (error, results) => {
                    if (error) {
                        done();
                        response.status(200).json({ status: 'failed', code: 'SA098', message: 'Internal Server Error on query selecting sbc games' });
                    }
                    else {
                        if (results.rows.length > 0) {
                            done();
                            response.status(200).json({ status: 'Success', code: 'SA000', getsbcgame: results.rows, message: 'sbc games retrieval successful' });
                        }
                        else {
                            done();
                            response.status(200).json({ status: 'failed', code: 'SA099', getsbcgame: "", message: 'sbc games not found' });
                        }


                    }
                })


            }
        })
    }
    catch (e) {
        console.log(e)
        return response.status(200).json({
            code: "SA120",
            status: "failed",
            message: "getsbcgame caused exception"
            });
    }
}

const getsbcsnd = (request, response) => {
    const { uid, year_status } = request.body;

    try{
        pool.connect((err, client, done) => {
            if (err) {
                done();
                return response.status(200).json({ status: "failed", code: 'SA100', message: "Internal Server Error on selecting getsnd" });
            }
            else {

                client.query('select * from skillangels_users where id=$1 and current_year_status=$2 ', [uid, year_status],
                    (error, results) => {
                        if (error) {
                            console.log("error")
                            done();
                            return response.status(200).json({ status: "failed", code: 'SA119', message: "Internal Server Error on query selecting getsnd sbc" });
                        }
                        else {
                            console.log(results.rows)
                            done();
                            return response.status(200).json({ status: 'success', code: 'SA000', getsbcsnd: results.rows, message: "getsnd Selected Successfully" });

                        }
                    })
            }
        })
    }catch(e)
    {
        return response.status(200).json({
            code: "SA120",
            status: "failed",
            message: "getsbcsnd caused exception"
            });
    }
}

const gesbcquescnt = (request, response) => {
    const { uid, eid, ass_status, year_status } = request.body;

    try{
        pool.connect((err, client, done) => {
            if (err) {

                done();
                return response.status(200).json({ status: "failed", code: 'SA100', message: "Internal Server Error on selecting gamesquescnt for sbc" });
            }
            else {

                client.query('select count(skillangels_gameques_entry.game_id),skillangels_gamemaster.skill_id \
                from skillangels_gameques_entry \
                INNER JOIN skillangels_gamemaster ON skillangels_gamemaster.game_id = skillangels_gameques_entry.game_id \
                where user_id=$1 \
                and event_id=$2 and ass_status_id=$3 and current_year_status=$4  \
                group by skillangels_gameques_entry.game_id,skillangels_gamemaster.skill_id \
                ORDER BY skillangels_gamemaster.skill_id ASC ', [uid, eid, ass_status, year_status],
                    (error, results) => {
                        if (error) {
                            console.log("error")
                            done();
                            return response.status(200).json({ status: "failed", code: 'SA108', message: "Internal Server Error on query selecting gamesquescnt ass5" });
                        }
                        else {
                            console.log(results.rows)
                            done();
                            return response.status(200).json({ status: 'success', code: 'SA000', gesbcquescnt: results.rows, message: "gamesquescnt Selected Successfully ass5" });

                        }
                    })
            }
        })
    }catch(e){
        return response.status(200).json({
            code: "SA120",
            status: "failed",
            message: "gesbcquescnt caused exception"
            });
    }
}






module.exports = {
    getsbcScore,
    getsbcgame,
    getsbcsnd,
    gesbcquescnt
};