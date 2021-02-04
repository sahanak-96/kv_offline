var tickFlag = 0;
/*
var gameType = 0;//gameType=0 (for no db)   and gameType=1 (for with db)
var isQuestionAllVariations = true;///only no db gametype can set all variation
*/

var gameType = 0;
var isQuestionAllVariations = true;

var gameScoreTxt

function CreateGameStart() {

    pauseTimer();


    startBtn.removeEventListener("click", handleClick)
    startBtn.removeEventListener("click", handleClick)
    container.parent.removeChild(startBtn);
    container.parent.removeChild(startMc);

    startMc = null;

    if (startBtn) {
        container.parent.removeChild(startBtn);
        startBtn = null
    }
    document.getElementById("gameCanvas").style.background = 'white';
    //////////////////////////////
    closeBtn.visible = false;
    fullScreenBtn.visible = false;
    volumeBtn.visible = false;
    scoreMc.visible = false;
    timerMc.visible = false;
    QuesCntMc.visible = false;

    gameScoreTxt.text = "0";
    gameTimerTxt.text = parseInt(time);


    closeBtn.cursor = "pointer"
    fullScreenBtn.cursor = "pointer"
    volumeBtn.cursor = "pointer"
    closeBtn.addEventListener("click", closeGameHandler);
    container.parent.addChild(timerMc);
    fullScreenBtn.addEventListener("click", toggleFullScreen);
    volumeBtn.addEventListener("click", settingBarSelected);



    /////////////////////////////////////////////////////////////////////////////////////////////////
    if (!createjs.Ticker.hasEventListener("tick")) {
        createjs.Ticker.addEventListener("tick", tick);
    }

    if (bgSnd) {
        bgSnd.stop();
    }
    bgSnd = createjs.Sound.play("begin", { interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 0.4 });
    bgSnd.volume = 0.2;
    bgSnd.on("complete", bgSndPlaying, null, false);
    stage.update();

}

function closeGameHandler() {
    parent.jQuery.fancybox.close();
    console.log("closeGameHandler")
}



function bgSndPlaying() {
    bgSnd.play();
    bgSnd.volume = 0.2;
    bgSnd.on("complete", bgSndPlaying, null, false);
}


function settingBarSelected(event) {
    event.preventDefault();

    if (event.currentTarget.currentFrame == 0) {
        event.currentTarget.gotoAndStop(1);

        bgSnd.stop();
        correctSnd.stop();
        wrongSnd.stop();
        gameOverSnd.stop();
        tickSnd.stop();

        isEffSound = false;

    } else if (event.currentTarget.currentFrame == 1) {

        event.currentTarget.gotoAndStop(0);
        bgSnd.play();
        isEffSound = true;
    }


    stage.update();
}

//=======================================================END OF BOARD================================================//
this.countTime = function() {
    time--;


    gameTimerTxt.text = String(time)


    if (time <= 10) {

        if (tickFlag == 0) {
            tickSnd = createjs.Sound.play("tick", { interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 0.4 });
            tickSnd.volume = 1;
            tickSnd.play();
            bgSnd.stop();
        }
        tickFlag = 1;
    }
    if (self.time == 0) {


        clearInterval(countTime);
        timeOverSnd.play();
        timeOverSnd.volume = 1;

        container.parent.addChild(timeOverImg);
        timeOverImg.visible = true;

        console.log("console4");
        stage.update()
        clearInterval(self.interval)
        rst1 = rst1 + rst;
        answer_status = "U";
        uans = "NotAnswered";
        ans = "NotAnswered";
        ccnt = ccnt;
        ans = 0;
        ans = ccnt;
        scores = 0;
        gameResponseTimerStop();
        correctSnd.stop();
        wrongSnd.stop();
        gameOverSnd.stop();
        tickSnd.stop();
        bgSnd.stop()
        timeOverSnd.addEventListener("complete", sentscore);

        try {
            disablechoices();
        } catch (err) {
            console.log("Error: disablechoices")
        }
    }

}

function pauseTimer() {
    currTime = time;
    clearInterval(interval);
}

function restartTimer() {
    time = currTime;
    interval = setInterval(countTime, 1000);
}
//----------------------------RESPONSE TIMER-------------------------------------------//
function gameResponseTimerStart() {
    resTimerOut = setInterval(function() {
        rst++;

    }, 1000);
}

function gameResponseTimerStop() {
    clearInterval(resTimerOut);
}