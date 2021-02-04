
<?php
try {
  date_default_timezone_set('Asia/Kolkata');
  $myFile = "logfiles.txt"; 

  $fh = fopen($myFile, 'a') or die("can't open file");
  $stringData =date("Y/m/d h:i:s")." * ".$_POST['ClickedButton']."\n" ;
  fwrite($fh, $stringData);
  fclose($fh);
}

//catch exception
catch(Exception $e) {
  echo 'Message: ' .$e->getMessage();
}
  ?>


