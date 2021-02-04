var introQuestxt1, introQuestxt2, introTitle, introAns, introQues, introQues1, introHolder, introHolder1, introHolder2, introAns1, introAns2, introArrow, introfingure;
var highlightTweenArr = []
var setIntroCnt = 0
var removeIntraval = 0
var introchoiceArr = []
var introquesTextArr = []
var introquesTextArr1 = []
var setIntroCnt = 0;
var removeIntraval = 0;
var introArrowX = 250, introArrowY = 400;
var introfingureX = 260, introfingureY = 550;
var introBtnY = [];
var introBtnX = [];
function commongameintro() {
    introTitle = Title.clone();
    container.parent.addChild(introTitle);
    introTitle.visible = true;
    introQuestxt = questionText.clone();
    introArrow = arrow1.clone();
    introfingure = fingure.clone();
    introHolder = qHolder.clone();
    introQues = question1.clone();
    introQues1 = question2.clone();
    introAns1 = answer1.clone();

    // introVal1 = 0;

    container.parent.addChild(introHolder);
    introHolder.visible = false;

    container.parent.addChild(introQuestxt);
    introQuestxt.visible = false;
    introQuestxt.x = 400; introQuestxt.y = 100;

    introQues.visible = false;
    container.parent.addChild(introQues);
    introQues.x = 730; introQues.y = 230;

    introQues1.visible = false;
    container.parent.addChild(introQues1);
    introQues1.x = 410; introQues1.y = 230;

    introAns1.visible = false;
    container.parent.addChild(introAns1);
    introAns1.x = 730; introAns1.y = 230;


    introBtnX = [, 225, 590, 954]
    introBtnY = [, 543, 543, 543]
    for (i = 1; i <= choiceCnt; i++) {
        introchoiceArr[i] = this["choice" + i]
        container.parent.addChild(introchoiceArr[i])
        introchoiceArr[i].visible = false;
        introchoiceArr[i].x = introBtnX[i]
        introchoiceArr[i].y = introBtnY[i];
    }

    introQuestxt.visible = true;
    introQuestxt.alpha = 0;
    createjs.Tween.get(introQuestxt).wait(10).to({ alpha: 1 }, 300).call(handleComplete1_1);

}
function handleComplete1_1() {
    createjs.Tween.removeAllTweens();
    if (stopValue == 0) {
        removeGameIntro()
    }
    else {
        HolderTween()
    }
}

function HolderTween() {

    createjs.Tween.get(introHolder).to({ visible: true }, 500, createjs.Ease.bounceOut).wait(200).call(handleComplete1_2);
}

function handleComplete1_2() {
    createjs.Tween.removeAllTweens();
    if (stopValue == 0) {
        removeGameIntro()
    }
    else {
        HolderTween1()
    }
}
function HolderTween1() {

    introQues.visible = true;
    introQues.y = -500
    createjs.Tween.get(introQues).wait(100).to({ y: 230 }, 200);

    introQues1.visible = true;
    introQues1.y = -500
    createjs.Tween.get(introQues1).wait(100).to({ y: 230 }, 200).wait(300).call(handleComplete2_1);

}

function handleComplete2_1() {

    createjs.Tween.removeAllTweens();
    if (stopValue == 0) {
        removeGameIntro()
    }
    else {
        choiceTween()
    }
}

function choiceTween() {
    for (i = 1; i <= 3; i++) {
        if (i == 3) {
            createjs.Tween.get(introchoiceArr[i]).wait(200).to({ visible: true }, 200, createjs.Ease.bounceOut).wait(1000).call(handleComplete3_1);

        } else {
            createjs.Tween.get(introchoiceArr[i]).wait(200).to({ visible: true }, 200, createjs.Ease.bounceOut);

        }

    }


}

function handleComplete3_1() {
    createjs.Tween.removeAllTweens();
    if (stopValue == 0) {
        removeGameIntro()

    }
    else {
        setArrowTween();
    }
}


function setArrowTween() {

    if (stopValue == 0) {
        console.log("setArrowTween  == stopValue")
        removeGameIntro()

    }
    else {
        container.parent.addChild(introArrow);
        introArrow.visible = true;
        introArrow.x = introArrowX;
        introArrow.y = introArrowY;
        highlightTweenArr[0] = new createjs.MovieClip()
        container.parent.addChild(highlightTweenArr[0])
        highlightTweenArr[0] = createjs.Tween.get(introArrow)
            .to({ y: introArrowY + 10 }, 350)
            .to({ y: introArrowY }, 350)
            .to({ y: introArrowY + 10 }, 350)
            .to({ y: introArrowY }, 350)
            .to({ y: introArrowY + 10 }, 350)
            .to({ y: introArrowY }, 350)
            .wait(400)
            .call(this.onComplete1)

    }
}

function setFingureTween() {
    if (stopValue == 0) {
        console.log("setFingureTween  == stopValue")
        removeGameIntro()

    }
    else {

        // introAns.visible = true;

        container.parent.removeChild(introArrow);
        introArrow.visible = false;
        container.parent.addChild(introfingure);
        introfingure.visible = true;
        container.parent.addChild(startBtn)
        container.parent.addChild(StartBtnMc)
        introfingure.x = introfingureX;
        introfingure.y = introfingureY;

        createjs.Tween.get(introfingure).wait(100)
            .to({ x: 750, y: 280 }, 500);
        createjs.Tween.get(introchoiceArr[1]).wait(100)
            .to({ x: 750, y: 250 }, 500).wait(100).call(this.onComplete2);


    }
}

this.onComplete1 = function (e) {
    createjs.Tween.removeAllTweens();
    // for (i = 0; i < 2; i++) {
    if (highlightTweenArr[0]) {
        console.log("onComplete1")
        container.parent.removeChild(highlightTweenArr[0]);
    }
    // }
    container.parent.removeChild(introArrow);
    if (stopValue == 0) {
        console.log("onComplete1  == stopValue")
        removeGameIntro()

    } else {
        setTimeout(setFingureTween, 200)
    }
}

this.onComplete2 = function (e) {
    createjs.Tween.removeAllTweens();
    container.parent.removeChild(introfingure);
    introfingure.visible = false;
    introchoiceArr[1].visible = false;
    introAns1.visible = true;
    if (stopValue == 0) {
        console.log("onComplete2  == stopValue")
        removeGameIntro()

    }
    else {
        console.log("///setcallDelat=====+");
        setTimeout(setCallDelay, 500)
    }

}

function setCallDelay() {
    clearInterval(removeIntraval)
    removeIntraval = 0
    setIntroCnt++
    removeGameIntro()
    if (stopValue == 0) {
        removeGameIntro()
    }
    else {
        commongameintro()
        if (setIntroCnt > 0) {
            isVisibleStartBtn()
        }
    }

}
function removeGameIntro() {
    createjs.Tween.removeAllTweens();
    container.parent.removeChild(introTitle)
    introTitle.visible = false;
    container.parent.removeChild(introArrow)
    introArrow.visible = false
    container.parent.removeChild(introfingure)
    introfingure.visible = false
    container.parent.removeChild(introHolder);
    introHolder.visible = false;

    container.parent.removeChild(introQuestxt);
    introQuestxt.visible = false;

    container.parent.removeChild(introQues);
    introQues.visible = false;

    container.parent.removeChild(introQues1);
    introQues1.visible = false;


    introAns1.visible = false;
    container.parent.removeChild(introAns1);

    for (i = 1; i <= choiceCnt; i++) {
        container.parent.removeChild(introchoiceArr[i])
        introchoiceArr[i].visible = false;
    }

    if (highlightTweenArr[0]) {
        highlightTweenArr[0].setPaused(false);
        container.parent.removeChild(highlightTweenArr[0]);
    }
    if (highlightTweenArr[1]) {
        highlightTweenArr[1].setPaused(false);
        container.parent.removeChild(highlightTweenArr[1]);
    }
}