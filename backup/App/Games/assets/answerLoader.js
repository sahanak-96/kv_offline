var c1, c2, c3, pointercnt = 0;

var loader, container1, bgs;

var tset;

var loadingText;

var tx = -1;
var txflag = 0;

function callLoader() {
    console.log(" call Loader .. ")

    container1 = new createjs.Container();

    stage.addChild(container1)

    bgs = new createjs.Shape();

    c1 = new createjs.Shape();

    c2 = new createjs.Shape();

    c3 = new createjs.Shape();

    // container1.parent.addChild(bgs);

    //  container1.parent.addChild(c1);

    //  container1.parent.addChild(c2);

    //  container1.parent.addChild(c3);

    bgs.graphics.clear()

    //bgs.graphics.beginFill("#000000").drawRoundRect(0, 0, stage.canvas.width, stage.canvas.height, 10);
    bgs.graphics.beginFill("#000000").drawRoundRect(0, 0, 1280, 720, 10);

    bgs.alpha = .2;

    c1.graphics.beginFill("#FFFFF8").drawCircle(100, 100, 8);

    c1.x = 480; c1.y = 355;

    c2.graphics.beginFill("#FFFFF8").drawCircle(100, 100, 8);

    c2.x = 530; c2.y = 355;

    c3.graphics.beginFill("#FFFFF8").drawCircle(100, 100, 8);

    c3.x = 580; c3.y = 355;

    loadingText = new createjs.Text("Question Loading", "35px Veggieburger-Bold", "white");



    loadingText.x = 635; loadingText.y = 420;

    loadingText.textAlign = "center";

    loadingText.textBaseline = "middle";

    tset = setInterval(rotatetext, 400);

    var data = new createjs.SpriteSheet({

        framerate: 2,

        "images": ["assets/Preloader.png"],

        "frames": { "regX": 50, "height": 104, "count": 0, "regY": 0, "width": 104 },

    });

    loader = new createjs.Sprite(data);

    loader.x = 630;

    loader.y = 250;

    loader.gotoAndPlay(0);

    //container1.parent.addChild(loader);

    createjs.Ticker.addEventListener("tick", tick1);

}







function tick1(e) {

    stage.update();

    if (tx == 1) {
        closeBtn.mouseEnabled = false;
        fullScreenBtn.mouseEnabled = false;
        volumeBtn.mouseEnabled = false;




        stage.addChild(container1);

        container1.parent.addChild(bgs);



        container1.parent.addChild(c1);

        container1.parent.addChild(c2);

        container1.parent.addChild(c3);

        container1.parent.addChild(loader);
        container1.parent.addChild(loadingText);

        if (loader.currentFrame >= 35) {

            loader.gotoAndPlay(1);

        }


    }

    else if (tx == 0) {

        if (txflag == 0) {
            closeBtn.mouseEnabled = true;
            fullScreenBtn.mouseEnabled = true;
            volumeBtn.mouseEnabled = true;


            container1.parent.removeChild(bgs);
            container1.parent.removeChild(c1);

            container1.parent.removeChild(c2);

            container1.parent.removeChild(c3);

            container1.parent.removeChild(loader);
            container1.parent.removeChild(loadingText);

        }

        txflag = 1;




    }



}

function rotatetext() {

    tset = 0;

    clearInterval(tset);

    pointercnt++;



    var colorArray = ["orange", "yellow", "green"];

    if (loadingText.text == "Question Loading...") {

        loadingText.text = "Question Loading";



    }

    else {

        loadingText.text += ".";

    }

    if (pointercnt == 4) {

        pointercnt = 0;

        c1.graphics.clear().beginFill("#FFFFF8").drawCircle(100, 100, 8).endFill();

        c2.graphics.clear().beginFill("#FFFFF8").drawCircle(100, 100, 8).endFill();

        c3.graphics.clear().beginFill("#FFFFF8").drawCircle(100, 100, 8).endFill();



    }

    else {

        this["c" + pointercnt].graphics.clear().beginFill(colorArray[pointercnt - 1]).drawCircle(100, 100, 8).endFill();

    }

}

