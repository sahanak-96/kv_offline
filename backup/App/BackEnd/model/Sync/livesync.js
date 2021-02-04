const Pool_live = require('pg').Pool
config = require("../dbconfig");
db_live = config.database_live;
const pool_live = new Pool_live(db_live);

const Pool_local = require('pg').Pool
db_local = config.database;
const pool_local = new Pool_local(db_local);

var incval = 0;
var incval_sc = 0;
var incval_scon = 0;
var sclid = 52;
var bra_id = 0;

const local_sync = (request, response) => {
    const { schoolid, branchid } = request.body;
    sclid = schoolid;
    bra_id = branchid;
    try {
        pool_local.connect((err_local, client_local, done_local) => {
            if (err_local) {
                done_local()
                response.status(200).json({
                    status: "Failed",
                    code: 'SA100',
                    message: "Internal Server Error on Local Database"
                });
            }
            else {
                pool_live.connect((err_live, client_live, done_live) => {
                    if (err_live) {
                        done_local();
                        done_live();
                        response.status(200).json({
                            status: "Failed",
                            code: 'SA100',
                            message: "Internal Server Error Live Database"
                        });
                    }
                    else {
                        client_local.query("select * from fn_triggerall(false)", (err_local, res_local) => {
                            if (err_local) {
                                done_live()
                                done_local()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA300',
                                    message: "query error at disable trigger"
                                });
                            } else {
                                //console.log('country_timezone')
                                client_live.query("SELECT * FROM public.country_timezone ORDER BY id ASC ", (err_live_tz, res_live_tz) => {
                                    if (err_live_tz) {
                                        done_local();
                                        done_live();
                                        response.status(200).json({
                                            status: "Failed",
                                            code: 'SA101',
                                            message: "query error at selecting country_timezone in local_sync live"
                                        });
                                    }
                                    else {
                                        incval = 0;

                                        if (res_live_tz.rows.length > 0) {
                                            country_timezone_sync(res_live_tz, response, client_local, done_local, client_live, done_live)
                                        }
                                        else {
                                            done_local();
                                            done_live();
                                            response.status(200).json({
                                                status: "success",
                                                code: 'SA102',
                                                message: "There is no data in live country_timezone"
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
            message: "local_sync caused exception"
        });
    }
}

const country_timezone_sync = (tz_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        id = tz_rows.rows[incval].id;
        countryname = tz_rows.rows[incval].countryname;
        timezone = tz_rows.rows[incval].timezone;
        statuss = tz_rows.rows[incval].status;
        timing = tz_rows.rows[incval].timing;
        sync_flag = tz_rows.rows[incval].sync_flag;

        (function (id, countryname, timezone, statuss, timing, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.country_timezone where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each country_timezone in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == tz_rows.rows.length) {
                            incval = 0
                            assessment_sync(response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            country_timezone_sync(tz_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.country_timezone (id, countryname, timezone, status, timing, sync_flag)  VALUES ($1, $2, $3, $4, $5, $6)", [id, countryname, timezone, statuss, timing, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA103',
                                    message: "Can't insert into local country_timezone"
                                });
                            }
                            else {
                                if (incval == tz_rows.rows.length) {
                                    incval = 0
                                    assessment_sync(response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    country_timezone_sync(tz_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(id, countryname, timezone, statuss, timing, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "country_timezone_sync caused exception"
        });
    }
}

const assessment_sync = (response, client_local, done_local, client_live, done_live) => {
    try {
        client_live.query("SELECT * FROM public.skillangels_assessment ORDER BY assessid ASC ", (err_live_sa, res_live_sa) => {
            if (err_live_sa) {
                console.log(err_live_sa)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA104',
                    message: "query error at selecting skillangels_assessment in assessment_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_sa.rows.length > 0) {
                    call_assessment_sync(res_live_sa, response, client_local, done_local, client_live, done_live)
                }
                else {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "success",
                        code: 'SA105',
                        message: "There is no data in live skillangels_assessment"
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
            message: "assessment_sync caused exception"
        });
    }
}

const call_assessment_sync = (sa_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        assessid = sa_rows.rows[incval].assessid;
        assessname = sa_rows.rows[incval].assessname;
        description = sa_rows.rows[incval].description;
        statuss = sa_rows.rows[incval].status;
        sync_flag = sa_rows.rows[incval].sync_flag;

        (function (assessid, assessname, description, statuss, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_assessment where assessid=$1", [assessid], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_assessment in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == sa_rows.rows.length) {
                            incval = 0
                            assessment_status_sync(response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_assessment_sync(sa_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_assessment (assessid, assessname, description, status, sync_flag)  VALUES ($1, $2, $3, $4, $5)", [assessid, assessname, description, statuss, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA106',
                                    message: "Can't insert into local skillangels_assessment"
                                });
                            }
                            else {
                                if (incval == sa_rows.rows.length) {
                                    incval = 0
                                    assessment_status_sync(response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_assessment_sync(sa_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(assessid, assessname, description, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_assessment_sync caused exception"
        });
    }
}

const assessment_status_sync = (response, client_local, done_local, client_live, done_live) => {
    try {

        client_live.query("SELECT * FROM public.skillangels_assessment_status ORDER BY assess_status_id ASC", (err_live_ass, res_live_ass) => {
            if (err_live_ass) {
                console.log(err_live_ass)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA107',
                    message: "query error at selecting skillangels_assessment_status in assessment_status_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_ass.rows.length > 0) {
                    call_assessment_status_sync(res_live_ass, response, client_local, done_local, client_live, done_live)
                }
                else {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "success",
                        code: 'SA108',
                        message: "There is no data in live skillangels_assessment_status"
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
            message: "assessment_status_sync caused exception"
        });
    }
}

const call_assessment_status_sync = (ass_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        assess_status_id = ass_rows.rows[incval].assess_status_id;
        assessment_status_name = ass_rows.rows[incval].assessment_status_name;
        assessment_status_des = ass_rows.rows[incval].assessment_status_des;
        statuss = ass_rows.rows[incval].status;
        sync_flag = ass_rows.rows[incval].sync_flag;

        (function (assess_status_id, assessment_status_name, assessment_status_des, statuss, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_assessment_status where assess_status_id=$1", [assess_status_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_assessment_status in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == ass_rows.rows.length) {
                            incval = 0
                            scheme_sync(response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_assessment_status_sync(ass_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_assessment_status (assess_status_id, assessment_status_name, assessment_status_des, status, sync_flag)  VALUES ($1, $2, $3, $4, $5)", [assess_status_id, assessment_status_name, assessment_status_des, statuss, sync_flag], (err_1ocal, res_local) => {

                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA109',
                                    message: "Can't insert into local skillangels_assessment_status"
                                });
                            }
                            else {
                                if (incval == ass_rows.rows.length) {
                                    incval = 0
                                    scheme_sync(response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_assessment_status_sync(ass_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(assess_status_id, assessment_status_name, assessment_status_des, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_assessment_status_sync caused exception"
        });
    }
}

const scheme_sync = (response, client_local, done_local, client_live, done_live) => {
    try {

        client_live.query("SELECT * FROM public.skillangels_scheme ORDER BY id ASC ", (err_live_scm, res_live_scm) => {
            if (err_live_scm) {
                console.log(err_live_scm)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA110',
                    message: "query error at selecting skillangels_scheme in scheme_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_scm.rows.length > 0) {
                    call_scheme_sync(res_live_scm, response, client_local, done_local, client_live, done_live)
                }
                else {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "success",
                        code: 'SA111',
                        message: "There is no data in live skillangels_scheme"
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
            message: "scheme_sync caused exception"
        });
    }
}

const call_scheme_sync = (scm_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        id = scm_rows.rows[incval].id;
        scheme = scm_rows.rows[incval].scheme;
        description = scm_rows.rows[incval].description;
        created_date = scm_rows.rows[incval].created_date;
        created_by = scm_rows.rows[incval].created_by;
        modified_date = scm_rows.rows[incval].modified_date;
        modified_by = scm_rows.rows[incval].modified_by;
        statuss = scm_rows.rows[incval].status;
        sync_flag = scm_rows.rows[incval].sync_flag;


        (function (id, scheme, description, created_date, created_by, modified_date, modified_by, statuss, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_scheme where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_scheme in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == scm_rows.rows.length) {
                            incval = 0;
                            skill_sync(response, client_local, done_local, client_live, done_live);
                        }
                        else {
                            call_scheme_sync(scm_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_scheme (id, scheme, description, created_date, created_by, modified_date, modified_by, status, sync_flag)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [id, scheme, description, created_date, created_by, modified_date, modified_by, statuss, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA112',
                                    message: "Can't insert into local skillangels_scheme"
                                });
                            }
                            else {
                                if (incval == scm_rows.rows.length) {
                                    incval = 0;
                                    skill_sync(response, client_local, done_local, client_live, done_live);
                                }
                                else {
                                    call_scheme_sync(scm_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(id, scheme, description, created_date, created_by, modified_date, modified_by, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_scheme_sync caused exception"
        });
    }
}


const skill_sync = (response, client_local, done_local, client_live, done_live) => {
    try {
        client_live.query("SELECT * FROM public.skillangels_skill ORDER BY skill_id ASC ", (err_live_skill, res_live_skill) => {
            if (err_live_skill) {
                console.log(err_live_skill)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA113',
                    message: "query error at selecting skillangels_skill in skill_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_skill.rows.length > 0) {
                    call_skill_sync(res_live_skill, response, client_local, done_local, client_live, done_live)
                }
                else {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "success",
                        code: 'SA114',
                        message: "There is no data in live skillangels_skill"
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
            message: "skill_sync caused exception"
        });
    }
}

const call_skill_sync = (skill_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        skill_id = skill_rows.rows[incval].skill_id;
        skillname = skill_rows.rows[incval].skillname;
        skilldescription = skill_rows.rows[incval].skilldescription;
        statuss = skill_rows.rows[incval].status;
        sync_flag = skill_rows.rows[incval].sync_flag;

        (function (skill_id, skillname, skilldescription, statuss, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_skill where skill_id=$1", [skill_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_skill in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == skill_rows.rows.length) {
                            incval = 0
                            cycle_sync(response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_skill_sync(skill_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {

                        client_local.query("INSERT INTO public.skillangels_skill (skill_id, skillname, skilldescription, status, sync_flag)  VALUES ($1, $2, $3, $4, $5)", [skill_id, skillname, skilldescription, statuss, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA115',
                                    message: "Can't insert into local skillangels_skill"
                                });
                            }
                            else {
                                if (incval == skill_rows.rows.length) {
                                    incval = 0
                                    cycle_sync(response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_skill_sync(skill_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(skill_id, skillname, skilldescription, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_skill_sync caused exception"
        });
    }
}

const cycle_sync = (response, client_local, done_local, client_live, done_live) => {
    try {
        client_live.query("SELECT * FROM public.skillangels_cycle ORDER BY cycle_id ASC ", (err_live_cycle, res_live_cycle) => {
            if (err_live_cycle) {
                console.log(err_live_cycle)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA116',
                    message: "query error at selecting skillangels_cycle in cycle_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_cycle.rows.length > 0) {
                    call_cycle_sync(res_live_cycle, response, client_local, done_local, client_live, done_live)
                }
                else {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "success",
                        code: 'SA117',
                        message: "There is no data in live skillangels_cycle"
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
            message: "cycle_sync caused exception"
        });
    }
}

const call_cycle_sync = (cycle_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        cycle_id = cycle_rows.rows[incval].cycle_id;
        cyclename = cycle_rows.rows[incval].cyclename;
        cycledescription = cycle_rows.rows[incval].cycledescription;
        statuss = cycle_rows.rows[incval].status;
        sync_flag = cycle_rows.rows[incval].sync_flag;

        (function (cycle_id, cyclename, cycledescription, statuss, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_cycle where cycle_id=$1", [cycle_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_cycle in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == cycle_rows.rows.length) {
                            incval = 0
                            event_sync(response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_cycle_sync(cycle_rows, response, client_local, done_local, client_live, done_live)
                        }
                    } else {
                        client_local.query("INSERT INTO public.skillangels_cycle (cycle_id, cyclename, cycledescription, status, sync_flag)  VALUES ($1, $2, $3, $4, $5)", [cycle_id, cyclename, cycledescription, statuss, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA118',
                                    message: "Can't insert into local skillangels_cycle"
                                });
                            }
                            else {
                                if (incval == cycle_rows.rows.length) {
                                    incval = 0
                                    event_sync(response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_cycle_sync(cycle_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(cycle_id, cyclename, cycledescription, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_cycle_sync caused exception"
        });
    }
}

const event_sync = (response, client_local, done_local, client_live, done_live) => {
    try {

        client_live.query("SELECT * FROM public.skillangels_event ORDER BY event_id ASC ", (err_live_event, res_live_event) => {
            if (err_live_event) {
                console.log(err_live_event)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA119',
                    message: "query error at selecting skillangels_event in event_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_event.rows.length > 0) {
                    call_event_sync(res_live_event, response, client_local, done_local, client_live, done_live)
                }
                else {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "success",
                        code: 'SA121',
                        message: "There is no data in live skillangels_event"
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
            message: "event_sync caused exception"
        });
    }
}

const call_event_sync = (event_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        event_id = event_rows.rows[incval].event_id;
        eventname = event_rows.rows[incval].eventname;
        eventdescription = event_rows.rows[incval].eventdescription;
        statuss = event_rows.rows[incval].status;
        sync_flag = event_rows.rows[incval].sync_flag;

        (function (event_id, eventname, eventdescription, statuss, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_event where event_id=$1", [event_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_event in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == event_rows.rows.length) {
                            incval = 0
                            grade_sync(response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_event_sync(event_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_event (event_id, eventname, eventdescription, status, sync_flag)  VALUES ($1, $2, $3, $4, $5)", [event_id, eventname, eventdescription, statuss, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA122',
                                    message: "Can't insert into local skillangels_event"
                                });
                            }
                            else {
                                if (incval == event_rows.rows.length) {
                                    incval = 0
                                    grade_sync(response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_event_sync(event_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(event_id, eventname, eventdescription, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_event_sync caused exception"
        });
    }
}

const grade_sync = (response, client_local, done_local, client_live, done_live) => {
    try {
        client_live.query("SELECT * FROM public.skillangels_grade ORDER BY id ASC ", (err_live_grade, res_live_grade) => {
            if (err_live_grade) {
                console.log(err_live_grade)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA123',
                    message: "query error at selecting skillangels_grade in grade_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_grade.rows.length > 0) {
                    call_grade_sync(res_live_grade, response, client_local, done_local, client_live, done_live)
                }
                else {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "success",
                        code: 'SA124',
                        message: "There is no data in live skillangels_grade"
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
            message: "grade_sync caused exception"
        });
    }
}

const call_grade_sync = (grade_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        id = grade_rows.rows[incval].id;
        gradename = grade_rows.rows[incval].gradename;
        description = grade_rows.rows[incval].description;
        created_date = grade_rows.rows[incval].created_date;
        created_by = grade_rows.rows[incval].created_by;
        modified_date = grade_rows.rows[incval].modified_date;
        modified_by = grade_rows.rows[incval].modified_by;
        statuss = grade_rows.rows[incval].status;
        sync_flag = grade_rows.rows[incval].sync_flag;
        grade = grade_rows.rows[incval].grade;

        (function (id, gradename, description, created_date, created_by, modified_date, modified_by, statuss, sync_flag, grade) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_grade where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_grade in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == grade_rows.rows.length) {
                            incval = 0;
                            gamemaster_sync(response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_grade_sync(grade_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_grade (id, gradename, description, created_date, created_by, modified_date, modified_by, status, sync_flag, grade)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [id, gradename, description, created_date, created_by, modified_date, modified_by, statuss, sync_flag, grade], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA125',
                                    message: "Can't insert into local skillangels_grade"
                                });
                            }
                            else {
                                if (incval == grade_rows.rows.length) {
                                    incval = 0;
                                    gamemaster_sync(response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_grade_sync(grade_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(id, gradename, description, created_date, created_by, modified_date, modified_by, statuss, sync_flag, grade);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_grade_sync caused exception"
        });
    }
}


const gamemaster_sync = (response, client_local, done_local, client_live, done_live) => {
    try {
        client_live.query("SELECT * FROM public.skillangels_gamemaster ORDER BY game_id ASC ", (err_live_gamemaster, res_live_gamemaster) => {
            if (err_live_gamemaster) {
                console.log(err_live_gamemaster)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA126',
                    message: "query error at selecting skillangels_gamemaster in gamemaster_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_gamemaster.rows.length > 0) {
                    call_gamemaster_sync(res_live_gamemaster, response, client_local, done_local, client_live, done_live)
                }
                else {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "success",
                        code: 'SA127',
                        message: "There is no data in live skillangels_gamemaster"
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
            message: "gamemaster_sync caused exception"
        });
    }
}

const call_gamemaster_sync = (gamemaster_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        game_id = gamemaster_rows.rows[incval].game_id;
        skill_id = gamemaster_rows.rows[incval].skill_id;
        gamename = gamemaster_rows.rows[incval].gamename;
        gamedescription = gamemaster_rows.rows[incval].gamedescription;
        statuss = gamemaster_rows.rows[incval].status;
        sync_flag = gamemaster_rows.rows[incval].sync_flag;

        (function (game_id, skill_id, gamename, gamedescription, statuss, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_gamemaster where game_id=$1", [game_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_gamemaster in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == gamemaster_rows.rows.length) {
                            incval = 0
                            gradecyclegame_sync(response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_gamemaster_sync(gamemaster_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_gamemaster (game_id, skill_id, gamename, gamedescription, status, sync_flag)  VALUES ($1, $2, $3, $4, $5, $6)", [game_id, skill_id, gamename, gamedescription, statuss, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA128',
                                    message: "Can't insert into local skillangels_gamemaster"
                                });
                            }
                            else {
                                if (incval == gamemaster_rows.rows.length) {
                                    incval = 0
                                    gradecyclegame_sync(response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_gamemaster_sync(gamemaster_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(game_id, skill_id, gamename, gamedescription, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_gamemaster_sync caused exception"
        });
    }
}

const gradecyclegame_sync = (response, client_local, done_local, client_live, done_live) => {
    try {
        client_live.query("SELECT * FROM public.skillangels_gradecyclegame ORDER BY gcg_id ASC ", (err_live_gradecyclegame, res_live_gradecyclegame) => {
            if (err_live_gradecyclegame) {
                console.log(err_live_gradecyclegame)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA129',
                    message: "query error at selecting skillangels_gradecyclegame in gradecyclegame_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_gradecyclegame.rows.length > 0) {
                    call_gradecyclegame_sync(res_live_gradecyclegame, response, client_local, done_local, client_live, done_live)
                }
                else {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "success",
                        code: 'SA130',
                        message: "There is no data in live skillangels_gradecyclegame"
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
            message: "gradecyclegame_sync caused exception"
        });
    }
}

const call_gradecyclegame_sync = (gcg_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        gcg_id = gcg_rows.rows[incval].gcg_id;
        grade_id = gcg_rows.rows[incval].grade_id;
        cycle_id = gcg_rows.rows[incval].cycle_id;
        assess_status_id = gcg_rows.rows[incval].assess_status_id;
        game_id = gcg_rows.rows[incval].game_id;
        statuss = gcg_rows.rows[incval].status;
        sync_flag = gcg_rows.rows[incval].sync_flag;

        (function (gcg_id, grade_id, cycle_id, assess_status_id, game_id, statuss, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_gradecyclegame where gcg_id=$1", [gcg_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_gradecyclegame in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == gcg_rows.rows.length) {
                            incval = 0
                            skillkit_games_sync(response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_gradecyclegame_sync(gcg_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_gradecyclegame (gcg_id, grade_id, cycle_id, assess_status_id, game_id, status, sync_flag)  VALUES ($1, $2, $3, $4, $5, $6, $7)", [gcg_id, grade_id, cycle_id, assess_status_id, game_id, statuss, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA131',
                                    message: "Can't insert into local skillangels_gradecyclegame"
                                });
                            }
                            else {
                                if (incval == gcg_rows.rows.length) {
                                    incval = 0
                                    skillkit_games_sync(response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_gradecyclegame_sync(gcg_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(gcg_id, grade_id, cycle_id, assess_status_id, game_id, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_gradecyclegame_sync caused exception"
        });
    }
}

const skillkit_games_sync = (response, client_local, done_local, client_live, done_live) => {
    try {
        client_live.query("SELECT * FROM public.skillangels_skillkit_games ORDER BY skg_id ASC ", (err_live_skillkit_games, res_live_skillkit_games) => {
            if (err_live_skillkit_games) {
                console.log(err_live_skillkit_games)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA132',
                    message: "query error at selecting skillangels_skillkit_games in skillkit_games_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_skillkit_games.rows.length > 0) {
                    call_skillkit_games_sync(res_live_skillkit_games, response, client_local, done_local, client_live, done_live)
                }
                else {
                    incval = 0;
                    sbc_game_sync(response, client_local, done_local, client_live, done_live);
                }
            }
        });
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "skillkit_games_sync caused exception"
        });
    }
}

const call_skillkit_games_sync = (skg_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        skg_id = skg_rows.rows[incval].skg_id;
        grade_id = skg_rows.rows[incval].grade_id;
        game_id = skg_rows.rows[incval].game_id;
        statuss = skg_rows.rows[incval].status;
        sync_flag = skg_rows.rows[incval].sync_flag;

        (function (skg_id, grade_id, game_id, statuss, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_skillkit_games where skg_id=$1", [skg_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_skillkit_games in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == skg_rows.rows.length) {
                            incval = 0
                            sbc_game_sync(response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_skillkit_games_sync(skg_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_skillkit_games (skg_id, grade_id, game_id, status, sync_flag)  VALUES ($1, $2, $3, $4, $5)", [skg_id, grade_id, game_id, statuss, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA134',
                                    message: "Can't insert into local skillangels_skillkit_games"
                                });
                            }
                            else {
                                if (incval == skg_rows.rows.length) {
                                    incval = 0
                                    sbc_game_sync(response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_skillkit_games_sync(skg_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(skg_id, grade_id, game_id, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_skillkit_games_sync caused exception"
        });
    }
}

const sbc_game_sync = (response, client_local, done_local, client_live, done_live) => {
    try {
        client_live.query("SELECT * FROM public.skillangels_sbc_game ORDER BY ssg_id ASC ", (err_live_sbc_game, res_live_sbc_game) => {
            if (err_live_sbc_game) {
                console.log(err_live_sbc_game)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA135',
                    message: "query error at selecting skillangels_sbc_game in sbc_game_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_sbc_game.rows.length > 0) {
                    call_sbc_game_sync(res_live_sbc_game, response, client_local, done_local, client_live, done_live)
                }
                else {
                    incval = 0;
                    themeconfig_sync(response, client_local, done_local, client_live, done_live)
                }
            }
        });
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "sbc_game_sync caused exception"
        });
    }
}

const call_sbc_game_sync = (sbcg_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        ssg_id = sbcg_rows.rows[incval].ssg_id;
        grade_id = sbcg_rows.rows[incval].grade_id;
        game_id = sbcg_rows.rows[incval].game_id;
        statuss = sbcg_rows.rows[incval].status;
        sync_flag = sbcg_rows.rows[incval].sync_flag;

        (function (ssg_id, grade_id, game_id, statuss, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_sbc_game where ssg_id=$1", [ssg_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_sbc_game in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == sbcg_rows.rows.length) {
                            incval = 0;
                            themeconfig_sync(response, client_local, done_local, client_live, done_live)

                        }
                        else {
                            call_sbc_game_sync(sbcg_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_sbc_game (ssg_id, grade_id, game_id, status, sync_flag)  VALUES ($1, $2, $3, $4, $5)", [ssg_id, grade_id, game_id, statuss, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA137',
                                    message: "Can't insert into local skillangels_sbc_game"
                                });
                            }
                            else {
                                if (incval == sbcg_rows.rows.length) {
                                    incval = 0;
                                    themeconfig_sync(response, client_local, done_local, client_live, done_live)

                                }
                                else {
                                    call_sbc_game_sync(sbcg_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(ssg_id, grade_id, game_id, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_sbc_game_sync caused exception"
        });
    }
}

const themeconfig_sync = (response, client_local, done_local, client_live, done_live) => {
    try {
        client_live.query("SELECT * FROM public.skillangels_themeconfig ORDER BY theme_id ASC", (err_live_themeconfig, res_live_themeconfig) => {
            if (err_live_themeconfig) {
                console.log(err_live_themeconfig)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA138',
                    message: "query error at selecting skillangels_themeconfig in themeconfig_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_themeconfig.rows.length > 0) {
                    call_themeconfig_sync(res_live_themeconfig, response, client_local, done_local, client_live, done_live)
                }
                else {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "success",
                        code: 'SA139',
                        message: "There is no data in live skillangels_themeconfig"
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
            message: "themeconfig_sync caused exception"
        });
    }
}

const call_themeconfig_sync = (tc_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        theme_id = tc_rows.rows[incval].theme_id;
        theme_name = tc_rows.rows[incval].theme_name;
        description = tc_rows.rows[incval].description;
        theme_score = tc_rows.rows[incval].theme_score;
        statuss = tc_rows.rows[incval].status;
        sync_flag = tc_rows.rows[incval].sync_flag;

        (function (theme_id, theme_name, description, theme_score, statuss, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_themeconfig where theme_id=$1", [theme_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_themeconfig in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == tc_rows.rows.length) {
                            incval = 0
                            musicconfig_sync(response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_themeconfig_sync(tc_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_themeconfig (theme_id, theme_name, description, theme_score, status, sync_flag)  VALUES ($1, $2, $3, $4, $5, $6)", [theme_id, theme_name, description, theme_score, statuss, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA140',
                                    message: "Can't insert into local skillangels_themeconfig"
                                });
                            }
                            else {
                                if (incval == tc_rows.rows.length) {
                                    incval = 0
                                    musicconfig_sync(response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_themeconfig_sync(tc_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(theme_id, theme_name, description, theme_score, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_themeconfig_sync caused exception"
        });
    }
}

const musicconfig_sync = (response, client_local, done_local, client_live, done_live) => {
    try {
        client_live.query("SELECT * FROM public.skillangels_musicconfig ORDER BY music_id ASC", (err_live_musicconfig, res_live_musicconfig) => {
            if (err_live_musicconfig) {
                console.log(err_live_musicconfig)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA141',
                    message: "query error at selecting skillangels_musicconfig in musicconfig_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_musicconfig.rows.length > 0) {
                    call_musicconfig_sync(res_live_musicconfig, response, client_local, done_local, client_live, done_live)
                }
                else {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "success",
                        code: 'SA142',
                        message: "There is no data in live skillangels_musicconfig"
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
            message: "musicconfig_sync caused exception"
        });
    }
}

const call_musicconfig_sync = (mc_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        music_id = mc_rows.rows[incval].music_id;
        music_name = mc_rows.rows[incval].music_name;
        description = mc_rows.rows[incval].description;
        statuss = mc_rows.rows[incval].status;
        sync_flag = mc_rows.rows[incval].sync_flag;

        (function (music_id, music_name, description, statuss, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_musicconfig where music_id=$1", [music_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_musicconfig in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == mc_rows.rows.length) {
                            incval = 0
                            langconfig_sync(response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_musicconfig_sync(mc_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_musicconfig (music_id, music_name, description, status, sync_flag)  VALUES ($1, $2, $3, $4, $5)", [music_id, music_name, description, statuss, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA143',
                                    message: "Can't insert into local skillangels_musicconfig"
                                });
                            }
                            else {
                                if (incval == mc_rows.rows.length) {
                                    incval = 0
                                    langconfig_sync(response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_musicconfig_sync(mc_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(music_id, music_name, description, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_musicconfig_sync caused exception"
        });
    }
}

const langconfig_sync = (response, client_local, done_local, client_live, done_live) => {
    try {
        client_live.query("SELECT * FROM public.skillangels_langconfig ORDER BY lang_id ASC", (err_live_langconfig, res_live_langconfig) => {
            if (err_live_langconfig) {
                console.log(err_live_langconfig)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA144',
                    message: "query error at selecting skillangels_langconfig in langconfig_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_langconfig.rows.length > 0) {
                    call_langconfig_sync(res_live_langconfig, response, client_local, done_local, client_live, done_live)
                }
                else {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "success",
                        code: 'SA145',
                        message: "There is no data in live skillangels_langconfig"
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
            message: "langconfig_sync caused exception"
        });
    }
}

const call_langconfig_sync = (lc_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        lang_id = lc_rows.rows[incval].lang_id;
        lang_name = lc_rows.rows[incval].lang_name;
        description = lc_rows.rows[incval].description;
        original_name = lc_rows.rows[incval].original_name;
        statuss = lc_rows.rows[incval].status;
        sync_flag = lc_rows.rows[incval].sync_flag;

        (function (lang_id, lang_name, description, original_name, statuss, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_langconfig where lang_id=$1", [lang_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_langconfig in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == lc_rows.rows.length) {
                            incval = 0;
                            sitewords_sync(response, client_local, done_local, client_live, done_live);

                        }
                        else {
                            call_langconfig_sync(lc_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_langconfig (lang_id, lang_name, description, original_name, status, sync_flag)  VALUES ($1, $2, $3, $4, $5, $6)", [lang_id, lang_name, description, original_name, statuss, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA146',
                                    message: "Can't insert into local skillangels_langconfig"
                                });
                            }
                            else {
                                if (incval == lc_rows.rows.length) {
                                    incval = 0;
                                    sitewords_sync(response, client_local, done_local, client_live, done_live);

                                }
                                else {
                                    call_langconfig_sync(lc_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(lang_id, lang_name, description, original_name, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_langconfig_sync caused exception"
        });
    }
}


const sitewords_sync = (response, client_local, done_local, client_live, done_live) => {
    try {

        client_live.query("SELECT * FROM public.skillangels_sitewords ORDER BY engid ASC", (err_live_sitewords, res_live_sitewords) => {
            if (err_live_sitewords) {
                console.log(err_live_sitewords)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA147',
                    message: "query error at selecting skillangels_sitewords in sitewords_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_sitewords.rows.length > 0) {
                    call_sitewords_sync(res_live_sitewords, response, client_local, done_local, client_live, done_live)
                }
                else {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "success",
                        code: 'SA148',
                        message: "There is no data in live skillangels_sitewords"
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
            message: "sitewords_sync caused exception"
        });
    }
}

const call_sitewords_sync = (sw_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        engid = sw_rows.rows[incval].engid;
        engword = sw_rows.rows[incval].engword;
        statuss = sw_rows.rows[incval].status;
        sync_flag = sw_rows.rows[incval].sync_flag;

        (function (engid, engword, statuss, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_sitewords where engid=$1", [engid], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_sitewords in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == sw_rows.rows.length) {
                            incval = 0
                            otherlang_words_sync(response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_sitewords_sync(sw_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_sitewords (engid, engword, status, sync_flag)  VALUES ($1, $2, $3, $4)", [engid, engword, statuss, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA149',
                                    message: "Can't insert into local skillangels_sitewords"
                                });
                            }
                            else {
                                if (incval == sw_rows.rows.length) {
                                    incval = 0
                                    otherlang_words_sync(response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_sitewords_sync(sw_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(engid, engword, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_sitewords_sync caused exception"
        });
    }
}

const otherlang_words_sync = (response, client_local, done_local, client_live, done_live) => {
    try {

        client_live.query("SELECT * FROM public.skillangels_otherlang_words ORDER BY ol_id ASC", (err_live_olw, res_live_olw) => {
            if (err_live_olw) {
                console.log(err_live_olw)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA150',
                    message: "query error at selecting skillangels_otherlang_words in otherlang_words_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_olw.rows.length > 0) {
                    call_otherlang_words_sync(res_live_olw, response, client_local, done_local, client_live, done_live)
                }
                else {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "success",
                        code: 'SA151',
                        message: "There is no data in live skillangels_otherlang_words"
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
            message: "otherlang_words_sync caused exception"
        });
    }
}

const call_otherlang_words_sync = (olw_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        ol_id = olw_rows.rows[incval].ol_id;
        lang_id = olw_rows.rows[incval].lang_id;
        wordnum = olw_rows.rows[incval].wordnum;
        ol_words = olw_rows.rows[incval].ol_words;
        statuss = olw_rows.rows[incval].status;
        sync_flag = olw_rows.rows[incval].sync_flag;

        (function (ol_id, lang_id, wordnum, ol_words, statuss, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_otherlang_words where ol_id=$1", [ol_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_otherlang_words in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == olw_rows.rows.length) {
                            incval = 0
                            schoolday_sync(response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_otherlang_words_sync(olw_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_otherlang_words (ol_id, lang_id, wordnum, ol_words, status, sync_flag)  VALUES ($1, $2, $3, $4, $5, $6)", [ol_id, lang_id, wordnum, ol_words, statuss, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA152',
                                    message: "Can't insert into local skillangels_otherlang_words"
                                });
                            }
                            else {
                                if (incval == olw_rows.rows.length) {
                                    incval = 0
                                    schoolday_sync(response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_otherlang_words_sync(olw_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(ol_id, lang_id, wordnum, ol_words, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_otherlang_words_sync caused exception"
        });
    }
}

const schoolday_sync = (response, client_local, done_local, client_live, done_live) => {
    try {

        client_live.query("SELECT * FROM public.skillangels_schoolday ORDER BY id ASC", (err_live_sd, res_live_sd) => {
            if (err_live_sd) {
                console.log(err_live_sd)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA153',
                    message: "query error at selecting skillangels_schoolday in schoolday_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_sd.rows.length > 0) {
                    call_schoolday_sync(res_live_sd, response, client_local, done_local, client_live, done_live)
                }
                else {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "success",
                        code: 'SA154',
                        message: "There is no data in live skillangels_schoolday"
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
            message: "schoolday_sync caused exception"
        });
    }
}

const call_schoolday_sync = (sd_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        id = sd_rows.rows[incval].id;
        day = sd_rows.rows[incval].day;
        created_by = sd_rows.rows[incval].created_by;
        created_date = sd_rows.rows[incval].created_date;
        modified_by = sd_rows.rows[incval].modified_by;
        modified_date = sd_rows.rows[incval].modified_date;
        statuss = sd_rows.rows[incval].status;
        sync_flag = sd_rows.rows[incval].sync_flag;

        (function (id, day, created_by, created_date, modified_by, modified_date, statuss, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_schoolday where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_schoolday in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == sd_rows.rows.length) {
                            incval = 0
                            userrole_sync(response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_schoolday_sync(sd_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_schoolday (id, day, created_by, created_date, modified_by, modified_date, status, sync_flag)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [id, day, created_by, created_date, modified_by, modified_date, statuss, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA155',
                                    message: "Can't insert into local skillangels_schoolday"
                                });
                            }
                            else {
                                if (incval == sd_rows.rows.length) {
                                    incval = 0
                                    userrole_sync(response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_schoolday_sync(sd_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(id, day, created_by, created_date, modified_by, modified_date, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_schoolday_sync caused exception"
        });
    }
}

const userrole_sync = (response, client_local, done_local, client_live, done_live) => {
    try {

        client_live.query("SELECT * FROM public.skillangels_userrole ORDER BY id ASC", (err_live_ur, res_live_ur) => {
            if (err_live_ur) {
                console.log(err_live_ur)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA156',
                    message: "query error at selecting skillangels_userrole in userrole_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_ur.rows.length > 0) {
                    call_userrole_sync(res_live_ur, response, client_local, done_local, client_live, done_live)
                }
                else {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "success",
                        code: 'SA157',
                        message: "There is no data in live skillangels_userrole"
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
            message: "userrole_sync caused exception"
        });
    }
}

const call_userrole_sync = (ur_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        id = ur_rows.rows[incval].id;
        role = ur_rows.rows[incval].role;
        description = ur_rows.rows[incval].description;
        created_by = ur_rows.rows[incval].created_by;
        created_date = ur_rows.rows[incval].created_date;
        modified_by = ur_rows.rows[incval].modified_by;
        modified_date = ur_rows.rows[incval].modified_date;
        statuss = ur_rows.rows[incval].status;
        sync_flag = ur_rows.rows[incval].sync_flag;

        (function (id, role, description, created_by, created_date, modified_by, modified_date, statuss, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_userrole where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_userrole in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == ur_rows.rows.length) {
                            incval = 0;
                            school_sync(response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_userrole_sync(ur_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_userrole (id, role, description, created_by, created_date, modified_by, modified_date, status, sync_flag)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [id, role, description, created_by, created_date, modified_by, modified_date, statuss, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA158',
                                    message: "Can't insert into local skillangels_userrole"
                                });
                            }
                            else {
                                if (incval == ur_rows.rows.length) {
                                    incval = 0;
                                    school_sync(response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_userrole_sync(ur_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(id, role, description, created_by, created_date, modified_by, modified_date, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_userrole_sync caused exception"
        });
    }
}

const school_sync = (response, client_local, done_local, client_live, done_live) => {
    try {
        client_live.query("SELECT * FROM public.skillangels_school WHERE id=$1", [sclid], (err_live_school, res_live_school) => {
            if (err_live_school) {
                console.log(err_live_school)
                done_local();
                done_live();
                response.status(200).json({
                    status: "Failed",
                    code: 'SA159',
                    message: "query error at selecting skillangels_school in school_sync live"
                });
            }
            else {
                incval = 0;
                if (res_live_school.rows.length > 0) {
                    call_school_sync(res_live_school, response, client_local, done_local, client_live, done_live)
                }
                else {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "success",
                        code: 'SA160',
                        message: "There is no data in live skillangels_school"
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
            message: "school_sync caused exception"
        });
    }
}

const call_school_sync = (scl_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        id = scl_rows.rows[incval].id;
        schoolname = scl_rows.rows[incval].schoolname;
        address = scl_rows.rows[incval].address;
        district = scl_rows.rows[incval].district;
        state = scl_rows.rows[incval].state;
        countryid = scl_rows.rows[incval].countryid;
        schoolcode = scl_rows.rows[incval].schoolcode;
        logo_path = scl_rows.rows[incval].logo_path;
        schemeid = scl_rows.rows[incval].schemeid;
        created_date = scl_rows.rows[incval].created_date;
        created_by = scl_rows.rows[incval].created_by;
        modified_date = scl_rows.rows[incval].modified_date;
        modified_by = scl_rows.rows[incval].modified_by;
        statuss = scl_rows.rows[incval].status;
        branch_count = scl_rows.rows[incval].branch_count;
        role = scl_rows.rows[incval].role;
        phoneno = scl_rows.rows[incval].phoneno;
        sync_flag = scl_rows.rows[incval].sync_flag;

        (function (id, schoolname, address, district, state, countryid, schoolcode, logo_path, schemeid, created_date, created_by, modified_date, modified_by, statuss, branch_count, role, phoneno, sync_flag) {
            incval++;
            client_local.query("SELECT * FROM public.skillangels_school where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_school in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == scl_rows.rows.length) {
                            incval = 0
                            local_sclbranch_sync(id, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_school_sync(scl_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_school (id, schoolname, address, district, state, countryid, schoolcode, logo_path, schemeid, created_date, created_by, modified_date, modified_by, status, branch_count, role, phoneno, sync_flag) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)", [id, schoolname, address, district, state, countryid, schoolcode, logo_path, schemeid, created_date, created_by, modified_date, modified_by, statuss, branch_count, role, phoneno, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA161',
                                    message: "Can't insert into local skillangels_school"
                                });
                            }
                            else {
                                if (incval == scl_rows.rows.length) {
                                    incval = 0
                                    local_sclbranch_sync(id, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_school_sync(scl_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(id, schoolname, address, district, state, countryid, schoolcode, logo_path, schemeid, created_date, created_by, modified_date, modified_by, statuss, branch_count, role, phoneno, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_school_sync caused exception"
        });
    }
}

var temp_bran;
const local_sclbranch_sync = (id, response, client_local, done_local, client_live, done_live) => {
    try {
        client_live.query("SELECT * FROM public.skillangels_schoolbranch WHERE schoolid=$1 AND id=$2", [id, bra_id], (err_live_sb, res_live_sb) => {
            if (err_live_sb) {
                console.log(err_live_sb);
                done_local()
                done_live()
                response.status(200).json({
                    status: "Failed",
                    code: 'SA162',
                    message: "query error at selecting skillangels_schoolbranch in local_sclbranch_sync live"
                });
            } else {
                var live_sb_rows = res_live_sb
                if (live_sb_rows.rows.length > 0) {
                    call_sclbranch_sync(live_sb_rows, id, response, client_local, done_local, client_live, done_live)
                } else {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "success",
                        code: 'SA163',
                        message: "There is no data in live skillangels_schoolbranch"
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
            message: "local_sclbranch_sync caused exception"
        });
    }
}

const call_sclbranch_sync = (live_sb_rows, id, response, client_local, done_local, client_live, done_live) => {
    try {
        bid = live_sb_rows.rows[incval].id;
        branchname = live_sb_rows.rows[incval].branchname;
        address = live_sb_rows.rows[incval].address;
        district = live_sb_rows.rows[incval].district;
        state = live_sb_rows.rows[incval].state;
        countryid = live_sb_rows.rows[incval].countryid;
        schoolcode = live_sb_rows.rows[incval].schoolcode;
        logo_path = live_sb_rows.rows[incval].logo_path;
        branchcode = live_sb_rows.rows[incval].branchcode;
        schoolid = live_sb_rows.rows[incval].schoolid;
        created_date = live_sb_rows.rows[incval].created_date;
        created_by = live_sb_rows.rows[incval].created_by;
        modified_date = live_sb_rows.rows[incval].modified_date;
        modified_by = live_sb_rows.rows[incval].modified_by;
        statuss = live_sb_rows.rows[incval].status;
        mobileno = live_sb_rows.rows[incval].mobileno;
        timetablepattern = live_sb_rows.rows[incval].timetablepattern;
        assessment_status = live_sb_rows.rows[incval].assessment_status;
        sync_flag = live_sb_rows.rows[incval].sync_flag;
        lang_flag = live_sb_rows.rows[incval].lang_flag;
        total_time = live_sb_rows.rows[incval].total_time;
        assessment_check = live_sb_rows.rows[incval].assessment_check;

        (function (bid, branchname, address, district, state, countryid, schoolcode, logo_path, branchcode, schoolid, created_date, created_by, modified_date, modified_by, statuss, mobileno, timetablepattern, assessment_status, sync_flag, lang_flag, total_time, assessment_check) {

            incval++;
            client_local.query("SELECT * FROM public.skillangels_schoolbranch where id=$1", [bid], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_schoolbranch in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (incval == live_sb_rows.rows.length) {
                            incval = 0;
                            schoolconfig_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_sclbranch_sync(live_sb_rows, id, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_schoolbranch (id, branchname, address, district, state, countryid, schoolcode, logo_path, branchcode, schoolid, created_date,created_by, modified_date, modified_by, status, mobileno, timetablepattern, assessment_status, sync_flag, lang_flag, total_time, assessment_check) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)", [bid, branchname, address, district, state, countryid, schoolcode, logo_path, branchcode, schoolid, created_date, created_by, modified_date, modified_by, statuss, mobileno, timetablepattern, assessment_status, sync_flag, lang_flag, total_time, assessment_check], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA164',
                                    message: "Can't insert into local skillangels_schoolbranch "
                                });
                            }
                            else {
                                if (incval == live_sb_rows.rows.length) {
                                    incval = 0;
                                    schoolconfig_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_sclbranch_sync(live_sb_rows, id, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(bid, branchname, address, district, state, countryid, schoolcode, logo_path, branchcode, schoolid, created_date, created_by, modified_date, modified_by, statuss, mobileno, timetablepattern, assessment_status, sync_flag, lang_flag, total_time, assessment_check);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_sclbranch_sync caused exception"
        });
    }
}


const schoolconfig_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_scon == live_sb_rows.rows.length) {
            incval_sc = 0;
            current_server_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_scon].id;
            client_live.query("SELECT * FROM public.schoolconfig  WHERE schoolid=$1", [temp_bran], (err_live_sc, res_live_sc) => {
                if (err_live_sc) {
                    console.log(err_live_sc)
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA165',
                        message: "query error at selecting schoolconfig in schoolconfig_sync live"
                    });
                }
                else {
                    incval_scon++;
                    if (res_live_sc.rows.length > 0) {
                        start_val_sc = -1;
                        call_schoolconfig_sync(start_val_sc, res_live_sc, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        //     done_local();
                        // done_live();
                        // response.status(200).json({
                        //     status: "success",
                        //     code: 'SA230',
                        //     message: "There is no data in live schoolconfig"
                        // });
                        schoolconfig_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "schoolconfig_sync caused exception"
        });
    }
}

const call_schoolconfig_sync = (start_val_sc, sc_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_sc = start_val_sc + 1;
        id = sc_rows.rows[start_val_sc].id;
        schoolid = sc_rows.rows[start_val_sc].schoolid;
        configname = sc_rows.rows[start_val_sc].configname;
        configvalue = sc_rows.rows[start_val_sc].configvalue;
        description = sc_rows.rows[start_val_sc].description;
        statuss = sc_rows.rows[start_val_sc].status;
        sync_flag = sc_rows.rows[start_val_sc].sync_flag;

        (function (id, schoolid, configname, configvalue, description, statuss, sync_flag) {
            client_local.query("SELECT * FROM public.schoolconfig where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each schoolconfig in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_sc == ((sc_rows.rows.length) - 1)) {
                            schoolconfig_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_schoolconfig_sync(start_val_sc, sc_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.schoolconfig (id, schoolid, configname, configvalue, description, status, sync_flag) VALUES ($1, $2, $3, $4, $5, $6, $7)", [id, schoolid, configname, configvalue, description, statuss, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA167',
                                    message: "Can't insert into local schoolconfig"
                                });
                            }
                            else {
                                if (start_val_sc == ((sc_rows.rows.length) - 1)) {
                                    schoolconfig_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_schoolconfig_sync(start_val_sc, sc_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(id, schoolid, configname, configvalue, description, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_schoolconfig_sync caused exception"
        });
    }
}

const current_server_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            admin_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_current_server WHERE branch_id=$1", [temp_bran], (err_live_cs, res_live_cs) => {
                if (err_live_cs) {
                    console.log(err_live_cs)
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA168',
                        message: "query error at selecting skillangels_current_server in current_server_sync live"
                    });
                }
                else {
                    incval_sc++;
                    if (res_live_cs.rows.length > 0) {
                        start_val_cs = -1;
                        call_current_server_sync(start_val_cs, res_live_cs, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        done_local();
                        done_live();
                        response.status(200).json({
                            status: "success",
                            code: 'SA231',
                            message: "There is no data in live skillangels_current_server"
                        });
                        // current_server_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "current_server_sync caused exception"
        });
    }
}

const call_current_server_sync = (start_val_cs, cs_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_cs = start_val_cs + 1;
        id = cs_rows.rows[start_val_cs].id;
        branch_id = cs_rows.rows[start_val_cs].branch_id;
        servername = cs_rows.rows[start_val_cs].servername;
        statuss = cs_rows.rows[start_val_cs].status;

        (function (id, branch_id, servername, statuss) {
            client_local.query("SELECT * FROM public.skillangels_current_server where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_current_server in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_cs == ((cs_rows.rows.length) - 1)) {
                            current_server_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_current_server_sync(start_val_cs, cs_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_current_server (id, branch_id, servername, status) VALUES ($1,$2,$3,$4)", [id, branch_id, servername, statuss], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA170',
                                    message: "Can't insert into local skillangels_current_server"
                                });
                            }
                            else {
                                if (start_val_cs == ((cs_rows.rows.length) - 1)) {
                                    current_server_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_current_server_sync(start_val_cs, cs_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "call_current_server_sync caused exception"
        });
    }
}

const admin_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            schoolacademic_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_admin WHERE branch_id=$1 AND school_id=$2", [temp_bran, sclid], (err_live_admin, res_live_admin) => {
                if (err_live_admin) {
                    console.log(err_live_admin)
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA171',
                        message: "query error at selecting skillangels_admin in admin_sync live"
                    });
                }
                else {
                    incval_sc++;
                    if (res_live_admin.rows.length > 0) {
                        start_val_admin = -1;
                        call_admin_sync(start_val_admin, res_live_admin, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        // done_local();
                        // done_live();
                        // response.status(200).json({
                        //     status: "success",
                        //     code: 'SA232',
                        //     message: "There is no data in live skillangels_admin"
                        // });
                        admin_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "admin_sync caused exception"
        });
    }
}

const call_admin_sync = (start_val_admin, admin_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_admin = start_val_admin + 1;
        id = admin_rows.rows[start_val_admin].id;
        username = admin_rows.rows[start_val_admin].username;
        emailid = admin_rows.rows[start_val_admin].emailid;
        mobileno = admin_rows.rows[start_val_admin].mobileno;
        passwordd = admin_rows.rows[start_val_admin].password;
        roleid = admin_rows.rows[start_val_admin].roleid;
        created_date = admin_rows.rows[start_val_admin].created_date;
        created_by = admin_rows.rows[start_val_admin].created_by;
        modified_date = admin_rows.rows[start_val_admin].modified_date;
        modified_by = admin_rows.rows[start_val_admin].modified_by;
        statuss = admin_rows.rows[start_val_admin].status;
        branch_id = admin_rows.rows[start_val_admin].branch_id;
        school_id = admin_rows.rows[start_val_admin].school_id;
        sync_flag = admin_rows.rows[start_val_admin].sync_flag;

        (function (id, username, emailid, mobileno, passwordd, roleid, created_date, created_by, modified_date, modified_by, statuss, branch_id, school_id, sync_flag) {
            client_local.query("SELECT * FROM public.skillangels_admin where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_admin in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_admin == ((admin_rows.rows.length) - 1)) {
                            admin_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_admin_sync(start_val_admin, admin_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_admin (id, username, emailid, mobileno, password, roleid, created_date, created_by, modified_date, modified_by, status, branch_id, school_id, sync_flag) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)", [id, username, emailid, mobileno, passwordd, roleid, created_date, created_by, modified_date, modified_by, statuss, branch_id, school_id, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA173',
                                    message: "Can't insert into local skillangels_admin"
                                });
                            }
                            else {
                                if (start_val_admin == ((admin_rows.rows.length) - 1)) {
                                    admin_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_admin_sync(start_val_admin, admin_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(id, username, emailid, mobileno, passwordd, roleid, created_date, created_by, modified_date, modified_by, statuss, branch_id, school_id, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_admin_sync caused exception"
        });
    }
}

const schoolacademic_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            branch_installation_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_schoolacademic WHERE schoolid=$1", [temp_bran], (err_live_sclacdmc, res_live_sclacdmc) => {
                if (err_live_sclacdmc) {
                    console.log(err_live_sclacdmc)
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA174',
                        message: "query error at selecting skillangels_schoolacademic in schoolacademic_sync live"
                    });
                }
                else {
                    incval_sc++;
                    if (res_live_sclacdmc.rows.length > 0) {
                        start_val_sclacdmc = - 1;
                        call_schoolacademic_sync(start_val_sclacdmc, res_live_sclacdmc, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        // done_local();
                        // done_live();
                        // response.status(200).json({
                        //     status: "success",
                        //     code: 'SA233',
                        //     message: "There is no data in live skillangels_schoolacademic"
                        // });
                        schoolacademic_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "schoolacademic_sync caused exception"
        });
    }
}

const call_schoolacademic_sync = (start_val_sclacdmc, sclacdmd_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_sclacdmc = start_val_sclacdmc + 1;
        id = sclacdmd_rows.rows[start_val_sclacdmc].id;
        schoolid = sclacdmd_rows.rows[start_val_sclacdmc].schoolid;
        startdate = sclacdmd_rows.rows[start_val_sclacdmc].startdate;
        enddate = sclacdmd_rows.rows[start_val_sclacdmc].enddate;
        created_date = sclacdmd_rows.rows[start_val_sclacdmc].created_date;
        created_by = sclacdmd_rows.rows[start_val_sclacdmc].created_by;
        modified_date = sclacdmd_rows.rows[start_val_sclacdmc].modified_date;
        modified_by = sclacdmd_rows.rows[start_val_sclacdmc].modified_by;
        statuss = sclacdmd_rows.rows[start_val_sclacdmc].status;
        sync_flag = sclacdmd_rows.rows[start_val_sclacdmc].sync_flag;

        (function (id, schoolid, startdate, enddate, created_date, created_by, modified_date, modified_by, statuss, sync_flag) {
            client_local.query("SELECT * FROM public.skillangels_schoolacademic where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_schoolacademic in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_sclacdmc == ((sclacdmd_rows.rows.length) - 1)) {
                            schoolacademic_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_schoolacademic_sync(start_val_sclacdmc, sclacdmd_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_schoolacademic (id, schoolid, startdate, enddate, created_date, created_by, modified_date, modified_by, status, sync_flag) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [id, schoolid, startdate, enddate, created_date, created_by, modified_date, modified_by, statuss, sync_flag], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA176',
                                    message: "Can't insert into local skillangels_schoolacademic"
                                });
                            }
                            else {
                                if (start_val_sclacdmc == ((sclacdmd_rows.rows.length) - 1)) {
                                    schoolacademic_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_schoolacademic_sync(start_val_sclacdmc, sclacdmd_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(id, schoolid, startdate, enddate, created_date, created_by, modified_date, modified_by, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_schoolacademic_sync caused exception"
        });
    }
}

const branch_installation_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            school_config_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_branch_installation WHERE branch_id=$1", [temp_bran], (err_live_bi, res_live_bi) => {
                if (err_live_bi) {
                    console.log(err_live_bi)
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA177',
                        message: "query error at selecting skillangels_branch_installation in branch_installation_sync live"
                    });
                }
                else {
                    incval_sc++;
                    if (res_live_bi.rows.length > 0) {
                        start_val_bi = - 1;
                        call_branch_installation_sync(start_val_bi, res_live_bi, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        done_local();
                        done_live();
                        response.status(200).json({
                            status: "success",
                            code: 'SA234',
                            message: "There is no data in live skillangels_branch_installation"
                        });
                        // branch_installation_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "branch_installation_sync caused exception"
        });
    }
}

const call_branch_installation_sync = (start_val_bi, bi_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_bi = start_val_bi + 1;
        id = bi_rows.rows[start_val_bi].id;
        branch_id = bi_rows.rows[start_val_bi].branch_id;
        ipaddress = bi_rows.rows[start_val_bi].ipaddress;
        statuss = bi_rows.rows[start_val_bi].status;

        (function (id, branch_id, ipaddress, statuss) {
            client_local.query("SELECT * FROM public.skillangels_branch_installation where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_branch_installation in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_bi == ((bi_rows.rows.length) - 1)) {
                            branch_installation_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_branch_installation_sync(start_val_bi, bi_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_branch_installation (id, branch_id, ipaddress, status) VALUES ($1, $2, $3, $4)", [id, branch_id, ipaddress, statuss], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA179',
                                    message: "Can't insert into local skillangels_branch_installation"
                                });
                            }
                            else {
                                if (start_val_bi == ((bi_rows.rows.length) - 1)) {
                                    branch_installation_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_branch_installation_sync(start_val_bi, bi_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(id, branch_id, ipaddress, statuss);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_branch_installation_sync caused exception"
        });
    }
}

const school_config_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            eod_mail_log_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.school_config  WHERE branch_id=$1", [temp_bran], (err_live_sconfig, res_live_sconfig) => {
                if (err_live_sconfig) {
                    console.log(err_live_sconfig)
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA180',
                        message: "query error at selecting school_config in school_config_sync live"
                    });
                }
                else {
                    incval_sc++;
                    if (res_live_sconfig.rows.length > 0) {
                        start_val_scl_con = - 1;
                        call_school_config_sync(start_val_scl_con, res_live_sconfig, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        // done_local();
                        // done_live();
                        // response.status(200).json({
                        //     status: "success",
                        //     code: 'SA235',
                        //     message: "There is no data in live school_config"
                        // });
                        school_config_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "school_config_sync caused exception"
        });
    }
}

const call_school_config_sync = (start_val_scl_con, sconfig_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_scl_con = start_val_scl_con + 1;
        id = sconfig_rows.rows[start_val_scl_con].id;
        branch_id = sconfig_rows.rows[start_val_scl_con].branch_id;
        isemailneed = sconfig_rows.rows[start_val_scl_con].isemailneed;
        maildays = sconfig_rows.rows[start_val_scl_con].maildays;
        emailto = sconfig_rows.rows[start_val_scl_con].to;
        emailcc = sconfig_rows.rows[start_val_scl_con].emailcc;

        (function (id, branch_id, isemailneed, maildays, emailto, emailcc) {
            client_local.query("SELECT * FROM public.school_config where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each school_config in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_scl_con == ((sconfig_rows.rows.length) - 1)) {
                            school_config_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_school_config_sync(start_val_scl_con, sconfig_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query('INSERT INTO public.school_config (id, branch_id, isemailneed, maildays, "to", emailcc) VALUES ($1, $2, $3, $4, $5, $6)', [id, branch_id, isemailneed, maildays, emailto, emailcc], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA182',
                                    message: "Can't insert into local school_config"
                                });
                            }
                            else {
                                if (start_val_scl_con == ((sconfig_rows.rows.length) - 1)) {
                                    school_config_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_school_config_sync(start_val_scl_con, sconfig_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(id, branch_id, isemailneed, maildays, emailto, emailcc);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_school_config_sync caused exception"
        });
    }
}

const eod_mail_log_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            school_holidays_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_eod_mail_log  WHERE branch_id=$1", [temp_bran], (err_live_eml, res_live_eml) => {
                if (err_live_eml) {
                    console.log(err_live_eml)
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA183',
                        message: "query error at selecting skillangels_eod_mail_log in eod_mail_log_sync live"
                    });
                }
                else {
                    incval_sc++;
                    if (res_live_eml.rows.length > 0) {
                        start_val_eml = -1;
                        call_eod_mail_log_sync(start_val_eml, res_live_eml, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        // done_local();
                        // done_live();
                        // response.status(200).json({
                        //     status: "success",
                        //     code: 'SA236',
                        //     message: "There is no data in live skillangels_eod_mail_log"
                        // });
                        eod_mail_log_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "eod_mail_log_sync caused exception"
        });
    }
}

const call_eod_mail_log_sync = (start_val_eml, eml_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_eml = start_val_eml + 1;
        id = eml_rows.rows[start_val_eml].id;
        branch_id = eml_rows.rows[start_val_eml].branch_id;
        sent_on = eml_rows.rows[start_val_eml].sent_on;
        statuss = eml_rows.rows[start_val_eml].status;

        (function (id, branch_id, sent_on, statuss) {
            client_local.query("SELECT * FROM public.skillangels_eod_mail_log where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_eod_mail_log in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_eml == ((eml_rows.rows.length) - 1)) {
                            eod_mail_log_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_eod_mail_log_sync(start_val_eml, eml_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO public.skillangels_eod_mail_log (id, branch_id, sent_on, status) VALUES ($1, $2, $3, $4)", [id, branch_id, sent_on, statuss], (err_1ocal, res_local) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA185',
                                    message: "Can't insert into local skillangels_eod_mail_log"
                                });
                            }
                            else {
                                if (start_val_eml == ((eml_rows.rows.length) - 1)) {
                                    eod_mail_log_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_eod_mail_log_sync(start_val_eml, eml_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(id, branch_id, sent_on, statuss);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_eod_mail_log_sync caused exception"
        });
    }
}

const school_holidays_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_school_period_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_school_holidays WHERE  branch=$1", [temp_bran], (err_live_hd, res_live_hd) => {
                if (err_live_hd) {
                    console.log(err_live_hd);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA186',
                        message: "query error at selecting skillangels_school_holidays in school_holidays_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_hd_rows = res_live_hd
                    if (live_hd_rows.rows.length > 0) {
                        start_val_hd = -1;
                        call_school_holidays_sync(start_val_hd, live_hd_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        // done_local();
                        // done_live();
                        // response.status(200).json({
                        //     status: "success",
                        //     code: 'SA237',
                        //     message: "There is no data in live skillangels_school_holidays"
                        // });
                        school_holidays_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "school_holidays_sync caused exception"
        });
    }
}

const call_school_holidays_sync = (start_val_hd, live_hd_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_hd = start_val_hd + 1;
        id = live_hd_rows.rows[start_val_hd].id;
        branch = live_hd_rows.rows[start_val_hd].branch;
        holiday_date = live_hd_rows.rows[start_val_hd].holiday_date;
        holiday_description = live_hd_rows.rows[start_val_hd].holiday_description;
        modified_by = live_hd_rows.rows[start_val_hd].modified_by;
        created_by = live_hd_rows.rows[start_val_hd].created_by;
        modified_date = live_hd_rows.rows[start_val_hd].modified_date;
        created_date = live_hd_rows.rows[start_val_hd].created_date;
        statuss = live_hd_rows.rows[start_val_hd].status;
        sync_flag = live_hd_rows.rows[start_val_hd].sync_flag;

        (function (id, branch, holiday_date, holiday_description, modified_by, created_by, modified_date, created_date, statuss, sync_flag) {
            client_local.query("SELECT * FROM public.skillangels_school_holidays where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_school_holidays in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_hd == ((live_hd_rows.rows.length) - 1)) {
                            school_holidays_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_school_holidays_sync(start_val_hd, live_hd_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_school_holidays (id, branch, holiday_date, holiday_description, modified_by, created_by, modified_date, created_date, status, sync_flag) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", [id, branch, holiday_date, holiday_description, modified_by, created_by, modified_date, created_date, statuss, sync_flag], (err_local, res_local) => {
                            if (err_local) {
                                console.log(err_local);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA187',
                                    message: "Can't insert into local skillangels_school_holidays "
                                });
                            }
                            else {
                                if (start_val_hd == ((live_hd_rows.rows.length) - 1)) {
                                    school_holidays_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_school_holidays_sync(start_val_hd, live_hd_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(id, branch, holiday_date, holiday_description, modified_by, created_by, modified_date, created_date, statuss, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_school_holidays_sync caused exception"
        });
    }
}


const local_school_period_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_school_grade_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_schoolperiod WHERE branchid=$1", [temp_bran], (err_live_sp, res_live_sp) => {

                if (err_live_sp) {
                    console.log(err_live_sp);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA188',
                        message: "query error at selecting skillangels_schoolperiod in local_school_period_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_sp_rows = res_live_sp
                    if (live_sp_rows.rows.length > 0) {
                        start_val_sp = -1;
                        call_school_period_sync(start_val_sp, live_sp_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        // done_local();
                        // done_live();
                        // response.status(200).json({
                        //     status: "success",
                        //     code: 'SA238',
                        //     message: "There is no data in live skillangels_schoolperiod"
                        // });
                        local_school_period_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "call_local_school_period_sync_insert caused exception"
        });
    }
}

const call_school_period_sync = (start_val_sp, live_sp_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_sp = start_val_sp + 1
        id = live_sp_rows.rows[start_val_sp].id;
        description = live_sp_rows.rows[start_val_sp].description;
        branchid = live_sp_rows.rows[start_val_sp].branchid;
        period = live_sp_rows.rows[start_val_sp].period;
        created_date = live_sp_rows.rows[start_val_sp].created_date;
        created_by = live_sp_rows.rows[start_val_sp].created_by;
        modified_date = live_sp_rows.rows[start_val_sp].modified_date;
        modified_by = live_sp_rows.rows[start_val_sp].modified_by;
        statuss = live_sp_rows.rows[start_val_sp].status;
        end_time = live_sp_rows.rows[start_val_sp].end_time;
        start_time = live_sp_rows.rows[start_val_sp].start_time;
        sync_flag = live_sp_rows.rows[start_val_sp].sync_flag;

        (function (id, description, branchid, period, created_date, created_by, modified_date, modified_by, statuss, end_time, start_time, sync_flag) {
            client_local.query("SELECT * FROM public.skillangels_schoolperiod where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_schoolperiod in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_sp == ((live_sp_rows.rows.length - 1))) {
                            local_school_period_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_school_period_sync(start_val_sp, live_sp_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_schoolperiod (id, description, branchid, period, created_date, created_by, modified_date, modified_by, status, end_time, start_time, sync_flag) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)", [id, description, branchid, period, created_date, created_by, modified_date, modified_by, statuss, end_time, start_time, sync_flag], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA189',
                                    message: "Can't insert into local skillangels_schoolperiod "
                                });
                            }
                            else {
                                if (start_val_sp == ((live_sp_rows.rows.length - 1))) {
                                    local_school_period_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_school_period_sync(start_val_sp, live_sp_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(id, description, branchid, period, created_date, created_by, modified_date, modified_by, statuss, end_time, start_time, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_school_period_sync caused exception"
        });
    }
}


const local_school_grade_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_grade_section_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_schoolgrade WHERE branch_id=$1", [temp_bran], (err_live_sg, res_live_sg) => {

                if (err_live_sg) {
                    console.log(err_live_sg);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA190',
                        message: "query error at selecting skillangels_schoolgrade in local_school_grade_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_sg_rows = res_live_sg
                    if (live_sg_rows.rows.length > 0) {
                        start_val_sg = -1;
                        call_schoolgrade_sync(start_val_sg, live_sg_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        done_local();
                        done_live();
                        response.status(200).json({
                            status: "success",
                            code: 'SA239',
                            message: "There is no data in live skillangels_schoolgrade"
                        });
                        // local_school_grade_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_school_grade_sync caused exception"
        });
    }
}

const call_schoolgrade_sync = (start_val_sg, live_sg_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_sg = start_val_sg + 1
        id = live_sg_rows.rows[start_val_sg].id;
        branch_id = live_sg_rows.rows[start_val_sg].branch_id;
        gradeid = live_sg_rows.rows[start_val_sg].gradeid;
        created_date = live_sg_rows.rows[start_val_sg].created_date;
        created_by = live_sg_rows.rows[start_val_sg].created_by;
        modified_date = live_sg_rows.rows[start_val_sg].modified_date;
        modified_by = live_sg_rows.rows[start_val_sg].modified_by;
        statuss = live_sg_rows.rows[start_val_sg].status;
        sync_flag = live_sg_rows.rows[start_val_sg].sync_flag;
        medianval = live_sg_rows.rows[start_val_sg].medianval;
        mem_medianval = live_sg_rows.rows[start_val_sg].mem_medianval;
        vp_medianval = live_sg_rows.rows[start_val_sg].vp_medianval;
        fa_medianval = live_sg_rows.rows[start_val_sg].fa_medianval;
        ps_medianval = live_sg_rows.rows[start_val_sg].ps_medianval;
        lin_medianval = live_sg_rows.rows[start_val_sg].lin_medianval;

        (function (id, branch_id, gradeid, created_date, created_by, modified_date, modified_by, statuss, sync_flag, medianval, mem_medianval, vp_medianval, fa_medianval, ps_medianval, lin_medianval) {
            client_local.query("SELECT * FROM public.skillangels_schoolgrade where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_schoolgrade in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_sg == ((live_sg_rows.rows.length - 1))) {
                            local_school_grade_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_schoolgrade_sync(start_val_sg, live_sg_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_schoolgrade (id, branch_id, gradeid, created_date, created_by, modified_date, modified_by, status, sync_flag, medianval, mem_medianval, vp_medianval, fa_medianval, ps_medianval, lin_medianval) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)", [id, branch_id, gradeid, created_date, created_by, modified_date, modified_by, statuss, sync_flag, medianval, mem_medianval, vp_medianval, fa_medianval, ps_medianval, lin_medianval], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA191',
                                    message: "Can't insert into local skillangels_schoolgrade "
                                });
                            }
                            else {
                                if (start_val_sg == ((live_sg_rows.rows.length - 1))) {
                                    local_school_grade_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_schoolgrade_sync(start_val_sg, live_sg_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(id, branch_id, gradeid, created_date, created_by, modified_date, modified_by, statuss, sync_flag, medianval, mem_medianval, vp_medianval, fa_medianval, ps_medianval, lin_medianval);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_schoolgrade_sync caused exception"
        });
    }
}

const local_grade_section_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_timetable_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_schoolgradesections WHERE branchid=$1", [temp_bran], (err_1ocal_sgs, res_local_sgs) => {

                if (err_1ocal_sgs) {
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA192',
                        message: "query error at selecting skillangels_schoolgradesections in local_grade_section_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_sgs_rows = res_local_sgs
                    if (live_sgs_rows.rows.length > 0) {
                        start_val_sgs = -1;
                        call_grade_section_sync(start_val_sgs, live_sgs_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        done_local();
                        done_live();
                        response.status(200).json({
                            status: "success",
                            code: 'SA240',
                            message: "There is no data in live skillangels_schoolgradesections"
                        });
                        // local_grade_section_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_grade_section_sync caused exception"
        });
    }
}

const call_grade_section_sync = (start_val_sgs, live_sgs_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_sgs = start_val_sgs + 1
        id = live_sgs_rows.rows[start_val_sgs].id;
        branchid = live_sgs_rows.rows[start_val_sgs].branchid;
        gradeid = live_sgs_rows.rows[start_val_sgs].gradeid;
        sectionname = live_sgs_rows.rows[start_val_sgs].sectionname;
        created_date = live_sgs_rows.rows[start_val_sgs].created_date;
        created_by = live_sgs_rows.rows[start_val_sgs].created_by;
        modified_date = live_sgs_rows.rows[start_val_sgs].modified_date;
        modified_by = live_sgs_rows.rows[start_val_sgs].modified_by;
        statuss = live_sgs_rows.rows[start_val_sgs].status;
        sync_flag = live_sgs_rows.rows[start_val_sgs].sync_flag;
        daydata = live_sgs_rows.rows[start_val_sgs].daydata;
        startdate = live_sgs_rows.rows[start_val_sgs].startdate;

        (function (id, branchid, gradeid, sectionname, created_date, created_by, modified_date, modified_by, statuss, sync_flag, daydata, startdate) {
            client_local.query("SELECT * FROM public.skillangels_schoolgradesections where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_schoolgradesections in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_sgs == ((live_sgs_rows.rows.length - 1))) {
                            local_grade_section_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_grade_section_sync(start_val_sgs, live_sgs_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_schoolgradesections (id, branchid, gradeid, sectionname, created_date, created_by, modified_date, modified_by, status, sync_flag,daydata, startdate) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)", [id, branchid, gradeid, sectionname, created_date, created_by, modified_date, modified_by, statuss, sync_flag, daydata, startdate], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA193',
                                    message: "Can't insert into local skillangels_schoolgradesections "
                                });
                            }
                            else {
                                if (start_val_sgs == ((live_sgs_rows.rows.length - 1))) {
                                    local_grade_section_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_grade_section_sync(start_val_sgs, live_sgs_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(id, branchid, gradeid, sectionname, created_date, created_by, modified_date, modified_by, statuss, sync_flag, daydata, startdate);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_grade_section_sync caused exception"
        });
    }
}


const local_timetable_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_branch_grade_cycle_game_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_schooltimetable WHERE branchid=$1", [temp_bran], (err_1ocal_tt, res_local_tt) => {

                if (err_1ocal_tt) {
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA194',
                        message: "query error at selecting skillangels_schooltimetable in local_timetable_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_tt_rows = res_local_tt
                    if (live_tt_rows.rows.length > 0) {
                        start_val_tt = -1;
                        call_timetable_sync(start_val_tt, live_tt_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        // done_local();
                        // done_live();
                        // response.status(200).json({
                        //     status: "success",
                        //     code: 'SA241',
                        //     message: "There is no data in live skillangels_schooltimetable"
                        // });
                        local_timetable_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_timetable_sync caused exception"
        });
    }
}

const call_timetable_sync = (start_val_tt, live_tt_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_tt = start_val_tt + 1
        id = live_tt_rows.rows[start_val_tt].id;
        created_date = live_tt_rows.rows[start_val_tt].created_date;
        created_by = live_tt_rows.rows[start_val_tt].created_by;
        modified_date = live_tt_rows.rows[start_val_tt].modified_date;
        modified_by = live_tt_rows.rows[start_val_tt].modified_by;
        statuss = live_tt_rows.rows[start_val_tt].status;
        sectionid = live_tt_rows.rows[start_val_tt].sectionid;
        periodid = live_tt_rows.rows[start_val_tt].periodid;
        dayid = live_tt_rows.rows[start_val_tt].dayid;
        branchid = live_tt_rows.rows[start_val_tt].branchid;
        sync_flag = live_tt_rows.rows[start_val_tt].sync_flag;

        (function (id, created_date, created_by, modified_date, modified_by, statuss, sectionid, periodid, dayid, branchid, sync_flag) {
            client_local.query("SELECT * FROM public.skillangels_schooltimetable where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_schooltimetable in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_tt == ((live_tt_rows.rows.length - 1))) {
                            local_timetable_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_timetable_sync(start_val_tt, live_tt_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_schooltimetable (id, created_date, created_by, modified_date, modified_by, status, sectionid, periodid, dayid, branchid, sync_flag) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [id, created_date, created_by, modified_date, modified_by, statuss, sectionid, periodid, dayid, branchid, sync_flag], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA195',
                                    message: "Can't insert into local skillangels_schooltimetable "
                                });
                            }
                            else {
                                if (start_val_tt == ((live_tt_rows.rows.length - 1))) {
                                    local_timetable_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_timetable_sync(start_val_tt, live_tt_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(id, created_date, created_by, modified_date, modified_by, statuss, sectionid, periodid, dayid, branchid, sync_flag);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_timetable_sync caused exception"
        });
    }
}

const local_branch_grade_cycle_game_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_school_users_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_branchgradecyclegame WHERE branch_id=$1", [temp_bran], (err_live_bgcg, res_live_bgcg) => {

                if (err_live_bgcg) {
                    console.log(err_live_bgcg);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA196',
                        message: "query error at selecting skillangels_branchgradecyclegame in local_branch_grade_cycle_game_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_bgcg_rows = res_live_bgcg
                    if (live_bgcg_rows.rows.length > 0) {
                        start_val_bgcg = -1;
                        call_branch_grade_cycle_game_sync(start_val_bgcg, live_bgcg_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        done_local();
                        done_live();
                        response.status(200).json({
                            status: "success",
                            code: 'SA242',
                            message: "There is no data in live skillangels_branchgradecyclegame"
                        });
                        // local_branch_grade_cycle_game_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_branch_grade_cycle_game_sync caused exception"
        });
    }
}

const call_branch_grade_cycle_game_sync = (start_val_bgcg, live_bgcg_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_bgcg = start_val_bgcg + 1
        bgcg_id = live_bgcg_rows.rows[start_val_bgcg].bgcg_id;
        branch_id = live_bgcg_rows.rows[start_val_bgcg].branch_id;
        gcg_id = live_bgcg_rows.rows[start_val_bgcg].gcg_id;
        statuss = live_bgcg_rows.rows[start_val_bgcg].status;
        sync_flag = live_bgcg_rows.rows[start_val_bgcg].sync_flag;

        (function (bgcg_id, branch_id, gcg_id, statuss, sync_flag) {
            client_local.query("SELECT * FROM public.skillangels_branchgradecyclegame where bgcg_id=$1", [bgcg_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_branchgradecyclegame in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_bgcg == ((live_bgcg_rows.rows.length - 1))) {
                            local_branch_grade_cycle_game_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_branch_grade_cycle_game_sync(start_val_bgcg, live_bgcg_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_branchgradecyclegame (bgcg_id, branch_id, gcg_id, status, sync_flag) VALUES ($1,$2,$3,$4,$5)", [bgcg_id, branch_id, gcg_id, statuss, sync_flag], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA197',
                                    message: "Can't insert into local skillangels_branchgradecyclegame "
                                });
                            }
                            else {
                                if (start_val_bgcg == ((live_bgcg_rows.rows.length - 1))) {
                                    local_branch_grade_cycle_game_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_branch_grade_cycle_game_sync(start_val_bgcg, live_bgcg_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "call_branch_grade_cycle_game_sync caused exception"
        });
    }
}


const local_school_users_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_loginlog_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_users WHERE branch_id=$1", [temp_bran], (err_live_usr, res_live_usr) => {

                if (err_live_usr) {
                    console.log(err_live_usr);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA198',
                        message: "query error at selecting skillangels_users in local_school_users_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_usr_rows = res_live_usr
                    if (live_usr_rows.rows.length > 0) {
                        start_val_usr = -1;
                        call_school_users_sync(start_val_usr, live_usr_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        done_local();
                        done_live();
                        response.status(200).json({
                            status: "success",
                            code: 'SA243',
                            message: "There is no data in live skillangels_users"
                        });
                        // local_school_users_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_school_users_sync caused exception"
        });
    }
}

const call_school_users_sync = (start_val_usr, live_usr_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_usr = start_val_usr + 1
        id = live_usr_rows.rows[start_val_usr].id;
        user_name = live_usr_rows.rows[start_val_usr].user_name;
        passwordd = live_usr_rows.rows[start_val_usr].password;
        dob = live_usr_rows.rows[start_val_usr].dob;
        contact_no = live_usr_rows.rows[start_val_usr].contact_no;
        modified_date = live_usr_rows.rows[start_val_usr].modified_date;
        modified_by = live_usr_rows.rows[start_val_usr].modified_by;
        created_by = live_usr_rows.rows[start_val_usr].created_by;
        created_date = live_usr_rows.rows[start_val_usr].created_date;
        branch_id = live_usr_rows.rows[start_val_usr].branch_id;
        email = live_usr_rows.rows[start_val_usr].email;
        address = live_usr_rows.rows[start_val_usr].address;
        district = live_usr_rows.rows[start_val_usr].district;
        state = live_usr_rows.rows[start_val_usr].state;
        section_id = live_usr_rows.rows[start_val_usr].section_id;
        assessment_status = live_usr_rows.rows[start_val_usr].assessment_status;
        selected_lang = live_usr_rows.rows[start_val_usr].selected_lang;
        selected_theme = live_usr_rows.rows[start_val_usr].selected_theme;
        selected_music = live_usr_rows.rows[start_val_usr].selected_music;
        statuss = live_usr_rows.rows[start_val_usr].status;
        sync_flag = live_usr_rows.rows[start_val_usr].sync_flag;
        isskillkit = live_usr_rows.rows[start_val_usr].isskillkit;
        played_time = live_usr_rows.rows[start_val_usr].played_time;
        current_year_status = live_usr_rows.rows[start_val_usr].current_year_status;
        dob_password = live_usr_rows.rows[start_val_usr].dob_password;
        name = live_usr_rows.rows[start_val_usr].name;
        current_session_id = live_usr_rows.rows[start_val_usr].current_session_id;
        rule_flag = live_usr_rows.rows[start_val_usr].rule_flag;
        profile_img_name = live_usr_rows.rows[start_val_usr].profile_img_name;

        (function (id, user_name, passwordd, dob, contact_no, modified_date, modified_by, created_by, created_date, branch_id, email, address, district, state, section_id, assessment_status, selected_lang, selected_theme, selected_music, statuss, sync_flag, isskillkit, played_time, current_year_status, dob_password, name, current_session_id, rule_flag, profile_img_name) {
            client_local.query("SELECT * FROM public.skillangels_users where id=$1", [id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_users in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_usr == ((live_usr_rows.rows.length - 1))) {
                            local_school_users_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_school_users_sync(start_val_usr, live_usr_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_users (id, user_name,password,dob,contact_no, modified_date, modified_by, created_by, created_date, branch_id, email, address, district, state, section_id, assessment_status, selected_lang, selected_theme, selected_music, status, sync_flag, isskillkit, played_time, current_year_status, dob_password, name, current_session_id, rule_flag, profile_img_name) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29)", [id, user_name, passwordd, dob, contact_no, modified_date, modified_by, created_by, created_date, branch_id, email, address, district, state, section_id, assessment_status, selected_lang, selected_theme, selected_music, statuss, sync_flag, isskillkit, played_time, current_year_status, dob_password, name, current_session_id, rule_flag, profile_img_name], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA199',
                                    message: "Can't insert into local skillangels_users "
                                });
                            }
                            else {
                                if (start_val_usr == ((live_usr_rows.rows.length - 1))) {
                                    local_school_users_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_school_users_sync(start_val_usr, live_usr_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(id, user_name, passwordd, dob, contact_no, modified_date, modified_by, created_by, created_date, branch_id, email, address, district, state, section_id, assessment_status, selected_lang, selected_theme, selected_music, statuss, sync_flag, isskillkit, played_time, current_year_status, dob_password, name, current_session_id, rule_flag, profile_img_name);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_school_users_sync caused exception"
        });
    }
}


const local_loginlog_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_crownylog_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_loginlog WHERE uid in (SELECT id FROM public.skillangels_users WHERE branch_id=$1) ", [temp_bran], (err_live_ll, res_live_ll) => {

                if (err_live_ll) {
                    console.log(err_live_ll);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA200',
                        message: "query error at selecting skillangels_loginlog in local_loginlog_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_ll_rows = res_live_ll
                    if (live_ll_rows.rows.length > 0) {
                        start_val_ll = -1;
                        call_loginlog_sync(start_val_ll, live_ll_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        local_loginlog_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_loginlog_sync caused exception"
        });
    }
}

const call_loginlog_sync = (start_val_ll, live_ll_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_ll = start_val_ll + 1
        llid = live_ll_rows.rows[start_val_ll].llid;
        uid = live_ll_rows.rows[start_val_ll].uid;
        logindate = live_ll_rows.rows[start_val_ll].logindate;
        logintime = live_ll_rows.rows[start_val_ll].logintime;
        statuss = live_ll_rows.rows[start_val_ll].status;
        sync_flag = live_ll_rows.rows[start_val_ll].sync_flag;
        current_year_status = live_ll_rows.rows[start_val_ll].current_year_status;

        (function (llid, uid, logindate, logintime, statuss, sync_flag, current_year_status) {
            client_local.query("SELECT * FROM public.skillangels_loginlog where llid=$1", [llid], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_loginlog in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_ll == ((live_ll_rows.rows.length - 1))) {
                            local_loginlog_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_loginlog_sync(start_val_ll, live_ll_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_loginlog (llid, uid, logindate, logintime, status, sync_flag, current_year_status ) VALUES ($1,$2,$3,$4,$5,$6,$7)", [llid, uid, logindate, logintime, statuss, sync_flag, current_year_status], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA201',
                                    message: "Can't insert into local skillangels_loginlog "
                                });
                            }
                            else {
                                if (start_val_ll == ((live_ll_rows.rows.length - 1))) {
                                    local_loginlog_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_loginlog_sync(start_val_ll, live_ll_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "call_loginlog_sync caused exception"
        });
    }
}


const local_crownylog_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_feedback_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_crownylog WHERE uid in (SELECT id FROM public.skillangels_users WHERE branch_id=$1)", [temp_bran], (err_live_cl, res_live_cl) => {

                if (err_live_cl) {
                    console.log(err_live_cl);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA202',
                        message: "query error at selecting skillangels_crownylog in local_crownylog_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_cl_rows = res_live_cl
                    if (live_cl_rows.rows.length > 0) {
                        start_val_cl = -1;
                        call_crownylog_sync(start_val_cl, live_cl_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        local_crownylog_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_crownylog_sync caused exception"
        });
    }
}

const call_crownylog_sync = (start_val_cl, live_cl_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_cl = start_val_cl + 1
        culogid = live_cl_rows.rows[start_val_cl].culogid;
        uid = live_cl_rows.rows[start_val_cl].uid;
        crowny = live_cl_rows.rows[start_val_cl].crowny;
        addeddate = live_cl_rows.rows[start_val_cl].addeddate;
        statuss = live_cl_rows.rows[start_val_cl].status;
        sync_flag = live_cl_rows.rows[start_val_cl].sync_flag;
        reason = live_cl_rows.rows[start_val_cl].reason;
        addedtime = live_cl_rows.rows[start_val_cl].addedtime;
        current_year_status = live_cl_rows.rows[start_val_cl].current_year_status;

        (function (culogid, uid, crowny, addeddate, statuss, sync_flag, reason, addedtime, current_year_status) {
            client_local.query("SELECT * FROM public.skillangels_crownylog where culogid=$1", [culogid], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_crownylog in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_cl == ((live_cl_rows.rows.length - 1))) {
                            local_crownylog_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_crownylog_sync(start_val_cl, live_cl_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_crownylog (culogid, uid, crowny, addeddate, status, sync_flag, reason, addedtime, current_year_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)", [culogid, uid, crowny, addeddate, statuss, sync_flag, reason, addedtime, current_year_status], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA203',
                                    message: "Can't insert into local skillangels_crownylog "
                                });
                            }
                            else {
                                if (start_val_cl == ((live_cl_rows.rows.length - 1))) {
                                    local_crownylog_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_crownylog_sync(start_val_cl, live_cl_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(culogid, uid, crowny, addeddate, statuss, sync_flag, reason, addedtime, current_year_status);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_crownylog_sync caused exception"
        });
    }
}

const local_feedback_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_games_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_feedback WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1)", [temp_bran], (err_live_fb, res_live_fb) => {

                if (err_live_fb) {
                    console.log(err_live_fb);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA204',
                        message: "query error at selecting skillangels_feedback in local_feedback_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_fb_rows = res_live_fb
                    if (live_fb_rows.rows.length > 0) {
                        start_val_fb = -1;
                        call_feedback_sync(start_val_fb, live_fb_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        local_feedback_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_feedback_sync caused exception"
        });
    }
}

const call_feedback_sync = (start_val_fb, live_fb_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_fb = start_val_fb + 1
        sf_id = live_fb_rows.rows[start_val_fb].sf_id;
        user_id = live_fb_rows.rows[start_val_fb].user_id;
        assessment_experience = live_fb_rows.rows[start_val_fb].assessment_experience;
        how_to_play_instruction = live_fb_rows.rows[start_val_fb].how_to_play_instruction;
        about_program = live_fb_rows.rows[start_val_fb].about_program;
        solve_puzzles = live_fb_rows.rows[start_val_fb].solve_puzzles;
        share_assessment_experience = live_fb_rows.rows[start_val_fb].share_assessment_experience;
        description = live_fb_rows.rows[start_val_fb].description;
        statuss = live_fb_rows.rows[start_val_fb].status;
        sync_flag = live_fb_rows.rows[start_val_fb].sync_flag;
        current_year_status = live_fb_rows.rows[start_val_fb].current_year_status;

        (function (sf_id, user_id, assessment_experience, how_to_play_instruction, about_program, solve_puzzles, share_assessment_experience, description, statuss, sync_flag, current_year_status) {
            client_local.query("SELECT * FROM public.skillangels_feedback where sf_id=$1", [sf_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_feedback in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_fb == ((live_fb_rows.rows.length - 1))) {
                            local_feedback_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_feedback_sync(start_val_fb, live_fb_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_feedback (sf_id, user_id, assessment_experience, how_to_play_instruction, about_program, solve_puzzles, share_assessment_experience, description, status, sync_flag, current_year_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [sf_id, user_id, assessment_experience, how_to_play_instruction, about_program, solve_puzzles, share_assessment_experience, description, statuss, sync_flag, current_year_status], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA205',
                                    message: "Can't insert into local skillangels_feedback "
                                });
                            }
                            else {
                                if (start_val_fb == ((live_fb_rows.rows.length - 1))) {
                                    local_feedback_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_feedback_sync(start_val_fb, live_fb_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "call_feedback_sync caused exception"
        });
    }
}


const local_games_entry_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_games_cylce_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_games_entry WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1)", [temp_bran], (err_live_ge, res_live_ge) => {

                if (err_live_ge) {
                    console.log(err_live_ge);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA206',
                        message: "query error at selecting skillangels_games_entry in local_games_entry_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_ge_rows = res_live_ge
                    if (live_ge_rows.rows.length > 0) {
                        start_val_ge = -1;
                        call_games_entry_sync(start_val_ge, live_ge_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        local_games_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_games_entry_sync caused exception"
        });
    }
}

const call_games_entry_sync = (start_val_ge, live_ge_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_ge = start_val_ge + 1
        games_entry_id = live_ge_rows.rows[start_val_ge].games_entry_id;
        user_id = live_ge_rows.rows[start_val_ge].user_id;
        mem_game_id = live_ge_rows.rows[start_val_ge].mem_game_id;
        vp_game_id = live_ge_rows.rows[start_val_ge].vp_game_id;
        fa_game_id = live_ge_rows.rows[start_val_ge].fa_game_id;
        ps_game_id = live_ge_rows.rows[start_val_ge].ps_game_id;
        lin_game_id = live_ge_rows.rows[start_val_ge].lin_game_id;
        event_id = live_ge_rows.rows[start_val_ge].event_id;
        current_year_status = live_ge_rows.rows[start_val_ge].current_year_status;
        date = live_ge_rows.rows[start_val_ge].date;
        statuss = live_ge_rows.rows[start_val_ge].status;
        sync_flag = live_ge_rows.rows[start_val_ge].sync_flag;
        ass_status_id = live_ge_rows.rows[start_val_ge].ass_status_id;
        mem_name = live_ge_rows.rows[start_val_ge].mem_name;
        vp_name = live_ge_rows.rows[start_val_ge].vp_name;
        fa_name = live_ge_rows.rows[start_val_ge].fa_name;
        ps_name = live_ge_rows.rows[start_val_ge].ps_name;
        lin_name = live_ge_rows.rows[start_val_ge].lin_name;

        (function (games_entry_id, user_id, mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, event_id, current_year_status, date, statuss, sync_flag, ass_status_id, mem_name, vp_name, fa_name, ps_name, lin_name) {
            client_local.query("SELECT * FROM public.skillangels_games_entry where games_entry_id=$1", [games_entry_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_games_entry in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_ge == ((live_ge_rows.rows.length - 1))) {
                            local_games_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_games_entry_sync(start_val_ge, live_ge_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_games_entry (games_entry_id, user_id, mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, event_id, current_year_status, date, status, sync_flag, ass_status_id, mem_name, vp_name, fa_name, ps_name, lin_name) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)", [games_entry_id, user_id, mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, event_id, current_year_status, date, statuss, sync_flag, ass_status_id, mem_name, vp_name, fa_name, ps_name, lin_name], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA207',
                                    message: "Can't insert into local skillangels_games_entry "
                                });
                            }
                            else {
                                if (start_val_ge == ((live_ge_rows.rows.length - 1))) {
                                    local_games_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_games_entry_sync(start_val_ge, live_ge_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "call_games_entry_sync caused exception"
        });
    }
}


const local_games_cylce_entry_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_skillkitgames_cylce_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_games_cylce_entry WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1)", [temp_bran], (err_live_gce, res_live_gce) => {

                if (err_live_gce) {
                    console.log(err_live_gce);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA208',
                        message: "query error at selecting skillangels_games_entry in local_games_cylce_entry_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_gce_rows = res_live_gce
                    if (live_gce_rows.rows.length > 0) {
                        start_val_gce = -1;
                        call_games_cylce_entry_sync(start_val_gce, live_gce_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        local_games_cylce_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_games_cylce_entry_sync caused exception"
        });
    }
}

const call_games_cylce_entry_sync = (start_val_gce, live_gce_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_gce = start_val_gce + 1
        games_cycle_entry_id = live_gce_rows.rows[start_val_gce].games_cycle_entry_id;
        user_id = live_gce_rows.rows[start_val_gce].user_id;
        mem_game_id = live_gce_rows.rows[start_val_gce].mem_game_id;
        vp_game_id = live_gce_rows.rows[start_val_gce].vp_game_id;
        fa_game_id = live_gce_rows.rows[start_val_gce].fa_game_id;
        ps_game_id = live_gce_rows.rows[start_val_gce].ps_game_id;
        lin_game_id = live_gce_rows.rows[start_val_gce].lin_game_id;
        mem_name = live_gce_rows.rows[start_val_gce].mem_name;
        vp_name = live_gce_rows.rows[start_val_gce].vp_name;
        fa_name = live_gce_rows.rows[start_val_gce].fa_name;
        ps_name = live_gce_rows.rows[start_val_gce].ps_name;
        lin_name = live_gce_rows.rows[start_val_gce].lin_name;
        ass_status_id = live_gce_rows.rows[start_val_gce].ass_status_id;
        event_id = live_gce_rows.rows[start_val_gce].event_id;
        current_year_status = live_gce_rows.rows[start_val_gce].current_year_status;
        actual_start_date = live_gce_rows.rows[start_val_gce].actual_start_date;
        actual_end_date = live_gce_rows.rows[start_val_gce].actual_end_date;
        played_start_date = live_gce_rows.rows[start_val_gce].played_start_date;
        played_end_date = live_gce_rows.rows[start_val_gce].played_end_date;
        statuss = live_gce_rows.rows[start_val_gce].status;
        sync_flag = live_gce_rows.rows[start_val_gce].sync_flag;

        (function (games_cycle_entry_id, user_id, mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, mem_name, vp_name, fa_name, ps_name, lin_name, ass_status_id, event_id, current_year_status, actual_start_date, actual_end_date, played_start_date, played_end_date, statuss, sync_flag) {
            client_local.query("SELECT * FROM public.skillangels_games_cylce_entry where games_cycle_entry_id=$1", [games_cycle_entry_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_games_cylce_entry in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_gce == ((live_gce_rows.rows.length - 1))) {
                            local_games_cylce_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_games_cylce_entry_sync(start_val_gce, live_gce_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_games_cylce_entry (games_cycle_entry_id, user_id,  mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id,mem_name, vp_name, fa_name, ps_name, lin_name, ass_status_id, event_id, current_year_status, actual_start_date, actual_end_date, played_start_date, played_end_date, status, sync_flag) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)", [games_cycle_entry_id, user_id, mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, mem_name, vp_name, fa_name, ps_name, lin_name, ass_status_id, event_id, current_year_status, actual_start_date, actual_end_date, played_start_date, played_end_date, statuss, sync_flag], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA209',
                                    message: "Can't insert into local skillangels_games_cylce_entry "
                                });
                            }
                            else {
                                if (start_val_gce == ((live_gce_rows.rows.length - 1))) {
                                    local_games_cylce_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_games_cylce_entry_sync(start_val_gce, live_gce_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "call_games_cylce_entry_sync caused exception"
        });
    }
}

const local_skillkitgames_cylce_entry_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_gameques_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_skillkitgames_cylce_entry WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1)", [temp_bran], (err_live_skgce, res_live_skgce) => {

                if (err_live_skgce) {
                    console.log(err_live_skgce);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA210',
                        message: "query error at selecting skillangels_skillkitgames_cylce_entry in local_skillkitgames_cylce_entry_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_skgce_rows = res_live_skgce
                    if (live_skgce_rows.rows.length > 0) {
                        start_val_skgce = -1;
                        call_skillkitgames_cylce_entry_sync(start_val_skgce, live_skgce_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        local_skillkitgames_cylce_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_skillkitgames_cylce_entry_sync caused exception"
        });
    }
}

const call_skillkitgames_cylce_entry_sync = (start_val_skgce, live_skgce_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_skgce = start_val_skgce + 1
        skillkitgames_cycle_entry_id = live_skgce_rows.rows[start_val_skgce].skillkitgames_cycle_entry_id;
        user_id = live_skgce_rows.rows[start_val_skgce].user_id;
        mem_game_id = live_skgce_rows.rows[start_val_skgce].mem_game_id;
        vp_game_id = live_skgce_rows.rows[start_val_skgce].vp_game_id;
        fa_game_id = live_skgce_rows.rows[start_val_skgce].fa_game_id;
        ps_game_id = live_skgce_rows.rows[start_val_skgce].ps_game_id;
        lin_game_id = live_skgce_rows.rows[start_val_skgce].lin_game_id;
        mem_name = live_skgce_rows.rows[start_val_skgce].mem_name;
        vp_name = live_skgce_rows.rows[start_val_skgce].vp_name;
        fa_name = live_skgce_rows.rows[start_val_skgce].fa_name;
        ps_name = live_skgce_rows.rows[start_val_skgce].ps_name;
        lin_name = live_skgce_rows.rows[start_val_skgce].lin_name;
        ass_status_id = live_skgce_rows.rows[start_val_skgce].ass_status_id;
        event_id = live_skgce_rows.rows[start_val_skgce].event_id;
        current_year_status = live_skgce_rows.rows[start_val_skgce].current_year_status;
        actual_start_date = live_skgce_rows.rows[start_val_skgce].actual_start_date;
        actual_end_date = live_skgce_rows.rows[start_val_skgce].actual_end_date;
        played_start_date = live_skgce_rows.rows[start_val_skgce].played_start_date;
        played_end_date = live_skgce_rows.rows[start_val_skgce].played_end_date;
        statuss = live_skgce_rows.rows[start_val_skgce].status;
        sync_flag = live_skgce_rows.rows[start_val_skgce].sync_flag;
        skillcnt = live_skgce_rows.rows[start_val_skgce].skillcnt;

        (function (skillkitgames_cycle_entry_id, user_id, mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, mem_name, vp_name, fa_name, ps_name, lin_name, ass_status_id, event_id, current_year_status, actual_start_date, actual_end_date, played_start_date, played_end_date, statuss, sync_flag, skillcnt) {
            client_local.query("SELECT * FROM public.skillangels_skillkitgames_cylce_entry where skillkitgames_cycle_entry_id=$1", [skillkitgames_cycle_entry_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_skillkitgames_cylce_entry in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_skgce == ((live_skgce_rows.rows.length - 1))) {
                            local_skillkitgames_cylce_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_skillkitgames_cylce_entry_sync(start_val_skgce, live_skgce_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_skillkitgames_cylce_entry (skillkitgames_cycle_entry_id, user_id,  mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id,mem_name, vp_name, fa_name, ps_name, lin_name, ass_status_id, event_id, current_year_status, actual_start_date, actual_end_date, played_start_date, played_end_date, status, sync_flag, skillcnt) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)", [skillkitgames_cycle_entry_id, user_id, mem_game_id, vp_game_id, fa_game_id, ps_game_id, lin_game_id, mem_name, vp_name, fa_name, ps_name, lin_name, ass_status_id, event_id, current_year_status, actual_start_date, actual_end_date, played_start_date, played_end_date, statuss, sync_flag, skillcnt], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA211',
                                    message: "Can't insert into local skillangels_skillkitgames_cylce_entry "
                                });
                            }
                            else {
                                if (start_val_skgce == ((live_skgce_rows.rows.length - 1))) {
                                    local_skillkitgames_cylce_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_skillkitgames_cylce_entry_sync(start_val_skgce, live_skgce_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "call_skillkitgames_cylce_entry_sync caused exception"
        });
    }
}


const local_gameques_entry_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_training_gameques_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_gameques_entry WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1 ) ", [temp_bran], (err_live_gqe, res_live_gqe) => {

                if (err_live_gqe) {
                    console.log(err_live_gqe);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA212',
                        message: "query error at selecting skillangels_gameques_entry in local_gameques_entry_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_gqe_rows = res_live_gqe
                    if (live_gqe_rows.rows.length > 0) {
                        start_val_gqe = -1;
                        call_gameques_entry_sync(start_val_gqe, live_gqe_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        local_gameques_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_gameques_entry_sync caused exception"
        });
    }
}

const call_gameques_entry_sync = (start_val_gqe, live_gqe_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_gqe = start_val_gqe + 1
        gameques_id = live_gqe_rows.rows[start_val_gqe].gameques_id;
        user_id = live_gqe_rows.rows[start_val_gqe].user_id;
        game_id = live_gqe_rows.rows[start_val_gqe].game_id;
        event_id = live_gqe_rows.rows[start_val_gqe].event_id;
        quesno = live_gqe_rows.rows[start_val_gqe].quesno;
        score = live_gqe_rows.rows[start_val_gqe].score;
        ansvalidation = live_gqe_rows.rows[start_val_gqe].ansvalidation;
        responsetime = live_gqe_rows.rows[start_val_gqe].responsetime;
        answeredtime = live_gqe_rows.rows[start_val_gqe].answeredtime;
        ass_status_id = live_gqe_rows.rows[start_val_gqe].ass_status_id;
        finish_status = live_gqe_rows.rows[start_val_gqe].finish_status;
        statuss = live_gqe_rows.rows[start_val_gqe].status;
        sync_flag = live_gqe_rows.rows[start_val_gqe].sync_flag;
        current_year_status = live_gqe_rows.rows[start_val_gqe].current_year_status;

        (function (gameques_id, user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, answeredtime, ass_status_id, finish_status, statuss, sync_flag, current_year_status) {
            client_local.query("SELECT * FROM public.skillangels_gameques_entry where gameques_id=$1", [gameques_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_gameques_entry in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_gqe == ((live_gqe_rows.rows.length - 1))) {
                            local_gameques_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_gameques_entry_sync(start_val_gqe, live_gqe_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_gameques_entry (gameques_id, user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, answeredtime, ass_status_id, finish_status,status, sync_flag, current_year_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)", [gameques_id, user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, answeredtime, ass_status_id, finish_status, statuss, sync_flag, current_year_status], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA213',
                                    message: "Can't insert into local skillangels_gameques_entry "
                                });
                            }
                            else {
                                if (start_val_gqe == ((live_gqe_rows.rows.length - 1))) {
                                    local_gameques_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_gameques_entry_sync(start_val_gqe, live_gqe_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "call_gameques_entry_sync caused exception"
        });
    }
}


const local_training_gameques_entry_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_userscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_training_gameques_entry WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1 ) ", [temp_bran], (err_live_tgqe, res_live_tgqe) => {

                if (err_live_tgqe) {
                    console.log(err_live_tgqe);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA214',
                        message: "query error at selecting skillangels_training_gameques_entry in local_training_gameques_entry_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_tgqe_rows = res_live_tgqe
                    if (live_tgqe_rows.rows.length > 0) {
                        start_val_tgqe = -1;
                        call_training_gameques_entry_sync(start_val_tgqe, live_tgqe_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        local_training_gameques_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_training_gameques_entry_sync caused exception"
        });
    }
}

const call_training_gameques_entry_sync = (start_val_tgqe, live_tgqe_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_tgqe = start_val_tgqe + 1
        gameques_train_id = live_tgqe_rows.rows[start_val_tgqe].gameques_train_id;
        user_id = live_tgqe_rows.rows[start_val_tgqe].user_id;
        game_id = live_tgqe_rows.rows[start_val_tgqe].game_id;
        event_id = live_tgqe_rows.rows[start_val_tgqe].event_id;
        quesno = live_tgqe_rows.rows[start_val_tgqe].quesno;
        score = live_tgqe_rows.rows[start_val_tgqe].score;
        ansvalidation = live_tgqe_rows.rows[start_val_tgqe].ansvalidation;
        responsetime = live_tgqe_rows.rows[start_val_tgqe].responsetime;
        answeredtime = live_tgqe_rows.rows[start_val_tgqe].answeredtime;
        ass_status_id = live_tgqe_rows.rows[start_val_tgqe].ass_status_id;
        finish_status = live_tgqe_rows.rows[start_val_tgqe].finish_status;
        statuss = live_tgqe_rows.rows[start_val_tgqe].status;
        sync_flag = live_tgqe_rows.rows[start_val_tgqe].sync_flag;
        current_year_status = live_tgqe_rows.rows[start_val_tgqe].current_year_status;

        (function (gameques_train_id, user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, answeredtime, ass_status_id, finish_status, statuss, sync_flag, current_year_status) {
            client_local.query("SELECT * FROM public.skillangels_training_gameques_entry where gameques_train_id=$1", [gameques_train_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_training_gameques_entry in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_tgqe == ((live_tgqe_rows.rows.length - 1))) {
                            local_training_gameques_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_training_gameques_entry_sync(start_val_tgqe, live_tgqe_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_training_gameques_entry (gameques_train_id, user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, answeredtime, ass_status_id, finish_status,status, sync_flag, current_year_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)", [gameques_train_id, user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, answeredtime, ass_status_id, finish_status, statuss, sync_flag, current_year_status], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA215',
                                    message: "Can't insert into local skillangels_training_gameques_entry "
                                });
                            }
                            else {
                                if (start_val_tgqe == ((live_tgqe_rows.rows.length - 1))) {
                                    local_training_gameques_entry_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_training_gameques_entry_sync(start_val_tgqe, live_tgqe_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(gameques_train_id, user_id, game_id, event_id, quesno, score, ansvalidation, responsetime, answeredtime, ass_status_id, finish_status, statuss, sync_flag, current_year_status);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_training_gameques_entry_sync caused exception"
        });
    }
}


const local_userscore_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_skillkitscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_userscore WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1 ) ", [temp_bran], (err_live_us, res_live_us) => {

                if (err_live_us) {
                    console.log(err_live_us);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA216',
                        message: "query error at selecting skillangels_userscore in local_userscore_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_us_rows = res_live_us
                    if (live_us_rows.rows.length > 0) {
                        start_val_us = -1;
                        call_userscore_sync(start_val_us, live_us_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        local_userscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_userscore_sync caused exception"
        });
    }
}

const call_userscore_sync = (start_val_us, live_us_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_us = start_val_us + 1
        userscore_id = live_us_rows.rows[start_val_us].userscore_id;
        user_id = live_us_rows.rows[start_val_us].user_id;
        game_id = live_us_rows.rows[start_val_us].game_id;
        event_id = live_us_rows.rows[start_val_us].event_id;
        score = live_us_rows.rows[start_val_us].score;
        correctcnt = live_us_rows.rows[start_val_us].correctcnt;
        wrongcnt = live_us_rows.rows[start_val_us].wrongcnt;
        ansquescnt = live_us_rows.rows[start_val_us].ansquescnt;
        totalquescnt = live_us_rows.rows[start_val_us].totalquescnt;
        responsetime = live_us_rows.rows[start_val_us].responsetime;
        wrongresponsetime = live_us_rows.rows[start_val_us].wrongresponsetime;
        correctresponsetime = live_us_rows.rows[start_val_us].correctresponsetime;
        gametime = live_us_rows.rows[start_val_us].gametime;
        date = live_us_rows.rows[start_val_us].date;
        statuss = live_us_rows.rows[start_val_us].status;
        ass_status_id = live_us_rows.rows[start_val_us].ass_status_id;
        ass_slot = live_us_rows.rows[start_val_us].ass_slot;
        sync_flag = live_us_rows.rows[start_val_us].sync_flag;
        current_year_status = live_us_rows.rows[start_val_us].current_year_status;

        (function (userscore_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime, date, statuss, ass_status_id, ass_slot, sync_flag, current_year_status) {
            client_local.query("SELECT * FROM public.skillangels_userscore where userscore_id=$1", [userscore_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_userscore in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_us == ((live_us_rows.rows.length - 1))) {
                            local_userscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_userscore_sync(start_val_us, live_us_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_userscore (userscore_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime,  date, status, ass_status_id, ass_slot, sync_flag, current_year_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)", [userscore_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime, date, statuss, ass_status_id, ass_slot, sync_flag, current_year_status], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA217',
                                    message: "Can't insert into local skillangels_userscore "
                                });
                            }
                            else {
                                if (start_val_us == ((live_us_rows.rows.length - 1))) {
                                    local_userscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_userscore_sync(start_val_us, live_us_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "call_userscore_sync caused exception"
        });
    }
}

const local_skillkitscore_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_training_userscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_skillkitscore WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1 )", [temp_bran], (err_live_sks, res_live_sks) => {

                if (err_live_sks) {
                    console.log(err_live_sks);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA218',
                        message: "query error at selecting skillangels_skillkitscore in local_skillkitscore_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_sks_rows = res_live_sks
                    if (live_sks_rows.rows.length > 0) {
                        start_val_sks = -1;
                        call_skillkitscore_sync(start_val_sks, live_sks_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        local_skillkitscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_skillkitscore_sync caused exception"
        });
    }
}

const call_skillkitscore_sync = (start_val_sks, live_sks_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_sks = start_val_sks + 1
        skscore_id = live_sks_rows.rows[start_val_sks].skscore_id;
        user_id = live_sks_rows.rows[start_val_sks].user_id;
        game_id = live_sks_rows.rows[start_val_sks].game_id;
        event_id = live_sks_rows.rows[start_val_sks].event_id;
        score = live_sks_rows.rows[start_val_sks].score;
        correctcnt = live_sks_rows.rows[start_val_sks].correctcnt;
        wrongcnt = live_sks_rows.rows[start_val_sks].wrongcnt;
        ansquescnt = live_sks_rows.rows[start_val_sks].ansquescnt;
        totalquescnt = live_sks_rows.rows[start_val_sks].totalquescnt;
        responsetime = live_sks_rows.rows[start_val_sks].responsetime;
        wrongresponsetime = live_sks_rows.rows[start_val_sks].wrongresponsetime;
        correctresponsetime = live_sks_rows.rows[start_val_sks].correctresponsetime;
        gametime = live_sks_rows.rows[start_val_sks].gametime;
        played_date = live_sks_rows.rows[start_val_sks].played_date;
        skillkit = live_sks_rows.rows[start_val_sks].skillkit;
        statuss = live_sks_rows.rows[start_val_sks].status;
        sync_flag = live_sks_rows.rows[start_val_sks].sync_flag;
        current_year_status = live_sks_rows.rows[start_val_sks].current_year_status;
        testtype = live_sks_rows.rows[start_val_sks].testtype;

        (function (skscore_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime, played_date, skillkit, statuss, sync_flag, current_year_status, testtype) {
            client_local.query("SELECT * FROM public.skillangels_skillkitscore where skscore_id=$1", [skscore_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_skillkitscore in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_sks == ((live_sks_rows.rows.length - 1))) {
                            local_skillkitscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_skillkitscore_sync(start_val_sks, live_sks_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_skillkitscore (skscore_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime,  played_date, skillkit, status, sync_flag, current_year_status, testtype) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)", [skscore_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime, played_date, skillkit, statuss, sync_flag, current_year_status, testtype], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA219',
                                    message: "Can't insert into local skillangels_skillkitscore "
                                });
                            }
                            else {
                                if (start_val_sks == ((live_sks_rows.rows.length - 1))) {
                                    local_skillkitscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_skillkitscore_sync(start_val_sks, live_sks_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "call_skillkitscore_sync caused exception"
        });
    }
}


const local_training_userscore_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_userfinishcycle_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_training_userscore WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1 )", [temp_bran], (err_live_tus, res_live_tus) => {

                if (err_live_tus) {
                    console.log(err_live_tus);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA220',
                        message: "query error at selecting skillangels_training_userscore in local_training_userscore_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_tus_rows = res_live_tus
                    if (live_tus_rows.rows.length > 0) {
                        start_val_tus = -1;
                        call_training_userscore_sync(start_val_tus, live_tus_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        local_training_userscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_training_userscore_sync caused exception"
        });
    }
}

const call_training_userscore_sync = (start_val_tus, live_tus_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_tus = start_val_tus + 1
        userscore_train_id = live_tus_rows.rows[start_val_tus].userscore_train_id;
        user_id = live_tus_rows.rows[start_val_tus].user_id;
        game_id = live_tus_rows.rows[start_val_tus].game_id;
        event_id = live_tus_rows.rows[start_val_tus].event_id;
        score = live_tus_rows.rows[start_val_tus].score;
        correctcnt = live_tus_rows.rows[start_val_tus].correctcnt;
        wrongcnt = live_tus_rows.rows[start_val_tus].wrongcnt;
        ansquescnt = live_tus_rows.rows[start_val_tus].ansquescnt;
        totalquescnt = live_tus_rows.rows[start_val_tus].totalquescnt;
        responsetime = live_tus_rows.rows[start_val_tus].responsetime;
        wrongresponsetime = live_tus_rows.rows[start_val_tus].wrongresponsetime;
        correctresponsetime = live_tus_rows.rows[start_val_tus].correctresponsetime;
        gametime = live_tus_rows.rows[start_val_tus].gametime;
        date = live_tus_rows.rows[start_val_tus].date;
        statuss = live_tus_rows.rows[start_val_tus].status;
        ass_status_id = live_tus_rows.rows[start_val_tus].ass_status_id;
        ass_slot = live_tus_rows.rows[start_val_tus].ass_slot;
        sync_flag = live_tus_rows.rows[start_val_tus].sync_flag;
        current_year_status = live_tus_rows.rows[start_val_tus].current_year_status;

        (function (userscore_train_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime, date, statuss, ass_status_id, ass_slot, sync_flag, current_year_status) {
            client_local.query("SELECT * FROM public.skillangels_training_userscore where userscore_train_id=$1", [userscore_train_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_training_userscore in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_tus == ((live_tus_rows.rows.length - 1))) {
                            local_training_userscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_training_userscore_sync(start_val_tus, live_tus_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_training_userscore (userscore_train_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime,  date, status, ass_status_id, ass_slot, sync_flag, current_year_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)", [userscore_train_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime, date, statuss, ass_status_id, ass_slot, sync_flag, current_year_status], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA221',
                                    message: "Can't insert into local skillangels_training_userscore "
                                });
                            }
                            else {
                                if (start_val_tus == ((live_tus_rows.rows.length - 1))) {
                                    local_training_userscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_training_userscore_sync(start_val_tus, live_tus_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                            }
                        });
                    }
                }
            });
        })(userscore_train_id, user_id, game_id, event_id, score, correctcnt, wrongcnt, ansquescnt, totalquescnt, responsetime, wrongresponsetime, correctresponsetime, gametime, date, statuss, ass_status_id, ass_slot, sync_flag, current_year_status);
    } catch (e) {
        done_local();
        done_live();
        return response.status(200).json({
            code: "SA120",
            status: "Failed",
            message: "call_training_userscore_sync caused exception"
        });
    }
}

const local_userfinishcycle_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_usermaxscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_userfinishcycle WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1 ) ", [temp_bran], (err_local_ufc, res_live_ufc) => {

                if (err_local_ufc) {
                    console.log(err_local_ufc);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA222',
                        message: "query error at selecting skillangels_userfinishcycle in local_userfinishcycle_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_ufc_rows = res_live_ufc
                    if (live_ufc_rows.rows.length > 0) {
                        start_val_ufc = -1;
                        call_userfinishcycle_userscore_sync(start_val_ufc, live_ufc_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        local_userfinishcycle_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_userfinishcycle_sync caused exception"
        });
    }
}

const call_userfinishcycle_userscore_sync = (start_val_ufc, live_ufc_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_ufc = start_val_ufc + 1
        ufc_id = live_ufc_rows.rows[start_val_ufc].ufc_id;
        user_id = live_ufc_rows.rows[start_val_ufc].user_id;
        cycle_id = live_ufc_rows.rows[start_val_ufc].cycle_id;
        assess_status_id = live_ufc_rows.rows[start_val_ufc].assess_status_id;
        m_score = live_ufc_rows.rows[start_val_ufc].m_score;
        v_score = live_ufc_rows.rows[start_val_ufc].v_score;
        f_score = live_ufc_rows.rows[start_val_ufc].f_score;
        p_score = live_ufc_rows.rows[start_val_ufc].p_score;
        l_score = live_ufc_rows.rows[start_val_ufc].l_score;
        m_attempt_cnt = live_ufc_rows.rows[start_val_ufc].m_attempt_cnt;
        v_attempt_cnt = live_ufc_rows.rows[start_val_ufc].v_attempt_cnt;
        f_attempt_cnt = live_ufc_rows.rows[start_val_ufc].f_attempt_cnt;
        p_attempt_cnt = live_ufc_rows.rows[start_val_ufc].p_attempt_cnt;
        l_attempt_cnt = live_ufc_rows.rows[start_val_ufc].l_attempt_cnt;
        date = live_ufc_rows.rows[start_val_ufc].date;
        statuss = live_ufc_rows.rows[start_val_ufc].status;
        sync_flag = live_ufc_rows.rows[start_val_ufc].sync_flag;
        current_year_status = live_ufc_rows.rows[start_val_ufc].current_year_status;

        (function (ufc_id, user_id, cycle_id, assess_status_id, m_score, v_score, f_score, p_score, l_score, m_attempt_cnt, v_attempt_cnt, f_attempt_cnt, p_attempt_cnt, l_attempt_cnt, date, statuss, sync_flag, current_year_status) {
            client_local.query("SELECT * FROM public.skillangels_userfinishcycle where ufc_id=$1", [ufc_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_userfinishcycle in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_ufc == ((live_ufc_rows.rows.length - 1))) {
                            local_userfinishcycle_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_userfinishcycle_userscore_sync(start_val_ufc, live_ufc_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_userfinishcycle (ufc_id, user_id, cycle_id, assess_status_id, m_score, v_score, f_score, p_score, l_score, m_attempt_cnt, v_attempt_cnt, f_attempt_cnt, p_attempt_cnt, l_attempt_cnt, date, status, sync_flag, current_year_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)", [ufc_id, user_id, cycle_id, assess_status_id, m_score, v_score, f_score, p_score, l_score, m_attempt_cnt, v_attempt_cnt, f_attempt_cnt, p_attempt_cnt, l_attempt_cnt, date, statuss, sync_flag, current_year_status], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA223',
                                    message: "Can't insert into local skillangels_userfinishcycle "
                                });
                            }
                            else {
                                if (start_val_ufc == ((live_ufc_rows.rows.length - 1))) {
                                    local_userfinishcycle_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_userfinishcycle_userscore_sync(start_val_ufc, live_ufc_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "call_userfinishcycle_userscore_sync caused exception"
        });
    }
}


const local_usermaxscore_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_skillkit_usermaxscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_usermaxscore WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1 )", [temp_bran], (err_live_ums, res_live_ums) => {

                if (err_live_ums) {
                    console.log(err_live_ums);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA224',
                        message: "query error at selecting skillangels_usermaxscore in local_usermaxscore_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_ums_rows = res_live_ums
                    if (live_ums_rows.rows.length > 0) {
                        start_val_ums = -1;
                        call_usermaxscore_sync(start_val_ums, live_ums_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        local_usermaxscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_usermaxscore_sync caused exception"
        });
    }
}

const call_usermaxscore_sync = (start_val_ums, live_ums_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_ums = start_val_ums + 1
        ums_id = live_ums_rows.rows[start_val_ums].ums_id;
        user_id = live_ums_rows.rows[start_val_ums].user_id;
        cycle_id = live_ums_rows.rows[start_val_ums].cycle_id;
        assess_status_id = live_ums_rows.rows[start_val_ums].assess_status_id;
        max_m_score = live_ums_rows.rows[start_val_ums].max_m_score;
        max_v_score = live_ums_rows.rows[start_val_ums].max_v_score;
        max_f_score = live_ums_rows.rows[start_val_ums].max_f_score;
        max_p_score = live_ums_rows.rows[start_val_ums].max_p_score;
        max_l_score = live_ums_rows.rows[start_val_ums].max_l_score;
        statuss = live_ums_rows.rows[start_val_ums].status;
        date = live_ums_rows.rows[start_val_ums].date;
        sync_flag = live_ums_rows.rows[start_val_ums].sync_flag;
        current_year_status = live_ums_rows.rows[start_val_ums].current_year_status;

        (function (ums_id, user_id, cycle_id, assess_status_id, max_m_score, max_v_score, max_f_score, max_p_score, max_l_score, statuss, date, sync_flag, current_year_status) {
            client_local.query("SELECT * FROM public.skillangels_usermaxscore where ums_id=$1", [ums_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_usermaxscore in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_ums == ((live_ums_rows.rows.length - 1))) {
                            local_usermaxscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_usermaxscore_sync(start_val_ums, live_ums_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_usermaxscore (ums_id, user_id, cycle_id, assess_status_id, max_m_score, max_v_score, max_f_score, max_p_score, max_l_score,  status, date, sync_flag, current_year_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)", [ums_id, user_id, cycle_id, assess_status_id, max_m_score, max_v_score, max_f_score, max_p_score, max_l_score, statuss, date, sync_flag, current_year_status], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA225',
                                    message: "Can't insert into local skillangels_usermaxscore "
                                });
                            }
                            else {
                                if (start_val_ums == ((live_ums_rows.rows.length - 1))) {
                                    local_usermaxscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_usermaxscore_sync(start_val_ums, live_ums_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "call_usermaxscore_sync caused exception"
        });
    }
}


const local_skillkit_usermaxscore_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            incval_sc = 0;
            local_usertotalvalue_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_skillkit_usermaxscore WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1 )", [temp_bran], (err_live_skums, res_live_skums) => {
                if (err_live_skums) {
                    console.log(err_live_skums);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA226',
                        message: "query error at selecting skillangels_skillkit_usermaxscore in local_skillkit_usermaxscore_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_skums_rows = res_live_skums
                    if (live_skums_rows.rows.length > 0) {
                        start_val_skums = -1;
                        call_skillkit_usermaxscore_sync(start_val_skums, live_skums_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        local_skillkit_usermaxscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_skillkit_usermaxscore_sync caused exception"
        });
    }
}

const call_skillkit_usermaxscore_sync = (start_val_skums, live_skums_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_skums = start_val_skums + 1
        skillkit_ums_id = live_skums_rows.rows[start_val_skums].skillkit_ums_id;
        user_id = live_skums_rows.rows[start_val_skums].user_id;
        cycle_id = live_skums_rows.rows[start_val_skums].cycle_id;
        skillkit = live_skums_rows.rows[start_val_skums].skillkit;
        max_m_score = live_skums_rows.rows[start_val_skums].max_m_score;
        max_v_score = live_skums_rows.rows[start_val_skums].max_v_score;
        max_f_score = live_skums_rows.rows[start_val_skums].max_f_score;
        max_p_score = live_skums_rows.rows[start_val_skums].max_p_score;
        max_l_score = live_skums_rows.rows[start_val_skums].max_l_score;
        statuss = live_skums_rows.rows[start_val_skums].status;
        played_date = live_skums_rows.rows[start_val_skums].played_date;
        sync_flag = live_skums_rows.rows[start_val_skums].sync_flag;
        current_year_status = live_skums_rows.rows[start_val_skums].current_year_status;

        (function (skillkit_ums_id, user_id, cycle_id, skillkit, max_m_score, max_v_score, max_f_score, max_p_score, max_l_score, statuss, played_date, sync_flag, current_year_status) {
            client_local.query("SELECT * FROM public.skillangels_skillkit_usermaxscore where skillkit_ums_id=$1", [skillkit_ums_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_skillkit_usermaxscore in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_skums == ((live_skums_rows.rows.length - 1))) {
                            local_skillkit_usermaxscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_skillkit_usermaxscore_sync(start_val_skums, live_skums_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_skillkit_usermaxscore (skillkit_ums_id, user_id, cycle_id, skillkit, max_m_score, max_v_score, max_f_score, max_p_score, max_l_score,  status, played_date, sync_flag, current_year_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)", [skillkit_ums_id, user_id, cycle_id, skillkit, max_m_score, max_v_score, max_f_score, max_p_score, max_l_score, statuss, played_date, sync_flag, current_year_status], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local()
                                done_live()
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA227',
                                    message: "Can't insert into local skillangels_skillkit_usermaxscore "
                                });
                            }
                            else {
                                if (start_val_skums == ((live_skums_rows.rows.length - 1))) {
                                    local_skillkit_usermaxscore_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_skillkit_usermaxscore_sync(start_val_skums, live_skums_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "call_skillkit_usermaxscore_sync caused exception"
        });
    }
}


const local_usertotalvalue_sync = (live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        if (incval_sc == live_sb_rows.rows.length) {
            client_local.query("select * from fn_triggerall(true)", (err_local, res_local) => {
                if (err_local) {
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA301',
                        message: "query error at enable trigger"
                    });
                } else {
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "success",
                        code: 'SA000',
                        message: "All tables are inserted succesfully"
                    });
                }
            });
        }
        else {
            temp_bran = live_sb_rows.rows[incval_sc].id;
            client_live.query("SELECT * FROM public.skillangels_usertotalvalue WHERE user_id in (SELECT id FROM public.skillangels_users WHERE branch_id=$1 ) ", [temp_bran], (err_live_utv, res_live_utv) => {

                if (err_live_utv) {
                    console.log(err_live_utv);
                    done_local()
                    done_live()
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA228',
                        message: "query error at selecting skillangels_usertotalvalue in local_usertotalvalue_sync live"
                    });
                }
                else {
                    incval_sc++;
                    var live_utv_rows = res_live_utv
                    if (live_utv_rows.rows.length > 0) {
                        start_val_utv = -1;
                        call_usertotalvalue_sync(start_val_utv, live_utv_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                    }
                    else {
                        local_usertotalvalue_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "local_usertotalvalue_sync caused exception"
        });
    }
}

const call_usertotalvalue_sync = (start_val_utv, live_utv_rows, live_sb_rows, response, client_local, done_local, client_live, done_live) => {
    try {
        start_val_utv = start_val_utv + 1
        utv_id = live_utv_rows.rows[start_val_utv].utv_id;
        user_id = live_utv_rows.rows[start_val_utv].user_id;
        totalscore = live_utv_rows.rows[start_val_utv].totalscore;
        totalstar = live_utv_rows.rows[start_val_utv].totalstar;
        totalcrowny = live_utv_rows.rows[start_val_utv].totalcrowny;
        date = live_utv_rows.rows[start_val_utv].date;
        statuss = live_utv_rows.rows[start_val_utv].status;
        sync_flag = live_utv_rows.rows[start_val_utv].sync_flag;
        current_year_status = live_utv_rows.rows[start_val_utv].current_year_status;

        (function (utv_id, user_id, totalscore, totalstar, totalcrowny, date, statuss, sync_flag, current_year_status) {
            client_local.query("SELECT * FROM public.skillangels_usertotalvalue where utv_id=$1", [utv_id], (err_sel, res_sel) => {
                if (err_sel) {
                    done_local();
                    done_live();
                    response.status(200).json({
                        status: "Failed",
                        code: 'SA101',
                        message: "query error at selecting each skillangels_usertotalvalue in local"
                    });
                }
                else {
                    if (res_sel.rows.length > 0) {
                        if (start_val_utv == ((live_utv_rows.rows.length - 1))) {
                            local_usertotalvalue_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                        else {
                            call_usertotalvalue_sync(start_val_utv, live_utv_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
                        }
                    }
                    else {
                        client_local.query("INSERT INTO skillangels_usertotalvalue (utv_id, user_id, totalscore, totalstar, totalcrowny, date, status, sync_flag, current_year_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)", [utv_id, user_id, totalscore, totalstar, totalcrowny, date, statuss, sync_flag, current_year_status], (err_1ocal, res_1ocal) => {
                            if (err_1ocal) {
                                console.log(err_1ocal);
                                done_local();
                                done_live();
                                response.status(200).json({
                                    status: "Failed",
                                    code: 'SA229',
                                    message: "Can't insert into local skillangels_usertotalvalue "
                                });
                            }
                            else {
                                if (start_val_utv == ((live_utv_rows.rows.length - 1))) {
                                    local_usertotalvalue_sync(live_sb_rows, response, client_local, done_local, client_live, done_live)
                                }
                                else {
                                    call_usertotalvalue_sync(start_val_utv, live_utv_rows, live_sb_rows, response, client_local, done_local, client_live, done_live)
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
            message: "call_usertotalvalue_sync caused exception"
        });
    }
}



module.exports = {
    local_sync
};