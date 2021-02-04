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

////////////////////////////////////////////////////==========GAME SPECIFIC VARIABLES============/////////////////////////////////////////////////////////////
var question, questionText, chHolder;
var uans1, uans2;
var rotationImage, qhHolder, choice1, choice2, choice3, clue;
//////////////////////////////////////////////////////==========GAME SPECIFIC ARRAYS============/////////////////////////////////////////////////////////////
var qno = [];
var rand, rand1, rand2;
var ans;
var choiceArr1 = [];
var questionArr = [];
var mc = [];
//register key functions
/////////////////////////////////////////////////////////=========BROWSER SUPPORT============////////////////////////////////////////////////////////////////
window.onload = function (e) {
    checkBrowserSupport();
};
//////////////////////////////////////////////////////////=========INITIALIZATION=============///////////////////////////////////////////////////////////////
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
    /*Always specify the following terms as given in manifest array. 
      1. choice image name as "ChoiceImages1.png"
      2. question text image name as "questionText.png"
      */
    assetsPath = "assets/";
    gameAssetsPath = "AreWeSame/";
    soundpath = "VP/";
    var success = createManifest();
    if (success == 1) {
        manifest.push(
            { id: "chHolder", src: gameAssetsPath + "chHolder.png" },
            { id: "questionText", src: questionTextPath + "AreWeSame-QT.png" },
            { id: "choice1", src: gameAssetsPath + "ChoiceImages1.png" },
            { id: "questionImage", src: gameAssetsPath + "question.png" }
        );
        preloadAllAssets();
        stage.update();
    }
}
////////////////////////////////////////////////////////////==========PRELOADER===========/////////////////////////////////////////////////////////////////
function doneLoading1(event) {
    var event = assets[i];
    var id = event.item.id;
    if (id == "chHolder") {
        chHolder = new createjs.Bitmap(preload.getResult("chHolder"));
        container.parent.addChild(chHolder);
        chHolder.visible = false;
    }

    if (id == "questionText") {
        questionText = new createjs.Bitmap(preload.getResult("questionText"));
        container.parent.addChild(questionText);
        questionText.visible = false;
    }

    if (id == "choice1") {
        var choiceSpriteSheet = new createjs.SpriteSheet({
            framerate: 30,
            images: [preload.getResult("choice1")],
            frames: { regX: 50, height: 134, count: 0, regY: 50, width: 272 }
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        choice1 = new createjs.Sprite(choiceSpriteSheet);
        container.parent.addChild(choice1);
        choice1.visible = false;
    }

    if (id == "questionImage") {
        var choiceSpriteSheet = new createjs.SpriteSheet({
            framerate: 30,
            images: [preload.getResult("questionImage")],
            frames: { regX: 50, height: 273, count: 0, regY: 50, width: 254 }
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        questionImage = new createjs.Sprite(choiceSpriteSheet);
        container.parent.addChild(questionImage);
        questionImage.visible = false;
    }
}

function tick(e) {
    stage.update();
}
/////////////////////////////////////////////////////////////////=======GAME START========///////////////////////////////////////////////////////////////////
function handleClick(e) {
    qno = between(0, 19);
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
////////////////////////////////////////////////////////////=========GAME ELEMENTS CREATION===========//////////////////////////////////////////////////////
function CreateGameElements() {

    interval = setInterval(countTime, 1000);
    
    container.parent.addChild(chHolder);
    chHolder.visible = false;

    for (i = 0; i < 2; i++) {
        questionArr[i] = questionImage.clone();
        container.parent.addChild(questionArr[i]);
        questionArr[i].x = 285 + i * 550;
        questionArr[i].y = 265;
        questionArr[i].visible = false;
    }

    container.parent.addChild(questionText);
    questionText.visible = false;
    questionText.y = questionText + 20;

    for (i = 0; i < 2; i++) {
        choiceArr1[i] = choice1.clone();
        container.parent.addChild(choiceArr1[i]);
        choiceArr1[i].x = 400 + i * 300;
        choiceArr1[i].y = 610;
        choiceArr1[i].visible = false;
        choiceArr1[i].gotoAndStop(i);
        choiceArr1[i].name = i;
    }

    choiceArr1[0].x = 825;
    choiceArr1[0].name = "y";
    choiceArr1[1].x = 285;
    choiceArr1[1].name = "n";

    if (isQuestionAllVariations) {
        // createGameWiseQuestions();
        posArr = [0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1];
        posArr.sort(randomSort);
        // createGameWiseQuestions();
        // pickques();
    } else {
        posArr = [0, 1, 0, 1, 1];
        posArr.sort(randomSort);
        // pickques();
    }


}
/////////////////////////////////////////////////////////=======HELP POP-UP CONTROL=======//////////////////////////////////////////////////////////////
function helpDisable() {
    for (i = 0; i < 2; i++) {
        choiceArr1[i].mouseEnabled = false;
    }
}

function helpEnable() {
    for (i = 0; i < 2; i++) {
        choiceArr1[i].mouseEnabled = true;
    }
}
//////////////////////////////////////////////////////////===========GAME LOGIC============///////////////////////////////////////////////////////////////
function pickques() {
    //======================================================RESET VARIABLES=====================================================================

    pauseTimer();
    //for db
    tx = 0;
    qscnt++;
    //db
    cnt++;
    quesCnt++;

    panelVisibleFn();
    //===========================================================LOGIC AREA============================================================================


    for (i = 0; i < 2; i++) {
        questionArr[i].visible = false;
    }

    if (posArr[cnt] == 1) {
        questionArr[1].gotoAndStop(qno[cnt]);
        questionArr[0].gotoAndStop(qno[cnt]);
        ans = "y";
    } else {
        questionArr[1].gotoAndStop(qno[cnt]);
        if (qno[cnt] == "19") {
            questionArr[0].gotoAndStop(qno[cnt] - 3);
        } else {
            questionArr[0].gotoAndStop(qno[cnt] + 1);
        }
        ans = "n";
    }

    //=========================================================================================================================================================
    createTween();
}


function createTween() {
    questionText.visible = true;
    questionText.alpha = 0
    createjs.Tween.get(questionText).wait(100).to({ alpha: 1 }, 200);

    createjs.Tween.get(chHolder).wait(200).to({ visible: true }, 600, createjs.Ease.bounceOut);

    var tempVal = 300;
    for (i = 0; i < 2; i++) {
        createjs.Tween.get(questionArr[i]).wait(tempVal).to({ visible: true }, 600, createjs.Ease.bounceOut);
        tempVal += 50;
    }
    repTimeClearInterval = setTimeout(AddListenerFn, 1200)
}
/////////////////////////////////////////////////////////========CHOICES ENABLE/DISABLE=======////////////////////////////////////////////////////////////

function AddListenerFn() {
    clearTimeout(repTimeClearInterval);
    for (i = 0; i < 2; i++) {
        choiceArr1[i].addEventListener("click", answerSelected);
        choiceArr1[i].cursor = "pointer";
        choiceArr1[i].alpha = 1;
        choiceArr1[i].gotoAndStop(i);
        choiceArr1[i].visible = true;
        choiceArr1[i].mouseEnabled = true;
    }
    rst = 0;
    gameResponseTimerStart();
    restartTimer();
}


function disablechoices() {
    chHolder.visible = false;
    for (i = 0; i < 2; i++) {
        choiceArr1[i].removeEventListener("click", answerSelected);
        choiceArr1[i].cursor = "default";
        choiceArr1[i].mouseEnabled = false;
        choiceArr1[i].visible = false;
        choiceArr1[i].alpha = 0;
        questionArr[i].visible = false;

    }
    stage.update();
}
///////////////////////////////////////////////////////////========ANSWER VALIDATION========//////////////////////////////////////////////////////////////////

function answerSelected(e) {
    e.preventDefault();
    uans = e.currentTarget.name;
    gameResponseTimerStop();
    // pauseTimer();
    console.log(ans + " =correct= " + uans);

    if (ans == uans) {
        e.currentTarget.alpha = 0.5;
        for (i = 0; i < 2; i++) {
            choiceArr1[i].mouseEnabled = false;
        }

        e.currentTarget.removeEventListener("click", answerSelected);
        getValidation("correct");
    } else {

        getValidation("wrong");

    }
    disablechoices();
}

