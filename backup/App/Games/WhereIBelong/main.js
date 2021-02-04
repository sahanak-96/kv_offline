// //////////////////////////////////////////////////////===========COMMON GAME VARIABLES==========/////////////////////////////////////////////////////////////
var messageField; //Message display field
var assets = [];
var cnt = -1, qscnt = -1, ans, uans, interval, time = 180, totalQuestions = 10, answeredQuestions = 0, choiceCnt = 3, quesCnt = 0, resTimerOut = 0, rst = 0, responseTime = 0; var startBtn, introScrn, container, choice1, choice2, choice3, choice4, question, circleOutline, circle1Outline, boardMc, helpMc, quesMarkMc, questionText, quesHolderMc, resultLoading, preloadMc, introHintImg;
var mc, mc1, mc2, mc3, mc4, mc5, startMc, questionInterval = 0;
var parrotWowMc, parrotOopsMc, parrotGameOverMc, parrotTimeOverMc, gameIntroAnimMc;
var bgSnd, correctSnd, wrongSnd, gameOverSnd, timeOverSnd, tickSnd;
var tqcnt = 0, aqcnt = 0, ccnt = 0, cqcnt = 0, gscore = 0, gscrper = 0, gtime = 0, rtime = 0, crtime = 0, wrtime = 0, currTime = 0;
var bg;
var BetterLuck, Excellent, Nice, Good, Super, TryAgain;
var rst1 = 0, crst = 0, wrst = 0, score = 0, puzzle_cycle, timeOver_Status = 0; //for db //q
var isBgSound = true;
var isEffSound = true;
var url = "";
var nav = "";
var isResp = true;
var respDim = "both";
var isScale = true;
var scaleType = 1;
var lastW, lastH, lastS = 1;
var borderPadding = 10, barHeight = 20;
var loadProgressLabel, progresPrecentage, loaderWidth;

/////////////////////////////////////////////////////////////////////////GAME SPECIFIC VARIABLES//////////////////////////////////////////////////////////
var currentX;
var currentY,introImg;
///////////////////////////////////////////////////////////////////////GAME SPECIFIC ARRAY//////////////////////////////////////////////////////////////
//var qno = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
var qno = []
var qno1 = []
var choiceArr = []
var quesArr = []
var currentObj = []
var chpos = [];
var atype = [1, 0, 0, 1, 1, 0, 0, 1, 1, 0]
var atype = [1, 0, 0, 1, 1]
var btnX = []
var btnY = []
var posx = []
var posy = []
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
    gameAssetsPath = "WhereIBelong/";
    soundpath = "FA/"

    var success = createManifest();
    if (success == 1) {
        manifest.push(
            { id: "choice1", src: gameAssetsPath + "ChoiceImages1.png" },
            { id: "choice2", src: gameAssetsPath + "ChoiceImages2.png" },
            { id: "choice3", src: gameAssetsPath + "ChoiceImages3.png" },
            { id: "question", src: gameAssetsPath + "question.png" },
            { id: "questionText", src: questionTextPath + "WhereIBelong-QT.png" },
            { id: "chHolder", src: gameAssetsPath + "chHolder.png" },
            { id: "introImg", src: gameAssetsPath + "introImg.png" }
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

    if (id == "introImg") {
        introImg = new createjs.Bitmap(preload.getResult('introImg'));
        container.parent.addChild(introImg);
        introImg.visible = false;
    }

    if (id == "questionText") {
        questionText = new createjs.Bitmap(preload.getResult('questionText'));
        container.parent.addChild(questionText);
        questionText.visible = false;
    }

    if (id == "chHolder") {
        chHolder = new createjs.Bitmap(preload.getResult('chHolder'));
        container.parent.addChild(chHolder);
        chHolder.visible = false;
    }
    if (id == "choice1") {
        choice1 = new createjs.Bitmap(preload.getResult('choice1'));
        container.parent.addChild(choice1);
        choice1.visible = false;
    }
    if (id == "choice2") {
        choice2 = new createjs.Bitmap(preload.getResult('choice2'));
        container.parent.addChild(choice2);
        choice2.visible = false;
    }
    if (id == "choice3") {
        choice3 = new createjs.Bitmap(preload.getResult('choice3'));
        container.parent.addChild(choice3);
        choice3.visible = false;
    }


    if (id == "question") {
        var spriteSheet1 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("question")],
            "frames": { "regX": 50, "height": 228, "count": 0, "regY": 50, "width": 463 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):

        });
        question = new createjs.Sprite(spriteSheet1);
        question.visible = false;
        container.parent.addChild(question);
    };



}

function tick(e) {
    stage.update();
}
/////////////////////////////////////////////////////////////////=======HANDLE CLICK========///////////////////////////////////////////////////////////////////
function handleClick(e) {

    qno = between(0, 28);
    atype.sort(randomSort);
    ////toggleFullScreen()
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
////////////////////////////////////////////////////////////=======CREATION OF GAME ELEMENTS========///////////////////////////////////////////////////////////////////
function CreateGameElements() {
    interval = setInterval(countTime, 1000);

    container.parent.addChild(questionText);
    questionText.visible = false;

    container.parent.addChild(chHolder);
    chHolder.visible = false;

    container.parent.addChild(question);
    question.visible = false;
    question.x = 420
    question.y = 200
    question.scaleX = question.scaleY = 1.2

    if (isQuestionAllVariations) {
        posArr = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3];
        posArr.sort(randomSort);
        // createGameWiseQuestions()
        // pickques()

    } else {
        posArr = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1];
        posArr.sort(randomSort);
        // pickques()
    }
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
//==================================================================PICKQUES==========================================================================//
function pickques() {

    pauseTimer();
    //for db
    tx = 0;
    qscnt++;
    //db
    cnt++;
    quesCnt++;
    pos = [];
    attemptCnt = 0;
    currentObj = [];
    panelVisibleFn();
    //=================================================================================================================================//

    // /rand = range(0, 28)
    question.visible = false;
    question.gotoAndStop(qno[cnt]);

    btnX = [, 80, 485, 900]
    btnY = [, 420, 420, 420]
    for (i = 1; i <= choiceCnt; i++) {
        container.parent.addChild(this["choice" + i])
        this["choice" + i].visible = false;
        this["choice" + i].x = btnX[i];
        this["choice" + i].y = btnY[i];
        this["choice" + i].name = i;
        chpos.push({ posx: this["choice" + i].x, posy: this["choice" + i].y })

    }

    if (qno[cnt] < 10) {
        ans = 1;
    } else if (qno[cnt] < 20) {
        ans = 3;
    } else {
        ans = 2;
    }

    if (posArr[cnt] == 1) {
        pos.push(0, 1, 2)
    } else if (posArr[cnt] == 2) {
        pos.push(2, 1, 0)
    }
    else {
        pos.push(1, 2, 0)
    }
    var vCnt = 1
    for (i = 0; i < 3; i++) {
        this["choice" + vCnt].x = chpos[pos[i]].posx;
        this["choice" + vCnt].y = chpos[pos[i]].posy;
        vCnt++;
    };

    createTween();
}

function createTween() {
    questionText.visible = true;
    questionText.y = -500;
    createjs.Tween.get(questionText).wait(100).to({ y: 0 }, 200);

    question.visible = true;
    question.alpha = 0;
    createjs.Tween.get(question).wait(200).to({ alpha: 1 }, 300, createjs.Ease.bounceOut);

    createjs.Tween.get(chHolder).wait(300).to({ visible: true }, 300, createjs.Ease.bounceOut);

    var tempVal = 400
    for (i = 1; i <= choiceCnt; i++)  {
        this["choice" + i].visible = true;
        this["choice" + i].y = 800;
        createjs.Tween.get(this["choice" + i]).wait(tempVal)
            .to({ y: 420 }, 200);
        tempVal += 100;
    }

    repTimeClearInterval = setTimeout(AddListenerFn, 1200)
}


function AddListenerFn() {
    clearTimeout(repTimeClearInterval);
    for (i = 1; i <= choiceCnt; i++) {
        this["choice" + i].visible = true;
        this["choice" + i].alpha = 1;
        this["choice" + i].addEventListener("click", answerSelected);
        this["choice" + i].cursor = "pointer";
        this["choice" + i].mouseEnabled = true;
    }

    rst = 0;
    gameResponseTimerStart();
    restartTimer()
}
//====================================================================CHOICE ENABLE/DISABLE==============================================================//
function enablechoices() {


}

function disablechoices() {
    for (i = 1; i <= choiceCnt; i++) {
        this["choice" + i].removeEventListener("click", answerSelected)
    }

}

//=================================================================ANSWER SELECTION=======================================================================//
function answerSelected(e) {

    e.preventDefault();
    uans = e.currentTarget.name;
    console.log(ans + " =correct= " + uans)
    gameResponseTimerStop();
    //  pauseTimer();

    console.log(ans)
    if (ans == uans) {

        e.currentTarget.removeEventListener("click", answerSelected)
        for (i = 1; i <= choiceCnt; i++) {
            this["choice" + i].mouseEnabled = false;
        }

        getValidation("correct");

    } else {

        getValidation("wrong");
        disablechoices();
    }

}


function correct() {
    getValidation("correct");
    answer.visible = false
    disablechoices();
}

