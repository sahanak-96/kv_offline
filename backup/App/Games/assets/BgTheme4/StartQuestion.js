var qnochange = [];
function getStartQuestion() {

    if (gameType == 0) {

        if (isQuestionAllVariations) {

            createGameWiseQuestions()
            if (gameAssetsPath == "BackTrack-Level3/" || gameAssetsPath == "BackTrack-Level1/" || gameAssetsPath == "BackTrack-Level2/" || gameAssetsPath == "BallTrack-Level1/") {
                idle();
            }
            else if (gameAssetsPath == "DropBox-Level1/" || gameAssetsPath == "DropBox-Level2/") {
                setTimeout(checkfall, 1000)
            }
            else {
                pickques();
            }

        }
        else {
            if (gameAssetsPath == "BackTrack-Level3/" || gameAssetsPath == "BackTrack-Level1/" || gameAssetsPath == "BackTrack-Level2/" || gameAssetsPath == "BallTrack-Level1/" ) {
                idle();
            }
            else if (gameAssetsPath == "DropBox-Level1/" || gameAssetsPath == "DropBox-Level2/") {
                setTimeout(checkfall, 1000)
            }
            else {
                pickques();
            }
        }
    }
    else {


        //     var url =upath2;

        // var params =game_name;

        // http.open("POST", url, true);

        // //Send the proper header information along with the request

        // http.setRequestHeader("Content-type","application/x-www-form-urlencoded");



        // http.onreadystatechange = function () {//Call a function when the state changes.

        //     if (http.readyState == 4 && http.status == 200) {

        //         var Data = JSON.parse(http.responseText);

        var isOnline = navigator.onLine;
        console.log("isOnline= " + isOnline)
        if (isOnline) {
            var temppuzzle_cycle = parseInt(i7)

            if (parseInt(i7) == 1) {
                if (parseInt(i1) >= parseInt(totalQuestions) || parseInt(i2) == 0) {
                    pauseTimer();
                    intChkVar = 1
                    internetErrorFn()
                    console.log(i1 + " = Finished Game= " + totalQuestions + " = == " + i2);
                }
                else if (i1 >= 1) {
                    time = parseInt(i2);
                    // cnt = parseInt(i1) - 1;
                    qscnt = parseInt(i1) - 1;
                    quesCnt = parseInt(i1);
                    answeredQuestions = parseInt(i1);
                    ccnt = parseInt(i5);

                    qnochange = i3.split(',');
                    score = parseInt(i4);
                    responseTime = parseInt(i6);
                    puzzle_cycle = parseInt(i7);
                    gameScoreTxt.text = score + "";

                    console.log("before" + qno);
                    qno = qno.filter(function (el) {
                        return qnochange.indexOf(el + "") < 0;
                    });
                    console.log("after" + qno);
                    if (gameAssetsPath == "BackTrack-Level3/" || gameAssetsPath == "BackTrack-Level1/" || gameAssetsPath == "BackTrack-Level2/") {

                        gameQCntTxt.text = (quesCnt + 1) + "/" + String(totalQuestions)
                        gameTimerTxt.text = time.toString();
                        idle();
                    }
                    else if (gameAssetsPath == "DropBox-Level1/" || gameAssetsPath == "DropBox-Level2/") {

                        gameQCntTxt.text = (quesCnt + 1) + "/" + String(totalQuestions)
                        gameTimerTxt.text = time.toString();
                        setTimeout(checkfall, 1000)
                    }
                    else {

                        gameQCntTxt.text = quesCnt + "/" + String(totalQuestions)
                        gameTimerTxt.text = time.toString();
                        pickques();
                    }

                }
                else {
                    console.log(" Game Init PickQues" + gameAssetsPath)
                    if (gameAssetsPath == "BackTrack-Level3/" || gameAssetsPath == "BackTrack-Level1/" || gameAssetsPath == "BackTrack-Level2/") {
                        idle();
                    }
                    else if (gameAssetsPath == "DropBox-Level1/" || gameAssetsPath == "DropBox-Level2/") {
                        setTimeout(checkfall, 1000)
                    }
                    else {
                        pickques();
                    }

                }
            }
            else {
                c1.visible = false;
                c2.visible = false;
                c3.visible = false;
                loader.visible = false;
                loadingText.visible = false;
                container1.parent.removeChild(c1);
                container1.parent.removeChild(c2);
                container1.parent.removeChild(c3);
                container1.parent.removeChild(loader);
                container1.parent.removeChild(loadingText);

                intChkVar = 2
                internetErrorFn()
            }
        }
        else {

            intChkVar = 0
            internetErrorFn()
        }
        //}
        //     http.send(params);



        // }

    }


}