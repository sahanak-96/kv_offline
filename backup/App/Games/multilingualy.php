<?php
session_start();  
$_SESSION['demoskill']['glang']="ArabicQuestionText";
?> 

<!DOCTYPE html>

<html lang="en" class=""><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">

    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">

    <meta name="description" content="">

    <meta name="author" content="">

	<title>Skill Angels Game Suite</title>

    <!-- Bootstrap Core CSS -->

    <link  href="css/bootstrap.min.css" rel="stylesheet">

	<!-- MetisMenu CSS -->

    <link  href="css/metisMenu.min.css" rel="stylesheet">

	<!-- Custom CSS -->

    <link  href="css/sb-admin-2.css" rel="stylesheet">

    <link  href="css/style.css" rel="stylesheet">

	<!-- Custom Fonts -->

    <link  href="css/font-awesome.min.css" rel="stylesheet" type="text/css">

	<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->

    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->

    <!--[if lt IE 9]>

        <script src="js/html5shiv.js"></script>

        <script src="js/respond.min.js"></script>

    <![endif]-->

	<link rel="icon" href="favicon.ico">

<script src="js/jquery-1.11.0.min.js"></script>

<link rel="stylesheet" type="text/css" href="js/fancy/jquery.fancybox.css" media="screen">

<link rel="stylesheet" type="text/css" href="js/fancy/fullscreen.css" media="screen">

<script type="text/javascript" src="js/fancy/jquery.fancybox.js"></script>

 

<style>

.divSep{padding-bottom:10px;}

.minHght{min-height:218px;}

.minHght h4.ng-binding{min-height:28px;}

.active

{

background-color:rgba(0, 67, 113, 0.65);

}

.active a.menuparent

{

color:#fff !important;

}

.menu

{

background-color:#e0f1ef;	

}

.not-active {

   pointer-events: none;

   cursor: default;

}

.nav>li>a:focus, .nav>li>a:hover {

    text-decoration: none;

    background-color: rgb(218, 247, 255);

	color:#35605c !important;

}



</style>

</head>

<body style="" >

<div id="wrapper">

<!-- header starts here -->

 <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">

<div class="pageheader">           

		   <div class="navbar-header">

                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">

                    <span class="sr-only">Toggle navigation</span>

                    <span class="icon-bar"></span>

                    <span class="icon-bar"></span>

                    <span class="icon-bar"></span>

                </button>

				<a style="clear:both;" class="navbar-brand navbar-brand1" href="javascript:;"><img src="images/Parrot_logo_wink2.png" width="90" height="90" alt="logo"></a>

			



            </div>

            <!-- /.navbar-header -->

		<div class="" style="text-align: center;">

			<span style="clear:both;position:relative" class="topHead">Puzzle Suite</span>

			<ul style="float:right;" class="nav navbar-top-links navbar-right rightSideButton">

                <a href="logout.php" class="btn btn-primary">Logout</a>

            </ul>

			</div>

            

			</div>

			<div class="pagemenu" style="padding-top: 40px;">

		   <div class="navbar-default sidebar" role="navigation">

                <div class="sidebar-nav navbar-collapse">

                    <ul class="nav" id="side-menu">

				  

						 

                        <li>

                            <a id="I" class="Cognitive  menu" style="cursor:pointer">I<i class="fa fa-gamepad fa-fw"></i></a>

                        </li>  

						<li>

                            <a id="II" class="Cognitive  menu" style="cursor:pointer">II<i class="fa fa-gamepad fa-fw"></i></a>

                        </li>

						<li>

                            <a id="III" class="Cognitive  menu" style="cursor:pointer">III<i class="fa fa-gamepad fa-fw"></i></a>

                        </li>

                       <li>

                            <a id="IV" class="Cognitive  menu" style="cursor:pointer">IV<i class="fa fa-gamepad fa-fw"></i></a>

                        </li>

						<li>

                            <a id="V" class="Cognitive  menu" style="cursor:pointer">V<i class="fa fa-gamepad fa-fw"></i></a>

                        </li>

                       <li>

                            <a id="VI" class="Cognitive  menu" style="cursor:pointer">VI<i class="fa fa-gamepad fa-fw"></i></a>

                        </li>

						<li>

                            <a id="VII" class="Cognitive  menu" style="cursor:pointer">VII<i class="fa fa-gamepad fa-fw"></i></a>

                        </li>

						<li>

                            <a id="VIII" class="Cognitive  menu" style="cursor:pointer">VIII<i class="fa fa-gamepad fa-fw"></i></a>

                        </li>

						  

                </ul>           

                       

               

                    </ul>

					<script>

					$(document).ready(function(){

						$(".NewBanner").hide();

					$("div.Cognitive").show();

					$("div.Math").hide();

					$("div.Skill").hide();

					//$("div.Cognitive#LKG").show();

					$("a.menuparent").click(function(){

					$("a.menuparent").parent().removeClass("active");

					$(this).parent().addClass("active");

					});

					$("a.Cognitive").click(function(){

						$(".NewBanner").hide();

					$("div.Math").hide();

					$("div.Life").hide();

					$("div.Skill").hide();

					$("a.Math").removeClass("active");

					$("a.Skill").removeClass("active");

					$("a.Cognitive").removeClass("active");

					$("a.Cognitive#"+$(this).attr('id')).addClass("active");

					$("div.Cognitive").hide();

					$("div.Cognitive#"+$(this).attr('id')).show();



					});

					

					$("a.liaLife").click(function(){

						$(".NewBanner").hide();

					$("div.Cognitive").hide();

					$("div.Math").hide();

					$("div.Skill").hide();

					$("a.Cognitive").removeClass("active");

					$("a.Math").removeClass("active");

					$("a.Skill").removeClass("active");

					$("div.Life").show();

					

					});

					$("a.Math").click(function(){

						$(".NewBanner").hide();

					$("div.Cognitive").hide();

					$("div.Life").hide();

					$("div.Skill").hide();

					$("a.Cognitive").removeClass("active");

					$("a.Math").removeClass("active");

					$("a.Skill").removeClass("active");

					$("a.Math#"+$(this).attr('id')).addClass("active");

					$("div.Math").hide();

					$("div.Math#"+$(this).attr('id')).show();



					});

					$("a.Skill").click(function(){

						$(".NewBanner").hide();

					$("div.Cognitive").hide();

					$("div.Life").hide();

					$("div.Math").hide();

					$("a.Cognitive").removeClass("active");

					$("a.Math").removeClass("active");

					$("a.Skill").removeClass("active");

					$("a.Skill#"+$(this).attr('id')).addClass("active");

					$("div.Skill").hide();

					$("div.Skill#"+$(this).attr('id')).show();



					});

					<?php if(!$_SESSION['demoskill']['ukg']=='1'){ ?>

					$("a.Cognitive#I").click();

					<?php } 

					else{ ?>

					$("a.Cognitive#I").click();	

					<?php } ?>

					});

					</script>

                    <!--

					<ul class="side-skill pageHomePager myprofilehide DashboardPager MyGamesPager MyReportsPager" style="display: block;">

                            	<li>Memory (M)<span class="performanceMemory"></span></li>

                                <li>Visual Processing (VP)<span class="performanceVP"></span></li>

                                <li>Focus and Attention (FA)<span class="performanceFA"></span></li>

                                <li>Problem Solving (PS)<span class="performancePS"></span></li>

                                <li>Linguistics (LI)<span class="performanceLinguistics"></span></li>

                            </ul>

							-->

                </div>

            </div>	

			  </div>	

</nav>

 <!--  header ends here -->

<div id="page-wrapper">

 <!-- home page starts here -->

<!--home page ends here  -->

<!--  Dashboard starts here -->

<!--Dashboard ends here-->

<!--My games starts here -->









<div class="MyGamesPager pageHomePagerHide Dashboardhide myreporthide myprofilehide" style="display: block;">

  <div class="row">

                <div class="col-lg-12">

                    <h1 class="page-header"></h1>

                </div>

                <!-- /.col-lg-12 -->

            </div>

            <div class="row">

			<div class="col-lg-12 NewBanner">

			<!-- <img width="100%" src="images/Newbanner.jpg"/> -->

			

			</div>

      			<div class="col-lg-12">

						<div class="contentbox Cognitive" style="display:none;" id="I">

        					<div class="gamesList">

                			<div class="gameBox MemoryGame">

                				<h3 title="" class="ng-binding">Memory</h3>

								<div class="minHght"><h4 title="" class="ng-binding">Bus Ride</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BusRide-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BusRide-Level2_6232746895.png" /></a> 

                    		<div>
                                <?php  
                                     $files = glob('BusRide-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>

                			</div>

							 <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">AlphaNumeric Encode</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=AlphaNumericEncode-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AlphaNumericEncode-Level3_387589167.png" /></a> 
                           </div> -->

						<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Mind Capture</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MindCapture-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MindCapture-Level3_3766070040.png" /></a> 
                            <div>
                                <?php  
                                     $files = glob('MindCapture-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>
                    			

                			</div>		
							<hr class="CustomHR"/>

								 <div class="minHght"><h4 title="" class="ng-binding">Memory Check</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MemoryCheck-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MemoryCheck-Level3_7822075057.png" /></a> 
                             <div>
                                <?php  
                                     $files = glob('MemoryCheck-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>
                    			</div>

							<hr class="CustomHR"/>
							<div class="minHght"><h4 title="" class="ng-binding">Mom And Me</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MomAndMe&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MomAndMe_6942562656.png.png" /></a> 
                               <div>
                                <?php  
                                     $files = glob('MomAndMe/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>              		
                			</div>

							<hr class="CustomHR"/>
							<div class="minHght"><h4 title="" class="ng-binding">Fishing</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Fishing&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Fishing_4694063616.png" /></a> 
                             <div>
                                <?php  
                                     $files = glob('Fishing/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>            			

                			</div>

							<hr class="CustomHR"/>
							<div class="minHght">
							<h4 title="" class="ng-binding">Balloon Burst</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BalloonBurst-A1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BalloonBurst-Level3_2492009233.png" /></a>                             
							<div>
                                <?php  
                                     $files = glob('Fishing/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>            			

                			</div>
							<hr class="CustomHR"/>
							<div class="minHght"><h4 title="" class="ng-binding">BasketBall-Level1 </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BasketBall-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BasketBall-Level1.png" /></a> 
                               <div>
                                <?php  
                                     $files = glob('BasketBall-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>  

                			</div>
							
						
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">BallBounce-Level1</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BallBounce-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BallBounce-Level1.png" /></a> 
								
								      <div>
                                <?php  
                                     $files = glob('BallBounce-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>  

                			</div>
						

							<!--<hr class="CustomHR"/>
							 <div class="minHght"><h4 title="" class="ng-binding">Mind Capture</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="swf/BalloonBurst-Level1.html" class="fancybox fancybox.iframe"> <img  src="images/icon/BalloonBurst-Level1_8117342898.png.png" /></a>

								<!-- <a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MindCapture-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MindCapture-Level3_3766070040.png" /></a> 

                    			 -->

                			<!-- </div> -->  

           				  	<!-- </div> -->

            				</div>
							
							</div>
							<div class="gamesList">

                			<div class="gameBox VisualProcessingGame">

                            	<h3 title="" class="ng-binding">VisualProcessing</h3>

                				<div class="minHght"><h4 title="" class="ng-binding">Eye Cells</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=EyeCells-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/EyeCells-Level3_8897464917.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Object Shade</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ObjectShade&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ObjectShade_7239343100.png.png" /></a>  

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Word Wipe</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WordWipe-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WordWipe-Level2_4875887525.png" /></a>  

                			</div>

							

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Best Fit</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BestFit-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BestFit-Level2.png" /></a>  

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">EdCells</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=EdCells-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/EdCells-Level3_4655870916.png" /></a>  

                			</div>

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Face2Face</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Face2Face-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Face2Face-Level1_5178543743.png" /></a>  

                			</div> -->

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Match Me</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MatchMe-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MatchMe-Level3_3926392993.png" /></a>  

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Character Shade</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=CharacterShade-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/CharacterShade-Level3_3322312142.png" /></a>  

                			</div>

            				</div>

            		</div><div class="gamesList">

                			<div class="gameBox FocusGame">

                            	<h3 title="" class="ng-binding">FocusAndAttention</h3>	

<div class="minHght"><h4 title="" class="ng-binding">Last Legend</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=LastLegend-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/LastLegend-Level3_5495434515.png" /></a> 

                			</div>

							<hr class="CustomHR"/>	

<div class="minHght"><h4 title="" class="ng-binding">Number Jigsaw</h4>
								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumberJigsaw-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumberJigsaw-Level3_7143653305.png" /></a> 
	</div>

							<hr class="CustomHR"/>							

                				<div class="minHght"><h4 title="" class="ng-binding">Star Light</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=StarLight-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/StarLight-Level2_988681958.png" /></a> 

                			</div>

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Star Light</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=StarLight-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/StarLight-Level2_988681958.png" /></a> 

                			</div> -->

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Stranger Grid</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=StrangerGrid-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/StrangerGrid_9728514011.png.png" /></a> 

                			</div>
<!--
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Spot Me</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=SpotMe-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/SpotMe-Level2_5270674000.png" /></a> 

                			</div>
							-->

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Word Spell</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WordSpell-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WordSpell-Level1_4793716236.png.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Letter Jigsaw</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=LetterJigsaw-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AlphabetJigsaw-Level3_1882078954.png" /></a> 

                			</div>
							<!--
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">BallBounce-Level1</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BallBounce-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BallBounce-Level1.png" /></a> 

                			</div>
							-->
							
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">MoreLess</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MoreLess&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MoreLess.png" /></a> 

                			</div>

							 

            				</div>  

            				</div><div class="gamesList">

                			<div class="gameBox ProblemSolvingGame">

                            	<h3 title="" class="ng-binding">ProblemSolving</h3>

								<div class="minHght"><h4 title="" class="ng-binding">What Comes Next</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhatComesNext&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhatComesNext-Level1_3932243706.png" /></a> 

                			</div>

							<hr class="CustomHR"/>

							<div class="minHght"><h4 title="" class="ng-binding">Word Shapes</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WordShapes-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WordShapes-Level3_9543727268.png" /></a> 

                			</div>
							<hr class="CustomHR"/>

                				<div class="minHght"><h4 title="" class="ng-binding">Add Master</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=AddMaster-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AddMaster-Level3_2056090440.png" /></a> 


                			</div>

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Heavy Or Light</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=HeavyOrLight-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/HeavyOrLight-Level2_607259180.png" /></a> 

                			</div> -->

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Clock Arithmetic</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ClockArithmetic&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ClockArithmetic_6831587473.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">NumberDecode</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumberDecode&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumberDecode-Level2_2425581049.png" /></a> 

                			</div>
					
							<hr class="CustomHR"/>
							<!--
							<div class="minHght"><h4 title="" class="ng-binding">WordShapes-Level2</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WordShapes-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WordShapes-Level3_9543727268.png" /></a> 

                			</div>

							<hr class="CustomHR"/>
							-->
							<div class="minHght"><h4 title="" class="ng-binding">Reshuffle</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Reshuffle&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Reshuffle-Level3_2661516019.png" /></a> 

                			</div>
							
							
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Date-Level2</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Date-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Date-Level2.png" /></a> 

                			</div>
							
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">DescendingOrder</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=DescendingOrder&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DescendingOrder.png" /></a> 

                			</div>
							
							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">DiceAddition-Level1</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=DiceAddition-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DiceAddition-Level1.png" /></a> 

                			</div> -->

							

            				</div>

            				</div><div class="gamesList">

                			<div class="gameBox LinguisticsGame">

                            	<h3 title="" class="ng-binding">Linguistics</h3>

                				<div class="minHght"><h4 title="" class="ng-binding">Who Am I - Shapes </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhoAmI-Shapes&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhoAmI-Shapes_7515025790.png.png" /></a> 

                				</div>

								<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">WhoAmI-Birds </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhoAmI-Birds&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhoAmI-Birds_7869069152.png.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Compound Words </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=CompoundWords&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ArrangeTheWords-Level2_2614120254.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Who Am I-HouseHold Things </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhoAmI-HouseHoldThings&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/HouseHoldThings_8783441544.png.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Who Am I-Vegetables</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhoAmI-Vegetables&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhoAmI-Vegetables_7871570191.png.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Who Am I-Fruits</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhoAmI-Fruits&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhoAmI-Fruits_91387722.png.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Who Am I-DomesticAnimals </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhoAmI-DomesticAnimals&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhoAmI-DomesticAnimals_818332880.png.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Who Am I-Colors </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhoAmI-Colors&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhoAmI-Colors_1446446431.png.png" /></a> 

                			</div>

							 

            				</div> 

            			</div></div>
						
						
						<div class="contentbox Cognitive" style="display:none;" id="II">

        					
							<div class="gamesList">

                			<div class="gameBox MemoryGame">

                				<h3 title="" class="ng-binding">Memory</h3>
<!-- 
								<div class="minHght"><h4 title="" class="ng-binding">Memory Check</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MemoryCheck-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MemoryCheck-Level3_7822075057.png" /></a>  
                    			

                			</div><hr class="CustomHR"/>


							<div class="minHght">
							<h4 title="" class="ng-binding">Balloon Burst</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BalloonBurst-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BalloonBurst-Level3_2492009233.png" /></a>
                               <div>
                                <?php  
                                     $files = glob('BalloonBurst-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>

								</div>-->

							<hr class="CustomHR"/>
							
							
							<div class="minHght"><h4 title="" class="ng-binding">Cycle Race</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=CycleRace-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/CycleRace-Level3_6173525671.png" /></a> 
                            <div>
                                <?php  
                                     $files = glob('CycleRace-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>
	  
	  
                			</div>

							<hr class="CustomHR"/>
								 <div class="minHght"><h4 title="" class="ng-binding">Sequence Memory</h4>
								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=SequenceMemory-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/SequenceMemory-Level3_9452287289.png" /></a> 
                                 <div>
                                <?php  
                                     $files = glob('SequenceMemory-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>
								
								
								</div>
								
								<!--<hr class="CustomHR"/>									
													
								<div class="minHght">
								<h4 title="" class="ng-binding">Mind Capture</h4>
								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MindCapture-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MindCapture-Level3_3766070040.png" /></a> 
							 <div>
                                <?php  
                                     $files = glob('MindCapture-Level2/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>	
								
								
								
                            	</div>-->
 
						<!--	<hr class="CustomHR"/>
							<div class="minHght"><h4 title="" class="ng-binding">Balloon Burst</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BalloonBurst-A1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MindCapture-Level2_5165879982.png" /></a> 
                            </div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Balloon Burst</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BalloonBurst-A2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MemoryCheck-Level2_8882285202.png" /></a> 
                             	</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Mind Capture</h4>
                                 <!--<a data-fancybox  data-type="iframe" href="javascript:;" data-src="swf/BalloonBurst-Level1.html" class="fancybox fancybox.iframe"> <img  src="images/icon/BalloonBurst-Level1_8117342898.png.png" /></a>  
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MindCapture-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>"  class="fancybox fancybox.iframe"> <img  src="images/icon/MindCapture-Level3_3766070040.png" /></a> 
                                 	</div> -->
							            <hr class="CustomHR"/>
										<div class="minHght">
										<h4 title="" class="ng-binding">MemoryMaster</h4>


								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MemoryMaster&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>"  class="fancybox fancybox.iframe"> <img  src="images/icon/MemoryMaster.png" /></a> 

                    		 <div>
                                <?php  
                                     $files = glob('MemoryMaster/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>	

                			</div>
							
							<hr class="CustomHR"/>
							<div class="minHght">
							<h4 title="" class="ng-binding">MissingShapes-Level1</h4>								

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MissingShapes-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>"  class="fancybox fancybox.iframe"> <img  src="images/icon/MissingShapes-Level1.png" /></a> 

                    			 <div>
                                <?php  
                                     $files = glob('MissingShapes-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>
                			</div>

           				  	</div>

            				</div>
							
							<div class="gamesList">

                			<div class="gameBox VisualProcessingGame">

                            	<h3 title="" class="ng-binding">VisualProcessing</h3>

                				<!-- <div class="minHght"><h4 title="" class="ng-binding">Eye Cells</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=EyeCells-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/EyeCells-Level3_8897464917.png" /></a> 

                    			

                			</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Character Shade</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=CharacterShade-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/CharacterShade-Level3_3322312142.png" /></a>  

                			</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Match Me</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MatchMe-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MatchMe-Level3_3926392993.png" /></a>  

                			</div> -->

							

							 <div class="minHght"><h4 title="" class="ng-binding">EdCells</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=EdCells-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/EdCells-Level3_4655870916.png" /></a>  

                			</div>

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Word Wipe</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WordWipe-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WordWipe-Level2_4875887525.png" /></a>  

                			</div> -->

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">AlphaNumber Read</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=AlphaNumberRead&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AlphaNumberRead_8101214673.png" /></a>  

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Face2Face-Level2</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Face2Face-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Face2Face-Level1_5178543743.png" /></a>  

                			</div>

							<!--<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Best Fit Optimized</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="swfn/BestFit-Level4a.html" class="fancybox fancybox.iframe"> <img  src="images/icon/BestFit-Level3_8792649721.png" /></a>  

                			</div>

							-->

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">ReflectionRead-Level1</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ReflectionRead-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ReflectionRead-Level1_7608671374.png" /></a>  

                			</div>

            				</div>

            		</div>
							
							<div class="gamesList">

                			<div class="gameBox FocusGame">

                            	<h3 title="" class="ng-binding">FocusAndAttention</h3>	

<!-- <div class="minHght"><h4 title="" class="ng-binding">Letter Jigsaw</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=LetterJigsaw-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AlphabetJigsaw-Level3_1882078954.png" /></a> 

                			</div> 

							<hr class="CustomHR"/>	-->

<!-- <div class="minHght"><h4 title="" class="ng-binding">Object Spell</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ObjectSpell-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ObjectSpell-Level2_9643486370.png" /></a> 

                			</div> 

							<hr class="CustomHR"/>							
-->
                				<!-- <div class="minHght"><h4 title="" class="ng-binding">Last Legend</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=LastLegend-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/LastLegend-Level3_5495434515.png" /></a> 

                			</div> 
							<hr class="CustomHR"/>-->
							<div class="minHght"><h4 title="" class="ng-binding">Down Under</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=DownUnder-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DownUnder-Level2_5347298909.png" /></a> 

                			</div>
<!-- 
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Spot Me </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=SpotMe-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/SpotMe-Level2_5270674000.png" /></a> 

                			</div> -->

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Word Spell </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WordSpell-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WordSpell-Level1_4793716236.png.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Letter Jigsaw</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=LetterJigsaw-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AlphabetJigsaw-Level3_1882078954.png" /></a> 

                			</div>

						<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Spot Me </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=SpotMe-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/SpotMe-Level3_4077972709.png" /></a> 

                			</div> 
							
							<hr class="CustomHR"/>
							<div class="minHght"><h4 title="" class="ng-binding">BasketBall-Level1 </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BasketBall-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BasketBall-Level1.png" /></a> 

                			</div>
-->
							

            				</div>  

            				</div><div class="gamesList">

                			<div class="gameBox ProblemSolvingGame">

                            	<h3 title="" class="ng-binding">ProblemSolving</h3>

								<div class="minHght"><h4 title="" class="ng-binding">Para Master </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ParaMaster-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ParaMaster-Level3_8316638404.png" /></a> 

                			</div>

							<!-- <hr class="CustomHR"/>

							<div class="minHght"><h4 title="" class="ng-binding">Reshuffle</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Reshuffle-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Reshuffle-Level3_2661516019.png" /></a> 

                			</div> -->
							<!-- <hr class="CustomHR"/>

                				<div class="minHght"><h4 title="" class="ng-binding">Number Decode</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumberDecode-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumberDecode-Level2_2425581049.png" /></a> 

                			</div> -->
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Numbers On The Wheel</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumbersOnTheWheel-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumbersOnTheWheel-Level3_7181768785.png" /></a> 

                			</div>

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Word Shapes</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WordShapes-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WordShapes-Level3_9543727268.png" /></a> 

                			</div> -->
<!-- 
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Reshuffle</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Reshuffle&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Reshuffle-Level3_2661516019.png" /></a> 

                			</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Numbers On The Wheel</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumbersOnTheWheel-A1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumbersOnTheWheel-Level3_7181768785.png" /></a> 

                			</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Numbers On The Wheel</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumbersOnTheWheel-A2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumbersOnTheWheel-Level3_7181768785.png" /></a> 

                			</div>
							 -->
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">DiceAddition-Level2</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=DiceAddition-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DiceAddition-Level2.png" /></a> 

                			</div>

							

            				</div>

            				</div><div class="gamesList">

                			<div class="gameBox LinguisticsGame">

                            	<h3 title="" class="ng-binding">Linguistics</h3>

                				<div class="minHght"><h4 title="" class="ng-binding">Who Am I-Clothes </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhoAmI-Clothes&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhoAmI-Clothes_236435011.png" /></a> 

                				</div>

								<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">WhoAmI-Insects</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhoAmI-Insects&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhoAmI-Insects_9486121060.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Who Am I-Transport</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhoAmI-Transport&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhoAmI-Transport_156703181.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Who Am I-School</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhoAmI-School&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhoAmI-School_1506193187.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Who Am I-WildAnimals</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhoAmI-WildAnimals&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhoAmI-WildAnimals_8843113635.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Anagrams-Food</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-Food&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-Food_9358940329.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Who Am I-Flowers</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhoAmI-Flowers&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhoAmI-Flowers_4361387616.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Anagrams-CountryNames </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-CountryNames&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-CountryNames_9848174657.png" /></a> 

                			</div>
							
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">FindMe </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=FindMe&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/FindMe.png" /></a> 

                			</div>

							<!--<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">BalloonWorks-Level1 </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="swfn/BalloonWorks-Level1.html" class="fancybox fancybox.iframe"> <img  src="images/icon/BalloonBurst-Level1_8117342898.png" /></a> 

                			</div>

							 -->

            				</div> 

            			</div>
							
							
							
							</div>
						
			

<div class="contentbox Cognitive" style="display:none;" id="III">

        					<div class="gamesList">

                			<div class="gameBox MemoryGame">

                				<h3 title="" class="ng-binding">Memory</h3>
<!-- 
								<div class="minHght"><h4 title="" class="ng-binding">Balloon Burst</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BalloonBurst-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BalloonBurst-Level3_2492009233.png" /></a> 

                    			 -->

                			<!-- </div><hr class="CustomHR"/>

							<div class="minHght"><h4 title="" class="ng-binding">Bus Ride</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BusRide-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BusRide-Level2_6232746895.png" /></a> 

                    			

                			</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Cycle Race </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=CycleRace-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/CycleRace-Level3_6173525671.png" /></a> 

                    			

                			</div> 

							<hr class="CustomHR"/>-->

								 <div class="minHght">
								 <h4 title="" class="ng-binding">AlphaNumeric Encode </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=AlphaNumericEncode-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AlphaNumericEncode-Level3_387589167.png" /></a> 
							 <div>
                                <?php  
                                     $files = glob('AlphaNumericEncode-Level2/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>

								</div>



							<hr class="CustomHR"/>	

<div class="minHght">
<h4 title="" class="ng-binding">Ball Shooter </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BallShooter-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Ball_Shooter.png" /></a> 
                                   <div>
                                <?php  
                                     $files = glob('BallShooter-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>

                			</div>
							
							<hr class="CustomHR"/>
						<!--		<div class="minHght">
						<h4 title="" class="ng-binding">Mind Capture</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MindCapture-Level5&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MindCapture-Level5_2807246898.png" /></a> 
                                  <div>
                                <?php  
                                     $files = glob('MindCapture-Level5/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>
                     			

                			</div>-->
							
							<hr class="CustomHR"/>
							<div class="minHght"><h4 title="" class="ng-binding">BallArrangement</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BallArrangement&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BallArrangement.png" /></a> 

                     			      <div>
                                <?php  
                                     $files = glob('BallArrangement/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>

                			</div>

           				  	
</div>
            				</div>
							<div class="gamesList">

                			<div class="gameBox VisualProcessingGame">

                            	<h3 title="" class="ng-binding">VisualProcessing</h3>

                				<!-- <div class="minHght"><h4 title="" class="ng-binding">Best Fit </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BestFit-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BestFit-Level2.png" /></a> 

                    			

                			</div> 

							<hr class="CustomHR"/>-->
							<div class="minHght"><h4 title="" class="ng-binding">Hand2Hand</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Hand2Hand&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Hand2Hand_5783699043.png" /></a>  

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Just Not Half </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=JustNotHalf-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/JustNotHalf-Level1_6506787771.png" /></a>  

                			</div>

							

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">EdCells </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=EdCells-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/EdCells-Level3_4655870916.png" /></a>  

                			</div>

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Match Me </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MatchMe-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MatchMe-Level3_3926392993.png" /></a>  

                			</div> -->

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Missing Piece </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MissingPiece-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MissingPiece-Level1_5453919009.png" /></a>  

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Animal Wipe</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=AnimalWipe&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AnimalWipe_6567529789.png" /></a>  

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Reverse Reading </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ReverseReading-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ReverseReading-Level1_3469542353.png" /></a>  

                			</div>
							
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">FlippedImage-Level1 </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=FlippedImage-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/FlippedImage-Level1.png" /></a>  

                			</div>

							 

            				</div>

            		</div>
					<div class="gamesList">

                			<div class="gameBox FocusGame">

                            	<h3 title="" class="ng-binding">FocusAndAttention</h3>	

<div class="minHght"><h4 title="" class="ng-binding">Animal Spell</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=AnimalSpell&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AnimalSpell_5479293791.png" /></a> 

                			</div>
<!--
							<hr class="CustomHR"/>	

<div class="minHght"><h4 title="" class="ng-binding">Ball Shooter </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BallShooter-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Ball_Shooter.png

" /></a> 

                			</div>
							-->

							<hr class="CustomHR"/>							

                				<div class="minHght"><h4 title="" class="ng-binding">Object Spell </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ObjectSpell-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ObjectSpell-Level2_9643486370.png" /></a> 

                			</div>
							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Balloon Light </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BalloonLight-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DarkLight-Level2_7840619147.png" /></a> 

                			</div> -->

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Deep Under </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=DeepUnder-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ObjectSpell-Level2_9643486370.png" /></a> 

                			</div>

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Number Jigsaw </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumberJigsaw-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DeepUnder-Level1_7213067221.png" /></a> 

                			</div> -->

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Car Park </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=CarPark-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/CarPark-Level1_8054239703.png" /></a> 

                			</div>

							 

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Balloon Light</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BalloonLight-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DarkLight-Level1_1779258348.png" /></a> 

                			</div>
							
							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">BasketBall-Level2</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BasketBall-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BasketBall-Level2.png" /></a> 

                			</div>
							-->

            				</div>  

            				</div>
							<div class="gamesList">

                			<div class="gameBox ProblemSolvingGame">

                            	<h3 title="" class="ng-binding">ProblemSolving</h3>
<!-- 
								<div class="minHght"><h4 title="" class="ng-binding">Number Decode </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumberDecode-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumberDecode-Level2_2425581049.png" /></a> 

                			</div> -->

							<!-- <hr class="CustomHR"/>

							<div class="minHght"><h4 title="" class="ng-binding">Numbers On The Wheel </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumbersOnTheWheel-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumbersOnTheWheel-Level3_7181768785.png" /></a> 

                			</div> 
							<hr class="CustomHR"/>-->
<!-- 
                				<div class="minHght"><h4 title="" class="ng-binding">Para Master </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ParaMaster-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ParaMaster-Level3_8316638404.png" /></a> 

                			</div> 
							<hr class="CustomHR"/>-->
							
							<div class="minHght"><h4 title="" class="ng-binding">Add Master</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=AddMaster-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AddMaster-Level3_2056090440.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Heavy Or Light </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=HeavyOrLight-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/HeavyOrLight-Level2_607259180.png" /></a> 

                			</div>

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Reshuffle </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Reshuffle-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Reshuffle-Level3_2661516019.png" /></a> 

                			</div> -->
<!-- 
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Word Shapes </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WordShapes-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WordShapes-Level3_9543727268.png" /></a> 

                			</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Word Walls </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WordWalls-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WordWalls-Level1_1536627309.png" /></a> 

                			</div> -->
							
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">FindTheVertex </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=FindTheVertex&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/FindTheVertex.png" /></a> 

                			</div>

							

            				</div>

            				</div>
							<div class="gamesList">

                			<div class="gameBox LinguisticsGame">

                            	<h3 title="" class="ng-binding">Linguistics</h3>

                				<div class="minHght"><h4 title="" class="ng-binding">Anagrams-Clothes</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-Clothes&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-Clothing_8464276143.png" /></a> 

                				</div>

								<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Name Land </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NameLand-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NameLand-Level1_3850891082.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Who Am I-SeaAnimals </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhoAmI_SeaAnimals&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhoAmI-SeaAnimals_9400465255.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Anagrams-Animals </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-Animals&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-Animals_690025119.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Arrange The Words </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ArrangeTheWords-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ArrangeTheWords-Level2_2614120254.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Vowel Magic</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=VowelMagic&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/VowelMagic_9324571550.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Arrange The Words</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhoAmI-Birthday&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhoAmI-Birthday_9790617101.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Who Am I-Flowers </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhoAmI-Flowers&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhoAmI-Flowers_4361387616.png" /></a> 

                			</div>								 

            				</div> 
            			</div></div>			
						
						
						
		<div class="contentbox Cognitive" style="display:none;" id="IV">

        					<div class="gamesList">

                			<div class="gameBox MemoryGame">

                				<h3 title="" class="ng-binding">Memory</h3>

								<!-- <div class="minHght"><h4 title="" class="ng-binding">Balloon Burst </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BalloonBurst-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BalloonBurst-Level3_2492009233.png" /></a> 

                    			 

                			</div><hr class="CustomHR"/>-->

							<!-- <div class="minHght"><h4 title="" class="ng-binding">Cycle Race </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=CycleRace-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/CycleRace-Level3_6173525671.png" /></a> 

                    			

                			</div> 

							<hr class="CustomHR"/>-->
							<div class="minHght"><h4 title="" class="ng-binding">Dial A Number</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=DialAnumber&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DialANumber_8347820923.png" /></a> 

                     			      <div>
                                <?php  
                                     $files = glob('DialAnumber/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>
                    			

                			</div>

							<hr class="CustomHR"/>

								 <!-- <div class="minHght"><h4 title="" class="ng-binding">Sequence Memory </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=SequenceMemory-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/SequenceMemory-Level3_9452287289.png" /></a>  -->

                    			<!-- </div><hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">AlphaNumeric Encode 

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=AlphaNumericEncode-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AlphaNumericEncode-Level3_387589167.png" /></a> 

                    			

                			</div> 

							<hr class="CustomHR"/>-->
								<div class="minHght"><h4 title="" class="ng-binding">Whats In Store </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhatsInStore-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhatsInStore-Level1_99412277.png" /></a> 
                     			 <div>
                                <?php  
                                     $files = glob('WhatsInStore-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>
                    			

                			</div>
<!-- 
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Whats In Store</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhatsInStore-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhatsInStore-Level2_3776093176.png" /></a> 

                    			

                			</div> -->

							 <hr class="CustomHR"/>
							 <div class="minHght"><h4 title="" class="ng-binding">Back Track </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BackTrack-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BackTrack-Level1_257858377.png" /></a> 
<div>
                                <?php  
                                     $files = glob('BackTrack-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>
                     			

                			</div> 

           				  	</div></div>

            				 
							<div class="gamesList">

                			<div class="gameBox VisualProcessingGame">

                            	<h3 title="" class="ng-binding">VisualProcessing</h3>

                				<!-- <div class="minHght"><h4 title="" class="ng-binding">Reverse Reading </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ReverseReading-Level5&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ReverseReading-Level5_5669675888.png" /></a> 

                    			

                			</div> 

							<hr class="CustomHR"/>-->
							<div class="minHght"><h4 title="" class="ng-binding">Mirror Match </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MirrorMatch-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MirrorMatch-Level1_3191918600.png" /></a>  

                			</div>

							<hr class="CustomHR"/>
							
							<div class="minHght"><h4 title="" class="ng-binding">Character Shade </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=CharacterShade-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/CharacterShade-Level4_7572658732.png" /></a>  

                			</div>

							

							<!-- <hr class="CustomHR"/>
							 <div class="minHght"><h4 title="" class="ng-binding">Eye Cells </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=EyeCells-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/EyeCells-Level3_8897464917.png" /></a>  

                			</div> 

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding"> Reflection Read </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ReflectionRead-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ReflectionRead-Level2_2878144294.png" /></a>  

                			</div>
-->
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Form The Square </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=FormTheSquare-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/FormTheSquare-Level2_925395623.png" /></a>  

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Find The Twins </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=FindTheTwins-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/FindTheTwins-Level1_7979904958.png" /></a>  

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Form The Square </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=FormTheSquare-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/FormTheSquare-Level1_9003437426.png" /></a>  

                			</div>

							 

            				</div>

            		</div>
					<div class="gamesList">

                			<div class="gameBox FocusGame">

                            	<h3 title="" class="ng-binding">FocusAndAttention</h3>	
<!-- 
<div class="minHght"><h4 title="" class="ng-binding">Down Under </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=DownUnder-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DownUnder-Level2_5347298909.png" /></a> 

                			</div> 

							<hr class="CustomHR"/>	-->

<!-- <div class="minHght"><h4 title="" class="ng-binding">Number Jigsaw </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumberJigsaw-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumberJigsaw-Level3_7143653305.png" /></a> 

                			</div> 

							<hr class="CustomHR"/>		-->					

                				<!-- <div class="minHght"><h4 title="" class="ng-binding">Balloon Light</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BalloonLight-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DarkLight-Level3_6337577155.png" /></a> 

                			</div> -->  
							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Last Legend </h4> -->

								<!-- <a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=LastLegend-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/LastLegend-Level3_5495434515.png" /></a>  -->

                			<!-- </div> --> 

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Letter Jigsaw </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=LetterJigsaw-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AlphabetJigsaw-Level3_1882078954.png" /></a> 

                			</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Deep Under </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=DeepUnder-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DeepUnder-Level2_5933240540.png" /></a> 

                			</div>

							<hr class="CustomHR"/> 
							<div class="minHght"><h4 title="" class="ng-binding">Ball Shooter </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BallShooter-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Ball_Shooter.png

" /></a> 

                			</div>-->

							 <!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Spot Me </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=SpotMe-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/SpotMe-Level4_1111856144.png" /></a> 

                			</div> -->
							
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">MissingDots </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MissingDots&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MissingDots.png" /></a> 

                			</div>

							 

            				</div>  

            				</div><div class="gamesList">

                			<div class="gameBox ProblemSolvingGame">

                            	<h3 title="" class="ng-binding">ProblemSolving</h3>

								<!-- <div class="minHght"><h4 title="" class="ng-binding">Para Master </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ParaMaster-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ParaMaster-Level3_8316638404.png" /></a> 

                			</div> -->

							<!-- <hr class="CustomHR"/>

							<div class="minHght"><h4 title="" class="ng-binding">Numbers On The Wheel </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumbersOnTheWheel-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumbersOnTheWheel-Level3_7181768785.png" /></a> 

                			</div> 
							<hr class="CustomHR"/> -->
<!--
                				<div class="minHght"><h4 title="" class="ng-binding">Reshuffle </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Reshuffle-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Reshuffle-Level3_2661516019.png" /></a> 

                			</div> 
							<hr class="CustomHR"/>-->
							<div class="minHght"><h4 title="" class="ng-binding">Add Master </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=AddMaster-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AddMaster-Level3_2056090440.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">A Teddy For A Teddy </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ATeddyForATeddy-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ATeddyForATeddy-Level1_5987485046.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Word Walls </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WordWalls-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WordWalls-Level2_7409162675.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Fit Me Right </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=FitMeRight-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/FitMeRight-Level1_9128276687.png" /></a> 

                			</div>

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Word Shapes </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WordShapes-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WordShapes-Level4_9880864322.png" /></a> 

                			</div> -->

							

            				</div>

            				</div><div class="gamesList">

                			<div class="gameBox LinguisticsGame">

                            	<h3 title="" class="ng-binding">Linguistics</h3>

                				<div class="minHght"><h4 title="" class="ng-binding">Anagrams-Math</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-Math&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-Math_3996595479.png" /></a> 

                				</div>

								<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Arrange The Words </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ArrangeTheWords-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ArrangeTheWords-Level3_6521334904.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Name Land </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NameLand-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NameLand-Level2_9281079615.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Anagrams-Body</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-Body&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-Body_8010135167.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Anagrams-Plants</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-Plants&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-Plants_2974008941.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Arrange The Words </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ArrangeTheWords-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ArrangeTheWords-Level2_2614120254.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Anagrams-Colors</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-Colors&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-Colors_4401654419.png" /></a> 

                			</div>

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Missing Letter</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="swfn/MissingLetter-Level2.html" class="fancybox fancybox.iframe"> <img  src="images/icon/MissingLetter-Level2_3469503405.png" /></a> 

                			</div>-->

							 <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Missing Letter </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MissingLetter-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MissingLetter-Level1_4396478235.png" /></a> 

                			</div>

							 

            				</div> 

            			</div>
						</div>
					
						<div class="contentbox Cognitive" style="display:none;" id="V">

        					<div class="gamesList">

                			<div class="gameBox MemoryGame">

                				<h3 title="" class="ng-binding">Memory</h3>

						<!--		 <div class="minHght"><h4 title="" class="ng-binding">Balloon Burst </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BalloonBurst-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BalloonBurst-Level4_2785141328.png" /></a> 
<div>
                                <?php  
                                     $files = glob('BalloonBurst-Level4/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>
                    			

                			</div>-->
							<hr class="CustomHR"/> 

							<!-- <div class="minHght"><h4 title="" class="ng-binding">Cycle Race </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=CycleRace-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/CycleRace-Level4_4780295565.png" /></a> 

                    			

                			</div> -->
<!-- 
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Memory Check </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MemoryCheck-Level5&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MemoryCheck-Level5_9116933126.png" /></a> 

                    			

                			</div> -->
<!-- 
							<hr class="CustomHR"/>

								 <div class="minHght"><h4 title="" class="ng-binding">AlphaNumeric Encode </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=AlphaNumericEncode-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AlphaNumericEncode-Level4_2667365404.png" /></a>  -->

                    			<!-- </div><hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Sequence Memory </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=SequenceMemory-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/SequenceMemory-Level4_9387351195.png" /></a> 

                    			

                			</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Back Track </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BackTrack-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BackTrack-Level2_16276659.png" /></a> 

                    			

                			</div> -->
<!-- 
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Mind Capture </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MindCapture-Level6&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MindCapture-Level6_6117593380.png" /></a> 

                    			

                			</div> 

							 <hr class="CustomHR"/>-->
							 
							 <div class="minHght"><h4 title="" class="ng-binding">Route Memory </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=RouteMemory-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/RouteMemory-Level1_3141601332.png" /></a> 
                                 <div>
                                <?php  
                                     $files = glob('RouteMemory-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>
                     			

                			</div> 

           				  	</div>

            				</div>
							<div class="gamesList">

                			<div class="gameBox VisualProcessingGame">

                            	<h3 title="" class="ng-binding">VisualProcessing</h3>

                				<!-- <div class="minHght"><h4 title="" class="ng-binding">Just Not Half </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=JustNotHalf-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/JustNotHalf-Level2_2203953666.png" /></a> 

                    			

                			</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Mirror Match </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MirrorMatch-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MirrorMatch-Level2_4265700853.png" /></a>  

                			</div> 

							<hr class="CustomHR"/>-->
							
							<div class="minHght"><h4 title="" class="ng-binding">I Am Cube </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=IAmCube-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/IAmCube-Level1_3901067436.png" /></a>  

                			</div>

							

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Mirror Match </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MirrorMatch-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MirrorMatch-Level3_3233505128.png" /></a>  

                			</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Missing Piece </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MissingPiece-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MissingLetter-Level2_3469503405.png" /></a>  

                			</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Reverse Reading </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ReverseReading-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ReverseReading-Level3_5393561688.png" /></a>  

                			</div> 

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Reflection Read </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ReflectionRead-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ReflectionRead-Level3_7118542841.png" /></a>  

                			</div>-->
<!-- 
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Reverse Reading </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ReverseReading-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ReverseReading-Level2_7025720854.png" /></a>  

                			</div> -->

							 

            				</div>

            		</div><div class="gamesList">

                			<div class="gameBox FocusGame">

                            	<h3 title="" class="ng-binding">FocusAndAttention</h3>	

<!-- <div class="minHght"><h4 title="" class="ng-binding">Last Legend </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=LastLegend-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/LastLegend-Level4_3372493218.png" /></a> 

                			</div> 

							 <hr class="CustomHR"/>	-->

<!-- <div class="minHght"><h4 title="" class="ng-binding">Letter Jigsaw </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=LetterJigsaw-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AlphabetJigsaw-Level3_1882078954.png" /></a> 

                			</div>

							<hr class="CustomHR"/>		 -->					

                				<!-- <div class="minHght"><h4 title="" class="ng-binding">Number Jigsaw </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumberJigsaw-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumberJigsaw-Level4_3807144016.png" /></a> 

                			</div> 
							<hr class="CustomHR"/>
							<div class="minHght"><h4 title="" class="ng-binding">Car Park </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=CarPark-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/CarPark-Level2_116904969.png" /></a> 

                			</div>
							
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Car Park </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=CarPark-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/CarPark-Level3_5003174929.png" /></a> 

                			</div>
							
							<hr class="CustomHR"/>
							-->
							
							<div class="minHght"><h4 title="" class="ng-binding">Shape Vs Color</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ShapeVsColor&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ShapeVsColor_5882827830.png" /></a> 

                			</div>

							 <hr class="CustomHR"/>
							 <!--
							 <div class="minHght"><h4 title="" class="ng-binding">Deep Under </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=DeepUnder-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DeepUnder-Level3_9918525810.png" /></a> 

                			</div> -->

							 <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Shape Rollers </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ShapeRollers-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ShapeRollers-Level1_1497070817.png" /></a> 

                			</div>

							 

            				</div>  

            				</div><div class="gamesList">

                			<div class="gameBox ProblemSolvingGame">

                            	<h3 title="" class="ng-binding">ProblemSolving</h3>

								<!-- <div class="minHght"><h4 title="" class="ng-binding">Number Series </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumberSeries-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumberSeries-Level2_1761797624.png" /></a> 

                			</div> -->

							<!-- <hr class="CustomHR"/>

							<div class="minHght"><h4 title="" class="ng-binding">Numbers On The Wheel </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumbersOnTheWheel-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumbersOnTheWheel-Level4_1754132225.png" /></a> 

                			</div> 
							<hr class="CustomHR"/>-->

                				<div class="minHght"><h4 title="" class="ng-binding">Hue Cram</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=HueCram&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/HueCram_438871416.png" /></a> 

                			</div>
							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Para Master </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ParaMaster-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ParaMaster-Level4_3163872654.png" /></a> 

                			</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Reshuffle </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Reshuffle-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Reshuffle-Level4_4280022010.png" /></a> 

                			</div> -->

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Number Series </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumberSeries-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumberSeries-Level1_292791444.png" /></a> 

                			</div>
<!-- 
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Analogy Action </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=AnalogyAction-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AnalogyAction-Level1_6299363239.png" /></a> 

                			</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Para Master </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ParaMaster-Level5&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ParaMaster-Level5_5265605337.png" /></a> 

                			</div> -->

							

            				</div>

            				</div><div class="gamesList">

                			<div class="gameBox LinguisticsGame">

                            	<h3 title="" class="ng-binding">Linguistics</h3>

                				<div class="minHght"><h4 title="" class="ng-binding">Anagrams-HouseHold</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-HouseHold&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-Household_4300776333.png" /></a> 

                				</div>

								<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Anagrams-Vehicles Hold</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-Vehicles&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-Vehicles_8503454732.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Missing Letter </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MissingLetter-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MissingLetter-Level2_3469503405.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">HomoPhones</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=HomoPhones-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/HomoPhones-Level1_1627698740.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Missing Letter </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MissingLetter-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MissingLetter-Level4_7994128023.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">WordStem</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WordStem&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WordStem_1920470679.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Root Words 	</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=RootWords-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/RootWords-Level1_8710642922.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Arrange The Words </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ArrangeTheWords-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ArrangeTheWords-Level4_1263861129.png" /></a> 

                			</div>

							 

							 

            				</div> 

            			</div></div>
						
						
						<div class="contentbox Cognitive" style="display:none;" id="VI">

        					<div class="gamesList">

                			<div class="gameBox MemoryGame">

                				<h3 title="" class="ng-binding">Memory</h3>

								<!-- <div class="minHght"><h4 title="" class="ng-binding">AlphaNumeric Encode </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=AlphaNumericEncode-Level5&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AlphaNumericEncode-Level5_5666280859.png" /></a> 

                    			 

                			</div><hr class="CustomHR"/>-->

							<div class="minHght"><h4 title="" class="ng-binding">Animal Watch </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=AnimalWatch-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AnimalWatch-Level1_8736748136.png" /></a> 

                    			<div>
                                <?php  
                                     $files = glob('AnimalWatch-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>

                			</div>
<!-- 
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Sequence Memory </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=SequenceMemory-Level5&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/SequenceMemory-Level5_7487447718.png" /></a> 

                    			

                			</div> -->

							<hr class="CustomHR"/>
								 <div class="minHght"><h4 title="" class="ng-binding">Animal Watch </h4>
								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=AnimalWatch-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AnimalWatch-Level2_2552103889.png" /></a> 
								
								<div>
                                <?php  
                                     $files = glob('AnimalWatch-Level2/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>	
								
								
<!-- 
                    			</div><hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Cycle Race </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=CycleRace-Level5&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/CycleRace-Level5_1506978459.png" /></a> 

                    			

                			</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Memory Check </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MemoryCheck-Level6&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MemoryCheck-Level6_2935850583.png" /></a> 

                    			

                			</div> -->
<!-- 
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Whats In Store </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhatsInStore-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhatsInStore-Level3_4075730568.png" /></a> 

                    			

                			</div> -->
                          <!-- 
							 <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Back Track </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BackTrack-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BackTrack-Level3_4500490999.png" /></a> -->
                          </div> 
							
							<hr class="CustomHR"/>
							<div class="minHght">
							<h4 title="" class="ng-binding">Planets </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Planets&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Planets.png" /></a> 
<div>
                                <?php  
                                     $files = glob('Planets/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>	
                     			

                			</div>

           				  	</div>

            				</div>

            				</div>

							<div class="gamesList">

                			<div class="gameBox VisualProcessingGame">

                            	<h3 title="" class="ng-binding">VisualProcessing</h3>

                				<!-- <div class="minHght"><h4 title="" class="ng-binding">Cube Sherlock </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=CubeSherlock-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/CubeSherlock-Level1_9494013660.png" /></a> 

                    			

                			</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Find The Twins </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=FindTheTwins-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/FindTheTwins-Level2_3434965950.png" /></a>  

                			</div> -->
<!-- 
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Just Not Half  </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=JustNotHalf-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/JustNotHalf-Level3_486829234.png" /></a>  

                			</div> 

							

							<hr class="CustomHR"/>-->
							
							<div class="minHght"><h4 title="" class="ng-binding">I Am Cube </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=IAmCube-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/IAmCube-Level2_7666559526.png" /></a>  

                			</div>

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Mirror Match </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MirrorMatch-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MirrorMatch-Level4_9751465697.png" /></a>  

                			</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Missing Piece  </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MissingPiece-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MissingPiece-Level3_1563094099.png" /></a>  

                			</div> 

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Reflection Read </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ReflectionRead-Level5&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ReflectionRead-Level5_3237627618.png" /></a>  

                			</div>-->
<!-- 
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Reverse Reading </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ReverseReading-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ReverseReading-Level4_3547282922.png" /></a>  

                			</div> -->
							
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">FindMyPair </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=FindMyPair&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/FindMyPair.png" /></a>  

                			</div>

							 

            				</div>

            		</div>

					

					

					<div class="gamesList">

                			<div class="gameBox FocusGame">

                            	<h3 title="" class="ng-binding">FocusAndAttention</h3>	

<!-- <div class="minHght"><h4 title="" class="ng-binding">Deep Under </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=DeepUnder-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DeepUnder-Level4_8108292836.png" /></a> 

                			</div> 

							<hr class="CustomHR"/>	-->

<!-- <div class="minHght"><h4 title="" class="ng-binding">Last Legend </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=LastLegend-Level5&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/LastLegend-Level5_7495082467.png" /></a> 

                			</div> 

							<hr class="CustomHR"/>	-->						

                				<div class="minHght"><h4 title="" class="ng-binding">Rainbow</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Rainbow-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Rainbow-Level1_1321175633.png" /></a> 

                			</div><hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Car Park </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=CarPark-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/CarPark-Level4_5836739456.png" /></a> 

                			</div>

							<hr class="CustomHR"/>
							<!--
							<div class="minHght"><h4 title="" class="ng-binding">Shape Rollers </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ShapeRollers-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ShapeRollers-Level2_5863707675.png" /></a> 

                			</div>
							
							<hr class="CustomHR"/>
							-->
							<!--
							<div class="minHght"><h4 title="" class="ng-binding">Shape Rollers </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ShapeRollers-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ShapeRollers-Level2_5863707675.png" /></a> 

                			</div>
							-->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Balloon Light </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BalloonLight-Level5&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DarkLight-Level5_4619532418.png" /></a> 

                			</div> -->

							 <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Discrete Padle </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=DiscretePaddle-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DiscretePadle-Level1_2005080394.png" /></a> 

                			</div>

							 

            				</div>  

            				</div>

							

							<div class="gamesList">

                			<div class="gameBox ProblemSolvingGame">

                            	<h3 title="" class="ng-binding">ProblemSolving</h3>

								<div class="minHght"><h4 title="" class="ng-binding">Para Master </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ParaMaster-Level6&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ParaMaster-Level5_5265605337.png" /></a> 

                			</div>

							<hr class="CustomHR"/>
							<!-- 
							<div class="minHght"><h4 title="" class="ng-binding">Fit Me Right </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=FitMeRight-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/FitMeRight-Level2_340231573.png" /></a> 

                			</div>

							<hr class="CustomHR"/> -->

                				<!-- <div class="minHght"><h4 title="" class="ng-binding">Reshuffle </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Reshuffle-Level5&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Reshuffle-Level5_1823949897.png" /></a> 

                			</div> -->

						

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Numbers On The Wheel </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumbersOnTheWheel-Level5&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumbersOnTheWheel-Level5_1027476550.png" /></a> 

                			</div> -->

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Sequence Grid</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=SequenceGrid&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/SequenceGrid_9023916260.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Color Guess</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ColorGuess&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ColorGuess_7757099242.png" /></a> 

                			</div>

							

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Master Venn </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MasterVenn-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MasterVenn-Level1_7031834167.png" /></a> 

                			</div>

							
<!--
							<hr class="CustomHR"/>

							 <div class="minHght"><h4 title="" class="ng-binding">Take Turns </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=TakeTurns-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/TakeTurns-Level1_1136886626.png" /></a> 

                			</div> -->

							

            				</div>

            				</div>

							

							<div class="gamesList">

                			<div class="gameBox LinguisticsGame">

                            	<h3 title="" class="ng-binding">Linguistics</h3>

                				<div class="minHght"><h4 title="" class="ng-binding">Anagrams-FourLetterWord</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-FourLetterWord&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-FourLetterWords_96878870.png" /></a> 

                				</div>

								<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Anagrams-Jobs</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-Jobs&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-Jobs_2256901105.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Anagrams-Schools</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-Schools&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-School_220320839.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Anagrams-Sports</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-Sports&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-Sports_9202636964.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Anagrams-Weather</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-Weather&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-Weather_3403326552.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Arrange The Words </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ArrangeTheWords-Level5&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ArrangeTheWords-Level5_4423534446.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Anagrams-DolchWords</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-DolchWords&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-DolchWords_4271674626.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Missing Letter </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MissingLetter-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MissingLetter-Level3_7274801447.png" /></a> 

                			</div>

							 

							 

            				</div> 

            			</div> 

						

						</div>
						
						
						<div class="contentbox Cognitive" style="display:none;" id="VII">

        					<div class="gamesList">

                			<div class="gameBox MemoryGame">

                				<h3 title="" class="ng-binding">Memory</h3>

								<!-- <div class="minHght"><h4 title="" class="ng-binding">AlphaNumeric Encode </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=AlphaNumericEncode-Level6&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AlphaNumericEncode-Level6_7225111038.png" /></a> 

                    			

                			</div> -->

							 
<!-- 
							<div class="minHght"><h4 title="" class="ng-binding">Cycle Race </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=CycleRace-Level6&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/CycleRace-Level6_5745665873.png" /></a> 

                    			

                			</div> 

							<hr class="CustomHR"/>-->
							<div class="minHght"><h4 title="" class="ng-binding">Graph Decoder</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=GraphDecoder&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/GraphDecoder_6767004569.png" /></a> 
                           <div>
                                <?php  
                                     $files = glob('GraphDecoder/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>	
                    			

                			</div>
							
								
							<hr class="CustomHR"/>							

                				<div class="minHght"><h4 title="" class="ng-binding">Color In Color </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ColorInColor-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ColorInColor-Level2_4620457286.png" /></a> 
                                <div>
                                <?php  
                                     $files = glob('ColorInColor-Level2/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>


                			</div>
							

							<hr class="CustomHR"/>

								 <div class="minHght"><h4 title="" class="ng-binding">Drop Box</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=DropBox-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DropBox-Level1_6700938204.png" /></a> 
                             <div>
                                <?php  
                                     $files = glob('DropBox-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>	
                    			</div>

								

								<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Sequence Memory </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=SequenceMemory-Level7&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/SequenceMemory-Level7_6659360751.png" /></a> 

                    			

                			</div> -->

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Spot My Place </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=SpotMyPlace-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/SpotMyPlace-Level1_8555905618.png" /></a> 
								     <div>
                                <?php  
                                     $files = glob('SpotMyPlace-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>	
															
								
                              </div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Bug Spot </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BugSpot-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BugSpot-Level1_4068491952.png" /></a> 

                    		   <div>
                                <?php  
                                     $files = glob('BugSpot-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>		

                			</div>

							 <!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Route Memory </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=RouteMemory-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/RouteMemory-Level2_3784374403.png" /></a> 

                     			

                			</div> -->

							 

           				  	</div>

            				</div>

							<div class="gamesList">

                			<div class="gameBox VisualProcessingGame">

                            	<h3 title="" class="ng-binding">VisualProcessing</h3>

                				<div class="minHght"><h4 title="" class="ng-binding">Choose Two To Make One</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ChooseTwoToMakeOne&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ChooseTwoToMakeOne_7422157558.png" /></a> 

                    			

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Flip Trick </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=FlipTrick-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/FlipTrick-Level1_6290403776.png" /></a>  

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Mirror Image </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MirrorImage-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MirrorImage-Level1_4596876199.png" /></a>  

                			</div>

							

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Cube Sherlock </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=CubeSherlock-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/CubeSherlock-Level2_2803261997.png" /></a>  

                			</div>

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Find The Twins </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=FindTheTwins-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/FindTheTwins-Level3_8413515225.png" /></a>  

                			</div> -->
<!-- 
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Missing Piece </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MissingPiece-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/FindTheTwins-Level3_8413515225.png" /></a>  

                			</div> 

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Reflection Read </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ReflectionRead-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ReflectionRead-Level4_4669125583.png" /></a>  

                			</div>-->

							 <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Water Image </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WaterImage-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WaterImage-Level1_4578736186.png" /></a>  

                			</div> 

							 

            				</div>

            		</div>

					

					

					<div class="gamesList">

                			<div class="gameBox FocusGame">

                            	<h3 title="" class="ng-binding">FocusAndAttention</h3>	
								<!--
								<div class="minHght"><h4 title="" class="ng-binding">Shape Rollers </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ShapeRollers-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ShapeRollers-Level4_452656652.png" /></a> 

                			</div>

							<hr class="CustomHR"/>	
								-->
<div class="minHght"><h4 title="" class="ng-binding">Rainbow </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Rainbow-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Rainbow-Level2_2451191339.png" /></a> 

                			</div>
						

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Discrete Paddle </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=DiscretePaddle-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DiscretePadle-Level2_4007870662.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Shape Vs Color Vs Pattern </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ShapeVsColorVsPattern-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ShapeVsColorVsPattern-Level1_9182052793.png" /></a> 

                			</div>

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Balloon Light	 </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BalloonLight-Level5&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DarkLight-Level5_4619532418.png" /></a> 

                			</div> -->

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Odd Ball	</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=OddBall-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/OddBall-Level1_1096781706.png" /></a> 

                			</div>

							 <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Light Rays </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=LightRays-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/LightRays1.png" /></a> 

                			</div>

            				</div>  

            				</div>

							

							<div class="gamesList">

                			<div class="gameBox ProblemSolvingGame">

                            	<h3 title="" class="ng-binding">ProblemSolving</h3>
								<!--
							<div class="minHght"><h4 title="" class="ng-binding">A Teddy For A Teddy </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ATeddyForATeddy-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ATeddyForATeddy-Level3_1824636519.png" /></a> 

                			</div>
							
						

							 <hr class="CustomHR"/>

							<div class="minHght"><h4 title="" class="ng-binding">Reshuffle </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Reshuffle-Level6&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Reshuffle-Level6_4803005247.png" /></a> 

                			</div> -->
							<!-- <hr class="CustomHR"/> -->

                				<!-- <div class="minHght"><h4 title="" class="ng-binding">Shopping </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Shopping-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Shopping-Level1_6256451136.png" /></a> 

                			</div> -->
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">NittyGritty</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NittyGritty&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NittyGritty_5187215218.png" /></a> 

                			</div>

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Numbers On The Wheel </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumbersOnTheWheel-Level6&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumbersOnTheWheel-Level6_2458961391.png" /></a> 

                			</div> -->

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Analogy Action	</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=AnalogyAction-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AnalogyAction-Level2_5585269308.png" /></a> 

                			</div>
<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Take Turns </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=TakeTurns-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/TakeTurns-Level2_7725315545.png" /></a> 

                			</div> 

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Number Puzzle </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumberPuzzle-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumberPuzzle-Level2_6727183759.png" /></a> 

                			</div> -->

							

            				</div>

            				</div>

							 

							 

							<div class="gamesList">

                			<div class="gameBox LinguisticsGame">

                            	<h3 title="" class="ng-binding">Linguistics</h3>

                				<div class="minHght"><h4 title="" class="ng-binding">Anagrams-Geography</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-Geography&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-Geography_5710392687.png" /></a> 

                				</div>

								<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Anagrams-Military</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-Military&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-Military_2205101763.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Anagrams-People</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Anagrams-People&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Anagrams-People_1156277623.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Confusion Galore </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ConfusionGalore-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ConfusionGalore-Level1_4439043053.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Divided Words </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=DividedWords-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DividedWords-Level1_9592156563.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Rebus </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Rebus-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Rebus-Level1_8831456145.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Root Words </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=RootWords-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/RootWords-Level2_162112307.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">HomoPhones </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=HomoPhones-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/HomoPhones-Level2_3726777150.png" /></a> 

                			</div>

							 

							 

            				</div> 

            			</div> 

						 

						

						</div>
						
						
						<div class="contentbox Cognitive" style="display:none;" id="VIII">

        					 <div class="gamesList">

                			<div class="gameBox MemoryGame">

                				<h3 title="" class="ng-binding">Memory</h3>

								<div class="minHght"><h4 title="" class="ng-binding">Coordinate Graph </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=CoordinateGraph-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/CoordinateGraph-Level1_1309713018.png" /></a> 
	                           <div>
                                <?php  
                                     $files = glob('CoordinateGraph-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>
                    			

                			</div>

						<!--	<hr class="CustomHR"/>

							<div class="minHght"><h4 title="" class="ng-binding">Coordinate Graph </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=CoordinateGraph-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/CoordinateGraph-Level2_2700936608.png" /></a> 
	                           <div>
                                <?php  
                                     $files = glob('CoordinateGraph-Level2/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>
                    			

                			</div>!-->

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Misplaced Buddy	</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MisplacedBuddy-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MisplacedBuddy-Level1_4661093535.png" /></a> 

                    			   <div>
                                <?php  
                                     $files = glob('MisplacedBuddy-Level1/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>

                			</div>
							
						
							 <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Spot Me </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=SpotMe-Level7&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/SpotMe-Level7_2691923594.png" /></a> 
                            <div>
                                <?php  
                                     $files = glob('SpotMe-Level7/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>





                			</div>

	<!-- 						<hr class="CustomHR"/>
        		 <div class="minHght"><h4 title="" class="ng-binding">Spot My Place </h4>
								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=SpotMyPlace-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/SpotMyPlace-Level2_128739713.png" /></a> 
                              </div> -->

								

								<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Bug Spot </h4>
								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BugSpot-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BugSpot-Level2_807683826.png" /></a> 
                            	</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Drop Box </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=DropBox-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DropBox-Level2_6796904369.png" /></a> 

                    			

                			</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Sequence Memory  </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=SequenceMemory-Level8&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/SequenceMemory-Level8_6523781293.png" /></a> 
                             	</div> -->

							 <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Ball And Box </h4>
								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BallAndBox-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/BallAndBox-Level2_5648189471.png" /></a> 
										   <div>
                                <?php  
                                     $files = glob('BallAndBox-Level2/*.{jpg,png,gif}', GLOB_BRACE);
                                      foreach($files as $file)
									  {
                                          ?>
                                 <a data-fancybox  data-type="iframe" href="javascript:;" data-src="<?php echo $file; ?>" class="fancybox fancybox.iframe"> <i class="fa fa-file-image-o" aria-hidden="true"></i></a> 
                                 <?php
                                      }
                                          ?>
                            </div>
								
								
								
								
                            </div>				 

           				  	</div>
            				</div> 

							 <div class="gamesList">

                			<div class="gameBox VisualProcessingGame">

                            	<h3 title="" class="ng-binding">VisualProcessing</h3>

                				<!-- <div class="minHght"><h4 title="" class="ng-binding">Just Not Half </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=JustNotHalf-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/JustNotHalf-Level4_2555441330.png" /></a> 

                    			

                			</div> 

							<hr class="CustomHR"/>-->
							<div class="minHght"><h4 title="" class="ng-binding">Mirror Image </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MirrorImage-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MirrorImage-Level2_8513625911.png" /></a>  

                			</div>


							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Who Is Not There </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhoIsNotThere-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhoIsNotThere-Level1_3340305127.png" /></a>  

                			</div>

							

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Water Image </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WaterImage-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WaterImage-Level2_3779711904.png" /></a>  

                			</div> -->

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Flip Trick </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=FlipTrick-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/FlipTrick-Level2_2970519540.png" /></a>  

                			</div> -->

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Choose Three To Make One </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ChooseThreeToMakeOne-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ChooseThreeToMakeOne_6421778858.png" /></a>  

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Who Is Not There </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=WhoIsNotThere-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/WhoIsNotThere-Level2_67013050.png" /></a>  

                			</div>

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Missing Piece </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MissingPiece-Level4&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MissingPiece-Level4_1507440302.png" /></a>  

                			</div> -->
							
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">ColorMe </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ColorMe&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ColorMe.png" /></a>  

                			</div>
							
							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">MasterShape-Level1 </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MasterShape-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MasterShape-Level1.png" /></a>  

                			</div>

							 

            				</div>

            		</div> 

					

					

					<div class="gamesList">

                			<div class="gameBox FocusGame">

                            	<h3 title="" class="ng-binding">FocusAndAttention</h3>	

									<div class="minHght"><h4 title="" class="ng-binding">Color In Color </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ColorInColor-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ColorInColor-Level1_1204938488.png" /></a> 

                			</div>

							<hr class="CustomHR"/>	

									<div class="minHght"><h4 title="" class="ng-binding">Number Me </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumberMe-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumberMe-Level1_9366972525.png" /></a> 

                			</div>

							<hr class="CustomHR"/>							

                				<div class="minHght"><h4 title="" class="ng-binding">Number Me </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumberMe-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumberMe-Level2_1924527920.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Discrete Paddle </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=DiscretePaddle-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DiscretePadle-Level3_3544559371.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Shape Vs Color Vs Pattern</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ShapeVsColorVsPattern-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ShapeVsColorVsPattern-Level2_533262947.png" /></a> 

                			</div>

							<!-- <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Balloon Light </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=BalloonLight-Level6&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DarkLight-Level6_8921038703.png" /></a> 

                			</div> -->

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Odd Ball </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=OddBall-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/OddBall-Level2_3363969377.png" /></a> 

                			</div>
<!--
							 <hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Spot Me </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=SpotMe-Level7&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/SpotMe-Level7_2691923594.png" /></a> 

                			</div>
-->
							 

            				</div>  

            				</div>

							

							<div class="gamesList">

                			<div class="gameBox ProblemSolvingGame">

                            	<h3 title="" class="ng-binding">ProblemSolving</h3>

								<div class="minHght"><h4 title="" class="ng-binding">Equate	</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Equate-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Equate-Level1_3846404044.png" /></a> 

                			</div>

							<hr class="CustomHR"/>

							<div class="minHght"><h4 title="" class="ng-binding">Numbers On The Vertices </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumbersOnTheVertices-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumbersOnTheVertices-Level1_6839827257.png" /></a> 

                			</div><hr class="CustomHR"/>

                				<div class="minHght"><h4 title="" class="ng-binding">Shopping </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=Shopping-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/Shopping-Level2_4992981352.png" /></a> 

                			</div><hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Analogy Action </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=AnalogyAction-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/AnalogyAction-Level3_1947425035.png" /></a> 

                			</div>

							<hr class="CustomHR"/>
							<!--
							<div class="minHght"><h4 title="" class="ng-binding">Master Venn </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=MasterVenn-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/MasterVenn-Level2_6223853942.png" /></a> 

                			</div>

							<hr class="CustomHR"/>
							-->
							<div class="minHght"><h4 title="" class="ng-binding">Number Puzzle </h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=NumberPuzzle-Level3&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/NumberPuzzle-Level3_4147070031.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Smart Rider</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=SmartRider&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/SmartRider_1083469698.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Logical Sequence</h4>

								<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=LogicalSequence&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/LogicalSequence_3583530234.png" /></a> 

                			</div>

							

            				</div>

            				</div>

							

							<div class="gamesList">

                			<div class="gameBox LinguisticsGame">

                            	<h3 title="" class="ng-binding">Linguistics</h3>

                				<div class="minHght"><h4 title="" class="ng-binding">Guess The Word </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=GuessTheWord-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/GuessTheWord-Level1_8028972977.png" /></a> 

                				</div>

								<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Guess The Word </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=GuessTheWord-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/GuessTheWord-Level2_718786111.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Jumbled Letters</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=JumbledLetters-Level1&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/JumbledLetters-Level1_7572877304.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Kangaroo Words</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=KangarooWords&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/KangarooWords_1111639351.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Divided Words </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=DividedWords-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/DividedWords-Level2_482863192.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Jumbled Letters </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=JumbledLetters-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/JumbledLetters-Level2_497916364.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Confusion Galore </h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=ConfusionGalore-Level2&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/ConfusionGalore-Level2_9538272568.png" /></a> 

                			</div>

							<hr class="CustomHR"/><div class="minHght"><h4 title="" class="ng-binding">Prefix Root And Suffix</h4>

                				<a data-fancybox  data-type="iframe" href="javascript:;" data-src="https://games.skillangels.com/multilingual/clpx/games.php?newgame=PrefixRootAndSuffix&gamelang=<?php echo $_SESSION['demoskill']['glang']; ?>" class="fancybox fancybox.iframe"> <img  src="images/icon/PrefixRootAndSuffix_204385071.png" /></a> 

                			</div>

							 

							 

            				</div> 

            			</div> 

						

						</div>
						
						
						
						
						

						
</div>
						

						

						 

						 

						

						

					</div>

					

</div>

</div>

</div>

 <!-- Footer starts here-->

	 <!--

	 <div class="footer pagefooter">

    	<div class="row">

        	<div class="col-lg-6">

    			Copyright © 2015 Skill Angels. All rights reserved.

            </div>

            

        </div>

    </div>

	-->

	<!-- footer ends here --> 

    <!-- /#wrapper -->

	<!-- jQuery -->

	 <style>

 .minHght1 { min-height: 218px;}
.VisualProcessingGame{display:none;}
.FocusGame{display:none;}
.ProblemSolvingGame{display:none;}
.LinguisticsGame{display:none;}
.fancybox-iframe img{width:100% !important;}
  </style>

      <script src="js/bootstrap.min.js"></script>

	 <script src="js/jquery-ui.js"></script>

	   <?php include_once('site_access.php'); ?> 

</body></html>