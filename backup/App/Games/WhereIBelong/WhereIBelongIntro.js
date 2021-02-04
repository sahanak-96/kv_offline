var introArrow, introfingure, introTitle, introHolder, introQues;
var introChoiceArr = [];
var introChoiceArr1 = [];
var highlightTweenArr = []
var setIntroCnt = 0;
var removeIntraval = 0, introCount = -1;
var introArrowX = 200, introArrowY = 380;
var introfingureX = 250, introfingureY = 580;
var introQuesArr = [];
var introChoiceArr = [];
var introbtnX = [80, 490, 900, 285, 695];
var introbtnY = [450, 450, 450, 600, 600];
function commongameintro() {

    introTitle = Title.clone();
    introArrow = arrow1.clone();
    introfingure = fingure.clone();
    introquestionText = questionText.clone();
    introQues = question.clone();
    introchoice1 = choice1.clone();
    introchoice2 = choice2.clone();
    introchoice3 = choice3.clone();
    introHolder = chHolder.clone();

    container.parent.addChild(introTitle)
    introTitle.visible = true;

    container.parent.addChild(introquestionText);
    introquestionText.visible = false;

    container.parent.addChild(introHolder);
    introHolder.visible = false;

    container.parent.addChild(introQues);
    introQues.visible = false;
    introQues.x = 420;
    introQues.y = 200;
    introQues.scaleX = introQues.scaleY = 1.2;

    var bX = [, 80, 485, 900]
    var bY = [, 420, 420, 420]
    for (i = 1; i <= 3; i++) {
        container.parent.addChild(this["introchoice" + i])
        this["introchoice" + i].visible = false;
        this["introchoice" + i].x = bX[i];
        this["introchoice" + i].y = bY[i];

    }

    container.parent.addChild(introImg);
    introImg.visible = false;
    introImg.scaleX = introImg.scaleY = .7;
    introImg.x = 20;
    introImg.y = 130;

    introquestionText.y = -500;
    introquestionText.visible = true
    createjs.Tween.get(introquestionText).to({ y: 0 }, 1000).call(handleComplete1_1);
}
function handleComplete1_1() {
    createjs.Tween.removeAllTweens();
    quesTween()
}

function quesTween() {
    introQues.visible = true;
    introQues.alpha = 0;
    createjs.Tween.get(introQues).wait(100).to({ alpha: 1 }, 300, createjs.Ease.bounceOut);

    createjs.Tween.get(introHolder).wait(200).to({ visible: true }, 300, createjs.Ease.bounceOut);




    var introTemp = 300;
    for (i = 1; i <= 3; i++) {
        this["introchoice" + i].visible = true;
        this["introchoice" + i].y = 800;
        if (i == 3) {
            createjs.Tween.get(this["introchoice" + i]).wait(introTemp)
            .to({ y: 420 }, 200).wait(1000).call(handleComplete2_1);
        } else {
            createjs.Tween.get(this["introchoice" + i]).wait(introTemp)
                .to({ y: 420 }, 200);
        }
        introTemp += 100;
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
    introImg.visible=true;
    createjs.Tween.get(introImg).wait(100).to({ scaleX: .7, scaleY: .7 }, 300).to({ scaleX: .75, scaleY: .75 }, 300)
        .to({ scaleX: .7, scaleY: .7 }, 300).to({ scaleX: .75, scaleY: .75 }, 300)
        .to({ scaleX: .7, scaleY: .7 }, 300).wait(500).call(handleComplete4_1);
}
function handleComplete4_1() {

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
    container.parent.removeChild(introImg);
    introImg.visible = false;
    for (i = 1; i <= 3; i++) {

        container.parent.removeChild(this["introchoice" + i])
        this["introchoice" + i].visible = false;

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