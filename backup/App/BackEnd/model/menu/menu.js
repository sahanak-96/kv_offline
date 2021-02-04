const Pool = require('pg').Pool
config = require("../dbconfig");
db = config.database;
const pool = new Pool(db);
//==========================================================================
var changeVal = 1;
var todaysdate = new Date();
var entrycnt = 0;
var dskillcnt = 0;
const getskillkitstatus = (request, response) => {
  const { uid, event_id, skillid, year_status, skillcnt } = request.body;
  try {
    pool.connect((err, client, done) => {
      if (err) {
        done();
        return response.status(200).json({ status: "Failure", code: "SA100", message: "Internal Server Error" });
      }
      else {
        client.query('Select count(user_id) from skillangels_skillkitscore where user_id = $1 \
        and event_id = $2 and skillkit = $3 and current_year_status= $4',
          [uid, event_id, skillid, year_status], (error, results) => {
            if (error) {
              done();
              console.log(error);
              response.status(200).json({ status: 'Failure', code: 'SA057', message: 'Skillkit one time completion check failed' });
            }
            else {
              entrycnt = results.rows[0].count;
              if (results.rows[0].count < skillcnt) {
                done();
                response.status(200).json({ status: 'Success', code: 'SA000', skillkitstatus: 1, msg: 'Skillkit one time completion check successful test1' });
              }
              else {


                client.query('select skillangels_schoolgrade.gradeid from skillangels_schoolgrade \
                INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid  =  \
                skillangels_schoolgrade.id \
            INNER JOIN skillangels_users ON skillangels_users.section_id =  skillangels_schoolgradesections.id  \
                where skillangels_users.id=$1'
                  , [uid], (error, results) => {
                    if (error) {
                      done();
                      response.status(200).json({ status: 'failed', code: 'SA156', message: 'Internal Server Error on query selecting skillkit grade on getskillkitstatus' });
                    }
                    else {
                      if (results.rows[0].gradeid == 1 || results.rows[0].gradeid == 2) {


                        client.query('SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.game_id, \
                              skillangels_gamemaster.skill_id ,skillangels_skillkit_games.grade_id  \
                            as grade_id FROM skillangels_gamemaster  \
                              INNER JOIN skillangels_skillkit_games ON skillangels_skillkit_games.game_id =  \
                              skillangels_gamemaster.game_id \
                              where skillangels_skillkit_games.grade_id=$5\
                            and skillangels_gamemaster.skill_id in \
                              (select skillangels_gamemaster.skill_id as skill_id from skillangels_skillkitscore \
                              INNER JOIN skillangels_gamemaster ON skillangels_gamemaster.game_id = skillangels_skillkitscore.game_id \
                              where user_id = $1 and event_id = $2 and skillkit = $3 and current_year_status=$4 and testtype=$6  \
                              and score < (select skillangels_schoolgrade.medianval from skillangels_users \
                              join skillangels_schoolgradesections \
                              on skillangels_schoolgradesections.id = skillangels_users.section_id \
                              and  skillangels_users.id = $1 join skillangels_schoolgrade \
                              on skillangels_users.branch_id = skillangels_schoolgrade.branch_id  \
                              and skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id)  ) \
                              ORDER BY skillangels_gamemaster.skill_id ASC',
                          [uid, event_id, skillid, year_status, 1, 1], (error, results) => {
                            if (error) {
                              done();
                              console.log(error);
                              response.status(200).json({ status: 'Failure', code: 'SA138', message: 'Skillkit one time completion check failed on query test2' });
                            }
                            else {
                              if (results.rows.length == null) {
                                dskillcnt = Number(skillcnt) + Number(0);
                              }
                              else {
                                dskillcnt = Number(skillcnt) + Number(results.rows.length);
                              }


                              if (entrycnt < dskillcnt) {
                                done();
                                response.status(200).json({ status: 'Success', code: 'SA000', skillkitstatus: 1, msg: 'Skillkit one time completion check successful test2' });
                              }
                              else {

                                client.query('Select count(user_id) from skillangels_skillkitscore where user_id = $1 \
                                    and event_id = $2 and skillkit = $3 and current_year_status= $4 and Date(played_date)=(select getserverdate()) ',
                                  [uid, event_id, skillid, year_status], (error, results) => {
                                    if (error) {
                                      done();
                                      console.log(error);
                                      response.status(200).json({ status: 'Failure', code: 'SA139', message: 'Skillkit one time completion check failed on query test2 daychk' });
                                    }
                                    else {

                                      if (results.rows[0].count > 0) {
                                        done();
                                        response.status(200).json({ status: 'Success', code: 'SA000', skillkitstatus: 1, msg: 'Skillkit one time completion check successful test2 onsameday' });
                                      }
                                      else {
                                        done();
                                        response.status(200).json({ status: 'Success', code: 'SA000', skillkitstatus: 0, msg: 'Skillkit completed test2' });
                                      }
                                    }
                                  })


                              }


                            }
                          })



                      }
                      else {

                        client.query('SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.game_id, \
                              skillangels_gamemaster.skill_id ,skillangels_skillkit_games.grade_id  \
                            as grade_id FROM skillangels_gamemaster  \
                              INNER JOIN skillangels_skillkit_games ON skillangels_skillkit_games.game_id =  \
                              skillangels_gamemaster.game_id \
                              where skillangels_skillkit_games.grade_id in ((select skillangels_schoolgrade.gradeid \
                                                                            from skillangels_schoolgrade \
                                INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = \
                                                                            skillangels_schoolgrade.id \
                            INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id \
                                where skillangels_users.id=$1)-2) \
                            and skillangels_gamemaster.skill_id in \
                              (select skillangels_gamemaster.skill_id as skill_id from skillangels_skillkitscore \
                              INNER JOIN skillangels_gamemaster ON skillangels_gamemaster.game_id = skillangels_skillkitscore.game_id \
                              where user_id = $1 and event_id = $2 and skillkit = $3 and current_year_status=$4 and testtype=$5 \
                              and score < (select skillangels_schoolgrade.medianval from skillangels_users \
                              join skillangels_schoolgradesections \
                              on skillangels_schoolgradesections.id = skillangels_users.section_id \
                              and  skillangels_users.id = $1 join skillangels_schoolgrade \
                              on skillangels_users.branch_id = skillangels_schoolgrade.branch_id  \
                              and skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id)  ) \
                              ORDER BY skillangels_gamemaster.skill_id ASC',
                          [uid, event_id, skillid, year_status, 1], (error, results) => {
                            if (error) {
                              done();
                              console.log(error);
                              response.status(200).json({ status: 'Failure', code: 'SA138', message: 'Skillkit one time completion check failed on query test2' });
                            }
                            else {
                              if (results.rows.length == null) {
                                dskillcnt = Number(skillcnt) + Number(0);
                              }
                              else {
                                dskillcnt = Number(skillcnt) + Number(results.rows.length);
                              }


                              if (entrycnt < dskillcnt) {
                                done();
                                response.status(200).json({ status: 'Success', code: 'SA000', skillkitstatus: 1, msg: 'Skillkit one time completion check successful test2' });
                              }
                              else {

                                client.query('Select count(user_id) from skillangels_skillkitscore where user_id = $1 \
                                    and event_id = $2 and skillkit = $3 and current_year_status= $4 and Date(played_date)=(select getserverdate()) ',
                                  [uid, event_id, skillid, year_status], (error, results) => {
                                    if (error) {
                                      done();
                                      console.log(error);
                                      response.status(200).json({ status: 'Failure', code: 'SA139', message: 'Skillkit one time completion check failed on query test2 daychk' });
                                    }
                                    else {

                                      if (results.rows[0].count > 0) {
                                        done();
                                        response.status(200).json({ status: 'Success', code: 'SA000', skillkitstatus: 1, msg: 'Skillkit one time completion check successful test2 onsameday' });
                                      }
                                      else {
                                        done();
                                        response.status(200).json({ status: 'Success', code: 'SA000', skillkitstatus: 0, msg: 'Skillkit completed test2' });
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

    })
  } catch (e) {
    return response.status(200).json({
      code: "SA120",
      status: "failed",
      message: "getskillkitstatus caused exception"
    });
  }
}


const getTime = (request, response) => {
  const { uid } = request.body;
  // console.log(uid)
  var played_time, assessment_check

  try {
    pool.connect((err, client, done) => {
      if (err) {
        done();
        return response.status(200).json({ status: "failed", message: "Internal Server Error" });
      }
      else {
        client.query('select skillangels_users.played_time ,skillangels_schoolbranch.assessment_check from\
              skillangels_users join skillangels_schoolbranch on skillangels_schoolbranch.id = skillangels_users.branch_id \
              where skillangels_users.id =$1 and skillangels_users.current_year_status = $2', [uid, 1], (error, results) => {
          if (error) {
            done();
            response.status(200).json({ status: 'Failure', code: 'SA056', message: 'Time not get' });
          }
          else {
            done();
            // console.log(results.rows)
            played_time = results.rows[0].played_time;
            assessment_check = results.rows[0].assessment_check;
            //   played_time = 120;
            response.status(200).json({ status: 'success', code: 'SA000', played_time, assessment_check, msg: 'Got time' });
          }
        })
      }
    })
  } catch (e) {
    return response.status(200).json({
      code: "SA120",
      status: "failed",
      message: "getTime caused exception"
    });
  }
}



const setTime = (request, response) => {
  const { uid, currenttime } = request.body;
  // var played_time
  // console.log("uid,currenttime" + uid + " " + currenttime)

  try {
    pool.connect((err, client, done) => {
      if (err) {
        done();
        return response.status(200).json({ status: "failed", message: "Internal Server Error" });
      }
      else {
        client.query('update skillangels_users set played_time=$2 where id=$1', [uid, currenttime], (error, results) => {
          if (error) {
            done();
            // console.log(error)
            response.status(200).json({ status: 'Failure', code: 'SA058', message: 'Time not updated' });
          }
          else {
            done();
            response.status(200).json({ status: 'success', code: 'SA000', msg: 'Time updated' });
          }
        })
      }
    })
  } catch (e) {
    return response.status(200).json({
      code: "SA120",
      status: "failed",
      message: "setTime caused exception"
    });
  }
}

const setdobdata = (request, response) => {
  const { uid, dobdata, year_status } = request.body;

  try {
    pool.connect((err, client, done) => {
      if (err) {
        done();
        return response.status(200).json({
          code: "SA100",
          status: "failed",
          message: "Internal Server Error on settingdobdata"
        });
      } else {
        client.query(
          "UPDATE skillangels_users SET dob_password =$2 where id=$1 and current_year_status=$3",
          [uid, dobdata, year_status],
          (error, results) => {
            if (error) {
              done();
              response.status(200).json({
                status: "Failure",
                code: "SA111",
                message: "Internal Server Error on query updating settingdobdata"
              });
            } else {
              done();
              response.status(200).json({
                status: "Success",
                code: "SA000",
                message: "settingdobdata updating successfully"
              });

            }
          }
        );
      }
    });
  } catch (e) {
    // console.log(e);
    return response.status(200).json({
      code: "SA120",
      status: "failed",
      message: "setdobdata caused exception"
    });
  }
};



const chkinitialcomp = (request, response) => {
  const { uid, event_id, ass_status_id, year_status } = request.body;

  try {
    pool.connect((err, client, done) => {
      if (err) {
        done();
        return response.status(200).json({
          code: "SA100",
          status: "failed",
          message: "Internal Server Error on chkinitialcomp"
        });
      } else {
        client.query(
          "select count(*),(select count(date) as datecnt from skillangels_userscore where user_id=$1 and event_id=$2 and ass_status_id =$3 \
          and current_year_status=$4 and Date(date)=(select getserverdate()) ) from skillangels_userscore where user_id=$1 and event_id=$2 and ass_status_id =$3 \
           and current_year_status=$4",
          [uid, event_id, ass_status_id, year_status],
          (error, results) => {
            if (error) {
              done();
              response.status(200).json({
                status: "Failure",
                code: "SA142",
                message: "Internal Server Error on query selecting initialcompstatus"
              });
            } else {

              if (results.rows[0].count == 5 && results.rows[0].datecnt > 0) {
                done();
                response.status(200).json({
                  status: "Success",
                  code: "SA000",
                  chkinitialcomp: 1,
                  message: "selected initialcompstatus successfully"
                });
              }
              else {
                done();
                response.status(200).json({
                  status: "Success",
                  code: "SA000",
                  chkinitialcomp: 0,
                  message: "selected initialcompstatus count!=5||date!=today successfully"
                });
              }


            }
          }
        );
      }
    });
  } catch (e) {
    // console.log(e);
    return response.status(200).json({
      code: "SA120",
      status: "failed",
      message: "chkinitialcomp caused exception"
    });
  }
};




const chkfbdata = (request, response) => {
  const { uid, year_status } = request.body;

  try {
    pool.connect((err, client, done) => {
      if (err) {
        done();
        return response.status(200).json({
          code: "SA100",
          status: "failed",
          message: "Internal Server Error on chkfbdata"
        });
      } else {
        client.query(
          "select * from skillangels_feedback where user_id=$1 and current_year_status=$2",
          [uid, year_status],
          (error, results) => {
            if (error) {
              done();
              response.status(200).json({
                status: "Failure",
                code: "SA113",
                message: "Internal Server Error on query selecting chkfbdata"
              });
            } else {
              done();
              response.status(200).json({
                status: "Success",
                code: "SA000",
                chkfbdata: results.rows,
                message: "selecting chkfbdata successfull"
              });


            }
          }
        );
      }
    });
  } catch (e) {
    // console.log(e);
    return response.status(200).json({
      code: "SA120",
      status: "failed",
      message: "chkfbdata caused exception"
    });
  }
};

const setfbdata = (request, response) => {
  const { uid, year_status, assexptxt, htpins, protxt, solvetxt, shareexp, desctxt } = request.body;

  try {
    pool.connect((err, client, done) => {
      if (err) {
        done();
        return response.status(200).json({
          code: "SA100",
          status: "failed",
          message: "Internal Server Error on inserting fbdata"
        });
      } else {
        client.query(
          "INSERT INTO skillangels_feedback (user_id,assessment_experience,how_to_play_instruction,about_program,\
            solve_puzzles,share_assessment_experience,description, \
            status,current_year_status) \
          VALUES ($1,$2,$3,$4,$5,$6,$7,1,$8)",
          [uid, assexptxt, htpins, protxt, solvetxt, shareexp, desctxt, year_status],
          (error, results) => {
            if (error) {
              done();
              response.status(200).json({
                status: "Failure",
                code: "SA115",
                message: "Internal Server Error on query inserting fbdata"
              });
            } else {
              done();
              response.status(200).json({
                status: "Success",
                code: "SA000",
                message: "fbdata inserted successfully"
              });


            }
          }
        );
      }
    });
  } catch (e) {
    // console.log(e);
    return response.status(200).json({
      code: "SA120",
      status: "failed",
      message: "setfbdata caused exception"
    });
  }
};

const dayAfterLoginCheck = (request, response) => {
  // const { uid } = request.body;
  const { userid } = request.body
  var isschedule, logincount, daynum, playedtime, assessment_check;
  var addedcrowny = 0;
  // console.log("coming+     " + userid)
  try {
    pool.connect((err, client, done) => {
      if (err) {
        done();
        return response.status(200).json({ status: "failed", message: "Internal Server Error" });
      }
      else {

        client.query('SELECT count(logindate) FROM public.skillangels_loginlog where uid=$1 and \
      current_year_status=$2 and Date(logindate) = (select getserverdate()) ', [userid, 1], (error, results) => {
          if (error) {
            done();
            response.status(200).json({ status: 'Failure', code: 'SA141', message: 'Login check failed after refresh' });
          }
          else {
            if (results.rows[0].count > 0) {
              done();
              response.status(200).json({ status: 'success', code: 'SA140', msg: 'Already loggedin' });
            } else {
              // console.log("count not enter")
              client.query('select skillangels_users.id, skillangels_users.user_name,skillangels_users.dob_password, skillangels_users.name,skillangels_users.password,\
            skillangels_users.branch_id, skillangels_users.section_id, skillangels_users.email, skillangels_users.current_year_status,\
            skillangels_users.selected_lang, skillangels_users.selected_theme, skillangels_users.selected_music, \
            skillangels_users.isskillkit, skillangels_schoolbranch.rank_flag,skillangels_schoolbranch.total_time,skillangels_schoolbranch.assessment_check from skillangels_users join \
            skillangels_schoolbranch on skillangels_schoolbranch.id = skillangels_users.branch_id \
            where skillangels_users.id=$1 and skillangels_users.current_year_status = 1 and\
            skillangels_users.status = 1  ', [userid], (error, results) => {
                if (error) {
                  // console.log("error")
                  // console.log(error)
                  done();
                  response.status(200).json({ status: 'Failure', code: 'SA027', message: 'Username checking failed' });
                }
                else {
                  // console.log("results")
                  // console.log(results.rows)
                  if (results.rows.length == 1) {
                    assessment_check = results.rows[0].assessment_check
                    uid = results.rows[0].id;
                    // bcrypt.compare(password, results.rows[0].password, function (
                    // 	error,
                    // 	passed
                    // ) {
                    // if (passed) {
                    client.query('Insert into skillangels_loginlog(uid, status) values($1, $2)', [uid, 1], (error2, results2) => {
                      if (error2) {
                        // console.log("error2")
                        // console.log(uid)
                        // console.log(error2)
                        done();
                        response.status(200).json({ status: 'Failure', code: 'SA029', message: 'Insertion of log of login failed' });
                      }
                      else {
                        // console.log("results2")
                        // console.log(results2.rows)

                        client.query('Select isskillkit from skillangels_users\
                      where id = $1 and current_year_status = $2  group by isskillkit order by isskillkit desc', [uid, 1], (error11, results11) => {
                          if (error11) {
                            // console.log("error11")
                            // console.log(error11)
                            done();
                            response.status(200).json({ status: 'Failure', code: 'SA114', message: 'Current skillkit retrieval failed in login' });
                          }
                          else {
                            client.query('select table1.noofplay,table1.ass_status_id,table2.dcnt from\
                          (Select count(ass_status_id) as noofplay, ass_status_id,user_id from skillangels_userscore \
                           where user_id = $1 and current_year_status = $3 and event_id =$2 group by \
                           ass_status_id,user_id order by ass_status_id desc) as table1  left join\
                          (select count(date)as dcnt,user_id from skillangels_userscore where user_id = $1 and \
                          current_year_status = $3 and ass_status_id=$4\
                          and event_id =$2 and Date(date)=(select getserverdate())   group by user_id)as table2  on table1.user_id=table2.user_id\
                          order by table1.ass_status_id desc', [uid, 1, 1, 1], (error10, results10) => {
                              if (error10) {
                                // console.log("error10")
                                // console.log(error10)
                                done();
                                response.status(200).json({ status: 'Failure', code: 'SA112', message: 'Current assessment retrieval failed in login' });
                              }
                              else {
                                client.query('select table1.hotscount,table2.sbccount,table3.cyclecnt ,table4.postcount from\
                              (select count(*) as hotscount from skillangels_userscore \
                              where ass_status_id=$3 and Date(date)=(select getserverdate()) and user_id = $1  and \
                              current_year_status = $2 and event_id =$5 ) as  table1 left join\
                              (select count(*) as sbccount from skillangels_userscore \
                              where ass_status_id=$4 and Date(date)=(select getserverdate())  and user_id =$1  and \
                               current_year_status = $2 and event_id =$5 ) as  table2 on 1=1  left join\
                               (select count(*) as cyclecnt from skillangels_userfinishcycle where user_id = $1 and \
                               current_year_status=$2 ) as  table3\
                               on 1=1 left join\
                               (select count(*) as postcount from skillangels_userscore \
                               where ass_status_id=$6 and Date(date)=(select getserverdate())  and user_id =$1  and \
                               current_year_status = $2 and event_id =$5 ) as  table4\
                                on 1=1 ', [uid, 1, 4, 5, 1, 3], (error12, results12) => {
                                  if (error12) {
                                    // console.log(error12)
                                    done();
                                    response.status(200).json({ status: 'Failure', code: 'SA112', message: 'Current assessment retrieval failed in login' });
                                  }
                                  else {


                                    client.query('select table1.det_ass_cnt,table2.user_fin_cnt,table4.det_cnt,table4.pc1_cnt,table4.pc2_cnt from\
                                    (select count(*)as det_ass_cnt from skillangels_userscore where user_id=$1\
                                    and current_year_status =$3 and ass_status_id=$2 and Date(date)=(select getserverdate()) )\
                                    as  table1 left join\
                                    (select count(*)as user_fin_cnt from skillangels_userfinishcycle where user_id=$1\
                                    and current_year_status =$3) as  table2	on 1=1 left join \
                                    (SELECT						sum(  CASE WHEN table3.count >=1 and table3.count <=8 THEN (select count(*) from skillangels_userfinishcycle\
                                                         where user_id=$1 and current_year_status =$3 and (select getserverdate()) <=	(select actual_end_date from \
                                                        skillangels_games_cylce_entry where user_id =$1  and event_id =$4\
                                                        and current_year_status =$3 order by actual_start_date \
                                                        desc LIMIT 1))  END) AS det_cnt,\
                                    sum(  CASE WHEN table3.count >=9 and table3.count <=16 THEN (select count(*) from skillangels_userfinishcycle\
                                                         where user_id=$1 and current_year_status =$3 and (select getserverdate()) <=\
                                                        (select actual_end_date from skillangels_games_cylce_entry where \
                                                        user_id =$1   and event_id =$4\
                                                        and current_year_status =$3 order by actual_start_date \
                                                        desc LIMIT 1))  END) AS pc1_cnt,\
                                    sum(  CASE WHEN table3.count >=17 and table3.count <=24 THEN (select count(*) from skillangels_userfinishcycle\
                                                         where user_id=$1  and current_year_status =$3 and (select getserverdate()) <=\
                                                        (select actual_end_date from skillangels_games_cylce_entry where \
                                                        user_id =$1   and event_id =$4\
                                                        and current_year_status =$3 order by actual_start_date \
                                                        desc LIMIT 1))  END) AS pc2_cnt\
                                    from \
                                    (select count(*) from skillangels_userfinishcycle where user_id=$1 and current_year_status =$3 )as table3) as table4\
                                    on 1=1', [uid, 2, 1, 1], (error14, results14) => {
                                      if (error14) {
                                        console.log(error14)
                                        done();
                                        response.status(200).json({ status: 'Failure', code: 'SA112', message: 'Current assessment retrieval failed in login' });
                                      }
                                      else {
                                        client.query('select count(*) as totgamecyccnt,(select count(*) as withincyccnt from skillangels_games_cylce_entry\
                                        where user_id=$1 and current_year_status =$2 and (select getserverdate()) <=\
                                        (select actual_end_date from skillangels_games_cylce_entry where \
                                        user_id =$1   and event_id =$3\
                                        and current_year_status =$2 order by actual_start_date \
                                        desc LIMIT 1)),(select status from skillangels_games_cylce_entry\
                                        where user_id=$1 and current_year_status =$2 and actual_end_date=\
                                        (select actual_end_date from skillangels_games_cylce_entry where \
                                        user_id =$1   and event_id =$3\
                                        and current_year_status =$2 order by actual_start_date \
                                        desc LIMIT 1)),(select count(*) as todaycyccnt from skillangels_games_cylce_entry\
                                        where user_id=$1 and current_year_status =$2 and (select getserverdate()) =\
                                        (select played_end_date from skillangels_games_cylce_entry where \
                                        user_id =$1   and event_id =$3\
                                        and current_year_status =$2 order by actual_start_date \
                                        desc LIMIT 1)) from skillangels_games_cylce_entry\
                                        where user_id=$1 and current_year_status =$2', [uid, 1, 1], (error15, results15) => {
                                          if (error15) {
                                            console.log(error15)
                                            done();
                                            response.status(200).json({ status: 'Failure', code: 'SA451', message: 'Current assessment retrieval failed in dashboard' });
                                          }
                                          else {
                                        if (results10.rows.length > 0) {
                                          if (changeVal == 0) {
                                            if (results10.rows[0].dcnt > 0) {
                                              curr_assess = 1;
                                            } else if (results10.rows[0].ass_status_id == 1) {
                                              if (results10.rows[0].noofplay < 5) {
                                                // curr_assess = "Initial Assessment";
                                                curr_assess = 1;
                                              }
                                              else {
                                                // curr_assess = "Detailed Assessment";
                                                curr_assess = 2;
                                              }
                                            } else if (results10.rows[0].ass_status_id == 2) {
                                              // if (results11.rows[0].isskillkit == 0) {
                                              // 	// curr_assess = "Detailed Assessment";
                                              // 	curr_assess = 2;
                                              // } else if (results11.rows[0].isskillkit == 1) {
                                              // 	// curr_assess = "Personalized Training C1";
                                              // 	curr_assess = 2;
                                              // } else {
                                              // 	// curr_assess = "HOTS";
                                              // 	curr_assess = 4;
                                              // }
                                              var incrcnt = 0;
                                              if (results15.rows[0].totgamecyccnt >= 8) {
                                                if (results15.rows[0].status == 1) {
                                                  if (results15.rows[0].todaycyccnt == 0) {
                                                    if (results15.rows[0].withincyccnt == 0) {
                                                      if (results15.rows[0].totgamecyccnt == 8) {
                                                        curr_assess = 2;
                                                      } else if (results15.rows[0].totgamecyccnt == 16) {
                                                        curr_assess = 2;
                                                      } else if (results15.rows[0].totgamecyccnt == 24) {
                                                        curr_assess = 4;
                                                      }
                                                    } else {
                                                      incrcnt = 1;
                                                    }
                                                  } else {
                                                    incrcnt = 1;
                                                  }
                                                } else {
                                                  incrcnt = 1;
                                                }
                                              } else {
                                                incrcnt = 1;
                                              }
                                              if (incrcnt == 1) {
                                                if (results14.rows[0].det_cnt) {
                                                  curr_assess = 2;
                                                } else if (results14.rows[0].pc1_cnt) {
                                                  curr_assess = 2;
                                                } else if (results14.rows[0].pc2_cnt) {
                                                  curr_assess = 2;
                                                } else if (results14.rows[0].det_ass_cnt) {
                                                  if (results14.rows[0].user_fin_cnt <= 8) {
                                                    curr_assess = 2;
                                                  } else if (results14.rows[0].user_fin_cnt <= 16) {
                                                    curr_assess = 2;
                                                  } else {
                                                    curr_assess = 2;
                                                  }
                                                } else {
                                                  curr_assess = 4;
                                                }
                                              }
                                            } else if (results10.rows[0].ass_status_id == 3) {
                                              // curr_assess = "Post Assessment";
                                              if (results12.rows[0].sbccount > 0) {
                                                curr_assess = 5;
                                              } else {
                                                curr_assess = 3;
                                              }
                                            } else if (results10.rows[0].ass_status_id == 4) {
                                              // curr_assess = "Personalized Training C2";
                                              if (results12.rows[0].hotscount > 0) {
                                                // curr_assess = "HOTS";
                                                curr_assess = 4;
                                              } else if (results12.rows[0].cyclecnt == 24) {
                                                // curr_assess = "SBC";
                                                curr_assess = 5;
                                              } else {
                                                // curr_assess = "Personalized Training C2";
                                                curr_assess = 2;
                                              }
                                            } else if (results10.rows[0].ass_status_id == 5) {
                                              // curr_assess = "SBC";
                                              if (results12.rows[0].sbccount > 0) {
                                                curr_assess = 5;
                                                //curr_assess = "SBC";
                                              } else if (results10.rows[0].noofplay < 5) {
                                                curr_assess = 5;
                                                //curr_assess = "SBC";
                                              } else {
                                                //curr_assess = 3;
                                                //curr_assess = "Post Assessment";
                                                if (results12.rows[0].postcount > 0) {
                                                  curr_assess = 3;
                                                  //curr_assess = "Post Assessment";
                                                } else {
                                                  for (i = 0; i < results10.rows.length; i++) {
                                                    if (results10.rows[i].ass_status_id == 3) {
                                                      if (results10.rows[i].noofplay < 5) {
                                                        //curr_assess = "Post Assessment";
                                                        curr_assess = 3;
                                                      } else {
                                                        // curr_assess = "Daily Puzzles";
                                                        curr_assess = 6;
                                                      }
                                                    }
                                                  }
                                                }

                                              }
                                            } else {
                                              // curr_assess = "Common Puzzles";
                                              curr_assess = 6;
                                            }
                                          } else if (changeVal == 1) {
                                            if (results10.rows[0].dcnt > 0) {
                                              curr_assess = 1;
                                            } else if (results10.rows[0].ass_status_id == 1) {
                                              if (results10.rows[0].noofplay < 5) {
                                                // curr_assess = "Initial Assessment";
                                                curr_assess = 1;
                                              }
                                              else {
                                                // curr_assess = "Detailed Assessment";
                                                curr_assess = 2;
                                              }
                                            } else if (results10.rows[0].ass_status_id == 2) {
                                              // if (results11.rows[0].isskillkit == 0) {
                                              // 	// curr_assess = "Detailed Assessment";
                                              // 	curr_assess = 2;
                                              // } else if (results11.rows[0].isskillkit == 1) {
                                              // 	// curr_assess = "Personalized Training C1";
                                              // 	curr_assess = 2;
                                              // } else {
                                              // 	if (results12.rows[0].cyclecnt == 24) {
                                              // 		//curr_assess = "Post Assessment";
                                              // 		curr_assess = 3;
                                              // 	} else if (results12.rows[0].postcount > 0) {
                                              // 		curr_assess = 3;
                                              // 		//curr_assess = "Post Assessment";

                                              // 	} else {
                                              // 		curr_assess = 2;
                                              // 		// curr_assess = "Personalized Training C2";
                                              // 	}

                                              // }
                                              var incrcnt = 0;
                                              
                                                if (results15.rows[0].totgamecyccnt >= 8) {                                               
                                                  if (results15.rows[0].status == 1) {
                                                    if (results15.rows[0].todaycyccnt == 0) {
                                                      if (results15.rows[0].withincyccnt == 0) {
                                                        if (results15.rows[0].totgamecyccnt == 8) {                                                         
                                                          curr_assess = 2;
                                                        } else if (results15.rows[0].totgamecyccnt == 16) {
                                                          curr_assess = 2;
                                                        } else if (results15.rows[0].totgamecyccnt == 24) {
                                                          curr_assess = 3;
                                                        } else {
                                                          incrcnt = 1;
                                                        }
                                                      } else {
                                                        incrcnt = 1;
                                                      }
                                                    } else {
                                                      incrcnt = 1;
                                                    }
                                                  } else {
                                                    incrcnt = 1;
                                                  }
                                                } else {
                                                  incrcnt = 1;
                                                }
                                                if (incrcnt == 1) {                                               
                                                  if (results14.rows[0].det_cnt) {
                                                    curr_assess =2;
                                                  } else if (results14.rows[0].pc1_cnt) {
                                                    curr_assess = 2;
                                                  } else if (results14.rows[0].pc2_cnt) {
                                                    curr_assess = 2;
                                                  } else if (results14.rows[0].det_ass_cnt) {
                                                    if (results14.rows[0].user_fin_cnt <= 8) {
                                                      curr_assess = 2;
                                                    } else if (results14.rows[0].user_fin_cnt <= 16) {
                                                      curr_assess = 2;
                                                    } else {
                                                      curr_assess = 2;
                                                    }
                                                  } else {
                                                    curr_assess = 3;
                                                  }
                                                }


                                            } else if (results10.rows[0].ass_status_id == 3) {
                                              if (results10.rows[0].noofplay < 5) {
                                                //curr_assess = "Post Assessment";
                                                curr_assess = 3;
                                              } else {
                                                // curr_assess = "Daily Puzzles";
                                                curr_assess = 6;
                                              }
                                            } else {
                                              // curr_assess = "Common Puzzles";
                                              curr_assess = 6;
                                            }
                                          }
                                        }
                                        else {
                                          //	curr_assess = "Initial Assessment"
                                          curr_assess = 1
                                        }

                                        ////////////
                                        client.query("Select \
              DATE_PART('hour', skillangels_schoolperiod.end_time::time - skillangels_schoolperiod.start_time::time) * 60 +\
              DATE_PART('minute', skillangels_schoolperiod.end_time::time - skillangels_schoolperiod.start_time::time) as duration,\
              DATE_PART('hour', skillangels_schoolperiod.end_time::time - timezone('Asia/Kolkata', current_time(0))::time) * 60 +	\
              DATE_PART('minute', skillangels_schoolperiod.end_time::time - timezone('Asia/Kolkata', current_time(0))::time) as comparedmins\
              from skillangels_users \
              join skillangels_schooltimetable\
              on skillangels_users.branch_id = skillangels_schooltimetable.branchid\
              and skillangels_users.section_id = skillangels_schooltimetable.sectionid\
              join skillangels_schoolperiod\
              on skillangels_schoolperiod.id = skillangels_schooltimetable.periodid\
              where skillangels_users.id = $1 and skillangels_schooltimetable.dayid = extract(dow from current_date)", [uid], (error1, results1) => {
                                          if (error1) {
                                            // console.log("error1")
                                            // console.log(error1)
                                            done();
                                            response.status(200).json({ status: 'Failure', code: 'SA028', message: 'Schedule check failed' });
                                          }
                                          else {
                                            // console.log("results1")
                                            // console.log(results1.rows)

                                            if (results1.rows.length > 0) {
                                              comparedmins = results1.rows[0].comparedmins
                                              duration = results1.rows[0].duration
                                              if (comparedmins > 0 && comparedmins <= duration) {
                                                isschedule = 1;
                                              } else {
                                                isschedule = 0;
                                              }
                                            } else {
                                              isschedule = 0;
                                            }

                                            client.query('Select count(uid) as logincnt from skillangels_loginlog where uid = $1 and logindate = current_date', [uid], (error3, results3) => {
                                              if (error3) {
                                                // console.log("error3")
                                                // console.log(error3)
                                                done();
                                                response.status(200).json({ status: 'Failure', code: 'SA030', message: 'Login count check failed' });
                                              }
                                              else {
                                                // console.log("results3")
                                                // console.log(results3.rows)
                                                logincount = results3.rows[0].logincnt
                                                if (results3.rows[0].logincnt == 1) {
                                                  pool.query("update skillangels_users set played_time = (Select total_time from skillangels_schoolbranch where id = \
                              (select branch_id from skillangels_users where id = $1)) where id = $1 returning played_time",
                                                    [uid], (error9, results9) => {
                                                      if (error9) {
                                                        // console.log("error9")
                                                        // console.log(error9)
                                                        done();
                                                        response.status(200).json({ status: 'Failure', code: 'SA035', message: 'Crowny log insertion failed' });
                                                      }
                                                      else {
                                                        // console.log("results9")
                                                        playedtime = results9.rows[0].played_time;
                                                        if (curr_assess == 2) {
                                                          if (isschedule == 1) {
                                                            addedcrowny = addedcrowny + 1;
                                                          }
                                                          // else if (isschedule == 0) {
                                                            pool.query("select timezone('Asia/Kolkata', current_time(0))::time, DATE_PART('hour', \
                              timezone('Asia/Kolkata', current_time(0))::time) as hourr,\
            (DATE_PART('hour', timezone('Asia/Kolkata', current_time(0))::time) >18 and DATE_PART('hour', timezone('Asia/Kolkata', current_time(0))::time)<24) or\
            (DATE_PART('hour', timezone('Asia/Kolkata', current_time(0))::time)>0 and DATE_PART('hour', timezone('Asia/Kolkata', current_time(0))::time)<6 ) as istime, \
            extract(dow from current_date) as daynum",
                                                              (error7, results7) => {
                                                                if (error7) {
                                                                  console.log("error7")
                                                                  console.log(error7)
                                                                  done();
                                                                  response.status(200).json({ status: 'Failure', code: 'SA030', message: 'Crowny scenario checking failed' });
                                                                }
                                                                else {
                                                                  console.log("results7")
                                                                  console.log(results7.rows)
                                                                  istime = results7.rows[0].istime;

                                                                  if (istime == true) {
                                                                    addedcrowny = addedcrowny + 5
                                                                  }

                                                                  daynum = results7.rows[0].daynum;
                                                                  if (daynum == 6 || daynum == 7) {
                                                                    addedcrowny = addedcrowny + 10
                                                                  }

                                                                  if (istime == false && (daynum != 6 || daynum != 7)) {
                                                                    addedcrowny = addedcrowny + 5
                                                                  }
                                                                  pool.query('Select count(user_id) from skillangels_usertotalvalue where user_id = $1 and current_year_status = $2', [uid, 1], (error4, results4) => {
                                                                    if (error4) {
                                                                      console.log("error4")
                                                                      console.log(error4)
                                                                      done();
                                                                      response.status(200).json({ status: 'Failure', code: 'SA035', message: 'Crowny log insertion failed' });
                                                                    }
                                                                    else {
                                                                      console.log("results4")
                                                                      console.log(results4.rows)
                                                                      if (results4.rows[0].count == 0) {
                                                                        pool.query('Insert into skillangels_usertotalvalue(user_id, totalcrowny, date)\
                                          values($1, $2, current_timestamp)', [uid, addedcrowny], (error5, results5) => {
                                                                          if (error5) {
                                                                            console.log("error5")

                                                                            done();
                                                                            console.log(error5)
                                                                            response.status(200).json({ status: 'Failure', code: 'SA035', message: 'Total crowny insertion failed' });
                                                                          }
                                                                          else {
                                                                            pool.query("Insert into skillangels_crownylog(uid, crowny, status, reason) \
                                        values($1, $2, -1, 'First login')",
                                                                              [uid, addedcrowny], (error6, results6) => {
                                                                                if (error6) {
                                                                                  console.log("error6")
                                                                                  console.log(error6)
                                                                                  done();
                                                                                  response.status(200).json({ status: 'Failure', code: 'SA035', message: 'Crowny log insertion failed' });
                                                                                }
                                                                                else {
                                                                                  console.log("results6")
                                                                                  done();
                                                                                  console.log(addedcrowny)
                                                                                  response.status(200).json({ status: 'Success', code: 'SA000', playedtime: playedtime, assessment_check: assessment_check, curr_assess: curr_assess, result: results.rows, logincount: logincount, isschedule: isschedule, message: 'Login successful' });
                                                                                }
                                                                              })
                                                                          }
                                                                        })
                                                                      }
                                                                      else {
                                                                        pool.query('Select totalcrowny from skillangels_usertotalvalue where user_id = $1 and current_year_status = $2', [uid, 1], (error6, results6) => {
                                                                          if (error6) {
                                                                            console.log("error6")
                                                                            console.log(error6)
                                                                            done();
                                                                            response.status(200).json({ status: 'Failure', code: 'SA035', message: 'Crowny log insertion failed' });
                                                                          }
                                                                          else {
                                                                            actualcrowny = results6.rows[0].totalcrowny + addedcrowny
                                                                            pool.query('update skillangels_usertotalvalue set totalcrowny = $1, date = current_date where user_id = $2',
                                                                              [actualcrowny, uid], (error7, results7) => {
                                                                                if (error7) {
                                                                                  console.log("error7")
                                                                                  console.log(error7)
                                                                                  done();
                                                                                  response.status(200).json({ status: 'Failure', code: 'SA035', message: 'Total crowny updation failed' });
                                                                                }
                                                                                else {
                                                                                  pool.query("Insert into skillangels_crownylog(uid, crowny, status, reason) \
                                                  values($1, $2, -1, 'First login')",
                                                                                    [uid, addedcrowny], (error8, results8) => {
                                                                                      if (error8) {
                                                                                        console.log("error8")
                                                                                        console.log(error8)
                                                                                        done();
                                                                                        response.status(200).json({ status: 'Failure', code: 'SA035', message: 'Crowny log insertion failed' });
                                                                                      }
                                                                                      else {
                                                                                        console.log("results8")
                                                                                        console.log(addedcrowny)
                                                                                        done();
                                                                                        response.status(200).json({ status: 'Success', playedtime: playedtime, assessment_check: assessment_check, curr_assess: curr_assess, code: 'SA000', result: results.rows, logincount: logincount, isschedule: isschedule, message: 'Login successful' });
                                                                                      }
                                                                                    })
                                                                                }
                                                                              })
                                                                          }
                                                                        })

                                                                      }


                                                                    }
                                                                  })
                                                                }
                                                              })
                                                          // }
                                                        }
                                                        else {
                                                          done();
                                                          response.status(200).json({ status: 'Success', code: 'SA000', playedtime: playedtime, assessment_check: assessment_check, curr_assess: curr_assess, result: results.rows, logincount: logincount, isschedule: isschedule, message: 'Login successful' });
                                                        }

                                                      }
                                                    })
                                                } else {
                                                  done();
                                                  response.status(200).json({ status: 'Success', code: 'SA000', playedtime: playedtime, assessment_check: assessment_check, curr_assess: curr_assess, result: results.rows, logincount: logincount, isschedule: isschedule, message: 'Login successful' });
                                                }
                                              }
                                            })
                                          }
                                        })//////////////////
                                      }
                                    })
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          }
                        })
                      }
                    })

                  } else {
                    console.log("elsee")
                    done();
                    response.status(200).json({ status: 'Failure', code: 'SA001', result: results.rows, message: 'Login failed' });
                  }
                }////////////////
              })

            }
          }
        })

        ////////
        //////////////
      }
    })
  } catch (e) {
    return response.status(200).json({
      code: "SA120",
      status: "failed",
      message: "dayAfterLoginCheck caused exception"
    });
  }
};


const getsession = (request, response) => {
  const { uid } = request.body
  // console.log(request.body)
  try {
    pool.connect((err, client, done) => {
      if (err) {
        done();
        return response.status(200).json({ code: "SA100", status: "failed", message: "Internal Server Error" });
      }
      else {

        client.query('SELECT current_session_id  FROM public.skillangels_users where id= $1', [uid], (error, results) => {
          if (error) {
            // console.log(error)
            done();
            response.status(200).json({ status: 'Failure', code: 'SA159', message: 'Failed to get session id' });
          }
          else {
            done();
            // console.log(results.rows)
            response.status(200).json({ status: 'Success', code: 'SA000', current_session_id: results.rows[0].current_session_id, message: 'Session id got successful' });
          }
        })

      }
    })
  } catch (e) {
    console.log(e)
    return response.status(200).json({
      code: "SA160",
      status: "failed",
      message: "Get session id exception in report"
    });
  }
}

const session_close = (request, response) => {
  const { uid } = request.body
  // console.log(request.body)
  try {
    pool.connect((err, client, done) => {
      if (err) {
        done();
        return response.status(200).json({ code: "SA100", status: "failed", message: "Internal Server Error" });
      }
      else {

        client.query('UPDATE skillangels_users SET current_session_id = NULL WHERE id= $1', [uid], (error, results) => {
          if (error) {
            // console.log(error)
            done();
            response.status(200).json({ status: 'Failure', code: 'SA376', message: 'Failed to update session id in logout' });
          }
          else {
            done();
            // console.log(results.rows)
            response.status(200).json({ status: 'Success', code: 'SA000',  message: 'Session id updated successful' });
          }
        })

      }
    })
  } catch (e) {
    console.log(e)
    return response.status(200).json({
      code: "SA377",
      status: "failed",
      message: "Update session id exception in report"
    });
  }
}

const getmedval = (request, response) => {
  const { uid, eid, year_status } = request.body;

  try {
    pool.connect((err, client, done) => {
      if (err) {
        done();
        return response.status(200).json({
          code: "SA100",
          status: "failed",
          message: "Internal Server Error on getmedval"
        });
      } else {
        client.query(
          "select skillangels_schoolgrade.medianval,skillangels_schoolgrade.mem_medianval, \
          skillangels_schoolgrade.vp_medianval, \
          skillangels_schoolgrade.fa_medianval,skillangels_schoolgrade.ps_medianval, \
          skillangels_schoolgrade.lin_medianval from skillangels_users \
            join skillangels_schoolgradesections \
            on skillangels_schoolgradesections.id = skillangels_users.section_id \
            and  skillangels_users.id = $1 join skillangels_schoolgrade \
            on skillangels_users.branch_id = skillangels_schoolgrade.branch_id  \
            and skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id",
          [uid],
          (error, results) => {
            if (error) {
              done();
              response.status(200).json({
                status: "Failure",
                code: "SA111",
                message: "Internal Server Error on query selecting getmedval"
              });
            } else {
              done();
              response.status(200).json({
                status: "Success",
                code: "SA000",
                medval: results.rows,
                message: "getmedval selected successfully"
              });

            }
          }
        );
      }
    });
  } catch (e) {
    // console.log(e);
    return response.status(200).json({
      code: "SA120",
      status: "failed",
      message: "getmedval caused exception"
    });
  }
};

module.exports = {
  getTime,
  setTime,
  getskillkitstatus,
  setdobdata,
  chkfbdata,
  setfbdata,
  dayAfterLoginCheck,
  chkinitialcomp,
  getsession,
  session_close,
  getmedval
}
