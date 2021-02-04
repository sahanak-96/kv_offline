

var Base_url = "https://games.skillangels.com/clp1920/assets/swf/assets/redirecturl_org.json";
//var Base_url ="http://localhost/schoolsclp1920/v1/assets/redirecturl_org.json";
//alert(window.parent.document.getElementById("hdnNextGameId").value);
	//	window.parent.document.getElementById("hdnNextGameId").value=""; //me
//alert(window.parent.document.getElementById("hdnNextGameId").value);


if (window == window.top) {
    // not in an iframe
    //window.location.href='http://gtec.skillangels.com/contestbeta';
}

var isMobile, resizeCnt;

var bitmap, s1;

var isOpera, isFirefox, isSafari, isIE, isEdge, isChrome, isBlink = false;

isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+

isFirefox = typeof InstallTrigger !== 'undefined';

// At least Safari 3+: "[object HTMLElementConstructor]"

isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;

// Internet Explorer 6-11

isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+

isEdge = !isIE && !!window.StyleMedia;

// Chrome 1+

isChrome = !!window.chrome && !!window.chrome.webstore;

setTimeout(showcanvas,2000);
function showcanvas()
{
    
    document.getElementById("content1").style.visibility = "hidden";
    document.getElementById("content").style.visibility = "visible";

}

isMobile = {

    Android: function () {

        return navigator.userAgent.match(/Android/i);

    },

    BlackBerry: function () {

        return navigator.userAgent.match(/BlackBerry/i);

    },

    iOS: function () {

        return navigator.userAgent.match(/iPhone|iPad|iPod|Mac/i);

    },

    Opera: function () {

        return navigator.userAgent.match(/Opera Mini/i);

    },

    Windows: function () {

        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);

    },

    any: function () {

        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.Opera() || isMobile.Windows());

    }

};



function createCanvasResize() {

    console.log("canvas:" + canvas + ":" + container.parent);



    make_base();
    createLoader()


    function make_base() {



        // base_image = new createjs.Bitmap('assets/audiobtn.png');

        // container.parent.addChild(base_image);

        // base_image.x = 600;

        // base_image.y = 200;

        // base_image.addEventListener("click", speaksound);

        // base_image.cursor = "pointer";

        // base_image.addEventListener("tick", makeup);

        // //

        // base_image1 = new createjs.Bitmap('assets/AudioToolTip.png');

        // container.parent.addChild(base_image1);

        // base_image1.x = 647;

        // base_image1.y = 98;

        // base_image1.addEventListener("click", speaksound);

        // base_image1.cursor = "pointer";

        // base_image1.addEventListener("tick", makeup);



        // var newMc = new createjs.MovieClip()

        // container.parent.addChild(newMc)



        // newMc.timeline.addTween(createjs.Tween.get(base_image1).to({ scaleX: 0.98, scaleY: 0.98 }, 24).to({ scaleX: 1, scaleY: 1 }, 25).wait(1));





    }

    function makeup() {

        container.parent.addChild(base_image);

        container.parent.addChild(base_image1);

    }

    window.addEventListener('resize', resizeCanvas);

    resizeCanvas();

    window.addEventListener("orientationchange", checkOrientation);



    if (isMobile.iOS() && !isChrome) {

        console.log("get values of ios")

        createjs.Ticker.addEventListener("tick", createResize);

    }

}

function createResize() {

    if (s1 == "success") {

        console.log("sucessfully set");

        createjs.Ticker.removeEventListener("tick", createResize);

    }

    else {

        do {

            console.log("check resize from ticker")

            s1 = resizeCanvas()

        } while (s1 != "success")

    }



}





function resizeCanvas() {



    var w = 1280, h = 720;


    var iw = window.innerWidth, ih = window.innerHeight;

    var pRatio = window.devicePixelRatio || 1, xRatio = iw / w, yRatio = ih / h, sRatio = 1;

    if (isResp) {

        if ((respDim == 'width' && lastW == iw) || (respDim == 'height' && lastH == ih)) {

            sRatio = lastS;

        }

        else if (!isScale) {

            if (iw < w || ih < h)

                sRatio = Math.min(xRatio, yRatio);

        }

        else if (scaleType == 1) {

            sRatio = Math.min(xRatio, yRatio);

        }

        else if (scaleType == 2) {

            sRatio = Math.max(xRatio, yRatio);

        }

    }



    canvas.width = w * pRatio * sRatio;

    canvas.height = h * pRatio * sRatio;

    canvas.style.width = w * sRatio + 'px';

    canvas.style.height = h * sRatio + 'px';

    stage.scaleX = pRatio * sRatio;

    stage.scaleY = pRatio * sRatio;

    lastW = iw; lastH = ih; lastS = sRatio;



    return 'success'



}

function checkOrientation() {



    // try {



    var deviceWidth = window.innerWidth;

    var deviceHeight = window.innerHeight;

    console.log("checkOrientation w" + deviceWidth)

    console.log("checkOrientation h" + deviceHeight)

    /* if (deviceHeight > deviceWidth) 

     {

         if (!isLandOrientation)

             

         isLandOrientation = false;

         console.log("portrait");

     } else {

         if (isLandOrientation)

             

         isLandOrientation = true;

         console.log("landscape");

     }*/



}

//  catch (e) { }









//-----------------------------------------------------------------------------------------//

function checkBrowserSupport() {



    var ua = window.navigator.userAgent;

    var IEVersion = getIEBrowserVersion(ua);

    var AndroidOSVersion = parseFloat(getAndroidVersion(ua));



    if (IEVersion < 10) {

        isOlderBrowser = true;

        //console.log('IEVersion: '+IEVersion);

    } else if (AndroidOSVersion < 4.2) {

        isOlderBrowser = true;

        //console.log('AndroidOSVersion: '+AndroidOSVersion);

    } else {

        isOlderBrowser = false;

        // this.parent.document.onkeydown = keydown;

        init();
        createLoadingScreen()

    }



    if (isOlderBrowser) { // not support



    } else {

        //browser support



    }

    console.log('isOlderBrowser: ' + isOlderBrowser);

}



function keydown(event) {

    console.log(" doKeyDown=" + event.keyCode)

}



//-----------------------------------------------------------------------------------------//

function getIEBrowserVersion(ua) {

    try {



        var msie = ua.indexOf("MSIE");

        if (msie > 0) // If Internet Explorer, return version number

        {

            return (parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));

        }

        else { return }  // If another browser, return 0



    } catch (e) { }



}

//-----------------------------------------------------------------------------------------//

function getAndroidVersion(ua) {

    try {

        var version;

        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        if (iOS) { return 4.3; } // allow to run iOS devices

        ua = (ua || navigator.userAgent).toLowerCase();

        if (ua.indexOf("Android") >= 0) {

            var version = parseFloat(ua.slice(ua.indexOf("Android") + 8));

            return version;

        }

    }

    catch (e) { }

}



//-----------------------------------------------------------------------------------------//



function toggleFullScreen(e) {




    fullScreenBtn.gotoAndStop(1);
    if (!document.fullscreenElement &&    // alternative standard method

        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods

        if (document.documentElement.requestFullscreen) {

            document.documentElement.requestFullscreen();

        } else if (document.documentElement.msRequestFullscreen) {

            document.documentElement.msRequestFullscreen();

        } else if (document.documentElement.mozRequestFullScreen) {

            document.documentElement.mozRequestFullScreen();

        } else if (document.documentElement.webkitRequestFullscreen) {

            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);

        }

    } else { // exit fullscreen mode




        fullScreenBtn.gotoAndStop(0);


        if (document.exitFullscreen) {

            document.exitFullscreen();

        } else if (document.msExitFullscreen) {

            document.msExitFullscreen();

        } else if (document.mozCancelFullScreen) {

            document.mozCancelFullScreen();

        } else if (document.webkitExitFullscreen) {

            document.webkitExitFullscreen();

        }

    }

}



document.oncontextmenu = function () {

    return false;

}

//-----------------------------------------------------------------------------------------////-----------------------------------------------------------------------------------------//

function removeFullScreen() {

    if (document.exitFullscreen) {

        document.exitFullscreen();

    } else if (document.msExitFullscreen) {

        document.msExitFullscreen();

    } else if (document.mozCancelFullScreen) {

        document.mozCancelFullScreen();

    } else if (document.webkitExitFullscreen) {

        document.webkitExitFullscreen();

    }

}



//-----------------------------------------------------------------------------------------//



function createLoadingScreen() {



    var image = new Image();

    image.src = assetsPathLang+"Loading.png";

    image.onload = handleImageLoad;

    console.log("get values1")

}



function handleImageLoad(event) {

    console.log("get values2")

    var image = event.target;

    bitmap = new createjs.Bitmap(image);

    bitmap.visible = false;

    stage.update();

}

