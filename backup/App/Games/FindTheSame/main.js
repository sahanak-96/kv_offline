
///////////////////////////////////////////////////-------Common variables--------------/////////////////////////////////////////////////////////////////////
var messageField;		//Message display field
var assets = [];
var cnt = -1,ans, uans, interval, time = 180, totalQuestions = 10, answeredQuestions = 0, choiceCnt = 3, quesCnt = 0, resTimerOut = 0, rst = 0, responseTime = 0;
var startBtn, introScrn, container, choice1, choice2, choice3, choice4, question, circleOutline, circle1Outline, boardMc, helpMc, quesMarkMc, questionText, quesHolderMc, resultLoading, preloadMc;
var mc, mc1, mc2, mc3, mc4, mc5, startMc, questionInterval = 0;
var parrotWowMc, parrotOopsMc, parrotGameOverMc, parrotTimeOverMc, gameIntroAnimMc;
var bgSnd, correctSnd, wrongSnd, gameOverSnd, timeOverSnd, tickSnd;
var tqcnt = 0, aqcnt = 0, ccnt = 0, cqcnt = 0, gscore = 0, gscrper = 0, gtime = 0, rtime = 0, crtime = 0, wrtime = 0, currTime = 0;
var bg;
var BetterLuck, Excellent, Nice, Good, Super, TryAgain;
var rst1 = 0, crst = 0, wrst = 0, score = 0, puzzle_cycle, timeOver_Status = 0;
var qscnt = -1;
var isBgSound = true;
var isEffSound = true;
var url = "";
var nav = "";
var isResp = true;
var respDim = 'both'
var isScale = true;
var scaleType = 1;
var posX=[, 80, 520, 970];
var posY=[,370,495,370]
var lastW, lastH, lastS = 1;
var borderPadding = 10, barHeight = 20;
var loadProgressLabel, progresPrecentage, loaderWidth;
/////////////////////////////////////////////////////////////////////////GAME SPECIFIC VARIABLES//////////////////////////////////////////////////////////
var currentX, currentY;
///////////////////////////////////////////////////////////////////////GAME SPECIFIC ARRAY//////////////////////////////////////////////////////////////
var qno = [];
var chpos = [];
var choiceArr = [];
var posArr = [];
var quesMcArr1 = [];
var AnswerImage = [];
//register key functions

///////////////////////////////////////////////////////////////////
window.onload = function (e) {
    checkBrowserSupport();
}
///////////////////////////////////////////////////////////////////

function init() {

    canvas = document.getElementById("gameCanvas");
    stage = new createjs.Stage(canvas);
    container = new createjs.Container();
    stage.addChild(container);
    createjs.Ticker.addEventListener("tick", stage);

    createLoader();
    createCanvasResize();

    stage.update();
    stage.enableMouseOver(40);
    ///////////////////////////////////////////////////////////////=========MANIFEST==========///////////////////////////////////////////////////////////////

   

    assetsPath = "assets/";
    gameAssetsPath = "FindTheSame/";
    soundpath = "FA/";

    var success = createManifest();
    if (success == 1) {
        manifest.push(
            { id: "questiontext", src: questionTextPath + "FindTheSame-QT.png" },
            { id: "question", src: gameAssetsPath + "question.png" },
            { id: "qhHolder", src: gameAssetsPath + "qhHolder.png" },
            { id: "choice1", src: gameAssetsPath + "ChoiceImages1.png" },
            { id: "choice2", src: gameAssetsPath + "ChoiceImages2.png" },
            { id: "choice3", src: gameAssetsPath + "ChoiceImages3.png" }
        )
        preloadAllAssets()
        stage.update();
    }
}

//=================================================================DONE LOADING=================================================================//
function doneLoading1(event) {

    loaderBar.visible = false;
    stage.update();
    var event = assets[i];
    var id = event.item.id;

    if (id == "questiontext") {
        questiontext = new createjs.Bitmap(preload.getResult('questiontext'));
        container.parent.addChild(questiontext);
        questiontext.visible = false;
    }

    if (id == "qhHolder") {
        qhHolder = new createjs.Bitmap(preload.getResult('qhHolder'));
        container.parent.addChild(qhHolder);
        qhHolder.visible = false;
    }
    if (id == "question") {
        var spriteSheet1 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult('question')],
            "frames": { "regX": 50, "height": 280, "count": 0, "regY": 50, "width": 280 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        question = new createjs.Sprite(spriteSheet1);
        question.visible = false;
        container.parent.addChild(question);

    };


    if (id == "choice1") {
        var spriteSheet2 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult('choice1')],
            "frames": { "regX": 50, "height": 243, "count": 0, "regY": 50, "width": 243 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        choice1 = new createjs.Sprite(spriteSheet2);
        choice1.visible = false;
        container.parent.addChild(choice1);
        choice1.x = 130; choice1.y = 450;
    };

    if (id == "choice2") {
        var spriteSheet2 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult('choice2')],
            "frames": { "regX": 50, "height": 243, "count": 0, "regY": 50, "width": 243 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        choice2 = new createjs.Sprite(spriteSheet2);
        choice2.visible = false;
        container.parent.addChild(choice2);
    };

    if (id == "choice3") {
        var spriteSheet2 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult('choice3')],
            "frames": { "regX": 50, "height": 243, "count": 0, "regY": 50, "width": 243 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        choice3 = new createjs.Sprite(spriteSheet2);
        choice3.visible = false;
        container.parent.addChild(choice3);
    };

}

function tick(e) {
    stage.update();
}
/////////////////////////////////////////////////////////////////=======HANDLE CLICK========///////////////////////////////////////////////////////////////////
function handleClick(e) {
    qno = between(0, 19);
    qno.splice(qno.indexOf(0), 1);
    qno.push(0);
    CreateGameStart();
    if (gameType == 0) {
        CreateGameElements();
        getStartQuestion();
    } else {
        //for db
        getdomainpath();
        //end
    }

}
function CreateGameElements() {
    interval = setInterval(countTime, 1000); 
  
    container.parent.addChild(questiontext);
    questiontext.visible = false;

    container.parent.addChild(qhHolder);
    qhHolder.visible = false;
    qhHolder.x = -500; qhHolder.y = 0;

    container.parent.addChild(question);
    question.visible = false;
    question.x = 500; question.y = 180;

    for (i = 1; i <= choiceCnt; i++) {
        choiceArr[i] = this["choice" + i].clone();
        choiceArr[i].visible = false;
        choiceArr[i].x = posX[i];
        choiceArr[i].y = posY[i];
        container.parent.addChild(choiceArr[i]);
    }

    if (isQuestionAllVariations) {
        createGameWiseQuestions();
     
        posArr = [0, 1, 2, 0, 1, 2, 0, 1, 2, 1, 0, 1, 2, 0, 1, 2, 0, 1, 2, 2];
       
    } else {
      
        posArr = [0, 1, 2, 0, 1, 2, 0, 1, 2, 1];
     
    }
    posArr.sort(randomSort);
}
function helpDisable() {
    for (i = 1; i <= choiceCnt; i++) {
        choiceArr[i].mouseEnabled = false;
    }
}
function helpEnable() {
    for (i = 1; i <= choiceCnt; i++) {
        choiceArr[i].mouseEnabled = true;
    }
}
//=================================================================================================================================//
function pickques() {
    pauseTimer();
    tx = 0;
    cnt++;
    quesCnt++;
    qscnt++;
    chpos = [];
    attemptCnt = 0;
    currentObj = [];
    panelVisibleFn();
    chposArr = [];
    //=================================================================================================================================//
    console.log("qnoooo" + qno);
    questiontext.visible = false;
    questiontext.alpha = 1;
    question.gotoAndStop(qno[cnt]);
    question.visible = false;
    for (i = 1; i <= choiceCnt; i++) {
        choiceArr[i].visible = false;
        choiceArr[i].gotoAndStop(qno[cnt]);
        choiceArr[i].name = "ch" + i;
    }
    ans = "ch1";
    if (posArr[cnt] == 0) {
        chpos.push(1, 3, 2);
    } else if (posArr[cnt] == 1) {
        chpos.push(2, 3, 1);
    } else {
        chpos.push(3, 1, 2);
    }
    for (i = 1; i <= choiceCnt; i++) {
        switch (i) {
            case 1: choiceArr[chpos[i - 1]].x = 160;
                break;
            case 2: choiceArr[chpos[i - 1]].x = 565;
                break;
            case 3: choiceArr[chpos[i - 1]].x = 970;
                break;
        }          
        choiceArr[chpos[i - 1]].y = 490;        
    } 
    createTween();
    createjs.Ticker.addEventListener("tick", tick);
    stage.update();
}
function createTween() {
     //////////////////////////////QuestionText////////////////////////////
     questiontext.visible = true
     questiontext.alpha = 0;
     questiontext.y=-100
    createjs.Tween.get(questiontext)
         .to({y:0 ,alpha: 1 },500)
     qhHolder.visible = true
     qhHolder.alpha = 0;
     qhHolder.x=-500
    createjs.Tween.get(qhHolder)
             .to({x:0 ,alpha: 1 },500)
    
     question.x = -510; question.y = 180;
     question.visible = true;
     question.alpha = 0    
     question.scaleX=question.scaleY=.9;
     createjs.Tween.get(question).wait(500).to({ x:550, scaleX:1, scaleY:1, alpha: 1 }, 500);  
 
     ///////////////////////////choice tween////////////////////////////////////
     var val=1000
     for (i = 1; i <= choiceCnt; i++) {
         choiceArr[chpos[i-1]].visible = true;
         choiceArr[chpos[i-1]].alpha=0;
         choiceArr[chpos[i-1]].y=-460;      
   createjs.Tween.get(choiceArr[chpos[i-1]]).wait(val) 
       .to({y:posY[i], alpha: 1 }, 500)      }
     repTimeClearInterval = setTimeout(AddListenerFn, 2000)
 }
function AddListenerFn() {
    clearTimeout(repTimeClearInterval);
    console.log("eventlisterneer");
    for (i = 1; i <= choiceCnt; i++) {
        choiceArr[i].addEventListener("click", answerSelected);
        choiceArr[i].mouseEnabled = true;
        choiceArr[i].cursor = "pointer";
    }
    rst = 0;
    gameResponseTimerStart();
    restartTimer();
}

function disablechoices() {
    createjs.Tween.removeAllTweens();
    questiontext.visible = false;
    question.visible = false;
    for (i = 1; i <= choiceCnt; i++) {
        choiceArr[i].visible = false;
        choiceArr[i].mouseEnabled = false;
        choiceArr[i].cursor = "default";
        choiceArr[i].alpha = 1;
        choiceArr[i].removeEventListener("click", answerSelected);

    }
}

function answerSelected(e) {

    e.preventDefault();
    uans = e.currentTarget.name;
    gameResponseTimerStop();
    console.log(ans + " =correct= " + uans);
    if (ans == uans) {
        e.currentTarget.removeEventListener("click", answerSelected);
        for (i = 1; i <= 2; i++) {
            choiceArr[i].mouseEnabled = false;
        }
        getValidation("correct");
        disablechoices();
    }
    else {
        for (i = 1; i <= 2; i++) {
            choiceArr[i].visible = false;
            choiceArr[i].mouseEnabled = false;
        }

        getValidation("wrong");
        disablechoices();
    }

}

