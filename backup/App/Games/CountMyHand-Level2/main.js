///////////////////////////////////////////////////-------Common variables--------------/////////////////////////////////////////////////////////////////////
var messageField;		//Message display field
var assets = [];
var cnt = -1,qscnt=-1, ans, uans, interval, time = 180, totalQuestions = 10, answeredQuestions = 0, qcnt, choiceCnt = 3, quesCnt = 0, resTimerOut = 0, rst = 0, responseTime = 0;
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


var objArr = [];
var quesArr = []
var quesMcArr = []
var chposArr = []
var position = []
///////////////////////////////////////////////////////////////////////GAME SPECIFIC ARRAY//////////////////////////////////////////////////////////////
var posArr = [1, 0, 2, 0, 1, 2, 1, 0, 2, 0, 1, 2, 1, 0,2, 0, 1,2, 1, 0, 2, 0, 1, 2, 1]
var qno = []
var rand = []
var questionArr = []
var choiceArr = []
var chpos = [];
var xArr1 = [510, 650]
var xArr2 = [500, 580, 665]
var yArr2 = [270, 170, 270]
var xArr3 = [530, 660, 530, 660]
var yArr3 = [185, 185, 315, 315]
var xArr4 = [535, 670, 600, 535, 670]
var yArr4 = [180, 180, 255, 340, 340]
var xArr5 = [550, 650, 525,680, 550, 650]
var yArr5 = [170, 170,265, 265, 360, 360]
var xArr6 = [550,650,515, 600,690, 550, 650]
var yArr6 = [170, 170,265,265, 265, 360, 360]
var xArr7 = [530,605,685,555,655,530,605,685]
var yArr7 = [180, 180,180,265,265, 360, 360, 360]
var xArr8 = [530,610,695,530,610,695,530,610,695]
var yArr8 = [190, 190,190,275,275,275, 360, 360, 360]
var xArr9 = [530,610,695,500,580, 655,740, 530, 610,695]
var yArr9 = [180, 180,180,275,275,275, 275, 370, 370,370]
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
    gameAssetsPath = "CountMyHand-Level2/";
    soundpath = "FA/"

    var success = createManifest();
    if (success == 1) {
        manifest.push(
            { id: "question", src: gameAssetsPath + "question.png" },
            { id: "introHint", src: gameAssetsPath + "introHintImg.png" },
            { id: "choice1", src: gameAssetsPath + "ChoiceImages1.png" },
            { id: "questionText", src: questionTextPath + "CountMyHand-Level2-QT.png"},
            { id: "qhHolder", src: gameAssetsPath + "chHolder.png" },
        )
        preloadAllAssets()
        stage.update();
    }
}

//=================================================================DONE LOADING=================================================================// 
function doneLoading1(event) {

    var event = assets[i];
    var id = event.item.id;

    if (id == "backGround1") {
        backGround1 = new createjs.Bitmap(preload.getResult('backGround1'));
        container.parent.addChild(backGround1);
        backGround1.visible = false;
    }

    if (id == "qhHolder") {
        qhHolder = new createjs.Bitmap(preload.getResult('qhHolder'));
        qhHolder.visible = false;
        container.parent.addChild(qhHolder);
    };
    if (id == "questionText") {
        questionText = new createjs.Bitmap(preload.getResult('questionText'));
        questionText.visible = false;
        container.parent.addChild(questionText);
    };


    if (id == "question") {
        var spriteSheet3 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("question")],
            "frames": { "regX": 50, "height": 250, "count": 0, "regY": 50, "width": 250 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        //
        question = new createjs.Sprite(spriteSheet3);
        container.parent.addChild(question);
        question.visible = false;
    }

    if (id == "introHint") {
        var spriteSheet3 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("introHint")],
            "frames": { "regX": 50, "height": 290, "count": 0, "regY": 50, "width": 290 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        //
        introHint = new createjs.Sprite(spriteSheet3);
        container.parent.addChild(introHint);
        introHint.visible = false;
    }

    if (id == "choice1") {
        var spriteSheet3 = new createjs.SpriteSheet({
            framerate: 30,
            "images": [preload.getResult("choice1")],
            "frames": { "regX": 50, "height": 142, "count": 0, "regY": 50, "width": 142 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        });
        //
        choice1 = new createjs.Sprite(spriteSheet3);
        container.parent.addChild(choice1);
        choice1.visible = false;
    }

 }

function tick(e) {
    stage.update();
}
/////////////////////////////////////////////////////////////////=======HANDLE CLICK========///////////////////////////////////////////////////////////////////
function handleClick(e) {
    qno = between(0, 24)
    qno.splice(qno.indexOf(0), 1)
    qno.push(0)
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
////////////////////////////////////////////////////////////=======CREATION OF GAME ELEMENTS========///////////////////////////////////////////////////////////////////
function CreateGameElements() {  
    interval = setInterval(countTime, 1000);
    questionText.visible = false;
    container.parent.addChild(questionText);
    qhHolder.visible = false;
    container.parent.addChild(qhHolder);

    for (i = 0; i < choiceCnt; i++) {
        choiceArr[i] = choice1.clone();
        container.parent.addChild(choiceArr[i]);
        choiceArr[i].x = 230 + (i * 385)
        choiceArr[i].y = 550
        choiceArr[i].scaleX=choiceArr[i].scaleY=1.15
        choiceArr[i].visible = false;
        chpos.push({ posx: choiceArr[i].x, posy: choiceArr[i].y })
    }


  
    if (isQuestionAllVariations) {
        createGameWiseQuestions()
        
        posArr = [1, 0, 2, 0, 1, 2, 1, 0, 2, 0, 1, 2, 1, 0,2, 0, 1,2, 1, 0, 2, 0, 1, 2,0]
    } else {
     
        posArr = [1, 0, 2, 0, 1, 2, 1, 0, 2, 0]
    }
    posArr.sort(randomSort)
}


function helpDisable() {
    for (i = 0; i < choiceCnt; i++) {
        quesMcArr[i].mouseEnabled = false;
    }
}

function helpEnable() {
    for (i = 0; i < choiceCnt; i++) {
        quesMcArr[i].mouseEnabled = true;
    }
}
//=================================================================================================================================//
function pickques() {
    pauseTimer();
    tx = 0;
    cnt++;
    quesCnt++;
    qscnt++;
    var pos = []    
    rand = between(0, 9)
    console.log("rand===" + rand)
    qCnt = rand[0] + 1
    panelVisibleFn();
    
    console.log(qCnt+"qCnt");   

    question.gotoAndStop(qno[cnt]);
   
    for (i = 0; i < qCnt; i++) {
        if (qCnt == 1) {
         
            questionArr[i] = question.clone();
            container.parent.addChild(questionArr[i]);
            questionArr[i].visible = false;
            questionArr[i].x = 565
            questionArr[i].y = 240
            questionArr[i].scaleX = questionArr[i].scaleY = 1
        }
        if (qCnt == 2) {
            questionArr[i] = question.clone();
            container.parent.addChild(questionArr[i]);
            questionArr[i].visible = false;
            questionArr[i].x = xArr1[i]
            questionArr[i].y = 235
            questionArr[i].scaleX = questionArr[i].scaleY = .75
        }
        if (qCnt == 3) {
            questionArr[i] = question.clone();
            container.parent.addChild(questionArr[i]);
            questionArr[i].visible = false;
            questionArr[i].x = xArr2[i]
            questionArr[i].y = yArr2[i]
            questionArr[i].scaleX = questionArr[i].scaleY = .7

        }
        if (qCnt == 4) {
        
           
            questionArr[i] = question.clone();
            container.parent.addChild(questionArr[i]);
            questionArr[i].visible = false;
            questionArr[i].x = xArr3[i]
            questionArr[i].y = yArr3[i]
            questionArr[i].scaleX = questionArr[i].scaleY = .6

        }
        if (qCnt == 5) {
            questionArr[i] = question.clone();
            container.parent.addChild(questionArr[i]);
            questionArr[i].visible = false;
            questionArr[i].x = xArr4[i]
            questionArr[i].y = yArr4[i]
            questionArr[i].scaleX = questionArr[i].scaleY = .5

        }
        if (qCnt ==6) {                           
                questionArr[i] = question.clone();
                container.parent.addChild(questionArr[i]);
                questionArr[i].visible = false;
                questionArr[i].x = xArr5[i]
                questionArr[i].y = yArr5[i]
                questionArr[i].scaleX = questionArr[i].scaleY = .45          

        }
        if (qCnt == 7) {
            questionArr[i] = question.clone();
            container.parent.addChild(questionArr[i]);
            questionArr[i].visible = false;
            questionArr[i].x = xArr6[i]
            questionArr[i].y = yArr6[i]
            questionArr[i].scaleX = questionArr[i].scaleY = .45

        }
        if (qCnt == 8) {
            questionArr[i] = question.clone();
            container.parent.addChild(questionArr[i]);
            questionArr[i].visible = false;
            questionArr[i].x = xArr7[i]
            questionArr[i].y = yArr7[i]
            questionArr[i].scaleX = questionArr[i].scaleY = .4

        }
        if (qCnt == 9) {
            questionArr[i] = question.clone();
            container.parent.addChild(questionArr[i]);
            questionArr[i].visible = false;
            questionArr[i].x = xArr8[i]
            questionArr[i].y = yArr8[i]
            questionArr[i].scaleX = questionArr[i].scaleY = .35

        }
        if (qCnt == 10) {
            questionArr[i] = question.clone();
            container.parent.addChild(questionArr[i]);
            questionArr[i].visible = false;
            questionArr[i].x = xArr9[i]
            questionArr[i].y = yArr9[i]
            questionArr[i].scaleX = questionArr[i].scaleY = .3

        }
 
    }
    if (posArr[cnt] == 0) {
        pos.push(0, 1,2)
    }
    else if (posArr[cnt] ==1) {
        pos.push(1,2,0)
    }
    else{
        pos.push(2,0,1)  
    }

    for (i = 0; i < choiceCnt; i++) {
        console.log(rand[i])
        choiceArr[i].gotoAndStop(rand[i]);
        choiceArr[i].name = rand[i]
    }
    ans = qCnt - 1;
    for (i = 0; i < choiceCnt; i++) {
        choiceArr[i].x = chpos[pos[i]].posx;
        choiceArr[i].y = chpos[pos[i]].posy;
    };

    createTween();
    createjs.Ticker.addEventListener("tick", tick);
    stage.update();
}
function createTween() {

    //////////////////////////////QuestionText////////////////////////////
    questionText.visible = true
    questionText.alpha = 0;
    questionText.y=-500;
    createjs.Tween.get(questionText).wait(200)
    .to({ y: 0, alpha: 1 },300);

    qhHolder.y = -500;
    qhHolder.visible = true;
    qhHolder.alpha = 0;
    qhHolder.scaleX = qhHolder.scaleY =1
    createjs.Tween.get(qhHolder)
    .wait(500)
    .to({y: 0, alpha: 1 }, 500);

var val=1000;
    for (i = 0; i < qCnt; i++) {
        questionArr[i].visible=true;
        questionArr[i].alpha=0;
        createjs.Tween.get(questionArr[i]).wait(val)    
        .to({  alpha: 1 }, 500);  
        
        
    }
    ///////////////////////////choice tween////////////////////////////////////
    var val1=1500;
    var temp=250;
    for (i =0; i <choiceCnt; i++) {
        choiceArr[i].visible = true;
        choiceArr[i].alpha=0;      
      
        createjs.Tween.get(choiceArr[i]).wait(val1)    
        .to({alpha: 1 }, temp);  
       temp=+100      
    }
    repTimeClearInterval = setTimeout(AddListenerFn, 2500);
}

function AddListenerFn() {
    clearTimeout(repTimeClearInterval)
    for (i = 0; i < choiceCnt; i++) {
        choiceArr[i].addEventListener("click", answerSelected);
        choiceArr[i].mouseEnabled = true;
        choiceArr[i].visible = true;
        choiceArr[i].alpha = 1;
        choiceArr[i].cursor = "pointer";
    }
    rst = 0;
    gameResponseTimerStart();
    restartTimer()
}
function disablechoices() {
  
    for (i = 0; i < choiceCnt; i++) {
        choiceArr[i].addEventListener("click", answerSelected);
        choiceArr[i].mouseEnabled = false;
        choiceArr[i].visible = false;
        choiceArr[i].alpha = 1;;
    }
    for (i = 0; i < qCnt; i++) {
        questionArr[i].visible = false;
    }
    questionText.visible = false;
    qhHolder.visible = false;
}


function answerSelected(e) {
    e.preventDefault();
    gameResponseTimerStop();
    uans = e.currentTarget.name;
    if (ans == uans) {
        for (i = 0; i < choiceCnt; i++) {
            choiceArr[i].mouseEnabled = false;
        }
        e.currentTarget.removeEventListener("click", answerSelected)
        correctFn();
        

    } else {
       
        getValidation("wrong");
        disablechoices();
    }
}
function correctFn() {
    getValidation("correct");
    disablechoices();
}
