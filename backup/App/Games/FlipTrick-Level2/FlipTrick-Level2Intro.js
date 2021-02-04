var introTitle, introQues1, introQuestxt, introChoice1, introChoice2, introChoice3, introHolder, introArrow, introfingure;
var introChoice1TweenArr = []
var highlightTweenArr = []
var setIntroCnt = 0
var removeIntraval = 0
var splitQues = []
var introsplitquestions = []

var introQues1X = 548, introQues1Y = 208
var introHolderX = 35, introHolderY = -110;
var introChoice1X = 155, introChoice1Y = -457;
var introChoice2X = 557, introChoice2Y = -457;
var introChoice3X = 968, introChoice3Y = -457;
var introArrowX = 160, introArrowY = 360;
var introfingureX = 175, introfingureY = 500;
var chposx1 = [, 123, 422, 719, 1017];
var chposy1 = [, -457, -457, -457, -457];
function commongameintro() {
    introTitle = Title.clone();
    introTitle.visible = true;
    container.parent.addChild(introTitle)
    introHolder = chHolderMc.clone()
    introQues1 = question.clone()
    introQuestxt = questionText.clone()
    introArrow = arrow1.clone()
    introfingure = fingure.clone()

    container.parent.addChild(introHolder)
    introHolder.visible = false;
    container.parent.addChild(introQuestxt)
    introQuestxt.visible = true;

    container.parent.addChild(introQues1)
    introQues1.x = introQues1X;
    introQues1.y = introQues1Y;

    introQues1.visible = false;
    introQues1.gotoAndStop(0)

    for (i = 1; i <= 4; i++) {
        introChoice1TweenArr[i] = this["choice" + i].clone()
        container.parent.addChild(introChoice1TweenArr[i])
        introChoice1TweenArr[i].visible = false;
        introChoice1TweenArr[i].x = chposx1[i] - 20
        introChoice1TweenArr[i].y = chposy1[i]
        introChoice1TweenArr[i].gotoAndStop(0);
    }
    for (i = 0; i < 4; i++) {
        splitQues[i] = introQues1.clone()
        container.parent.addChild(splitQues[i])
        splitQues[i].visible = false;
        splitQues[i].x = 720
        splitQues[i].y = 208
        splitQues[i].skewY = 180,
            splitQues[i].scaleX = splitQues[i].scaleY = 1.4;

    }
    for (i = 0; i < 4; i++) {
        introsplitquestions[i] = splitquestions.clone()
        container.parent.addChild(introsplitquestions[i])
        introsplitquestions[i].visible = false;
        introsplitquestions[i].y = 475
        introsplitquestions[i].gotoAndStop(i)
        introsplitquestions[i].scaleX = introsplitquestions[i].scaleY = 1

    }
    introsplitquestions[3].gotoAndStop(2)
    introsplitquestions[0].x = 161
    introsplitquestions[1].x = 460
    introsplitquestions[2].x = 755
    introsplitquestions[3].x = 1050
    introQuestxt.alpha = 0;
    introQuestxt.y = -250
    introQuestxt.x = 0
    createjs.Tween.get(introQuestxt).wait(1000)
        .to({ y: 0, alpha: .5 }, 100)
        .to({ y: 0, alpha: 1 }, 100)
    introHolder.visible = true
    introHolder.alpha = 0
    introHolder.y = -110
    introHolder.x = 30;
    introHolder.scaleX = introHolder.scaleY = .95
    createjs.Tween.get(introHolder).wait(800).to({ y: 15, alpha: 1 }, 500).call(handleComplete1_1);



}
function handleComplete1_1() {
    createjs.Tween.removeAllTweens();
    quesTween()
}

function quesTween() {
    introQues1.visible = true;
    introQues1.alpha = 0
    introQues1.scaleX = introQues1.scaleY = .95
    createjs.Tween.get(introQues1)
        .to({ x: introQues1.x, y: introQues1.y, scaleX: 1, scaleY: 1, alpha: 1 }, 1000)
        // .to({ x:725,  scaleX:-1, scaleY: 1, alpha: 1 }, 500)
        .call(handleComplete2_1)
}


function handleComplete2_1() {
    createjs.Tween.removeAllTweens();
    choiceTween()
}
function choiceTween() {
    for (i = 1; i <= 4; i++) {
      
        introChoice1TweenArr[i].y = chposy1[i]
        introChoice1TweenArr[i].visible = true;
        introChoice1TweenArr[i].alpha = 0;
        introChoice1TweenArr[i].y = -457
        if (i == 4) {
            createjs.Tween.get(introChoice1TweenArr[i])
                .to({ y: 450, rotation: 270, visible: true, alpha: 1, scaleX: .75, scaleY: .75 }, 1000, createjs.Ease.bounceInOut)
                .to({ y: 450, rotation: 360, visible: true, alpha: 1, scaleX: 1.2, scaleY: 1.2 }, 500, createjs.Ease.bounceInOut)
                .wait(500).call(handleComplete3_1);
        }
        else {
            createjs.Tween.get(introChoice1TweenArr[i])
                .to({ y: 450, rotation: 270, visible: true, alpha: 1, scaleX: .75, scaleY: .75 }, 1000, createjs.Ease.bounceInOut)
                .to({ y: 450, rotation: 360, visible: true, alpha: 1, scaleX: 1.2, scaleY: 1.2 }, 500, createjs.Ease.bounceInOut)
        }


    }

}
function handleComplete3_1() {
    createjs.Tween.removeAllTweens();
    createjs.Tween.get(introQues1)
        .to({ x: 720, scaleX: -1, scaleY: 1, alpha: 1 }, 500)
        .wait(1000)
        .call(splitquestion)
}
function splitquestion() {
    // var xarrsplite = [310, 707, 1098]
    var xarrsplite = [173, 474, 767, 1063]
    
    
    for (i = 0; i < 4; i++) {
        splitQues[i].visible = false;
        splitQues[i].alpha = 0
        splitQues[i].scaleX = splitQues[i].scaleY = .95;
        if (i == 3) {
            createjs.Tween.get(splitQues[i])
                .to({ x: 715, skewY: -180, alpha: 1, visible: true, scaleX: .95, scaleY: .95 }, 500)
                .to({ x: xarrsplite[i]+80, y: 490, alpha: 1, scaleX: .7, scaleY: .7 }, 1000)
                .to({ alpha: 1, scaleX: .7, scaleY: .7 }, 200)
                .to({ alpha: 0, scaleX: .65, scaleY: .65 })
                .call(handleComplete3_2)
        }
        else {
            createjs.Tween.get(splitQues[i])
                .to({ x: 715, skewY: -180, alpha: 1, visible: true, scaleX: .95, scaleY: .95 }, 500)
                .to({ x: xarrsplite[i]+80, y: 490, alpha: 1, scaleX: .7, scaleY: .7 }, 1000)
                .to({ alpha: 1, scaleX: .7, scaleY: .7 }, 200)
                .to({ alpha: 0, scaleX: .65, scaleY: .65 })
        }
    }

}
function handleComplete3_2() {
    createjs.Tween.removeAllTweens();
    for (i = 0; i < 4; i++) {
        splitQues[i].visible = false;
    }
    introsplitquestions.visible = true;
    setTimeout(split, 100)
}
function split() {
    for (i = 1; i <= 4; i++) {
        introChoice1TweenArr[i].visible = false;
    }
    for (i = 0; i < 4; i++) {
        introsplitquestions[i].visible = true;
        introsplitquestions[i].y = 515
       introsplitquestions[i].regX=introsplitquestions[i].regY=50
        introsplitquestions[i].scaleX = introsplitquestions[i].scaleY = 1.3;
        createjs.Tween.get(introsplitquestions[i])
            .to({ alpha: 1 }, 500).wait(1000)
    }
    createjs.Tween.get(introsplitquestions[0])
        .to({ scaleX: 1.4, scaleY: 1.4, alpha: 1 }, 1000).call(handleComplete3_3)
}
function handleComplete3_3() {
    createjs.Tween.removeAllTweens();

    createjs.Tween.get(introQues1)
        .to({ visible: true, x: 548, y: 208, scaleX: 1, scaleY: 1, alpha: 1 }, 1000)
    setTimeout(setArrowTween, 1000)
}
function setArrowTween() {
    for (i = 0; i < 4; i++) {
        splitQues[i].visible = false;
        introsplitquestions[i].visible = false;
    }
    for (i = 1; i <= 4; i++) {
        introChoice1TweenArr[i].visible = true;
    }
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
            .to({ y: introArrowY }, 350
            ).to({ y: introArrowY + 10 }, 350)
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
        introfingure.x = introfingureX;
        introfingure.y = introfingureY;
        highlightTweenArr[1] = new createjs.MovieClip()
        container.parent.addChild(highlightTweenArr[1])
        highlightTweenArr[1] = createjs.Tween.get(introfingure)
            .to({ x: introfingureX }, 350)
            .to({ x: introfingureX - 15 }, 350)
            .to({ x: introfingureX }, 350)
            .to({ x: introfingureX - 15 }, 350)
            .wait(200).call(this.onComplete2)

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
    introTitle.visible = false;
    container.parent.removeChild(introTitle)
    container.parent.removeChild(introArrow)
    introArrow.visible = false
    container.parent.removeChild(introfingure)
    introfingure.visible = false
    container.parent.removeChild(introQues1)
    introQues1.visible = false
    container.parent.removeChild(introQuestxt)
    introQuestxt.visible = false
    for (i = 1; i <= 4; i++) {
        container.parent.removeChild(introChoice1TweenArr[i])
        introChoice1TweenArr[i].visible = false;
    }
    for (i = 0; i < 4; i++) {
        container.parent.removeChild(introsplitquestions[i])
        introsplitquestions[i].visible = false;
        container.parent.removeChild(splitQues[i])
        splitQues[i].visible = false;
    }
    container.parent.removeChild(introHolder)
    introHolder.visible = false;
    if (highlightTweenArr[0]) {
        highlightTweenArr[0].setPaused(false);
        container.parent.removeChild(highlightTweenArr[0]);
    }
    if (highlightTweenArr[1]) {
        highlightTweenArr[1].setPaused(false);
        container.parent.removeChild(highlightTweenArr[1]);
    }
    container.parent.removeChild(introfingure);
    introfingure.visible = false;
}