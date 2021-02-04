

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
var answer1, answer2;
///////////////////////////////////////////////////////////////////////GAME SPECIFIC ARRAY//////////////////////////////////////////////////////////////
var qno = [];
var qno1 = [];
var qno2 = [];
var chpos = [];
var choiceArr = []
var posArr = []
var attemptCnt
var ansMc = []
var posx = [];
var posY = [];
var pX = []; var pY = [];
//register; key functions
var questionArr = [];
var btnX1 = [];
var btnY1 = [];
var btnX = [];
var btnY = [];
var quesVal = [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2]
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
    gameAssetsPath = "DragTheShapes-Level3/";
    soundpath = "FA/"

    var success = createManifest();
    if (success == 1) {
        manifest.push(
            { id: "choice1", src: gameAssetsPath + "ChoiceImages1.png" },
            { id: "choice2", src: gameAssetsPath + "ChoiceImages2.png" },
            { id: "choice3", src: gameAssetsPath + "ChoiceImages3.png" },
            { id: "question1", src: gameAssetsPath + "question1.png" },
            { id: "question2", src: gameAssetsPath + "question2.png" },
            { id: "answer1", src: gameAssetsPath + "Answer.png" },
            // { id: "answer2", src: gameAssetsPath + "Answer2.png" },
            { id: "qHolder", src: gameAssetsPath + "Holder.png" },
            { id: "questionText", src: questionTextPath + "DragTheShapes-Level3-QT.png" }
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



    if (id == "questionText") {
        var spriteSheet1 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("questionText")],
            "frames": { "regX": 50, "height": 90, "count": 0, "regY": 50, "width": 570 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        //
        questionText = new createjs.Sprite(spriteSheet1);
        container.parent.addChild(questionText);
        questionText.visible = false;

    }

    if (id == "qHolder") {
        qHolder = new createjs.Bitmap(preload.getResult('qHolder'));
        container.parent.addChild(qHolder);
        qHolder.visible = false;
    }
    if (id == "choice1") {
        var spriteSheet1 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice1")],
            "frames": { "regX": 50, "height": 200, "count": 0, "regY": 50, "width": 200 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        //
        choice1 = new createjs.Sprite(spriteSheet1);
        container.parent.addChild(choice1);
        choice1.visible = false;

    }
    if (id == "choice2") {
        var spriteSheet2 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice2")],
            "frames": { "regX": 50, "height": 200, "count": 0, "regY": 50, "width": 200 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        //
        choice2 = new createjs.Sprite(spriteSheet2);
        container.parent.addChild(choice2);
        choice2.visible = false;

    }
    if (id == "choice3") {
        var spriteSheet2 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice3")],
            "frames": { "regX": 50, "height": 200, "count": 0, "regY": 50, "width": 200 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        //
        choice3 = new createjs.Sprite(spriteSheet2);
        container.parent.addChild(choice3);
        choice3.visible = false;

    }

    if (id == "question1") {
        var spriteSheet1 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("question1")],
            "frames": { "regX": 50, "height": 240, "count": 0, "regY": 50, "width": 230 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):

        });
        question1 = new createjs.Sprite(spriteSheet1);
        question1.visible = false;
        container.parent.addChild(question1);
    };

    if (id == "question2") {
        var spriteSheet3 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("question2")],
            "frames": { "regX": 50, "height": 240, "count": 0, "regY": 50, "width": 230 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):

        });
        question2 = new createjs.Sprite(spriteSheet3);
        question2.visible = false;
        container.parent.addChild(question2);
    };

    if (id == "answer1") {
        var spriteSheet1 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("answer1")],
            "frames": { "regX": 50, "height": 240, "count": 0, "regY": 50, "width": 230 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):

        });
        answer1 = new createjs.Sprite(spriteSheet1);
        answer1.visible = false;
        container.parent.addChild(answer1);
    };

    // if (id == "answer2") {
    //     var spriteSheet3 = new createjs.SpriteSheet({
    //         framerate: 30,
    //         "images": [preload.getResult("answer2")],
    //         "frames": { "regX": 50, "height": 240, "count": 0, "regY": 50, "width": 230 },
    //         // define two animations, run (loops, 1.5x speed) and jump (returns to run):

    //     });
    //     answer2 = new createjs.Sprite(spriteSheet3);
    //     answer2.visible = false;
    //     container.parent.addChild(answer2);
    // };

}

function tick(e) {
    stage.update();
}
/////////////////////////////////////////////////////////////////=======HANDLE CLICK========///////////////////////////////////////////////////////////////////
function handleClick(e) {
    qno = between(0, 19);


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



    container.parent.addChild(qHolder);
    qHolder.visible = false;

    container.parent.addChild(questionText);
    questionText.visible = false;
    questionText.x = 400; questionText.y = 100;

    btnX1 = [, 410, 730];
    btnY1 = [, 30, 230];

    container.parent.addChild(question1, question2);
    for (i = 1; i <= 2; i++) {
        questionArr[i] = this["question" + i];
        container.parent.addChild(questionArr[i])
        questionArr[i].visible = false;
        questionArr[i].x = btnX1[i];
        questionArr[i].y = btnY1[i];
        questionArr[i].name = i;
        questionArr[i].id = i;
    }

    answer1.visible = false;
    container.parent.addChild(answer1);
    answer1.x = 410; answer1.y = 230;


    container.parent.addChild(choice1, choice2, choice3);
    btnX = [, 225, 590, 954]
    btnY = [, 543, 543, 543]
    for (i = 1; i <= choiceCnt; i++) {
        choiceArr[i] = this["choice" + i]
        container.parent.addChild(choiceArr[i])
        choiceArr[i].visible = false;
        choiceArr[i].x = btnX[i]
        choiceArr[i].y = btnY[i]
        choiceArr[i].cursor = "pointer"
        choiceArr[i].name = i
        chpos.push({ posx: choiceArr[i].x, posy: choiceArr[i].y })
    }


    if (isQuestionAllVariations) {
        posArr = [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2];
    } else {
        posArr = [0, 1, 2, 0, 1, 2, 0, 1, 2, 0];
    }
    posArr.sort(randomSort);
}
//==============================================================HELP ENABLE/DISABLE===================================================================//
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
//==================================================================PICKQUES==========================================================================//
function pickques() {
    pauseTimer();
    //for db
    tx = 0;
    qscnt++;
    //db
    cnt++;
    quesCnt++;

    panelVisibleFn();
    var temp;
    pos = [];
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    questionText.gotoAndStop(qno[cnt]);

    for (i = 1; i <= 2; i++) {
        questionArr[i].gotoAndStop(qno[cnt]);
        questionArr[i].name = i;
        questionArr[i].id = i;

    }
    for (i = 1; i <= choiceCnt; i++) {
        choiceArr[i].visible = false;
        choiceArr[i].gotoAndStop(qno[cnt]);
    }


    if (posArr[cnt] == 0) {
        pos.push(0, 1, 2)
    } else if (posArr[cnt] == 1) {
        pos.push(1, 0, 2)
    }
    else {
        pos.push(2, 1, 0)
    }

    var vCnt = 0
    for (i = 1; i <= choiceCnt; i++) {
        vCnt++;
        choiceArr[vCnt].x = chpos[pos[i - 1]].posx;
        choiceArr[vCnt].y = chpos[pos[i - 1]].posy;
    };
    if (qno[cnt] < 4 || qno[cnt] > 7 && qno[cnt] < 12 || qno[cnt] > 15 && qno[cnt] < 20) {
        ans = 1;
        answer1.x = 410; answer1.y = 230;
    } else {
        ans = 2;
        answer1.x = 730; answer1.y = 230;
    }

    createTween();
}

function createTween() {
    questionText.visible = true;
    questionText.alpha = 0;
    createjs.Tween.get(questionText).wait(100).to({ alpha: 1 }, 200);

    createjs.Tween.get(qHolder).wait(200).to({ visible: true }, 200, createjs.Ease.bounceOut);
    for (i = 1; i <= 2; i++) {
        questionArr[i].visible = true;
        questionArr[i].y = -500
        createjs.Tween.get(questionArr[i]).wait(300).to({ y: 230 }, 200);
    }

    for (i = 1; i <= choiceCnt; i++) {
        createjs.Tween.get(choiceArr[i]).wait(400).to({ visible: true }, 200, createjs.Ease.bounceOut);

    }
    repTimeClearInterval = setTimeout(AddListenerFn, 1500);
}


function AddListenerFn() {
    clearTimeout(repTimeClearInterval);
    for (i = 1; i <= choiceCnt; i++) {
        // choiceArr[i].addEventListener("click", answerSelected);        
        choiceArr[i].addEventListener("pressmove", onObjectDownHandler)
        choiceArr[i].addEventListener("pressup", getDragUp);
        choiceArr[i].cursor = "pointer";
        choiceArr[i].mouseEnabled = true
        choiceArr[i].visible = true;
        choiceArr[i].alpha = 1;
        choiceArr[i].id = i;
        pX[i] = choiceArr[i].x;
        pY[i] = choiceArr[i].y;
    }
    rst = 0;
    gameResponseTimerStart();
    restartTimer()
}


function onObjectDownHandler(evt) {
    var p = evt.currentTarget.parent.globalToLocal(evt.stageX, evt.stageY);
    evt.currentTarget.x = p.x - 30;
    evt.currentTarget.y = p.y - 30;
    stage.update()
}
function getDragUp(evt) {
    var setDropTarget;
    for (i = 1; i <= 2; i++) {
        var p = questionArr[i].globalToLocal(evt.stageX, evt.stageY);
        if (questionArr[i].hitTest(p.x, p.y)) {
            setDropTarget = questionArr[i]
            // queVal = i;
            // questionArr[i].isDrag = true;

        } else {
            // console.log("error...")
        }
    }

    getDragObj = evt.currentTarget
    container.parent.addChild(getDragObj)
    queNo = evt.currentTarget.id;

    // dragVal = evt.currentTarget.name;
    // queNo = evt.currentTarget.id;
    // console.log(":::::::" + dragVal);
    console.log("=======" + setDropTarget)
    objPos1 = pX[queNo];
    objPos2 = pY[queNo];
    if (intersect(evt.currentTarget, setDropTarget)) {
        console.log(":::::::");
        getDragObj.mouseEnabled = false;
        getDragObj.visible = true;
        getDragObj.cursor = "default";
        getDragObj.x = setDropTarget.x;
        getDragObj.y = setDropTarget.y;
        uans = setDropTarget.name;
        uans1 = evt.currentTarget.name;
        console.log("uans==" + uans)
        console.log("getDragObj.name===" + getDragObj.name)
        getDragObj.visible = false
        answerSelected(evt)
        stage.update(evt)
    }
    else {
        getDragObj.x = objPos1;
        getDragObj.y = objPos2;
    }
}

function intersect(obj1, obj2) {
    if (obj2 == null) {
        getDragObj.x = objPos1;
        getDragObj.y = objPos2;
    } else {
        var objBounds1 = obj1.getTransformedBounds()
        var objBounds2 = obj2.getTransformedBounds()
        if (objBounds1.intersects(objBounds2)) {
            return true;
        } else {
            return false;
        }
    }
}

//====================================================================CHOICE ENABLE/DISABLE==============================================================//
function enablechoices() {

}

function disablechoices() {
    for (i = 1; i <= choiceCnt; i++) {
        choiceArr[i].visible = false;
        choiceArr[i].removeEventListener("click", answerSelected);

    }
    for (i = 1; i <= 2; i++) {
        questionArr[i].visible = false;

    }
    answer1.visible = false;
    // answer2.visible = false;
}

//=================================================================ANSWER SELECTION=======================================================================//
function answerSelected(e) {

    e.preventDefault();

    gameResponseTimerStop();

    console.log(ans + " =correct= " + uans)
    if (ans == uans && uans1 == 1) {

        for (i = 1; i <= choiceCnt; i++) {
            choiceArr[i].mouseEnabled = false
        }

        e.currentTarget.removeEventListener("click", answerSelected)

        answer1.visible = true;
        answer1.gotoAndStop(qno[cnt]);

        setTimeout(correct, 500)
    } else {

        getValidation("wrong");
        disablechoices();
    }
}

function correct() {
    getValidation("correct");
    disablechoices();
}
