var introTitle, introQuestxt, introQues, introArrow, introfingure, introText, introText1
var introchoice1, introchoice2, introchoice3, introchoice4
var introQuesX = 425, introQuesY = 215;
var highlightTweenArr = [];
var setIntroCnt = 0;
var removeIntraval = 0;
var posX = [];
var posY = [];
var introArr = [];
var introCH = [];
var introCH1 = [];

var introPosX = [, 310, 580, 840, 310, 580, 840, 310, 580, 840];
var introPosY = [, 240, 240, 240, 410, 410, 410, 580, 580, 580];
var introVal = [, 1, 3, 4, 5, 2, 6, 7, 8, 9, 10];
var TempIntroVal;
var ArrowXArr = [, 610, 340], FingXArr = [, 630, 360];
var ArrowYArr = [, 320, 150], FingYArr = [, 420, 250];
function commongameintro() {
    introTitle = Title.clone();
    introHolder = chHolder.clone();
    introArrow = arrow1.clone();
    introfingure = fingure.clone();
    introQuestxt = questionText.clone();
    container.parent.addChild(introTitle);
    introTitle.visible = true;

    container.parent.addChild(introHolder)
    introHolder.visible = false;

    for (i = 1; i <= 9; i++) {
        introArr[i] = this["choice" + (introVal[i])].clone();
        container.parent.addChild(introArr[i]);
        introArr[i].visible = false;
        introArr[i].x = introPosX[i];
        introArr[i].y = introPosY[i];
        introArr[i].scaleX = introArr[i].scaleY = .8;
    }


    container.parent.addChild(introQuestxt);
    introQuestxt.visible = true;
    introQuestxt.y = -2000;
    createjs.Tween.get(introQuestxt).wait(200).to({ y: 0 }, 300, createjs.Ease.bounceOut).call(handleComplete1_1);
}
function handleComplete1_1() {
    createjs.Tween.removeAllTweens();
    if (stopValue == 0) {
        removeGameIntro()
    }
    else {
        quesTween()
    }
}
function quesTween() {

    introHolder.visible = true;
    introHolder.x = -1300;
    createjs.Tween.get(introHolder).wait(50).to({ x: 0 }, 600, createjs.Ease.bounceOut).call(handleComplete2_1);



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
    TempIntroVal = 0;

    for (i = 1; i <= 9; i++) {
        if (i == 9) {
            createjs.Tween.get(introArr[i]).wait(100).to({ visible: true }, 600, createjs.Ease.bounceOut).wait(1000).call(handleComplete3_1);
        } else {
            createjs.Tween.get(introArr[i]).wait(100).to({ visible: true }, 600, createjs.Ease.bounceOut);
        }

    }

}

function handleComplete3_1() {
    createjs.Tween.removeAllTweens();
    if (stopValue == 0) {
        removeGameIntro();

    }
    else {
        introChTween();
    }
}
function introChTween() {
    createjs.Tween.get(introArr[1]).wait(100).to({ alpha: 1, scaleX: .9, scaleY: .9 }, 500)
        .to({ scaleX: .8, scaleY: .8 }, 500).to({ scaleX: .9, scaleY: .9 }, 500)
        .to({ scaleX: .8, scaleY: .8 }, 1000, createjs.Ease.bounceOut)

    createjs.Tween.get(introArr[5]).wait(100).to({ alpha: 1, scaleX: .9, scaleY: .9 }, 500)
        .to({ scaleX: .8, scaleY: .8 }, 500).to({ scaleX: .9, scaleY: .9 }, 500)
        .to({ scaleX: .8, scaleY: .8 }, 1000, createjs.Ease.bounceOut).wait(1000).call(handleComplete4_1);

}

function handleComplete4_1() {
    createjs.Tween.removeAllTweens();
    if (stopValue == 0) {
        console.log("handleComplete1_5  == stopValue")
        removeGameIntro()

    }
    else {
        setArrowTween()
    }
}

function setArrowTween() {
    TempIntroVal++;
    if (stopValue == 0) {
        console.log("setArrowTween  == stopValue")
        removeGameIntro()

    }
    else {
        container.parent.addChild(introArrow);
        container.parent.addChild(startBtn)
        container.parent.addChild(StartBtnMc)
        introArrow.visible = true;
        introfingure.visible = false;
        introArrow.x = ArrowXArr[TempIntroVal];
        introArrow.y = ArrowYArr[TempIntroVal];
        highlightTweenArr[0] = new createjs.MovieClip()
        container.parent.addChild(highlightTweenArr[0])
        highlightTweenArr[0] = createjs.Tween.get(introArrow).to({ y: ArrowYArr[TempIntroVal] + 10 }, 350).to({ y: ArrowYArr[TempIntroVal] }, 350).to({ y: ArrowYArr[TempIntroVal] + 10 }, 350)
            .to({ y: ArrowYArr[TempIntroVal] }, 350).to({ y: ArrowYArr[TempIntroVal] + 10 }, 350).to({ y: ArrowYArr[TempIntroVal] }, 350).wait(400).call(this.onComplete1)

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
        container.parent.addChild(startBtn)
        container.parent.addChild(StartBtnMc)
        introfingure.visible = true;
        introfingure.x = FingXArr[TempIntroVal];
        introfingure.y = FingYArr[TempIntroVal];
        highlightTweenArr[1] = new createjs.MovieClip()
        container.parent.addChild(highlightTweenArr[1])

        if (TempIntroVal == 2) {
            introArr[1].alpha=.5;
            highlightTweenArr[1] = createjs.Tween.get(introfingure).to({ x: FingXArr[TempIntroVal] }, 350).to({ x: FingXArr[TempIntroVal] - 15 }, 350)
                .to({ x: FingXArr[TempIntroVal] }, 350).to({ x: FingXArr[TempIntroVal] - 15 }, 350).wait(200).call(this.onComplete2)
        }
        else {
            introArr[5].alpha=.5;
            highlightTweenArr[1] = createjs.Tween.get(introfingure).to({ x: FingXArr[TempIntroVal] }, 350).to({ x: FingXArr[TempIntroVal] - 15 }, 350)
                .to({ x: FingXArr[TempIntroVal] }, 350).to({ x: FingXArr[TempIntroVal] - 15 }, 350).wait(200).call(handleComplete4_1)
        }

    }
}

this.onComplete1 = function (e) {
    createjs.Tween.removeAllTweens();

    if (highlightTweenArr[0]) {
        console.log("onComplete1")
        container.parent.removeChild(highlightTweenArr[0]);
    }

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
    if (highlightTweenArr[1]) {
        console.log("onComplete2")
        container.parent.removeChild(highlightTweenArr[1]);
    }

    container.parent.removeChild(introfingure);
    introfingure.visible = false;

    if (stopValue == 0) {
        console.log("onComplete2  == stopValue")
        removeGameIntro()

    }
    else {
        setTimeout(setCallDelay, 500)
    }


}
function setCallDelay() {
    clearInterval(removeIntraval)
    removeIntraval = 0
    setIntroCnt++
    console.log("check cnt = " + setIntroCnt)
    removeGameIntro()
    if (stopValue == 0) {
        console.log("setCallDelay  == stopValue")
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
    container.parent.removeChild(introTitle);
    introTitle.visible = false;
    container.parent.removeChild(introArrow);
    introArrow.visible = false;
    container.parent.removeChild(introfingure);
    introfingure.visible = false;
    container.parent.removeChild(introQuestxt)
    introQuestxt.visible = false;
    container.parent.removeChild(introHolder)
    introHolder.visible = false;
    for (i = 1; i <= 9; i++) {
        container.parent.removeChild(introArr[i]);
        introArr[i].visible = false;
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