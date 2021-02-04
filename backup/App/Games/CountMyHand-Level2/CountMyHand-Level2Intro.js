var  introTitle, introQuestxt, introHint,introHolder, introArrow, introfingure;
var introChoice1TweenArr = []
var introQues = [];
var introHint=[];
var highlightTweenArr = []
var setIntroCnt = 0
var removeIntraval = 0
var introArrowX = 610, introArrowY = 400;
var introfingureX = 650, introfingureY = 550;

var introxArr2 = [500, 580, 660]
var introyArr2 = [300, 150, 300]
var shuffleArr=[1,2,0];

function commongameintro() {
    introTitle = Title.clone();
    introTitle.visible = true;
    container.parent.addChild(introTitle);
    introQuestxt = questionText.clone(); 
    introArrow = arrow1.clone();
    introfingure = fingure.clone() ; 
    introHolder = qhHolder.clone();    
    container.parent.addChild(introHolder);
    introHolder.visible = false;     

    container.parent.addChild(introQuestxt);
    introQuestxt.visible = true;
    for (i = 0; i < 3; i++) {
        introQues[i] = question.clone();
        container.parent.addChild(introQues[i]);
        introQues[i].gotoAndStop(0);
        introQues[i].visible=false;
        introQues[i].scaleX=introQues[i].scaleY=.8;
        introQues[i].x = introxArr2[i];
        introQues[i].y = introyArr2[i];        
    }
    for (i = 0; i < 3; i++) {
        introHint[i] = introHint.clone();    
        container.parent.addChild(introHint[i]);
        introHint[i].visible = false; 
        introHint[i].gotoAndStop(i);
        introHint[i].scaleX=introHint[i].scaleY=.6;
        introHint[i].x = introxArr2[i];
        introHint[i].y = introyArr2[i];  
        }
 
    for (i = 0; i < 3; i++) {
        introChoice1TweenArr[i] = choice1.clone();
        container.parent.addChild(introChoice1TweenArr[i]);
        introChoice1TweenArr[i].gotoAndStop(shuffleArr[i])
        introChoice1TweenArr[i].scaleX=introChoice1TweenArr[i].scaleY=1.15
        introChoice1TweenArr[i].visible=false;
        introChoice1TweenArr[i].x = 230 + (i * 385)
        introChoice1TweenArr[i].y =550
    }
    introQuestxt.alpha = 0;
    introQuestxt.x=-200;
    createjs.Tween.get(introQuestxt)
        .to({ x:0,alpha: 1 }, 500)
        .call(handleComplete1_1);
}
function handleComplete1_1() {
    createjs.Tween.removeAllTweens();
    quesTween()
}
function quesTween() {
    introHolder.visible = true;
    introHolder.alpha = 0;
    introHolder.x = 0;
    introHolder.y = -190;
  
    createjs.Tween.get(introHolder)
        .to({y: 0, scaleX:1,scaleY:1,alpha: 1 }, 500);
        
/////////////////////////////////questionArr/////////////////////////////
var val=1000;
for (i = 0; i < 3; i++) {
    introQues[i].alpha=0;
    introQues[i].visible = true;  
if(i==2)   
{
 createjs.Tween.get(introQues[i]).wait(val)     
        .to({alpha: 1}, 250, createjs.Ease.bounceOut)    
        .call(handleComplete2_1);
}
else{
 createjs.Tween.get(introQues[i]).wait(val)         
 .to({alpha: 1}, 250, createjs.Ease.bounceOut) 
}
val=val+100
}          
}
function handleComplete2_1() {
    createjs.Tween.removeAllTweens();
   choiceTween();
}

  
function choiceTween() { 
///////////////////////////choice tween////////////////////////////////////
var val1=200
for (i = 0; i < 3; i++) {
    introChoice1TweenArr[i].visible = true;
    introChoice1TweenArr[i].alpha=0;     
  if(i==2)
  {
   createjs.Tween.get(introChoice1TweenArr[i]).wait(val1)      
       .to({ visible: true, alpha: 1,y:introChoice1TweenArr[i].y}, 200,  createjs.Ease.bounceIn)
       .to({ visible: true, alpha: 1,y:introChoice1TweenArr[i].y+25}, 200,  createjs.Ease.bounceIn)
       .to({ visible: true, alpha: 1,y:introChoice1TweenArr[i].y }, 100,  createjs.Ease.bounceIn).wait(500).call(handleComplete2_2);
  }
 else
  {
   createjs.Tween.get(introChoice1TweenArr[i]).wait(val1)
   .to({ visible: true, alpha: 1,y:introChoice1TweenArr[i].y}, 200,  createjs.Ease.bounceIn)
   .to({ visible: true, alpha: 1,y:introChoice1TweenArr[i].y+25}, 200,  createjs.Ease.bounceIn)
   .to({ visible: true, alpha: 1,y:introChoice1TweenArr[i].y }, 100,  createjs.Ease.bounceIn);
  }
  val1=val1+100
     }
}
function handleComplete2_2() {
    createjs.Tween.removeAllTweens();
   hintTween();
}  
function hintTween() { 

///////////////////////////choice tween////////////////////////////////////
var tempval=200
for (i = 0; i < 3; i++) {   
    introHint[i].visible = true; 
    introHint[i].alpha=0;     
    if(i==2)   
    {
     createjs.Tween.get(introHint[i]).wait(tempval)     
            .to({alpha: 1}, 250, createjs.Ease.bounceOut).wait(1000)  
            .call(handleComplete3_1);
    }
    else{
     createjs.Tween.get(introHint[i]).wait(tempval)         
     .to({alpha: 1}, 250, createjs.Ease.bounceOut)
     
    }
    tempval=tempval+100
    }
}  
  function handleComplete3_1() {
    createjs.Tween.removeAllTweens();
    answerTween()
}

function answerTween() {   
    for (i = 0; i < 3; i++) {
        introHint[i].alpha=0;   
        introQues[i].alpha=1;       
    }
    createjs.Tween.get(introChoice1TweenArr[0])      
    .to({ alpha:0.5}, 500)
    createjs.Tween.get(introChoice1TweenArr[2])      
    .to({ alpha:0.5}, 500)

    createjs.Tween.get(introChoice1TweenArr[1])      
       .to({ scaleX:1.1,scaleY:1.1}, 500)
       .to({ scaleX:1.15,scaleY:1.15}, 500)
       .to({ scaleX:1.1,scaleY:1.1}, 500)
       .to({ scaleX:1.15,scaleY:1.15}, 500) .call(handleComplete3_2);
}
function handleComplete3_2() {
    createjs.Tween.removeAllTweens();
    setTimeout(setArrowTween, 500)
}
function setArrowTween() { 
    if (stopValue == 0) {
        console.log("setArrowTween  == stopValue")
        removeGameIntro()
    }
    else {
        console.log("ARROWtWEEN1234")
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
            .wait(400)
            .call(this.onComplete1)

    }
}

function setFingureTween() {
    console.log("FINGUREtWEEN1234")
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
    container.parent.removeChild(introTitle)
    introTitle.visible = false
    container.parent.removeChild(introArrow);
    introArrow.visible = false;
    container.parent.removeChild(introfingure);
    introfingure.visible = false;
    container.parent.removeChild(introHolder);
    introHolder.visible = false;   
    for (i = 0; i < 3; i++) {
       
        container.parent.removeChild(introHint[i]);
        introHint[i].visible = false; 
    }
  

    container.parent.removeChild(introQuestxt);
    introQuestxt.visible = false;
    for (i = 0; i < 3; i++) { 
        container.parent.removeChild(introQues[i]);
        introQues[i].visible=false;
    }
    for (i = 0; i < 3; i++) {
        container.parent.removeChild(introChoice1TweenArr[i]);
        introChoice1TweenArr[i].visible=false;
      
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