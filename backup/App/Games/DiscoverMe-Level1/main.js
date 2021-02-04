///////////////////////////////////////////////////-------Common variables--------------/////////////////////////////////////////////////////////////////////
var messageField;		//Message display field
var assets = [];
var cnt = -1, qscnt = -1, ans, uans, interval, time = 180, totalQuestions = 10, answeredQuestions = 0, choiceCnt = 2, quesCnt = 0, resTimerOut = 0, rst = 0, responseTime = 0;
var startBtn, introScrn, container, choice1, choice2, choice3, choice4, question, circleOutline, circle1Outline, boardMc, helpMc, quesMarkMc, questionText, quesHolderMc, resultLoading, preloadMc;
var mc, mc1, mc2, mc3, mc4, mc5, startMc, questionInterval = 0;
var parrotWowMc, parrotOopsMc, parrotGameOverMc, parrotTimeOverMc, gameIntroAnimMc;
var bgSnd, correctSnd, wrongSnd, gameOverSnd, timeOverSnd, tickSnd;
var tqcnt = 0, aqcnt = 0, ccnt = 0, cqcnt = 0, gscore = 0, gscrper = 0, gtime = 0, rtime = 0, crtime = 0, wrtime = 0, currTime = 0;
var bg
var BetterLuck, Excellent, Nice, Good, Super, TryAgain;
var rst1 = 0, crst = 0, wrst = 0, score = 0, puzzle_cycle, timeOver_Status = 0;
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

var qno = [];
var chpos = [];
var position = [1, 2, 2, 1, 1, 1, 2, 2, 1, 2, 1, 2, 2, 1, 1, 1, 2, 2, 1, 2, 1, 2, 2, 1, 1, 1, 2, 2, 1, 2]
/////////////////////////////////////////////////////////////////////////GAME SPECIFIC VARIABLES//////////////////////////////////////////////////////////
var chpos = 0;
var aaa
var currentX, currentY
///////////////////////////////////////////////////////////////////////GAME SPECIFIC ARRAY//////////////////////////////////////////////////////////////
var qno = [];
var choiceArr = [];

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
    gameAssetsPath = "DiscoverMe-Level1/";
    gameSoundPath = "KinderAudio/"
    soundpath = "FA/"

    var success = createManifest();
    if (success == 1) {
        manifest.push(
            { id: "choice1", src: gameAssetsPath + "ChoiceImages1.png" },
            { id: "choice2", src: gameAssetsPath + "ChoiceImages2.png" },
            { id: "question", src: gameAssetsPath + "question.png" },
            { id: "questionText", src: questionTextPath + "DiscoverMe-Level1-QT.png" },
            { id: "qhHolder", src: gameAssetsPath + "qhHolder.png" },
            { id: "chHolder", src: gameAssetsPath + "chHolder.png" }
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
    if (id == "qhHolder") {
        qhHolderMc = new createjs.Bitmap(preload.getResult('qhHolder'));
        container.parent.addChild(qhHolderMc);
        qhHolderMc.visible = false;
    }
    if (id == "chHolder") {
        chHolderMc = new createjs.Bitmap(preload.getResult('chHolder'));
        container.parent.addChild(chHolderMc);
        chHolderMc.visible = false;
    }
    if (id == "choice1" || id == "choice2") {
        var spriteSheet1 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice1")],
            "frames": { "regX": 50, "height": 418, "count": 0, "regY": 50, "width": 418 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        //
        choice1 = new createjs.Sprite(spriteSheet1);
        container.parent.addChild(choice1);
        choice1.visible = false;
        //
        var spriteSheet2 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice2")],
            "frames": { "regX": 50, "height": 418, "count": 0, "regY": 50, "width": 418 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        //
        choice2 = new createjs.Sprite(spriteSheet2);
        container.parent.addChild(choice2);
        choice2.visible = false;

    }
    if (id == "question") {
        var spriteSheet3 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("question")],
            "frames": { "regX": 50, "height": 377, "count": 0, "regY": 50, "width": 541 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        //
        question = new createjs.Sprite(spriteSheet3);
        container.parent.addChild(question);
        question.visible = false;
    }
}

function tick(e) {

    stage.update();
}

/////////////////////////////////////////////////////////////////=======GAME START========///////////////////////////////////////////////////////////////////

function handleClick(e) {
    qno = between(0, 9);
    qno.sort(randomSort)
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
    container.parent.addChild(chHolderMc);
    chHolderMc.visible = false;
    container.parent.addChild(qhHolderMc);
    qhHolderMc.visible = false;
    container.parent.addChild(choice1, choice2);
    choice1.visible = choice2.visible = true;


    for (i = 1; i <= choiceCnt; i++) {
        this["choice" + i].y = 520
        this["choice" + i].visible = false
        this["choice" + i].scaleX = this["choice" + i].scaleY = .5

    }
    question.scaleX = question.scaleY = .8
    container.parent.addChild(question)
    question.x = 470; question.y = 210;
    qno = between(0, 9);
    question.visible = false
    position.sort(randomSort)


}
//==============================================================HELP ENABLE/DISABLE===================================================================//

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
    cnt++;
    quesCnt++;
    chpos = [];
    panelVisibleFn();
    question.gotoAndStop(qno[cnt]);
    for (i = 1; i <= choiceCnt; i++) {
        this["choice" + i].gotoAndStop(qno[cnt]);
        this["choice" + i].name = i
    }

    if (position[cnt] == 1) {
        choice1.x = 285
        choice2.x = 835


    } else {
        choice1.x = 835
        choice2.x = 285

    }
    ans = 1;



    createTween();
    createjs.Ticker.addEventListener("tick", tick);
    stage.update();
}

function createTween() {
    //////////////////////////////QuestionText////////////////////////////    
    questionText.visible = true
    questionText.alpha = 0;
    questionText.y = -200
    createjs.Tween.get(questionText).wait(200)
        .to({ alpha: 1, x: 0, y: 0 }, 500)

    chHolderMc.visible = true;
    chHolderMc.alpha = 0
    chHolderMc.x = -1000
    createjs.Tween.get(chHolderMc).wait(700)
        .to({ x: 0, alpha: 1 }, 500, createjs.Ease.bounceOut)

    qhHolderMc.visible = true;
    qhHolderMc.alpha = 0
    qhHolderMc.x = -1000
    createjs.Tween.get(qhHolderMc).wait(700)
        .to({ x: 0, alpha: 1 }, 500, createjs.Ease.bounceOut)

    question.y = -240
    question.visible = true;
    question.alpha = 0
    createjs.Tween.get(question).wait(1200)
        .to({ y: 210, alpha: 1 }, 500, createjs.Ease.bounceOut)
    var val = 1700
    for (i = 1; i <= choiceCnt; i++) {
        this["choice" + i].visible = true;
        this["choice" + i].alpha = 0
        this["choice" + i].y = -570
        if (i == 2) {
            createjs.Tween.get(this["choice" + i]).wait(val)
                .to({ y: 520, rotation: 180, scaleX: .5, scaleY: .5, alpha: .5 }, 250)
                .to({ rotation: 360, scaleX: .5, scaleY: .5, alpha: 1 }, 500).wait(200)
        }
        else {
            createjs.Tween.get(this["choice" + i]).wait(val)
                .to({ y: 520, rotation: 180, scaleX: .5, scaleY: .5, alpha: .5 }, 250)
                .to({ rotation: 360, scaleX: .5, scaleY: .5, alpha: 1 }, 500).wait(200)
        }
        val = val + 100;
    }


    //////////////////////////////////////////////////////////////////    
    repTimeClearInterval = setTimeout(AddListenerFn, 2500)
}
function AddListenerFn() {
    clearTimeout(repTimeClearInterval)
    console.log("eventlisterneer")
    for (i = 1; i <= choiceCnt; i++) {
        this["choice" + i].addEventListener("click", answerSelected);
        this["choice" + i].mouseEnabled = true;
        this["choice" + i].visible = true;
        this["choice" + i].cursor = "pointer";
        this["choice" + i].alpha = 1;
    }
    question.visible = true
    rst = 0;
    gameResponseTimerStart();
    restartTimer()
}

function disablechoices() {
    for (i = 1; i <= choiceCnt; i++) {
        this["choice" + i].removeEventListener("click", answerSelected);
        this["choice" + i].visible = false;
        this["choice" + i].alpha = .5;

    }
    question.visible = false
}
function answerSelected(e) {
    e.preventDefault();
    uans = e.currentTarget.name;
    gameResponseTimerStop();
    if (ans == uans) {
        for (i = 1; i <= choiceCnt; i++) {
            this["choice" + i].mouseEnabled = false;
        }
        e.currentTarget.removeEventListener("click", answerSelected)
        setTimeout(correct, 800)
    } else {
        getValidation("wrong");
        disablechoices();
    }
}
function correct() {
    getValidation("correct");
    disablechoices();
}
