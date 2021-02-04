// ///////////////////////////////////////////////////-------Common variables--------------/////////////////////////////////////////////////////////////////////
// var messageField;		//Message display field
// var assets = [];
// var cnt = -1, ans, uans, interval, time = 180, totalQuestions = 10, answeredQuestions = 0, choiceCnt = 9, quesCnt = 0, resTimerOut = 0, rst = 0, responseTime = 0;
// var startBtn, introScrn, container, choice1, choice2, choice3, choice4, question, circleOutline, circle1Outline, boardMc, helpMc, quesMarkMc, questionText, quesHolderMc, resultLoading, preloadMc;
// var mc, mc1, mc2, mc3, mc4, mc5, startMc, questionInterval = 0, chHolderMc = 0, backGround1;
// var parrotWowMc, parrotOopsMc, parrotGameOverMc, parrotTimeOverMc, gameIntroAnimMc;
// var bgSnd, correctSnd, wrongSnd, gameOverSnd, timeOverSnd, tickSnd;
// var tqcnt = 0, aqcnt = 0, ccnt = 0, cqcnt = 0, gscore = 0, gscrper = 0, gtime = 0, rtime = 0, crtime = 0, wrtime = 0, currTime = 0;
// var bg
// var BetterLuck, Excellent, Nice, Good, Super, TryAgain;
// var rst1 = 0, crst = 0, wrst = 0, score = 0;
// var isBgSound = true;
// var isEffSound = true;
// var url = "";
// var nav = "";
// var isResp = true;
// var respDim = 'both'
// var isScale = true
// var scaleType = 1;

// var lastW, lastH, lastS = 1;
// var borderPadding = 10, barHeight = 20;
// var loadProgressLabel, progresPrecentage, loaderWidth;


// //////////////////////////////////////////////////////===========COMMON GAME VARIABLES==========/////////////////////////////////////////////////////////////
var messageField; //Message display field
var assets = [];
var cnt = -1, qscnt = -1, ans, uans, interval, time = 180, totalQuestions = 10, answeredQuestions = 0, choiceCnt = 9, quesCnt = 0, resTimerOut = 0, rst = 0, responseTime = 0; var startBtn, introScrn, container, choice1, choice2, choice3, choice4, question, circleOutline, circle1Outline, boardMc, helpMc, quesMarkMc, questionText, quesHolderMc, resultLoading, preloadMc, introHintImg;
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
var currentX, currentY;
var clk;

///////////////////////////////////////////////////////////////////////GAME SPECIFIC ARRAY//////////////////////////////////////////////////////////////
var qno = [];
var currentObj = []
var quesArr = []
var btnX = [, 310, 580, 840, 310, 580, 840, 310, 580, 840]
var btnY = [, 240, 240, 240, 410, 410, 410, 580, 580, 580]
var chpos = []

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
    gameAssetsPath = "FindThePair/";
    soundpath = "FA/"

    var success = createManifest();
    if (success == 1) {
        manifest.push(


            { id: "chHolder", src: gameAssetsPath + "Holder.png" },
            { id: "choice1", src: gameAssetsPath + "ChoiceImages1.png" },
            { id: "choice2", src: gameAssetsPath + "ChoiceImages2.png" },
            { id: "choice3", src: gameAssetsPath + "ChoiceImages3.png" },
            { id: "choice4", src: gameAssetsPath + "ChoiceImages4.png" },
            { id: "choice5", src: gameAssetsPath + "ChoiceImages5.png" },
            { id: "choice6", src: gameAssetsPath + "ChoiceImages6.png" },
            { id: "choice7", src: gameAssetsPath + "ChoiceImages7.png" },
            { id: "choice8", src: gameAssetsPath + "ChoiceImages8.png" },
            { id: "choice9", src: gameAssetsPath + "ChoiceImages9.png" },
            { id: "questionText", src: questionTextPath + "FindThePair-QT.png" }
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


    if (id == "chHolder") {
        chHolder = new createjs.Bitmap(preload.getResult('chHolder'));
        container.parent.addChild(chHolder);
        chHolder.visible = false;

    }

    if (id == "questionText") {
        questionText = new createjs.Bitmap(preload.getResult('questionText'));
        container.parent.addChild(questionText);
        questionText.visible = false;

    }

    if (id == "choice1") {
        var spriteSheet1 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice1")],
            "frames": { "regX": 50, "height": 170, "count": 0, "regY": 50, "width": 250 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):

        });
        choice1 = new createjs.Sprite(spriteSheet1);
        choice1.visible = false;
        container.parent.addChild(choice1);
    };

    if (id == "choice2") {
        var spriteSheet1 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice2")],
            "frames": { "regX": 50, "height": 170, "count": 0, "regY": 50, "width": 250 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):

        });
        choice2 = new createjs.Sprite(spriteSheet1);
        choice2.visible = false;
        container.parent.addChild(choice2);
    };

    if (id == "choice3") {
        var spriteSheet1 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice3")],
            "frames": { "regX": 50, "height": 170, "count": 0, "regY": 50, "width": 250 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):

        });
        choice3 = new createjs.Sprite(spriteSheet1);
        choice3.visible = false;
        container.parent.addChild(choice3);
    };

    if (id == "choice4") {
        var spriteSheet1 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice4")],
            "frames": { "regX": 50, "height": 170, "count": 0, "regY": 50, "width": 250 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):

        });
        choice4 = new createjs.Sprite(spriteSheet1);
        choice4.visible = false;
        container.parent.addChild(choice4);
    };

    if (id == "choice5") {
        var spriteSheet1 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice5")],
            "frames": { "regX": 50, "height": 170, "count": 0, "regY": 50, "width": 250 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):

        });
        choice5 = new createjs.Sprite(spriteSheet1);
        choice5.visible = false;
        container.parent.addChild(choice5);
    };

    if (id == "choice6") {
        var spriteSheet1 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice6")],
            "frames": { "regX": 50, "height": 170, "count": 0, "regY": 50, "width": 250 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):

        });
        choice6 = new createjs.Sprite(spriteSheet1);
        choice6.visible = false;
        container.parent.addChild(choice6);
    };
    if (id == "choice7") {
        var spriteSheet1 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice7")],
            "frames": { "regX": 50, "height": 170, "count": 0, "regY": 50, "width": 250 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):

        });
        choice7 = new createjs.Sprite(spriteSheet1);
        choice7.visible = false;
        container.parent.addChild(choice7);
    };
    if (id == "choice8") {
        var spriteSheet1 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice8")],
            "frames": { "regX": 50, "height": 170, "count": 0, "regY": 50, "width": 250 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):

        });
        choice8 = new createjs.Sprite(spriteSheet1);
        choice8.visible = false;
        container.parent.addChild(choice8);
    };
    if (id == "choice9") {
        var spriteSheet1 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice9")],
            "frames": { "regX": 50, "height": 170, "count": 0, "regY": 50, "width": 250 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):

        });
        choice9 = new createjs.Sprite(spriteSheet1);
        choice9.visible = false;
        container.parent.addChild(choice9);
    };
   
}

function tick(e) {

    stage.update();
}

/////////////////////////////////////////////////////////////////=======GAME START========///////////////////////////////////////////////////////////////////

function handleClick(e) {
    qno= between(0,11)
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

    container.parent.addChild(chHolder);
    chHolder.visible = true;

    container.parent.addChild(questionText);
    questionText.visible = true;

    // if (isQuestionAllVariations) {
    //     createGameWiseQuestions()
    //     pickques()
    // } else {
    //     pickques()
    // }
}

function helpDisable() {
    for (i = 1; i <= choiceCnt; i++) {
        quesArr[i].mouseEnabled = false;
    }
}

function helpEnable() {
    for (i = 1; i <= choiceCnt; i++) {
        quesArr[i].mouseEnabled = true;
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

    panelVisibleFn();
    clk = -1;
    currentObj = [];
    chpos = [];
    pos = [];

    qno.sort(randomSort)
    console.log("termp=============="+qno)
    for (i = 1; i <= choiceCnt; i++) {
        quesArr[i] = this["choice" + i].clone()
        container.parent.addChild(quesArr[i])
        quesArr[i].visible = false;
        quesArr[i].x = btnX[i]
        quesArr[i].y = btnY[i]
        quesArr[i].name = "ch" + i;
        quesArr[i].scaleX = quesArr[i].scaleY = .8;
        quesArr[i].gotoAndStop(qno[cnt]);
        chpos.push({ posx: quesArr[i].x, posy: quesArr[i].y })
    }

    chpos.sort(randomSort);

    pos = between(0, 8)
 
    console.log("pos============" + pos)
    var vCnt = 0
    for (i = 1; i <= choiceCnt; i++) {
        vCnt++;
        quesArr[vCnt].x = chpos[pos[i - 1]].posx;
        quesArr[vCnt].y = chpos[pos[i - 1]].posy;
    };


    createTween();
}
function createTween() {
    questionText.visible = true;
    questionText.y = -1000;
    createjs.Tween.get(questionText).wait(100).to({ y: 0  }, 500, createjs.Ease.bounceOut)
 
    chHolder.visible = true;
    chHolder.x = -1300;
    createjs.Tween.get(chHolder).wait(400).to({ x: 0 }, 600, createjs.Ease.bounceOut);

    
    repTimeClearInterval = setTimeout(AddListenerFn, 1200)

}

function AddListenerFn() {
    
    clearTimeout(repTimeClearInterval)
    for (i = 1; i <= choiceCnt; i++) {
        quesArr[i].addEventListener("click", answerSelected);
        quesArr[i].visible = true;
        quesArr[i].alpha = 1;
        quesArr[i].mouseEnabled = true;
        quesArr[i].cursor = "pointer"

    }

    rst = 0;
    gameResponseTimerStart();
    restartTimer();
}


function disablechoices() {
    for (i = 1; i <= choiceCnt; i++) {
        quesArr[i].removeEventListener("click", answerSelected);
        quesArr[i].visible = false;
        quesArr[i].alpha = .5;
        quesArr[i].mouseEnabled = false
        quesArr[i].cursor = "default"
        quesArr[i].visible = false;
    }
}


function answerSelected(e) {
    clk++;
    e.preventDefault();
    e.currentTarget.cursor = "default";
    e.currentTarget.mouseEnabled = false

    uans = e.currentTarget.name;

    gameResponseTimerStop();
    if (uans == "ch1" || uans == "ch2") {
        currentObj[clk] = e.currentTarget.name;
        e.currentTarget.alpha = .5
     
        if (clk == 1) {
            for (i = 1; i <= choiceCnt; i++) {
                quesArr[i].removeEventListener("click", answerSelected);
            }
            setTimeout(correct, 50)

        }
    }
    else {
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
        quesArr[i].mouseEnabled = false;
    }
}

function enableMouse() {
    for (i = 1; i <= 3; i++) {
        var curName = quesArr[i].name
        if (currentObj.indexOf(curName) == -1)
            quesArr[i].mouseEnabled = true;
    }
}
