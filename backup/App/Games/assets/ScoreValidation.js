var goverflag = 0;
var http = new XMLHttpRequest();
function ScoreRedirect(nav, url1, sid, gid, rt, tv, ca, ua, asc, qno, sc, pc, tsc) {
    if (qscnt <= 9 && goverflag == 0) {
        pauseTimer();
        if (nav == 'yes') {
            var isOnline = navigator.onLine;
            console.log("isOnline= " + isOnline)
            if (!isOnline) {
                intChkVar = 0
                internetErrorFn()
                console.log("Please check your internet connectivity!");
            }
            else {
                try {
                    console.log("console.log");
                    //  window.location.href = url + "?gtime1=" + gtime + "&aqcnt1=" + aqcnt + "&rtime1=" + rtime + "&cqcnt1=" + cqcnt + "&crtime1=" + crtime + "&gscore1=" + gscore + "&tqcnt1=" + tqcnt + "&wrtime1=" + wrtime;


                    var urlA = upath1;
                    var params = "SID=" + sid + "&GID=" + gid + "&RT=" + rt + "&TV=" + tv + "&CA=" + ca + "&UA=" + ua + "&AS=" + asc + "&QNO=" + qno + "&SCORE=" + sc + "&puzzle_cycle=" + pc + "&TOS=" + tsc;
                    http.open("POST", urlA, true);
                    //Send the proper header information along with the request
                    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                    http.onreadystatechange = function () {//Call a function when the state changes.

                        if (http.readyState == 4 && http.status == 200) {
                            var Data = (http.responseText);
                            console.log("console.log" + Data);

                            do {
                                console.log("test")
                                if (Data == -1 || Data == -2) {
                                    if (Data == -1) {
                                        intChkVar = 0
                                        internetErrorFn()
                                    }
                                    else if (Data == -2) {
                                        intChkVar = 2
                                        internetErrorFn()
                                    }
                                } else {
                                    if (((qscnt >= 9) && (ua == "NotAnswered")) || (time <= 0)) {
                                        clearInterval(interval);
                                        goverflag = 1;
                                        console.log("console1");
                                        handleComplete1();
                                    }
                                    else if ((qscnt >= 9) && !(ua == "NotAnswered")) {
                                        goverflag = 1;
                                        clearInterval(interval);
                                        console.log("console2");
                                        handleComplete();
                                    }

                                    else {

                                        handleComplete();
                                        console.log("console3");

                                    }
                                }

                            } while (1 != 1)
                        }
                    }
                    http.send(params);
                }
                catch (error) {
                    console.error(error);
                    intChkVar = 0
                    internetErrorFn()
                    // expected output: ReferenceError: nonExistentFunction is not defined
                    // Note - error messages will vary depending on browser
                }

            }
        }
    }
    else {
        console.log("gameover");
    }
}