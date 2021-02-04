const { app, BrowserWindow, window } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs');
var pgtools = require("pgtools");

const { Pool } = require('pg');
const { info } = require('console');
const isOnline = require('is-online');

let myWindow = null

const gotTheLock = app.requestSingleInstanceLock()
/////////////////client///////////////////////


const folderName = 'D:/Xampp/htdocs/';
var clientDb_user = 'postgres';
var clientDb_host = 'localhost';
var clientDb_password = 'skillangels';
var clientDb_port = 5432;
/////////////////client///////////////////////

/////////////////admin///////////////////////
const AdminDbConfig = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'edsix_offline',
    password: 'skillangels',
    port: 5432,
});
schoolbranch_id = 5;

var LiveDb_user = 'postgres';
var LiveDb_host = 'localhost';
var LiveDb_name = 'saoffline_live';
var LiveDb_password = 'skillangels';
var LiveDb_port = 5432;
/////////////////admin///////////////////////

var start_msg = 0;
var NewDbName = 'edsixdb';
//  username:password@ip:port/dbname  
var dbconfig = 'postgres://' + clientDb_user + ':' + clientDb_password + '@' + clientDb_host + ':' + clientDb_port + '/' + NewDbName;
const config = {
    user: clientDb_user,
    host: clientDb_host,
    password: clientDb_password,
    port: clientDb_port
};

var basepath = __dirname + '/';
var basepath1 = __dirname;
var dump_path = __dirname + '/backup/backup_db.sql';
let destDir = path.join(folderName, 'Edsix');
var foldersrc = basepath + 'backup/App'; var folderdis = folderName + 'Edsix';
var anglpath = folderdis + '/FrontEnd'; var nodepath = folderdis + '/BackEnd';
const fs1 = require('fs-extra');
let win
var log_val = basepath + 'log.txt';
var db_log_val = basepath + 'db_log.txt';
var node_val = foldersrc + '/BackEnd/model/dbconfig.js'
var assets_val = foldersrc + '/FrontEnd/dist/assets/ip.txt'
var exec = require('child_process').exec;
var Sf1 = [];
var Sf2 = [];
var Sf3 = [];
var chk_xampp = 0;
var chk_postgres = 0;
var chk_node = 0;
Snew = [];
TwoDArr = [];
mypathvalue = -1;
postgtespath = "";

let options = {
    buttons: ["Ok"],
    title: "Edsix_Offline",
    icon: basepath + 'favicon.ico',
    message: " \n skillangels_superbrain running successfully with link http://" + ip_data + "/Edsix/FrontEnd/dist \n \n",
}
let startoptions = {
    buttons: ["Ok"],
    title: "Edsix_Offline",
    icon: basepath + 'favicon.ico',
    message: " \n skillangels_superbrain is getting ready .... please wait \n \n",
}
let drives1;
Sfip = [];
let pathoption = {
    buttons: ["Ok"],
    title: "Edsix_Offline",
    icon: basepath + 'favicon.ico',
    message: " \n Postgres sql path set successfully and so please restart the system! \n \n",
}
var cleartimer;
var mydata = [];
var set_path_string = "";
var path_exists = 0;






//////////////////App Part/////////////////////////////////////////////////
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (myWindow) {
            if (myWindow.isMinimized()) myWindow.restore()
            myWindow.focus()
        }
    })

}

function createWindow() {
    win = new BrowserWindow({
        width: 800, height: 600,
        icon: basepath + 'favicon.ico',
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadURL(url.format({
        pathname: path.join(basepath + 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    win.setMenu(null)
    win.webContents.openDevTools()
    win.on('closed', () => {
        win = null
    })
}



// app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

//////////////////App Part/////////////////////////////////////////////////




function copyFile(src, dest) {

    fs1.copy(src, dest, function (err) {
        if (err) {
            console.error(err);
            var logger = fs.createWriteStream(log_val, {})
            logger.write('flag:0')
            logger.end();
            const { dialog } = require('electron')
            dialog.showErrorBox("", "Something went wrong on copying file!");
            cleartimer = setTimeout(closefn, 3000);
        } else {
            var logger = fs.createWriteStream(log_val, {})
            logger.write('flag:1')
            logger.end();
            npmfornodeFn();
            console.log('done copying');
        }
    });

}
function npmfornodeFn() {

    exec('cd ' + nodepath + ' & npm i', function (error, stdout, stderr) {
        console.log("stdout" + stdout)
        if (error) {
            console.log(error);
            var logger = fs.createWriteStream(log_val, {})
            logger.write('flag:1')
            logger.end();
            const { dialog } = require('electron')
            dialog.showErrorBox("", "Something went wrong on copying node file!");
            cleartimer = setTimeout(closefn, 3000);

        } else {
            console.log("done node");
            var logger = fs.createWriteStream(log_val, {})
            logger.write('flag:2')
            logger.end();
            DbDumpFn();

        }

    });

}

function initialfn() {
    var logger = fs.createWriteStream(node_val, {})
    // logger.write('const config = {user:"' + clientDb_user.toString() + '",host:"' + clientDb_host.toString() + '",password:"' + clientDb_password.toString() + '",port:' + clientDb_port + '}');

    logger.write("module.exports = {database: {user:'" +
        clientDb_user.toString() + "',host:'" + clientDb_host.toString()
        + "',database:'" + NewDbName.toString() + "',password:'" + clientDb_password.toString() +
        "',port:" + clientDb_port + "},database_live: {user:'" + LiveDb_user + "', host: '" + LiveDb_host + "', database: '" +
        LiveDb_name + "', password: '" + LiveDb_password + "', port:" + LiveDb_port + " } }");
    logger.end();
    foldercopyFn();
}
function foldercopyFn() {
    fs.readFile(log_val, 'utf-8', (err, data) => {

        if (err) throw err;
        if (data != "flag:2" && start_msg == 0) {

            const { dialog } = require('electron')
            dialog.showMessageBox(startoptions);
            start_msg = 1;
        }
        if (data == "flag:0") {
            console.log("flag0" + destDir);
            try { fs.mkdirSync(destDir); }
            catch{
                const { dialog } = require('electron')
                dialog.showErrorBox("", "Directory location is invalid!")
            }

            fs.access(destDir, (err) => {
                if (err) {
                    console.log("err" + err)
                    var logger = fs.createWriteStream(log_val, {})
                    logger.write('flag:0')
                    logger.end();
                    // fs.mkdirSync(destDir);
                }
                else {
                    console.log("flag000")
                    copyFile(foldersrc, folderdis);
                }


            });

        }
        else if (data == "flag:1") {
            console.log("flag1")
            npmfornodeFn();

        }
        else if (data == "flag:2") {
            console.log("flag2")
            DbDumpFn();

        }
        else if (data == "") {
            console.log("fl")
            var logger = fs.createWriteStream(log_val, {})
            logger.write('flag:-1')
            logger.end();

            const { dialog } = require('electron')
            dialog.showErrorBox("", "Please restart the application!")
            cleartimer = setTimeout(closefn, 3000);

        }


    })
}

function DbDumpFn() {
    fs.readFile(db_log_val, 'utf-8', (err, data) => {

        if (err) throw err;
        if (data != "flag:2" && start_msg == 0) {
            const { dialog } = require('electron')
            dialog.showMessageBox(startoptions);
            start_msg = 1;
        }
        if (data == "flag:0") {

            pgtools.createdb(config, NewDbName, function (err, res) {
                if (err) {
                    var logger = fs.createWriteStream(db_log_val, {})
                    logger.write('flag:0')
                    logger.end();
                    const { dialog } = require('electron')
                    dialog.showErrorBox("", NewDbName + " database already exists!");
                    cleartimer = setTimeout(closefn, 3000);

                }
                else {
                    var logger = fs.createWriteStream(db_log_val, {})
                    logger.write('flag:1')
                    logger.end();
                    runSingleCommandWithoutWait();
                    console.log("DataBase Created Successfully!!!");
                }

            });
        }
        else if (data == "flag:1") {
            console.log("calling restore");
            runSingleCommandWithoutWait();
        }
        else if (data == "flag:2") {
            console.log("DataBase ready to use");
            successPop();
        }
        else {
            var logger = fs.createWriteStream(db_log_val, {})
            logger.write('flag:0')
            logger.end();
            const { dialog } = require('electron')
            dialog.showErrorBox("", "Please restart the application");
            cleartimer = setTimeout(closefn, 3000);
        }
    })
}
var cmd = require('node-command-line'),
    Promise = require('bluebird');
function runSingleCommandWithoutWait() {
    try {
        cmd.run('pg_restore --exit-on-error --dbname=' + dbconfig + " " + dump_path);
        console.log('Executed your command :)');

        var logger = fs.createWriteStream(db_log_val, {})
        logger.write('flag:2')
        logger.end();
        successPop();
    }
    catch{
        var logger = fs.createWriteStream(db_log_val, {})
        logger.write('flag:1')
        logger.end();
        const { dialog } = require('electron')
        dialog.showErrorBox("", "Please restart the application");
        cleartimer = setTimeout(closefn, 3000);
    }


}

//////////////////////////begin/////////////////////////////////

 first_execute();
function first_execute() {
    start_msg = 1;
    exec('PowerShell.exe -Command \"Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName,InstallLocation \"', function (error, stdout, stderr) {
        console.log("stdout" + stdout);
        Sf1 = stdout.trim().split('\r\n');
        TwoDArr = [];
        for (i = 0; i < Sf1.length; i++) {
            TwoDArr[i] = [];
        }
        for (i = 0; i < Sf1.length; i++) {
            Snew = Sf1[i].trim().split('  ');
            Snew = Snew.filter(Boolean);
            for (j = 0; j < Snew.length; j++) {
                TwoDArr[i][j] = Snew[j];
                if (TwoDArr[i][j].toString() == "XAMPP") {
                    chk_xampp = 1;
                    console.log("system installed with XAMPP");

                }
                if (TwoDArr[i][j].toString() == "Node.js") {
                    chk_node = 1;
                    console.log("system installed with node");

                }
                if (TwoDArr[i][j].toString() == "PostgreSQL 6" || TwoDArr[i][j].toString() == "PostgreSQL 7" || TwoDArr[i][j].toString() == "PostgreSQL 8" ||
                    TwoDArr[i][j].toString() == "PostgreSQL 9" || TwoDArr[i][j].toString() == "PostgreSQL 10" || TwoDArr[i][j].toString() == "PostgreSQL 11" ||
                    TwoDArr[i][j].toString() == "PostgreSQL 12" || TwoDArr[i][j].toString() == "PostgreSQL 13" || TwoDArr[i][j].toString() == "PostgreSQL 14" ||
                    TwoDArr[i][j].toString() == "PostgreSQL 15" || TwoDArr[i][j].toString() == "PostgreSQL 16") {
                    mypathvalue = i;
                    chk_postgres = 1;
                    console.log("system installed with PostgreSQL");

                }
            }
        }

        if (chk_postgres == 1) {
            exec('psql -V', function (error, stdout, stderr) {
                if (stdout == "") {
                    environmentpath_set();
                }
                else {
                    if (chk_xampp == 1 && chk_node == 1 && chk_postgres == 1) {
                        finalexe();
                    } else {
                        sec_execute();
                    }
                }
            });

        }
        else {
            sec_execute();
        }

    });
}


function sec_execute() {
    const { dialog } = require('electron')
    dialog.showMessageBox(startoptions);
    exec('PowerShell.exe -Command \"Get-ItemProperty HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName,InstallLocation \"', function (error, stdout, stderr) {
        console.log("stdout" + stdout);
        Sf2 = stdout.trim().split('\r\n');
        TwoDArr = [];
        for (i = 0; i < Sf2.length; i++) {
            TwoDArr[i] = [];
        }
        for (i = 0; i < Sf2.length; i++) {
            Snew = Sf2[i].trim().split('  ');
            Snew = Snew.filter(Boolean);
            for (j = 0; j < Snew.length; j++) {
                TwoDArr[i][j] = Snew[j];
                if (TwoDArr[i][j].toString() == "XAMPP") {
                    chk_xampp = 1;
                    console.log("system installed with XAMPP");

                }
                if (TwoDArr[i][j].toString() == "Node.js") {
                    chk_node = 1;
                    console.log("system installed with node");

                }
                if (TwoDArr[i][j].toString() == "PostgreSQL 6" || TwoDArr[i][j].toString() == "PostgreSQL 7" || TwoDArr[i][j].toString() == "PostgreSQL 8" ||
                    TwoDArr[i][j].toString() == "PostgreSQL 9" || TwoDArr[i][j].toString() == "PostgreSQL 10" || TwoDArr[i][j].toString() == "PostgreSQL 11" ||
                    TwoDArr[i][j].toString() == "PostgreSQL 12" || TwoDArr[i][j].toString() == "PostgreSQL 13" || TwoDArr[i][j].toString() == "PostgreSQL 14" ||
                    TwoDArr[i][j].toString() == "PostgreSQL 15" || TwoDArr[i][j].toString() == "PostgreSQL 16") {
                    mypathvalue = i;
                    chk_postgres = 1;
                    console.log("system installed with PostgreSQL");

                }
            }
        }

        if (chk_postgres == 1) {
            exec('psql -V', function (error, stdout, stderr) {
                if (stdout == "") {
                    environmentpath_set();
                }
                else {
                    if (chk_xampp == 1 && chk_node == 1 && chk_postgres == 1) {
                        finalexe();
                    } else {
                        thr_execute();
                    }
                }
            });

        }
        else {
            thr_execute();
        }

    });
}

function thr_execute() {


    let drives
    exec('wmic product get name,InstallLocation', (error, stdout) => {
        drives = stdout.trim().split('\r\r\n')
            .map(value => value.trim().split('/\s{2,0}/'))
            .slice(1);
        Sf3 = JSON.parse(JSON.stringify(drives));
        TwoDArr = [];
        for (i = 0; i < Sf3.length; i++) {
            TwoDArr[i] = [];
        }
        for (i = 0; i < Sf3.length; i++) {
            Snew = Sf3[i][0].trim().split('  ');
            Snew = Snew.filter(Boolean);
            console.log("Snew" + Snew.length);
            for (j = 0; j < Snew.length; j++) {
                TwoDArr[i][j] = Snew[j];
                if (TwoDArr[i][j].toString() == "XAMPP") {
                    chk_xampp = 1;
                    console.log("system installed with XAMPP");

                }
                if (TwoDArr[i][j].toString() == "Node.js") {
                    chk_node = 1;
                    console.log("system installed with node");

                }
                if (TwoDArr[i][j].toString() == "PostgreSQL 6" || TwoDArr[i][j].toString() == "PostgreSQL 7" || TwoDArr[i][j].toString() == "PostgreSQL 8" ||
                    TwoDArr[i][j].toString() == "PostgreSQL 9" || TwoDArr[i][j].toString() == "PostgreSQL 10" || TwoDArr[i][j].toString() == "PostgreSQL 11" ||
                    TwoDArr[i][j].toString() == "PostgreSQL 12" || TwoDArr[i][j].toString() == "PostgreSQL 13" || TwoDArr[i][j].toString() == "PostgreSQL 14" ||
                    TwoDArr[i][j].toString() == "PostgreSQL 15" || TwoDArr[i][j].toString() == "PostgreSQL 16") {
                    mypathvalue = i;
                    chk_postgres = 1;
                    console.log("system installed with PostgreSQL");

                }
            }
        }

        if (chk_postgres == 1) {
            exec('psql -V', function (error, stdout, stderr) {
                if (stdout == "") {
                    environmentpath_set();
                }
                else {
                    finalexe();

                }
            });

        }
        else {
            finalexe();
        }

    });
}



function environmentpath_set() {
    postgtespath = TwoDArr[mypathvalue][1];
    postgtespath = postgtespath + "/bin";
    console.log("postgtespath  " + postgtespath);

    exec(__dirname + '/path.bat', function (error, stdout, stderr) {
        if (error) {
            console.log(error);
            const { dialog } = require('electron')
            dialog.showErrorBox("", "something went wrong,please restart the application!");
            cleartimer = setTimeout(closefn, 3000);
        } else {
            console.log("stdout" + stdout);
            mydata = mydata.splice('', 1);
            mydata = stdout.trim().split(',')
            mydata = stdout.trim().split(';')
            mydata = mydata.filter(Boolean);
            for (i = 0; i < mydata.length; i++) {
                if ((mydata[i].toString() + ";") == postgtespath || (mydata[i].toString()) == postgtespath) {
                    path_exists = 1;
                }
                set_path_string = set_path_string + mydata[i].toString() + ";";
            }
            set_path_string = set_path_string + postgtespath;
            console.log(set_path_string)
            if (path_exists == 0) {
                exec('setx path "' + set_path_string + '"', function (error, stdout, stderr) {
                    if (error) {
                        console.log(error);
                        const { dialog } = require('electron')
                        dialog.showErrorBox("", "something went wrong,please restart the application!");
                        cleartimer = setTimeout(closefn, 3000);
                    }
                    else {

                        const { dialog } = require('electron')
                        dialog.showMessageBox(pathoption);
                        cleartimer = setTimeout(closefn, 3000);


                    }
                })
            }
            else {
                const { dialog } = require('electron')
                dialog.showMessageBox(pathoption);
                cleartimer = setTimeout(closefn, 3000);
            }
        }

    })


}




function finalexe() {
    console.log("finalexe" + chk_xampp + chk_node + chk_postgres);
    if (chk_xampp == 1 && chk_node == 1 && chk_postgres == 1) {
        fs.readFile(log_val, 'utf-8', (err, data) => {
            if (err) throw err;
            if (data == "flag:-1") {
                softwareApi(1);
            }
            else if (data == "") {
                var logger = fs.createWriteStream(log_val, {})
                logger.write('flag:-1')
                logger.end();
                const { dialog } = require('electron')
                dialog.showErrorBox("", "Please restart the application");
                cleartimer = setTimeout(closefn, 3000);
            }
            else {
                initialfn();
            }
        });

    }
    else {
        const { dialog } = require('electron')
        if (chk_xampp == 0 && chk_node == 0 && chk_postgres == 0)
            dialog.showErrorBox("Please Install Xampp, Node.js & PostgresSql",
                "Download links of dependency softwares:)\n Xampp Link: \n      https://www.apachefriends.org/download.html  \n\n  Node.js Link: \n      https://nodejs.org/en/download/ \n\n  PostgresSql Link: \n      https://www.enterprisedb.com/downloads/postgres-postgresql-downloads");
        else if (chk_xampp == 0 && chk_node == 0)
            dialog.showErrorBox("Please Install Xampp & Node.js ",
                "Download links of dependency softwares:) \n Xampp Link: \n      https://www.apachefriends.org/download.html  \n\n  Node.js Link: \n      https://nodejs.org/en/download/ ");
        else if (chk_node == 0 && chk_postgres == 0)
            dialog.showErrorBox("Please Install Node.js & PostgresSql",
                "Download links of dependency softwares:) \n Node.js Link: \n      https://nodejs.org/en/download/ \n\n  PostgresSql Link: \n      https://www.enterprisedb.com/downloads/postgres-postgresql-downloads");
        else if (chk_xampp == 0 && chk_postgres == 0)
            dialog.showErrorBox("Please Install Xampp & PostgresSql",
                "Download links of dependency softwares:) \n Xampp Link: \n      https://www.apachefriends.org/download.html \n\n  PostgresSql Link: \n      https://www.enterprisedb.com/downloads/postgres-postgresql-downloads");
        else if (chk_xampp == 0)
            dialog.showErrorBox("Please Install Xampp",
                "Download link of dependency software Xampp :) \n\n https://www.apachefriends.org/download.html \n");
        else if (chk_node == 0)
            dialog.showErrorBox("Please Install Node.js",
                "Download link of dependency software Node.js :) \n\n https://nodejs.org/en/download/ \n");
        else if (chk_postgres == 0)
            dialog.showErrorBox("Please Install PostgresSql",
                "Download link of dependency software PostgresSql :) \n\n https://www.enterprisedb.com/downloads/postgres-postgresql-downloads \n");

        fs.readFile(log_val, 'utf-8', (err, data) => {
            if (err) throw err;
            if (data == "flag:-1") {
                softwareApi(0);
            }
            else if (data == "") {
                var logger = fs.createWriteStream(log_val, {})
                logger.write('flag:-1')
                logger.end();
                const { dialog } = require('electron')
                dialog.showErrorBox("", "Please restart the application");
                cleartimer = setTimeout(closefn, 3000);
            }
            else {
                cleartimer = setTimeout(closefn, 3000);
            }

        });


    }

}



function softwareApi(status) {
    isOnline().then(online => {
        if (online) {
            const { dialog } = require('electron')
            dialog.showMessageBox(startoptions);
            start_msg = 1;

            AdminDbConfig.connect((err, client, done) => {
                if (err) {
                    console.log("Internal Server Error")
                    done();
                    const { dialog } = require('electron')
                    dialog.showErrorBox("", "Internal Server Error1");
                    cleartimer = setTimeout(closefn, 3000);

                }
                else {
                    client.query('UPDATE edsix_offline_schoolsbranch SET software_flag =$2 where schoolbranch_id=$1', [schoolbranch_id, status],
                        (error, results) => {
                            if (error) {
                                console.log("Internal Server Error2");
                                done();
                                const { dialog } = require('electron')
                                dialog.showErrorBox("", "Internal Server Error2");
                                cleartimer = setTimeout(closefn, 3000);
                            }
                            else {
                                console.log("Db completed successfully! ")
                                done();
                                if (status == 1) {
                                    var logger = fs.createWriteStream(log_val, {})
                                    logger.write('flag:0')
                                    logger.end();
                                    initialfn();

                                }
                                else {
                                    cleartimer = setTimeout(closefn, 3000);
                                }


                            }
                        })
                }
            })
        } else {
            const { dialog } = require('electron')
            dialog.showErrorBox("", "Please check your internet connection...");
            cleartimer = setTimeout(closefn, 3000);
        }
    });

}


function successPop() {
    assignipfn();
}
var ip_data;
function assignipfn() {
    exec('cd ' + basepath1 + ' & ip', function (error, stdout, stderr) {
        if (error) {
            console.log(error);
            console.log('unable to get ip!');
            const { dialog } = require('electron')
            dialog.showErrorBox("", "Unable to get ip, Please restart the application!");
            cleartimer = setTimeout(closefn, 3000);
        }
        else {
            console.log(stdout);
            drives1 = stdout.trim().split('\r\n');
            Sfip = JSON.parse(JSON.stringify(drives1));
            console.log("system ip " + Sfip[0]);
            ip_data = Sfip[0];
            options = {
                buttons: ["Ok"],
                title: "Edsix_Offline",
                icon: basepath + 'favicon.ico',
                message: " \n skillangels_superbrain running successfully with link \n http://" + ip_data + "/Edsix/FrontEnd/dist \n \n",
            }
            var logger = fs.createWriteStream(anglpath + '/dist/assets/ip.txt', {})
            logger.write(Sfip[0])
            logger.end();

            var logger1 = fs.createWriteStream(assets_val, {})
            logger1.write(Sfip[0])
            logger1.end();
            startnodeFn1();
        }
    });


}

var startnodeFn1 = (function () {
    var executed_val = false;
    return function () {
        if (!executed_val) {
            console.log('entered node start');
            exec('cd ' + nodepath + ' & nodemon', function (error, stdout, stderr) {
                if (error) {
                    console.log('unable to start node!');
                    const { dialog } = require('electron')
                    dialog.showErrorBox("", "Unable to start node, Please restart the application!");
                    cleartimer = setTimeout(closefn, 3000);
                }
                else {

                }
            });
            console.log('Node server running on port 3000');
            console.log('node started successfully!');
            createWindow();
            // const { dialog } = require('electron');
            // dialog.showMessageBox(options);
            executed_val = true;
        }
    };

}
)();

function closefn() {
    clearTimeout(cleartimer);
    process.exit(0);
}


