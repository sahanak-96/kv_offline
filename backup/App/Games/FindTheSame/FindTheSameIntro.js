
var highlightTweenArr = [];
var setIntroCnt = 0;
var removeIntraval = 0;
var introQues1=[]
var introArrowX = 210, introArrowY = 250;
var introfingureX = 300, introfingureY = 500;
var introTitle, introQuesText, introHolder, introQues;
var introposX=[, 165, 560, 965];
var introposY=[,370,495,370]

function commongameintro() {
    introArrow = arrow1.clone()
    container.parent.addChild(introArrow)
    introfingure = fingure.clone()
    container.parent.addChild(introfingure)
    // // ///////////////////////////////////////Title//////////////////
    introTitle = Title.clone()
    container.parent.addChild(introTitle)
    introTitle.visible = true

    // // //////////////////////////////////////////////Question Text//////////
    introQuesText = questiontext.clone()
    container.parent.addChild(introQuesText)
    introQuesText.visible = true
    // // //////////////////////////////////////////////qhHolder//////////
    introHolder = qhHolder.clone()
    container.parent.addChild(introHolder)
    introHolder.visible = true


    // // //////////////////////////////////////////Question/////////////
    introQues = question.clone()
    container.parent.addChild(introQues)
    introQues.x = -500; introQues.y = 190;
    introQues.visible = false

    // // /////////////////////////////////////////choice/////////////////////

    for (i = 1; i <= 3; i++) {
        choiceArr[i] = this["choice" + i].clone();
        choiceArr[i].visible = false;
        choiceArr[i].x=introposX[i]
        choiceArr[i].y=-520
        container.parent.addChild(choiceArr[i]);
    }

    for (i = 1; i <= 3; i++) {  
        introQues1[i] = question.clone()
        container.parent.addChild(introQues1[i])
        introQues1[i].x = 550; introQues1[i].y = 190;
        introQues1[i].visible = false
        }

        
    introQuesText.alpha = 0 
    introQuesText.x=-500
    createjs.Tween.get(introQuesText).to({x:0, alpha: 1 }, 1000)
    
    introHolder.alpha = 0;
    introHolder.x=-500
    createjs.Tween.get(introHolder).to({ x:0, alpha: 1 }, 1000)
    .call(handleComplete1_0);

}

function handleComplete1_0() {
    if (stopValue == 0) {
        removeGameIntro()
    }
    else {
        createjs.Tween.removeAllTweens()
        questionTween()
    }
}

function questionTween() {

    introQues.visible = false
    introQues.scaleX=introQues.scaleY=-1.2;   
    createjs.Tween.get(introQues).to({visible:true,  x:550, scaleX: 1, scaleY:1, alpha: 1 }, 500).call(handleComplete3_0)


}
function handleComplete3_0() {
    if (stopValue == 0) {
        removeGameIntro()
    }
    else {
        createjs.Tween.removeAllTweens()
        choiceTween()
    }
}

function choiceTween() {
    var tempVal= 100;
   
    for (i = 1; i <= 3; i++) {
        choiceArr[i].visible = false;
        choiceArr[i].alpha = 0;
        if (i == 3) {
            createjs.Tween.get(choiceArr[i])
            .wait(tempVal).to({y:introposY[i], visible: true, alpha: 1 }, 500,createjs.Ease.bounceOut)
            .wait(200).call(handleComplete4_1);
        }
        else {
            createjs.Tween.get(choiceArr[i])
            .wait(tempVal).to({ y:introposY[i],visible: true, alpha: 1 }, 500,createjs.Ease.bounceOut)
          

        }
        tempVal += 100;

    }
}
function handleComplete4_1()
{
    createjs.Tween.removeAllTweens()
    SplitTween()
}
function SplitTween() {
    var tempVal1= 100;
    for (i = 1; i <= 3; i++) {
        introQues1[i].visible = true;
        introQues1[i].alpha = 0;
        if (i == 3) {
            createjs.Tween.get(introQues1[i])
            .wait(tempVal1)
            .to({alpha: 1 }, 250)
            .to({ x:introposX[i],y:introposY[i], visible: true, alpha: 1 }, 500)
            .to({alpha:0},500)
           
        }
       else if (i == 2) {
            createjs.Tween.get(introQues1[i])
            .wait(tempVal1)
            .to({alpha: 1 }, 250)
            .to({ x:introposX[i],y:introposY[i], visible: true, alpha: 1 }, 500)
            .to({alpha:0},500)
       }
        else {
            createjs.Tween.get(introQues1[i])
            .wait(tempVal1)
            .to({  alpha: 1 }, 250)
            .to({ x:introposX[i],y:introposY[i],visible: true, alpha: 1 }, 500)
            .to({alpha:0},500);

        }    
        }
        for (i = 1; i <= 3; i++) {
         
            if (i == 3) {
                createjs.Tween.get(choiceArr[i]).wait(2000)
                .to({y:introposY[i]-20, alpha: 1 }, 50)
                .to({y:introposY[i], alpha: 1 }, 50)
                .to({y:introposY[i]+20, alpha: 1 }, 50)
                .to({y:introposY[i], alpha: 1 }, 50)
                .wait(500)
              .call(handleComplete4_2);
            }
           else if (i == 2) {
                createjs.Tween.get(choiceArr[i]).wait(2000)
               .to({y:introposY[i]-20, alpha: 1 }, 50)
                .to({y:introposY[i], alpha: 1 }, 50)
                .to({y:introposY[i]+20, alpha: 1 }, 50)
                .to({y:introposY[i], alpha: 1 }, 50)
            
            }
            else {
                createjs.Tween.get(choiceArr[i]).wait(2000)               
                .to({ alpha: 1 },500)
              
    
            }
       
    
        }
      

   

}

function handleComplete4_2() {
    createjs.Tween.removeAllTweens()
    choiceMove()

}


function choiceMove() {
    for (i = 1; i <= 3; i++) {
        introQues1[i].visible = false;
    }
    for (i = 1; i <= 3; i++) {

        if (i == 1) {
            createjs.Tween.get(choiceArr[i]).to({ visible: true, alpha: 1}, 200).to({ visible: true, alpha: 1 }, 300).wait(500)
            
        }
        else {
            createjs.Tween.get(choiceArr[i]).to({ visible: true, alpha: 1}, 200).to({ visible: true, alpha: 1 }, 300).wait(500).to({alpha:0.5}).wait(500)

        }
       }
       createjs.Tween.get(choiceArr[1]).to({scaleX:0.9,scaleY:0.9,},500).to({scaleX:1,scaleY:1},500)
       .to({scaleX:0.9,scaleY:0.9},500).to({scaleX:1,scaleY:1},500)
       .wait(200).call(handleComplete5_0);
        
}

function handleComplete5_0() {
    

    createjs.Tween.removeAllTweens()

    setArrowTween()
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
            .to({ y: introArrowY + 10 }, 350).to({ y: introArrowY })
            .to({ y: introArrowY + 10 }, 350)
            .to({ y: introArrowY }, 350)
            .to({ y: introArrowY + 10 }, 350)
            .to({ y: introArrowY }, 350).wait(400).call(this.onComplete1)
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
            .to({ x: introfingureX }, 350).to({ x: introfingureX - 15 }, 350)
            .to({ x: introfingureX }, 350).to({ x: introfingureX - 15 }, 350)
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
        console.log("setCallDelay  == stopValue")

        setTimeout(setCallDelay, 500)

    }
}
function setCallDelay() {

    createjs.Tween.removeAllTweens();

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
    container.parent.removeChild(introArrow)
    introArrow.visible = false
    container.parent.removeChild(introfingure)
    introfingure.visible = false
    container.parent.removeChild(introTitle)
    introTitle.visible = false
    
    container.parent.removeChild(introQues)
    introQues.visible = false
    container.parent.removeChild(introHolder)
    introHolder.visible = false
    container.parent.removeChild(introQuesText)
    introQuesText.visible = false

    for (i = 1; i <= 3; i++){
        container.parent.removeChild(choiceArr[i])
        choiceArr[i].visible = false;
    }
    for (i = 1; i <= 3; i++){
        container.parent.removeChild(introQues1[i])
        introQues1[i].visible = false;
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
