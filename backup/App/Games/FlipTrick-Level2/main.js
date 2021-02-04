///////////////////////////////////////////////////-------Common variables--------------/////////////////////////////////////////////////////////////////////
var messageField;		//Message display field
var assets = [];
var cnt = -1, qscnt = -1, ans, uans, interval, time = 180, totalQuestions = 10, answeredQuestions = 0, choiceCnt = 4, quesCnt = 0, resTimerOut = 0, rst = 0, responseTime = 0;
var startBtn, introScrn, container, choice1, choice2, choice3, choice4, question, circleOutline, circle1Outline, boardMc, helpMc, quesMarkMc, questionText, quesHolderMc, chHolderMc, resultLoading, preloadMc;
var mc, mc1, mc2, mc3, mc4, mc5, startMc, questionInterval = 0;
var parrotWowMc, parrotOopsMc, parrotGameOverMc, parrotTimeOverMc, gameIntroAnimMc;
var bgSnd, correctSnd, wrongSnd, gameOverSnd, timeOverSnd, tickSnd;
var tqcnt = 0, aqcnt = 0, ccnt = 0, cqcnt = 0, gscore = 0, gscrper = 0, gtime = 0, rtime = 0, crtime = 0, wrtime = 0, currTime = 0;
var bg
var BetterLuck, Excellent, Nice, Good, Super, TryAgain;
var rst1 = 0, crst = 0, wrst = 0, score = 0, puzzle_cycle, timeOver_Status = 0;//for db //q
var isBgSound = true;
var isEffSound = true;

var url = "";
var nav = "";
var isResp = true;
var respDim = 'both'
var isScale = true
var scaleType = 1;

var lastW, lastH, lastS = 1;
var borderPadding = 10, barHeight = 20;
var loadProgressLabel, progresPrecentage, loaderWidth;
/////////////////////////////////////////////////////////////////////////GAME SPECIFIC VARIABLES//////////////////////////////////////////////////////////
var tween
var chpos = 0;
var question1, question2;
var currentX, currentY
///////////////////////////////////////////////////////////////////////GAME SPECIFIC ARRAY//////////////////////////////////////////////////////////////
var qno = [];
var choiceArr = [];
var position = [1, 2, 3, 4, 1, 2, 3, 4, 3, 2, 4, 1,
    1, 2, 3, 4, 1, 2, 3, 4, 3, 2, 4, 1,
    1, 2, 3, 4, 1, 2, 3, 4, 3, 2, 4, 1,
    1, 2, 3, 4, 1, 2, 3, 4, 3, 2, 4, 1, 2, 3]
var btnX = [, 123, 422, 717, 1015]
var tweenMcArr = [];
var choicePos = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
var choicePosArr = []
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
    stage.addChild(container)
    createjs.Ticker.addEventListener("tick", stage);
    callLoader();
    createLoader()
    createCanvasResize()

    stage.update();
    stage.enableMouseOver(40);
    ///////////////////////////////////////////////////////////////=========MANIFEST==========///////////////////////////////////////////////////////////////

    /*Always specify the following terms as given in manifest array. 
         1. choice image name as "ChoiceImages1.png"
         2. question text image name as "questiontext.png"
     */

    assetsPath = "assets/";
    gameAssetsPath = "FlipTrick-Level2/";
    soundpath = "FA/"

    var success = createManifest();
    if (success == 1) {
        manifest.push(
            { id: "questionText", src: questionTextPath + "FlipTrick-Level2-QT.png" },
            { id: "choice1", src: gameAssetsPath + "ChoiceImages1.png" },
            { id: "choice2", src: gameAssetsPath + "ChoiceImages2.png" },
            { id: "choice3", src: gameAssetsPath + "ChoiceImages3.png" },
            { id: "choice4", src: gameAssetsPath + "ChoiceImages4.png" },
            { id: "question", src: gameAssetsPath + "question.png" },
            { id: "chHolder", src: gameAssetsPath + "chHolder.png" },
            { id: "splitquestions", src: gameAssetsPath + "splitquestions.png" }
        )
        preloadAllAssets()
        stage.update();
    }
}

//=====================================================================//


function doneLoading1(event) {
    var event = assets[i];
    var id = event.item.id;
    console.log(" doneLoading ")
    loaderBar.visible = false;
    stage.update();

    if (id == "questionText") {
        questionText = new createjs.Bitmap(preload.getResult('questionText'));
        container.parent.addChild(questionText);
        questionText.visible = false;
    }
    if (id == "chHolder") {
        chHolderMc = new createjs.Bitmap(preload.getResult('chHolder'));
        container.parent.addChild(chHolderMc);
        chHolderMc.visible = false;
    }
    if (id == "choice1" || id == "choice2" || id == "choice3" || id == "choice4") {
        var spriteSheet1 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice1")],
            "frames": { "regX": 50, "height": 238, "count": 0, "regY": 50, "width": 238 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        choice1 = new createjs.Sprite(spriteSheet1);
        container.parent.addChild(choice1);
        choice1.visible = false;
        //
        var spriteSheet2 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice2")],
            "frames": { "regX": 50, "height": 238, "count": 0, "regY": 50, "width": 238 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        choice2 = new createjs.Sprite(spriteSheet2);
        container.parent.addChild(choice2);
        choice2.visible = false;

        var spriteSheet3 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice3")],
            "frames": { "regX": 50, "height": 236, "count": 0, "regY": 50, "width": 235 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        choice3 = new createjs.Sprite(spriteSheet3);
        container.parent.addChild(choice3);
        choice3.visible = false;
        //
        var spriteSheet4 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice4")],
            "frames": { "regX": 50, "height": 238, "count": 0, "regY": 50, "width": 238 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        choice4 = new createjs.Sprite(spriteSheet4);
        container.parent.addChild(choice4);
        choice4.visible = false;
    }
    if (id == "question") {
        var spriteSheet3 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("question")],
            "frames": { "regX": 50, "height": 216, "count": 0, "regY": 50, "width": 280 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        question = new createjs.Sprite(spriteSheet3);
        container.parent.addChild(question);
        question.visible = false;
    }

    if (id == "splitquestions") {
        var spriteSheet1 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("splitquestions")],
            "frames": { "regX": 50, "height": 238, "count": 0, "regY": 50, "width": 238 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        splitquestions = new createjs.Sprite(spriteSheet1);
        splitquestions.visible = false;
        container.parent.addChild(splitquestions);

    };

}

function tick(e) {

    stage.update();
}

/////////////////////////////////////////////////////////////////=======GAME START========///////////////////////////////////////////////////////////////////
function handleClick(e) {
    qno = between(0, 49)
    qno.splice(qno.indexOf(0), 1)
    console.log("1.qno = " + qno)
    qno.push(0)
    position.sort(randomSort)
    CreateGameStart()
    if (gameType == 0) {
        CreateGameElements()
        getStartQuestion();
    } else {
        //for db
        getdomainpath()
        //end
    }
}

function CreateGameElements() {
    interval = setInterval(countTime, 1000);
    container.parent.addChild(questionText);
    questionText.visible = false;
    questionText.y = -50
    questionText.x = 0
    container.parent.addChild(chHolderMc);
    chHolderMc.visible = false;
    chHolderMc.y = -100
    chHolderMc.x = 35;
    chHolderMc.scaleX = chHolderMc.scaleY = .95

    container.parent.addChild(choice1, choice2, choice3, choice4)
    for (i = 1; i <= choiceCnt; i++) {

        container.parent.addChild(this["choice" + i]);
        this["choice" + i].y = -470;
        this["choice" + i].visible = false
        this["choice" + i].x = btnX[i] - 10
        choicePosArr.push({ xpos: this["choice" + i].x, ypos: this["choice" + i].y })
    }

    container.parent.addChild(question)
    question.x = 655; question.y = 315
    question.regX = question.regY = 100
    question.visible = false
    question.scaleX = question.scaleY = .5


    console.log("isQuestionAllVariations= " + isQuestionAllVariations)

    qno.splice(35, 1)
}

function helpDisable() {
    for (i = 1; i <= choiceCnt; i++) {
        this["choice" + i].mouseEnabled = false;
    }
}

function helpEnable() {
    for (i = 1; i <= choiceCnt; i++) {
        this["choice" + i].mouseEnabled = true;
    }
}
//=================================================================================================================================//
function pickques() {
    pauseTimer()
    //for db
    tx = 0;
    qscnt++;
    //db
    cnt++;
    quesCnt++;
    chpos = [];
    chposArr = [];
    panelVisibleFn()
    question.gotoAndStop(qno[cnt]);
    for (i = 1; i <= choiceCnt; i++) {
        this["choice" + i].gotoAndStop(qno[cnt]);
        this["choice" + i].name = "ch" + i;
    }
    choicePosArr.sort(randomSort)

    for (i = 1; i <= choiceCnt; i++) {
        this["choice" + i].x = choicePosArr[i - 1].xpos;
        this["choice" + i].y = choicePosArr[i - 1].ypos;
        console.log(this["choice" + i].name)
    }


    ans = "ch1";

    createTween();

    createjs.Ticker.addEventListener("tick", tick);
    stage.update();

}

function createTween() {
    //////////////////////////////QuestionText////////////////////////////   
    questionText.visible = true
    questionText.alpha = 0;
    questionText.y = -50
    if( lang == "ArabicQuestionText/" ||lang == "TamilQuestionText/"){
        createjs.Tween.get(questionText).wait(200)
            .to({ y:0, alpha: .5 }, 100)
            .to({ y:0, alpha: 1 }, 100)
        }
        else{
          
            createjs.Tween.get(questionText).wait(200)
            .to({ y:-30, alpha: .5 }, 100)
            .to({ y:-30, alpha: 1 }, 100)
        }


    chHolderMc.visible = true
    chHolderMc.alpha = 0
    chHolderMc.y = -100
    chHolderMc.x = 35;
    createjs.Tween.get(chHolderMc).wait(400).to({ y: 35, scaleX: .95, scaleY: .95, alpha: 1 }, 500)

    question.visible = true;
    question.alpha = 0

    createjs.Tween.get(question).wait(1000).to({ x: 655, scaleX: .5, scaleY: .5, alpha: 1 }, 200)
        .to({ scaleX: .95, scaleY: .95, alpha: .95 }, 200)
        .to({ scaleX: .5, scaleY: .5, alpha: 1 }, 200)
        .to({ scaleX: .95, scaleY: .95, alpha: 1 }, 200)
    ///////////////////////////choice tween////////////////////////////////////
    for (i = 1; i <= choiceCnt; i++) {

        this["choice" + i].visible = true;
        this["choice" + i].alpha = 1;
        this["choice" + i].y = -500
        createjs.Tween.get(this["choice" + i]).wait(1800)
            .to({ y: 475, rotation: 270, visible: true, alpha: 1, scaleX: .5, scaleY: .5 }, 500, createjs.Ease.bounceInOut)
            .to({ y: 475, rotation: 360, visible: true, alpha: 1, scaleX: 1.2, scaleY: 1.2 }, 500, createjs.Ease.bounceInOut)

    }
    //////////////////////////////////////////////////////////////////    
    repTimeClearInterval = setTimeout(AddListenerFn, 2500)
}

function AddListenerFn() {

    clearTimeout(repTimeClearInterval)
    console.log("eventlisterneer")
    for (i = 1; i <= choiceCnt; i++) {
        this["choice" + i].addEventListener("click", answerSelected);
        this["choice" + i].mouseEnabled = true
        this["choice" + i].visible = true;
        this["choice" + i].alpha = 1;
        this["choice" + i].cursor = "pointer";

    }
    rst = 0;
    gameResponseTimerStart();
    restartTimer()
}


function disablechoices() {
    for (i = 1; i <= choiceCnt; i++) {
        this["choice" + i].removeEventListener("click", answerSelected);
        this["choice" + i].visible = false;
        this["choice" + i].alpha = .5;
        this["choice" + i].mouseEnabled = false
    }
    question.visible = false


}

function onRoll_over(e) {
    e.currentTarget.alpha = .5;
    stage.update();
}

function onRoll_out(e) {
    e.currentTarget.alpha = 1;
    stage.update();
}

function answerSelected(e) {
    e.preventDefault();
    uans = e.currentTarget.name;

    gameResponseTimerStop();
    // pauseTimer();
    console.log(ans + " =correct= " + uans)
    if (ans == uans) {

        e.currentTarget.visible = true;
        disableMouse()

        correct()

    } else {
        getValidation("wrong");
        disablechoices();
    }
}

function correct() {
    getValidation("correct");
    disablechoices();
}


function disableMouse() {
    for (i = 1; i <= choiceCnt; i++) {
        this["choice" + i].mouseEnabled = false
    }
}

function enableMouse() {

}

//===========================================================================================//
