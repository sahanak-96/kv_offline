var introArrow, introfingure, introTitle, introHolder, introQues, introquesText, introquesText1;
var introChoiceArr = [];
var introChoiceArr1 = [];
var highlightTweenArr = []
var setIntroCnt = 0;
var removeIntraval = 0, introCount = -1;
var introArrowX = 610, introArrowY = 290;
var introfingureX = 630, introfingureY = 410;
var introQuesArr = [];
var introChoiceArr = [];
var introbtnX = [446, 604, 604, 604, 761];
var introbtnY = [394, 398, 220, 567, 394];
function commongameintro() {

    introTitle = Title.clone();
    introArrow = arrow1.clone();
    introfingure = fingure.clone();
    introquesText = questionText.clone();
    introquesText1 = questionText1.clone();
    introHolder = chHolder.clone();
    // introQues = questionImage.clone();
    // introChoice = choice1.clone();


    container.parent.addChild(introTitle)
    introTitle.visible = true;

    container.parent.addChild(introquesText);
    introquesText.visible = false;

    container.parent.addChild(introquesText1);
    introquesText1.visible = false;

    container.parent.addChild(introHolder)
    introHolder.visible = false;


    for (i = 0; i < 5; i++) {
        introChoiceArr[i] = choice.clone()
        container.parent.addChild(introChoiceArr[i]);
        introChoiceArr[i].regX = introChoiceArr[i].regY = 50;
        introChoiceArr[i].scaleX = introChoiceArr[i].scaleY = .86;
        introChoiceArr[i].x = introbtnX[i] + 42;
        introChoiceArr[i].y = introbtnY[i] + 42;
        introChoiceArr[i].gotoAndStop(i);
        introChoiceArr[i].visible = false;
    }

    container.parent.addChild(introImg);
    introImg.visible = false;
    introImg.y = 240;
    introImg.x = 30;

    introquesText.alpha = 0;
    introquesText.visible = true
    createjs.Tween.get(introquesText).to({ alpha: 1 }, 1000).call(handleComplete1_1);
}
function handleComplete1_1() {
    createjs.Tween.removeAllTweens();
    quesTween()
}

function quesTween() {

    introHolder.y = -500;
    introHolder.visible = true;
    createjs.Tween.get(introHolder).wait(50).to({ y: 0 }, 600, createjs.Ease.bounceOut);


    var introTemp = 300;
    for (i = 0; i < 5; i++) {
        if (i == 4) {
            createjs.Tween.get(introChoiceArr[i]).wait(introTemp).to({ visible: true }, 600, createjs.Ease.bounceOut).wait(2000).call(handleComplete2_1);

        }
        else {
            createjs.Tween.get(introChoiceArr[i]).wait(introTemp).to({ visible: true }, 600, createjs.Ease.bounceOut);
        }
        introTemp += 50;
    }


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
    introquesText.visible = false;
    introquesText1.visible = true;
    introquesText1.alpha = 0
    createjs.Tween.get(introquesText1).wait(100).to({ alpha: 1 }, 200).wait(500).call(handleComplete3_1);
    var val = [2, 1, 0, 4, 3];
    for (i = 0; i < 5; i++) {
        introChoiceArr[i].gotoAndStop(val[i]);
    }
}

function handleComplete3_1() {
    createjs.Tween.removeAllTweens();
    if (stopValue == 0) {
        removeGameIntro()

    }
    else {

        ansTween();
    }
}

function ansTween() {
    introImg.visible = true;
    createjs.Tween.get(introImg).wait(10).to({ scaleX: 1, scaleY: 1 }, 500).to({ scaleX: 1.1, scaleY: 1.1 }, 500)
        .to({ scaleX: 1, scaleY: 1 }, 500).to({ scaleX: 1.1, scaleY: 1.1 }, 500)
        .to({ scaleX: 1, scaleY: 1 }, 500).to({ scaleX: 1.1, scaleY: 1.1 }, 500)
        .to({ scaleX: 1, scaleY: 1 }, 500).wait(500).call(handleComplete4_1);

}

function handleComplete4_1() {
    createjs.Tween.removeAllTweens();
    if (stopValue == 0) {
        removeGameIntro();

    }
    else {

        ansTween1();
    }
}

function ansTween1() {
    createjs.Tween.get(introChoiceArr[1]).wait(200).to({ scaleX: .86, scaleY: .86 }, 500).to({ scaleX: 1, scaleY: 1 }, 500)
        .to({ scaleX:.86, scaleY: .86 }, 500).to({ scaleX: 1, scaleY: 1 }, 500)
        .to({ scaleX: .86, scaleY: .86 }, 500).wait(500).call(handleComplete5_1);
}
function handleComplete5_1() {
    createjs.Tween.removeAllTweens()

    if (stopValue == 0) {
        removeGameIntro();

    }
    else {
        setArrowTween();
    }
}


function setArrowTween() {
    if (stopValue == 0) {
        removeGameIntro()

    }
    else {
        container.parent.addChild(introArrow);
        container.parent.addChild(startBtn);
        container.parent.addChild(StartBtnMc);
        introArrow.visible = true;
        introArrow.x = introArrowX;
        introArrow.y = introArrowY;
        highlightTweenArr[0] = new createjs.MovieClip()
        container.parent.addChild(highlightTweenArr[0])

        highlightTweenArr[0] = createjs.Tween.get(introArrow).to({ y: introArrowY + 10 }, 350).to({ y: introArrowY }, 350).to({ y: introArrowY + 10 }, 350)
            .to({ y: introArrowY }, 350)
            .to({ y: introArrowY + 10 }, 350)
            .to({ y: introArrowY }, 350)
            .wait(400).call(this.onComplete1)


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
    container.parent.removeChild(introArrow);
    introArrow.visible = false;
    container.parent.removeChild(introfingure);
    introfingure.visible = false;
    container.parent.removeChild(introTitle);
    introTitle.visible = false;
    container.parent.removeChild(introquesText);
    introquesText.visible = false;
    container.parent.removeChild(introquesText1);
    introquesText1.visible = false;
    container.parent.removeChild(introHolder)
    introHolder.visible = false;
    
    container.parent.removeChild(introImg)
    introImg.visible = false;

    for (i = 0; i < 5; i++) {
        container.parent.removeChild(introChoiceArr[i])
        introChoiceArr[i].visible = false;
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