var introArrow, introfingure, introTitle, introHolder, introQues;
var introChoiceArr = [];
var introChoiceArr1 = [];
var highlightTweenArr = []
var setIntroCnt = 0;
var removeIntraval = 0, introCount = -1;
var introArrowX = 880, introArrowY = 500;
var introfingureX = 930, introfingureY = 590;
var introQuesArr = [];
var introChoiceArr = [];
function commongameintro() {

    introTitle = Title.clone();
    introArrow = arrow1.clone();
    introfingure = fingure.clone();
    introquestionText = questionText.clone();
    introHolder = chHolder.clone();
    introQues = questionImage.clone();
    introChoice = choice1.clone();


    container.parent.addChild(introTitle)
    introTitle.visible = true;

    container.parent.addChild(introquestionText);
    introquestionText.visible = false;

    container.parent.addChild(introHolder)
    introHolder.visible = false;


    for (i = 0; i < 2; i++) {
        introQuesArr[i] = introQues.clone();
        container.parent.addChild(introQuesArr[i]);
        introQuesArr[i].x = 285 + i * 550;
        introQuesArr[i].y = 265;
        introQuesArr[i].visible = false;
    }
    var val = [1, 0];
    var posX = [285, 825];
    for (i = 0; i < 2; i++) {
        introChoiceArr[i] = introChoice.clone();
        container.parent.addChild(introChoiceArr[i]);
        introChoiceArr[i].x = posX[i];
        introChoiceArr[i].y = 610;
        introChoiceArr[i].visible = false;
        introChoiceArr[i].gotoAndStop(val[i]);
    }


    introquestionText.alpha = 0;
    introquestionText.visible = true
    createjs.Tween.get(introquestionText).to({ alpha: 1 }, 1000).call(handleComplete1_1);
}
function handleComplete1_1() {
    createjs.Tween.removeAllTweens();
    quesTween()
}

function quesTween() {

    createjs.Tween.get(introHolder).wait(50).to({ visible: true }, 600, createjs.Ease.bounceOut);


    var introTemp = 100;
    for (i = 0; i < 2; i++) {
        if (i == 1) {
            createjs.Tween.get(introQuesArr[i]).wait(introTemp).to({ visible: true }, 600, createjs.Ease.bounceOut).wait(100).call(handleComplete2_1);

        }
        else {

            createjs.Tween.get(introQuesArr[i]).wait(introTemp).to({ visible: true }, 600, createjs.Ease.bounceOut);
        }
        introTemp += 50;
    }

}
function handleComplete2_1() {
    if (stopValue == 0) {
        removeGameIntro()
    }
    else {
        createjs.Tween.removeAllTweens();
        choiceTween()
    }
}


function choiceTween() {

    for (i = 0; i < 2; i++) {
        createjs.Tween.get(introChoiceArr[i]).to({ visible: true }).wait(500).call(handleComplete3_1);
    }
}

function handleComplete3_1() {

    if (stopValue == 0) {
        removeGameIntro()

    }
    else {
        createjs.Tween.removeAllTweens();
        ansTween();
    }
}

function ansTween() {

    createjs.Tween.get(introQuesArr[0]).wait(200).to({ scaleX: .9, scaleY: .9 }, 500).to({ scaleX: 1, scaleY: 1 }, 500)
        .to({ scaleX: .9, scaleY: .9 }, 500).to({ scaleX: 1, scaleY: 1 }, 500)
        .to({ scaleX: .9, scaleY: .9 }, 500).to({ scaleX: 1, scaleY: 1 }, 500)

    createjs.Tween.get(introQuesArr[1]).wait(200).to({ scaleX: .9, scaleY: .9 }, 500).to({ scaleX: 1, scaleY: 1 }, 500)
        .to({ scaleX: .9, scaleY: .9 }, 500).to({ scaleX: 1, scaleY: 1 }, 500)
        .to({ scaleX: .9, scaleY: .9 }, 500).to({ scaleX: 1, scaleY: 1 }, 500).wait(500).call(handleComplete4_1);




}
function handleComplete4_1() {

    if (stopValue == 0) {
        removeGameIntro()

    }
    else {
        createjs.Tween.removeAllTweens();
        ansTween1();
    }
}

function ansTween1() {
    createjs.Tween.get(introChoiceArr[1]).wait(500).to({ scaleX: .9, scaleY: .9 }, 500).to({ scaleX: 1, scaleY: 1 }, 500)
        .to({ scaleX: .9, scaleY: .9 }, 500).to({ scaleX: 1, scaleY: 1 }, 500).wait(500).call(handleComplete5_1);
}

function handleComplete5_1() {

    if (stopValue == 0) {
        removeGameIntro()

    }
    else {
        createjs.Tween.removeAllTweens();
           setArrowTween();
    }
}


function setArrowTween() {
    if (stopValue == 0) {
        removeGameIntro()

    }
    else {
        container.parent.addChild(introArrow);
        container.parent.addChild(startBtn)
        container.parent.addChild(StartBtnMc)
        introArrow.visible = true;
        introArrow.x = introArrowX;
        introArrow.y = introArrowY;
        highlightTweenArr[0] = new createjs.MovieClip()
        container.parent.addChild(highlightTweenArr[0])

        highlightTweenArr[0] = createjs.Tween.get(introArrow).to({ y: introArrowY + 10 }, 350).to({ y: introArrowY }, 350).to({ y: introArrowY + 10 }, 350)
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

        container.parent.removeChild(introArrow);
        introArrow.visible = false;
        container.parent.addChild(introfingure);
        introfingure.visible = true;
        container.parent.addChild(startBtn)
        container.parent.addChild(StartBtnMc)
        introfingure.x = introfingureX;
        introfingure.y = introfingureY;
        highlightTweenArr[1] = new createjs.MovieClip()
        container.parent.addChild(highlightTweenArr[1])
        highlightTweenArr[1] = createjs.Tween.get(introfingure)
            .to({ x: introfingureX }, 350)
            .to({ x: introfingureX - 15 }, 350)
            .to({ x: introfingureX }, 350)
            .to({ x: introfingureX - 15 }, 350)
            .wait(200)
            .call(this.onComplete2)
        //setTimeout(ansTween, 400)
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
    container.parent.removeChild(introArrow)
    introArrow.visible = false
    container.parent.removeChild(introfingure)
    introfingure.visible = false
    container.parent.removeChild(introTitle)
    introTitle.visible = false
    container.parent.removeChild(introquestionText)
    introquestionText.visible = false

    container.parent.removeChild(introHolder)
    introHolder.visible = false;
    container.parent.removeChild(introQues)
    introQues.visible = false;
    container.parent.removeChild(introChoice)
    introChoice.visible = false
    for (i = 0; i < 2; i++) {
        container.parent.removeChild(introChoiceArr[i])
        introChoiceArr[i].visible = false;
        container.parent.removeChild(introQuesArr[i])
        introQuesArr[i].visible = false;
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