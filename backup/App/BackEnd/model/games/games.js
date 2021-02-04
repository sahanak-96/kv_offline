const Pool = require('pg').Pool
config = require("../dbconfig");
db = config.database;
const pool = new Pool(db);

//================================
var crowniescount = 0;
var today;
var chkcnt = 0;
var statuschk = 0;
const gamescore = (request, response) => {
	const { uid, gameid, eid, score, ccnt, wcnt, aqcnt, tqcnt, rtime, crtime, wrtime,
		gtime, ass_status, ass_slot, year_status, Angisass2train } = request.body;
	crowniescount = 6;
	if (Number(aqcnt) > 0) { crowniescount += Number(aqcnt); }
	if (Number(score) > 60) { crowniescount += 5; }
	if (Number(ccnt) > 0) { crowniescount += Number(ccnt) * 2; }
	if (Number(ccnt) == Number(tqcnt)) { crowniescount += 10; }
	console.log("crowniescount" + crowniescount);
	console.log("ass_status" + ass_status);
	try {
		pool.connect((err, client, done) => {
			// console.log("uid : " + uid + " gameid :  " + gameid + " eid : " + eid + " score : " + score + " ccnt : " + ccnt + " wcnt : " + wcnt +
			// 	" aqcnt : " + aqcnt + " tqcnt : " + tqcnt + " rtime : " + rtime + " wrtime : " + wrtime + " crtime : " + crtime + " gtime :" + gtime +
			//  " ass_status : " + ass_status + " ass_slot : " + ass_slot + " year_status :" + year_status);
			if (err) {
				console.log(err);
				done();
				return response.status(200).json({ status: "failed", code: 'SA100', message: "Internal Server Error on inserting game score" });
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
							today = results.rows[0].getserverdate;
							if (ass_status == 2) {
								if (Angisass2train == 0) {
									client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
					and current_year_status =$3 order by actual_start_date desc LIMIT 1',
										[uid, eid, year_status], (error, results) => {
											if (error) {
												console.log(error)
												done();
												response.status(200).json({ status: 'failed', code: 'SA323', message: 'selction of skillangels_games_cylce_entry on userscore of ass2' });
											}
											else {
												if (results.rows.length > 0) {
													statuschk = results.rows[0].status;
												}
												else {
													statuschk = 0;
												}

												client.query('select count(*),(select count(skillangels_userscore.ansquescnt) as scorecnt \
					from (select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$3 \
					 and current_year_status =$5 order by actual_start_date desc LIMIT 1) as tab3 \
					 INNER JOIN skillangels_userscore ON skillangels_userscore.user_id = tab3.user_id  \
					where skillangels_userscore.user_id=$1 and skillangels_userscore.event_id=$3 \
					 and skillangels_userscore.ass_status_id=$4 and skillangels_userscore.current_year_status =$5 \
					 and  game_id = $2 \
					 and DATE(skillangels_userscore.date)>= Date(tab3.actual_start_date)), \
					 (select sum(skillangels_userscore.ansquescnt) as res \
					 from (select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$3 \
						and current_year_status =$5 order by actual_start_date desc LIMIT 1) as tab2 \
						INNER JOIN skillangels_userscore ON skillangels_userscore.user_id = tab2.user_id  \
					   where skillangels_userscore.user_id=$1 and skillangels_userscore.event_id=$3 \
						and skillangels_userscore.ass_status_id=$4 and skillangels_userscore.current_year_status =$5 \
						and  game_id = $2 \
						and DATE(skillangels_userscore.date)>= Date(tab2.actual_start_date)) \
					from (select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$3 \
					 and current_year_status =$5 order by actual_start_date desc LIMIT 1) as tab1 \
					 INNER JOIN skillangels_gameques_entry ON skillangels_gameques_entry.user_id = tab1.user_id \
					where skillangels_gameques_entry.user_id =$1 and skillangels_gameques_entry.game_id = $2 \
					and skillangels_gameques_entry.ass_status_id = $4 and skillangels_gameques_entry.event_id =$3 \
					and skillangels_gameques_entry.current_year_status=$5 and  \
					Date(skillangels_gameques_entry.answeredtime) >= Date(tab1.actual_start_date)',
													[uid, gameid, eid, ass_status, year_status], (error, results) => {
														if (error) {
															console.log(error);
															done();
															response.status(200).json({ status: 'failed', code: 'SA324', message: 'internal server error on query selecting count & res of ass2' });
														}
														else {

															if (results.rows[0].res == null) {
																results.rows[0].res = 0;
															}
															if (ass_status == 2) {
																if (statuschk == 1) {
																	chkcnt = 5;
																}
																else {
																	chkcnt = 1;
																}
															}
															else {
																chkcnt = 1;
															}
															// console.log(results.rows[0].scorecnt + " cccccccccc");
															// console.log(results.rows[0].count + " cccccccccc" + (Number(results.rows[0].res) + Number(aqcnt)))
															if ((results.rows[0].count == (Number(results.rows[0].res) + Number(aqcnt))) &&
																(results.rows[0].scorecnt < chkcnt)) {
																//////////////////////////////////////////////////
																client.query("BEGIN", err => {
																	console.log("BEGIN");
																	if (err) {
																		done();
																	}
																	else {


																		console.log("entered to insert")
																		client.query('INSERT INTO skillangels_userscore (user_id,game_id,event_id,score,correctcnt,wrongcnt,ansquescnt, \
										totalquescnt,responsetime,wrongresponsetime,correctresponsetime,gametime,status,ass_status_id,ass_slot,current_year_status) \
									VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,1,$13,$14,$15)', [uid, gameid, eid, score, ccnt, wcnt,
																			aqcnt, tqcnt, rtime, wrtime, crtime, gtime, ass_status, ass_slot, year_status],
																			(error, results) => {
																				if (error) {
																					console.log("error" + error);
																					done();
																					return response.status(200).json({ status: "failed", code: 'SA325', message: "Internal Server Error on query inserting gamescore ass2" });
																				}
																				else {
																					if (ass_status == 2) {
																						console.log(results)
																						client.query('INSERT INTO skillangels_crownylog (uid,crowny,status,reason,current_year_status) \
										VALUES ($1,$2,$3,$4,$5)', [uid, crowniescount, -1, "puzzle completed", year_status],
																							(error, results) => {
																								if (error) {
																									client.query("ROLLBACK", err => {
																										if (err) {
																											done();
																											return response.status(200).json({ status: "failed", code: 'SA326', message: "Internal Server Error on rollback error crowny ass2" });
																										}
																										else {
																											done();
																											return response.status(200).json({ status: "failed", code: 'SA327', message: "Internal Server Error on rollback complete crowny ass2" });
																										}
																									});
																								}
																								else {
																									client.query('select set_total_score($1,$2,$3,$4,$5,$6)', [uid, eid, score, crowniescount, today, year_status],
																										(error, results) => {
																											if (error) {
																												console.log(error)
																												client.query("ROLLBACK", err => {
																													if (err) {
																														done();
																														return response.status(200).json({ status: "failed", code: 'SA328', message: "Internal Server Error on rollback error totalscore ass2" });
																													}
																													else {
																														done();
																														return response.status(200).json({ status: "failed", code: 'SA329', message: "Internal Server Error on rollback complete totalscore ass2" });
																													}
																												});
																											}
																											else {
																												client.query("COMMIT", err => {
																													if (err) {
																														done();
																														return response.status(200).json({ status: "failed", code: 'SA330', message: "Internal Server Error on commit totalscore ass2" });
																													}
																													else {
																														done();
																														response.status(200).json({ status: 'success', code: 'SA000', message: "Inserted successfully totalscore ass2" });
																													}
																												});


																											}
																										})
																								}
																							})
																					}
																					else {
																						client.query("COMMIT", err => {
																							if (err) {

																								done();
																								return response.status(200).json({ status: "failed", code: 'SA331', message: "Internal Server Error on commit ass6 gamescore in ass2" });
																							}
																							else {
																								done();
																								response.status(200).json({ status: 'success', code: 'SA000', message: "Inserted successfully aas6 gamescore in ass2" });
																							}
																						});

																					}

																				}
																			})


																	}
																})
																//////////////////////////////////////////////////
															}
															else {
																done();
																return response.status(200).json({ status: "failed", code: 'SA332', message: "count != res of ass2 failed" });
															}
														}
													})
											}
										})
								}
								else {

									client.query('(Select count(*) , \
						(Select count(ansquescnt) as scorecnt from skillangels_training_userscore where user_id = $1 and  \
						game_id = $2 and ass_status_id = $4 and event_id = $3  \
						and current_year_status = $5 and Date(date) = (select getserverdate()) ) ,\
					(Select sum(ansquescnt) as res from skillangels_training_userscore where user_id = $1 and  \
					game_id = $2 and ass_status_id = $4 and event_id = $3 and current_year_status=$5 \
					and Date(date) = (select getserverdate())) from skillangels_training_gameques_entry where user_id = $1  \
					and game_id = $2 and ass_status_id = $4 and event_id = $3 and current_year_status=$5 and  \
					Date(answeredtime) = (select getserverdate()))',
										[uid, gameid, eid, ass_status, year_status], (error, results) => {
											if (error) {
												console.log(error);
												done();
												response.status(200).json({ status: 'failed', code: 'SA333', message: 'internal server error on query selecting count & res of ass2 training' });
											}
											else {

												if (results.rows[0].res == null) {
													results.rows[0].res = 0;
												}
												if (ass_status == 2) {
													chkcnt = 1;
												}
												else {
													chkcnt = 1;
												}
												// console.log(results.rows[0].scorecnt + " cccccccccc");
												// console.log(results.rows[0].count + " cccccccccc" + (Number(results.rows[0].res) + Number(aqcnt)))
												if ((results.rows[0].count == (Number(results.rows[0].res) + Number(aqcnt))) &&
													(results.rows[0].scorecnt < chkcnt)) {

													console.log("entered to insert")
													client.query('INSERT INTO skillangels_training_userscore (user_id,game_id,event_id,score,correctcnt,wrongcnt,ansquescnt, \
											totalquescnt,responsetime,wrongresponsetime,correctresponsetime,gametime,status,ass_status_id,ass_slot,current_year_status) \
										VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,1,$13,$14,$15)', [uid, gameid, eid, score, ccnt, wcnt,
														aqcnt, tqcnt, rtime, wrtime, crtime, gtime, ass_status, ass_slot, year_status],
														(error, results) => {
															if (error) {
																console.log("error" + error);
																done();
																return response.status(200).json({ status: "failed", code: 'SA334', message: "Internal Server Error on query inserting gamescore ass2 training" });
															}
															else {
																done();
																response.status(200).json({ status: 'success', code: 'SA000', message: "Inserted successfully ass2train gamescore ass2 training" });
															}
														})

												}
												else {
													done();
													return response.status(200).json({ status: "failed", code: 'SA335', message: "count != res of ass2 failed training" });
												}
											}

										})


								}
							}
							else if (ass_status == 6) {
								client.query('(Select count(*) , \
				(Select count(ansquescnt) as scorecnt from skillangels_userscore where user_id = $1 and  \
				game_id = $2 and ass_status_id = $4 and event_id = $3  \
				and current_year_status = $5 and Date(date) = (select getserverdate()) ) ,\
			(Select sum(ansquescnt) as res from skillangels_userscore where user_id = $1 and  \
			game_id = $2 and ass_status_id = $4 and event_id = $3 and current_year_status=$5 \
			and Date(date) = (select getserverdate())) from skillangels_gameques_entry where user_id = $1  \
			and game_id = $2 and ass_status_id = $4 and event_id = $3 and current_year_status=$5 and  \
			Date(answeredtime) = (select getserverdate()))',
									[uid, gameid, eid, ass_status, year_status], (error, results) => {
										if (error) {
											console.log(error);
											done();
											response.status(200).json({ status: 'failed', code: 'SA336', message: 'internal server error on query selecting count & res of ass6' });
										}
										else {
											if (results.rows[0].res == null) {
												results.rows[0].res = 0;
											}
											if (ass_status == 2) {
												chkcnt = 5;
											}
											else {
												chkcnt = 1;
											}
											// console.log(results.rows[0].scorecnt + " cccccccccc");
											// console.log(results.rows[0].count + " cccccccccc" + (Number(results.rows[0].res) + Number(aqcnt)))
											if ((results.rows[0].count == (Number(results.rows[0].res) + Number(aqcnt))) &&
												(results.rows[0].scorecnt < chkcnt)) {
												//////////////////////////////////////////////////
												client.query("BEGIN", err => {
													console.log("BEGIN");
													if (err) {
														done();
													}
													else {


														console.log("entered to insert")
														client.query('INSERT INTO skillangels_userscore (user_id,game_id,event_id,score,correctcnt,wrongcnt,ansquescnt, \
									totalquescnt,responsetime,wrongresponsetime,correctresponsetime,gametime,status,ass_status_id,ass_slot,current_year_status) \
								VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,1,$13,$14,$15)', [uid, gameid, eid, score, ccnt, wcnt,
															aqcnt, tqcnt, rtime, wrtime, crtime, gtime, ass_status, ass_slot, year_status],
															(error, results) => {
																if (error) {
																	console.log("error" + error);
																	done();
																	return response.status(200).json({ status: "failed", code: 'SA337', message: "Internal Server Error on query inserting gamescore ass6" });
																}
																else {
																	if (ass_status == 2) {
																		console.log(results)
																		client.query('INSERT INTO skillangels_crownylog (uid,crowny,status,reason,current_year_status) \
									VALUES ($1,$2,$3,$4,$5)', [uid, crowniescount, -1, "puzzle completed", year_status],
																			(error, results) => {
																				if (error) {
																					client.query("ROLLBACK", err => {
																						if (err) {
																							done();
																							return response.status(200).json({ status: "failed", code: 'SA338', message: "Internal Server Error on rollback error crowny ass2 in ass6" });
																						}
																						else {
																							done();
																							return response.status(200).json({ status: "failed", code: 'SA339', message: "Internal Server Error on rollback complete crowny ass2 in ass6" });
																						}
																					});
																				}
																				else {
																					client.query('select set_total_score($1,$2,$3,$4,$5,$6)', [uid, eid, score, crowniescount, today, year_status],
																						(error, results) => {
																							if (error) {
																								console.log(error)
																								client.query("ROLLBACK", err => {
																									if (err) {
																										done();
																										return response.status(200).json({ status: "failed", code: 'SA340', message: "Internal Server Error on rollback error totalscore ass2 in ass6" });
																									}
																									else {
																										done();
																										return response.status(200).json({ status: "failed", code: 'SA341', message: "Internal Server Error on rollback complete totalscore ass2 in ass6" });
																									}
																								});
																							}
																							else {
																								client.query("COMMIT", err => {
																									if (err) {
																										done();
																										return response.status(200).json({ status: "failed", code: 'SA342', message: "Internal Server Error on commit totalscore ass2 in ass6" });
																									}
																									else {
																										done();
																										response.status(200).json({ status: 'success', code: 'SA000', message: "Inserted successfully totalscore ass2 in ass6" });
																									}
																								});


																							}
																						})
																				}
																			})
																	}
																	else {
																		client.query("COMMIT", err => {
																			if (err) {

																				done();
																				return response.status(200).json({ status: "failed", code: 'SA343', message: "Internal Server Error on commit ass6 gamescore" });
																			}
																			else {
																				done();
																				response.status(200).json({ status: 'success', code: 'SA000', message: "Inserted successfully aas6 gamescore" });
																			}
																		});

																	}

																}
															})


													}
												})
												//////////////////////////////////////////////////
											}
											else {
												done();
												return response.status(200).json({ status: "failed", code: 'SA344', message: "count != res of ass6 failed" });
											}
										}
									})

							}
							else {

								client.query('(Select count(*) ,\
				(Select count(ansquescnt) as scorecnt from skillangels_userscore where user_id = $1 and  \
				game_id = $2 and ass_status_id = $4 and event_id = $3  \
				and current_year_status = $5) ,\
						(Select sum(ansquescnt) as res from skillangels_userscore where user_id = $1 and  \
						game_id = $2 and ass_status_id = $4 and event_id = $3  \
						and current_year_status = $5) from skillangels_gameques_entry where user_id = $1  \
						and game_id = $2 and ass_status_id = $4 and event_id = $3 and  \
						current_year_status = $5 )',
									[uid, gameid, eid, ass_status, year_status], (error, results) => {
										if (error) {
											console.log(error)
											done();
											response.status(200).json({ status: 'failed', code: 'SA345', message: 'internal server error on query selecting count & res of ass1&3&5' });
										}
										else {

											if (results.rows[0].res == null) {
												results.rows[0].res = 0;
											}
											// 	console.log(results.rows[0].scorecnt + " cccccccccc");
											//  console.log(results.rows[0].count + " cccccccccc" + (Number(results.rows[0].res) + Number(aqcnt)))
											if ((results.rows[0].count == (Number(results.rows[0].res) + Number(aqcnt))) &&
												(results.rows[0].scorecnt < 1)) {
												//////////////////////////////////////////////////
												client.query("BEGIN", err => {
													console.log("BEGIN");
													if (err) {
														done();
													}
													else {

														if (ass_status == 5 || ass_status == 4 || ass_status == 1 || ass_status == 3) {
															client.query('INSERT INTO skillangels_userscore (user_id,game_id,event_id,score,correctcnt,wrongcnt,ansquescnt, \
										totalquescnt,responsetime,wrongresponsetime,correctresponsetime,gametime,status,ass_status_id,ass_slot,current_year_status) \
									VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,1,$13,$14,$15)', [uid, gameid, eid, score, ccnt, wcnt,
																aqcnt, tqcnt, rtime, wrtime, crtime, gtime, ass_status, ass_slot, year_status],
																(error, results) => {
																	if (error) {

																		done();
																		return response.status(200).json({ status: "failed", code: 'SA346', message: "Internal Server Error on query inserting 1&3&4&5 gamescore" });
																	}
																	else {
																		client.query("COMMIT", err => {
																			if (err) {

																				done();
																				return response.status(200).json({ status: "failed", code: 'SA347', message: "Internal Server Error on commit  1&3&4&5 gamescore" });
																			}
																			else {
																				done();
																				response.status(200).json({ status: 'success', code: 'SA000', message: "Inserted successfully  1&3&4&5 gamescore" });
																			}
																		});
																	}
																})
														}
														else {
															/////////////////never enter here///////////////////
															console.log("entered to insert")
															client.query('INSERT INTO skillangels_userscore (user_id,game_id,event_id,score,correctcnt,wrongcnt,ansquescnt, \
									totalquescnt,responsetime,wrongresponsetime,correctresponsetime,gametime,status,ass_status_id,ass_slot,current_year_status) \
								VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,1,$13,$14,$15)', [uid, gameid, eid, score, ccnt, wcnt,
																aqcnt, tqcnt, rtime, wrtime, crtime, gtime, ass_status, ass_slot, year_status],
																(error, results) => {
																	if (error) {
																		console.log("error" + error);
																		done();
																		return response.status(200).json({ status: "failed", code: 'SA348', message: "Internal Server Error on query inserting gamescore ass1&3" });
																	}
																	else {
																		console.log(results)
																		client.query('INSERT INTO skillangels_crownylog (uid,crowny,status,reason,current_year_status) \
									VALUES ($1,$2,$3,$4,$5)', [uid, crowniescount, -1, "puzzle completed", year_status],
																			(error, results) => {
																				if (error) {
																					client.query("ROLLBACK", err => {
																						if (err) {
																							done();
																							return response.status(200).json({ status: "failed", code: 'SA349', message: "Internal Server Error on rollback error crowny ass1&3" });
																						}
																						else {
																							done();
																							return response.status(200).json({ status: "failed", code: 'SA350', message: "Internal Server Error on rollback complete crowny ass1&3" });
																						}
																					});
																				}
																				else {
																					client.query('select set_total_score($1,$2,$3,$4,$5,$6)', [uid, eid, score, crowniescount, today, year_status],
																						(error, results) => {
																							if (error) {
																								console.log(error)
																								client.query("ROLLBACK", err => {
																									if (err) {
																										done();
																										return response.status(200).json({ status: "failed", code: 'SA351', message: "Internal Server Error on rollback error totalscore ass1&3" });
																									}
																									else {
																										done();
																										return response.status(200).json({ status: "failed", code: 'SA352', message: "Internal Server Error on rollback complete totalscore ass1&3" });
																									}
																								});
																							}
																							else {
																								client.query("COMMIT", err => {
																									if (err) {
																										done();
																										return response.status(200).json({ status: "failed", code: 'SA353', message: "Internal Server Error on commit totalscore ass1&3" });
																									}
																									else {
																										done();
																										response.status(200).json({ status: 'success', code: 'SA000', message: "Inserted successfully totalscore ass1&3" });
																									}
																								});


																							}
																						})
																				}
																			})

																	}
																})
														}
													}
												})

												////////////////////////////////////////////////////
											}
											else {
												done();
												return response.status(200).json({ status: "failed", code: 'SA354', message: "count != res of 1&3&4&5 failed" });
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
			message: "gamescore caused exception"
		});
	}
}


var current_year_statusval = 1;
var statuschkeachques = 0;
var changevar = 0;
const quesscore = (request, response) => {
	const { user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, ass_status_id,
		status, year_status, testtype, Angisass2train } = request.body;
	current_year_statusval = year_status;
	var total_count;
	try {
		pool.connect((err, client, done) => {
			if (err) {
				done();
				return response.status(200).json({ code: "SA100", status: "failed", message: "Internal Server Error inserting ques score" });
			}
			else {
				if (ass_status_id == 2) {
					if (Angisass2train == 0) {
						client.query('select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$2 \
					and current_year_status =$3 order by actual_start_date desc LIMIT 1',
							[user_id, event_id, current_year_statusval], (error, results) => {
								if (error) {
									console.log(error)
									done();
									response.status(200).json({ status: 'failed', code: 'SA355', message: 'selction of skillangels_games_cylce_entry on quesscore of ass2' });
								}
								else {
									if (results.rows.length > 0) {
										statuschkeachques = results.rows[0].status;
									}
									else {
										statuschkeachques = 0;
									}
									client.query('Select count(*) from (select * from skillangels_games_cylce_entry \
						 where user_id =$1 and event_id =$3  \
					and current_year_status =$5 order by actual_start_date desc LIMIT 1) as tab \
					INNER JOIN skillangels_userscore ON skillangels_userscore.user_id = tab.user_id \
					where skillangels_userscore.user_id=$1 and Date(skillangels_userscore.date) >= Date(tab.actual_start_date) \
					and skillangels_userscore.game_id=$2 and skillangels_userscore.event_id=$3 \
					and skillangels_userscore.ass_status_id=$4 and skillangels_userscore.current_year_status=$5',
										[user_id, game_id, event_id, ass_status_id, current_year_statusval], (error, results) => {
											if (error) {
												console.log(error)
												done();
												response.status(200).json({ status: 'failed', code: 'SA356', message: 'selction of totalcount on quesscore of ass2' });
											}
											else {
												console.log(results.rows[0].count)
												console.log("results.rows[0].count")
												total_count = results.rows[0].count;
												if (statuschkeachques == 1) {
													changevar = 5;
												}
												else {
													changevar = 1;
												}
												if (total_count < changevar) {
													console.log("coming")
													client.query('Insert into skillangels_gameques_entry\
							(user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, ass_status_id, \
								 status,current_year_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
														[user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, ass_status_id,
															status, current_year_statusval], (error, results) => {
																if (error) {
																	console.log(error)
																	done();
																	response.status(200).json({ status: 'failed', code: 'SA357', message: 'Question score insertion failed of ass2' });
																}
																else {
																	done();
																	response.status(200).json({ status: 'success', code: 'SA000', total_count, message: 'Question score inserted successfully of ass2' });
																}
															})
												} else {
													done();
													response.status(200).json({ status: 'failed', code: 'SA358', total_count, message: 'More than 5 attempts attempted on ass2' });

												}
											}
										})
								}
							})
					}
					else {

						client.query('Select count(*) from skillangels_training_userscore \
								where user_id=$1 and Date(date) =(select getserverdate()) \
					and game_id=$2 and event_id=$3 \
					and ass_status_id=$4 and current_year_status=$5',
							[user_id, game_id, event_id, ass_status_id, current_year_statusval], (error, results) => {
								if (error) {
									console.log(error)
									done();
									response.status(200).json({ status: 'failed', code: 'SA359', message: 'selction of totalcount on quesscore of ass2 training' });
								}
								else {
									console.log(results.rows[0].count)
									console.log("results.rows[0].count")
									total_count = results.rows[0].count;

									if (total_count < 1) {
										console.log("coming")
										client.query('Insert into skillangels_training_gameques_entry\
							(user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, ass_status_id, \
								 status,current_year_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
											[user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, ass_status_id,
												status, current_year_statusval], (error, results) => {
													if (error) {
														console.log(error)
														done();
														response.status(200).json({ status: 'failed', code: 'SA360', message: 'Question score insertion failed of ass2 training' });
													}
													else {
														done();
														response.status(200).json({ status: 'success', code: 'SA000', total_count, message: 'Question score inserted successfully of ass2 training' });
													}
												})
									} else {
										done();
										response.status(200).json({ status: 'failed', code: 'SA361', total_count, message: 'More than 1 attempts attempted on ass2 training' });

									}
								}
							})

					}
				}
				else if (ass_status_id == 6) {


					client.query('Select count(*) from skillangels_userscore \
				where user_id=$1 and Date(date) = (select getserverdate())  and game_id=$2 and event_id=$3 and ass_status_id=$4 and current_year_status=$5',
						[user_id, game_id, event_id, ass_status_id, current_year_statusval], (error, results) => {
							if (error) {
								console.log(error)
								done();
								response.status(200).json({ status: 'failed', code: 'SA362', message: 'selction of totalcount on userscore of ass6' });
							}
							else {
								console.log(results.rows[0].count)
								console.log("results.rows[0].count")
								total_count = results.rows[0].count;
								if (total_count < 1) {
									console.log("coming")
									client.query('Insert into skillangels_gameques_entry\
							(user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, ass_status_id, \
								 status,current_year_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
										[user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, ass_status_id,
											status, current_year_statusval], (error, results) => {
												if (error) {
													console.log(error)
													done();
													response.status(200).json({ status: 'failed', code: 'SA363', message: 'Question score insertion failed of ass6' });
												}
												else {
													done();
													response.status(200).json({ status: 'success', code: 'SA000', total_count, message: 'Question score inserted successfully of ass6' });
												}
											})
								} else {
									done();
									response.status(200).json({ status: 'failed', code: 'SA364', total_count, message: 'More than 10 question attempted on ass6' });
								}
							}
						})
				}
				else if (ass_status_id == 1 || ass_status_id == 3 || ass_status_id == 5 || ass_status_id == 4) {
					console.log("comingbrfore                 " + ass_status_id + 2);

					client.query('Select count(*) from skillangels_userscore \
				where user_id=$1  and game_id=$2 and event_id=$3 and ass_status_id=$4 and current_year_status=$5',
						[user_id, game_id, event_id, ass_status_id, current_year_statusval], (error, results) => {
							if (error) {
								console.log(error)
								done();
								response.status(200).json({ status: 'failed', code: 'SA365', message: 'selction of totalcount on userscore of ass1,3,4&5' });
							}
							else {
								console.log(results.rows[0].count)
								console.log("results.rows[0].count")
								total_count = results.rows[0].count;
								if (total_count < 1) {
									console.log("coming")
									client.query('Insert into skillangels_gameques_entry\
							(user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, ass_status_id, \
								 status,current_year_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
										[user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, ass_status_id,
											status, current_year_statusval], (error, results) => {
												if (error) {
													console.log(error)
													done();
													response.status(200).json({ status: 'failed', code: 'SA366', message: 'Question score insertion failed of ass1,3,4&5' });
												}
												else {
													done();
													response.status(200).json({ status: 'success', code: 'SA000', total_count, message: 'Question score inserted successfully of ass1,3,4&5' });
												}
											})
								} else {
									done();
									response.status(200).json({ status: 'failed', code: 'SA367', total_count, message: 'More than 10 question attempted on ass1,3,4&5' });
								}
							}
						})
				}
				else {
					client.query('select * from skillangels_skillkitgames_cylce_entry where user_id =$1 and event_id =$2 \
					and current_year_status =$3 order by actual_start_date desc LIMIT 1',
						[user_id, event_id, current_year_statusval], (error, results) => {
							if (error) {
								console.log(error)
								done();
								response.status(200).json({ status: 'failed', code: 'SA380', message: 'selction of skillangels_skillkitgames_cylce_entry on quesscore of skillkit' });
							}
							else {
								if (results.rows.length > 0) {
									statuschkeachques = results.rows[0].status;
								}
								else {
									statuschkeachques = 0;
								}
								client.query('Select count(*) from (select * from skillangels_skillkitgames_cylce_entry \
						 where user_id =$1 and event_id =$3  \
					and current_year_status =$4 order by actual_start_date desc LIMIT 1) as tab \
					INNER JOIN skillangels_skillkitscore ON skillangels_skillkitscore.user_id = tab.user_id \
					where skillangels_skillkitscore.user_id=$1 and Date(skillangels_skillkitscore.played_date) >= Date(tab.actual_start_date) \
					and skillangels_skillkitscore.game_id=$2 and skillangels_skillkitscore.event_id=$3 \
					 and skillangels_skillkitscore.current_year_status=$4',
									[user_id, game_id, event_id, current_year_statusval], (error, results) => {
										if (error) {
											console.log(error)
											done();
											response.status(200).json({ status: 'failed', code: 'SA368', message: 'selction of totalcount on userscore of skillkit' });
										}
										else {
											console.log(results.rows[0].count)
											console.log("results.rows[0].count")
											total_count = results.rows[0].count;
											if (statuschkeachques == 1) {
												changevar = 5;
											}
											else {
												changevar = 1;
											}
											if (total_count < changevar) {
												console.log("coming")
												client.query('Insert into skillangels_gameques_entry\
														(user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, ass_status_id, \
													 				 status,current_year_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
													[user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, ass_status_id,
														status, current_year_statusval], (error, results) => {
															if (error) {
																console.log(error)
																done();
																response.status(200).json({ status: 'failed', code: 'SA369', message: 'Question score insertion failed of skillkit' });
															}
															else {
																done();
																response.status(200).json({ status: 'success', code: 'SA000', total_count, message: 'Question score inserted successfully of skillkit' });
															}
														})
											} else {
												done();
												response.status(200).json({ status: 'failed', code: 'SA370', total_count, message: 'More than 10 question attempted on skillkit' });

											}
										}
									})
							}
						})


				}
			}
		})
	} catch (e) {
		console.log(e)
		return response.status(200).json({
			code: "SA120",
			status: "failed",
			message: "quesscore caused exception"
		});
	}
}


var staticyearstatus = 1;
const getRemainingQues = (request, response) => {
	const { user_id, game_id, event_id, ass_status_id, Angisass2train } = request.body;
	var current_session_id;
	try {
		pool.connect((err, client, done) => {
			if (err) {
				done();
				return response.status(200).json({ code: "SA100", status: "failed", message: "Internal Server Error on getRemainingQues" });
			}
			else {
				client.query('SELECT current_session_id  FROM public.skillangels_users where id= $1', [user_id], (error, results) => {
					if (error) {
						// console.log(error)
						done();
						response.status(200).json({ status: 'Failure', code: 'SA159', message: 'Failed to get session id' });
					}
					else {
						current_session_id = results.rows[0].current_session_id;
						if (ass_status_id == 2) {
							if (Angisass2train == 0) {
								client.query('select skillangels_gameques_entry.quesno, skillangels_gameques_entry.score, \
					skillangels_gameques_entry.ansvalidation, skillangels_gameques_entry.responsetime from  \
					(select * from skillangels_games_cylce_entry where user_id =$1 and event_id =$3 \
					and current_year_status =$5 order by actual_start_date desc LIMIT 1) as tab \
					INNER JOIN skillangels_gameques_entry ON skillangels_gameques_entry.user_id = tab.user_id \
					where skillangels_gameques_entry.user_id =$1 and \
					skillangels_gameques_entry.game_id =$2 \
					and skillangels_gameques_entry.ass_status_id = $4 and skillangels_gameques_entry.event_id = $3 \
					and Date(skillangels_gameques_entry.answeredtime) >= Date(tab.actual_start_date) \
					and finish_status = 0',
									[user_id, game_id, event_id, ass_status_id, staticyearstatus], (error, results) => {
										if (error) {
											console.log(error)
											done();
											response.status(200).json({ status: 'failed', code: 'SA371', message: 'Played questions retrieval failed on ass2' });
										}
										else {
											console.log(results.rows)
											done();
											response.status(200).json({ status: 'success', code: 'SA000', current_session_id: current_session_id, result: results.rows, message: 'Played questions retrieval successful on ass2' });
										}
									})
							}
							else {
								client.query('Select quesno, score, ansvalidation, responsetime from skillangels_training_gameques_entry where user_id = $1 and game_id = $2\
					and ass_status_id = $4 and event_id = $3 and Date(answeredtime) = (select getserverdate()) and finish_status = 0',
									[user_id, game_id, event_id, ass_status_id], (error, results) => {
										if (error) {
											console.log(error)
											done();
											response.status(200).json({ status: 'failed', code: 'SA372', message: 'Played questions retrieval failed on ass2 training' });
										}
										else {
											console.log(results.rows)
											done();
											response.status(200).json({ status: 'success', code: 'SA000', current_session_id: current_session_id, result: results.rows, message: 'Played questions retrieval successful on ass2 training' });
										}
									})
							}
						}
						else if (ass_status_id == 6) {
							client.query('Select quesno, score, ansvalidation, responsetime from skillangels_gameques_entry where user_id = $1 and game_id = $2\
					and ass_status_id = $4 and event_id = $3 and Date(answeredtime) = (select getserverdate()) and finish_status = 0',
								[user_id, game_id, event_id, ass_status_id], (error, results) => {
									if (error) {
										console.log(error)
										done();
										response.status(200).json({ status: 'failed', code: 'SA373', message: 'Played questions retrieval failed on ass6' });
									}
									else {
										console.log(results.rows)
										done();
										response.status(200).json({ status: 'success', code: 'SA000', current_session_id: current_session_id, result: results.rows, message: 'Played questions retrieval successful on ass6' });
									}
								})
						}
						else if (ass_status_id == 1 || ass_status_id == 3 || ass_status_id == 4 || ass_status_id == 5) {
							client.query('Select quesno, score, ansvalidation, responsetime from skillangels_gameques_entry where user_id = $1 and game_id = $2\
					and ass_status_id = $4 and event_id = $3 and finish_status = 0',
								[user_id, game_id, event_id, ass_status_id], (error, results) => {
									if (error) {
										console.log(error)
										done();
										response.status(200).json({ status: 'failed', code: 'SA374', message: 'Played questions retrieval failed on ass1,3,4&5' });
									}
									else {
										console.log(results.rows)
										done();
										response.status(200).json({ status: 'success', code: 'SA000', current_session_id: current_session_id, result: results.rows, message: 'Played questions retrieval successful on ass1,3,4&5' });
									}
								})
						}
						else {
							client.query('Select quesno, score, ansvalidation, responsetime from skillangels_gameques_entry where user_id = $1 and game_id = $2\
					and ass_status_id = $4 and event_id = $3 and finish_status = 0 and Date(answeredtime) >= Date((select actual_start_date from \
						 skillangels_skillkitgames_cylce_entry where \
						user_id =$1  and event_id =$3 \
						and current_year_status =$5 order by actual_start_date desc LIMIT 1))',
								[user_id, game_id, event_id, ass_status_id, staticyearstatus], (error, results) => {
									if (error) {
										console.log(error)
										done();
										response.status(200).json({ status: 'failed', code: 'SA446', message: 'Played questions retrieval failed on skillkit' });
									}
									else {
										console.log(results.rows)
										done();
										response.status(200).json({ status: 'success', code: 'SA000', current_session_id: current_session_id, result: results.rows, message: 'Played questions retrieval successful on skillkit' });
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
			message: "getRemainingQues caused exception"
		});
	}
}

const game_getsession = (request, response) => {
	const { user_id } = request.body
	console.log(request.body)
	try {
		pool.connect((err, client, done) => {
			if (err) {
				done();
				return response.status(200).json({ code: "SA100", status: "failed", message: "Internal Server Error" });
			}
			else {

				client.query('SELECT current_session_id  FROM public.skillangels_users where id= $1', [user_id], (error, results) => {
					if (error) {
						// console.log(error)
						done();
						response.status(200).json({ status: 'Failure', code: 'SA378', message: 'Failed to get session id in game' });
					}
					else {
						done();
						console.log(results.rows)
						response.status(200).json({ status: 'Success', code: 'SA000', current_session_id: results.rows[0].current_session_id, message: 'Session id got successful' });
					}
				})

			}
		})
	} catch (e) {
		console.log(e)
		return response.status(200).json({
			code: "SA379",
			status: "failed",
			message: "Get session id exception in report in game"
		});
	}
}


module.exports = { gamescore, quesscore, getRemainingQues, game_getsession };





