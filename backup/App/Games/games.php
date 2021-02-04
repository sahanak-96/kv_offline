<?php 

foreach ($_POST as $param_name => $param_val) {
	if($param_name=="gamename")
	{
		$gamename=$param_val;
	}
	else if($param_name=="uid")
	{
		$uid=$param_val;
	}
	else if($param_name=="gameid")
	{
		$gameid =$param_val;
	}
	else if($param_name=="angurl")
	{
		$angurl=$param_val;
	}
	else if($param_name=="eid")
	{
		$eid=$param_val; 	
	}
	else if($param_name=="skillkit_id")
	{
		$skillkit_id=$param_val;
	}
	else if($param_name=="ass_status")
	{
		$ass_status=$param_val;
	}
    else if($param_name=="ass_slot")
	{
		$ass_slot=$param_val;
	}
	else if($param_name=="year_status")
	{
		$year_status=$param_val;
	}
	else if($param_name=="sndval")
	{
		$sndval=$param_val;
	}
	else if($param_name=="testtype")
	{
		$testtype=$param_val;
	}
	else if($param_name=="isass2train")
	{
		$isass2train=$param_val;
	}
	else if($param_name=="session_id")
	{
		$session_id=$param_val;
	}

}



$themeArr = array('BgTheme1','BgTheme2','BgTheme3','BgTheme1','BgTheme1');
$i = rand(0,4);
$gname=explode("-",$gamename);
$getAssetsPath="EnglishAssets/";
$getassetsPathLang = "assets/".$getAssetsPath;

if($gamename == "AlphaNumericEncode-Level5" || $gamename == "FindTheTwins-Level3" || $gamename == "MissingPiece-Level4" ){
	$i = 2;
}else if($gamename == "SequenceMemory-Level6" || $gamename == "MirrorMatch-Level4" || $gamename == "Equate-Level1" || $gamename == "ShapeVsColorVsPattern-Level1" || $gamename == "MirrorImage-Level1" ){
	$i = 0;
}else if($gamename == "MindCapture-Level3" || $gamename == "IAmCube-Level2" || $gamename == "Rebus-Level1" || $gamename =="CoordinateGraph-Level1"){
	$i = 1;
} 

if($gname[0]=="CycleRace" || $gname[0]=="CarPark" || $gname[0]== "BallAndBox" || $gname[0]== "TakeTurns" ||  $gname[0]== "BusRide" ||  $gname[0]== "Fishing"||  $gname[0]== "StarLight" || $gname[0]=="MatchMe" || $gname[0]=="AlphaNumericEncode")
{
	$runningBg1=0;
	 
}
else
{
	$runningBg1=0;

}


  
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no, maximum-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title><?php echo $gamename; ?></title>
	<link rel="stylesheet" type="text/css" href="assets/style.css">
	<link rel="stylesheet" type="text/css" href="assets/coloranim.css">

	<script src="assets/speak.js"></script>
	<script src="assets/jquery-3.2.1.min.js"></script>
	
	<script>var bgTheme = "<?php echo '/'.$themeArr[$i];?>";
	var AngSndval="<?php echo $sndval; ?>";
 var AngSndNam="";
 if(AngSndval==1)
 {
	AngSndNam="assets/sound/sound_1.mp3";
 }
 else if(AngSndval==2){
	AngSndNam="assets/sound/sound_2.mp3";
 }
 else if(AngSndval==3){
	AngSndNam="assets/sound/sound_3.mp3";
 }
 else if(AngSndval==4){
	AngSndNam="assets/sound/sound_4.mp3";
 }
 else if(AngSndval==5){
	AngSndNam="assets/sound/sound_5.mp3";
 }
 else if(AngSndval==6){
	AngSndNam="assets/sound/sound_6.mp3";
 }
 else{
	AngSndNam="assets/sound/sound_1.mp3";
 }
	</script>
		<script>var GameNameWithLvl = "<?php echo $gamename;?>";</script>
	<script>var UniqueGameName = GameNameWithLvl.split("-")[0];</script>
			<script>var GameName = "<?php echo $gname[0];?>";</script>
	<script>var runningBg = "<?php echo $runningBg1;?>";</script>

	<script>
////////////////////////////my work/////////////////////s
var AngGameName="<?php echo $gamename; ?>";
var AngGameId="<?php echo $gameid; ?>";
var AngUId="<?php echo $uid; ?>";
var AngUrl="<?php echo $angurl; ?>";
var AngEId="<?php echo $eid; ?>";
var AngAssStatus="<?php echo $ass_status; ?>";
var AngAssSlot="<?php echo $ass_slot; ?>";
var AngSkillkit_id="<?php echo $skillkit_id; ?>";
var Angyear_status="<?php echo $year_status; ?>";
var AngBaseUrl="http://localhost:3000/";
var Angtesttype="<?php echo $testtype; ?>";
var Angisass2train="<?php echo $isass2train; ?>";
var Angsession_id="<?php echo $session_id; ?>";

 ////////////////////////////my work/////////////////////e
//  $(window).keydown(function(e){

// 		e.preventDefault();
	
//  });


// $(window).keydown(function(e){
// 	if(e.which==116){
// 	window.open(AngUrl, "_self");
// 		e.preventDefault();
// 	}
//  });

</script>



<script>
var lang = "EnglishQuestionText/";
var questionTextPath = "commonQuestionText/"+lang;		
var assetsPathLang="<?php echo $getassetsPathLang;?>"
</script>
	
</head>
 
<body>

<?php if($runningBg1==1){ ?>
	<div id="content"><canvas id="gameCanvas" width="1280" height="720" style="background:url(<?php echo $getassetsPathLang; ?>/HowToPlayScreen1.png),
																					url(assets/<?php echo $themeArr[$i]; ?>/Background3.png),
																					url(assets/<?php echo $themeArr[$i]; ?>/Background2.png),
																					url(assets/<?php echo $themeArr[$i]; ?>/Background1.png),
																					url(assets/<?php echo $themeArr[$i]; ?>/Background.png);
																					background-position: center;background-repeat: no-repeat, no-repeat; background-color:#000; background-size: 100%, 100%;" ></canvas></div>
<?php } else{ ?>

	
	<div id="content"><canvas id="gameCanvas" width="1280" height="720" style="background:url(<?php echo $getassetsPathLang; ?>/HowToPlayScreen1.png),url(<?php echo $gamename; ?>/Background.png);background-position: center;
	background-repeat: no-repeat, no-repeat; background-color:#000;  background-size: 100%, 100%;" ></canvas></div>

<?php } ?>

 <div id="content1">
	 <div class='center'>
 
<p class="awesome">SkillAngels</p>
<div class='center1'>
<svg width="100" height="100" viewBox="0 0 300 300">
  <defs>
    <linearGradient id="gradient-fill" gradientUnits="userSpaceOnUse" 
   x1="0" y1="300" x2="300" y2="0">
      <stop offset="0%">
        <animate attributeName="stop-color" values="#00E06B;#CB0255;#00E06B" dur="1s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%">
        <animate attributeName="stop-color" values="#04AFC8;#8904C5;#04AFC8" dur="2s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
    <clipPath id="clip">
      <rect class="square s1" x="0" y="0" rx="12" ry="12" height="90" width="90"></rect>
      <rect class="square s2" x="100" y="0" rx="12" ry="12" height="90" width="90"></rect>
      <rect class="square s3" x="200" y="0" rx="12" ry="12" height="90" width="90"></rect>
      <rect class="square s4" x="0" y="100" rx="12" ry="12" height="90" width="90"></rect>
      <rect class="square s5" x="200" y="100" rx="12" ry="12" height="90" width="90"></rect>
      <rect class="square s6" x="0" y="200" rx="12" ry="12" height="90" width="90"></rect>
      <rect class="square s7" x="100" y="200" rx="12" ry="12" height="90" width="90"></rect>
    </clipPath>
  </defs>
  <rect class="gradient" clip-path="url('#clip')" height="300" width="300"></rect>
</svg>
</div>
</div> 

</div>

<div id="transpAlert" class="centerMsg"><p><img src="assets/landIcon.svg" width="40px" /><br>Turn your device to the side to start play game!</p></div>
<div id="BrowserSupport" class="centerMsg"><p>Your browser is not currently supported.</p></div>
<script async src="assets/createjs-2015.11.26.min.js"></script>


<script async type="text/javascript" src="ErrorLog.js"></script>

<script async type="text/javascript" src="assets/GetJsonData.js"></script>
<script async type="text/javascript" src="<?php echo $gamename; ?>/main.js"></script>

<script async type="text/javascript" src="<?php echo $gamename;?>/<?php echo $gamename;?>Intro.js"></script>

<script async type="text/javascript" src="assets/answerLoader.js"></script>
<script async type="text/javascript" src="assets/GameInit.js"></script>
<script async type="text/javascript" src="assets/GameStart.js"></script>
<script async type="text/javascript" src="assets/GameValidation.js"></script>
<script async type="text/javascript" src="assets/HtmlRedirect.js"></script>
<script async type="text/javascript" src="assets/GameInitLoader.js"></script>
<script async type="text/javascript" src="assets/StartQuestion.js"></script>
<script async type="text/javascript" src="assets/GameQuestions.js"></script>
<script async type="text/javascript" src="assets/ScoreValidation.js"></script>
<script async type="text/javascript" src="assets/pleaserotate.js"></script>
<script async type="text/javascript" src="assets/GameTitle.js"></script>

<script>
var getJSName ="<?php echo $gamename; ?>";
console.log("var getJSName "+getJSName)
window.location.hash="no-back-button";
window.location.hash="Again-No-back-button";//again because google chrome don't insert first hash into history
window.onhashchange=function(){window.location.hash="no-back-button";}
</script>

</script>
<script type='text/javascript'>
  window.addEventListener('focus', startIntro);
  window.addEventListener('blur', stopGameIntro);
  //// Run gameintro
 function startIntro(){
	 console.log('focus in');
	 createjs.Ticker.paused = false;	
 }
 
 ///// Stop gameintro
 function stopGameIntro(){
	 console.log('focu out');
	 createjs.Ticker.paused = true;
 } 

 </script>

</body>
</html>


 