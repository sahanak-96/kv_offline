const Pool = require('pg').Pool
config = require("../dbconfig");
db = config.database;
const pool = new Pool(db);
var traincntval = 0;
chkassstatus = 0;
var dataval = 0;
var playedendchk = 0;
//=================================
const getgame = (request, response) => {
	const { uid, eid, year_status } = request.body;
	console.log(request.body)

	try {
		pool.connect((err, client, done) => {
			if (err) {

				console.log("Internal Server Error")
				done();
				return response.status(200).json({ status: "failed", code: 'SA100', message: "Internal Server Error on selecting games" });
			}
			else {
				client.query('SELECT assessment_status from skillangels_schoolbranch where id in (SELECT branch_id from skillangels_users where id=$1 ) ', [uid],
					(error, results) => {
						if (error) {
							done();
							return response.status(200).json({ status: "failed", code: 'SA200', message: "Internal Server Error on query selecting ass_status(sch_branch)" });
						}
						else {
							console.log(results.rows)
							chkassstatus = 0;
							chkassstatus = results.rows[0].assessment_status;

							client.query('SELECT count(DISTINCT game_id) as count FROM skillangels_userscore \
								where user_id=$1 and event_id=$2 and ass_status_id=$3 and current_year_status=$4 ', [uid, eid, 1, year_status],
								(error, results) => {
									if (error) {
										done();
										return response.status(200).json({ status: "failed", code: 'SA201', message: "Internal Server Error on query selecting initialCompleStatus" });
									}
									else {

										if (results.rows[0].count < 5) {
											client.query('SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id \
											FROM skillangels_gamemaster where skillangels_gamemaster.game_id in \
											(select skillangels_gradecyclegame.game_id from skillangels_gradecyclegame \
											where skillangels_gradecyclegame.cycle_id=$3 \
											and skillangels_gradecyclegame.assess_status_id=$2 \
												and skillangels_gradecyclegame.grade_id in  \
											(select skillangels_gradecyclegame.grade_id from skillangels_gradecyclegame  \
											INNER JOIN skillangels_branchgradecyclegame ON skillangels_branchgradecyclegame.gcg_id = skillangels_gradecyclegame.gcg_id  \
											INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.gradeid = skillangels_gradecyclegame.grade_id and   \
												skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
											INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
											INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
											where skillangels_users.id=$1)\
											and skillangels_gradecyclegame.gcg_id in  \
											(select skillangels_branchgradecyclegame.gcg_id from skillangels_branchgradecyclegame  \
											INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
											INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
											INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
											where skillangels_users.id=$1)\
											) ORDER BY skillangels_gamemaster.skill_id ASC  ', [uid, 1, 0],
												(error, results) => {
													if (error) {
														done();
														return response.status(200).json({ status: "failed", code: 'SA202', message: "Internal server Error on query selecting Initial games" });
													}
													else {
														if (results.rows.length > 0) {
															done();
															return response.status(200).json({ status: 'success', code: 'SA000', gamedetails: results.rows, ass_status: 1, traincntval: traincntval, message: "Games Selected Successfully initial" });
														}
														else {
															done();
															return response.status(200).json({ status: 'failed', code: 'SA203', gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found initial" });
														}
													}
												})

										}
										else {
											client.query('SELECT date FROM skillangels_userscore \
											where user_id=$1 and event_id=$2 and ass_status_id=$3 and DATE(date)=(select getserverdate())', [uid, eid, 1],
												(error, results) => {
													if (error) {
														done();
														return response.status(200).json({ status: "failed", code: 'SA204', message: "Internal Server Error on query selecting initial_date_chk" });
													}
													else {
														if (results.rows.length > 0) {
															client.query('SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id \
											FROM skillangels_gamemaster where skillangels_gamemaster.game_id in \
											(select skillangels_gradecyclegame.game_id from skillangels_gradecyclegame \
											where skillangels_gradecyclegame.cycle_id=$3 \
											and skillangels_gradecyclegame.assess_status_id=$2 \
												and skillangels_gradecyclegame.grade_id in  \
											(select skillangels_gradecyclegame.grade_id from skillangels_gradecyclegame  \
											INNER JOIN skillangels_branchgradecyclegame ON skillangels_branchgradecyclegame.gcg_id = skillangels_gradecyclegame.gcg_id  \
											INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.gradeid = skillangels_gradecyclegame.grade_id and   \
												skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
											INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
											INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
											where skillangels_users.id=$1)\
											and skillangels_gradecyclegame.gcg_id in  \
											(select skillangels_branchgradecyclegame.gcg_id from skillangels_branchgradecyclegame  \
											INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
											INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
											INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
											where skillangels_users.id=$1)\
											) ORDER BY skillangels_gamemaster.skill_id ASC  ', [uid, 1, 0],
																(error, results) => {
																	if (error) {
																		done();
																		return response.status(200).json({ status: "failed", code: 'SA205', message: "Internal server Error on query selecting Initial games onsameday" });
																	}
																	else {
																		if (results.rows.length > 0) {
																			done();
																			return response.status(200).json({ status: 'success', code: 'SA000', gamedetails: results.rows, ass_status: 1, traincntval: traincntval, message: "Games Selected Successfully initial onsameday" });
																		}
																		else {
																			done();
																			return response.status(200).json({ status: 'failed', code: 'SA206', gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found initial onsameday" });
																		}
																	}
																})

														}
														else {

															client.query('select FLOOR((SELECT CAST ((select count(date) from skillangels_userfinishcycle \
															where user_id=$1 and current_year_status=$2) AS FLOAT)/8)) as trainingcount, \
															(select mod(count(date),8) from skillangels_userfinishcycle \
															where user_id=$1 and current_year_status=$2) as dataval ', [uid, year_status],
																(error, results) => {
																	if (error) {
																		done();
																		return response.status(200).json({ status: "failed", code: 'SA207', message: "Internal server Error on query selecting training trainingcount" });
																	}
																	else {
																		console.log(results.rows[0].trainingcount)
																		traincntval = results.rows[0].trainingcount;
																		traincntval = Number(traincntval) + 1;
																		dataval = Number(results.rows[0].dataval);
																		if (results.rows[0].trainingcount == 0 || results.rows[0].trainingcount == 1) {


																			client.query('select * from skillangels_games_cylce_entry where \
																			user_id =$1 and event_id =$2  \
																	   and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
																				(error, results) => {
																					if (error) {
																						done();
																						return response.status(200).json({ status: "failed", code: 'SA208', message: "Internal Server Error on query selecting skillangels_games_cylce_entry status train1&2" });
																					}
																					else {

																						if (results.rows.length > 0) {
																							if (results.rows[0].status == 1) {

																								client.query('select * from (select * from skillangels_games_cylce_entry where \
																									user_id =$1 and event_id =$2  \
																							   and current_year_status =$3 order by actual_start_date desc LIMIT 1) as newtb \
																							   where (select getserverdate()) > Date(actual_end_date)', [uid, eid, year_status],
																									(error, results) => {
																										if (error) {
																											done();
																											return response.status(200).json({ status: "failed", code: 'SA209', message: "Internal Server Error on query selecting skillangels_games_cylce_entry >date train1&2" });
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
																															return response.status(200).json({ status: "failed", code: 'SA210', message: "Internal Server Error on query selecting skillangels_games_cylce_entry todaychk train1&2" });
																														}
																														else {
																															if (results.rows.length > 0) {
																																client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
																								and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
																																	(error, results) => {
																																		if (error) {
																																			done();
																																			return response.status(200).json({ status: "failed", code: 'SA211', message: "Internal Server Error on query selecting train1&2 on todaychk" });
																																		}
																																		else {

																																			if (results.rows.length > 0) {
																																				done();
																																				if (traincntval > 1) {
																																					if (dataval == 0) {
																																						traincntval = traincntval - 1;
																																					}
																																				}

																																				return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, gamedetails: results.rows, ass_status: 2, traincntval: traincntval, message: "Games Selected Successfully train1&2 games onsameday on todaychk" });
																																			}
																																			else {
																																				done();
																																				return response.status(200).json({ status: 'failed', code: 'SA212', mychkattempt: 0, gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found train1&2 games onsameday on todaychk" });
																																			}
																																		}
																																	})
																															}
																															else {


																																client.query('SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id \
																																	FROM skillangels_gamemaster where skillangels_gamemaster.game_id in \
																																	(select skillangels_gradecyclegame.game_id from skillangels_gradecyclegame \
																																	where skillangels_gradecyclegame.cycle_id in (SELECT ((MOD(COUNT(date),8))+1)as count FROM skillangels_userfinishcycle \
																																						WHERE skillangels_userfinishcycle.user_id=$1 and skillangels_userfinishcycle.current_year_status=$3 ) \
																																	and skillangels_gradecyclegame.assess_status_id=$2 \
																																	and skillangels_gradecyclegame.grade_id in  \
																																	(select skillangels_gradecyclegame.grade_id from skillangels_gradecyclegame  \
																																	INNER JOIN skillangels_branchgradecyclegame ON skillangels_branchgradecyclegame.gcg_id = skillangels_gradecyclegame.gcg_id  \
																																	INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.gradeid = skillangels_gradecyclegame.grade_id and   \
																																	skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
																																	INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
																																	INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
																																	where skillangels_users.id=$1) \
																																	and skillangels_gradecyclegame.gcg_id in  \
																																   (select skillangels_branchgradecyclegame.gcg_id from skillangels_branchgradecyclegame  \
																																	INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
																																	 INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
																																	INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
																																	 where skillangels_users.id=$1)\
																																	) ORDER BY skillangels_gamemaster.skill_id ASC  ', [uid, 2, year_status],
																																	(error, results) => {
																																		if (error) {
																																			done();
																																			return response.status(200).json({ status: "failed", code: 'SA213', message: "Internal server Error on query selecting train1&2 games" });
																																		}
																																		else {

																																			if (results.rows.length > 0) {
																																				done();
																																				return response.status(200).json({ status: 'success', code: 'SA000', gamedetails: results.rows, ass_status: 2, traincntval: traincntval, message: "Games Selected Successfully train1&2" });
																																			}
																																			else {
																																				done();
																																				return response.status(200).json({ status: 'failed', code: 'SA214', gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found train1&2" });
																																			}
																																		}
																																	})




																															}


																														}
																													})



																											}
																											else {
																												client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
																								and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
																													(error, results) => {
																														if (error) {
																															done();
																															return response.status(200).json({ status: "failed", code: 'SA215', message: "Internal server Error on query selecting train1&2 games onsameday on >date =0" });
																														}
																														else {

																															if (results.rows.length > 0) {
																																done();
																																if (traincntval > 1) {
																																	if (dataval == 0) {
																																		traincntval = traincntval - 1;
																																	}
																																}

																																return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, gamedetails: results.rows, ass_status: 2, traincntval: traincntval, message: "Games Selected Successfully train1&2 games onsameday >date =0" });
																															}
																															else {
																																done();
																																return response.status(200).json({ status: 'failed', code: 'SA216', mychkattempt: 0, gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found train1&2 games onsameday >date =0" });
																															}
																														}
																													})
																											}
																										}
																									})


																							}
																							else {

																								client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
																								and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
																									(error, results) => {
																										if (error) {
																											done();
																											return response.status(200).json({ status: "failed", code: 'SA217', message: "Internal server Error on query selecting train1&2 games onsameday if status=0" });
																										}
																										else {

																											if (results.rows.length > 0) {
																												done();
																												if (traincntval > 1) {
																													if (dataval == 0) {
																														traincntval = traincntval - 1;
																													}
																												}

																												return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, gamedetails: results.rows, ass_status: 2, traincntval: traincntval, message: "Games Selected Successfully train1&2 games onsameday if status=0" });
																											}
																											else {
																												done();
																												return response.status(200).json({ status: 'failed', code: 'SA218', mychkattempt: 0, gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found train1&2 games onsameday if status=0" });
																											}
																										}
																									})
																							}


																						}
																						else {

																							client.query('SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id \
																							FROM skillangels_gamemaster where skillangels_gamemaster.game_id in \
																							(select skillangels_gradecyclegame.game_id from skillangels_gradecyclegame \
																							where skillangels_gradecyclegame.cycle_id in (SELECT ((MOD(COUNT(date),8))+1)as count FROM skillangels_userfinishcycle \
																												WHERE skillangels_userfinishcycle.user_id=$1 and skillangels_userfinishcycle.current_year_status=$3 ) \
																							and skillangels_gradecyclegame.assess_status_id=$2 \
																							and skillangels_gradecyclegame.grade_id in  \
																							(select skillangels_gradecyclegame.grade_id from skillangels_gradecyclegame  \
																							INNER JOIN skillangels_branchgradecyclegame ON skillangels_branchgradecyclegame.gcg_id = skillangels_gradecyclegame.gcg_id  \
																							INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.gradeid = skillangels_gradecyclegame.grade_id and   \
																							skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
																							INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
																							INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
																							where skillangels_users.id=$1) \
																							and skillangels_gradecyclegame.gcg_id in  \
											                                               (select skillangels_branchgradecyclegame.gcg_id from skillangels_branchgradecyclegame  \
										                                                	INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
										                                                 	INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
										                                                	INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
										                                                 	where skillangels_users.id=$1)\
																							) ORDER BY skillangels_gamemaster.skill_id ASC  ', [uid, 2, year_status],
																								(error, results) => {
																									if (error) {
																										done();
																										return response.status(200).json({ status: "failed", code: 'SA219', message: "Internal server Error on query selecting train1&2 games on firsttime" });
																									}
																									else {

																										if (results.rows.length > 0) {
																											done();
																											return response.status(200).json({ status: 'success', code: 'SA000', gamedetails: results.rows, ass_status: 2, traincntval: traincntval, message: "Games Selected Successfully train1&2 on firsttime" });
																										}
																										else {
																											done();
																											return response.status(200).json({ status: 'failed', code: 'SA220', gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found train1&2 on firsttime" });
																										}
																									}
																								})
																						}
																					}
																				})


																		}
																		else if (results.rows[0].trainingcount == 2) {
																			client.query('SELECT count(DISTINCT game_id) as count FROM skillangels_userscore \
																			where user_id=$1 and event_id=$2 and ass_status_id=$3 and current_year_status=$4 ', [uid, eid, 4, year_status],
																				(error, results) => {
																					if (error) {
																						done();
																						return response.status(200).json({ status: "failed", code: 'SA221', message: "Internal Server Error on query selecting hotsCompleStatus" });
																					}
																					else {

																						if (results.rows[0].count < 1) {

																							client.query('select * from (select * from skillangels_games_cylce_entry where \
																								user_id =$1 and event_id =$2  \
																						   and current_year_status =$3 order by actual_start_date desc LIMIT 1) as newtb \
																						   where (select getserverdate()) > Date(actual_end_date)', [uid, eid, year_status],
																								(error, results) => {
																									if (error) {
																										done();
																										return response.status(200).json({ status: "failed", code: 'SA222', message: "Internal Server Error on query selecting > Date on train2" });
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
																														return response.status(200).json({ status: "failed", code: 'SA223', message: "Internal Server Error on query selecting train2 todaychk" });
																													}
																													else {
																														if (results.rows.length > 0) {
																															client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
																								and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
																																(error, results) => {
																																	if (error) {
																																		done();
																																		return response.status(200).json({ status: "failed", code: 'SA224', message: "Internal server Error on query selecting train2 games onsameday on todaychk" });
																																	}
																																	else {

																																		if (results.rows.length > 0) {
																																			done();
																																			if (traincntval > 1) {
																																				if (dataval == 0) {
																																					traincntval = traincntval - 1;
																																				}
																																			}

																																			return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, gamedetails: results.rows, ass_status: 2, traincntval: traincntval, message: "Games Selected Successfully train2 games onsameday on todaychk" });
																																		}
																																		else {
																																			done();
																																			return response.status(200).json({ status: 'failed', code: 'SA225', mychkattempt: 0, gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found train2 games onsameday on todaychk" });
																																		}
																																	}
																																})
																														}
																														else {
																															done();
																															return response.status(200).json({ status: "failed", code: 'SA226', message: "please complete hots" });

																														}


																													}
																												})



																										}
																										else {
																											client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
																								and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
																												(error, results) => {
																													if (error) {
																														done();
																														return response.status(200).json({ status: "failed", code: 'SA227', message: "Internal server Error on query selecting train2 games onsameday on > Date=0" });
																													}
																													else {

																														if (results.rows.length > 0) {
																															done();
																															if (traincntval > 1) {
																																if (dataval == 0) {
																																	traincntval = traincntval - 1;
																																}
																															}

																															return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, gamedetails: results.rows, ass_status: 2, traincntval: traincntval, message: "Games Selected Successfully train2 games onsameday on > Date=0" });
																														}
																														else {
																															done();
																															return response.status(200).json({ status: 'failed', code: 'SA228', mychkattempt: 0, gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found train2 games onsameday on > Date=0" });
																														}
																													}
																												})
																										}
																									}
																								})

																						}
																						else {


																							client.query('SELECT date FROM skillangels_userscore \
																					where user_id=$1 and event_id=$2 and ass_status_id=$3 and DATE(date)=(select getserverdate())', [uid, eid, 4],
																								(error, results) => {
																									if (error) {
																										done();
																										return response.status(200).json({ status: "failed", code: 'SA229', message: "Internal Server Error on query selecting hots_date_chk" });
																									}
																									else {
																										if (results.rows.length > 0) {
																											done();
																											return response.status(200).json({ status: "failed", code: 'SA230', message: "hots page onsameday" });

																										}
																										else {
																											////////////////
																											client.query('select * from skillangels_games_cylce_entry where \
																											user_id =$1 and event_id =$2  \
																									   and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
																												(error, results) => {
																													if (error) {
																														done();
																														return response.status(200).json({ status: "failed", code: 'SA231', message: "Internal Server Error on query selecting skillangels_games_cylce_entry status train3" });
																													}
																													else {

																														if (results.rows[0].status == 1) {
																															/////////	aaaaaaaaaaaaaaaaaaaaa/////////
																															client.query('select * from (select * from skillangels_games_cylce_entry where \
																																	user_id =$1 and event_id =$2  \
																															   and current_year_status =$3 order by actual_start_date desc LIMIT 1) as newtb \
																															   where (select getserverdate()) > Date(actual_end_date)', [uid, eid, year_status],
																																(error, results) => {
																																	if (error) {
																																		done();
																																		return response.status(200).json({ status: "failed", code: 'SA232', message: "Internal Server Error on query selecting > Date on train3" });
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
																																						return response.status(200).json({ status: "failed", code: 'SA233', message: "Internal Server Error on query selecting train3 todaychk" });
																																					}
																																					else {
																																						if (results.rows.length > 0) {
																																							client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
																																							and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
																																								(error, results) => {
																																									if (error) {
																																										done();
																																										return response.status(200).json({ status: "failed", code: 'SA234', message: "Internal server Error on query selecting train3 games onsameday on todaychk" });
																																									}
																																									else {

																																										if (results.rows.length > 0) {
																																											done();
																																											if (traincntval > 1) {
																																												if (dataval == 0) {
																																													traincntval = traincntval - 1;
																																												}
																																											}

																																											return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, gamedetails: results.rows, ass_status: 2, traincntval: traincntval, message: "Games Selected Successfully train3 games onsameday on todaychk" });
																																										}
																																										else {
																																											done();
																																											return response.status(200).json({ status: 'failed', code: 'SA235', mychkattempt: 0, gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found train3 games onsameday on todaychk" });
																																										}
																																									}
																																								})
																																						}
																																						else {


																																							client.query('SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id \
																																									FROM skillangels_gamemaster where skillangels_gamemaster.game_id in \
																																									(select skillangels_gradecyclegame.game_id from skillangels_gradecyclegame \
																																									where skillangels_gradecyclegame.cycle_id in (SELECT ((MOD(COUNT(date),8))+1)as count FROM skillangels_userfinishcycle \
																																														WHERE skillangels_userfinishcycle.user_id=$1 and skillangels_userfinishcycle.current_year_status=$3 ) \
																																									and skillangels_gradecyclegame.assess_status_id=$2 \
																																									and skillangels_gradecyclegame.grade_id in  \
																																									(select skillangels_gradecyclegame.grade_id from skillangels_gradecyclegame  \
																																									INNER JOIN skillangels_branchgradecyclegame ON skillangels_branchgradecyclegame.gcg_id = skillangels_gradecyclegame.gcg_id  \
																																									INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.gradeid = skillangels_gradecyclegame.grade_id and   \
																																									skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
																																									INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
																																									INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
																																									where skillangels_users.id=$1) \
																																									and skillangels_gradecyclegame.gcg_id in  \
																																								   (select skillangels_branchgradecyclegame.gcg_id from skillangels_branchgradecyclegame  \
																																									INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
																																									 INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
																																									INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
																																									 where skillangels_users.id=$1)\
																																									) ORDER BY skillangels_gamemaster.skill_id ASC  ', [uid, 2, year_status],
																																								(error, results) => {
																																									if (error) {
																																										done();
																																										return response.status(200).json({ status: "failed", code: 'SA236', message: "Internal server Error on query selecting train3 games" });
																																									}
																																									else {

																																										if (results.rows.length > 0) {
																																											done();
																																											return response.status(200).json({ status: 'success', code: 'SA000', gamedetails: results.rows, ass_status: 2, traincntval: traincntval, message: "Games Selected Successfully train3" });
																																										}
																																										else {
																																											done();
																																											return response.status(200).json({ status: 'failed', code: 'SA237', gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found train3" });
																																										}
																																									}
																																								})




																																						}


																																					}
																																				})



																																		}
																																		else {
																																			client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
																								and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
																																				(error, results) => {
																																					if (error) {
																																						done();
																																						return response.status(200).json({ status: "failed", code: 'SA238', message: "Internal server Error on query selecting train3 games onsameday > Date =0" });
																																					}
																																					else {

																																						if (results.rows.length > 0) {
																																							done();
																																							if (traincntval > 1) {
																																								if (dataval == 0) {
																																									traincntval = traincntval - 1;
																																								}
																																							}

																																							return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, gamedetails: results.rows, ass_status: 2, traincntval: traincntval, message: "Games Selected Successfully train3 games onsameday on > Date =0" });
																																						}
																																						else {
																																							done();
																																							return response.status(200).json({ status: 'failed', code: 'SA239', mychkattempt: 0, gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found train3 games onsameday on > Date =0" });
																																						}
																																					}
																																				})
																																		}
																																	}
																																})


																														}
																														else {
																															client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
																															and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
																																(error, results) => {
																																	if (error) {
																																		done();
																																		return response.status(200).json({ status: "failed", code: 'SA240', message: "Internal server Error on query selecting train3 games onsameday status=0" });
																																	}
																																	else {

																																		if (results.rows.length > 0) {
																																			done();
																																			if (traincntval > 1) {
																																				if (dataval == 0) {
																																					traincntval = traincntval - 1;
																																				}
																																			}

																																			return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, gamedetails: results.rows, ass_status: 2, traincntval: traincntval, message: "Games Selected Successfully train3 games onsameday status=0" });
																																		}
																																		else {
																																			done();
																																			return response.status(200).json({ status: 'failed', code: 'SA241', mychkattempt: 0, gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found train3 games onsameday status=0" });
																																		}
																																	}
																																})
																														}



																													}
																												})
																											///////////////////

																										}
																									}
																								})
																						}
																					}
																				})



																		}
																		else {

																			client.query('SELECT count(DISTINCT game_id) as count FROM skillangels_userscore \
																					where user_id=$1 and event_id=$2 and ass_status_id=$3 and current_year_status=$4', [uid, eid, 5, year_status],
																				(error, results) => {
																					if (error) {
																						done();
																						return response.status(200).json({ status: "failed", code: 'SA242', message: "Internal Server Error on query selecting sbcCompleStatus" });
																					}
																					else {

																						if (results.rows[0].count < 5) {


																							client.query('select * from (select * from skillangels_games_cylce_entry where \
																								user_id =$1 and event_id =$2  \
																						   and current_year_status =$3 order by actual_start_date desc LIMIT 1) as newtb \
																						   where (select getserverdate()) > Date(actual_end_date)', [uid, eid, year_status],
																								(error, results) => {
																									if (error) {
																										done();
																										return response.status(200).json({ status: "failed", code: 'SA243', message: "Internal Server Error on query selecting > date for train3 samedatechk" });
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
																														return response.status(200).json({ status: "failed", code: 'SA244', message: "Internal Server Error on query selecting todaychk for train3 samedatechk" });
																													}
																													else {
																														if (results.rows.length > 0) {
																															client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
																															and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
																																(error, results) => {
																																	if (error) {
																																		done();
																																		return response.status(200).json({ status: "failed", code: 'SA245', message: "Internal server Error on query selecting train3 games onsameday on todaychk samedatechk" });
																																	}
																																	else {

																																		if (results.rows.length > 0) {
																																			done();
																																			if (traincntval > 1) {
																																				if (dataval == 0) {
																																					traincntval = traincntval - 1;
																																				}
																																			}

																																			return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, gamedetails: results.rows, ass_status: 2, traincntval: traincntval, message: "Games Selected Successfully train3 games onsameday on todaychk samedatechk" });
																																		}
																																		else {
																																			done();
																																			return response.status(200).json({ status: 'failed', code: 'SA246', mychkattempt: 0, gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found train3 games onsameday on todaychk samedatechk" });
																																		}
																																	}
																																})
																														}
																														else {
																															done();
																															return response.status(200).json({ status: "failed", code: 'SA247', message: "please complete sbc" });

																														}


																													}
																												})



																										}
																										else {
																											client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
																											and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
																												(error, results) => {
																													if (error) {
																														done();
																														return response.status(200).json({ status: "failed", code: 'SA248', message: "Internal server Error on query selecting train3 games onsameday >0 =0 > samedatechk" });
																													}
																													else {

																														if (results.rows.length > 0) {
																															done();
																															if (traincntval > 1) {
																																if (dataval == 0) {
																																	traincntval = traincntval - 1;
																																}
																															}

																															return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, gamedetails: results.rows, ass_status: 2, traincntval: traincntval, message: "Games Selected Successfully train3 games onsameday  >0 =0 > samedatechk" });
																														}
																														else {
																															done();
																															return response.status(200).json({ status: 'failed', code: 'SA249', mychkattempt: 0, gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found train3 games onsameday  >0 =0 > samedatechk" });
																														}
																													}
																												})

																										}
																									}
																								})



																						}
																						else {
																							client.query('SELECT date FROM skillangels_userscore \
																							where user_id=$1 and event_id=$2 and ass_status_id=$3 and DATE(date)=(select getserverdate())', [uid, eid, 5],
																								(error, results) => {
																									if (error) {
																										done();
																										return response.status(200).json({ status: "failed", code: 'SA250', message: "Internal Server Error on query selecting sbc datechk" });
																									}
																									else {

																										if (results.rows.length > 0) {

																											done();
																											return response.status(200).json({ status: "failed", code: 'SA251', message: "sbc page onsameday" });
																										}
																										else {
																											client.query('SELECT count(DISTINCT game_id) as count FROM skillangels_userscore \
																											where user_id=$1 and event_id=$2 and ass_status_id=$3 and current_year_status=$4', [uid, eid, 3, year_status],
																												(error, results) => {
																													if (error) {
																														done();
																														return response.status(200).json({ status: "failed", code: 'SA252', message: "Internal Server Error on query selecting postassStatus" });
																													}
																													else {

																														if (results.rows[0].count < 5) {
																															client.query('SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id \
																															FROM skillangels_gamemaster where skillangels_gamemaster.game_id in \
																															(select skillangels_gradecyclegame.game_id from skillangels_gradecyclegame \
																															where skillangels_gradecyclegame.cycle_id=$3 \
																															and skillangels_gradecyclegame.assess_status_id=$2 \
																															and skillangels_gradecyclegame.grade_id in  \
																															(select skillangels_gradecyclegame.grade_id from skillangels_gradecyclegame  \
																															INNER JOIN skillangels_branchgradecyclegame ON skillangels_branchgradecyclegame.gcg_id = skillangels_gradecyclegame.gcg_id  \
																															INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.gradeid = skillangels_gradecyclegame.grade_id and   \
																															skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
																															INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
																															INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
																															where skillangels_users.id=$1)\
																															and skillangels_gradecyclegame.gcg_id in  \
											                                                                              (select skillangels_branchgradecyclegame.gcg_id from skillangels_branchgradecyclegame  \
											                                                                                INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
										                                                                                	INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
										                                                                	                INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
											                                                                                where skillangels_users.id=$1)\
																															) ORDER BY skillangels_gamemaster.skill_id ASC  ', [uid, 3, -1],
																																(error, results) => {
																																	if (error) {
																																		done();
																																		return response.status(200).json({ status: "failed", code: 'SA253', message: "Internal server Error on query selecting post games" });
																																	}
																																	else {
																																		if (results.rows.length > 0) {
																																			done();
																																			return response.status(200).json({ status: 'success', code: 'SA000', gamedetails: results.rows, ass_status: 3, traincntval: traincntval, message: "Games Selected Successfully post" });
																																		}
																																		else {
																																			done();
																																			return response.status(200).json({ status: 'failed', code: 'SA254', gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found post" });
																																		}
																																	}
																																})
																														}
																														else {
																															// console.log("asseign new games");
																															client.query('SELECT date FROM skillangels_userscore \
																																where user_id=$1 and event_id=$2 and ass_status_id=$3 and DATE(date)=(select getserverdate())', [uid, eid, 3],
																																(error, results) => {
																																	if (error) {
																																		done();
																																		return response.status(200).json({ status: "failed", code: 'SA255', message: "Internal Server Error on query selecting post_date_chk" });
																																	}
																																	else {
																																		if (results.rows.length > 0) {
																																			client.query('SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id \
																																				FROM skillangels_gamemaster where skillangels_gamemaster.game_id in \
																																				(select skillangels_gradecyclegame.game_id from skillangels_gradecyclegame \
																																				where skillangels_gradecyclegame.cycle_id=$3 \
																																				and skillangels_gradecyclegame.assess_status_id=$2 \
																																				and skillangels_gradecyclegame.grade_id in  \
																																				(select skillangels_gradecyclegame.grade_id from skillangels_gradecyclegame  \
																																				INNER JOIN skillangels_branchgradecyclegame ON skillangels_branchgradecyclegame.gcg_id = skillangels_gradecyclegame.gcg_id  \
																																				INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.gradeid = skillangels_gradecyclegame.grade_id and   \
																																				skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
																																				INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
																																				INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
																																				where skillangels_users.id=$1)\
																																				and skillangels_gradecyclegame.gcg_id in  \
																																				(select skillangels_branchgradecyclegame.gcg_id from skillangels_branchgradecyclegame  \
																																				INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
																																				INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
																																				INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
																																				where skillangels_users.id=$1)\
																																				) ORDER BY skillangels_gamemaster.skill_id ASC  ', [uid, 3, -1],
																																				(error, results) => {
																																					if (error) {
																																						done();
																																						return response.status(200).json({ status: "failed", code: 'SA256', message: "Internal server Error on query selecting post games onsameday" });
																																					}
																																					else {
																																						if (results.rows.length > 0) {
																																							done();
																																							return response.status(200).json({ status: 'success', code: 'SA000', gamedetails: results.rows, ass_status: 3, traincntval: traincntval, message: "Games Selected Successfully post onsameday" });
																																						}
																																						else {
																																							done();
																																							return response.status(200).json({ status: 'failed', code: 'SA257', gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found post onsameday" });
																																						}
																																					}
																																				})


																																		}
																																		else {
																																			client.query('SELECT date FROM skillangels_userscore \
																																				where user_id=$1 and event_id=$2 and ass_status_id=$3 and DATE(date)=(select getserverdate())', [uid, eid, 6],
																																				(error, results) => {
																																					if (error) {
																																						done();
																																						return response.status(200).json({ status: "failed", code: 'SA258', message: "Internal Server Error on query selecting ass_status5_date_chk" });
																																					}
																																					else {
																																						if (results.rows.length < 5) {
																																							client.query('SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id \
																																		FROM skillangels_gamemaster where skillangels_gamemaster.game_id in \
																																		(select skillangels_gradecyclegame.game_id from skillangels_gradecyclegame \
																																		where skillangels_gradecyclegame.cycle_id=(SELECT ((MOD( \
																																			(select count(countval) from (select count(DISTINCT game_id) as countval from skillangels_userscore \
																																		where skillangels_userscore.user_id=$1 and skillangels_userscore.ass_status_id=$4 and skillangels_userscore.event_id=$3 \
																																		and skillangels_userscore.current_year_status=$5 \
																																		group by date)as table1 where countVal = 5),8) )+1)as count) \
																																		and skillangels_gradecyclegame.assess_status_id=$2 \
																																		and skillangels_gradecyclegame.grade_id in  \
																																		(select skillangels_gradecyclegame.grade_id from skillangels_gradecyclegame  \
																																		INNER JOIN skillangels_branchgradecyclegame ON skillangels_branchgradecyclegame.gcg_id = skillangels_gradecyclegame.gcg_id  \
																																		INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.gradeid = skillangels_gradecyclegame.grade_id and   \
																																		skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
																																		INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
																																		INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
																																		where skillangels_users.id=$1)\
																																		and skillangels_gradecyclegame.gcg_id in  \
																																		(select skillangels_branchgradecyclegame.gcg_id from skillangels_branchgradecyclegame \
																																		INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
																																		INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
																																		INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
																																		where skillangels_users.id=$1)\
																																		) ORDER BY skillangels_gamemaster.skill_id ASC', [uid, 2, eid, 6, year_status],
																																								(error, results) => {
																																									if (error) {
																																										done();
																																										return response.status(200).json({ status: "failed", code: 'SA259', message: "Internal server Error on query selecting newgames" });
																																									}
																																									else {

																																										if (results.rows.length > 0) {
																																											done();
																																											return response.status(200).json({ status: 'success', code: 'SA000', gamedetails: results.rows, ass_status: 6, traincntval: traincntval, message: "Games Selected Successfully newgame" });
																																										}
																																										else {
																																											done();
																																											return response.status(200).json({ status: 'failed', code: 'SA260', gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found newgames" });
																																										}
																																									}
																																								})
																																						}
																																						else {

																																							client.query('SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id \
																																FROM skillangels_gamemaster where skillangels_gamemaster.game_id in( select game_id from skillangels_userscore where user_id=$1 and event_id=$3 \
																																	and ass_status_id=$2 and DATE(date)=(select getserverdate())) ORDER BY skillangels_gamemaster.skill_id ASC  ', [uid, 6, eid],
																																								(error, results) => {
																																									if (error) {
																																										done();
																																										return response.status(200).json({ status: "failed", code: 'SA261', message: "Internal server Error on query selecting newgames onsameday" });
																																									}
																																									else {

																																										if (results.rows.length > 0) {
																																											done();
																																											return response.status(200).json({ status: 'success', code: 'SA000', gamedetails: results.rows, ass_status: 6, traincntval: traincntval, message: "Games Selected Successfully newgames onsameday" });
																																										}
																																										else {
																																											done();
																																											return response.status(200).json({ status: 'failed', code: 'SA262', gamedetails: "", ass_status: "", traincntval: traincntval, message: "Games not found newgames onsameday" });
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
			}
		})
	} catch (e) {
		return response.status(200).json({
			code: "SA120",
			status: "failed",
			message: "getgame caused exception"
		});
	}
}







const getgamec2 = (request, response) => {
	const { uid, eid, ass_status_id, year_status } = request.body;
	// console.log("c22222222222222222" + uid, eid, ass_status_id, year_status)
	try {
		pool.connect((err, client, done) => {
			if (err) {
				done();
				return response.status(200).json({ status: "failed", code: 'SA100', message: "Internal Server Error on selecting gamec2" });
			}
			else {
				client.query('select FLOOR((SELECT CAST ((select count(date) from skillangels_userfinishcycle \
														where user_id=$1 and current_year_status=$2) AS FLOAT)/8)) as trainingcount, \
														(select mod(count(date),8) from skillangels_userfinishcycle \
                                                           where user_id=$1 and current_year_status=$2) as dataval ', [uid, year_status],
					(error, results) => {
						if (error) {
							done();
							return response.status(200).json({ status: "failed", code: 'SA263', message: "Internal server Error on query selecting training trainingcountc2" });
						}
						else {

							if (results.rows[0].trainingcount == 2) {


								client.query('select * from skillangels_games_cylce_entry where \
								user_id =$1 and event_id =$2  \
						   and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
									(error, results) => {
										if (error) {
											done();
											return response.status(200).json({ status: "failed", code: 'SA264', message: "Internal Server Error on query selecting status train3 c2" });
										}
										else {

											if (results.rows[0].status == 1) {

												client.query('select * from (select * from skillangels_games_cylce_entry where \
														user_id =$1 and event_id =$2  \
												   and current_year_status =$3 order by actual_start_date desc LIMIT 1) as newtb \
												   where (select getserverdate()) > Date(actual_end_date)', [uid, eid, year_status],
													(error, results) => {
														if (error) {
															done();
															return response.status(200).json({ status: "failed", code: 'SA265', message: "Internal Server Error on query selecting > date train3 c2" });
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
																			return response.status(200).json({ status: "failed", code: 'SA266', message: "Internal Server Error on query selecting todaychk train3 c2" });
																		}
																		else {
																			if (results.rows.length > 0) {
																				client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
																								and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
																					(error, results) => {
																						if (error) {
																							done();
																							return response.status(200).json({ status: "failed", code: 'SA267', message: "Internal server Error on query selecting train2 games onsameday todaychk train3 c2" });
																						}
																						else {

																							if (results.rows.length > 0) {
																								done();
																								return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, gamedetails: results.rows, ass_status: 2, traincntval: 3, message: "Games Selected Successfully train2 games onsameday todaychk train3 c2" });
																							}
																							else {
																								done();
																								return response.status(200).json({ status: 'failed', code: 'SA268', mychkattempt: 0, gamedetails: "", ass_status: "", traincntval: 3, message: "Games not found train2 games onsameday todaychk train3 c2" });
																							}
																						}
																					})
																			}
																			else {


																				client.query('SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id \
																						FROM skillangels_gamemaster where skillangels_gamemaster.game_id in \
																						(select skillangels_gradecyclegame.game_id from skillangels_gradecyclegame \
																						where skillangels_gradecyclegame.cycle_id in (SELECT ((MOD(COUNT(date),8))+1)as count FROM skillangels_userfinishcycle \
																											WHERE skillangels_userfinishcycle.user_id=$1 and skillangels_userfinishcycle.current_year_status=$3 ) \
																						and skillangels_gradecyclegame.assess_status_id=$2 \
																						and skillangels_gradecyclegame.grade_id in  \
																						(select skillangels_gradecyclegame.grade_id from skillangels_gradecyclegame  \
																						INNER JOIN skillangels_branchgradecyclegame ON skillangels_branchgradecyclegame.gcg_id = skillangels_gradecyclegame.gcg_id  \
																						INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.gradeid = skillangels_gradecyclegame.grade_id and   \
																						skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
																						INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
																						INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
																						where skillangels_users.id=$1) \
																						and skillangels_gradecyclegame.gcg_id in  \
																					   (select skillangels_branchgradecyclegame.gcg_id from skillangels_branchgradecyclegame  \
																						INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
																						 INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
																						INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
																						 where skillangels_users.id=$1)\
																						) ORDER BY skillangels_gamemaster.skill_id ASC  ', [uid, 2, year_status],
																					(error, results) => {
																						if (error) {
																							done();
																							return response.status(200).json({ status: "failed", code: 'SA269', message: "Internal server Error on query selecting train3 games c2" });
																						}
																						else {

																							if (results.rows.length > 0) {
																								done();
																								return response.status(200).json({ status: 'success', code: 'SA000', gamedetails: results.rows, ass_status: 2, traincntval: 3, message: "Games Selected Successfully train3 c2" });
																							}
																							else {
																								done();
																								return response.status(200).json({ status: 'failed', code: 'SA270', gamedetails: "", ass_status: "", traincntval: 3, message: "Games not found train3 c2" });
																							}
																						}
																					})




																			}


																		}
																	})



															}
															else {
																client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
																and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
																	(error, results) => {
																		if (error) {
																			done();
																			return response.status(200).json({ status: "failed", code: 'SA271', message: "Internal server Error on query selecting train3 games onsameday > date=0  c2" });
																		}
																		else {

																			if (results.rows.length > 0) {
																				done();
																				return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, gamedetails: results.rows, ass_status: 2, traincntval: 3, message: "Games Selected Successfully train3 games onsameday > date=0  c2" });
																			}
																			else {
																				done();
																				return response.status(200).json({ status: 'failed', code: 'SA272', mychkattempt: 0, gamedetails: "", ass_status: "", traincntval: 3, message: "Games not found train3 games onsameday > date=0  c2" });
																			}
																		}
																	})
															}
														}
													})


											}
											else {
												client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
																								and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
													(error, results) => {
														if (error) {
															done();
															return response.status(200).json({ status: "failed", code: 'SA273', message: "Internal server Error on query selecting train3 games onsameday status=0 c2" });
														}
														else {

															if (results.rows.length > 0) {
																done();
																return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, gamedetails: results.rows, ass_status: 2, traincntval: 3, message: "Games Selected Successfully train3 games onsameday status=0 c2" });
															}
															else {
																done();
																return response.status(200).json({ status: 'failed', code: 'SA274', mychkattempt: 0, gamedetails: "", ass_status: "", traincntval: 3, message: "Games not found train3 games onsameday status=0 c2" });
															}
														}
													})
											}



										}
									})


							}
							else {

								client.query('select * from (select * from skillangels_games_cylce_entry where \
									user_id =$1 and event_id =$2  \
							   and current_year_status =$3 order by actual_start_date desc LIMIT 1) as newtb \
							   where (select getserverdate()) > Date(actual_end_date)', [uid, eid, year_status],
									(error, results) => {
										if (error) {
											done();
											return response.status(200).json({ status: "failed", code: 'SA275', message: "Internal Server Error on query selecting > date train3 c2 samedaychk" });
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
															return response.status(200).json({ status: "failed", code: 'SA276', message: "Internal Server Error on query selecting todaychk train3 c2 samedaychk " });
														}
														else {
															if (results.rows.length > 0) {
																client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
																								and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
																	(error, results) => {
																		if (error) {
																			done();
																			return response.status(200).json({ status: "failed", code: 'SA277', message: "Internal server Error on query selecting train3 games onsameday todaychk train3 c2 samedaychk" });
																		}
																		else {

																			if (results.rows.length > 0) {
																				done();
																				return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, gamedetails: results.rows, ass_status: 2, traincntval: 3, message: "Games Selected Successfully train3 games onsameday todaychk train3 c2 samedaychk" });
																			}
																			else {
																				done();
																				return response.status(200).json({ status: 'failed', code: 'SA278', mychkattempt: 0, gamedetails: "", ass_status: "", traincntval: 3, message: "Games not found train3 games onsameday todaychk train3 c2 samedaychk" });
																			}
																		}
																	})
															}
															else {
																///////////////////////////////////////
																client.query('SELECT count(DISTINCT game_id) as count FROM skillangels_userscore \
														where user_id=$1 and event_id=$2 and ass_status_id=$3 and current_year_status=$4', [uid, eid, 3, year_status],
																	(error, results) => {
																		if (error) {
																			done();
																			return response.status(200).json({ status: "failed", code: 'SA279', message: "Internal Server Error on query selecting postassStatus" });
																		}
																		else {

																			if (results.rows[0].count < 5) {
																				client.query('SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id \
																		FROM skillangels_gamemaster where skillangels_gamemaster.game_id in \
																		(select skillangels_gradecyclegame.game_id from skillangels_gradecyclegame \
																		where skillangels_gradecyclegame.cycle_id=$3 \
																		and skillangels_gradecyclegame.assess_status_id=$2 \
																		 and skillangels_gradecyclegame.grade_id in  \
																		(select skillangels_gradecyclegame.grade_id from skillangels_gradecyclegame  \
																		INNER JOIN skillangels_branchgradecyclegame ON skillangels_branchgradecyclegame.gcg_id = skillangels_gradecyclegame.gcg_id  \
																		INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.gradeid = skillangels_gradecyclegame.grade_id and   \
																		   skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
																		INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
																		INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
																		where skillangels_users.id=$1) \
																		and skillangels_gradecyclegame.gcg_id in  \
																		(select skillangels_branchgradecyclegame.gcg_id from skillangels_branchgradecyclegame  \
																		INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
																		INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
																		INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
																		where skillangels_users.id=$1) \
																		) ORDER BY skillangels_gamemaster.skill_id ASC  ', [uid, 3, -1],
																					(error, results) => {
																						if (error) {
																							done();
																							return response.status(200).json({ status: "failed", code: 'SA280', message: "Internal server Error on query selecting post games" });
																						}
																						else {
																							if (results.rows.length > 0) {
																								done();
																								return response.status(200).json({ status: 'success', code: 'SA000', gamedetails: results.rows, ass_status: 3, traincntval: 3, message: "Games Selected Successfully post" });
																							}
																							else {
																								done();
																								return response.status(200).json({ status: 'failed', code: 'SA281', gamedetails: "", ass_status: "", traincntval: 3, message: "Games not found post" });
																							}
																						}
																					})
																			}
																			else {
																				// console.log("asseign new games");
																				client.query('SELECT date FROM skillangels_userscore \
																			where user_id=$1 and event_id=$2 and ass_status_id=$3 and DATE(date)=(select getserverdate())', [uid, eid, 3],
																					(error, results) => {
																						if (error) {
																							done();
																							return response.status(200).json({ status: "failed", code: 'SA282', message: "Internal Server Error on query selecting post_date_chk" });
																						}
																						else {
																							if (results.rows.length > 0) {
																								client.query('SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id \
																							FROM skillangels_gamemaster where skillangels_gamemaster.game_id in \
																							(select skillangels_gradecyclegame.game_id from skillangels_gradecyclegame \
																							where skillangels_gradecyclegame.cycle_id=$3 \
																							and skillangels_gradecyclegame.assess_status_id=$2 \
																							 and skillangels_gradecyclegame.grade_id in  \
																							(select skillangels_gradecyclegame.grade_id from skillangels_gradecyclegame  \
																							INNER JOIN skillangels_branchgradecyclegame ON skillangels_branchgradecyclegame.gcg_id = skillangels_gradecyclegame.gcg_id  \
																							INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.gradeid = skillangels_gradecyclegame.grade_id and   \
																							   skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
																							INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
																							INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
																							where skillangels_users.id=$1) \
																							and skillangels_gradecyclegame.gcg_id in  \
																							(select skillangels_branchgradecyclegame.gcg_id from skillangels_branchgradecyclegame  \
																							INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
																							INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
																							INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
																							where skillangels_users.id=$1) \
																							) ORDER BY skillangels_gamemaster.skill_id ASC  ', [uid, 3, -1],
																									(error, results) => {
																										if (error) {
																											done();
																											return response.status(200).json({ status: "failed", code: 'SA283', message: "Internal server Error on query selecting post games onsameday" });
																										}
																										else {
																											if (results.rows.length > 0) {
																												done();
																												return response.status(200).json({ status: 'success', code: 'SA000', gamedetails: results.rows, ass_status: 3, traincntval: 3, message: "Games Selected Successfully post onsameday" });
																											}
																											else {
																												done();
																												return response.status(200).json({ status: 'failed', code: 'SA284', gamedetails: "", ass_status: "", traincntval: 3, message: "Games not found post onsameday" });
																											}
																										}
																									})


																							}
																							else {
																								client.query('SELECT date FROM skillangels_userscore \
																							where user_id=$1 and event_id=$2 and ass_status_id=$3 and DATE(date)=(select getserverdate())', [uid, eid, 6],
																									(error, results) => {
																										if (error) {
																											done();
																											return response.status(200).json({ status: "failed", code: 'SA285', message: "Internal Server Error on query selecting ass_status5_date_chk" });
																										}
																										else {
																											if (results.rows.length < 5) {
																												client.query('SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id \
																					FROM skillangels_gamemaster where skillangels_gamemaster.game_id in \
																					(select skillangels_gradecyclegame.game_id from skillangels_gradecyclegame \
																					where skillangels_gradecyclegame.cycle_id=(SELECT ((MOD( \
																						(select count(countval) from (select count(DISTINCT game_id) as countval from skillangels_userscore \
																					 where skillangels_userscore.user_id=$1 and skillangels_userscore.ass_status_id=$4 and skillangels_userscore.event_id=$3 \
																					 and skillangels_userscore.current_year_status=$5 \
																					 group by date)as table1 where countVal = 5),8) )+1)as count) \
																					and skillangels_gradecyclegame.assess_status_id=$2 \
																					 and skillangels_gradecyclegame.grade_id in  \
																					(select skillangels_gradecyclegame.grade_id from skillangels_gradecyclegame  \
																					INNER JOIN skillangels_branchgradecyclegame ON skillangels_branchgradecyclegame.gcg_id = skillangels_gradecyclegame.gcg_id  \
																					INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.gradeid = skillangels_gradecyclegame.grade_id and   \
																					   skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
																					INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
																					INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
																					where skillangels_users.id=$1) \
																					and skillangels_gradecyclegame.gcg_id in  \
																					(select skillangels_branchgradecyclegame.gcg_id from skillangels_branchgradecyclegame  \
																					INNER JOIN skillangels_schoolgrade ON skillangels_schoolgrade.branch_id = skillangels_branchgradecyclegame.branch_id \
																					INNER JOIN skillangels_schoolgradesections ON skillangels_schoolgradesections.gradeid = skillangels_schoolgrade.id \
																					INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id  \
																					where skillangels_users.id=$1) \
																					) ORDER BY skillangels_gamemaster.skill_id ASC', [uid, 2, eid, 6, year_status],
																													(error, results) => {
																														if (error) {
																															done();
																															return response.status(200).json({ status: "failed", code: 'SA286', message: "Internal server Error on query selecting newgames" });
																														}
																														else {

																															if (results.rows.length > 0) {
																																done();
																																return response.status(200).json({ status: 'success', code: 'SA000', gamedetails: results.rows, ass_status: 6, traincntval: 3, message: "Games Selected Successfully newgame" });
																															}
																															else {
																																done();
																																return response.status(200).json({ status: 'failed', code: 'SA287', gamedetails: "", ass_status: "", traincntval: 3, message: "Games not found newgames" });
																															}
																														}
																													})
																											}
																											else {

																												client.query('SELECT skillangels_gamemaster.gamename,skillangels_gamemaster.skill_id,skillangels_gamemaster.game_id \
																			FROM skillangels_gamemaster where skillangels_gamemaster.game_id in( select game_id from skillangels_userscore where user_id=$1 and event_id=$3 \
																				and ass_status_id=$2 and DATE(date)=(select getserverdate())) ORDER BY skillangels_gamemaster.skill_id ASC  ', [uid, 6, eid],
																													(error, results) => {
																														if (error) {
																															done();
																															return response.status(200).json({ status: "failed", code: 'SA288', message: "Internal server Error on query selecting newgames onsameday" });
																														}
																														else {

																															if (results.rows.length > 0) {
																																done();
																																return response.status(200).json({ status: 'success', code: 'SA000', gamedetails: results.rows, ass_status: 6, traincntval: 3, message: "Games Selected Successfully newgames onsameday" });
																															}
																															else {
																																done();
																																return response.status(200).json({ status: 'failed', code: 'SA289', gamedetails: "", ass_status: "", traincntval: 3, message: "Games not found newgames onsameday" });
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


																//////////////////////////////////////////
															}


														}
													})



											}
											else {
												client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
																								and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
													(error, results) => {
														if (error) {
															done();
															return response.status(200).json({ status: "failed", code: 'SA290', message: "Internal server Error on query selecting train3 games onsameday > date=0 c2 samedaychk" });
														}
														else {

															if (results.rows.length > 0) {
																done();
																return response.status(200).json({ status: 'success', code: 'SA000', mychkattempt: 1, gamedetails: results.rows, ass_status: 2, traincntval: 3, message: "Games Selected Successfully train3 games onsameday > date=0 c2 samedaychk" });
															}
															else {
																done();
																return response.status(200).json({ status: 'failed', code: 'SA291', mychkattempt: 0, gamedetails: "", ass_status: "", traincntval: 3, message: "Games not found train3 games onsameday > date=0 c2 samedaychk" });
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
			message: "getgamec2 caused exception"
		});
	}

}






const getScore = (request, response) => {
	const { uid, eid, ass_status, year_status, istrainingdata } = request.body;
	console.log(ass_status)

	try {
		pool.connect((err, client, done) => {
			if (err) {
				done();
				return response.status(200).json({ status: "failed", code: 'SA100', message: "Internal Server Error on selecting score" });
			}
			else {
				if (ass_status == 2) {
					if (istrainingdata == 0) {
						client.query('SELECT max(skillangels_userscore.score),sum(skillangels_userscore.score), \
						count(skillangels_userscore.score), \
						skillangels_userscore.game_id,skillangels_gamemaster.skill_id as skillid FROM \
						(select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
						and current_year_status =$4 order by actual_start_date desc LIMIT 1) as tab \
						INNER JOIN skillangels_userscore ON skillangels_userscore.user_id = tab.user_id \
						INNER JOIN skillangels_gamemaster ON skillangels_gamemaster.game_id = skillangels_userscore.game_id \
						where skillangels_userscore.user_id=$1 and skillangels_userscore.event_id=$2 \
						 and skillangels_userscore.ass_status_id=$3 \
						and DATE(skillangels_userscore.date)>= DATE(tab.actual_start_date) \
						GROUP BY skillangels_userscore.game_id,skillangels_gamemaster.skill_id \
						ORDER BY skillangels_gamemaster.skill_id ASC', [uid, eid, ass_status, year_status],
							(error, results) => {
								if (error) {
									done();
									return response.status(200).json({ status: "failed", code: 'SA292', message: "Internal Server Error on query selecting score ass2" });
								}
								else {
									console.log(results.rows)
									done();
									return response.status(200).json({ status: 'success', code: 'SA000', gameScoredetails: results.rows, message: "Score Selected Successfully ass2" });

								}
							})
					}
					else {
						client.query('SELECT max(skillangels_training_userscore.score),sum(skillangels_training_userscore.score) \
						,count(skillangels_training_userscore.score), \
						skillangels_training_userscore.game_id,skillangels_gamemaster.skill_id \
				as skillid FROM skillangels_training_userscore \
				INNER JOIN skillangels_gamemaster ON skillangels_gamemaster.game_id = skillangels_training_userscore.game_id \
				where user_id=$1 and event_id=$2 and ass_status_id=$3 \
				and DATE(date)=(select getserverdate()) GROUP BY skillangels_training_userscore.game_id,skillangels_gamemaster.skill_id \
				ORDER BY skillangels_gamemaster.skill_id ASC ', [uid, eid, ass_status],
							(error, results) => {
								if (error) {
									done();
									return response.status(200).json({ status: "failed", code: 'SA293', message: "Internal Server Error on query selecting score ass2 training" });
								}
								else {
									console.log(results.rows)
									done();
									return response.status(200).json({ status: 'success', code: 'SA000', gameScoredetails: results.rows, message: "Score Selected Successfully ass2 training" });

								}
							})
					}
				}
				else if (ass_status == 1 || ass_status == 3) {
					client.query('SELECT max(skillangels_userscore.score),sum(skillangels_userscore.score),count(skillangels_userscore.score), \
					skillangels_userscore.game_id,skillangels_gamemaster.skill_id as skillid FROM skillangels_userscore \
				INNER JOIN skillangels_gamemaster ON skillangels_gamemaster.game_id = skillangels_userscore.game_id \
				where user_id=$1 and event_id=$2 and ass_status_id=$3 and current_year_status=$4 \
				GROUP BY skillangels_userscore.game_id,skillangels_gamemaster.skill_id \
				ORDER BY skillangels_gamemaster.skill_id ASC ', [uid, eid, ass_status, year_status],
						(error, results) => {
							if (error) {
								done();
								return response.status(200).json({ status: "failed", code: 'SA294', message: "Internal Server Error on query selecting score ass1&3" });
							}
							else {

								done();
								return response.status(200).json({ status: 'success', code: 'SA000', gameScoredetails: results.rows, message: "Score Selected Successfully ass1&3" });

							}
						})
				}
				else {
					client.query('SELECT max(skillangels_userscore.score),sum(skillangels_userscore.score),count(skillangels_userscore.score),skillangels_userscore.game_id,skillangels_gamemaster.skill_id \
				as skillid FROM skillangels_userscore \
				INNER JOIN skillangels_gamemaster ON skillangels_gamemaster.game_id = skillangels_userscore.game_id \
				where user_id=$1 and event_id=$2 and ass_status_id=$3 and DATE(date)=(select getserverdate()) \
				GROUP BY skillangels_userscore.game_id,skillangels_gamemaster.skill_id \
				ORDER BY skillangels_gamemaster.skill_id ASC', [uid, eid, 6],
						(error, results) => {
							if (error) {
								done();
								return response.status(200).json({ status: "failed", code: 'SA295', message: "Internal Server Error on query selecting score ass6" });
							}
							else {

								done();
								return response.status(200).json({ status: 'success', code: 'SA000', gameScoredetails: results.rows, message: "Score Selected Successfully ass6" });

							}
						})
				}
			}
		})
	} catch (e) {
		return response.status(200).json({
			code: "SA120",
			status: "failed",
			message: "getScore caused exception"
		});
	}
}


const getTrophy = (request, response) => {
	const { uid, ass_status, eid, year_status } = request.body;

	try {
		pool.connect((err, client, done) => {
			if (err) {
				done();
				return response.status(200).json({ status: "failed", code: 'SA100', message: "Internal Server Error on selecting puzzletrophy" });
			}
			else {
				if (ass_status == 2) {
					client.query('select order_id, max_m_score as max_m_score, \
					max_v_score as max_v_score,max_f_score as max_f_score,max_p_score as max_p_score, \
					max_l_score as max_l_score from ( select ROW_NUMBER () OVER (ORDER BY date) as order_id,* from skillangels_usermaxscore \
					where  user_id=$1 and assess_status_id=$2 and current_year_status=$3) as newtb \
				    where order_id>(((select CEIL((SELECT CAST ((select count(date) from skillangels_usermaxscore \
					where user_id=$1 and current_year_status=$3) AS FLOAT)/8)) )-1)*8) \
					and \
					order_id<(((select CEIL((SELECT CAST ((select count(date) from skillangels_usermaxscore \
					where user_id=$1 and current_year_status=$3) AS FLOAT)/8)) )*8)+1)  ORDER BY order_id ASC ',
						[uid, ass_status, year_status],
						(error, results) => {
							if (error) {
								done();
								return response.status(200).json({ status: "failed", code: 'SA296', message: "Internal Server Error on query selecting puzzletrophy ass2" });
							}
							else {
								client.query('select mod(count(date),8),(select count(*) as countval \
								 from skillangels_games_cylce_entry \
									where user_id =$1 and event_id =$2 \
									and current_year_status =$3) \
									from skillangels_userfinishcycle \
								where user_id=$1 and current_year_status=$3', [uid, eid, year_status],
									(error, resultschk) => {
										if (error) {
											console.log("error")
											done();
											return response.status(200).json({ status: "failed", code: 'SA297', message: "Internal Server Error on query selecting istropy " });
										}
										else {

											if (resultschk.rows[0].mod == 0) {
												if (resultschk.rows[0].countval == 9 || resultschk.rows[0].countval == 17
													|| resultschk.rows[0].countval == 25 || resultschk.rows[0].countval == 33
													|| resultschk.rows[0].countval == 41 || resultschk.rows[0].countval == 49) {
													done();
													return response.status(200).json({ status: 'success', code: 'SA000', getTrophy: results.rows, message: "trophy Selected Successfully ass2 remove" });
												}
												else {
													done();
													return response.status(200).json({ status: 'success', code: 'SA000', getTrophy: results.rows, message: "trophy Selected Successfully ass2" });
												}
											}
											else {
												done();
												return response.status(200).json({ status: 'success', code: 'SA000', getTrophy: results.rows, message: "trophy Selected Successfully ass2" });

											}
										}
									})

							}
						})
				}
				else if (ass_status == 1 || ass_status == 3) {
					client.query('select skillangels_userscore.score,skillangels_gamemaster.skill_id from skillangels_userscore  \
					INNER JOIN skillangels_gamemaster ON skillangels_gamemaster.game_id = skillangels_userscore.game_id  \
					where  skillangels_userscore.user_id=$1 and  skillangels_userscore.ass_status_id=$2 and skillangels_userscore.event_id=$3 \
					and skillangels_userscore.current_year_status=$4\
					ORDER BY skillangels_gamemaster.skill_id asc ', [uid, ass_status, eid, year_status],
						(error, results) => {
							if (error) {
								done();
								return response.status(200).json({ status: "failed", code: 'SA298', message: "Internal Server Error on query selecting puzzletrophy ass1&3" });
							}
							else {
								done();
								return response.status(200).json({ status: 'success', code: 'SA000', getTrophy: results.rows, message: "trophy Selected Successfully ass1&3" });

							}
						})
				}
				else {

					client.query('select skillangels_userscore.score,skillangels_gamemaster.skill_id from skillangels_userscore  \
					INNER JOIN skillangels_gamemaster ON skillangels_gamemaster.game_id = skillangels_userscore.game_id  \
					where  skillangels_userscore.user_id=$1 and  skillangels_userscore.ass_status_id=$2 and event_id=$3 and DATE(date)=(select getserverdate()) \
					ORDER BY skillangels_gamemaster.skill_id asc ', [uid, 6, eid],
						(error, results) => {
							if (error) {
								done();
								return response.status(200).json({ status: "failed", code: 'SA299', message: "Internal Server Error on query selecting puzzletrophy ass6" });
							}
							else {
								done();
								return response.status(200).json({ status: 'success', code: 'SA000', getTrophy: results.rows, message: "trophy Selected Successfully ass6" });

							}
						})

				}
			}
		})
	} catch (e) {
		return response.status(200).json({
			code: "SA120",
			status: "failed",
			message: "getTrophy caused exception"
		});
	}
}

const getquescnt = (request, response) => {
	const { uid, eid, ass_status, year_status, istrainingdata } = request.body;
	console.log("ass_status" + ass_status)
	try {
		pool.connect((err, client, done) => {
			if (err) {
				console.log("outerror")
				done();
				return response.status(200).json({ status: "failed", code: 'SA100', message: "Internal Server Error on selecting gamesquescnt" });
			}
			else {
				if (ass_status == 1 || ass_status == 3) {
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
								return response.status(200).json({ status: "failed", code: 'SA300', message: "Internal Server Error on query selecting gamesquescnt ass1&3" });
							}
							else {
								console.log(results.rows)
								done();
								return response.status(200).json({ status: 'success', code: 'SA000', getquescnt: results.rows, message: "gamesquescnt Selected Successfully ass1&3" });

							}
						})
				}
				else if (ass_status == 2) {
					if (istrainingdata == 0) {

						client.query('select count(skillangels_gameques_entry.game_id),(skillangels_gamemaster.skill_id) \
						from (select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
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
							[uid, eid, ass_status, year_status],
							(error, results) => {
								if (error) {
									console.log("error")
									done();
									return response.status(200).json({ status: "failed", code: 'SA301', message: "Internal Server Error on query selecting gamesquescnt aas2" });
								}
								else {
									console.log(results.rows)
									done();
									return response.status(200).json({ status: 'success', code: 'SA000', getquescnt: results.rows, message: "gamesquescnt Selected Successfully ass2" });

								}
							})
					}
					else {
						client.query('select count(skillangels_training_gameques_entry.game_id),skillangels_gamemaster.skill_id \
					from skillangels_training_gameques_entry \
					INNER JOIN skillangels_gamemaster ON skillangels_gamemaster.game_id = skillangels_training_gameques_entry.game_id \
					where user_id=$1 and DATE(answeredtime)=(select getserverdate())\
					and event_id=$2 and ass_status_id=$3 and current_year_status=$4  \
					group by skillangels_training_gameques_entry.game_id,skillangels_gamemaster.skill_id \
					ORDER BY skillangels_gamemaster.skill_id ASC',
							[uid, eid, ass_status, year_status],
							(error, results) => {
								if (error) {
									console.log("error")
									done();
									return response.status(200).json({ status: "failed", code: 'SA302', message: "Internal Server Error on query selecting gamesquescnt aas2 training" });
								}
								else {
									console.log(results.rows)
									done();
									return response.status(200).json({ status: 'success', code: 'SA000', getquescnt: results.rows, message: "gamesquescnt Selected Successfully ass2 training" });

								}
							})
					}
				}
				else {
					client.query('select count(skillangels_gameques_entry.game_id),skillangels_gamemaster.skill_id \
				from skillangels_gameques_entry \
				INNER JOIN skillangels_gamemaster ON skillangels_gamemaster.game_id = skillangels_gameques_entry.game_id \
				where user_id=$1 and DATE(answeredtime)=(select getserverdate())\
				and event_id=$2 and ass_status_id=$3 and current_year_status=$4  \
				group by skillangels_gameques_entry.game_id,skillangels_gamemaster.skill_id \
				ORDER BY skillangels_gamemaster.skill_id ASC ', [uid, eid, ass_status, year_status],
						(error, results) => {
							if (error) {
								console.log("error")
								done();
								return response.status(200).json({ status: "failed", code: 'SA303', message: "Internal Server Error on query selecting gamesquescnt ass6" });
							}
							else {
								console.log(results.rows)
								done();
								return response.status(200).json({ status: 'success', code: 'SA000', getquescnt: results.rows, message: "gamesquescnt Selected Successfully ass6" });

							}
						})
				}


			}
		})
	} catch (e) {
		return response.status(200).json({
			code: "SA120",
			status: "failed",
			message: "getquescnt caused exception"
		});
	}
}
const getDaChk = (request, response) => {
	const { uid, year_status } = request.body;

	try {
		pool.connect((err, client, done) => {
			if (err) {
				done();
				return response.status(200).json({ status: "failed", code: 'SA100', message: "Internal Server Error on selecting getDaChk" });
			}
			else {
				client.query('select * from skillangels_users where id=$1 and current_year_status=$2 ', [uid, year_status],
					(error, results) => {
						if (error) {
							console.log("error")
							done();
							return response.status(200).json({ status: "failed", code: 'SA304', message: "Internal Server Error on query selecting getDaChk " });
						}
						else {
							if ((results.rows[0].rule_flag) == 0) {
								client.query('UPDATE skillangels_users SET rule_flag =1 where id=$1 and current_year_status=$2', [uid, year_status],
									(error, results) => {
										if (error) {
											console.log("error")
											done();
											return response.status(200).json({ status: "failed", code: 'SA304', message: "Internal Server Error on query updating getDaChk " });
										}
										else {
											done();
											return response.status(200).json({ status: 'success', code: 'SA000', getDaChk: 1, message: "getDaChk Selected Successfully" });
										}
									})
							}
							else {
								done();
								return response.status(200).json({ status: 'success', code: 'SA000', getDaChk: 0, message: "getDaChk Selected Successfully" });
							}

						}
					})

			}
		})
	}
	catch (e) {
		return response.status(200).json({
			code: "SA120",
			status: "failed",
			message: "getDaChk caused exception"
		});
	}
}
var today = new Date();
var dateData1; var dateData;
const getsnd = (request, response) => {
	const { uid, eid, year_status, ass_status_id } = request.body;

	try {
		pool.connect((err, client, done) => {
			if (err) {
				done();
				return response.status(200).json({ status: "failed", code: 'SA100', message: "Internal Server Error on selecting getsnd" });
			}
			else {
				if (ass_status_id == 2) {
					client.query('select * \
					from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
					and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
						(error2, results2) => {
							if (error2) {
								console.log("error2")
								done();
								return response.status(200).json({ status: "failed", code: 'SA304', message: "Internal Server Error on query selecting Date details on getsnd skillkit" });
							}
							else {
								if (results2.rows[0].played_end_date != null) {
									dateData1 = results2.rows[0].played_end_date;
								}
								else {
									dateData1 = 0;
								}

								client.query('select actual_end_date,(select count(*) from (select actual_end_date as mydate  \
                    from skillangels_games_cylce_entry where  \
                    user_id =$1 and event_id =$2 \
                    and current_year_status =$3 order by actual_start_date desc LIMIT 1) as newtb \
                    where (select getserverdate()) > Date(mydate))  \
                    from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
                    and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
									(error1, results1) => {
										if (error1) {
											console.log("error1")
											done();
											return response.status(200).json({ status: "failed", code: 'SA304', message: "Internal Server Error on query selecting Date details on getsnd games" });
										}
										else {

											if (results1.rows[0].count > 0) {
												dateData = addDays(today, 1);
											}
											else {
												dateData = addDays(results1.rows[0].actual_end_date, 1);
											}
											today = new Date();
											client.query('select * from skillangels_users where id=$1 and current_year_status=$2 ', [uid, year_status],
												(error, results) => {
													if (error) {
														console.log("error")
														done();
														return response.status(200).json({ status: "failed", code: 'SA304', message: "Internal Server Error on query selecting getsnd " });
													}
													else {
														console.log(results.rows)
														done();
														return response.status(200).json({ status: 'success', code: 'SA000', getsnd: results.rows, gamesdatedetails: dateData, dateData1: dateData1, message: "getsnd Selected Successfully" });

													}
												})
										}
									})
							}
						})
				}
				else {
					client.query('select * from skillangels_users where id=$1 and current_year_status=$2 ', [uid, year_status],
						(error, results) => {
							if (error) {
								console.log("error")
								done();
								return response.status(200).json({ status: "failed", code: 'SA304', message: "Internal Server Error on query selecting getsnd " });
							}
							else {
								console.log(results.rows)
								done();
								return response.status(200).json({ status: 'success', code: 'SA000', getsnd: results.rows, gamesdatedetails: 0, dateData1: 0, message: "getsnd Selected Successfully" });

							}
						})
				}
			}
		})
	} catch (e) {
		return response.status(200).json({
			code: "SA120",
			status: "failed",
			message: "getsnd caused exception"
		});
	}
}

var updatestratdate;
var playactualchk = 0;
const getorggame = (request, response) => {
	const { uid, eid, year_status, ass_status_id, date, mem, vp, fa, ps, lin, memnam, vpnam, fanam, psnam, linnam } = request.body;
	console.log(" uid, eid, year_status, ass_status_id, date," + uid + eid + year_status + ass_status_id + date)
	try {
		pool.connect((err, client, done) => {
			if (err) {
				done();
				return response.status(200).json({ status: "failed", code: 'SA100', message: "Internal Server Error on selecting getorggame" });
			}
			else {
				client.query('select getserverdate()',
					(error, results) => {
						if (error) {
							console.log("error")
							done();
							return response.status(200).json({ status: "failed", code: 'SA375', message: "Internal Server Error on query serverdate " });
						}
						else {
							updatestratdate = results.rows[0].getserverdate;
							if (ass_status_id == 2) {

								client.query('select startdate \
								 from skillangels_schoolgradesections \
								INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id   \
								where skillangels_users.id=$1 and \
								(select getserverdate()) >= Date(skillangels_schoolgradesections.startdate)', [uid],
									(error, results) => {
										if (error) {
											console.log("error")
											done();
											return response.status(200).json({ status: "failed", code: 'SA312', message: "Internal Server Error on query selecting getorggamechk firstinsrt select data" });
										}
										else {
											if (results.rows.length > 0) {



												client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
					and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
													(error, results) => {
														if (error) {
															console.log("error")
															done();
															return response.status(200).json({ status: "failed", code: 'SA305', message: "Internal Server Error on query selecting sttaus getorggamechk " });
														}
														else {
															console.log(results.rows)
															if (results.rows.length > 0) {
																if (results.rows[0].status == 1) {
																	////////////////////////
																	client.query('select * from (select * from skillangels_games_cylce_entry where \
														user_id =$1 and event_id =$2  \
												   and current_year_status =$3 order by actual_start_date desc LIMIT 1) as newtb \
												   where (select getserverdate()) > Date(actual_end_date)', [uid, eid, year_status],
																		(error, results) => {
																			if (error) {
																				console.log("error")
																				done();
																				return response.status(200).json({ status: "failed", code: 'SA306', message: "Internal Server Error on query selecting > date getorggamechk " });
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
																								return response.status(200).json({ status: "failed", code: 'SA307', message: "Internal Server Error on query selecting todaychk getorggamechk " });
																							}
																							else {
																								if (results.rows.length > 0) {

																									client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
																	and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
																										(error, results) => {
																											if (error) {
																												console.log("error")
																												done();
																												return response.status(200).json({ status: "failed", code: 'SA308', message: "Internal Server Error on query selecting todaychk data getorggamechk " });
																											}
																											else {
																												console.log(results.rows)
																												done();
																												return response.status(200).json({ status: 'success', code: 'SA000', orggamechk: 1, getorggame: results.rows, message: "todaychk data getorggamechk Selected Successfully " });
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
																												return response.status(200).json({ status: "failed", code: 'SA309', message: "Internal Server Error on query selecting played<actual getorggamechk " });
																											}
																											else {
																												playactualchk = results.rows[0].count;
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
																																return response.status(200).json({ status: "failed", code: 'SA309', message: "Internal Server Error on query selecting getorggamechk nxtcycledata" });
																															}
																															else {
																																client.query('Insert into skillangels_games_cylce_entry\
																													(user_id, mem_game_id, vp_game_id , fa_game_id , ps_game_id, lin_game_id ,mem_name,vp_name,  \
																												   fa_name,ps_name,lin_name,ass_status_id, event_id , \
																										   current_year_status ,actual_start_date,actual_end_date,played_start_date \
																											   ) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)',
																																	[uid, mem, vp, fa, ps, lin, memnam, vpnam, fanam, psnam, linnam, ass_status_id,
																																		eid, year_status, addDays(results.rows[0].actual_end_date, 1), addDays(results.rows[0].storedplayed_end_date, 7), updatestratdate], (error, results) => {
																																			if (error) {
																																				console.log(error)
																																				done();
																																				response.status(200).json({ status: 'failed', code: 'SA310', message: 'query insert failed in getorggamechk nxtcycledata' });
																																			}
																																			else {
																																				done();
																																				response.status(200).json({ status: 'success', code: 'SA000', orggamechk: 0, message: 'getorggamechk nxtcycledata inserted successfully' });
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
																																return response.status(200).json({ status: "failed", code: 'SA309', message: "Internal Server Error on query selecting getorggamechk nxtcycledata" });
																															}
																															else {
																																client.query('Insert into skillangels_games_cylce_entry\
																						(user_id, mem_game_id, vp_game_id , fa_game_id , ps_game_id, lin_game_id ,mem_name,vp_name,  \
																					   fa_name,ps_name,lin_name,ass_status_id, event_id , \
																			   current_year_status ,actual_start_date,actual_end_date,played_start_date \
																				   ) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)',
																																	[uid, mem, vp, fa, ps, lin, memnam, vpnam, fanam, psnam, linnam, ass_status_id,
																																		eid, year_status, addDays(results.rows[0].played_end_date, 1), addDays(results.rows[0].storedplayed_end_date, 7), updatestratdate], (error, results) => {
																																			if (error) {
																																				console.log(error)
																																				done();
																																				response.status(200).json({ status: 'failed', code: 'SA310', message: 'query insert failed in getorggamechk nxtcycledata' });
																																			}
																																			else {
																																				done();
																																				response.status(200).json({ status: 'success', code: 'SA000', orggamechk: 0, message: 'getorggamechk nxtcycledata inserted successfully' });
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

																					client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
															and current_year_status =$3 order by actual_start_date desc LIMIT 1', [uid, eid, year_status],
																						(error, results) => {
																							if (error) {
																								console.log("error")
																								done();
																								return response.status(200).json({ status: "failed", code: 'SA311', message: "Internal Server Error on query selecting > date =0 getorggamechk " });
																							}
																							else {
																								console.log(results.rows)
																								done();
																								return response.status(200).json({ status: 'success', code: 'SA000', orggamechk: 1, getorggame: results.rows, message: "getorggame Selected Successfully > date =0" });
																							}
																						})



																				}
																			}
																		})

																	//////////////////////////////////////////////////
																}
																else {
																	console.log(results.rows)
																	done();
																	return response.status(200).json({ status: 'success', code: 'SA000', orggamechk: 1, getorggame: results.rows, message: "getorggame Selected Successfully status =0" });
																}

															}
															else {
																client.query('select startdate,(select startdate from skillangels_schoolgradesections \
										INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id   \
										where skillangels_users.id=$1) as storestartdate \
									 from skillangels_schoolgradesections \
									INNER JOIN skillangels_users ON skillangels_users.section_id = skillangels_schoolgradesections.id   \
									where skillangels_users.id=$1', [uid],
																	(error, results) => {
																		if (error) {
																			console.log("error")
																			done();
																			return response.status(200).json({ status: "failed", code: 'SA312', message: "Internal Server Error on query selecting getorggamechk firstinsrt select data" });
																		}
																		else {

																			client.query('Insert into skillangels_games_cylce_entry\
																	(user_id, mem_game_id, vp_game_id , fa_game_id , ps_game_id, lin_game_id ,mem_name,vp_name,  \
																	fa_name,ps_name,lin_name,ass_status_id, event_id , \
																		current_year_status ,actual_start_date,actual_end_date,played_start_date \
																		) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)',
																				[uid, mem, vp, fa, ps, lin, memnam, vpnam, fanam, psnam, linnam, ass_status_id,
																					eid, year_status, results.rows[0].storestartdate, addDays(results.rows[0].startdate, 6), updatestratdate], (error, results) => {
																						if (error) {
																							console.log(error)
																							done();
																							response.status(200).json({ status: 'failed', code: 'SA313', message: 'query insert failed in orggamechk firstinsrt' });
																						}
																						else {
																							done();
																							response.status(200).json({ status: 'success', code: 'SA000', orggamechk: 0, message: 'orggamechk inserted successfully firstinsrt' });
																						}
																					})
																		}
																	})




															}


														}
													})

											}
											else {
												done();
												response.status(200).json({ status: 'failed', code: 'SA451', message: 'orggamechk stratdate< current date' });
											}
										}
									})



							}
							else {

								client.query('select *,(select count(*) as count from skillangels_games_entry where user_id =$1 and event_id =$2 \
				            and current_year_status =$3 and Date(date)=(select getserverdate())) from skillangels_games_entry where user_id =$1 and event_id =$2 \
				              and current_year_status =$3', [uid, eid, year_status],
									(error, results) => {
										if (error) {
											console.log("error")
											done();
											return response.status(200).json({ status: "failed", code: 'SA314', message: "Internal Server Error on query selecting getorggamechk " });
										}
										else {

											if (results.rows.length > 0) {

												if (results.rows[0].ass_status_id == ass_status_id) {
													if (ass_status_id == 2 || ass_status_id == 6) {

														if (results.rows[0].count > 0) {
															console.log(results.rows)
															done();
															return response.status(200).json({ status: 'success', code: 'SA000', orggamechk: 1, getorggame: results.rows, message: "getorggame Selected Successfully" });
														}
														else {
															client.query('UPDATE skillangels_games_entry SET user_id=$1, mem_game_id=$2, vp_game_id=$3 , \
									fa_game_id =$4, ps_game_id=$5, lin_game_id=$6 , event_id =$7, \
									current_year_status =$8,date=$9,status=$10,ass_status_id =$11,\
									mem_name=$12,vp_name=$13,  \
								fa_name=$14,ps_name=$15,lin_name=$16 \
									where user_id=$1 and  event_id =$7 and current_year_status =$8',
																[uid, mem, vp, fa, ps, lin, eid, year_status, updatestratdate, 1, ass_status_id, memnam, vpnam, fanam, psnam, linnam], (error, results) => {
																	if (error) {
																		console.log(error)
																		done();
																		response.status(200).json({ status: 'failed', code: 'SA315', message: 'skillangels_games_entry updation failed ass2&6' });
																	}
																	else {
																		done();
																		response.status(200).json({ status: 'success', code: 'SA000', orggamechk: 0, message: 'skillangels_games_entry updated successfully' });
																	}
																})
														}

													}
													else {
														console.log(results.rows)
														done();
														return response.status(200).json({ status: 'success', code: 'SA000', orggamechk: 1, getorggame: results.rows, message: "getorggame Selected Successfully" });

													}

												}
												else {

													client.query('UPDATE skillangels_games_entry SET user_id=$1, mem_game_id=$2, vp_game_id=$3 , \
									fa_game_id =$4, ps_game_id=$5, lin_game_id=$6 , event_id =$7, \
									current_year_status =$8,date=$9,status=$10,ass_status_id =$11,\
									mem_name=$12,vp_name=$13,  \
								fa_name=$14,ps_name=$15,lin_name=$16 \
									where user_id=$1 and  event_id =$7 and current_year_status =$8',
														[uid, mem, vp, fa, ps, lin, eid, year_status, updatestratdate, 1, ass_status_id, memnam, vpnam, fanam, psnam, linnam], (error, results) => {
															if (error) {
																console.log(error)
																done();
																response.status(200).json({ status: 'failed', code: 'SA316', message: 'skillangels_games_entry updation failed' });
															}
															else {
																done();
																response.status(200).json({ status: 'success', code: 'SA000', orggamechk: 0, message: 'skillangels_games_entry updated successfully' });
															}
														})

												}



											}
											else {
												client.query('Insert into skillangels_games_entry\
							(user_id, mem_game_id, vp_game_id , fa_game_id , ps_game_id, lin_game_id , event_id , \
								current_year_status ,status,ass_status_id,mem_name,vp_name,  \
								fa_name,ps_name,lin_name \
								) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)',
													[uid, mem, vp, fa, ps, lin, eid, year_status, 1, ass_status_id, memnam, vpnam, fanam, psnam, linnam], (error, results) => {
														if (error) {
															console.log(error)
															done();
															response.status(200).json({ status: 'failed', code: 'SA317', message: 'query insert failed in skillangels_games_entry' });
														}
														else {
															done();
															response.status(200).json({ status: 'success', code: 'SA000', orggamechk: 0, message: 'skillangels_games_entry inserted successfully' });
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
			message: "getorggame caused exception"
		});
	}
}


function addDays(dateObj, numDays) {
	dateObj.setDate(dateObj.getDate() + numDays);
	console.log(dateObj);
	return dateObj;
}



const getass2trainchk = (request, response) => {
	const { uid, eid, year_status, ass_status_id } = request.body;

	try {
		pool.connect((err, client, done) => {
			if (err) {
				done();
				return response.status(200).json({ status: "failed", code: 'SA100', message: "Internal Server Error on selecting getass2trainchk" });
			}
			else {


				client.query('select count(*),(select count(*) from (select * from skillangels_games_cylce_entry where \
					user_id =$1 and event_id =$2 \
					and current_year_status =$3 order by actual_start_date desc LIMIT 1) as tab1 \
					INNER JOIN skillangels_userscore ON skillangels_userscore.user_id = tab1.user_id  \
					where skillangels_userscore.user_id=$1 and skillangels_userscore.event_id=$2 \
					and skillangels_userscore.ass_status_id=$4 and skillangels_userscore.current_year_status =$3 \
					and (select getserverdate()) = DATE(skillangels_userscore.date)) as datecnt \
					from (select * from skillangels_games_cylce_entry where \
					user_id =$1 and event_id =$2 \
					and current_year_status =$3 order by actual_start_date desc LIMIT 1) as tab \
					INNER JOIN skillangels_userscore ON skillangels_userscore.user_id = tab.user_id \
					where skillangels_userscore.user_id=$1 and skillangels_userscore.event_id=$2 \
					and skillangels_userscore.ass_status_id=$4 \
					and skillangels_userscore.current_year_status =$3  \
					and DATE(skillangels_userscore.date) >= DATE(tab.actual_start_date) ', [uid, eid, year_status, ass_status_id],
					(error, results) => {
						if (error) {
							console.log("error")
							done();
							return response.status(200).json({ status: "failed", code: 'SA318', message: "Internal Server Error on query selecting getass2trainchk " });
						}
						else {
							if (results.rows[0].count > 0) {
								if (results.rows[0].count == 25 && results.rows[0].datecnt < 1) {
									done();
									return response.status(200).json({ status: 'success', code: 'SA000', getass2trainchk: 1, message: "getass2trainchk 1 Selected Successfully" });
								}
								else {
									done();
									return response.status(200).json({ status: 'success', code: 'SA000', getass2trainchk: 0, message: "getass2trainchk 0 Selected Successfully" });
								}
							}
							else {
								done();
								return response.status(200).json({ status: 'success', code: 'SA000', getass2trainchk: 0, message: "getass2trainchk 0 Selected Successfully" });
							}

						}
					})
			}
		})
	} catch (e) {
		return response.status(200).json({
			code: "SA120",
			status: "failed",
			message: "getass2trainchk caused exception"
		});
	}
}







module.exports = {
	getgame, getDaChk,
	getScore, getTrophy, getquescnt, getsnd, getgamec2, getorggame, getass2trainchk
};



