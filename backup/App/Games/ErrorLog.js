 var LogFile_URL="LogServer.php"
 window.onerror = function(message, url, line, column,error) {
  // do something clever here
   console.log("Error:= "+message); // do NOT do this for real!
   $.ajax({
      type:"POST",
      data:"ClickedButton="+message+" * "+gameAssetsPath+" * "+qno[cnt]+" * "+cnt,
      url: LogFile_URL,
      success: function(data){
      console.log('Written in Log File ');
    }
    }); 
};