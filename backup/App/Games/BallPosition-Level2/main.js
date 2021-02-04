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
var ans1, ans2, ans,introImg;
var count = 0;
///////////////////////////////////////////////////////////////////////GAME SPECIFIC ARRAY//////////////////////////////////////////////////////////////
var qno = [];
var choiceArr = []
var chpos = [];
var btnX = [446, 603, 604, 604, 761];
var btnY = [394, 398, 220, 567, 394];
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
    gameAssetsPath = "BallPosition-Level2/";
    soundpath = "FA/"

    var success = createManifest();
    if (success == 1) {
        manifest.push(
            { id: "questionText", src: questionTextPath + "BallPosition-Level2-QT.png" },
            { id: "questionText1", src: questionTextPath + "BallPosition-Level2-QT1.png" },
            { id: "choice", src: gameAssetsPath + "ChoiceImages1.png" },
            { id: "chHolder", src: gameAssetsPath + "chHolder.png" },
            { id: "introImg", src: gameAssetsPath + "introImg.png" }
        )
        preloadAllAssets()
        stage.update();
    }
}
//=====================================================================//

function doneLoading1(event) {

    var event = assets[i];
    var id = event.item.id;
    loaderBar.visible = false;
    stage.update();

    if (id == "introImg") {

        introImg = new createjs.Bitmap(preload.getResult('introImg'));
        container.parent.addChild(introImg);
        introImg.visible = false;
    }


    if (id == "chHolder") {
        chHolder = new createjs.Bitmap(preload.getResult('chHolder'));
        container.parent.addChild(chHolder);
        chHolder.visible = false;
    }
    if (id == "questionText") {
        questionText = new createjs.Bitmap(preload.getResult("questionText"));
        container.parent.addChild(questionText);
        questionText.visible = false;
    }

    if (id == "questionText1") {
        questionText1 = new createjs.Bitmap(preload.getResult("questionText1"));
        container.parent.addChild(questionText1);
        questionText1.visible = false;
    }
    if (id == "choice") {
        var spriteSheet5 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice")],
            "frames": { "regX": 50, "height": 186, "count": 0, "regY": 50, "width": 186 },
        });
        choice = new createjs.Sprite(spriteSheet5);
        choice.visible = false;
        container.parent.addChild(choice);
    }

}


function tick(e) {
    stage.update();
}
/////////////////////////////////////////////////////////////////=======GAME START========///////////////////////////////////////////////////////////////////
function handleClick(e) {
    qno = between(0, 50);
    // //toggleFullScreen()
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

    container.parent.addChild(questionText);
    questionText.visible = false;
    container.parent.addChild(questionText1);
    questionText1.visible = false;


    container.parent.addChild(chHolder);
    chHolder.visible = false;


    for (i = 0; i < 5; i++) {
        choiceArr[i] = choice.clone();
        container.parent.addChild(choiceArr[i]);
        choiceArr[i].visible = false;
        choiceArr[i].scaleX = choiceArr[i].scaleY = .86;
        choiceArr[i].x = btnX[i];
        choiceArr[i].y = btnY[i];

    }

    // if (isQuestionAllVariations) {
    //     createGameWiseQuestions();
    //     pickques();
    // } else {
    //     pickques();
    // }
}

function helpDisable() {
    for (i = 0; i < 5; i++) {
        choiceArr[i].mouseEnabled = true;

    }
}
function helpEnable() {
    for (i = 0; i < 5; i++) {
        choiceArr[i].mouseEnabled = false;

    }


}
//=================================================================================================================================//
function pickques() {

    pauseTimer();
    //for db
    tx = 0;
    qscnt++;
    //db
    cnt++;
    quesCnt++;
    chpos = [];
    currentObj = [];
    count = 0;
    panelVisibleFn();

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    qno1 = between(0, 8);

    for (i = 0; i < 5; i++) {
        choiceArr[i].gotoAndStop(qno1[i]);
        choiceArr[i].alpha=1;
    }
    createTween();
}

function createTween() {
    questionText.visible = true;
    questionText.alpha = 0
    createjs.Tween.get(questionText).wait(100).to({ alpha: 1 }, 200);

    chHolder.y = -500;
    chHolder.visible = true;
    createjs.Tween.get(chHolder).wait(200).to({ y: 0 }, 600, createjs.Ease.bounceOut);

    var tempVal = 300;
    for (i = 0; i < 5; i++) {
        createjs.Tween.get(choiceArr[i]).wait(tempVal).to({ visible: true }, 600, createjs.Ease.bounceOut);
        tempVal += 50;
    }
    repTimeClearInterval = setTimeout(AddListenerFn, 3000);
}

function AddListenerFn() {

    clearTimeout(repTimeClearInterval);

    questionText.visible = false;
    questionText1.visible = true;
    questionText1.alpha = 0
    createjs.Tween.get(questionText1).wait(100).to({ alpha: 1 }, 200);

    var rand = []
    rand = between(0, 4)
    console.log(rand + "counting palce");
    for (i = 0; i < 5; i++) {
        choiceArr[i].gotoAndStop(qno1[i])
        choiceArr[rand[0]].gotoAndStop(qno1[rand[1]])
        choiceArr[rand[1]].gotoAndStop(qno1[rand[0]])
        choiceArr[rand[2]].gotoAndStop(qno1[rand[3]])
        choiceArr[rand[3]].gotoAndStop(qno1[rand[2]])
        choiceArr[rand[4]].gotoAndStop(qno1[rand[4]])
        choiceArr[i].name = i
    }
    ans1 = rand[4];



    for (i = 0; i < 5; i++) {
        choiceArr[i].cursor = "pointer";
        choiceArr[i].addEventListener("click", answerSelected);
        choiceArr[i].visible = true;
        choiceArr[i].alpha = 1;
        choiceArr[i].mouseEnabled = true
        choiceArr[i].mouseEnabled = true;
    }

    rst = 0;
    gameResponseTimerStart();
    restartTimer();

}


function disablechoices() {
    for (i = 0; i < 5; i++) {
        choiceArr[i].removeEventListener("click", answerSelected);
        choiceArr[i].visible = false;
        choiceArr[i].cursor = "default";
        choiceArr[i].mouseEnabled = false
    }

    questionText.visible = false;
    questionText1.visible = false;
}

function answerSelected(e) {
    e.preventDefault();
    e.currentTarget.removeEventListener("click", answerSelected);
    e.currentTarget.alpha = .3
    e.currentTarget.mouseEnabled = false;


    uans = e.currentTarget.name;
    gameResponseTimerStop();

    console.log(ans + " =correct= " + uans)

    if (ans1 == uans) {

        for (i = 0; i < 5; i++) {
            e.currentTarget.alpha = .3
            choiceArr[i].mouseEnabled = false
        }
        e.currentTarget.removeEventListener("click", answerSelected)
        getValidation("correct");

    } else {
       
        getValidation("wrong");
      
    }
    disablechoices();
}




