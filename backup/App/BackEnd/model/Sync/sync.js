const Pool_local = require('pg').Pool
config = require("../dbconfig");
db_local = config.database;
const pool_local = new Pool_local(db_local);

const Pool_live = require('pg').Pool
db_live = config.database_live;
const pool_live = new Pool_live(db_live);

var bran_id = 0;
const live_sync = (request, response) => {
	const { schoolid, branchid } = request.body;
	var id = schoolid; //52 69 //  56  59 65  49 63 60 68 46  
	bran_id = branchid;
	try {
		pool_live.connect((err_live, client_live, done_live) => {
			if (err_live) {
				done_live()
				response.status(200).json({
					status: "Failed",
					code: 'SA100',
					message: "Internal Server Error on Live Database"
				});
			}
			else {
				pool_local.connect((err_local, client_local, done_local) => {
					if (err_local) {
						done_live()
						done_local()
						response.status(200).json({
							status: "Failed",
							code: 'SA100',
							message: "Internal Server Error Local Database"
						});
					}
					else {
						client_live.query("select * from fn_triggerall(false)", (err_local, res_local) => {
							if (err_local) {
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA300',
									message: "query error at disable trigger"
								});
							} else {
								client_local.query("SELECT * FROM public.skillangels_school WHERE id=$1", [id], (err_local, res_local) => {
									if (err_local) {
										done_live()
										done_local()
										response.status(200).json({
											status: "Failed",
											code: 'SA101',
											message: "query error at selecting schools in live_sync local"
										});
									} else {
										if (res_local.rows.length > 0) {
											client_live.query("SELECT * FROM public.skillangels_school WHERE id=$1", [id], (err_live, res_live) => {
												if (err_live) {
													console.log(err_live);
													done_live()
													done_local()
													response.status(200).json({
														status: "Failed",
														code: 'SA102',
														message: "query error at selecting schools in live_sync live"
													});
												} else {
													if (res_live.rows.length > 0) {
														client_live.query("UPDATE public.skillangels_school SET schoolname=$1, \
											 address=$2, district=$3, state=$4, countryid=$5, \
											 schoolcode=$6, logo_path=$7, schemeid=$8, created_by=$9, modified_by=$10, status=$11, \
											  branch_count=$12, role=$13,phoneno=$14, sync_flag=$15 WHERE schoolname=$16 AND id=$17",
															[res_local.rows[0].schoolname, res_local.rows[0].address, res_local.rows[0].district,
															res_local.rows[0].state, res_local.rows[0].countryid,
															res_local.rows[0].schoolcode, res_local.rows[0].logo_path, res_local.rows[0].schemeid,
															res_local.rows[0].created_by, res_local.rows[0].modified_by, res_local.rows[0].status,
															res_local.rows[0].branch_count, res_local.rows[0].role, res_local.rows[0].phoneno,
															res_local.rows[0].sync_flag, res_local.rows[0].schoolname, res_local.rows[0].id], (err_live, res_live) => {
																if (err_live) {
																	//	console.log(err_live);
																	done_live()
																	done_local()
																	response.status(200).json({
																		status: "Failed",
																		code: 'SA103',
																		message: "Can't update live_sync skillangels_school"
																	});
																}
																else {
																	client_local.query("UPDATE public.skillangels_school SET sync_flag=1 WHERE id=$1", [res_local.rows[0].id], (err_local, res_local) => {
																		if (err_local) {
																			done_live()
																			done_local()
																			response.status(200).json({
																				status: "Failed",
																				code: 'SA104',
																				message: "Can't update local sync_flag=1 on  live_sync"
																			});
																		}
																		else {
																			live_sync_sclbranch(id, response, done_live, done_local, client_local, client_live)
																		}
																	});
																}
															});
													}
													else {
														done_live();
														done_local();
														response.status(200).json({
															status: "Failed",
															code: 'SA105',
															message: "There is no school in live database"
														});
													}
												}
											});
										}//////////
										else {
											done_live();
											done_local();
											response.status(200).json({
												status: "Failed",
												code: 'SA106',
												message: "There is no school in local database"
											});
										}
									}
								});
							}
						});

					}
				});
			}
		});
	} catch (e) {
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_sync caused exception"
		});
	}
}

var sflag = 0;
var incval_sb = 0;
var temp_bran;
const live_sync_sclbranch = (id, response, done_live, done_local, client_local, client_live) => {

	try {
		console.log('sb'); console.log('id' + id);
		client_local.query("SELECT * FROM public.skillangels_schoolbranch WHERE schoolid=$1 and id=$2", [id, bran_id], (err_local_branch, res_local_branch) => {
			if (err_local_branch) {
				console.log(err_local_branch);
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA107',
					message: "query error on selecting skillangels_schoolbranch on local live_sync_sclbranch"
				});
			} else {

				incval_sb = 0;

				if (res_local_branch.rows.length > 0) {
					schoolbranch_sync(res_local_branch, response, done_live, done_local, client_local, client_live)
				} else {
					done_live();
					done_local();
					response.status(200).json({
						status: "success",
						code: 'SA108',
						message: "No branch for this school"
					});
				}
			}

		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_sync_sclbranch caused exception"
		});
	}
}

const schoolbranch_sync = (sb_rows, response, done_live, done_local, client_local, client_live) => {


	try {

		id = sb_rows.rows[incval_sb].id;
		branchname = sb_rows.rows[incval_sb].branchname;
		address = sb_rows.rows[incval_sb].address;
		district = sb_rows.rows[incval_sb].district;
		state = sb_rows.rows[incval_sb].state;
		countryid = sb_rows.rows[incval_sb].countryid;
		schoolcode = sb_rows.rows[incval_sb].schoolcode;
		logo_path = sb_rows.rows[incval_sb].logo_path;
		branchcode = sb_rows.rows[incval_sb].branchcode;
		schoolid = sb_rows.rows[incval_sb].schoolid;
		created_by = sb_rows.rows[incval_sb].created_by;
		modified_by = sb_rows.rows[incval_sb].modified_by;
		statuss = sb_rows.rows[incval_sb].status;
		mobileno = sb_rows.rows[incval_sb].mobileno;
		timetablepattern = sb_rows.rows[incval_sb].timetablepattern;
		assessment_status = sb_rows.rows[incval_sb].assessment_status;
		sync_flag = sb_rows.rows[incval_sb].sync_flag;
		lang_flag = sb_rows.rows[incval_sb].lang_flag;
		total_time = sb_rows.rows[incval_sb].total_time;
		assessment_check = sb_rows.rows[incval_sb].assessment_check;

		(function (id, branchname, address, district, state, countryid, schoolcode, logo_path, branchcode, schoolid, created_by, modified_by, statuss, mobileno, timetablepattern, assessment_status, sync_flag, lang_flag, total_time, assessment_check) {

			client_live.query("SELECT * FROM public.skillangels_schoolbranch WHERE schoolid=$1 AND id=$2", [schoolid, id], (err_1ive, res_live) => {
				incval_sb++;
				if (err_1ive) {
					console.log(err_1ive);
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA109',
						message: "query error on selecting skillangels_schoolbranch on live schoolbranch_sync"
					});
				} else {
					if (res_live.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_schoolbranch SET branchname=$1, address=$2, district=$3, \
						state=$4, countryid=$5, schoolcode=$6, logo_path=$7, branchcode=$8, schoolid=$9, created_by=$10, \
						modified_by =$11, status=$12, timetablepattern=$13, assessment_status=$14, sync_flag=$15,lang_flag=$16,\
						total_time=$17, assessment_check=$18 WHERE schoolid=$19 AND id=$20", [branchname,
							address, district, state, countryid, schoolcode, logo_path, branchcode, schoolid, created_by, modified_by, statuss,
							timetablepattern, assessment_status, sync_flag, lang_flag, total_time, assessment_check, schoolid, id], (err_live, res_live) => {
								if (err_live) {
									console.log(err_live);
									done_live()
									done_local()
									response.status(200).json({
										status: "Failed",
										code: 'SA110',
										message: "query error on UPDATEing skillangels_schoolbranch on live schoolbranch_sync"
									});
								}
								else {
									if (incval_sb == sb_rows.rows.length) {
										schoolbranch(sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
									}
									else {
										schoolbranch_sync(sb_rows, response, done_live, done_local, client_local, client_live)
									}
								}

							});
					} else {
						client_live.query("INSERT INTO skillangels_schoolbranch (id,branchname, address, district, \
						state, countryid, schoolcode, logo_path, branchcode, schoolid, created_by, \
						modified_by, status, mobileno,timetablepattern, assessment_status, sync_flag,lang_flag,\
						total_time, assessment_check) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)", [id, branchname,
							address, district, state, countryid, schoolcode, logo_path,
							branchcode, schoolid, created_by, modified_by, statuss, mobileno, timetablepattern,
							assessment_status, sync_flag, lang_flag, total_time, assessment_check], (err_live, res_live) => {
								if (err_live) {
									console.log(err_live);
									done_live()
									done_local()
									response.status(200).json({
										status: "Failed",
										code: 'SA111',
										message: "query error on inserting skillangels_schoolbranch on live schoolbranch_sync"
									});
								}
								else {
									if (incval_sb == sb_rows.rows.length) {
										schoolbranch(sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
									}
									else {
										schoolbranch_sync(sb_rows, response, done_live, done_local, client_local, client_live)
									}
								}
							});
					}
				}
			});
		})(id, branchname, address, district, state, countryid, schoolcode, logo_path, branchcode, schoolid, created_by, modified_by, statuss, mobileno, timetablepattern, assessment_status, sync_flag, lang_flag, total_time, assessment_check);//fn close
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "schoolbranch_sync caused exception"
		});
	}
}


const schoolbranch = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {

	try {
		client_local.query("UPDATE public.skillangels_schoolbranch SET sync_flag=1 WHERE schoolid=$1 ", [schoolid], (err_local, res_local) => {
			if (err_local) {
				console.log(err_local);
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA112',
					message: "query error on updateing skillangels_schoolbranch on local schoolbranch"
				});
			}
			else {
				incval_sb = 0;
				live_sync_current_server(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);

			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "schoolbranch caused exception"
		});
	}
}



const live_sync_current_server = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {

		if (incval_sb == sb_rows.rows.length) {
			incval_sb = 0;
			live_sync_sclgrade(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
		}
		else {
			temp_bran = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_current_server WHERE branch_id=$1", [temp_bran], (err_local_curr, res_local_curr) => {
				if (err_local_curr) {
					console.log(err_local_curr);
					done_live();
					done_local();
					response.status(200).json({
						status: "Failed",
						code: 'SA113',
						message: "query error on selecting current_server on local live_sync_current_server"
					});
				} else {
					incval_sb++;
					if (res_local_curr.rows.length > 0) {
						start_val_cs = -1;
						call_live_sync_current_server_insert(start_val_cs, res_local_curr, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
					} else {
						live_sync_current_server(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
					}
				}
			});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_sync_current_server caused exception"
		});
	}
}

const call_live_sync_current_server_insert = (start_val_cs, res_local_curr, sb_rows, schoolid, response, client_live, done_live, client_local, done_local) => {
	try {

		start_val_cs = start_val_cs + 1;
		id = res_local_curr.rows[start_val_cs].id;
		branch_id = res_local_curr.rows[start_val_cs].branch_id;
		servername = res_local_curr.rows[start_val_cs].servername;
		statuss = res_local_curr.rows[start_val_cs].status;

		(function (id, branch_id, servername, statuss) {
			client_live.query("SELECT * FROM public.skillangels_current_server WHERE id=$1", [id], (err_live_cs, res_live_cs) => {

				if (err_live_cs) {
					console.log(err_live_cs);
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA114',
						message: "query error on selecting current_server on live call_live_sync_current_server_insert"
					});

				} else {
					if (res_live_cs.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_current_server SET branch_id=$4,servername=$1, status=$2 WHERE id=$3", [servername, statuss, id, branch_id], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA115',
									message: "Can't update live skillangels_current_server"
								});
							}
							else {
								if (start_val_cs == ((res_local_curr.rows.length) - 1)) {
									live_sync_current_server(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_sync_current_server_insert(start_val_cs, res_local_curr, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
								}
							}
						});
					} else {
						client_live.query("INSERT INTO skillangels_current_server (id, branch_id, servername, status) VALUES ($1,$2,$3,$4)", [id, branch_id, servername, statuss], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA116',
									message: "Can't insert into live skillangels_current_server "
								});
							}
							else {
								if (start_val_cs == ((res_local_curr.rows.length) - 1)) {
									live_sync_current_server(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_sync_current_server_insert(start_val_cs, res_local_curr, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);

								}
							}
						});
					}

				}
			});
		})(id, branch_id, servername, statuss);
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_sync_current_server_insert caused exception"
		});
	}
}


const live_sync_sclgrade = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {

		if (incval_sb == sb_rows.rows.length) {

			incval_sb = 0;
			live_grade_section_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);

		}
		else {
			temp_bran = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_schoolgrade WHERE branch_id=$1 AND sync_flag=$2", [temp_bran, sflag], (err_local_grade, res_local_grade) => {
				if (err_local_grade) {
					console.log(err_local_grade);
					done_live();
					done_local();
					response.status(200).json({
						status: "Failed",
						code: 'SA117',
						message: "query error on selecting skillangels_schoolgrade on local live_sync_sclgrade"
					});
				} else {
					incval_sb++;
					if (res_local_grade.rows.length > 0) {
						start_val_cs = -1;
						schoolgrade_sync(start_val_cs, res_local_grade, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
					} else {
						console.log("entering empty")
						live_sync_sclgrade(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
					}
				}
			});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_sync_sclgrade caused exception"
		});
	}
}


const schoolgrade_sync = (start_val_cs, res_local_grade, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		start_val_cs = start_val_cs + 1;
		id = res_local_grade.rows[start_val_cs].id;
		branch_id = res_local_grade.rows[start_val_cs].branch_id;
		gradeid = res_local_grade.rows[start_val_cs].gradeid;
		created_by = res_local_grade.rows[start_val_cs].created_by;
		modified_by = res_local_grade.rows[start_val_cs].modified_by;
		statuss = res_local_grade.rows[start_val_cs].status;
		sync_flag = res_local_grade.rows[start_val_cs].sync_flag;
		medianval = res_local_grade.rows[start_val_cs].medianval;
		mem_medianval = res_local_grade.rows[start_val_cs].mem_medianval;
		vp_medianval = res_local_grade.rows[start_val_cs].vp_medianval;
		fa_medianval = res_local_grade.rows[start_val_cs].fa_medianval;
		ps_medianval = res_local_grade.rows[start_val_cs].ps_medianval;
		lin_medianval = res_local_grade.rows[start_val_cs].lin_medianval;

		(function (id, branch_id, gradeid, created_by, modified_by, statuss, sync_flag, medianval, mem_medianval, vp_medianval, fa_medianval, ps_medianval, lin_medianval) {

			client_live.query("SELECT * FROM public.skillangels_schoolgrade WHERE id=$1 AND branch_id=$2", [id, branch_id], (err_1ive_sg, res_live_sg) => {

				if (err_1ive_sg) {
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA118',
						message: "query error on selecting skillangels_schoolgrade on live schoolgrade_sync"
					});

				} else {

					if (res_live_sg.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_schoolgrade SET gradeid=$1, created_by=$2, \
						modified_by=$3, status=$4, sync_flag=$5, medianval=$6, mem_medianval=$7, vp_medianval=$8,\
						fa_medianval=$9, ps_medianval =$10, lin_medianval=$11 WHERE id=$12 AND branch_id=$13", [gradeid, created_by,
							modified_by, statuss, sync_flag, medianval, mem_medianval, vp_medianval, fa_medianval, ps_medianval,
							lin_medianval, id, branch_id], (err_live, res_live) => {
								if (err_live) {
									done_live()
									done_local()
									response.status(200).json({
										status: "Failed",
										code: 'SA119',
										message: "query error on updateing skillangels_schoolgrade on live schoolgrade_sync"
									});
								}
								else {
									if (start_val_cs == ((res_local_grade.rows.length) - 1)) {
										schoolgrade(branch_id, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
									}
									else {
										schoolgrade_sync(start_val_cs, res_local_grade, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
									}
								}

							});
					} else {
						client_live.query("INSERT INTO skillangels_schoolgrade (id,branch_id,gradeid,created_by, modified_by, status,	sync_flag, \
							 medianval, mem_medianval, vp_medianval, fa_medianval, ps_medianval, lin_medianval) \
							VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) ", [id, branch_id, gradeid, created_by, modified_by, statuss, sync_flag, medianval, mem_medianval, vp_medianval, fa_medianval, ps_medianval, lin_medianval], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA121',
									message: "query error on inserting skillangels_schoolgrade on live schoolgrade_sync"
								});
							}
							else {
								if (start_val_cs == ((res_local_grade.rows.length) - 1)) {
									schoolgrade(branch_id, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);

								}
								else {
									schoolgrade_sync(start_val_cs, res_local_grade, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
							}
						});
					}
				}

			});
		})(id, branch_id, gradeid, created_by, modified_by, statuss, sync_flag, medianval, mem_medianval, vp_medianval, fa_medianval, ps_medianval, lin_medianval);//fn close
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "schoolgrade_sync caused exception"
		});
	}
}


const schoolgrade = (branch_id, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_schoolgrade SET sync_flag=1 WHERE branch_id=$1", [branch_id], (err_local, res_local) => {
			if (err_local) {
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA122',
					message: "query error on updating skillangels_schoolgrade on local schoolgrade"
				});
			}
			else {
				console.log("completed" + branch_id);
				live_sync_sclgrade(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "schoolgrade caused exception"
		});
	}
}

var temp_sgs;
const live_grade_section_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {

		if (incval_sb == sb_rows.rows.length) {
			incval_sb = 0;
			live_branch_grade_cycle_game_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
		}
		else {
			temp_sgs = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_schoolgradesections WHERE branchid=$1 AND sync_flag=$2", [temp_sgs, sflag], (err_local_sgs, res_local_sgs) => {
				if (err_local_sgs) {
					done_live();
					done_local();
					response.status(200).json({
						status: "Failed",
						code: 'SA123',
						message: "query error on selecting skillangels_schoolgradesections on local live_grade_section_sync"
					});
				} else {
					incval_sb++;
					if (res_local_sgs.rows.length > 0) {
						start_val_sgs = -1;
						call_live_sync_grade_section_insert(start_val_sgs, res_local_sgs, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
					} else {
						live_grade_section_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
					}
				}
			});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_grade_section_sync caused exception"
		});
	}
}

const call_live_sync_grade_section_insert = (start_val_sgs, res_local_sgs, sb_rows, schoolid, response, client_live, done_live, client_local, done_local) => {
	try {

		start_val_sgs = start_val_sgs + 1;
		id = res_local_sgs.rows[start_val_sgs].id;
		branchid = res_local_sgs.rows[start_val_sgs].branchid;
		gradeid = res_local_sgs.rows[start_val_sgs].gradeid;
		sectionname = res_local_sgs.rows[start_val_sgs].sectionname;
		created_by = res_local_sgs.rows[start_val_sgs].created_by;
		modified_by = res_local_sgs.rows[start_val_sgs].modified_by;
		statuss = res_local_sgs.rows[start_val_sgs].status;
		sync_flag = res_local_sgs.rows[start_val_sgs].sync_flag;
		daydata = res_local_sgs.rows[start_val_sgs].daydata;
		startdate = res_local_sgs.rows[start_val_sgs].startdate;

		(function (id, branchid, gradeid, sectionname, created_by, modified_by, statuss, sync_flag, daydata, startdate) {
			client_live.query("SELECT * FROM public.skillangels_schoolgradesections WHERE id=$1 AND branchid=$2", [id, branchid], (err_live_sgs, res_live_sgs) => {

				if (err_live_sgs) {
					console.log(err_live_sgs);
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA124',
						message: "query error on selecting call_live_sync_grade_section_insert on live call_live_sync_grade_section_insert"
					});

				} else {
					if (res_live_sgs.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_schoolgradesections SET  gradeid=$1, sectionname=$2, created_by=$3, modified_by=$4, status=$5, sync_flag=$6, daydata=$7, startdate=$8 WHERE id=$9 AND branchid=$10 ", [gradeid, sectionname, created_by, modified_by, statuss, sync_flag, daydata, startdate, id, branchid], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA125',
									message: "Can't update live skillangels_schoolgradesections"
								});
							}
							else {
								if (start_val_sgs == ((res_local_sgs.rows.length) - 1)) {
									grade_section(branchid, sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
								}
								else {
									call_live_sync_grade_section_insert(start_val_sgs, res_local_sgs, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
								}
							}
						});
					} else {
						client_live.query("INSERT INTO skillangels_schoolgradesections (id, branchid, gradeid, sectionname, created_by, modified_by, status, sync_flag,daydata, startdate) \
						VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ", [id, branchid, gradeid, sectionname, created_by, modified_by, statuss, sync_flag, daydata, startdate], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA126',
									message: "Can't insert into live skillangels_schoolgradesections "
								});
							}
							else {
								if (start_val_sgs == ((res_local_sgs.rows.length) - 1)) {
									grade_section(branchid, sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
								}
								else {
									call_live_sync_grade_section_insert(start_val_sgs, res_local_sgs, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
								}
							}
						});
					}
				}
			});
		})(id, branchid, gradeid, sectionname, created_by, modified_by, statuss, sync_flag, daydata, startdate);//fn close
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_sync_grade_section_insert caused exception"
		});
	}
}


const grade_section = (branchid, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {

		client_local.query("UPDATE public.skillangels_schoolgradesections SET sync_flag=1 WHERE branchid=$1", [branchid], (err_local, res_local) => {
			if (err_local) {
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA127',
					message: "query error on updating skillangels_schoolgradesections on local grade_section"
				});
			}
			else {
				live_grade_section_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "grade_section caused exception"
		});
	}
}


var temp_bgcg;

const live_branch_grade_cycle_game_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		if (incval_sb == sb_rows.rows.length) {

			incval_sb = 0;
			live_school_period_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
		}
		else {
			temp_bgcg = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_branchgradecyclegame WHERE branch_id=$1 AND sync_flag=$2", [temp_bgcg, sflag], (err_local_bgcg, res_local_bgcg) => {
				if (err_local_bgcg) {
					done_live();
					done_local();
					response.status(200).json({
						status: "Failed",
						code: 'SA128',
						message: "query error on selecting skillangels_branchgradecyclegame on local live_branch_grade_cycle_game_sync"
					});
				} else {
					incval_sb++;
					if (res_local_bgcg.rows.length > 0) {
						start_val_bgcg = -1;
						call_live_branch_grade_cycle_game_insert(start_val_bgcg, res_local_bgcg, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
					} else {
						live_branch_grade_cycle_game_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
					}
				}
			});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_branch_grade_cycle_game_sync caused exception"
		});
	}
}

const call_live_branch_grade_cycle_game_insert = (start_val_bgcg, res_local_bgcg, sb_rows, schoolid, response, client_live, done_live, client_local, done_local) => {
	try {

		start_val_bgcg = start_val_bgcg + 1;
		bgcg_id = res_local_bgcg.rows[start_val_bgcg].bgcg_id;
		branch_id = res_local_bgcg.rows[start_val_bgcg].branch_id;
		gcg_id = res_local_bgcg.rows[start_val_bgcg].gcg_id;
		statuss = res_local_bgcg.rows[start_val_bgcg].status;
		sync_flag = res_local_bgcg.rows[start_val_bgcg].sync_flag;

		(function (bgcg_id, branch_id, gcg_id, statuss, sync_flag) {
			client_live.query("SELECT * FROM public.skillangels_branchgradecyclegame WHERE bgcg_id=$1 AND branch_id=$2", [bgcg_id, branch_id], (err_live_bgcg, res_live_bgcg) => {

				if (err_live_bgcg) {
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA129',
						message: "query error on selecting skillangels_branchgradecyclegame on live call_live_branch_grade_cycle_game_insert"
					});

				} else {
					if (res_live_bgcg.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_branchgradecyclegame SET gcg_id=$1,status=$2 WHERE bgcg_id=$3 AND branch_id=$4", [gcg_id, statuss, bgcg_id, branch_id], (err_live, res_live) => {
							if (err_live) {
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA130',
									message: "Can't update live skillangels_branchgradecyclegame"
								});
							}
							else {
								if (start_val_bgcg == ((res_local_bgcg.rows.length) - 1)) {
									branch_grade_cycle_game(branch_id, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_branch_grade_cycle_game_insert(start_val_bgcg, res_local_bgcg, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
								}
							}
						});
					} else {
						client_live.query("INSERT INTO skillangels_branchgradecyclegame (bgcg_id, branch_id, gcg_id, status, sync_flag) VALUES ($1,$2,$3,$4,$5)", [bgcg_id, branch_id, gcg_id, statuss, sync_flag], (err_live, res_live) => {
							if (err_live) {
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA131',
									message: "Can't insert into live skillangels_branchgradecyclegame "
								});
							}
							else {
								if (start_val_bgcg == ((res_local_bgcg.rows.length) - 1)) {
									branch_grade_cycle_game(branch_id, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_branch_grade_cycle_game_insert(start_val_bgcg, res_local_bgcg, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
								}
							}
						});
					}
				}
			});
		})(bgcg_id, branch_id, gcg_id, statuss, sync_flag);
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_branch_grade_cycle_game_insert caused exception"
		});
	}
}

const branch_grade_cycle_game = (branch_id, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_branchgradecyclegame SET sync_flag=1 WHERE branch_id=$1", [branch_id], (err_local, res_local) => {
			if (err_local) {
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA132',
					message: "query error on updating skillangels_branchgradecyclegame on local branch_grade_cycle_game"
				});
			}
			else {
				live_branch_grade_cycle_game_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "branch_grade_cycle_game caused exception"
		});
	}
}



const live_school_period_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {

		if (incval_sb == sb_rows.rows.length) {
			incval_sb = 0;
			live_timetable_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);

		}
		else {
			temp_bran = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_schoolperiod WHERE branchid=$1 AND sync_flag=$2", [temp_bran, sflag], (err_local_period, res_local_period) => {
				if (err_local_period) {
					console.log(err_local_period);
					done_live();
					done_local();
					response.status(200).json({
						status: "Failed",
						code: 'SA133',
						message: "query error on selecting skillangels_schoolperiod on local live_school_period_sync"
					});
				} else {
					incval_sb++;
					if (res_local_period.rows.length > 0) {
						start_val_cs = -1;
						school_period_sync(start_val_cs, res_local_period, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
					} else {
						console.log("entering empty");
						live_school_period_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
					}
				}
			});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_school_period_sync caused exception"
		});
	}
}


const school_period_sync = (start_val_cs, res_local_period, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		start_val_cs = start_val_cs + 1;
		id = res_local_period.rows[start_val_cs].id;
		description = res_local_period.rows[start_val_cs].description;
		branchid = res_local_period.rows[start_val_cs].branchid;
		period = res_local_period.rows[start_val_cs].period;
		created_by = res_local_period.rows[start_val_cs].created_by;
		modified_by = res_local_period.rows[start_val_cs].modified_by;
		statuss = res_local_period.rows[start_val_cs].status;
		end_time = res_local_period.rows[start_val_cs].end_time;
		start_time = res_local_period.rows[start_val_cs].start_time;
		sync_flag = res_local_period.rows[start_val_cs].sync_flag;

		(function (id, description, branchid, period, created_by, modified_by, statuss, end_time, start_time, sync_flag) {

			client_live.query("SELECT * FROM public.skillangels_schoolperiod WHERE id=$1 AND branchid=$2", [id, branchid], (err_live_sp, res_live_sp) => {

				if (err_live_sp) {
					console.log(err_live_sp);
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA134',
						message: "query error on selecting skillangels_schoolperiod on live school_period_sync"
					});
				} else {

					if (res_live_sp.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_schoolperiod SET description=$1, period=$2, \
						created_by=$3,modified_by=$4, status=$5, end_time=$6, start_time=$7,sync_flag=$10 WHERE id=$8 AND \
						 branchid=$9", [description, period, created_by, modified_by, statuss,
							end_time, start_time, id, branchid, sync_flag], (err_live, res_live) => {
								if (err_live) {
									console.log(err_live);
									done_live()
									done_local()
									response.status(200).json({
										status: "Failed",
										code: 'SA135',
										message: "Can't update live skillangels_schoolperiod"
									});
								}
								else {
									if (start_val_cs == ((res_local_period.rows.length) - 1)) {
										school_period(branchid, sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
									}
									else {
										school_period_sync(start_val_cs, res_local_period, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
									}
								}
							});
					} else {
						client_live.query("INSERT INTO skillangels_schoolperiod (id, description, branchid, period, \
							 created_by,modified_by, status, end_time, start_time, sync_flag) VALUES \
							  ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", [id, description, branchid, period, created_by,
							modified_by, statuss, end_time, start_time, sync_flag], (err_live, res_live) => {
								if (err_live) {
									console.log(err_live);
									done_live()
									done_local()
									response.status(200).json({
										status: "Failed",
										code: 'SA136',
										message: "Can't insert into live skillangels_schoolperiod "
									});
								}
								else {
									if (start_val_cs == ((res_local_period.rows.length) - 1)) {
										school_period(branchid, sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
									}
									else {
										school_period_sync(start_val_cs, res_local_period, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
									}
								}
							});
					}
				}
			});
		})(id, description, branchid, period, created_by, modified_by, statuss, end_time, start_time, sync_flag);
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "school_period_sync caused exception"
		});
	}
}


const school_period = (branchid, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_schoolperiod SET sync_flag=1 WHERE branchid=$1", [branchid], (err_local, res_local) => {
			if (err_local) {
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA137',
					message: "query error on updating skillangels_schoolperiod on local school_period"
				});
			}
			else {
				console.log("completed" + branch_id);
				live_school_period_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "school_period caused exception"
		});
	}
}


var temp_tt;

const live_timetable_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		if (incval_sb == sb_rows.rows.length) {

			incval_sb = 0
			live_school_holidays_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
		}
		else {
			temp_tt = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_schooltimetable WHERE branchid=$1 AND sync_flag=$2", [temp_tt, sflag], (err_local_tt, res_local_tt) => {
				if (err_local_tt) {
					console.log(err_local_tt);
					done_live();
					done_local();
					response.status(200).json({
						status: "Failed",
						code: 'SA138',
						message: "query error on selecting skillangels_schooltimetable on local live_timetable_sync"
					});
				} else {
					incval_sb++;
					if (res_local_tt.rows.length > 0) {
						start_val_tt = -1;
						call_live_timetable_insert(start_val_tt, res_local_tt, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
					} else {

						live_timetable_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
					}
				}
			});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_timetable_sync caused exception"
		});
	}
}

const call_live_timetable_insert = (start_val_tt, res_local_tt, sb_rows, schoolid, response, client_live, done_live, client_local, done_local) => {
	try {

		start_val_tt = start_val_tt + 1;
		id = res_local_tt.rows[start_val_tt].id;
		created_by = res_local_tt.rows[start_val_tt].created_by;
		modified_by = res_local_tt.rows[start_val_tt].modified_by;
		statuss = res_local_tt.rows[start_val_tt].status;
		sectionid = res_local_tt.rows[start_val_tt].sectionid;
		periodid = res_local_tt.rows[start_val_tt].periodid;
		dayid = res_local_tt.rows[start_val_tt].dayid;
		branchid = res_local_tt.rows[start_val_tt].branchid;
		sync_flag = res_local_tt.rows[start_val_tt].sync_flag;

		(function (id, created_by, modified_by, statuss, sectionid, periodid, dayid, branchid, sync_flag) {
			client_live.query("SELECT * FROM public.skillangels_schooltimetable WHERE id=$1 AND branchid=$2", [id, branchid], (err_live_tt, res_live_tt) => {

				if (err_live_tt) {
					console.log(err_live_tt);
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA139',
						message: "query error on selecting skillangels_schooltimetable on live call_live_timetable_insert"
					});

				} else {
					if (res_live_tt.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_schooltimetable SET created_by=$1, modified_by=$2, status=$3, sectionid=$4, periodid=$5, dayid=$6, sync_flag=$7 WHERE id=$8 AND branchid=$9 ", [created_by, modified_by, statuss, sectionid, periodid, dayid, sync_flag, id, branchid], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA140',
									message: "Can't update live skillangels_schooltimetable"
								});
							}
							else {
								if (start_val_tt == ((res_local_tt.rows.length) - 1)) {
									timetable(branchid, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_timetable_insert(start_val_tt, res_local_tt, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
								}
							}
						});
					} else {
						client_live.query("INSERT INTO skillangels_schooltimetable (id, created_by, modified_by, status, sectionid, periodid, dayid, branchid, sync_flag) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)", [id, created_by, modified_by, statuss, sectionid, periodid, dayid, branchid, sync_flag], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA141',
									message: "Can't insert into live skillangels_schooltimetable "
								});
							}
							else {
								if (start_val_tt == ((res_local_tt.rows.length) - 1)) {
									timetable(branchid, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_timetable_insert(start_val_tt, res_local_tt, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
								}
							}
						});
					}
				}
			});
		})(id, created_by, modified_by, statuss, sectionid, periodid, dayid, branchid, sync_flag);
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_timetable_insert caused exception"
		});
	}
}

const timetable = (branchid, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_schooltimetable SET sync_flag=1 WHERE branchid=$1", [branchid], (err_local, res_local) => {
			if (err_local) {
				console.log(err_local);
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA142',
					message: "Can't update local skillangels_schooltimetable on timetable"
				});
			}
			else {
				live_timetable_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "timetable caused exception"
		});
	}
}

var temp_hd;

const live_school_holidays_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		if (incval_sb == sb_rows.rows.length) {
			incval_sb = 0;
			live_school_users_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
		}
		else {
			temp_hd = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_school_holidays WHERE  branch=$1 AND sync_flag=$2", [temp_hd, sflag], (err_local_hd, res_local_hd) => {
				if (err_local_hd) {
					console.log(err_local_hd);
					done_live();
					done_local();
					response.status(200).json({
						status: "Failed",
						code: 'SA143',
						message: "query error on selecting skillangels_school_holidays on local live_school_holidays_sync"
					});
				} else {
					incval_sb++;
					if (res_local_hd.rows.length > 0) {
						start_val_hd = -1;
						call_live_school_holidays_insert(start_val_hd, res_local_hd, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
					} else {
						live_school_holidays_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
					}
				}
			});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_school_holidays_sync caused exception"
		});
	}
}

const call_live_school_holidays_insert = (start_val_hd, res_local_hd, sb_rows, schoolid, response, client_live, done_live, client_local, done_local) => {
	try {

		start_val_hd = start_val_hd + 1;
		id = res_local_hd.rows[start_val_hd].id;
		branch = res_local_hd.rows[start_val_hd].branch;
		holiday_date = res_local_hd.rows[start_val_hd].holiday_date;
		holiday_description = res_local_hd.rows[start_val_hd].holiday_description;
		modified_by = res_local_hd.rows[start_val_hd].modified_by;
		created_by = res_local_hd.rows[start_val_hd].created_by;
		statuss = res_local_hd.rows[start_val_hd].status;
		sync_flag = res_local_hd.rows[start_val_hd].sync_flag;

		(function (id, branch, holiday_date, holiday_description, modified_by, created_by, statuss, sync_flag) {
			client_live.query("SELECT * FROM public.skillangels_school_holidays WHERE id=$1 AND branch=$2", [id, branch], (err_live_hd, res_live_hd) => {

				if (err_live_hd) {
					console.log(err_live_hd);
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA144',
						message: "query error on selecting skillangels_school_holidays on live call_live_school_holidays_insert"
					});

				} else {
					if (res_live_hd.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_school_holidays SET holiday_date=$1, holiday_description=$2, modified_by=$3, created_by=$4, status=$5,sync_flag=$6 WHERE id=$7 AND branch=$8", [holiday_date, holiday_description, modified_by, created_by, statuss, sync_flag, id, branch], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA145',
									message: "Can't update live skillangels_school_holidays"
								});
							}
							else {
								console.log()
								if (start_val_hd == ((res_local_hd.rows.length) - 1)) {
									school_holidays(branch, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_school_holidays_insert(start_val_hd, res_local_hd, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
								}
							}
						});
					} else {
						client_live.query("INSERT INTO skillangels_school_holidays (id, branch, holiday_date, holiday_description, modified_by, created_by, status, sync_flag) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)", [id, branch, holiday_date, holiday_description, modified_by, created_by, statuss, sync_flag], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA146',
									message: "Can't insert into live skillangels_school_holidays "
								});
							}
							else {
								if (start_val_hd == ((res_local_hd.rows.length) - 1)) {
									school_holidays(branch, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_school_holidays_insert(start_val_hd, res_local_hd, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
								}
							}
						});
					}
				}
			});
		})(id, branch, holiday_date, holiday_description, modified_by, created_by, statuss, sync_flag);
	} catch (e) {
		done_local();
		done_live();
		console.log(e)
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_school_holidays_insert caused exception"
		});
	}
}

const school_holidays = (branch, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_school_holidays SET sync_flag=1 WHERE branch=$1", [branch], (err_local, res_local) => {
			if (err_local) {
				console.log(err_local);
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA147',
					message: "Can't update local skillangels_school_holidays "
				});
			}
			else {
				live_school_holidays_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live)

			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "school_holidays caused exception"
		});
	}
}
var temp_usr;
const live_school_users_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		if (incval_sb == sb_rows.rows.length) {
			// done_live();
			// done_local();
			// response.status(200).json({
			// 	status: "success",
			// 	code: 'SA000',
			// 	message: "call live_crownylog_sync_doneuser"
			// });
			incval_sb = 0;
			live_crownylog_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
		}
		else {
			temp_usr = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_users WHERE branch_id=$1", [temp_usr], (err_local_u, res_local_u) => {
				if (err_local_u) {
					console.log(err_local_u);
					done_live();
					done_local();
					response.status(200).json({
						status: "Failed",
						code: 'SA148',
						message: "query error on selecting skillangels_users on local live_school_users_sync"
					});
				} else {

					incval_sb++;
					if (res_local_u.rows.length > 0) {
						start_val_user = -1;
						call_live_school_users_insert(start_val_user, res_local_u, sb_rows, schoolid, response, client_live, done_live, client_local, done_local)
					} else {
						live_school_users_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
					}

				}
			});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_school_users_sync caused exception"
		});
	}
}


const call_live_school_users_insert = (start_val_user, sb_users, sb_rows, schoolid, response, client_live, done_live, client_local, done_local) => {
	try {
		start_val_user = start_val_user + 1;

		id = sb_users.rows[start_val_user].id;
		user_name = sb_users.rows[start_val_user].user_name;
		passwordd = sb_users.rows[start_val_user].password;
		dob = sb_users.rows[start_val_user].dob;
		contact_no = sb_users.rows[start_val_user].contact_no;
		modified_by = sb_users.rows[start_val_user].modified_by;
		created_by = sb_users.rows[start_val_user].created_by;
		branch_id = sb_users.rows[start_val_user].branch_id;
		email = sb_users.rows[start_val_user].email;
		address = sb_users.rows[start_val_user].address;
		district = sb_users.rows[start_val_user].district;
		state = sb_users.rows[start_val_user].state;
		section_id = sb_users.rows[start_val_user].section_id;
		assessment_status = sb_users.rows[start_val_user].assessment_status;
		selected_lang = sb_users.rows[start_val_user].selected_lang;
		selected_theme = sb_users.rows[start_val_user].selected_theme;
		selected_music = sb_users.rows[start_val_user].selected_music;
		statuss = sb_users.rows[start_val_user].status;
		sync_flag = sb_users.rows[start_val_user].sync_flag;
		isskillkit = sb_users.rows[start_val_user].isskillkit;
		played_time = sb_users.rows[start_val_user].played_time;
		current_year_status = sb_users.rows[start_val_user].current_year_status;
		dob_password = sb_users.rows[start_val_user].dob_password;
		name = sb_users.rows[start_val_user].name;
		current_session_id = sb_users.rows[start_val_user].current_session_id;
		rule_flag = sb_users.rows[start_val_user].rule_flag;
		profile_img_name = sb_users.rows[start_val_user].profile_img_name;

		(function (id, user_name, passwordd, dob, contact_no, modified_by, created_by, branch_id, email, address, district, state, section_id, assessment_status, selected_lang, selected_theme, selected_music, statuss, sync_flag, isskillkit, played_time, current_year_status, dob_password, name, current_session_id, rule_flag, profile_img_name) {
			console.log('function skillangels_users')
			client_live.query("SELECT * FROM public.skillangels_users WHERE id=$1 AND branch_id=$2", [id, branch_id], (err_live_su, res_live_su) => {
				if (err_live_su) {
					console.log(err_live_su);
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA149',
						message: "query error on selecting skillangels_users on live call_live_school_users_insert"
					});

				} else {
					if (res_live_su.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_users SET password=$1, dob=$2, contact_no=$3,  modified_by=$4, created_by=$5,email=$6, address=$7, district=$8, state=$9, section_id=$10, assessment_status=$11, selected_lang=$12, selected_theme=$13, selected_music=$14, status=$15, sync_flag=$16, isskillkit=$17, played_time=$18, current_year_status=$19, dob_password=$20, name=$21, current_session_id=$22, rule_flag=$23, profile_img_name=$24 WHERE branch_id=$25 AND id=$26 AND  sync_flag=$27", [passwordd, dob, contact_no, modified_by, created_by, email, address, district, state, section_id, assessment_status, selected_lang, selected_theme, selected_music, statuss, sync_flag, isskillkit, played_time, current_year_status, dob_password, name, current_session_id, rule_flag, profile_img_name, branch_id, id, sflag], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA150',
									message: "Can't update live skillangels_users"
								});
							}
							else {
								if (start_val_user == ((sb_users.rows.length) - 1)) {
									school_users(branch_id, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_school_users_insert(start_val_user, sb_users, sb_rows, schoolid, response, client_live, done_live, client_local, done_local)
								}
							}
						});
					} else {
						client_live.query("INSERT INTO skillangels_users (id, user_name, password, dob, contact_no, modified_by, created_by, branch_id, email, address, district, state, section_id, assessment_status, selected_lang, selected_theme, selected_music, status, sync_flag, isskillkit, played_time, current_year_status, dob_password, name, current_session_id, rule_flag, profile_img_name) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27) ", [id, user_name, passwordd, dob, contact_no, modified_by, created_by, branch_id, email, address, district, state, section_id, assessment_status, selected_lang, selected_theme, selected_music, statuss, sync_flag, isskillkit, played_time, current_year_status, dob_password, name, current_session_id, rule_flag, profile_img_name], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA151',
									message: "Can't insert into live skillangels_users "
								});
							}
							else {
								if (start_val_user == ((sb_users.rows.length) - 1)) {
									school_users(branch_id, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_school_users_insert(start_val_user, sb_users, sb_rows, schoolid, response, client_live, done_live, client_local, done_local)
								}
							}
						});
					}
				}
			});
		})(id, user_name, passwordd, dob, contact_no, modified_by, created_by, branch_id, email, address, district, state, section_id, assessment_status, selected_lang, selected_theme, selected_music, statuss, sync_flag, isskillkit, played_time, current_year_status, dob_password, name, current_session_id, rule_flag, profile_img_name);
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_school_users_insert caused exception"
		});
	}
}

const school_users = (branch_id, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_users SET sync_flag=1 WHERE branch_id=$1 ", [branch_id], (err_local, res_local) => {
			if (err_local) {
				console.log(err_local);
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA152',
					message: "Can't update local skillangels_users"
				});
			}
			else {
				live_school_users_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "school_users caused exception"
		});
	}
}

var temp_cl;
const live_crownylog_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {

		if (incval_sb == sb_rows.rows.length) {

			incval_sb = 0;
			live_loginlog_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
		}
		else {
			temp_cl = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_crownylog WHERE uid in (SELECT id FROM public.skillangels_users WHERE branch_id=$1) and sync_flag=$2", [temp_cl, sflag], (err_local_cl, res_local_cl) => {
				if (err_local_cl) {
					console.log(err_local_cl);
					done_live();
					done_local();
					response.status(200).json({
						status: "Failed",
						code: 'SA153',
						message: "query error on selecting skillangels_crownylog on local live_crownylog_sync"
					});
				} else {
					incval_sb++;
					if (res_local_cl.rows.length > 0) {
						start_val_cl = -1;
						call_live_crownylog_insert(start_val_cl, res_local_cl, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
					} else {
						live_crownylog_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
					}
				}
			});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_crownylog_sync caused exception"
		});
	}
}

const call_live_crownylog_insert = (start_val_cl, res_local_cl, sb_rows, schoolid, response, client_live, done_live, client_local, done_local) => {
	try {

		start_val_cl = start_val_cl + 1;
		culogid = res_local_cl.rows[start_val_cl].culogid;
		uid = res_local_cl.rows[start_val_cl].uid;
		crowny = res_local_cl.rows[start_val_cl].crowny;
		addeddate = res_local_cl.rows[start_val_cl].addeddate;
		statuss = res_local_cl.rows[start_val_cl].status;
		sync_flag = res_local_cl.rows[start_val_cl].sync_flag;
		reason = res_local_cl.rows[start_val_cl].reason;
		addedtime = res_local_cl.rows[start_val_cl].addedtime;
		current_year_status = res_local_cl.rows[start_val_cl].current_year_status;

		(function (culogid, uid, crowny, addeddate, reason, addedtime, statuss, sync_flag, current_year_status) {
			client_live.query("SELECT * FROM public.skillangels_crownylog WHERE culogid=$1", [culogid], (err_live_cl, res_live_cl) => {

				if (err_live_cl) {
					console.log(err_live_cl);
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA154',
						message: "query error on selecting skillangels_crownylog on live call_live_crownylog_insert"
					});

				} else {
					if (res_live_cl.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_crownylog SET crowny=$1,addeddate=$2,status=$3, \
						sync_flag=$4,reason=$5,addedtime=$6, current_year_status=$7  \
						WHERE culogid=$8", [crowny, addeddate, statuss, sync_flag,
							reason, addedtime, current_year_status, culogid], (err_live, res_live) => {
								if (err_live) {
									console.log(err_live);
									done_live()
									done_local()
									response.status(200).json({
										status: "Failed",
										code: 'SA155',
										message: "Can't update live skillangels_crownylog"
									});
								}
								else {
									if (start_val_cl == ((res_local_cl.rows.length) - 1)) {
										crownylog(uid, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
									}
									else {
										call_live_crownylog_insert(start_val_cl, res_local_cl, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
									}
								}
							});
					} else {
						client_live.query("INSERT INTO skillangels_crownylog (culogid, uid, crowny,addeddate,status, \
							sync_flag,reason,addedtime, current_year_status) \
						 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)", [culogid, uid, crowny, addeddate, statuss, sync_flag,
							reason, addedtime, current_year_status], (err_live, res_live) => {
								if (err_live) {
									console.log(err_live);
									done_live()
									done_local()
									response.status(200).json({
										status: "Failed",
										code: 'SA156',
										message: "Can't insert into live skillangels_crownylog "
									});
								}
								else {
									if (start_val_cl == ((res_local_cl.rows.length) - 1)) {
										crownylog(uid, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
									}
									else {
										call_live_crownylog_insert(start_val_cl, res_local_cl, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
									}
								}
							});
					}
				}
			});
		})(culogid, uid, crowny, addeddate, reason, addedtime, statuss, sync_flag, current_year_status);
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_crownylog_insert caused exception"
		});
	}
}

const crownylog = (uid, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_crownylog SET sync_flag=1 WHERE uid in \
		(SELECT id FROM public.skillangels_users WHERE branch_id=  \
			(SELECT branch_id FROM public.skillangels_users WHERE id=$1))", [uid], (err_local, res_local) => {
			if (err_local) {
				console.log(err_local);
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA157',
					message: "Can't update local skillangels_crownylog "
				});
			}
			else {
				live_crownylog_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "crownylog caused exception"
		});
	}
}


var temp_log;
const live_loginlog_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {

		if (incval_sb == sb_rows.rows.length) {

			incval_sb = 0
			live_feedback_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
		}
		else {
			temp_log = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_loginlog WHERE uid in \
			(SELECT id FROM public.skillangels_users WHERE branch_id=$1) and sync_flag=$2",
				[temp_log, sflag], (err_local_log, res_local_log) => {
					if (err_local_log) {
						console.log(err_local_log);
						done_live();
						done_local();
						response.status(200).json({
							status: "Failed",
							code: 'SA158',
							message: "query error on selecting skillangels_loginlog on local live_loginlog_sync"
						});
					} else {
						incval_sb++;
						if (res_local_log.rows.length > 0) {
							start_val_cl = -1;
							call_live_loginlog_insert(start_val_cl, res_local_log, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
						} else {
							live_loginlog_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
						}
					}
				});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_loginlog_sync caused exception"
		});
	}
}

const call_live_loginlog_insert = (start_val_cl, res_local_log, sb_rows, schoolid,
	response, client_live, done_live, client_local, done_local) => {
	try {

		start_val_cl = start_val_cl + 1;
		llid = res_local_log.rows[start_val_cl].llid;
		uid = res_local_log.rows[start_val_cl].uid;
		logindate = res_local_log.rows[start_val_cl].logindate;
		logintime = res_local_log.rows[start_val_cl].logintime;
		statuss = res_local_log.rows[start_val_cl].status;
		sync_flag = res_local_log.rows[start_val_cl].sync_flag;
		current_year_status = res_local_log.rows[start_val_cl].current_year_status;

		(function (llid, uid, logindate, logintime, statuss, sync_flag, current_year_status) {
			client_live.query("SELECT * FROM public.skillangels_loginlog WHERE llid=$1", [llid], (err_live_log, res_live_log) => {

				if (err_live_log) {
					console.log(err_live_log);
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA159',
						message: "query error on selecting skillangels_loginlog on live call_live_loginlog_insert"
					});

				} else {
					if (res_live_log.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_loginlog SET logindate=$1, \
						 logintime=$2, status=$3, sync_flag=$4, current_year_status=$5 WHERE  \
						 llid=$6", [logindate, logintime, statuss, sync_flag,
							current_year_status, llid], (err_live, res_live) => {
								if (err_live) {
									console.log(err_live);
									done_live()
									done_local()
									response.status(200).json({
										status: "Failed",
										code: 'SA160',
										message: "Can't update live skillangels_loginlog"
									});
								}
								else {
									if (start_val_cl == ((res_local_log.rows.length) - 1)) {
										loginlog(uid, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
									}
									else {
										call_live_loginlog_insert(start_val_cl, res_local_log, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
									}
								}
							});
					} else {
						client_live.query("INSERT INTO skillangels_loginlog (llid, uid, \
							logindate, logintime, status, sync_flag, current_year_status ) VALUES \
							($1,$2,$3,$4,$5,$6,$7)", [llid, uid, logindate, logintime, statuss,
							sync_flag, current_year_status], (err_live, res_live) => {
								if (err_live) {
									console.log(err_live);
									done_live()
									done_local()
									response.status(200).json({
										status: "Failed",
										code: 'SA161',
										message: "Can't insert into live skillangels_loginlog "
									});
								}
								else {
									if (start_val_cl == ((res_local_log.rows.length) - 1)) {
										loginlog(uid, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
									}
									else {
										call_live_loginlog_insert(start_val_cl, res_local_log, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
									}
								}
							});
					}
				}
			});
		})(llid, uid, logindate, logintime, statuss, sync_flag, current_year_status);
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_loginlog_insert caused exception"
		});
	}
}

const loginlog = (uid, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_loginlog SET sync_flag=1 WHERE uid in \
		(SELECT id FROM public.skillangels_users WHERE branch_id=  \
			(SELECT branch_id FROM public.skillangels_users WHERE id=$1))", [uid], (err_local, res_local) => {
			if (err_local) {
				console.log(err_local);
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA162',
					message: "Can't update local skillangels_loginlog "
				});
			}
			else {
				live_loginlog_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "loginlog caused exception"
		});
	}
}



var temp_feed;
const live_feedback_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {

		if (incval_sb == sb_rows.rows.length) {

			incval_sb = 0
			live_games_entry_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
		}
		else {
			temp_feed = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_feedback WHERE user_id in \
			(SELECT id FROM public.skillangels_users WHERE branch_id=$1) and sync_flag=$2",
				[temp_feed, sflag], (err_local_feed, res_local_feed) => {
					if (err_local_feed) {
						console.log(err_local_feed);
						done_live();
						done_local();
						response.status(200).json({
							status: "Failed",
							code: 'SA163',
							message: "query error on selecting skillangels_feedback on local live_feedback_sync"
						});
					} else {
						incval_sb++;
						if (res_local_feed.rows.length > 0) {
							start_val_cl = -1;
							call_live_feedback_insert(start_val_cl, res_local_feed, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
						} else {
							live_feedback_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
						}
					}
				});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_feedback_sync caused exception"
		});
	}
}

const call_live_feedback_insert = (start_val_cl, res_local_feed, sb_rows, schoolid, response, client_live, done_live, client_local, done_local) => {
	try {

		start_val_cl = start_val_cl + 1;
		sf_id = res_local_feed.rows[start_val_cl].sf_id;
		user_id = res_local_feed.rows[start_val_cl].user_id;
		assessment_experience = res_local_feed.rows[start_val_cl].assessment_experience;
		how_to_play_instruction = res_local_feed.rows[start_val_cl].how_to_play_instruction;
		about_program = res_local_feed.rows[start_val_cl].about_program;
		solve_puzzles = res_local_feed.rows[start_val_cl].solve_puzzles;
		share_assessment_experience = res_local_feed.rows[start_val_cl].share_assessment_experience;
		description = res_local_feed.rows[start_val_cl].description;
		statuss = res_local_feed.rows[start_val_cl].status;
		sync_flag = res_local_feed.rows[start_val_cl].sync_flag;
		current_year_status = res_local_feed.rows[start_val_cl].current_year_status;

		(function (sf_id, user_id, assessment_experience, how_to_play_instruction, about_program, solve_puzzles, share_assessment_experience, description, statuss, sync_flag, current_year_status) {
			client_live.query("SELECT * FROM public.skillangels_feedback WHERE sf_id=$1", [sf_id], (err_live_feed, res_live_feed) => {

				if (err_live_feed) {
					console.log(err_live_feed);
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA164',
						message: "query error on selecting skillangels_feedback on live call_live_feedback_insert"
					});

				} else {
					if (res_live_feed.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_feedback SET assessment_experience=$1, \
						 how_to_play_instruction=$2, about_program=$3, solve_puzzles=$4, \
						 share_assessment_experience=$5,description=$6,status=$7, sync_flag=$8, \
						 current_year_status=$9 \
						  WHERE sf_id=$10", [assessment_experience, how_to_play_instruction,
							about_program, solve_puzzles, share_assessment_experience,
							description, statuss, sync_flag, current_year_status, sf_id], (err_live, res_live) => {
								if (err_live) {
									console.log(err_live);
									done_live()
									done_local()
									response.status(200).json({
										status: "Failed",
										code: 'SA165',
										message: "Can't update live skillangels_feedback"
									});
								}
								else {
									if (start_val_cl == ((res_local_feed.rows.length) - 1)) {
										feedback(user_id, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
									}
									else {
										call_live_feedback_insert(start_val_cl, res_local_feed, sb_rows, schoolid, response, client_live, done_live, client_local, done_local)
									}
								}
							});
					} else {
						client_live.query("INSERT INTO skillangels_feedback (sf_id, user_id, assessment_experience,\
							 how_to_play_instruction, about_program, solve_puzzles, share_assessment_experience,\
							  description, status, sync_flag, current_year_status) \
							  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [sf_id, user_id, assessment_experience,
							how_to_play_instruction, about_program, solve_puzzles, share_assessment_experience, description,
							statuss, sync_flag, current_year_status], (err_live, res_live) => {
								if (err_live) {
									console.log(err_live);
									done_live()
									done_local()
									response.status(200).json({
										status: "Failed",
										code: 'SA166',
										message: "Can't insert into live skillangels_feedback"
									});
								}
								else {
									if (start_val_cl == ((res_local_feed.rows.length) - 1)) {
										feedback(user_id, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
									}
									else {
										call_live_feedback_insert(start_val_cl, res_local_feed, sb_rows, schoolid, response, client_live, done_live, client_local, done_local)
									}
								}
							});
					}
				}
			});
		})(sf_id, user_id, assessment_experience, how_to_play_instruction, about_program, solve_puzzles, share_assessment_experience, description, statuss, sync_flag, current_year_status);
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_feedback_insert caused exception"
		});
	}
}

const feedback = (user_id, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_feedback SET sync_flag=1 WHERE user_id in \
		(SELECT id FROM public.skillangels_users WHERE branch_id=  \
			(SELECT branch_id FROM public.skillangels_users WHERE id=$1))", [user_id], (err_local, res_local) => {
			if (err_local) {
				console.log(err_local);
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA167',
					message: "Can't update local skillangels_feedback "
				});
			}
			else {
				live_feedback_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "feedback caused exception"
		});
	}
}



var temp_games_entry;
const live_games_entry_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {

		if (incval_sb == sb_rows.rows.length) {
			incval_sb = 0
			live_games_cylce_entry_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
		}
		else {
			temp_games_entry = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_games_entry WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1) and sync_flag=$2",
				[temp_games_entry, sflag], (err_local_games_entry, res_local_games_entry) => {
					if (err_local_games_entry) {
						console.log(err_local_games_entry);
						done_live();
						done_local();
						response.status(200).json({
							status: "Failed",
							code: 'SA168',
							message: "query error on selecting skillangels_games_entry on local live_games_entry_sync"
						});
					} else {
						incval_sb++;
						if (res_local_games_entry.rows.length > 0) {
							start_val_cl = -1;
							call_live_games_entry_insert(start_val_cl, temp_games_entry, res_local_games_entry, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
						} else {
							live_games_entry_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
						}
					}
				});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_games_entry_sync caused exception"
		});
	}
}

const call_live_games_entry_insert = (start_val_cl, temp_games_entry, res_local_games_entry, sb_rows, schoolid, response, client_live, done_live, client_local, done_local) => {
	try {

		start_val_cl = start_val_cl + 1;
		games_entry_id = res_local_games_entry.rows[start_val_cl].games_entry_id;
		user_id = res_local_games_entry.rows[start_val_cl].user_id;
		mem_game_id = res_local_games_entry.rows[start_val_cl].mem_game_id;
		vp_game_id = res_local_games_entry.rows[start_val_cl].vp_game_id;
		fa_game_id = res_local_games_entry.rows[start_val_cl].fa_game_id;
		ps_game_id = res_local_games_entry.rows[start_val_cl].ps_game_id;
		lin_game_id = res_local_games_entry.rows[start_val_cl].lin_game_id;
		event_id = res_local_games_entry.rows[start_val_cl].event_id;
		current_year_status = res_local_games_entry.rows[start_val_cl].current_year_status;
		date = res_local_games_entry.rows[start_val_cl].date;
		statuss = res_local_games_entry.rows[start_val_cl].status;
		sync_flag = res_local_games_entry.rows[start_val_cl].sync_flag;
		ass_status_id = res_local_games_entry.rows[start_val_cl].ass_status_id;
		mem_name = res_local_games_entry.rows[start_val_cl].mem_name;
		vp_name = res_local_games_entry.rows[start_val_cl].vp_name;
		fa_name = res_local_games_entry.rows[start_val_cl].fa_name;
		ps_name = res_local_games_entry.rows[start_val_cl].ps_name;
		lin_name = res_local_games_entry.rows[start_val_cl].lin_name;

		(function (games_entry_id, user_id, mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, event_id, current_year_status, date, statuss, sync_flag, ass_status_id, mem_name, vp_name, fa_name, ps_name, lin_name) {
			client_live.query("SELECT * FROM public.skillangels_games_entry WHERE games_entry_id=$1",
				[games_entry_id], (err_live_games_entry, res_live_games_entry) => {

					if (err_live_games_entry) {
						console.log(err_live_games_entry);
						done_live()
						done_local()
						response.status(200).json({
							status: "Failed",
							code: 'SA169',
							message: "query error on selecting skillangels_games_entry on live call_live_games_entry_insert"
						});

					} else {
						if (res_live_games_entry.rows.length > 0) {
							client_live.query("UPDATE public.skillangels_games_entry SET mem_game_id=$1, \
						vp_game_id=$2, fa_game_id=$3, ps_game_id=$4, lin_game_id=$5, event_id=$6,\
						 current_year_status=$7, date=$8, status=$9, sync_flag=$10, ass_status_id=$11, \
						 mem_name=$12, vp_name=$13, fa_name=$14, ps_name=$15, lin_name=$16 WHERE games_entry_id=$17",
								[mem_game_id, vp_game_id, fa_game_id,
									ps_game_id, lin_game_id, event_id, current_year_status, date, statuss, sync_flag,
									ass_status_id, mem_name, vp_name, fa_name, ps_name, lin_name, games_entry_id], (err_live, res_live) => {
										if (err_live) {
											console.log(err_live);
											done_live()
											done_local()
											response.status(200).json({
												status: "Failed",
												code: 'SA170',
												message: "Can't update live skillangels_games_entry"
											});
										}
										else {
											if (start_val_cl == ((res_local_games_entry.rows.length) - 1)) {
												games_entry(user_id, temp_games_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
											}
											else {
												call_live_games_entry_insert(start_val_cl, temp_games_entry, res_local_games_entry, sb_rows, schoolid, response, client_live, done_live, client_local, done_local)
											}
										}
									});
						} else {
							client_live.query("INSERT INTO skillangels_games_entry (games_entry_id, user_id, \
							 mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, event_id,  \
							 current_year_status, date, status, sync_flag, ass_status_id, mem_name, \
							  vp_name, fa_name, ps_name, lin_name) VALUES ($1,$2,$3,$4,$5,$6,$7,$8, \
								$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)", [games_entry_id, user_id,
								mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, event_id,
								current_year_status, date, statuss, sync_flag, ass_status_id, mem_name, vp_name,
								fa_name, ps_name, lin_name], (err_live, res_live) => {
									if (err_live) {
										console.log(err_live);
										done_live()
										done_local()
										response.status(200).json({
											status: "Failed",
											code: 'SA171',
											message: "Can't insert into live skillangels_games_entry"
										});
									}
									else {
										if (start_val_cl == ((res_local_games_entry.rows.length) - 1)) {
											games_entry(user_id, temp_games_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
										}
										else {
											call_live_games_entry_insert(start_val_cl, temp_games_entry, res_local_games_entry, sb_rows, schoolid, response, client_live, done_live, client_local, done_local)
										}
									}
								});
						}
					}
				});
		})(games_entry_id, user_id, mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, event_id, current_year_status, date, statuss, sync_flag, ass_status_id, mem_name, vp_name, fa_name, ps_name, lin_name);
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_games_entry_insert caused exception"
		});
	}
}

const games_entry = (user_id, temp_games_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_games_entry SET sync_flag=1 WHERE user_id in \
		(SELECT id FROM public.skillangels_users WHERE branch_id=$1)", [temp_games_entry], (err_local, res_local) => {
			if (err_local) {
				console.log(err_local);
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA172',
					message: "Can't update local skillangels_games_entry "
				});
			}
			else {
				live_games_entry_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "games_entry caused exception"
		});
	}
}

var temp_games_cylce_entry;
const live_games_cylce_entry_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {

		if (incval_sb == sb_rows.rows.length) {
			incval_sb = 0
			live_skillkitgames_cylce_entry_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
		}
		else {
			temp_games_cylce_entry = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_games_cylce_entry WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1) AND sync_flag=$2",
				[temp_games_cylce_entry, sflag], (err_local_games_cylce_entry, res_local_games_cylce_entry) => {
					if (err_local_games_cylce_entry) {
						console.log(err_local_games_cylce_entry);
						done_live();
						done_local();
						response.status(200).json({
							status: "Failed",
							code: 'SA173',
							message: "query error on selecting skillangels_games_cylce_entry on local live_games_cylce_entry_sync"
						});
					} else {
						incval_sb++;
						if (res_local_games_cylce_entry.rows.length > 0) {
							start_val_cl = -1;
							call_live_games_cylce_entry_insert(start_val_cl, temp_games_cylce_entry, res_local_games_cylce_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
						} else {
							live_games_cylce_entry_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
						}
					}
				});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_games_cylce_entry_sync caused exception"
		});
	}
}

const call_live_games_cylce_entry_insert = (start_val_cl, temp_games_cylce_entry, res_local_games_cylce_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {

		start_val_cl = start_val_cl + 1;
		games_cycle_entry_id = res_local_games_cylce_entry.rows[start_val_cl].games_cycle_entry_id;
		user_id = res_local_games_cylce_entry.rows[start_val_cl].user_id;
		mem_game_id = res_local_games_cylce_entry.rows[start_val_cl].mem_game_id;
		vp_game_id = res_local_games_cylce_entry.rows[start_val_cl].vp_game_id;
		fa_game_id = res_local_games_cylce_entry.rows[start_val_cl].fa_game_id;
		ps_game_id = res_local_games_cylce_entry.rows[start_val_cl].ps_game_id;
		lin_game_id = res_local_games_cylce_entry.rows[start_val_cl].lin_game_id;
		mem_name = res_local_games_cylce_entry.rows[start_val_cl].mem_name;
		vp_name = res_local_games_cylce_entry.rows[start_val_cl].vp_name;
		fa_name = res_local_games_cylce_entry.rows[start_val_cl].fa_name;
		ps_name = res_local_games_cylce_entry.rows[start_val_cl].ps_name;
		lin_name = res_local_games_cylce_entry.rows[start_val_cl].lin_name;
		ass_status_id = res_local_games_cylce_entry.rows[start_val_cl].ass_status_id;
		event_id = res_local_games_cylce_entry.rows[start_val_cl].event_id;
		current_year_status = res_local_games_cylce_entry.rows[start_val_cl].current_year_status;
		actual_start_date = res_local_games_cylce_entry.rows[start_val_cl].actual_start_date;
		actual_end_date = res_local_games_cylce_entry.rows[start_val_cl].actual_end_date;
		played_start_date = res_local_games_cylce_entry.rows[start_val_cl].played_start_date;
		played_end_date = res_local_games_cylce_entry.rows[start_val_cl].played_end_date;
		statuss = res_local_games_cylce_entry.rows[start_val_cl].status;
		sync_flag = res_local_games_cylce_entry.rows[start_val_cl].sync_flag;


		(function (games_cycle_entry_id, user_id, mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, mem_name, vp_name, fa_name, ps_name, lin_name, ass_status_id, event_id, current_year_status, actual_start_date, actual_end_date, played_start_date, played_end_date, statuss, sync_flag) {
			client_live.query("SELECT * FROM public.skillangels_games_cylce_entry WHERE games_cycle_entry_id=$1",
				[games_cycle_entry_id], (err_live_games_cylce_entry, res_live_games_cylce_entry) => {

					if (err_live_games_cylce_entry) {
						console.log(err_live_games_cylce_entry);
						done_live()
						done_local()
						response.status(200).json({
							status: "Failed",
							code: 'SA174',
							message: "query error on selecting skillangels_games_cylce_entry on live call_live_games_cylce_entry_insert"
						});

					} else {
						if (res_live_games_cylce_entry.rows.length > 0) {
							client_live.query("UPDATE public.skillangels_games_cylce_entry SET mem_game_id=$1, vp_game_id=$2,\
						 fa_game_id=$3, ps_game_id=$4, lin_game_id=$5,mem_name=$6, vp_name=$7, fa_name=$8, \
						 ps_name=$9, lin_name=$10, ass_status_id=$11, event_id=$12, current_year_status=$13,\
						  actual_start_date=$14, actual_end_date=$15, played_start_date=$16, played_end_date=$17, \
						  status=$18, sync_flag=$19 WHERE games_cycle_entry_id=$20", [mem_game_id, vp_game_id, fa_game_id,
								ps_game_id, lin_game_id, mem_name, vp_name, fa_name, ps_name, lin_name, ass_status_id, event_id,
								current_year_status, actual_start_date, actual_end_date, played_start_date, played_end_date,
								statuss, sync_flag, games_cycle_entry_id], (err_live, res_live) => {
									if (err_live) {
										console.log(err_live);
										done_live()
										done_local()
										response.status(200).json({
											status: "Failed",
											code: 'SA175',
											message: "Can't update live skillangels_games_cylce_entry"
										});
									}
									else {
										if (start_val_cl == ((res_local_games_cylce_entry.rows.length) - 1)) {
											games_cylce_entry(user_id, temp_games_cylce_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
										}
										else {
											call_live_games_cylce_entry_insert(start_val_cl, temp_games_cylce_entry, res_local_games_cylce_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
										}
									}
								});
						} else {
							client_live.query("INSERT INTO skillangels_games_cylce_entry (games_cycle_entry_id, user_id,  mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id,mem_name, vp_name, fa_name, ps_name, lin_name, ass_status_id, event_id, current_year_status, actual_start_date, actual_end_date, played_start_date, played_end_date, status, sync_flag) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)", [games_cycle_entry_id, user_id, mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, mem_name, vp_name, fa_name, ps_name, lin_name, ass_status_id, event_id, current_year_status, actual_start_date, actual_end_date, played_start_date, played_end_date, statuss, sync_flag], (err_live, res_live) => {
								if (err_live) {
									console.log(err_live);
									done_live()
									done_local()
									response.status(200).json({
										status: "Failed",
										code: 'SA176',
										message: "Can't insert into live skillangels_games_cylce_entry"
									});
								}
								else {
									if (start_val_cl == ((res_local_games_cylce_entry.rows.length) - 1)) {
										games_cylce_entry(user_id, temp_games_cylce_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
									}
									else {
										call_live_games_cylce_entry_insert(start_val_cl, temp_games_cylce_entry, res_local_games_cylce_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
									}
								}
							});
						}
					}
				});
		})(games_cycle_entry_id, user_id, mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, mem_name, vp_name, fa_name, ps_name, lin_name, ass_status_id, event_id, current_year_status, actual_start_date, actual_end_date, played_start_date, played_end_date, statuss, sync_flag);
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_games_cylce_entry_insert caused exception"
		});
	}
}

const games_cylce_entry = (user_id, temp_games_cylce_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_games_cylce_entry SET sync_flag=1 \
		WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1)", [temp_games_cylce_entry], (err_local, res_local) => {
			if (err_local) {
				console.log(err_local);
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA177',
					message: "Can't update local skillangels_games_cylce_entry "
				});
			}
			else {
				live_games_cylce_entry_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "games_cylce_entry caused exception"
		});
	}
}

var temp_skillkitgames_cylce_entry;
const live_skillkitgames_cylce_entry_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		if (incval_sb == sb_rows.rows.length) {

			incval_sb = 0
			live_gameques_entry_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
		}
		else {
			temp_skillkitgames_cylce_entry = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_skillkitgames_cylce_entry WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1) AND sync_flag=$2",
				[temp_skillkitgames_cylce_entry, sflag], (err_local_skillkitgames_cylce_entry, res_local_skillkitgames_cylce_entry) => {
					if (err_local_skillkitgames_cylce_entry) {
						console.log(err_local_skillkitgames_cylce_entry);
						done_live();
						done_local();
						response.status(200).json({
							status: "Failed",
							code: 'SA178',
							message: "query error on selecting skillangels_skillkitgames_cylce_entry on local live_skillkitgames_cylce_entry_sync"
						});
					} else {
						incval_sb++;
						if (res_local_skillkitgames_cylce_entry.rows.length > 0) {
							start_val_cl = -1;
							call_live_skillkitgames_cylce_entry_insert(start_val_cl, temp_skillkitgames_cylce_entry, res_local_skillkitgames_cylce_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
						} else {
							live_skillkitgames_cylce_entry_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
						}
					}
				});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_skillkitgames_cylce_entry_sync caused exception"
		});
	}
}

const call_live_skillkitgames_cylce_entry_insert = (start_val_cl, temp_skillkitgames_cylce_entry, res_local_skillkitgames_cylce_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {

		start_val_cl = start_val_cl + 1;
		skillkitgames_cycle_entry_id = res_local_skillkitgames_cylce_entry.rows[start_val_cl].skillkitgames_cycle_entry_id;
		user_id = res_local_skillkitgames_cylce_entry.rows[start_val_cl].user_id;
		mem_game_id = res_local_skillkitgames_cylce_entry.rows[start_val_cl].mem_game_id;
		vp_game_id = res_local_skillkitgames_cylce_entry.rows[start_val_cl].vp_game_id;
		fa_game_id = res_local_skillkitgames_cylce_entry.rows[start_val_cl].fa_game_id;
		ps_game_id = res_local_skillkitgames_cylce_entry.rows[start_val_cl].ps_game_id;
		lin_game_id = res_local_skillkitgames_cylce_entry.rows[start_val_cl].lin_game_id;
		mem_name = res_local_skillkitgames_cylce_entry.rows[start_val_cl].mem_name;
		vp_name = res_local_skillkitgames_cylce_entry.rows[start_val_cl].vp_name;
		fa_name = res_local_skillkitgames_cylce_entry.rows[start_val_cl].fa_name;
		ps_name = res_local_skillkitgames_cylce_entry.rows[start_val_cl].ps_name;
		lin_name = res_local_skillkitgames_cylce_entry.rows[start_val_cl].lin_name;
		ass_status_id = res_local_skillkitgames_cylce_entry.rows[start_val_cl].ass_status_id;
		event_id = res_local_skillkitgames_cylce_entry.rows[start_val_cl].event_id;
		current_year_status = res_local_skillkitgames_cylce_entry.rows[start_val_cl].current_year_status;
		actual_start_date = res_local_skillkitgames_cylce_entry.rows[start_val_cl].actual_start_date;
		actual_end_date = res_local_skillkitgames_cylce_entry.rows[start_val_cl].actual_end_date;
		played_start_date = res_local_skillkitgames_cylce_entry.rows[start_val_cl].played_start_date;
		played_end_date = res_local_skillkitgames_cylce_entry.rows[start_val_cl].played_end_date;
		statuss = res_local_skillkitgames_cylce_entry.rows[start_val_cl].status;
		sync_flag = res_local_skillkitgames_cylce_entry.rows[start_val_cl].sync_flag;
		skillcnt = res_local_skillkitgames_cylce_entry.rows[start_val_cl].skillcnt;

		(function (skillkitgames_cycle_entry_id, user_id, mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, mem_name, vp_name, fa_name, ps_name, lin_name, ass_status_id, event_id, current_year_status, actual_start_date, actual_end_date, played_start_date, played_end_date, statuss, sync_flag, skillcnt) {
			client_live.query("SELECT * FROM public.skillangels_skillkitgames_cylce_entry WHERE skillkitgames_cycle_entry_id=$1",
				[skillkitgames_cycle_entry_id], (err_live_skillkitgames_cylce_entry, res_live_skillkitgames_cylce_entry) => {

					if (err_live_skillkitgames_cylce_entry) {
						console.log(err_live_skillkitgames_cylce_entry);
						done_live()
						done_local()
						response.status(200).json({
							status: "Failed",
							code: 'SA179',
							message: "query error on selecting skillangels_skillkitgames_cylce_entry on live call_live_skillkitgames_cylce_entry_insert"
						});

					} else {
						if (res_live_skillkitgames_cylce_entry.rows.length > 0) {
							client_live.query("UPDATE public.skillangels_skillkitgames_cylce_entry SET mem_game_id=$1, vp_game_id=$2, fa_game_id=$3, ps_game_id=$4, lin_game_id=$5,mem_name=$6, vp_name=$7, fa_name=$8, ps_name=$9, lin_name=$10, ass_status_id=$11, event_id=$12, current_year_status=$13, actual_start_date=$14, actual_end_date=$15, played_start_date=$16, played_end_date=$17, status=$18, sync_flag=$19, skillcnt=$20 WHERE skillkitgames_cycle_entry_id=$21", [mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, mem_name, vp_name, fa_name, ps_name, lin_name, ass_status_id, event_id, current_year_status, actual_start_date, actual_end_date, played_start_date, played_end_date, statuss, sync_flag, skillcnt, skillkitgames_cycle_entry_id], (err_live, res_live) => {
								if (err_live) {
									console.log(err_live);
									done_live()
									done_local()
									response.status(200).json({
										status: "Failed",
										code: 'SA180',
										message: "Can't update live skillangels_skillkitgames_cylce_entry"
									});
								}
								else {
									if (start_val_cl == ((res_local_skillkitgames_cylce_entry.rows.length) - 1)) {
										skillkitgames_cylce_entry(user_id, temp_skillkitgames_cylce_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
									}
									else {
										call_live_skillkitgames_cylce_entry_insert(start_val_cl, temp_skillkitgames_cylce_entry, res_local_skillkitgames_cylce_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
									}
								}
							});
						} else {
							client_live.query("INSERT INTO skillangels_skillkitgames_cylce_entry (skillkitgames_cycle_entry_id, user_id,  mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id,mem_name, vp_name, fa_name, ps_name, lin_name, ass_status_id, event_id, current_year_status, actual_start_date, actual_end_date, played_start_date, played_end_date, status, sync_flag, skillcnt) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)", [skillkitgames_cycle_entry_id, user_id, mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, mem_name, vp_name, fa_name, ps_name, lin_name, ass_status_id, event_id, current_year_status, actual_start_date, actual_end_date, played_start_date, played_end_date, statuss, sync_flag, skillcnt], (err_live, res_live) => {
								if (err_live) {
									console.log(err_live);
									done_live()
									done_local()
									response.status(200).json({
										status: "Failed",
										code: 'SA181',
										message: "Can't insert into live skillangels_skillkitgames_cylce_entry"
									});
								}
								else {
									if (start_val_cl == ((res_local_skillkitgames_cylce_entry.rows.length) - 1)) {
										skillkitgames_cylce_entry(user_id, temp_skillkitgames_cylce_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
									}
									else {
										call_live_skillkitgames_cylce_entry_insert(start_val_cl, temp_skillkitgames_cylce_entry, res_local_skillkitgames_cylce_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
									}
								}
							});
						}
					}
				});
		})(skillkitgames_cycle_entry_id, user_id, mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, mem_name, vp_name, fa_name, ps_name, lin_name, ass_status_id, event_id, current_year_status, actual_start_date, actual_end_date, played_start_date, played_end_date, statuss, sync_flag, skillcnt);
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_skillkitgames_cylce_entry_insert caused exception"
		});
	}
}

const skillkitgames_cylce_entry = (user_id, temp_skillkitgames_cylce_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_skillkitgames_cylce_entry SET sync_flag=1 WHERE \
		 user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1)", [temp_skillkitgames_cylce_entry], (err_local, res_local) => {
			if (err_local) {
				console.log(err_local);
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA182',
					message: "Can't update local skillangels_skillkitgames_cylce_entry "
				});
			}
			else {
				live_skillkitgames_cylce_entry_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "skillkitgames_cylce_entry caused exception"
		});
	}
}


var temp_gameques_entry;
const live_gameques_entry_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		if (incval_sb == sb_rows.rows.length) {
			incval_sb = 0
			live_userscore_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
		}
		else {
			temp_gameques_entry = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_gameques_entry WHERE \
			user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1 ) AND sync_flag=$2", [temp_gameques_entry, sflag], (err_local_gameques_entry, res_local_gameques_entry) => {
				if (err_local_gameques_entry) {
					console.log(err_local_gameques_entry);
					done_live();
					done_local();
					response.status(200).json({
						status: "Failed",
						code: 'SA183',
						message: "query error on selecting skillangels_gameques_entry on local live_gameques_entry_sync"
					});
				} else {
					incval_sb++;
					if (res_local_gameques_entry.rows.length > 0) {
						start_val_cl = -1;
						call_live_gameques_entry_insert(start_val_cl, temp_gameques_entry, res_local_gameques_entry, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
					} else {
						live_gameques_entry_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
					}
				}
			});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_games_entry_sync caused exception"
		});
	}
}

const call_live_gameques_entry_insert = (start_val_cl, temp_gameques_entry, res_local_gameques_entry, sb_rows, schoolid, response, client_live, done_live, client_local, done_local) => {
	try {

		start_val_cl = start_val_cl + 1;
		gameques_id = res_local_gameques_entry.rows[start_val_cl].gameques_id;
		user_id = res_local_gameques_entry.rows[start_val_cl].user_id;
		game_id = res_local_gameques_entry.rows[start_val_cl].game_id;
		event_id = res_local_gameques_entry.rows[start_val_cl].event_id;
		quesno = res_local_gameques_entry.rows[start_val_cl].quesno;
		score = res_local_gameques_entry.rows[start_val_cl].score;
		ansvalidation = res_local_gameques_entry.rows[start_val_cl].ansvalidation;
		responsetime = res_local_gameques_entry.rows[start_val_cl].responsetime;
		answeredtime = res_local_gameques_entry.rows[start_val_cl].answeredtime;
		ass_status_id = res_local_gameques_entry.rows[start_val_cl].ass_status_id;
		finish_status = res_local_gameques_entry.rows[start_val_cl].finish_status;
		statuss = res_local_gameques_entry.rows[start_val_cl].status;
		sync_flag = res_local_gameques_entry.rows[start_val_cl].sync_flag;
		current_year_status = res_local_gameques_entry.rows[start_val_cl].current_year_status;

		(function (gameques_id, user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, answeredtime, ass_status_id, finish_status, statuss, sync_flag, current_year_status) {
			client_live.query("SELECT * FROM public.skillangels_gameques_entry WHERE gameques_id=$1", [gameques_id], (err_live_gqe, res_live_gqe) => {

				if (err_live_gqe) {
					console.log(err_live_gqe);
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA184',
						message: "query error on selecting skillangels_gameques_entry on live call_live_gameques_entry_insert"
					});

				} else {
					if (res_live_gqe.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_gameques_entry SET game_id=$1, event_id=$2, quesno=$3,score=$4, ansvalidation=$5, responsetime=$6, answeredtime=$7, ass_status_id=$8,  finish_status=$9,status=$10,sync_flag=$11, current_year_status=$12 WHERE gameques_id=$13", [game_id, event_id, quesno, score, ansvalidation, responsetime, answeredtime, ass_status_id, finish_status, statuss, sync_flag, current_year_status, gameques_id], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA185',
									message: "Can't update live skillangels_gameques_entry"
								});
							}
							else {
								if (start_val_cl == ((res_local_gameques_entry.rows.length) - 1)) {
									gameques_entry(user_id, temp_gameques_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_gameques_entry_insert(start_val_cl, temp_gameques_entry, res_local_gameques_entry, sb_rows, schoolid, response, client_live, done_live, client_local, done_local)
								}
							}
						});
					} else {
						client_live.query("INSERT INTO skillangels_gameques_entry (gameques_id, user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, answeredtime, ass_status_id, finish_status,status, sync_flag, current_year_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)", [gameques_id, user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, answeredtime, ass_status_id, finish_status, statuss, sync_flag, current_year_status], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA186',
									message: "Can't insert into live skillangels_gameques_entry"
								});
							}
							else {
								if (start_val_cl == ((res_local_gameques_entry.rows.length) - 1)) {
									gameques_entry(user_id, temp_gameques_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_gameques_entry_insert(start_val_cl, temp_gameques_entry, res_local_gameques_entry, sb_rows, schoolid, response, client_live, done_live, client_local, done_local)
								}
							}
						});
					}
				}
			});
		})(gameques_id, user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, answeredtime, ass_status_id, finish_status, statuss, sync_flag, current_year_status);
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_gameques_entry_insert caused exception"
		});
	}
}

const gameques_entry = (user_id, temp_gameques_entry, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_gameques_entry SET sync_flag=1 WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1)", [temp_gameques_entry], (err_local, res_local) => {
			if (err_local) {
				console.log(err_local);
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA187',
					message: "Can't update local skillangels_gameques_entry "
				});
			}
			else {
				live_gameques_entry_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "gameques_entry caused exception"
		});
	}
}

var temp_userscore;
const live_userscore_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		if (incval_sb == sb_rows.rows.length) {
			incval_sb = 0
			live_userfinishcycle_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
		}
		else {
			temp_userscore = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_userscore WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1 ) AND sync_flag=$2 ORDER BY userscore_id ASC",
				[temp_userscore, sflag], (err_local_userscore_entry, res_local_userscore_entry) => {
					if (err_local_userscore_entry) {
						console.log(err_local_userscore_entry);
						done_live();
						done_local();
						response.status(200).json({
							status: "Failed",
							code: 'SA188',
							message: "query error on selecting skillangels_userscore on local live_userscore_sync"
						});
					} else {
						incval_sb++;
						if (res_local_userscore_entry.rows.length > 0) {
							start_val_cl = -1;
							call_live_userscore_insert(start_val_cl, temp_userscore, res_local_userscore_entry, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
						} else {
							live_userscore_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
						}
					}
				});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_userscore_sync caused exception"
		});
	}
}

const call_live_userscore_insert = (start_val_cl, temp_userscore, res_local_userscore_entry, sb_rows, schoolid, response, client_live, done_live, client_local, done_local) => {
	try {
		start_val_cl = start_val_cl + 1;
		userscore_id = res_local_userscore_entry.rows[start_val_cl].userscore_id;
		user_id = res_local_userscore_entry.rows[start_val_cl].user_id;
		game_id = res_local_userscore_entry.rows[start_val_cl].game_id;
		event_id = res_local_userscore_entry.rows[start_val_cl].event_id;
		score = res_local_userscore_entry.rows[start_val_cl].score;
		correctcnt = res_local_userscore_entry.rows[start_val_cl].correctcnt;
		wrongcnt = res_local_userscore_entry.rows[start_val_cl].wrongcnt;
		ansquescnt = res_local_userscore_entry.rows[start_val_cl].ansquescnt;
		totalquescnt = res_local_userscore_entry.rows[start_val_cl].totalquescnt;
		responsetime = res_local_userscore_entry.rows[start_val_cl].responsetime;
		wrongresponsetime = res_local_userscore_entry.rows[start_val_cl].wrongresponsetime;
		correctresponsetime = res_local_userscore_entry.rows[start_val_cl].correctresponsetime;
		gametime = res_local_userscore_entry.rows[start_val_cl].gametime;
		date = res_local_userscore_entry.rows[start_val_cl].date;
		statuss = res_local_userscore_entry.rows[start_val_cl].status;
		ass_status_id = res_local_userscore_entry.rows[start_val_cl].ass_status_id;
		ass_slot = res_local_userscore_entry.rows[start_val_cl].ass_slot;
		sync_flag = res_local_userscore_entry.rows[start_val_cl].sync_flag;
		current_year_status = res_local_userscore_entry.rows[start_val_cl].current_year_status;

		(function (userscore_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime, date, statuss, ass_status_id, ass_slot, sync_flag, current_year_status) {
			client_live.query("SELECT * FROM public.skillangels_userscore WHERE userscore_id=$1", [userscore_id], (err_live_us, res_live_us) => {

				if (err_live_us) {
					console.log(err_live_us);
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA189',
						message: "query error on selecting skillangels_userscore on live call_live_userscore_insert"
					});

				} else {
					if (res_live_us.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_userscore SET game_id=$1, event_id=$2, score=$3,correctcnt=$4, wrongcnt=$5, ansquescnt=$6, totalquescnt=$7, responsetime=$8, wrongresponsetime=$9,correctresponsetime=$10,gametime=$11, date=$12, status=$13, ass_status_id=$14, ass_slot=$15, sync_flag=$16, current_year_status=$17 WHERE userscore_id=$18", [game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime, date, statuss, ass_status_id, ass_slot, sync_flag, current_year_status, userscore_id], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA190',
									message: "Can't update live skillangels_userscore"
								});
							}
							else {
								if (start_val_cl == ((res_local_userscore_entry.rows.length) - 1)) {
									userscore(user_id, temp_userscore, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_userscore_insert(start_val_cl, temp_userscore, res_local_userscore_entry, sb_rows, schoolid, response, client_live, done_live, client_local, done_local)
								}
							}
						});
					} else {
						client_live.query("INSERT INTO skillangels_userscore (userscore_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime,  date, status, ass_status_id, ass_slot, sync_flag, current_year_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)", [userscore_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime, date, statuss, ass_status_id, ass_slot, sync_flag, current_year_status], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA191',
									message: "Can't insert into live skillangels_userscore"
								});
							}
							else {
								if (start_val_cl == ((res_local_userscore_entry.rows.length) - 1)) {
									userscore(user_id, temp_userscore, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_userscore_insert(start_val_cl, temp_userscore, res_local_userscore_entry, sb_rows, schoolid, response, client_live, done_live, client_local, done_local)
								}
							}
						});
					}
				}
			});
		})(userscore_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime, date, statuss, ass_status_id, ass_slot, sync_flag, current_year_status);
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_userscore_insert caused exception"
		});
	}
}

const userscore = (user_id, temp_userscore, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_userscore SET sync_flag=1 WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1)", [temp_userscore], (err_local, res_local) => {
			if (err_local) {
				console.log(err_local);
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA192',
					message: "Can't update local skillangels_userscore "
				});
			}
			else {
				live_userscore_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "userscore caused exception"
		});
	}
}

var temp_userfinishcycle;
const live_userfinishcycle_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		if (incval_sb == sb_rows.rows.length) {
			incval_sb = 0
			live_usermaxscore_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
		}
		else {
			temp_userfinishcycle = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_userfinishcycle WHERE \
			user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1 ) AND sync_flag=$2",
				[temp_userfinishcycle, sflag], (err_local_ufc, res_local_ufc) => {
					if (err_local_ufc) {
						console.log(err_local_ufc);
						done_live();
						done_local();
						response.status(200).json({
							status: "Failed",
							code: 'SA193',
							message: "query error on selecting skillangels_games_entry on local live_userfinishcycle_sync"
						});
					} else {
						incval_sb++;
						if (res_local_ufc.rows.length > 0) {
							start_val_cl = -1;
							call_live_userfinishcycle_insert(start_val_cl, temp_userfinishcycle, res_local_ufc, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
						} else {
							live_userfinishcycle_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
						}
					}
				});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_userfinishcycle_sync caused exception"
		});
	}
}

const call_live_userfinishcycle_insert = (start_val_cl, temp_userfinishcycle, res_local_ufc, sb_rows, schoolid, response, client_live, done_live, client_local, done_local) => {
	try {
		start_val_cl = start_val_cl + 1;
		ufc_id = res_local_ufc.rows[start_val_cl].ufc_id;
		user_id = res_local_ufc.rows[start_val_cl].user_id;
		cycle_id = res_local_ufc.rows[start_val_cl].cycle_id;
		assess_status_id = res_local_ufc.rows[start_val_cl].assess_status_id;
		m_score = res_local_ufc.rows[start_val_cl].m_score;
		v_score = res_local_ufc.rows[start_val_cl].v_score;
		f_score = res_local_ufc.rows[start_val_cl].f_score;
		p_score = res_local_ufc.rows[start_val_cl].p_score;
		l_score = res_local_ufc.rows[start_val_cl].l_score;
		m_attempt_cnt = res_local_ufc.rows[start_val_cl].m_attempt_cnt;
		v_attempt_cnt = res_local_ufc.rows[start_val_cl].v_attempt_cnt;
		f_attempt_cnt = res_local_ufc.rows[start_val_cl].f_attempt_cnt;
		p_attempt_cnt = res_local_ufc.rows[start_val_cl].p_attempt_cnt;
		l_attempt_cnt = res_local_ufc.rows[start_val_cl].l_attempt_cnt;
		date = res_local_ufc.rows[start_val_cl].date;
		statuss = res_local_ufc.rows[start_val_cl].status;
		sync_flag = res_local_ufc.rows[start_val_cl].sync_flag;
		current_year_status = res_local_ufc.rows[start_val_cl].current_year_status;

		(function (ufc_id, user_id, cycle_id, assess_status_id, m_score, v_score, f_score, p_score, l_score, m_attempt_cnt, v_attempt_cnt, f_attempt_cnt, p_attempt_cnt, l_attempt_cnt, date, statuss, sync_flag, current_year_status) {
			client_live.query("SELECT * FROM public.skillangels_userfinishcycle WHERE ufc_id=$1", [ufc_id], (err_live_ufc, res_live_ufc) => {

				if (err_live_ufc) {
					console.log(err_live_ufc);
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA194',
						message: "query error on selecting skillangels_userfinishcycle on live call_live_userfinishcycle_insert"
					});

				} else {
					if (res_live_ufc.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_userfinishcycle SET cycle_id=$1, assess_status_id=$2, m_score=$3,v_score=$4, f_score=$5, p_score=$6, l_score=$7, m_attempt_cnt=$8, v_attempt_cnt=$9, f_attempt_cnt=$10, p_attempt_cnt=$11, l_attempt_cnt=$12, date=$13, status=$14, sync_flag=$15, current_year_status=$16 WHERE ufc_id=$17 AND ufc_id=$18", [cycle_id, assess_status_id, m_score, v_score, f_score, p_score, l_score, m_attempt_cnt, v_attempt_cnt, f_attempt_cnt, p_attempt_cnt, l_attempt_cnt, date, statuss, sync_flag, current_year_status, ufc_id, ufc_id], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA195',
									message: "Can't update live skillangels_userfinishcycle"
								});
							}
							else {
								if (start_val_cl == ((res_local_ufc.rows.length) - 1)) {
									userfinishcycle(user_id, temp_userfinishcycle, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_userfinishcycle_insert(start_val_cl, temp_userfinishcycle, res_local_ufc, sb_rows, schoolid, response, client_live, done_live, client_local, done_local)
								}
							}
						});
					} else {
						client_live.query("INSERT INTO skillangels_userfinishcycle (ufc_id, user_id, cycle_id, assess_status_id, m_score, v_score, f_score, p_score, l_score, m_attempt_cnt, v_attempt_cnt, f_attempt_cnt, p_attempt_cnt, l_attempt_cnt, date, status, sync_flag, current_year_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)", [ufc_id, user_id, cycle_id, assess_status_id, m_score, v_score, f_score, p_score, l_score, m_attempt_cnt, v_attempt_cnt, f_attempt_cnt, p_attempt_cnt, l_attempt_cnt, date, statuss, sync_flag, current_year_status], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA196',
									message: "Can't insert into live skillangels_userfinishcycle"
								});
							}
							else {
								if (start_val_cl == ((res_local_ufc.rows.length) - 1)) {
									userfinishcycle(user_id, temp_userfinishcycle, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_userfinishcycle_insert(start_val_cl, temp_userfinishcycle, res_local_ufc, sb_rows, schoolid, response, client_live, done_live, client_local, done_local)
								}
							}
						});
					}
				}
			});
		})(ufc_id, user_id, cycle_id, assess_status_id, m_score, v_score, f_score, p_score, l_score, m_attempt_cnt, v_attempt_cnt, f_attempt_cnt, p_attempt_cnt, l_attempt_cnt, date, statuss, sync_flag, current_year_status);
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_userfinishcycle_insert caused exception"
		});
	}
}

const userfinishcycle = (user_id, temp_userfinishcycle, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_userfinishcycle SET sync_flag=1 WHERE user_id in \
		(SELECT id FROM public.skillangels_users WHERE branch_id=$1)", [temp_userfinishcycle], (err_local, res_local) => {
			if (err_local) {
				console.log(err_local);
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA197',
					message: "Can't update local skillangels_userfinishcycle "
				});
			}
			else {

				live_userfinishcycle_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "userfinishcycle caused exception"
		});
	}
}

var temp_usermaxscore;
const live_usermaxscore_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {

		if (incval_sb == sb_rows.rows.length) {

			incval_sb = 0
			live_skillkitscore_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
		}
		else {
			temp_usermaxscore = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_usermaxscore WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1 ) AND sync_flag=$2", [temp_usermaxscore, sflag], (err_local_ums, res_local_ums) => {
				if (err_local_ums) {
					console.log(err_local_ums);
					done_live();
					done_local();
					response.status(200).json({
						status: "Failed",
						code: 'SA198',
						message: "query error on selecting skillangels_usermaxscore on local live_usermaxscore_sync"
					});
				} else {
					incval_sb++;
					if (res_local_ums.rows.length > 0) {
						start_val_cl = -1;
						call_live_usermaxscore_insert(start_val_cl, temp_usermaxscore, res_local_ums, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
					} else {
						live_usermaxscore_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
					}
				}
			});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_usermaxscore_sync caused exception"
		});
	}
}

const call_live_usermaxscore_insert = (start_val_cl, temp_usermaxscore, res_local_ums, sb_rows, schoolid, response, client_live, done_live, client_local, done_local) => {
	try {

		start_val_cl = start_val_cl + 1;
		ums_id = res_local_ums.rows[start_val_cl].ums_id;
		user_id = res_local_ums.rows[start_val_cl].user_id;
		cycle_id = res_local_ums.rows[start_val_cl].cycle_id;
		assess_status_id = res_local_ums.rows[start_val_cl].assess_status_id;
		max_m_score = res_local_ums.rows[start_val_cl].max_m_score;
		max_v_score = res_local_ums.rows[start_val_cl].max_v_score;
		max_f_score = res_local_ums.rows[start_val_cl].max_f_score;
		max_p_score = res_local_ums.rows[start_val_cl].max_p_score;
		max_l_score = res_local_ums.rows[start_val_cl].max_l_score;
		statuss = res_local_ums.rows[start_val_cl].status;
		date = res_local_ums.rows[start_val_cl].date;
		sync_flag = res_local_ums.rows[start_val_cl].sync_flag;
		current_year_status = res_local_ums.rows[start_val_cl].current_year_status;

		(function (ums_id, user_id, cycle_id, assess_status_id, max_m_score, max_v_score, max_f_score, max_p_score, max_l_score, statuss, date, sync_flag, current_year_status) {
			client_live.query("SELECT * FROM public.skillangels_usermaxscore WHERE ums_id=$1", [ums_id], (err_live_ums, res_live_ums) => {
				if (err_live_ums) {
					console.log(err_live_ums);
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA199',
						message: "query error on selecting skillangels_usermaxscore on live call_live_usermaxscore_insert"
					});
				} else {
					if (res_live_ums.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_usermaxscore SET cycle_id=$1, assess_status_id=$2, max_m_score=$3,max_v_score=$4, max_f_score=$5, max_p_score=$6, max_l_score=$7, status=$8, date=$9,  sync_flag=$10, current_year_status=$11 WHERE ums_id=$12", [cycle_id, assess_status_id, max_m_score, max_v_score, max_f_score, max_p_score, max_l_score, statuss, date, sync_flag, current_year_status, ums_id], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA200',
									message: "Can't update live skillangels_usermaxscore"
								});
							}
							else {
								if (start_val_cl == ((res_local_ums.rows.length) - 1)) {
									usermaxscore(user_id, temp_usermaxscore, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_usermaxscore_insert(start_val_cl, temp_usermaxscore, res_local_ums, sb_rows, schoolid, response, client_live, done_live, client_local, done_local)
								}
							}
						});
					} else {
						client_live.query("INSERT INTO skillangels_usermaxscore (ums_id, user_id, cycle_id, assess_status_id, max_m_score, max_v_score, max_f_score, max_p_score, max_l_score,  status, date, sync_flag, current_year_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)", [ums_id, user_id, cycle_id, assess_status_id, max_m_score, max_v_score, max_f_score, max_p_score, max_l_score, statuss, date, sync_flag, current_year_status], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA201',
									message: "Can't insert into live skillangels_usermaxscore"
								});
							}
							else {
								if (start_val_cl == ((res_local_ums.rows.length) - 1)) {
									usermaxscore(user_id, temp_usermaxscore, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_usermaxscore_insert(start_val_cl, temp_usermaxscore, res_local_ums, sb_rows, schoolid, response, client_live, done_live, client_local, done_local)
								}
							}
						});
					}
				}
			});
		})(ums_id, user_id, cycle_id, assess_status_id, max_m_score, max_v_score, max_f_score, max_p_score, max_l_score, statuss, date, sync_flag, current_year_status);
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_usermaxscore_insert caused exception"
		});
	}
}

const usermaxscore = (user_id, temp_usermaxscore, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_usermaxscore SET sync_flag=1 WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1)", [temp_usermaxscore], (err_local, res_local) => {
			if (err_local) {
				console.log(err_local);
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA202',
					message: "Can't update local skillangels_usermaxscore "
				});
			}
			else {
				live_usermaxscore_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "usermaxscore caused exception"
		});
	}
}



var temp_skillkitscore;
const live_skillkitscore_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		if (incval_sb == sb_rows.rows.length) {
			incval_sb = 0
			live_skillkit_usermaxscore_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
		}
		else {
			temp_skillkitscore = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_skillkitscore WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1 ) AND sync_flag=$2", [temp_skillkitscore, sflag], (err_local_sks, res_local_sks) => {
				if (err_local_sks) {
					console.log(err_local_sks);
					done_live();
					done_local();
					response.status(200).json({
						status: "Failed",
						code: 'SA203',
						message: "query error on selecting skillangels_skillkitscore on local live_skillkitscore_sync"
					});
				} else {
					incval_sb++;
					if (res_local_sks.rows.length > 0) {
						start_val_cl = -1;
						call_live_skillkitscore_insert(start_val_cl, temp_skillkitscore, res_local_sks, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
					} else {
						live_skillkitscore_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
					}
				}
			});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_skillkitscore_sync caused exception"
		});
	}
}

const call_live_skillkitscore_insert = (start_val_cl, temp_skillkitscore, res_local_sks, sb_rows, schoolid, response, client_live, done_live, client_local, done_local) => {
	try {

		start_val_cl = start_val_cl + 1;
		skscore_id = res_local_sks.rows[start_val_cl].skscore_id;
		user_id = res_local_sks.rows[start_val_cl].user_id;
		game_id = res_local_sks.rows[start_val_cl].game_id;
		event_id = res_local_sks.rows[start_val_cl].event_id;
		score = res_local_sks.rows[start_val_cl].score;
		correctcnt = res_local_sks.rows[start_val_cl].correctcnt;
		wrongcnt = res_local_sks.rows[start_val_cl].wrongcnt;
		ansquescnt = res_local_sks.rows[start_val_cl].ansquescnt;
		totalquescnt = res_local_sks.rows[start_val_cl].totalquescnt;
		responsetime = res_local_sks.rows[start_val_cl].responsetime;
		wrongresponsetime = res_local_sks.rows[start_val_cl].wrongresponsetime;
		correctresponsetime = res_local_sks.rows[start_val_cl].correctresponsetime;
		gametime = res_local_sks.rows[start_val_cl].gametime;
		played_date = res_local_sks.rows[start_val_cl].played_date;
		skillkit = res_local_sks.rows[start_val_cl].skillkit;
		statuss = res_local_sks.rows[start_val_cl].status;
		sync_flag = res_local_sks.rows[start_val_cl].sync_flag;
		current_year_status = res_local_sks.rows[start_val_cl].current_year_status;
		testtype = res_local_sks.rows[start_val_cl].testtype;

		(function (skscore_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime, played_date, skillkit, statuss, sync_flag, current_year_status, testtype) {
			client_live.query("SELECT * FROM public.skillangels_skillkitscore WHERE skscore_id=$1 AND sync_flag=$2", [skscore_id, sflag], (err_live_sks, res_live_sks) => {

				if (err_live_sks) {
					console.log(err_live_sks);
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA204',
						message: "query error on selecting skillangels_skillkitscore on live call_live_skillkitscore_insert"
					});

				} else {
					if (res_live_sks.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_skillkitscore SET game_id=$1, event_id=$2, score=$3,correctcnt=$4, wrongcnt=$5, ansquescnt=$6, totalquescnt=$7, responsetime=$8,\
						wrongresponsetime=$9,correctresponsetime=$10,gametime=$11, played_date=$12, skillkit=$13, status=$14, sync_flag=$15, current_year_status=$16, testtype=$17 WHERE skscore_id=$18 AND skscore_id=$19", [game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime, played_date, skillkit, statuss, sync_flag, current_year_status, testtype, skscore_id, skscore_id], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA205',
									message: "Can't update live skillangels_skillkitscore"
								});
							}
							else {
								if (start_val_cl == ((res_local_sks.rows.length) - 1)) {
									skillkitscore(user_id, temp_skillkitscore, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_skillkitscore_insert(start_val_cl, temp_skillkitscore, res_local_sks, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
								}
							}
						});
					} else {
						client_live.query("INSERT INTO skillangels_skillkitscore (skscore_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime,  played_date, skillkit, status, sync_flag, current_year_status, testtype) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)", [skscore_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime, played_date, skillkit, statuss, sync_flag, current_year_status, testtype], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA206',
									message: "Can't insert into live skillangels_skillkitscore"
								});
							}
							else {
								if (start_val_cl == ((res_local_sks.rows.length) - 1)) {
									skillkitscore(user_id, temp_skillkitscore, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_skillkitscore_insert(start_val_cl, temp_skillkitscore, res_local_sks, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
								}
							}
						});
					}
				}
			});
		})(skscore_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime, played_date, skillkit, statuss, sync_flag, current_year_status, testtype);
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_skillkitscore_insert caused exception"
		});
	}
}

const skillkitscore = (user_id, temp_skillkitscore, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_skillkitscore SET sync_flag=1 WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1)", [temp_skillkitscore], (err_local, res_local) => {
			if (err_local) {
				console.log(err_local);
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA207',
					message: "Can't update local skillangels_skillkitscore "
				});
			}
			else {
				live_skillkitscore_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "skillkitscore caused exception"
		});
	}
}

var temp_skillkit_usermaxscore;
const live_skillkit_usermaxscore_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {

		if (incval_sb == sb_rows.rows.length) {
			incval_sb = 0
			live_usertotalvalue_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
		}
		else {
			temp_skillkit_usermaxscore = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_skillkit_usermaxscore WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1 ) AND sync_flag=$2", [temp_skillkit_usermaxscore, sflag], (err_local_skums, res_local_skums) => {
				if (err_local_skums) {
					console.log(err_local_skums);
					done_live();
					done_local();
					response.status(200).json({
						status: "Failed",
						code: 'SA208',
						message: "query error on selecting skillangels_skillkit_usermaxscore on local live_skillkit_usermaxscore_sync"
					});
				} else {
					incval_sb++;
					if (res_local_skums.rows.length > 0) {
						start_val_cl = -1;
						call_live_skillkit_usermaxscore_insert(start_val_cl, temp_skillkit_usermaxscore, res_local_skums, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
					} else {
						live_skillkit_usermaxscore_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
					}
				}
			});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_skillkit_usermaxscore_sync caused exception"
		});
	}
}

const call_live_skillkit_usermaxscore_insert = (start_val_cl, temp_skillkit_usermaxscore, res_local_skums, sb_rows, schoolid, response, client_live, done_live, client_local, done_local) => {
	try {
		start_val_cl = start_val_cl + 1;
		skillkit_ums_id = res_local_skums.rows[start_val_cl].skillkit_ums_id;
		user_id = res_local_skums.rows[start_val_cl].user_id;
		cycle_id = res_local_skums.rows[start_val_cl].cycle_id;
		skillkit = res_local_skums.rows[start_val_cl].skillkit;
		max_m_score = res_local_skums.rows[start_val_cl].max_m_score;
		max_v_score = res_local_skums.rows[start_val_cl].max_v_score;
		max_f_score = res_local_skums.rows[start_val_cl].max_f_score;
		max_p_score = res_local_skums.rows[start_val_cl].max_p_score;
		max_l_score = res_local_skums.rows[start_val_cl].max_l_score;
		statuss = res_local_skums.rows[start_val_cl].status;
		played_date = res_local_skums.rows[start_val_cl].played_date;
		sync_flag = res_local_skums.rows[start_val_cl].sync_flag;
		current_year_status = res_local_skums.rows[start_val_cl].current_year_status;

		(function (skillkit_ums_id, user_id, cycle_id, skillkit, max_m_score, max_v_score, max_f_score, max_p_score, max_l_score, statuss, played_date, sync_flag, current_year_status) {
			client_live.query("SELECT * FROM public.skillangels_skillkit_usermaxscore WHERE skillkit_ums_id=$1", [skillkit_ums_id], (err_live_skums, res_live_skums) => {

				if (err_live_skums) {
					console.log(err_live_skums);
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA209',
						message: "query error on selecting skillangels_skillkit_usermaxscore on live call_live_skillkit_usermaxscore_insert"
					});

				} else {
					if (res_live_skums.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_skillkit_usermaxscore SET cycle_id=$1, skillkit=$2, max_m_score=$3,max_v_score=$4, max_f_score=$5, max_p_score=$6, max_l_score=$7, status=$8, played_date=$9,  sync_flag=$10, current_year_status=$11 WHERE skillkit_ums_id=$12", [cycle_id, skillkit, max_m_score, max_v_score, max_f_score, max_p_score, max_l_score, statuss, played_date, sync_flag, current_year_status, skillkit_ums_id], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA210',
									message: "Can't update live skillangels_skillkit_usermaxscore"
								});
							}
							else {
								if (start_val_cl == ((res_local_skums.rows.length) - 1)) {
									skillkit_usermaxscore(user_id, temp_skillkit_usermaxscore, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_skillkit_usermaxscore_insert(start_val_cl, temp_skillkit_usermaxscore, res_local_skums, sb_rows, schoolid, response, client_live, done_live, client_local, done_local)
								}
							}
						});
					} else {
						client_live.query("INSERT INTO skillangels_skillkit_usermaxscore (skillkit_ums_id, user_id, cycle_id, skillkit, max_m_score, max_v_score, max_f_score, max_p_score, max_l_score,  status, played_date, sync_flag, current_year_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)", [skillkit_ums_id, user_id, cycle_id, skillkit, max_m_score, max_v_score, max_f_score, max_p_score, max_l_score, statuss, played_date, sync_flag, current_year_status], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA211',
									message: "Can't insert into live skillangels_skillkit_usermaxscore"
								});
							}
							else {
								if (start_val_cl == ((res_local_skums.rows.length) - 1)) {
									skillkit_usermaxscore(user_id, temp_skillkit_usermaxscore, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_skillkit_usermaxscore_insert(start_val_cl, temp_skillkit_usermaxscore, res_local_skums, sb_rows, schoolid, response, client_live, done_live, client_local, done_local)
								}
							}
						});
					}
				}
			});
		})(skillkit_ums_id, user_id, cycle_id, skillkit, max_m_score, max_v_score, max_f_score, max_p_score, max_l_score, statuss, played_date, sync_flag, current_year_status);
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_skillkit_usermaxscore_insert caused exception"
		});
	}
}

const skillkit_usermaxscore = (user_id, temp_skillkit_usermaxscore, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_skillkit_usermaxscore SET sync_flag=1 WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1)", [temp_skillkit_usermaxscore], (err_local, res_local) => {
			if (err_local) {
				console.log(err_local);
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA212',
					message: "Can't update local skillangels_skillkit_usermaxscore "
				});
			}
			else {
				live_skillkit_usermaxscore_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "skillkit_usermaxscore caused exception"
		});
	}
}

var temp_usertotalvalue;
const live_usertotalvalue_sync = (sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		if (incval_sb == sb_rows.rows.length) {
			client_live.query("select * from fn_triggerall(true)", (err_local, res_local) => {
				if (err_local) {
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA301',
						message: "query error at enable trigger"
					});
				} else {
					done_live();
					done_local();
					response.status(200).json({
						status: "success",
						code: 'SA000',
						message: "All tables are inserted succesfully"
					});
				}
			});

		}
		else {
			temp_usertotalvalue = sb_rows.rows[incval_sb].id;
			client_local.query("SELECT * FROM public.skillangels_usertotalvalue WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1 ) AND sync_flag=$2", [temp_usertotalvalue, sflag], (err_local_utv, res_local_utv) => {
				if (err_local_utv) {
					console.log(err_local_utv);
					done_live();
					done_local();
					response.status(200).json({
						status: "Failed",
						code: 'SA213',
						message: "query error on selecting skillangels_usertotalvalue on local live_usertotalvalue_sync"
					});
				} else {
					incval_sb++;
					if (res_local_utv.rows.length > 0) {
						start_val_cl = -1;
						call_live_usertotalvalue_insert(start_val_cl, temp_usertotalvalue, res_local_utv, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
					} else {
						live_usertotalvalue_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live)
					}
				}
			});
		}
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "live_usertotalvalue_sync caused exception"
		});
	}
}

const call_live_usertotalvalue_insert = (start_val_cl, temp_usertotalvalue, res_local_utv, sb_rows, schoolid, response, client_live, done_live, client_local, done_local) => {
	try {
		start_val_cl = start_val_cl + 1;
		utv_id = res_local_utv.rows[start_val_cl].utv_id;
		user_id = res_local_utv.rows[start_val_cl].user_id;
		totalscore = res_local_utv.rows[start_val_cl].totalscore;
		totalstar = res_local_utv.rows[start_val_cl].totalstar;
		totalcrowny = res_local_utv.rows[start_val_cl].totalcrowny;
		date = res_local_utv.rows[start_val_cl].date;
		statuss = res_local_utv.rows[start_val_cl].status;
		sync_flag = res_local_utv.rows[start_val_cl].sync_flag;
		current_year_status = res_local_utv.rows[start_val_cl].current_year_status;

		(function (utv_id, user_id, totalscore, totalstar, totalcrowny, date, statuss, sync_flag, current_year_status) {
			client_live.query("SELECT * FROM public.skillangels_usertotalvalue WHERE utv_id=$1", [utv_id], (err_live_utv, res_live_utv) => {
				if (err_live_utv) {
					console.log(err_live_utv);
					done_live()
					done_local()
					response.status(200).json({
						status: "Failed",
						code: 'SA214',
						message: "query error on selecting skillangels_usertotalvalue on live call_live_usertotalvalue_insert"
					});

				} else {
					if (res_live_utv.rows.length > 0) {
						client_live.query("UPDATE public.skillangels_usertotalvalue SET totalscore=$1, totalstar=$2, totalcrowny=$3, date=$4, status=$5, sync_flag=$6, current_year_status=$7 WHERE utv_id=$8", [totalscore, totalstar, totalcrowny, date, statuss, sync_flag, current_year_status, utv_id], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA215',
									message: "Can't update live skillangels_usertotalvalue"
								});
							}
							else {
								if (start_val_cl == ((res_local_utv.rows.length) - 1)) {
									usertotalvalue(user_id, temp_usertotalvalue, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_usertotalvalue_insert(start_val_cl, temp_usertotalvalue, res_local_utv, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
								}
							}
						});
					} else {
						client_live.query("INSERT INTO skillangels_usertotalvalue (utv_id, user_id, totalscore, totalstar, totalcrowny, date, status, sync_flag, current_year_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)", [utv_id, user_id, totalscore, totalstar, totalcrowny, date, statuss, sync_flag, current_year_status], (err_live, res_live) => {
							if (err_live) {
								console.log(err_live);
								done_live()
								done_local()
								response.status(200).json({
									status: "Failed",
									code: 'SA216',
									message: "Can't insert into live skillangels_usertotalvalue"
								});
							}
							else {
								if (start_val_cl == ((res_local_utv.rows.length) - 1)) {
									usertotalvalue(user_id, temp_usertotalvalue, sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
								}
								else {
									call_live_usertotalvalue_insert(start_val_cl, temp_usertotalvalue, res_local_utv, sb_rows, schoolid, response, client_live, done_live, client_local, done_local);
								}
							}
						});
					}
				}
			});
		})(utv_id, user_id, totalscore, totalstar, totalcrowny, date, statuss, sync_flag, current_year_status);
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "call_live_usertotalvalue_insert caused exception"
		});
	}
}

const usertotalvalue = (user_id, temp_usertotalvalue, sb_rows, schoolid, response, done_live, done_local, client_local, client_live) => {
	try {
		client_local.query("UPDATE public.skillangels_usertotalvalue SET sync_flag=1 WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1)", [temp_usertotalvalue], (err_local, res_local) => {
			if (err_local) {
				console.log(err_local);
				done_live()
				done_local()
				response.status(200).json({
					status: "Failed",
					code: 'SA217',
					message: "Can't update local skillangels_usertotalvalue "
				});
			}
			else {
				live_usertotalvalue_sync(sb_rows, schoolid, response, done_live, done_local, client_local, client_live);
			}
		});
	} catch (e) {
		done_local();
		done_live();
		return response.status(200).json({
			code: "SA120",
			status: "Failed",
			message: "usertotalvalue caused exception"
		});
	}
}

module.exports = {
	live_sync
};