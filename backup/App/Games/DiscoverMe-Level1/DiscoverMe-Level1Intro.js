var introTitle,introQues, introQuestxt, introChoice1, introChoice2, introHolder, introHolder1, introArrow, introfingure;
var introChoice1TweenArr = []
var highlightTweenArr = []
var setIntroCnt = 0
var removeIntraval = 0
var introQuesX = 470, introQuesY = 210
var introChoice1X = 330, introChoice1Y = -490;
var introChoice2X = 890, introChoice2Y = -490;
var introArrowX = 330, introArrowY = 390;
var introfingureX = 350, introfingureY = 550;
var introquestionArr = []

var introxArr2 = [530, 660, 530, 660]
var introyArr2 = [220, 220, 350, 350]
function commongameintro() {
    introTitle = Title.clone();
    introTitle.visible = true;
    container.parent.addChild(introTitle);
    introQues = question.clone();
    introQuestxt = questionText.clone();
    introChoice1 = choice1.clone();
    introChoice2 = choice2.clone();
    introArrow = arrow1.clone();
    introfingure = fingure.clone();
    introHolder = qhHolderMc.clone();
    introHolder1 = chHolderMc.clone();
    container.parent.addChild(introHolder);
    introHolder.visible = false;
    container.parent.addChild(introHolder1);
    introHolder1.visible = false;
    container.parent.addChild(introQues);
    introQues.x = introQuesX;
    introQues.y = introQuesY;
    introQues.visible = false;
    introQues.scaleX=introQues.scaleY = .8;

    container.parent.addChild(introQuestxt);
    introQuestxt.visible = true;
    container.parent.addChild(introChoice1);
    introChoice1.x = introChoice1X;
    introChoice1.y = introChoice1Y;
    introChoice1.visible = false;
    introChoice1.gotoAndStop(0);
    introChoice1.scaleX=introChoice1.scaleY = .6;
    container.parent.addChild(introChoice2);
    introChoice2.visible = false;
    introChoice2.x = introChoice2X;
    introChoice2.y = introChoice2Y;
    introChoice2.gotoAndStop(0);
    introChoice2.scaleX=introChoice2.scaleY = .6;
    introQuestxt.alpha = 0;
    introQuestxt.x=-1000
    createjs.Tween.get(introQuestxt).to({ x:0,alpha: 1 }, 1000).call(handleComplete1_1);
}
function handleComplete1_1() {
    createjs.Tween.removeAllTweens();
    quesTween()
}

function quesTween() {

    introHolder.visible = true;   
    introHolder.alpha = 0;
    introHolder.x=-1000;
    createjs.Tween.get(introHolder).to({x:0, alpha: 1 }, 500);
    introHolder1.visible = true;   
    introHolder1.alpha = 0;
    introHolder1.x=-1000;
    createjs.Tween.get(introHolder1).to({x:0, alpha: 1 }, 500);
    introQues.visible = true;
    introQues.alpha = 0;
    createjs.Tween.get(introQues).wait(500)
    .to({ alpha: 1 }, 1000).call(handleComplete2_1);
}
function handleComplete2_1() {
    createjs.Tween.removeAllTweens();
    choiceTween();
}
function choiceTween() {

    introChoice1.visible = true;
    introChoice1.alpha=0;
    introChoice1.regX=introChoice1.regY=100;
    introChoice2.visible = true;
    introChoice2.regX=introChoice2.regY=100;
    introChoice2.alpha=0;
   createjs.Tween.get( introChoice1)
                .to({ y: 545, rotation: 180, scaleX: .5, scaleY: .5, alpha: .5 }, 250)
                .to({  rotation: 360, scaleX: .6, scaleY: .6, alpha: 1 }, 500).wait(250)
     
      createjs.Tween.get( introChoice2)
            .to({  y: 545, rotation: 180, scaleX: .5, scaleY: .5, alpha: .5 }, 250)
            .to({  rotation: 360, scaleX: .6, scaleY: .6, alpha: 1 }, 500).wait(250) 
     

    
    createjs.Tween.get(introChoice1).wait(1000)
    .to({ scaleX:.5,scaleY:.5}, 250)
    .to({ scaleX:.6,scaleY:.6}, 250)
    .to({ scaleX:.5,scaleY:.5}, 250)
    .to({ scaleX:.6,scaleY:.6}, 250).wait(500)
    .call(handleComplete3_1);
 
}

function handleComplete3_1() {
    setArrowTween();
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
        highlightTweenArr[0] = new createjs.MovieClip();
        container.parent.addChild(highlightTweenArr[0]);
        highlightTweenArr[0] = createjs.Tween.get(introArrow)
        .to({ y: introArrowY + 10 }, 350)
        .to({ y: introArrowY }, 350)
        .to({ y: introArrowY + 10 }, 350)
            .to({ y: introArrowY }, 350)
          .wait(400).call(this.onComplete1);

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
        highlightTweenArr[1] = new createjs.MovieClip();
        container.parent.addChild(highlightTweenArr[1]);
        highlightTweenArr[1] = createjs.Tween.get(introfingure)
        .to({ x: introfingureX }, 350)
        .to({ x: introfingureX - 15 }, 350)
        .to({ x: introfingureX }, 350).to({ x: introfingureX - 15 }, 350).wait(200).call(this.onComplete2);
        //setTimeout(setstarAnimation, 1000)
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

    // // for (i = 0; i < 2; i++) {
    if (highlightTweenArr[1]) {
        console.log("onComplete2")
        container.parent.removeChild(highlightTweenArr[1]);
    }
    // // }
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
    clearInterval(removeIntraval);
    removeIntraval = 0;
    setIntroCnt++;
    console.log("check cnt = " + setIntroCnt);
    removeGameIntro();
    if (stopValue == 0) {
        console.log("setCallDelay  == stopValue");
        removeGameIntro();
    }
    else {
        commongameintro();
        if (setIntroCnt > 0) {
            isVisibleStartBtn();
        }
    }

}
function removeGameIntro() {
    createjs.Tween.removeAllTweens();
    
    container.parent.removeChild(introTitle)
    introTitle.visible = false
    container.parent.removeChild(introArrow);
    introArrow.visible = false;
    container.parent.removeChild(introfingure);
    introfingure.visible = false;
    container.parent.removeChild(introQues);
    introQues.visible = false;
    container.parent.removeChild(introQuestxt);
    introQuestxt.visible = false;
    container.parent.removeChild(introHolder);
    introHolder.visible = false;
    container.parent.removeChild(introHolder1);
    introHolder1.visible = false;
    container.parent.removeChild(introChoice1);
    introChoice1.visible = false;
    container.parent.removeChild(introChoice2);
    introChoice2.visible = false;
    container.parent.removeChild(introHolder);
    introHolder.visible = false;
    container.parent.removeChild(introHolder1);
    introHolder1.visible = false;

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