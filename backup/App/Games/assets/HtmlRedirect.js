var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var bgvoice = 0;

if (iOS == false) {
    // alert("IOS = "+iOS)
    // speaksound();
}
var redirectJsonPath = "./assets/"
// var redirectJsonPath = "https://games.skillangels.com/clp1920/assets/swf/assets/";
// var redirectJsonPath =  "http://localhost/schoolsclp1920/v1/assets/";

var http = new XMLHttpRequest();

function htmlRedirect(nav, url, tqcnt, aqcnt, cqcnt, gscore, gtime, rtime, crtime, wrtime, wqcnt) {
    console.log("htmlredirect........ " + tqcnt + " " + aqcnt + " " + cqcnt + " " + gscore + " " + gtime + " " + rtime + " " + crtime + " " + wrtime + " " + wqcnt)

    // if (nav == 'yes') {
    var isOnline = navigator.onLine;
    console.log("isOnline= " + isOnline)
    if (!isOnline) {
        intChkVar = 0
        internetErrorFn1();
        console.log("Please check your internet connectivity!");
    } else {
        if (AngSkillkit_id != "") {
            var urlA = AngBaseUrl + "putskillkitscore";

            console.log("ssssssssssss" + "uid=" + AngUId + "&gameid=" + AngGameId + "&eid=" + AngEId + "&score=" + gscore + "&ccnt=" + cqcnt +
                "&wcnt=" + wqcnt + "&aqcnt=" + aqcnt + "&tqcnt=" + tqcnt + "&rtime=" + rtime + "&crtime=" + crtime +
                "&wrtime=" + wrtime + "&gtime=" + gtime + "&skillkit=" + AngSkillkit_id + "&year_status=" + Angyear_status + "&testtype=" + Angtesttype);

            var params = "uid=" + AngUId + "&gameid=" + AngGameId + "&eid=" + AngEId + "&score=" + gscore + "&ccnt=" + cqcnt +
                "&wcnt=" + wqcnt + "&aqcnt=" + aqcnt + "&tqcnt=" + tqcnt + "&rtime=" + rtime + "&crtime=" + crtime +
                "&wrtime=" + wrtime + "&gtime=" + gtime + "&skillkit=" + AngSkillkit_id + "&year_status=" + Angyear_status + "&testtype=" + Angtesttype;
            http.open("POST", urlA, true);
            // Send the proper header information along with the request
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");


            http.onreadystatechange = function () {//Call a function when the state changes.

                if (http.readyState == 4 && http.status == 200) {
                    if (!isOnline) {
                        intChkVar = 0
                        internetErrorFn1();
                    } else {
                        var Data = (http.responseText);
                        do {
                            console.log("test" + Data)
                            var datatemp = JSON.parse(http.responseText)
                            if (datatemp.code == "SA136") {
                                console.log("test" + datatemp.code)
                                clearInterval(this.countsession);
                                window.open(AngUrl, "_self");
                            }
                            else {

                                try {
                                    bitmap.visible = false;
                                    resultLoading.visible = true;
                                    questionTxtR.visible = true;
                                    attemptTxtR.visible = true;
                                    correctTxtR.visible = true;
                                    responseTxtR.visible = true;
                                    scoreTxtR.visible = true;
                                }
                                catch{
                                    console.log("catch" + datatemp.code)
                                    clearInterval(this.countsession);
                                    window.open(AngUrl, "_self");
                                }

                            }

                        } while (1 != 1)
                    }
                }

            }
            http.send(params);
            console.log("url=1= = " + url)
        }
        else {
            var urlA = AngBaseUrl + "gamescore";
            console.log('Angyear_status' + Angyear_status)
            //  console.log("ssssssssssss"+"uid=" + AngUId + "&gameid=" + AngGameId + "&eid=" + AngEId + "&score=" + gscore + "&ccnt=" + cqcnt +
            //  "&wcnt=" + wqcnt + "&aqcnt=" + aqcnt + "&tqcnt=" + tqcnt + "&rtime=" + rtime + "&crtime=" + crtime +
            //  "&wrtime=" + wrtime + "&gtime=" + gtime + "&ass_status=" + AngAssStatus + "&ass_slot=" + AngAssSlot+ "&year_status=" + Angyear_status );
            var params = "uid=" + AngUId + "&gameid=" + AngGameId + "&eid=" + AngEId + "&score=" + gscore + "&ccnt=" + cqcnt +
                "&wcnt=" + wqcnt + "&aqcnt=" + aqcnt + "&tqcnt=" + tqcnt + "&rtime=" + rtime + "&crtime=" + crtime +
                "&wrtime=" + wrtime + "&gtime=" + gtime + "&ass_status=" + AngAssStatus + "&ass_slot=" + AngAssSlot
                + "&year_status=" + Angyear_status + "&Angisass2train=" + Angisass2train;
            http.open("POST", urlA, true);
            //Send the proper header information along with the request
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            http.onreadystatechange = function () {//Call a function when the state changes.

                if (http.readyState == 4 && http.status == 200) {

                    if (!isOnline) {
                        intChkVar = 0
                        internetErrorFn1();
                    } else {
                        var Data = (http.responseText);
                        do {
                            console.log("test" + Data)
                            var datatemp = JSON.parse(http.responseText)
                            if (datatemp.code == "SA332" || datatemp.code == "SA335"
                                || datatemp.code == "SA344" || datatemp.code == "SA354") {
                                clearInterval(this.countsession);
                                window.open(AngUrl, "_self");
                            }
                            else {

                                try {
                                    bitmap.visible = false;
                                    resultLoading.visible = true;
                                    questionTxtR.visible = true;
                                    attemptTxtR.visible = true;
                                    correctTxtR.visible = true;
                                    responseTxtR.visible = true;
                                    scoreTxtR.visible = true;
                                }
                                catch{
                                    clearInterval(this.countsession);
                                    window.open(AngUrl, "_self");
                                }

                            }

                        } while (1 != 1)

                    }
                }

            }
            http.send(params);
            console.log("url=1= = " + url)
        }


    }
    // }
}


function eachAnswerRedirect(quesno, gscore, ansstatus, responsetime) {
    var isOnline = navigator.onLine;
    console.log("isOnline= " + isOnline)
    if (!isOnline) {
        intChkVar = 0
        internetErrorFn1();
    } else {
        console.log("entered redirect url")
        var quesscore_url = AngBaseUrl + "quesscore";
        var params = "user_id=" + AngUId + "&game_id=" + AngGameId + "&event_id=" + AngEId +
            "&ass_status_id=" + AngAssStatus + "&quesno=" + quesno + "&score=" + gscore + "&ansvalidation=" +
            ansstatus + "&responsetime=" + responsetime + "&status=1" + "&year_status=" + Angyear_status
            + "&testtype=" + Angtesttype + "&Angisass2train=" + Angisass2train;
        http.open("POST", quesscore_url, true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.onreadystatechange = function () {//Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                var Data = (http.responseText);
                console.log(Data);
                var data1 = JSON.parse(http.responseText)
                console.log(data1)
                if (data1.code == "SA358" || data1.code == "SA361"
                    || data1.code == "SA364" || data1.code == "SA367" || data1.code == "SA370") {
                    console.log("data1.code" + data1.code)
                    clearInterval(this.countsession);
                    window.open(AngUrl, "_self");
                }
                else if (data1.code == "SA000") {
                    console.log(answeredQuestions + "entered" + totalQuestions);
                    remainingQueslisttemp();
                }
                else if (data1.status == "failed") {
                    clearInterval(this.countsession);
                    window.open(AngUrl, "_self");
                }
                else {
                    intChkVar = 0
                    internetErrorFn1();
                }
            }

        }

        http.send(params);
    }
}