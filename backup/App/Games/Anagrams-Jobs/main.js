/***************************************************************************/
/*                                                                         */
/*  This obfuscated code was created by Javascript Obfuscator Free Version.*/
/*  Javascript Obfuscator Free Version can be downloaded here              */
/*  http://javascriptobfuscator.com                                        */
/*                                                                         */
/***************************************************************************/
var _$_cecf=["","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","baker","farmer","teacher","dealer","airmen","builder","salesmen","nurse","actors","artist","educator","porter","soldier","umpire","warden","trader","rider","singer","priest","painter","maid","cobbler","deans","mason","break","framer","cheater","leader","marine","rebuild","nameless","runes","costar","traits","outraced","report","solider","impure","warned","retard","drier","resign","stripe","repaint","amid","clobber","sedan","moans","178.3","288.3","398.3","508.3","618.3","728.3","688.3","338.3","418.3","498.3","578.3","497.1","567.1","365","335","305","275","245","215","185","both","onload","gameCanvas","getElementById","Stage","Container","addChild","tick","addEventListener","Ticker","getRGB","Graphics","Shape","endFill","drawRect","beginFill","graphics","update","enableMouseOver","assets/","Anagrams-Jobs/","FA/","chHolder","Anagrams-Jobs-QT1.png","choice1","ChoiceImages1.png","QusTxtString","Anagrams-Jobs-QT.png","clueMc","clueImages.png","push","id","item"," doneLoading ","log","visible","getResult","Bitmap","parent","SpriteSheet","Sprite","indexOf","splice","y","MovieClip","clone","gotoAndStop","x","scaleX","scaleY","mouseEnabled","70px Lato-Bold","#3E007D","Text","textAlign","center","textBaseline","middle","correct3Answer= ","getStr=","length","toUpperCase","toString","charAt","name","alpha","cursor","pointer","to","wait","get","Tween","click","arr= ","removeEventListener","default","preventDefault","currentTarget","uans= ","wrong","correct"];var messageField;var assets=[];var choiceArr=[];var choiceMcArr=[];var textArr=[];var qno=[];var strArr=[];var chpos=[];var getChar=[];var quesMcArr=[];var clueMcArr=[];var clueArr=[];var choiceArrScale;var cnt=-1,ans,qscnt=-1,uans,interval,delayInterval,time=180,totalQuestions=10,answeredQuestions=0,choiceCnt=12,quesCnt=0,resTimerOut=0,rst=0,responseTime=0,correctAnswer=_$_cecf[0],lCnt=-1,wrdCnt=-1;var startBtn,introScrn,container,question,circleOutline,chHolderMC,choice1,choice2,choice3,boardMc,helpMc,backGround1,kholderMc,ansPanelMc,clueMc,clueMc1,resultLoading,selectedAnswer=_$_cecf[0],cLen=0;var parrotWowMc,parrotOopsMc,parrotGameOverMc,parrotTimeOverMc,btnImages,isCorrect=_$_cecf[0];var bgSnd,correctSnd,wrongSnd,gameOverSnd,timeOverSnd,tickSnd,currTime=0;var tqcnt=0,aqcnt=0,ccnt=0,cqcnt=0,gscore=0,gscrper=0,gtime=0,rtime=0,crtime=0,wrtime=0;var alphabetArr=[_$_cecf[1],_$_cecf[2],_$_cecf[3],_$_cecf[4],_$_cecf[5],_$_cecf[6],_$_cecf[7],_$_cecf[8],_$_cecf[9],_$_cecf[10],_$_cecf[11],_$_cecf[12],_$_cecf[13],_$_cecf[14],_$_cecf[15],_$_cecf[16],_$_cecf[17],_$_cecf[18],_$_cecf[19],_$_cecf[20],_$_cecf[21],_$_cecf[22],_$_cecf[23],_$_cecf[24],_$_cecf[25],_$_cecf[26]];var words_arry=[_$_cecf[27],_$_cecf[28],_$_cecf[29],_$_cecf[30],_$_cecf[31],_$_cecf[32],_$_cecf[33],_$_cecf[34],_$_cecf[35],_$_cecf[36],_$_cecf[37],_$_cecf[38],_$_cecf[39],_$_cecf[40],_$_cecf[41],_$_cecf[42],_$_cecf[43],_$_cecf[44],_$_cecf[45],_$_cecf[46],_$_cecf[47],_$_cecf[48],_$_cecf[49],_$_cecf[50]];var nameArr=[_$_cecf[51],_$_cecf[52],_$_cecf[53],_$_cecf[54],_$_cecf[55],_$_cecf[56],_$_cecf[57],_$_cecf[58],_$_cecf[59],_$_cecf[60],_$_cecf[61],_$_cecf[62],_$_cecf[63],_$_cecf[64],_$_cecf[65],_$_cecf[66],_$_cecf[67],_$_cecf[68],_$_cecf[69],_$_cecf[70],_$_cecf[71],_$_cecf[72],_$_cecf[73],_$_cecf[74]];var maxLetterCnt=13;var btnX=[_$_cecf[75],_$_cecf[76],_$_cecf[77],_$_cecf[78],_$_cecf[79],_$_cecf[80],_$_cecf[81],_$_cecf[76],_$_cecf[82],_$_cecf[83],_$_cecf[84],_$_cecf[85]];var btnY=[_$_cecf[86],_$_cecf[86],_$_cecf[86],_$_cecf[86],_$_cecf[86],_$_cecf[86],_$_cecf[86],_$_cecf[87],_$_cecf[87],_$_cecf[87],_$_cecf[87],_$_cecf[87]];var rand1=[];var btnPaddArr=[_$_cecf[0],_$_cecf[0],_$_cecf[0],_$_cecf[88],_$_cecf[89],_$_cecf[90],_$_cecf[91],_$_cecf[92],_$_cecf[93],_$_cecf[94]];var indx=[];var btnPadding=50;var btnTxtPaddding=483;var repTimeClearInterval=0;var rst1=0,crst=0,wrst=0,score=0,puzzle_cycle,timeOver_Status=0;var cLen;var QusTxtString;var questionTextMC;var isBgSound=true;var isEffSound=true;var currentX,currentY;var currentObj=[];var url=_$_cecf[0];var nav=_$_cecf[0];var isResp=true;var respDim=_$_cecf[95];var isScale=true;var scaleType=1;var lastW,lastH,lastS=1;var borderPadding=10,barHeight=20;var loadProgressLabel,progresPrecentage,loaderWidth;window[_$_cecf[96]]= function(_0xE446){checkBrowserSupport()};function init(){canvas= document[_$_cecf[98]](_$_cecf[97]);stage=  new createjs[_$_cecf[99]](canvas);container=  new createjs[_$_cecf[100]]();stage[_$_cecf[101]](container);createjs[_$_cecf[104]][_$_cecf[103]](_$_cecf[102],stage);loaderColor= createjs[_$_cecf[106]][_$_cecf[105]](255,51,51,1);loaderBar=  new createjs[_$_cecf[100]]();var _0xE87E= new createjs[_$_cecf[100]]();bar=  new createjs[_$_cecf[107]]();bar[_$_cecf[111]][_$_cecf[110]](loaderColor)[_$_cecf[109]](0,0,1,barHeight)[_$_cecf[108]]();loaderWidth= 300;callLoader();createLoader();createCanvasResize();stage[_$_cecf[112]]();stage[_$_cecf[113]](40);assetsPath= _$_cecf[114];gameAssetsPath= _$_cecf[115];soundpath= _$_cecf[116];var _0xE851=createManifest();if(_0xE851== 1){manifest[_$_cecf[125]]({id:_$_cecf[117],src:questionTextPath+ _$_cecf[118]},{id:_$_cecf[119],src:gameAssetsPath+ _$_cecf[120]},{id:_$_cecf[121],src:questionTextPath+ _$_cecf[122]},{id:_$_cecf[123],src:gameAssetsPath+ _$_cecf[124]});preloadAllAssets();stage[_$_cecf[112]]()}}function doneLoading1(_0xE5DB){var _0xE5DB=assets[i];var _0xE608=_0xE5DB[_$_cecf[127]][_$_cecf[126]];console[_$_cecf[129]](_$_cecf[128]);loaderBar[_$_cecf[130]]= false;stage[_$_cecf[112]]();if(_0xE608== _$_cecf[121]){QusTxtString=  new createjs[_$_cecf[132]](preload[_$_cecf[131]](_$_cecf[121]));container[_$_cecf[133]][_$_cecf[101]](QusTxtString);QusTxtString[_$_cecf[130]]= false};if(_0xE608== _$_cecf[119]){var _0xE581= new createjs[_$_cecf[134]]({framerate:30,"images":[preload[_$_cecf[131]](_$_cecf[119])],"frames":{"regX":50,"height":146,"count":64,"regY":50,"width":174}});choice1=  new createjs[_$_cecf[135]](_0xE581);container[_$_cecf[133]][_$_cecf[101]](choice1);choice1[_$_cecf[130]]= false};if(_0xE608== _$_cecf[123]){var _0xE5AE= new createjs[_$_cecf[134]]({framerate:30,"images":[preload[_$_cecf[131]](_$_cecf[123])],"frames":{"regX":50,"height":60,"count":0,"regY":50,"width":67}});clueMc=  new createjs[_$_cecf[135]](_0xE5AE);container[_$_cecf[133]][_$_cecf[101]](clueMc);clueMc[_$_cecf[130]]= false};if(_0xE608== _$_cecf[117]){chHolderMC=  new createjs[_$_cecf[132]](preload[_$_cecf[131]](_$_cecf[117]));container[_$_cecf[133]][_$_cecf[101]](chHolderMC);chHolderMC[_$_cecf[130]]= false}}function tick(_0xE446){stage[_$_cecf[112]]()}function handleClick(_0xE446){qno= between(0,23);qno[_$_cecf[137]](qno[_$_cecf[136]](20),1);CreateGameStart();if(gameType== 0){CreateGameElements();getStartQuestion()}else {getdomainpath()}}function CreateGameElements(){interval= setInterval(countTime,1000);container[_$_cecf[133]][_$_cecf[101]](QusTxtString);QusTxtString[_$_cecf[130]]= false;chHolderMC[_$_cecf[130]]= false;chHolderMC[_$_cecf[138]]= chHolderMC[_$_cecf[138]]- 7;container[_$_cecf[133]][_$_cecf[101]](chHolderMC,question);for(i= 0;i< maxLetterCnt;i++){clueMcArr[i]=  new createjs[_$_cecf[139]]();container[_$_cecf[133]][_$_cecf[101]](clueMcArr[i]);clueArr[i]= clueMc[_$_cecf[140]]();clueMcArr[i][_$_cecf[101]](clueArr[i]);clueArr[i][_$_cecf[141]](26);clueArr[i][_$_cecf[130]]= false;clueArr[i][_$_cecf[142]]= 355+ (i* 70)- 14;clueArr[i][_$_cecf[138]]= 490};container[_$_cecf[133]][_$_cecf[101]](choice1);choice1[_$_cecf[130]]= false;for(i= 0;i< maxLetterCnt;i++){choiceArr[i]= choice1[_$_cecf[140]]();choiceArr[i][_$_cecf[143]]= choiceArr[i][_$_cecf[144]]= 0.8;choiceArr[i][_$_cecf[130]]= false;container[_$_cecf[133]][_$_cecf[101]](choiceArr[i]);choiceArr[i][_$_cecf[142]]= 205+ (i* 120);choiceArr[i][_$_cecf[138]]= 620}}function helpDisable(){for(i= 0;i< cLen;i++){choiceMcArr[i][_$_cecf[145]]= false}}function helpEnable(){for(i= 0;i< cLen;i++){choiceMcArr[i][_$_cecf[145]]= true}}function pickques(){pauseTimer();tx= 0;qscnt++;cnt++;quesCnt++;chpos= [];strArr= [];getChar= [];currentObj= [];lCnt=  -1;cLen= 0;panelVisibleFn();chHolderMC[_$_cecf[130]]= true;QusTxtString[_$_cecf[130]]= true;wrdCnt=  -1;isCorrect= _$_cecf[0];chHolderMC[_$_cecf[130]]= true;correctAnswer= words_arry[qno[cnt]];question=  new createjs[_$_cecf[148]](nameArr[qno[cnt]],_$_cecf[146],_$_cecf[147]);question[_$_cecf[149]]= _$_cecf[150];question[_$_cecf[151]]= _$_cecf[152];question[_$_cecf[142]]= 640;question[_$_cecf[138]]= 275;question[_$_cecf[130]]= true;container[_$_cecf[133]][_$_cecf[101]](question);ans= correctAnswer;console[_$_cecf[129]](_$_cecf[153]+ correctAnswer);enablechoices();createjs[_$_cecf[104]][_$_cecf[103]](_$_cecf[102],tick);stage[_$_cecf[112]]()}function enablechoices(){var _0xE716=[];rand1= [];var _0xE6E9=nameArr[qno[cnt]];console[_$_cecf[129]](_$_cecf[154]+ _0xE6E9);cLen= _0xE6E9[_$_cecf[155]];rand1= between(0,cLen- 1);for(i= 0;i< cLen;i++){getChar[i]= _0xE6E9[_$_cecf[158]](i)[_$_cecf[157]]()[_$_cecf[156]]()};_0xE6E9= correctAnswer;for(i= 0;i< cLen;i++){getChar[i]= _0xE6E9[_$_cecf[158]](i)[_$_cecf[157]]()[_$_cecf[156]]();indx[i]= alphabetArr[_$_cecf[136]](getChar[i])};for(i= 0;i< cLen;i++){choiceArr[rand1[i]][_$_cecf[141]](indx[i]);choiceArr[i][_$_cecf[130]]= true;choiceArr[rand1[i]][_$_cecf[159]]= getChar[i];choiceArr[i][_$_cecf[138]]= 600;clueArr[i][_$_cecf[141]](26);clueArr[i][_$_cecf[130]]= false;clueArr[i][_$_cecf[138]]= 475;clueArr[i][_$_cecf[143]]= clueArr[i][_$_cecf[144]]= 1.3};choiceArrScale= 0.8;for(i= 0;i< cLen;i++){if(cLen== 2){clueArr[i][_$_cecf[142]]= 585+ (i* 90)- 14;choiceArr[i][_$_cecf[142]]= 430+ (i* 175)};if(cLen== 3){clueArr[i][_$_cecf[142]]= 585+ (i* 90)- 14;choiceArr[i][_$_cecf[142]]= 430+ (i* 175)};if(cLen== 4){clueArr[i][_$_cecf[142]]= 550+ (i* 85)- 14;choiceArr[i][_$_cecf[142]]= 340+ (i* 175)};if(cLen== 5){clueArr[i][_$_cecf[142]]= 495+ (i* 90)- 14;choiceArr[i][_$_cecf[142]]= 230+ (i* 185)};if(cLen== 6){clueArr[i][_$_cecf[142]]= 465+ (i* 85)- 14;choiceArr[i][_$_cecf[142]]= 165+ (i* 175)};if(cLen== 7){clueArr[i][_$_cecf[142]]= 422+ (i* 85)- 14;choiceArr[i][_$_cecf[142]]= 92+ (i* 170)};if(cLen== 8){clueArr[i][_$_cecf[142]]= 398+ (i* 80)- 14;choiceArr[i][_$_cecf[142]]= 77+ (i* 150)};if(cLen== 9){clueArr[i][_$_cecf[142]]= 393+ (i* 70)- 14;choiceArr[i][_$_cecf[142]]= 43+ (i* 140);choiceArr[i][_$_cecf[143]]= choiceArr[i][_$_cecf[144]]= 0.7;choiceArrScale= 0.7;clueArr[i][_$_cecf[143]]= clueArr[i][_$_cecf[144]]= 1.1};if(cLen== 10){choiceArrScale= 0.7;choiceArr[i][_$_cecf[143]]= choiceArr[i][_$_cecf[144]]= 0.7;clueArr[i][_$_cecf[143]]= clueArr[i][_$_cecf[144]]= 1;clueArr[i][_$_cecf[142]]= 388+ (i* 63)- 14;choiceArr[i][_$_cecf[142]]= 65+ (i* 120)};if(cLen== 11){choiceArrScale= 0.65;choiceArr[i][_$_cecf[143]]= choiceArr[i][_$_cecf[144]]= 0.65;clueArr[i][_$_cecf[143]]= clueArr[i][_$_cecf[144]]= 1;clueArr[i][_$_cecf[142]]= 358+ (i* 63)- 14;choiceArr[i][_$_cecf[142]]= 35+ (i* 114)};if(cLen== 12){choiceArrScale= 0.65;choiceArr[i][_$_cecf[143]]= choiceArr[i][_$_cecf[144]]= 0.65;clueArr[i][_$_cecf[143]]= clueArr[i][_$_cecf[144]]= 1;clueArr[i][_$_cecf[142]]= 326+ (i* 63)- 14;choiceArr[i][_$_cecf[142]]= 28+ (i* 105)};if(cLen== 13){choiceArrScale= 0.58;choiceArr[i][_$_cecf[143]]= choiceArr[i][_$_cecf[144]]= 0.58;clueArr[i][_$_cecf[143]]= clueArr[i][_$_cecf[144]]= 1;clueArr[i][_$_cecf[142]]= 295+ (i* 63)- 14;choiceArr[i][_$_cecf[142]]= 27+ (i* 97)}};for(i= 0;i< cLen;i++){choiceArr[i][_$_cecf[130]]= true;choiceArr[i][_$_cecf[126]]= i;choiceArr[i][_$_cecf[160]]= 1;choiceArr[i][_$_cecf[145]]= true;choiceArr[i][_$_cecf[161]]= _$_cecf[162]};createTween();question[_$_cecf[148]]= _$_cecf[0]}function createTween(){chHolderMC[_$_cecf[130]]= true;chHolderMC[_$_cecf[160]]= 0;createjs[_$_cecf[166]][_$_cecf[165]](chHolderMC)[_$_cecf[164]](300)[_$_cecf[163]]({alpha:1},300);question[_$_cecf[130]]= true;question[_$_cecf[160]]= 0;createjs[_$_cecf[166]][_$_cecf[165]](question)[_$_cecf[164]](1000)[_$_cecf[163]]({alpha:1},1000);for(i= 0;i< cLen;i++){clueArr[i][_$_cecf[130]]= true;clueArr[i][_$_cecf[160]]= 0;createjs[_$_cecf[166]][_$_cecf[165]](clueArr[i])[_$_cecf[164]](1000)[_$_cecf[163]]({alpha:1},1000)};var _0xE527=700;for(i= 0;i< cLen;i++){choiceArr[i][_$_cecf[138]]= 570,choiceArr[i][_$_cecf[142]]= choiceArr[i][_$_cecf[142]]+ 10;choiceArr[i][_$_cecf[130]]= true;choiceArr[i][_$_cecf[160]]= 0;createjs[_$_cecf[166]][_$_cecf[165]](choiceArr[i])[_$_cecf[164]](_0xE527)[_$_cecf[163]]({y:600,scaleX:choiceArrScale,scaleY:choiceArrScale,alpha:1},_0xE527);_0xE527= _0xE527+ 150};repTimeClearInterval= setTimeout(AddListenerFn,3000)}function AddListenerFn(){clearTimeout(repTimeClearInterval);for(i= 0;i< cLen;i++){choiceArr[i][_$_cecf[103]](_$_cecf[167],answerSelected)};rst= 0;gameResponseTimerStart();restartTimer()}function getCompareArray(_0xE770,_0xE79D){var _0xE7CA=[];for(var _0xE7F7=0;_0xE7F7< _0xE770[_$_cecf[155]];_0xE7F7++){for(var _0xE824=0;_0xE824< _0xE79D[_$_cecf[155]];_0xE824++){if(_0xE770[_0xE7F7]== _0xE79D[_0xE824]){_0xE770[_$_cecf[137]](_0xE7F7,1)}}};_0xE7CA= _0xE770;console[_$_cecf[129]](_$_cecf[168]+ _0xE7CA);return _0xE7CA}function disablechoices(){for(i= 0;i< cLen;i++){choiceArr[i][_$_cecf[169]](_$_cecf[167],answerSelected);choiceArr[i][_$_cecf[161]]= _$_cecf[170];clueArr[i][_$_cecf[130]]= false;choiceArr[i][_$_cecf[130]]= false};question[_$_cecf[130]]= false;chHolderMC[_$_cecf[130]]= false;closeBtn[_$_cecf[145]]= false;fullScreenBtn[_$_cecf[145]]= false;volumeBtn[_$_cecf[145]]= false}function onRoll_over(_0xE446){}function onRoll_out(_0xE446){}function answerSelected(_0xE446){_0xE446[_$_cecf[171]]();lCnt++;uans= _0xE446[_$_cecf[172]][_$_cecf[159]];console[_$_cecf[129]](_$_cecf[173]+ uans);_0xE446[_$_cecf[172]][_$_cecf[145]]= false;_0xE446[_$_cecf[172]][_$_cecf[160]]= 0.5;_0xE446[_$_cecf[172]][_$_cecf[161]]= _$_cecf[170];strArr[_$_cecf[125]](uans);var _0xE4A0=uans;var _0xE473=alphabetArr[_$_cecf[136]](_0xE4A0);clueArr[lCnt][_$_cecf[141]](_0xE473);gameResponseTimerStop();if(getChar[lCnt]== _0xE4A0){currentObj[lCnt]= _0xE446[_$_cecf[172]][_$_cecf[126]];if(cLen== strArr[_$_cecf[155]]){correct()}}else {disablechoices();getValidation(_$_cecf[174])}}function correct(){getValidation(_$_cecf[175]);disablechoices()}function disableMouse(){for(i= 0;i< cLen;i++){choiceArr[i][_$_cecf[145]]= false}}function enableMouse(){for(i= 0;i< cLen;i++){var _0xE743=choiceArr[i][_$_cecf[126]];if(currentObj[_$_cecf[136]](_0xE743)==  -1){choiceArr[i][_$_cecf[145]]= true}}}