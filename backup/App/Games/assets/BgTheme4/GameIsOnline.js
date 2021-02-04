 
 var setCanvas = document.getElementById("gameCanvas");
 
 console.log("canvas= "+setCanvas)
 stage = new createjs.Stage(setCanvas); 
 var errorContainer = new createjs.Container();
 stage.addChild(errorContainer)

var iErrorInterval 
 
console.log("errorContainer== "+errorContainer)
var iBg = new createjs.Shape();
iBg.graphics.clear()
iBg.graphics.beginFill("#000000").drawRoundRect(0, 0, 1280, 720, 10);
iBg.visible = false;
errorContainer.addChild(iBg)

var isOnlineOrNotText = new createjs.Text("Please check your internet connectivity!", "30px Lato-Bold", "white");
isOnlineOrNotText.x = 500; 
isOnlineOrNotText.y = 420;
isOnlineOrNotText.textAlign = "center";
isOnlineOrNotText.textBaseline = "middle";
errorContainer.addChild(isOnlineOrNotText)
isOnlineOrNotText.visible = false;
 
createjs.Ticker.addEventListener("tick", isGameOnlineHandler);
 
function isGameOnlineHandler(evt){
     
    var isOnline = navigator.onLine;
        console.log("isOnline= " + isOnline)
        if (!isOnline) {
            console.log("Please check your internet connectivity!");
            iBg.visible = true;
            isOnlineOrNotText.visible = true;            
            iErrorInterval =  setInterval(autoReloadFn, 3000);
        } else {
            console.log("internet connected");
            iBg.visible = false;
            isOnlineOrNotText.visible = false;
        }
}
function autoReloadFn(){    
    clearInterval(iErrorInterval);
    window.location.reload(1);
}

