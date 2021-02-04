

//////////////////////////////////////////////////////////////////======LOADER=======///////////////////////////////////////////////////////////////////////
var wrongSnd, gameOverSnd, timeOverSnd, correctSnd, BetterLuck, Excellent, Nice, Good, Super, TryAgain;
var scoreImgMc, ResponseImgMc, questionImgMc, AttemptsImgMc, CorrectImgMc;
var intChkVar = -1

//var introStartCnt = -1;
var titleName;
var TitleBtn, TitleBtn1, TitleBtn2, TitleBtn3;
var TitleContaier;
//var introStartCnt = -1;
var TotalAssetsCnt = 45;
function createLoader() {

    loaderColor = createjs.Graphics.getRGB(255, 51, 51, 1);
    loaderBar = new createjs.Container();
    var txt = new createjs.Container();
    bar = new createjs.Shape();
    bar.graphics.beginFill(loaderColor).drawRect(0, 0, 1, barHeight).endFill();
    loaderWidth = 600;

    //

    loadProgressLabel = new createjs.Text("", "30px lato-bold", "black");
    loadProgressLabel.lineWidth = 400;
    loadProgressLabel.textAlign = "center";
    txt.addChild(loadProgressLabel)
    txt.x = 260;
    txt.y = 35;


    //
    var bgBar = new createjs.Shape();
    var padding = 3
    bgBar.graphics.setStrokeStyle(1).beginStroke(loaderColor).drawRect(-padding / 2, -padding / 2, loaderWidth + padding, barHeight + padding);
    loaderBar.x = 1300 - loaderWidth >> 1;
    loaderBar.y = 1220 - barHeight >> 1;
    loaderBar.addChild(bar, bgBar, txt);
    stage.addChild(loaderBar);

}


//////////////////////////////////////////////////////////////////======DEFAULT MANIFEST ASSETS=======////////////////////////////////////////////////////////



function createManifest() {

    var VarTitle = GameNameWithLvl + "-Title.png";

    /* Always specify the following terms as given  

         1. redirecturl.json path as "redirectJsonPath"

         2. Intro text image name as "IntroScreen.png""

    */



    manifest = [



        ////////////////////===PARROT IMAGES====////////////////



        { id: "correctImg", src: assetsPathLang + "wow.png" },
        { id: "wrongImg", src: assetsPathLang + "oops.png" },
        { id: "gameOverImg", src: assetsPathLang + "gameover.png" },
        { id: "timeOverImg", src: assetsPathLang + "timeover.png" },
        //////////////////====AUDIO=====//////////////////////// //4

        { id: "begin", src: assetsPathLang + "bg_snd.ogg" },
        { id: "correct", src: assetsPathLang + "wow_s.ogg" },
        { id: "wrong", src: assetsPathLang + "oops_s.ogg" },
        { id: "gameOver", src: assetsPathLang + "Game_over.ogg" },
        { id: "timeOver", src: assetsPathLang + "timeover_s.ogg" },
        { id: "tick", src: assetsPathLang + "TickSound.ogg" },


        /////////////////////===RESULT===///////////////////// 10

        { id: "resultLoading", src: assetsPathLang + "ResultLoading.jpg" },
        { id: "domainPath", src: redirectJsonPath + "redirecturl_org.json" },
        ///////////////////====OTHERS====///////////////////// 12
        { id: "startBtn", src: assetsPathLang + "StartButton.png" },
        { id: "IntroStartBtn", src: assetsPathLang + "IntroStartBtn.png" },

        /////////////////=====COMMON GAME ASSETS=====/////////////////14

        //common game assets
        { id: "backGround", src: assetsPath + bgTheme + "/Background.png" },
        { id: "backGround1", src: assetsPath + bgTheme + "/Background1.png" },
        { id: "backGround2", src: assetsPath + bgTheme + "/Background2.png" },
        { id: "backGround3", src: assetsPath + bgTheme + "/Background3.png" },
        { id: "uniquebackGround", src: gameAssetsPath + "/Background.png" },
        { id: "Title", src: "commonTitle/" + VarTitle },
        ///////////////////////////////////////////////////////////////20
        { id: "Grid", src: assetsPath + "Grid.png" },
        { id: "arrow1", src: assetsPath + "Arrow1.png" },
        { id: "fingure", src: assetsPath + "Fingure.png" },
        { id: "handCursor", src: assetsPath + "handCursor.png" },
        { id: "SkipBtn", src: assetsPathLang + "SkipBtn.png" },
        { id: "HowToPlayScreen", src: assetsPathLang + "HowToPlayScreen.png" },
        { id: "HowToPlayScreenImg", src: assetsPathLang + "HowToPlayScreen1.png" },
        { id: "howToPlay", src: assetsPathLang + "HowToPlay.js" },
        { id: "scoreImgMc", src: assetsPath + "Score.png" },
        { id: "ResponseImgMc", src: assetsPath + "ResponseTime.png" },
        { id: "questionImgMc", src: assetsPath + "questionImg.png" },
        { id: "AttemptsImgMc", src: assetsPath + "Attempts.png" },
        { id: "CorrectImgMc", src: assetsPath + "Correct.png" },
        { id: "closeBtn", src: assetsPath + "closeBtn.png" },
        { id: "closeBtnFinal", src: assetsPath + "closeBtn.png" },
        { id: "nxtBtnFinal", src: assetsPath + "nxtBtn.png" },
        { id: "timerMc", src: assetsPath + "timerMc.png" },
        { id: "scoreMc", src: assetsPath + "scoreMc.png" },
        { id: "volumeBtn", src: assetsPath + "volumeBtn.png" },
        { id: "QuesCntMc", src: assetsPath + "QuesCntMc.png" },
        { id: "fullScreenBtn", src: assetsPath + "fullscreenBtn.png" },
        ////////////////////////////////////////////////////////////////////39
        { id: "GameFinishedImg", src: assetsPath + "GameFinished.png" },
        /////////////////////////////////////////////////////////////////////40
        { id: "TitleBtn1", src: assetsPath + "titleBtn1.png" },
        { id: "TitleBtn2", src: assetsPath + "titleBtn2.png" },
        { id: "TitleBtn3", src: assetsPath + "titleBtn3.png" }
        /////////////////////////////////////////////////////////////////////43
    ];

    return 1;

}



//////////////////////////////////////////////////////////////////======PRELOADING OF ASSETS=======///////////////////////////////////////////////////////////



function preloadAllAssets() {

    createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]);

    if (!createjs.Sound.initializeDefaultPlugins()) { return; }



    createjs.Sound.alternateExtensions = ["mp3"];

    createjs.WebAudioPlugin.playEmptySound();

    preload = new createjs.LoadQueue(true);

    preload.installPlugin(createjs.Sound);

    preload.addEventListener("complete", doneLoading); // add an event listener for when load is completed

    preload.addEventListener("fileload", fileLoaded);

    preload.addEventListener("progress", updateLoading);

    preload.loadManifest(manifest);

    stage.update();

}



function updateLoading(event) {

    bar.scaleX = event.loaded * loaderWidth;



    progresPrecentage = Math.round(event.loaded * 100);



    loadProgressLabel.text = "              " + progresPrecentage + "% Game Loading...";

    stage.update();

}



function fileLoaded(e) {

    assets.push(e);



}



function doneLoading(event) {



    loaderBar.visible = false;
    bar.visible = false;
    stage.removeChild(loaderBar);
    stage.update();
    var len = assets.length
    console.log("assets.length=" + len)
    for (i = 0; i < len; i++) {
        //   if (i < 24) { with parrot
        if (i < TotalAssetsCnt) {

            var event = assets[i];

            var id = event.item.id;

            console.log(id)

            if (id == "TitleBtn1") {
                var spriteSheet4 = new createjs.SpriteSheet({
                    framerate: 30,
                    "images": [preload.getResult("TitleBtn1")],
                    "frames": { "regX": 50, "height": 148, "count": 0, "regY": 50, "width": 148 },
                    // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                });
                //
                TitleBtn1 = new createjs.Sprite(spriteSheet4);
                container.parent.addChild(TitleBtn1);
                TitleBtn1.x = 230; TitleBtn1.y = 60;
                TitleBtn1.visible = false;
                continue;
            }

            if (id == "TitleBtn2") {
                var spriteSheet4 = new createjs.SpriteSheet({
                    framerate: 30,
                    "images": [preload.getResult("TitleBtn2")],
                    "frames": { "regX": 50, "height": 148, "count": 0, "regY": 50, "width": 148 },
                    // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                });
                //
                TitleBtn2 = new createjs.Sprite(spriteSheet4);
                container.parent.addChild(TitleBtn2);
                TitleBtn2.x = 230; TitleBtn2.y = 60;
                TitleBtn2.visible = false;
                continue;
            }

            if (id == "TitleBtn3") {
                var spriteSheet4 = new createjs.SpriteSheet({
                    framerate: 30,
                    "images": [preload.getResult("TitleBtn3")],
                    "frames": { "regX": 50, "height": 148, "count": 0, "regY": 50, "width": 148 },
                    // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                });
                //
                TitleBtn3 = new createjs.Sprite(spriteSheet4);
                container.parent.addChild(TitleBtn3);
                TitleBtn3.x = 230; TitleBtn3.y = 60;
                TitleBtn3.visible = false;
                continue;
            }

            if (id == "Grid") {
                Grid = new createjs.Bitmap(preload.getResult('Grid'));
                container.parent.addChild(Grid);
                Grid.visible = false;
                continue;
            }

            if (id == "closeBtn") {
                closeBtn = new createjs.Bitmap(preload.getResult('closeBtn'));
                container.parent.addChild(closeBtn);
                closeBtn.x = closeBtn.x + 15
                closeBtn.y = closeBtn.y + 0
                closeBtn.visible = false;
                continue;
            }
            if (id == "closeBtnFinal") {
                closeBtnFinal = new createjs.Bitmap(preload.getResult('closeBtnFinal'));
                container.parent.addChild(closeBtnFinal);
                closeBtnFinal.visible = false;
                closeBtnFinal.x = closeBtnFinal.x + 115
                closeBtnFinal.y = closeBtnFinal.y - 10
                continue;
            }
            if (id == "nxtBtnFinal") {
                nxtBtnFinal = new createjs.Bitmap(preload.getResult('nxtBtnFinal'));
                container.parent.addChild(nxtBtnFinal);
                nxtBtnFinal.visible = false;
                nxtBtnFinal.x = 1050; nxtBtnFinal.y = 100
                continue;
            }
            if (id == "scoreMc") {
                scoreMc = new createjs.Bitmap(preload.getResult('scoreMc'));
                container.parent.addChild(scoreMc);
                scoreMc.y = scoreMc.y + 0
                scoreMc.visible = false;
                continue;
            }
            if (id == "QuesCntMc") {
                QuesCntMc = new createjs.Bitmap(preload.getResult('QuesCntMc'));
                container.parent.addChild(QuesCntMc);
                QuesCntMc.y = QuesCntMc.y + 0
                QuesCntMc.visible = false;
                continue;
            }
            if (id == "timerMc") {
                timerMc = new createjs.Bitmap(preload.getResult('timerMc'));
                container.parent.addChild(timerMc);
                timerMc.visible = false;
                timerMc.scaleX = timerMc.scaleY = .21
                timerMc.x = 133.5; timerMc.y = 27.5;
                continue;
            }
            if (id == "fullScreenBtn") {
                var spriteSheet4 = new createjs.SpriteSheet({
                    framerate: 30,
                    "images": [preload.getResult("fullScreenBtn")],
                    "frames": { "regX": 50, "height": 48, "count": 0, "regY": 50, "width": 52 },
                    // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                });
                //
                fullScreenBtn = new createjs.Sprite(spriteSheet4);
                container.parent.addChild(fullScreenBtn);
                fullScreenBtn.x = 1006; fullScreenBtn.y = 66;
                fullScreenBtn.visible = false;
                continue;
            }

            if (id == "volumeBtn") {
                var spriteSheet5 = new createjs.SpriteSheet({
                    framerate: 30,
                    "images": [preload.getResult("volumeBtn")],
                    "frames": { "regX": 50, "height": 48, "count": 0, "regY": 50, "width": 52 },
                    // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                });
                //
                volumeBtn = new createjs.Sprite(spriteSheet5);
                container.parent.addChild(volumeBtn);
                volumeBtn.x = 1084; volumeBtn.y = 66;
                volumeBtn.visible = false;
                continue;

            }

            if (id == "arrow1") {

                arrow1 = new createjs.Bitmap(preload.getResult('arrow1'));
                container.parent.addChild(arrow1);
                arrow1.visible = false;
                continue;
            }
            if (id == "fingure") {

                fingure = new createjs.Bitmap(preload.getResult('fingure'));
                container.parent.addChild(fingure);
                fingure.visible = false;
                continue;
            }
            ///////////////////////////////////////////////////////bg////////////////////////////


            if (runningBg == 1) {
                if (id == "uniquebackGround") {
                    uniquebackGround = new createjs.Bitmap(preload.getResult('uniquebackGround'));
                    container.parent.addChild(uniquebackGround);
                    uniquebackGround.visible = false;
                    continue;
                }


                if (id == "backGround1") {
                    bg1 = new createjs.Bitmap(preload.getResult('backGround1'));
                    container.parent.addChild(bg1);
                    bg1.visible = true;

                    cbg1 = bg1.clone()
                    container.parent.addChild(cbg1)
                    cbg1.visible = false;

                    continue;
                }
                if (id == "backGround2") {
                    bg2 = new createjs.Bitmap(preload.getResult('backGround2'));
                    container.parent.addChild(bg2);
                    bg2.visible = true;

                    cbg2 = bg2.clone()
                    container.parent.addChild(cbg2)
                    cbg2.visible = false;

                    continue;
                }
                if (id == "backGround3") {
                    bg3 = new createjs.Bitmap(preload.getResult('backGround3'));
                    container.parent.addChild(bg3);
                    bg3.visible = true;

                    cbg3 = bg3.clone()
                    container.parent.addChild(cbg3)
                    cbg3.visible = false;

                    continue;
                }
                if (id == "backGround") {
                    bg = new createjs.Bitmap(preload.getResult('backGround'));
                    container.parent.addChild(bg);
                    bg.visible = true;

                    continue;
                }


            } else {

                if (id == "uniquebackGround") {
                    uniquebackGround = new createjs.Bitmap(preload.getResult('uniquebackGround'));
                    container.parent.addChild(uniquebackGround);
                    uniquebackGround.visible = true;
                    continue;
                }


                if (id == "backGround1") {
                    bg1 = new createjs.Bitmap(preload.getResult('backGround1'));
                    container.parent.addChild(bg1);
                    bg1.visible = false;

                    cbg1 = bg1.clone()
                    container.parent.addChild(cbg1)
                    cbg1.visible = false;

                    continue;
                }
                if (id == "backGround2") {
                    bg2 = new createjs.Bitmap(preload.getResult('backGround2'));
                    container.parent.addChild(bg2);
                    bg2.visible = false;

                    cbg2 = bg2.clone()
                    container.parent.addChild(cbg2)
                    cbg2.visible = false;

                    continue;
                }
                if (id == "backGround3") {
                    bg3 = new createjs.Bitmap(preload.getResult('backGround3'));
                    container.parent.addChild(bg3);
                    bg3.visible = false;

                    cbg3 = bg3.clone()
                    container.parent.addChild(cbg3)
                    cbg3.visible = false;

                    continue;
                }
                if (id == "backGround") {
                    bg = new createjs.Bitmap(preload.getResult('backGround'));
                    container.parent.addChild(bg);
                    bg.visible = false;

                    continue;
                }


            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////




            if (id == "Title") {
                Title = new createjs.Bitmap(preload.getResult('Title'));
                container.parent.addChild(Title)
                Title.visible = false;
                continue;
            }
            if (id == "startBtn") {
                startBtn = new createjs.Bitmap(preload.getResult('startBtn'));
                container.parent.addChild(startBtn);

                startBtn.visible = false
                continue;
            }


            if (id == "resultLoading") {
                resultLoading = new createjs.Bitmap(preload.getResult('resultLoading'));
                container.parent.addChild(resultLoading);
                resultLoading.visible = false;
                continue;

            }

            if (id == "howToPlay") {
                var howToPlay1 = AdobeAn.getComposition("A25931EDAAA5FA41B368940B71C47171");
                var howToPlayLib = howToPlay1.getLibrary();
                getHowToPlayMc = new howToPlayLib.HowToPlay()
                container.parent.addChild(getHowToPlayMc);
                getHowToPlayMc.visible = false;
                continue;
            };

            if (id == "scoreImgMc") {
                var spriteSheet3 = new createjs.SpriteSheet({
                    framerate: 30,
                    "images": [preload.getResult("scoreImgMc")],
                    "frames": { "regX": 50, "height": 306, "count": 0, "regY": 50, "width": 306 },
                    // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                });
                //
                scoreImgMc = new createjs.Sprite(spriteSheet3);
                container.parent.addChild(scoreImgMc);
                scoreImgMc.visible = false;
                continue;
            }
            if (id == "ResponseImgMc") {
                var spriteSheet3 = new createjs.SpriteSheet({
                    framerate: 30,
                    "images": [preload.getResult("ResponseImgMc")],
                    "frames": { "regX": 50, "height": 282, "count": 0, "regY": 50, "width": 281 },
                    // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                });
                //
                ResponseImgMc = new createjs.Sprite(spriteSheet3);
                container.parent.addChild(ResponseImgMc);
                ResponseImgMc.visible = false;
                continue;
            }
            if (id == "questionImgMc") {
                var spriteSheet3 = new createjs.SpriteSheet({
                    framerate: 30,
                    "images": [preload.getResult("questionImgMc")],
                    "frames": { "regX": 50, "height": 280, "count": 0, "regY": 50, "width": 282 },
                    // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                });
                //
                questionImgMc = new createjs.Sprite(spriteSheet3);
                container.parent.addChild(questionImgMc);
                questionImgMc.visible = false;
                continue;
            }
            if (id == "AttemptsImgMc") {
                var spriteSheet3 = new createjs.SpriteSheet({
                    framerate: 30,
                    "images": [preload.getResult("AttemptsImgMc")],
                    "frames": { "regX": 50, "height": 282, "count": 0, "regY": 50, "width": 282 },
                    // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                });
                //
                AttemptsImgMc = new createjs.Sprite(spriteSheet3);
                container.parent.addChild(AttemptsImgMc);
                AttemptsImgMc.visible = false;
                continue;
            }
            if (id == "CorrectImgMc") {
                var spriteSheet3 = new createjs.SpriteSheet({
                    framerate: 30,
                    "images": [preload.getResult("CorrectImgMc")],
                    "frames": { "regX": 50, "height": 282, "count": 0, "regY": 50, "width": 281 },
                    // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                });
                //
                CorrectImgMc = new createjs.Sprite(spriteSheet3);
                container.parent.addChild(CorrectImgMc);
                CorrectImgMc.visible = false;
                continue;
            }

            if (id == "correctImg") {
                correctImg = new createjs.Bitmap(preload.getResult('correctImg'));
                container.parent.addChild(correctImg);
                correctImg.visible = false;

                continue;
            }
            if (id == "wrongImg") {
                wrongImg = new createjs.Bitmap(preload.getResult('wrongImg'));
                container.parent.addChild(wrongImg);
                wrongImg.visible = false;

                continue;
            }
            if (id == "gameOverImg") {
                gameOverImg = new createjs.Bitmap(preload.getResult('gameOverImg'));
                container.parent.addChild(gameOverImg);
                gameOverImg.visible = false;

                continue;
            }
            if (id == "timeOverImg") {
                timeOverImg = new createjs.Bitmap(preload.getResult('timeOverImg'));
                container.parent.addChild(timeOverImg);
                timeOverImg.visible = false;

                continue;
            }



            if (id == "domainPath") {
                var json = preload.getResult("domainPath");
                console.log(json); // true
                url = json.path;
                url1 = json.scoreupdate;
                console.log("check= " + url1)
                url2 = json.get_info;
                nav = json.nav;
                continue;
            }
            if (id == "SkipBtn") {
                var spriteSheet4 = new createjs.SpriteSheet({
                    framerate: 30,
                    "images": [preload.getResult("SkipBtn")],
                    "frames": { "regX": 50, "height": 105, "count": 0, "regY": 50, "width": 184 },
                    // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                });
                //
                SkipBtnMc = new createjs.Sprite(spriteSheet4);
                container.parent.addChild(SkipBtnMc);
                SkipBtnMc.x = 1150; SkipBtnMc.y = 155
                SkipBtnMc.visible = false;

                continue;
            }
            if (id == "handCursor") {
                handCursor = new createjs.Bitmap(preload.getResult('handCursor'));
                container.parent.addChild(handCursor);
                handCursor.visible = false;

                continue;
            }

            if (id == "HowToPlayScreen") {
                howToPlayImageMc = new createjs.Bitmap(preload.getResult('HowToPlayScreen'));
                container.parent.addChild(howToPlayImageMc);
                howToPlayImageMc.visible = false;
                howToPlayImageMc.x = howToPlayImageMc.x - 20
                continue;
            }

            if (id == "HowToPlayScreenImg") {
                HowToPlayScreenImg = new createjs.Bitmap(preload.getResult('HowToPlayScreenImg'));
                container.parent.addChild(HowToPlayScreenImg);
                HowToPlayScreenImg.visible = true;
                continue;
            }

            if (id == "GameFinishedImg") {
                GameFinishedImg = new createjs.Bitmap(preload.getResult('GameFinishedImg'));
                container.parent.addChild(GameFinishedImg);
                GameFinishedImg.visible = false;
                continue;
            }


        }

        else {

            doneLoading1(event)

        }

    }



    //bgSnd = playSound("begin", 9999)//
    bgSnd = createjs.Sound.play("begin");
    bgSnd.volume = 0;
    correctSnd = createjs.Sound.play("correct");
    correctSnd.volume = 0;
    wrongSnd = createjs.Sound.play("wrong");
    wrongSnd.volume = 0;
    gameOverSnd = createjs.Sound.play("gameOver");
    gameOverSnd.volume = 0;
    timeOverSnd = createjs.Sound.play("timeOver");
    timeOverSnd.volume = 0;

    tickSnd = createjs.Sound.play("tick", { interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 0.4 });
    tickSnd.volume = 0;



    // start the music



    //if (!createjs.Ticker.hasEventListener("tick")) {

    createjs.Ticker.addEventListener("tick", tick);

    //}

    createjs.Touch.enable(stage, true, true)



    watchRestart();

}





function watchRestart() {

    //watch for clicks

    stage.addChild(messageField);

    gameScoreTxt = new createjs.Text("", "bold 32px Lato-Bold", "white");
    container.parent.addChild(gameScoreTxt);
    gameScoreTxt.x = 80; gameScoreTxt.y = 77;
    gameScoreTxt.textAlign = "center";
    gameScoreTxt.textBaseline = "middle";

    gameTimerTxt = new createjs.Text("", "bold 15px Lato-Bold", "white");
    container.parent.addChild(gameTimerTxt);
    gameTimerTxt.x = 151; gameTimerTxt.y = 46.5;
    gameTimerTxt.textAlign = "center";
    gameTimerTxt.textBaseline = "middle";



    gameQCntTxt = new createjs.Text("", "bold 23px Lato-Bold", "white");
    container.parent.addChild(gameQCntTxt);
    gameQCntTxt.x = 1201; gameQCntTxt.y = 77;
    gameQCntTxt.textAlign = "center";
    gameQCntTxt.textBaseline = "middle";



    gameScoreTxt.visible = false
    gameTimerTxt.visible = false
    gameQCntTxt.visible = false
    gameScoreTxt.text = "0";
    gameTimerTxt.text = parseInt(time);
    gameQCntTxt.text = "1/" + String(totalQuestions)


    // apply font family
    //  boardMc.boardMc.infoBtn.visible = false
    //  boardMc.boardMc.infoBtn.mouseEnabled = false;

    startBtn.cursor = "pointer";
    startMc = new createjs.MovieClip(null, 0, true);
    container.parent.addChild(startMc)
    startMc.addChild(startBtn)
    startMc.visible = true

    createjs.Ticker.interval = 25;
    createjs.Ticker.framerate = 30;

    if (UniqueGameName == "CycleRace") {
        createjs.Ticker.setFPS(10);
    } else {
        createjs.Ticker.setFPS(20);
    }


    container.parent.addChild(handCursor);
    handCursor.visible = true;
    var hcursorMc = new createjs.MovieClip()
    container.parent.addChild(hcursorMc)
    hcursorMc.timeline.addTween(createjs.Tween.get(handCursor).to({ scaleX: .98, scaleY: .98 }, 19).to({ scaleX: 1, scaleY: 1 }, 20).wait(1));
    handCursor.addEventListener("click", toggleFullScreen);
    handCursor.addEventListener("click", createHowToPlay)


    createTitleBtn();
    TitleContaier = new createjs.MovieClip();
    container.parent.addChild(TitleContaier);
    TitleContaier.addChild(TitleBtn);
    TitleBtn.visible = false;

    stage.update(); 	//update the stage to show text;



}

//==========================================================================//
function createHowToPlay() {
    handCursor.visible = false;
    HowToPlayScreenImg.visible = false;
    getHowToPlayMc.visible = true;
    container.parent.addChild(getHowToPlayMc)
    getHowToPlayMc.howToPlayMc.gotoAndPlay(0);

    getHowToPlayMc.howToPlayMc.addEventListener("tick", createHowToPlayHandler)
}
//==========================================================================//
function createHowToPlayHandler(evt) {

    // console.log(evt.currentTarget.currentFrame +" == "+   evt.currentTarget.totalFrames)
    if (evt.currentTarget.currentFrame == evt.currentTarget.totalFrames - 1) {
        var totalFrame = evt.currentTarget.totalFrames

        evt.currentTarget.gotoAndStop(totalFrame - 1)
        evt.currentTarget.removeEventListener("tick", createHowToPlayHandler)

        clearHowToPlayInterval = setInterval(gameHowToPlayAnimation, 1000);
    }
}
//===========================================================================================//
function gameHowToPlayAnimation() {

    clearInterval(clearHowToPlayInterval)
    if (getHowToPlayMc) {
        getHowToPlayMc.visible = false;
        getHowToPlayMc.howToPlayMc.visible = false;
        container.parent.removeChild(getHowToPlayMc)
        getHowToPlayMc = null

        createGameIntroAnimationPlay(true)// GameOrientation.js
    }
}
//===========================================================================================//

function createGameIntroAnimationPlay() {
    //////////////////////////////////////Dynamicintro///////////////////////

    howToPlayImageMc.visible = true;
    container.parent.addChild(howToPlayImageMc)

    commongameintro()   //   know
    //  introStartCnt++;
    startAnimationHandler(null)
    isVisibleSkipBtn()
    //////////////////////////////////////////////////////////////////////////////
    /*howToPlayImageMc.visible = true;
    container.parent.addChild(howToPlayImageMc)
    gameIntroAnimMc.visible = true;
    gameIntroAnimMc.gotoAndPlay(0);
     commongameintro();
    gameIntroAnimMc.addEventListener("tick", startAnimationHandler);*/

}
//===========================================================================================//
function setStopRotation() {
    console.log("Stop Rotation 1 " + isScreenRotation + " ======== " + isGamePlay)
    if (isGamePlay) {
        pauseTimer()
    }
}

function setResumeRotation() {
    console.log("get value of = " + isGamePlay)
    if (isScreenRotation == "0" && !isGamePlay) {
        isScreenRotation = "5";
    }
    if (isGamePlay) {
        restartTimer()
    }
}
//================================================================================================//


function createBackgroundTweens() {


    cbg1.visible = cbg2.visible = cbg3.visible = true;
    bg1.x = 0;
    cbg1.x = 1280;
    var objTween = 100000
    var objTween = 100000

    createjs.Tween.get(bg1, { loop: true }).to({ x: -1280 }, objTween)
    createjs.Tween.get(cbg1, { loop: true }).to({ x: 0 }, objTween)

    bg2.x = 0;
    cbg2.x = 1280;
    var objTween1 = 80000
    var objTween1 = 80000

    createjs.Tween.get(bg2, { loop: true }).to({ x: -1280 }, objTween1)
    createjs.Tween.get(cbg2, { loop: true }).to({ x: 0 }, objTween1)

    bg3.x = 0;
    cbg3.x = 1280;
    var objTween2 = 60000
    var objTween2 = 60000

    createjs.Tween.get(bg3, { loop: true }).to({ x: -1280 }, objTween2)
    createjs.Tween.get(cbg3, { loop: true }).to({ x: 0 }, objTween2)



}

//===========================================================================================//

function TimerAnsScoreTweens() {

    scoreMc.alpha = 0.6
    createjs.Tween.get(scoreMc, { loop: true }).to({ alpha: 1 }, 1000).to({ alpha: 0.6 }, 1000)
    QuesCntMc.alpha = 0.7
    createjs.Tween.get(QuesCntMc, { loop: true }).to({ alpha: 1 }, 1000).to({ alpha: 0.7 }, 1000)

    timerMc.scaleX = timerMc.scaleY = .21
    createjs.Tween.get(timerMc, { loop: true }).to({ scaleX: .22, scaleY: .22 }, 500).to({ scaleX: 0.21, scaleY: 0.21 }, 500)

}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function panelVisibleFn() {


    TitleBtn.visible = true;
    TitleContaier.visible = true;
    container.parent.addChild(closeBtn);
    fullScreenBtn.mouseEnabled = true;
    container.parent.addChild(fullScreenBtn);
    volumeBtn.mouseEnabled = true;
    container.parent.addChild(volumeBtn);
    container.parent.addChild(QuesCntMc);
    container.parent.addChild(timerMc);
    container.parent.addChild(scoreMc);
    gameQCntTxt.text = quesCnt + "/" + totalQuestions;
    container.parent.addChild(gameQCntTxt);
    gameScoreTxt.visible = true
    container.parent.addChild(gameScoreTxt);
    gameTimerTxt.visible = true
    container.parent.addChild(gameTimerTxt);
    gameQCntTxt.visible = true
    container.parent.addChild(gameQCntTxt);
    closeBtn.mouseEnabled = true;
    closeBtn.visible = true;
    fullScreenBtn.visible = true;
    volumeBtn.visible = true;
    scoreMc.visible = true;
    timerMc.visible = true;
    QuesCntMc.visible = true;
    gameScoreTxt.visible = true;
    gameQCntTxt.visible = true;
    gameTimerTxt.visible = true;
}
function internetErrorFn() {
    pauseTimer()
    timeOverImg.visible = false;
    gameOverImg.visible = false;
    gameResponseTimerStop();
    correctSnd.stop();
    wrongSnd.stop();
    gameOverSnd.stop();
    tickSnd.stop();
    bgSnd.stop();

    if (container.parent) {
        container.parent.removeAllChildren();
    }
    if (container1.parent) {
        container1.parent.removeAllChildren();
    }
    container4 = new createjs.Container();
    stage.addChild(container4)
    container4.parent.addChild(GameFinishedImg);
    GameFinishedImg.visible = true;

    container4.parent.addChild(closeBtnFinal);
    closeBtnFinal.visible = true;
    closeBtnFinal.addEventListener("click", closeGameFn);
    closeBtnFinal.cursor = "pointer";

    var setFinishedTxt = new createjs.Text("No Internet Connection. Please try again...", "60px Lato-Bold", "white");
    setFinishedTxt.textAlign = "center";
    setFinishedTxt.textBaseline = "middle";
    setFinishedTxt.lineWidth = 1000
    setFinishedTxt.lineHeight = 63
    setFinishedTxt.x = 640;
    setFinishedTxt.y = 367;
    setFinishedTxt.visible = true;
    container4.parent.addChild(setFinishedTxt);


    if (intChkVar == 0) {
        setFinishedTxt.text = "No Internet Connection. Please try again...";
    }
    if (intChkVar == 1) {
        setFinishedTxt.text = "You have completed this puzzle...";
    }
    else if (intChkVar == 2) {
        setFinishedTxt.text = "You have completed this puzzle...";
    }



    if (setFinishedTxt.text.length <= 35) {
        setFinishedTxt.y = 407;
    }
    else if (setFinishedTxt.text.length <= 70) {
        setFinishedTxt.font = "bold 40px Lato-Bold"
        setFinishedTxt.y = 407;
    }
    else {
        setFinishedTxt.font = "bold 40px Lato-Bold"
        setFinishedTxt.y = 377;
    }
    intChkVar = -1

}
/*
function callGameIntroAct() {
    if (introStartCnt == -1) {
        console.log("Empty")
    } else {
        removeGameIntro()
        if (stopValue == 0) {
            window.removeEventListener('focus', startIntro);
            window.removeEventListener('blur', stopGameIntro);
        }
        else {
            setTimeout(commongameintro, 400) // commongameintro()
        }
    }
}
function callGameIntroRemove() {
    if (introStartCnt == -1) {

    } else {
        removeGameIntro()
    }
}
*/