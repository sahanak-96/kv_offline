const remote = require('electron').remote

// let w = remote.getCurrentWindow()
// w.close();
var executed = false;
var executed1 = false;
var schoolid_val = 48;
var branch_id = 85;
var btn_path = __dirname + '/btn.txt';
var basepath_dar = __dirname + '/backup/App/FrontEnd/dist/assets/ip.txt';
const fs = require('fs');
var onlinechkvar;
var cleartimeOutclose;

fs.readFile(btn_path, 'utf-8', (err, data) => {
    if (err) throw err;
    if (data == "flag:1") {
        document.getElementById("myBtn").disabled = false;
        document.getElementById("myBtn1").disabled = true;
    }
    else {
        document.getElementById("myBtn").disabled = true;
        document.getElementById("myBtn1").disabled = false;
    }
});

var startnodeFn = (function () {
    return function () {
        console.log(executed + "executed" + executed1 + "executed1" + "onlinechkvar1= " + onlinechkvar)
        if (onlinechkvar) {
            console.log("err" + basepath_dar)
            fs.readFile(basepath_dar, 'utf-8', (err, data) => {
                console.log("err" + err)
                if (err) throw err;
                console.log(data + "data")
                if (data != "") {

                    if (!executed && !executed1) {
                        console.log('local_synchronization running on port 3000');


                        document.getElementById("noderespone").innerHTML = "local_synchronization started successfully!";
                        executed = true;

                        $.ajax({
                            url: "http://" + data + ":3000/live_sync",
                            type: 'post',
                            data: { schoolid: schoolid_val, branchid: branch_id },
                            success: function (response) {
                                // Perform operation on the return value
                                console.log("done");
                                console.log(response);
                                console.log(response.status);
                                if (response.code == "SA000") {
                                    document.getElementById("noderespone").innerHTML = "local_synchronization completed successfully :)";
                                    executed = false;
                                    cleartimeOut = setTimeout(stoplocalpopupFn, 3000);

                                }
                                else {
                                    document.getElementById("noderespone").innerHTML = "synchronization failed :(";
                                    executed = false;
                                    cleartimeOut = setTimeout(stoplocalpopupFn, 3000);

                                }

                            },
                            error: function (error) {
                                document.getElementById("noderespone").innerHTML = "Node Error :(";
                                cleartimeOutclose = setTimeout(closefn, 1000);

                            }
                        });


                    }
                    else {
                        if (executed1) {
                            document.getElementById("noderespone").innerHTML = "Please wait ...live_synchronization in process";
                            cleartimeOut = setTimeout(stoplocalpopupFn, 3000);
                        }
                    }
                }
                else {
                    document.getElementById("noderespone").innerHTML = "Please restart the application";
                    cleartimeOut = setTimeout(stoplocalpopupFn, 3000);
                }
            });
        }
        else {
            // document.getElementById("noderespone").innerHTML = "Please connect to the internet :(";
            // cleartimeOut = setTimeout(stoplocalpopupFn, 3000);
        }
    };

}
)();


var start_live_sync = (function () {
    return function () {
        console.log("isOnline2= " + onlinechkvar)
        if (onlinechkvar) {
            fs.readFile(basepath_dar, 'utf-8', (err, data) => {

                if (err) throw err;
                console.log(data + "data")
                if (data != "") {
                    if (!executed && !executed1) {
                        console.log('live_synchronization running on port 3000');
                        document.getElementById("noderespone1").innerHTML = "live_synchronization started successfully!";
                        executed1 = true;
                        $.ajax({
                            url: "http://" + data + ":3000/local_sync",
                            type: 'post',
                            data: { schoolid: schoolid_val, branchid: branch_id },
                            success: function (response) {
                                // Perform operation on the return value
                                console.log("done");
                                console.log(response);
                                console.log(response.status);
                                if (response.code == "SA000") {
                                    document.getElementById("noderespone1").innerHTML = "live_synchronization completed successfully :)";
                                    executed1 = false;
                                    var logger = fs.createWriteStream(btn_path, {})
                                    logger.write('flag:1')
                                    logger.end();
                                    document.getElementById("myBtn").disabled = false;
                                    document.getElementById("myBtn1").disabled = true;
                                    cleartimeOut1 = setTimeout(stoplivepopupFn, 3000);
                                }
                                else {
                                    document.getElementById("noderespone1").innerHTML = "synchronization failed :(";
                                    executed1 = false;
                                    cleartimeOut1 = setTimeout(stoplivepopupFn, 3000);

                                }

                            },
                            error: function (error) {
                                document.getElementById("noderespone").innerHTML = "Node Error :(";
                                cleartimeOutclose = setTimeout(closefn, 1000);

                            }
                        });
                    }
                    else {
                        if (executed) {
                            document.getElementById("noderespone1").innerHTML = "Please wait ...local_synchronization in process";
                            cleartimeOut1 = setTimeout(stoplivepopupFn, 3000);
                        }
                    }
                } else {
                    document.getElementById("noderespone1").innerHTML = "Please restart the application";
                    cleartimeOut1 = setTimeout(stoplivepopupFn, 3000);
                }
            });
        }
        else {
            // document.getElementById("noderespone1").innerHTML = "Please connect to the internet :(";
            // cleartimeOut1 = setTimeout(stoplivepopupFn, 3000);
        }
    };

}
)();

function stoplocalpopupFn() {
    clearTimeout(cleartimeOut);
    document.getElementById("noderespone").innerHTML = "";
}
function stoplivepopupFn() {
    clearTimeout(cleartimeOut1);
    document.getElementById("noderespone1").innerHTML = "";
}


isGameOnlineHandler();
var chkint = 0;
var clearint;
function isGameOnlineHandler() {
    clearInterval(clearint);
    var isOnline = navigator.onLine;
    console.log("isOnline= " + isOnline)
    if (!isOnline) {
        executed = false;
        executed1 = false;
        onlinechkvar = 0;
        chkint = 1;
        document.getElementById("noderespone1").innerHTML = "Please connect to the internet to start local_sync :(";
        document.getElementById("noderespone").innerHTML = "Please connect to the internet to start live_sync :(";
    } else {
        onlinechkvar = 1;
        if (chkint == 1) {
            document.getElementById("noderespone1").innerHTML = "";
            document.getElementById("noderespone").innerHTML = "";
            chkint = 0;
        }
    }
    clearint = setInterval(isGameOnlineHandler, 1000);
}
function closefn() {
    remote.app.relaunch();
    remote.app.exit();
}



