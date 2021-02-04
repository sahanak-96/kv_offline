const Pool = require("pg").Pool;
config = require("../dbconfig");
db = config.database;
const pool = new Pool(db);
var changeVal = 1;
//====================================================================================================
//data to fill dashboard boxes
const getDashData = (request, response) => {
  const { uid, eid } = request.body;
  const status = 1;
  var curr_assess;
  try {
    pool.connect((err, client, done) => {
      if (err) {
        done();
        return response.status(200).json({
          code: "SA100",
          status: "failed",
          message: "Internal Server Error"
        });
      } else {
        client.query(
          "Select skillangels_users.id, sum(skillangels_userscore.score) as totalscore,  totalcrowny, \
          skillangels_users.isskillkit from skillangels_users join skillangels_userscore\
          on skillangels_users.id = skillangels_userscore.user_id and skillangels_userscore.event_id = $3 and \
          skillangels_userscore.ass_status_id = $2 join (select skillangels_usertotalvalue.totalcrowny\
          as totalcrowny, user_id FROM skillangels_usertotalvalue \
          join skillangels_users on skillangels_users.id = skillangels_usertotalvalue.user_id)RANKVAL ON \
          RANKVAL.user_id = $1 where skillangels_users.id = $1\
          and skillangels_users.current_year_status = 1 group by skillangels_users.id,\
          skillangels_users.isskillkit, skillangels_users.branch_id, RANKVAL.totalcrowny",
          [uid, status, eid],
          (error, results) => {
            if (error) {
              done();
              response.status(200).json({
                status: "Failure",
                code: "SA016",
                message: "Dashboard data retrieval failed"
              });
            } else {
              console.log("entering dashhhhh");
              client.query(
                'select table1.rank,table1.user_id from \
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
                               group by user_name,id) as table2   on table1.user_id=table2.id order by rank',
                [uid, 1, eid, 1],
                (error2, results2) => {
                  if (error2) {
                    done();
                    response.status(200).json({
                      status: "Failure",
                      code: "SA117",
                      message: "Rank retrieval failed"
                    });
                  } else {
                    for (i = 0; i < results2.rows.length; i++) {
                      if (results2.rows[i].user_id == uid) {
                        rank = results2.rows[i].rank;
                        console.log("rank" + rank)
                      }
                    }
                    if (results.rows.length > 0) {
                      client.query('Select isskillkit from skillangels_users\
                      where id = $1 and current_year_status = $2  group by isskillkit order by isskillkit desc', [uid, 1], (error11, results11) => {
                        if (error11) {
                          console.log("error11")
                          console.log(error11)
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
                              console.log("error10")
                              console.log(error10)
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
                                  console.log(error12)
                                  done();
                                  response.status(200).json({ status: 'Failure', code: 'SA112', message: 'Current assessment retrieval failed in login' });
                                }
                                else {
                                  client.query('select table1.det_ass_cnt,table2.user_fin_cnt,table4.det_cnt,table4.pc1_cnt,table4.pc2_cnt from\
                                  (select count(*)as det_ass_cnt from skillangels_userscore where user_id=$1\
                                  and current_year_status =$3 and ass_status_id=$2 and Date(date)=(select getserverdate()) )\
                                  as  table1 left join\
                                  (select count(*)as user_fin_cnt from skillangels_games_cylce_entry where user_id=$1\
                                  and current_year_status =$3) as  table2	on 1=1 left join \
                                  (SELECT						sum(  CASE WHEN table3.count >=1 and table3.count <=8 THEN (select count(*) from skillangels_games_cylce_entry\
                                                       where user_id=$1 and current_year_status =$3 and (select getserverdate()) <=	(select actual_end_date from \
                                                      skillangels_games_cylce_entry where user_id =$1  and event_id =$4\
                                                      and current_year_status =$3 order by actual_start_date \
                                                      desc LIMIT 1))  END) AS det_cnt,\
                                  sum(  CASE WHEN table3.count >=9 and table3.count <=16 THEN (select count(*) from skillangels_games_cylce_entry\
                                                       where user_id=$1 and current_year_status =$3 and (select getserverdate()) <=\
                                                      (select actual_end_date from skillangels_games_cylce_entry where \
                                                      user_id =$1   and event_id =$4\
                                                      and current_year_status =$3 order by actual_start_date \
                                                      desc LIMIT 1))  END) AS pc1_cnt,\
                                  sum(  CASE WHEN table3.count >=17 and table3.count <=24 THEN (select count(*) from skillangels_games_cylce_entry\
                                                       where user_id=$1  and current_year_status =$3 and (select getserverdate()) <=\
                                                      (select actual_end_date from skillangels_games_cylce_entry where \
                                                      user_id =$1   and event_id =$4\
                                                      and current_year_status =$3 order by actual_start_date \
                                                      desc LIMIT 1))  END) AS pc2_cnt\
                                  from \
                                  (select count(*) from skillangels_games_cylce_entry where user_id=$1 and current_year_status =$3 )as table3) as table4\
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
                                                  curr_assess = "Initial Assessment";
                                                  // curr_assess = 1;
                                                }
                                                else {
                                                  curr_assess = "Detailed Assessment";
                                                  // curr_assess = 2;
                                                }
                                              } else if (results10.rows[0].ass_status_id == 2) {
                                                // if (results11.rows[0].isskillkit == 0) {
                                                //   curr_assess = "Detailed Assessment";
                                                //   // curr_assess = 2;
                                                // } else if (results11.rows[0].isskillkit == 1) {
                                                //   curr_assess = "Personalized Training C1";
                                                //   // curr_assess = 2;
                                                // } else {
                                                //   curr_assess = "HOTS";
                                                //   // curr_assess = 4;
                                                // }
                                                var incrcnt = 0;
                                                if (results15.rows[0].totgamecyccnt >= 8) {
                                                  if (results15.rows[0].status == 1) {
                                                    if (results15.rows[0].todaycyccnt == 0) {
                                                      if (results15.rows[0].withincyccnt == 0) {
                                                        if (results15.rows[0].totgamecyccnt == 8) {
                                                          curr_assess = "Personalized Training C1";
                                                        } else if (results15.rows[0].totgamecyccnt == 16) {
                                                          curr_assess = "Personalized Training C2";
                                                        } else if (results15.rows[0].totgamecyccnt == 24) {
                                                          curr_assess = "HOTS";
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
                                                    curr_assess = "Detailed Assessment";
                                                  } else if (results14.rows[0].pc1_cnt) {
                                                    curr_assess = "Personalized Training C1";
                                                  } else if (results14.rows[0].pc2_cnt) {
                                                    curr_assess = "Personalized Training C2";
                                                  } else if (results14.rows[0].det_ass_cnt) {
                                                    if (results14.rows[0].user_fin_cnt <= 8) {
                                                      curr_assess = "Detailed Assessment";
                                                    } else if (results14.rows[0].user_fin_cnt <= 16) {
                                                      curr_assess = "Personalized Training C1";
                                                    } else {
                                                      curr_assess = "Personalized Training C2";
                                                    }
                                                  } else {
                                                    curr_assess = "HOTS";
                                                  }
                                                }
                                              } else if (results10.rows[0].ass_status_id == 3) {
                                                // curr_assess = "Post Assessment";
                                                if (results12.rows[0].sbccount > 0) {
                                                  // curr_assess = 5;
                                                  curr_assess = "SBC";
                                                } else {
                                                  // curr_assess = 3;
                                                  curr_assess = "Post Assessment";
                                                }
                                              } else if (results10.rows[0].ass_status_id == 4) {
                                                // curr_assess = "Personalized Training C2";
                                                if (results12.rows[0].hotscount > 0) {
                                                  curr_assess = "HOTS";
                                                  // curr_assess = 4;
                                                } else if (results12.rows[0].cyclecnt == 24) {
                                                  curr_assess = "SBC";
                                                  // curr_assess = 5;
                                                } else {
                                                  curr_assess = "Personalized Training C2";
                                                  // curr_assess = 2;
                                                }

                                              } else if (results10.rows[0].ass_status_id == 5) {

                                                if (results12.rows[0].sbccount > 0) {
                                                  // curr_assess = 5;
                                                  curr_assess = "SBC";
                                                } else if (results10.rows[0].noofplay < 5) {
                                                  // curr_assess = 5;
                                                  curr_assess = "SBC";
                                                } else {
                                                  //curr_assess = 3;
                                                  //curr_assess = "Post Assessment";
                                                  if (results12.rows[0].postcount > 0) {
                                                    // curr_assess = 3;
                                                    curr_assess = "Post Assessment";
                                                  } else {
                                                    for (i = 0; i < results10.rows.length; i++) {
                                                      if (results10.rows[i].ass_status_id == 3) {
                                                        if (results10.rows[i].noofplay < 5) {
                                                          curr_assess = "Post Assessment";
                                                          // curr_assess = 3;
                                                        } else {
                                                          curr_assess = "Daily Puzzles";
                                                          // curr_assess = 6;
                                                        }
                                                      }
                                                    }
                                                  }

                                                }
                                              } else {
                                                curr_assess = "Daily Puzzles";
                                                // curr_assess = 6;
                                              }
                                              done();
                                              response.status(200).json({
                                                status: "Success",
                                                code: "SA000",
                                                curr_assess: curr_assess,
                                                result: results.rows,
                                                rank: rank,
                                                message: "Dashboard data retrieval successful"
                                              });
                                            } else if (changeVal == 1) {
                                              if (results10.rows[0].dcnt > 0) {
                                                curr_assess = "Initial Assessment";
                                              } else if (results10.rows[0].ass_status_id == 1) {
                                                if (results10.rows[0].noofplay < 5) {
                                                  curr_assess = "Initial Assessment";
                                                  // curr_assess = 1;
                                                }
                                                else {
                                                  curr_assess = "Detailed Assessment";
                                                  // curr_assess = 2;
                                                }
                                              } else if (results10.rows[0].ass_status_id == 2) {
                                                // if (results11.rows[0].isskillkit == 0) {
                                                //   curr_assess = "Detailed Assessment";
                                                //   // curr_assess = 2;
                                                // } else if (results11.rows[0].isskillkit == 1) {
                                                //   curr_assess = "Personalized Training C1";
                                                //   // curr_assess = 2;
                                                // } else {
                                                //   if (results12.rows[0].cyclecnt == 24) {
                                                //     curr_assess = "Post Assessment";
                                                //     // curr_assess = 3;
                                                //   } else if (results12.rows[0].postcount > 0) {
                                                //     // curr_assess = 3;
                                                //     curr_assess = "Post Assessment";

                                                //   } else {
                                                //     // curr_assess = 2;
                                                //     curr_assess = "Personalized Training C2";
                                                //  }
                                                var incrcnt = 0;
                                              
                                                if (results15.rows[0].totgamecyccnt >= 8) {                                               
                                                  if (results15.rows[0].status == 1) {
                                                    if (results15.rows[0].todaycyccnt == 0) {
                                                      if (results15.rows[0].withincyccnt == 0) {
                                                        if (results15.rows[0].totgamecyccnt == 8) {                                                         
                                                          curr_assess = "Personalized Training C1";
                                                        } else if (results15.rows[0].totgamecyccnt == 16) {
                                                          curr_assess = "Personalized Training C2";
                                                        } else if (results15.rows[0].totgamecyccnt == 24) {
                                                          curr_assess = "Post Assessment";
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
                                                    curr_assess = "Detailed Assessment";
                                                  } else if (results14.rows[0].pc1_cnt) {
                                                    curr_assess = "Personalized Training C1";
                                                  } else if (results14.rows[0].pc2_cnt) {
                                                    curr_assess = "Personalized Training C2";
                                                  } else if (results14.rows[0].det_ass_cnt) {
                                                    if (results14.rows[0].user_fin_cnt <= 8) {
                                                      curr_assess = "Detailed Assessment";
                                                    } else if (results14.rows[0].user_fin_cnt <= 16) {
                                                      curr_assess = "Personalized Training C1";
                                                    } else {
                                                      curr_assess = "Personalized Training C2";
                                                    }
                                                  } else {
                                                    curr_assess = "Post Assessment";
                                                  }
                                                }

                                              } else if (results10.rows[0].ass_status_id == 3) {
                                                if (results10.rows[0].noofplay < 5) {
                                                  curr_assess = "Post Assessment";
                                                  //curr_assess = 3;
                                                } else {
                                                  curr_assess = "Daily Puzzles";
                                                  // curr_assess = 6;
                                                }
                                              } else {
                                                curr_assess = "Daily Puzzles";
                                                // curr_assess = 6;
                                              }
                                              done();
                                              response.status(200).json({
                                                status: "Success",
                                                code: "SA000",
                                                curr_assess: curr_assess,
                                                result: results.rows,
                                                rank: rank,
                                                message: "Dashboard data retrieval successful"
                                              });
                                            }

                                          }

                                          else {
                                            done();
                                            response.status(200).json({
                                              status: "Success",
                                              code: "SA000",
                                              curr_assess: "Initial Assessment",
                                              result: results.rows,
                                              rank: rank,
                                              message: "Dashboard data retrieval successful"
                                            });
                                          }
                                          //////////////////////////
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

                    else {
                      done();
                      response.status(200).json({
                        status: "Success",
                        code: "SA000",
                        curr_assess: "Initial Assessment",
                        result: results.rows,
                        rank: rank,
                        message: "Dashboard data retrieval successful"
                      });
                    }/////////////
                  }
                })
              //////////////////

            }
          }
        );
      }
    });
  } catch (e) {
    console.log(e);
    return response.status(200).json({
      code: "SA120",
      status: "failed",
      message: "getDashData caused exception"
    });
  }
};



const getScoreData = (request, response) => {
  const { uid, eid, year_status, selDate } = request.body;
  try {
    pool.connect((err, client, done) => {
      if (err) {
        done();
        return response.status(200).json({
          code: "SA100",
          status: "failed",
          message: "Internal Server Error"
        });
      } else {
        client.query(
          "select ass_status_id from skillangels_userscore where user_id=$1 and event_id=$2\
         and current_year_status=$3 and Date(date) = Date($4)",
          [uid, eid, year_status, selDate],
          (error, results) => {
            if (error) {
              done();
              response.status(200).json({
                status: "failed",
                code: "SA017",
                message: "Dailyplanner ass_status_id query failed"
              });
            } else {
              if (results.rows.length == 0) {
                console.log(results.rows);
                done();
                response.status(200).json({
                  status: 'success', code: 'SA000',
                  todaysPlayVal: 0, message: 'Dailyplanner no game played on this day'
                });
              }
              else {
                console.log(results.rows[0].ass_status_id);
                if (results.rows[0].ass_status_id == 1 || results.rows[0].ass_status_id == 2 ||
                  results.rows[0].ass_status_id == 3 || results.rows[0].ass_status_id == 6) {
                  client.query(
                    "SELECT max(skillangels_userscore.score) as avgscore, \
                    sum(skillangels_userscore.ansquescnt) as ansquescnt ,\
                    sum(skillangels_userscore.correctcnt) as correctcnt,\
                    sum(skillangels_userscore.responsetime) as responsetime ,\
                    skillangels_userscore.game_id,skillangels_gamemaster.skill_id as skillid FROM skillangels_userscore \
                  INNER JOIN skillangels_gamemaster ON skillangels_gamemaster.game_id = skillangels_userscore.game_id \
                  where user_id=$1 and event_id=$2 and current_year_status=$3 and Date(date) = Date($4) \
                   GROUP BY skillangels_userscore.game_id,skillangels_gamemaster.skill_id \
                   ORDER BY skillangels_gamemaster.skill_id ASC",
                    [uid, eid, year_status, selDate],
                    (error, results) => {
                      if (error) {
                        done();
                        response.status(200).json({
                          status: "failed",
                          code: "SA018",
                          message: "Dailyplanner score selection query failed"
                        });
                      } else {
                        console.log(results.rows)
                        done();
                        response.status(200).json({
                          status: 'success', code: 'SA000',
                          todaysPlayVal: 1, dailyscoredata: results.rows, message: 'Dailyplanner score retrived successfully'
                        });

                      }
                    })
                }
                else {
                  done();
                  response.status(200).json({
                    status: 'success', code: 'SA000',
                    todaysPlayVal: 0, message: 'Dailyplanner no game played on this day on sbs/hots'
                  });
                }
              }

            }
          }
        );
      }
    });
  } catch (e) {
    console.log(e);
    return response.status(200).json({
      code: "SA120",
      status: "failed",
      message: "getScoreData caused exception"
    });
  }
};




//assessment list datum
const getAssessmentData = (request, response) => {
  const { uid, eid } = request.body;
  res = [];
  try {
    pool.connect((err, client, done) => {
      if (err) {
        done();
        return response.status(200).json({
          code: "SA100",
          status: "failed",
          message: "Internal Server Error"
        });
      } else {
        client.query(
          "Select scoretable.*, \
                startable.ass_m_starcnt, startable.ass_v_starcnt, startable.ass_f_starcnt, startable.ass_p_starcnt, startable.ass_l_starcnt\
        from\
        (select cast(ROW_NUMBER () OVER (ORDER BY ass_status_id)as text) as countVal, * from gameassessmentwisescore_maxbased($1, $2,$3) as t(ass_status_id bigint, m_score bigint,\
            v_score bigint,f_score bigint,p_score bigint,l_score bigint, avg_m_score text ,avg_v_score text,avg_f_score text,avg_p_score text,avg_l_score text, \
            bspi_avg text) order by ass_status_id) as scoretable\
        join\
        (select cast(ROW_NUMBER () OVER (ORDER BY ass_status_id)as text) as countVal,* from gameasswisestar_maxbased($1, $2,$3) as t(ass_status_id bigint,\
                        ass_m_starcnt bigint,ass_v_starcnt bigint,ass_f_starcnt bigint,ass_p_starcnt bigint,ass_l_starcnt bigint) order by ass_status_id) \
                        as startable\
        on scoretable.ass_status_id = startable.ass_status_id and scoretable.countVal = startable.countVal",
          [uid, eid, 1],
          (error, results) => {
            if (error) {
              console.log(error);
              done();
              response.status(200).json({ status: "Failure", code: "SA019", message: "Dashboard assess retrieval failed" });
            } else {
              console.log(results.rows)

              client.query('select * from gameassessmentwisescore_maxbased($1,$2,$3) as t(ass_status_id bigint,\
                m_score bigint,v_score bigint,f_score bigint,p_score bigint,l_score bigint,\
                avg_m_score text ,avg_v_score text,avg_f_score text,avg_p_score text,avg_l_score text,\
                bspi_avg text)order by ass_status_id', [uid, eid, 1], (error1, results1) => {

                if (error1) {
                  console.log(error1)
                  done();
                  response.status(200).json({ status: 'Failure', code: 'SA005', message: 'Report retrieval failed' });
                }
                else {
                  done();
                  for (i = 0; i < results.rows.length; i++) {
                    var tempscore, tempbspi, tempstar;
                    tempscore = parseInt(results1.rows[i].m_score) + parseInt(results1.rows[i].v_score) +
                      parseInt(results1.rows[i].f_score) + parseInt(results1.rows[i].p_score) +
                      parseInt(results1.rows[i].l_score);
                    if (results1.rows[i].ass_status_id == 1 || results1.rows[i].ass_status_id == 3) {
                      tempbspi = tempscore / 5;
                      tempstar = parseInt(results.rows[i].ass_m_starcnt) / 8 + parseInt(results.rows[i].ass_v_starcnt) / 8 +
                        parseInt(results.rows[i].ass_f_starcnt) / 8 + parseInt(results.rows[i].ass_p_starcnt) / 8 +
                        parseInt(results.rows[i].ass_l_starcnt) / 8;
                    } else {
                      tempbspi = results1.rows[i].bspi_avg;
                      tempstar = parseInt(results.rows[i].ass_m_starcnt) + parseInt(results.rows[i].ass_v_starcnt) +
                        parseInt(results.rows[i].ass_f_starcnt) + parseInt(results.rows[i].ass_p_starcnt) +
                        parseInt(results.rows[i].ass_l_starcnt);
                    }
                    res.push({
                      assessid: results.rows[i].ass_status_id,
                      assessnum: results.rows[i].countval,
                      assessscore: tempscore,
                      assessbspi: tempbspi,
                      assessstar: tempstar
                    });
                  }
                  response.status(200).json({
                    status: "Success",
                    code: "SA000",
                    result: res,
                    message: "Dashboard assess retrieval successful"
                  });
                }
              })
            }
          }
        );
      }
    });
  } catch (e) {
    console.log(e);
    return response.status(200).json({
      code: "SA120",
      status: "failed",
      message: "getAssessmentData caused exception"
    });
  }
};

//crowny data
const getCrownyData = (request, response) => {
  const { uid, year_status, selDate } = request.body;
  try {
    pool.connect((err, client, done) => {
      if (err) {
        done();
        return response.status(200).json({
          code: "SA100",
          status: "failed",
          message: "Internal Server Error"
        });
      } else {
        client.query(
          "Select sum(crowny) as addedcrowny from skillangels_crownylog where uid = $1 and addeddate = $3 \
          and current_year_status = $2",
          [uid, year_status, selDate],
          (error, results) => {
            if (error) {
              done();
              response.status(200).json({
                status: "Failure",
                code: "SA037",
                message: "Current day crowny retrieval failed"
              });
            } else {
              done();
              response.status(200).json({
                status: "Success",
                code: "SA000",
                addedcrowny: results.rows,
                message: "Current day crowny retrieval successful"
              });
            }
          }
        );
      }
    });
  } catch (e) {
    console.log(e);
    return response.status(200).json({
      code: "SA120",
      status: "failed",
      message: "getCrownyData caused exception"
    });
  }
};




module.exports = {
  getDashData,
  getScoreData,
  getAssessmentData,
  getCrownyData
};
