const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db_menu = require('./model/menu/menu')
const db_puzzles = require('./model/puzzles/puzzles')
const db_trophies = require('./model/trophies/trophies')
const db_games = require('./model/games/games')
const db_login = require('./model/login/login')
const db_profile = require('./model/profile/profile')
const db_dashboard = require('./model/dashboard/dashboard')
const db_report = require('./model/report/report')
const db_skillkit = require('./model/skillkit/skillkit')
const db_hots = require('./model/hots/hots')
const db_sbc = require('./model/sbc/sbc')

//sync///////////////
const db_sync = require('./model/Sync/sync')
const db_livesync = require('./model/Sync/livesync')

/////////////LocalStorage///////
const multer = require('multer');

const port = 3000
const cors = require('cors')


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express and Postgres API' })
});

app.post('/', (request, response) => {
  response.json({ status: "success", info: 'Node.js, Express, and Postgres API' })
})

/////////////////from game/////////////
app.post('/gamescore', db_games.gamescore);
app.post('/quesscore', db_games.quesscore);
app.post('/getRemainingQues', db_games.getRemainingQues);
app.post('/game_getsession', db_games.game_getsession);

/////////from angular/////////////

////////////puzzle///////////////
app.post('/getgame', db_puzzles.getgame);
app.post('/getScore', db_puzzles.getScore);
app.post('/getTrophy', db_puzzles.getTrophy);
app.post('/getquescnt', db_puzzles.getquescnt);
app.post('/getsnd', db_puzzles.getsnd);
app.post('/getass2trainchk', db_puzzles.getass2trainchk);

app.post('/getgamec2', db_puzzles.getgamec2);
app.post('/getorggame', db_puzzles.getorggame);
app.post('/getDaChk', db_puzzles.getDaChk);


////////////trophies////////////
app.post('/getassstar', db_trophies.getassstar);

/////////////skillkit////////////////
app.post('/checkskilllist', db_skillkit.checkskilllist);
app.post('/putskillkitscore', db_skillkit.putskillkitscore);
app.post('/getskillkitscore', db_skillkit.getskillkitscore);
app.post('/getskillkitgames', db_skillkit.getskillkitgames);
app.post('/getskillkitsnd', db_skillkit.getskillkitsnd);
app.post('/getskillkitquescnt', db_skillkit.getskillkitquescnt);
app.post('/checkskillkittoday', db_skillkit.checkskillkittoday);
app.post('/get_skill_detail', db_skillkit.get_skill_detail);
app.post('/check_lost_cycle', db_skillkit.check_lost_cycle);
app.post('/getskillkitorggame', db_skillkit.getskillkitorggame);
app.post('/getgamesstatus', db_skillkit.getgamesstatus);

////////////////sbc//////////////////////
app.post('/getsbcgame', db_sbc.getsbcgame);
app.post('/getsbcScore', db_sbc.getsbcScore);
app.post('/getsbcsnd', db_sbc.getsbcsnd);
app.post('/gesbcquescnt', db_sbc.gesbcquescnt);




//Jaya included APIs - for dashboard page, login page, menu page, skillkit page
app.post('/accLogin', db_login.accLogin);
app.post('/setsessionid', db_login.setsessionid);
app.post('/getSiteWords', db_login.getSiteWords);
app.post('/getLanguages', db_login.getLanguages);
app.post('/getDashData', db_dashboard.getDashData);
app.post('/getScoreData', db_dashboard.getScoreData);
app.post('/getAssessmentData', db_dashboard.getAssessmentData);
app.post('/getCrownyData', db_dashboard.getCrownyData);


/////////////////menu/////////////////////////////////

app.post('/getskillkitstatus', db_menu.getskillkitstatus);
app.post('/setdobdata', db_menu.setdobdata);
app.post('/chkfbdata', db_menu.chkfbdata);
app.post('/setfbdata', db_menu.setfbdata);
app.post('/dayAfterLoginCheck', db_menu.dayAfterLoginCheck);
app.post('/chkinitialcomp', db_menu.chkinitialcomp);
app.post('/getsession', db_menu.getsession);
app.post('/getmedval', db_menu.getmedval);
////////////Profile///////////////
app.post('/getprofile', db_profile.getprofile);
app.post('/getLanguagesProf', db_profile.getLanguagesProf);
app.post('/updatetheme', db_profile.updatetheme);
app.post('/updateaudio', db_profile.updateaudio);
app.post('/updatelang', db_profile.updatelang);
app.post('/getthemeusertotscore', db_profile.getthemeusertotscore);
app.post('/getProfileImg', db_profile.getProfileImg);
/////////////////////////Profile img////////////////////////////////////////



app.use("/resources", express.static(__dirname + "/assets/gallery"));

var path_proimg = "./assets/gallery"
const imagestorage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, `${path_proimg}`)
  },
  filename: (req, file, callBack) => {
    callBack(null, `${file.originalname}`)
  }
})
const imgupload = multer({ storage: imagestorage })

app.post('/icon', imgupload.single('file'), (req, res, next) => {
  const file = req.file;
  console.log(file);
  if (!file) {
    const error = new Error('No File')
    console.log("coming")
    error.httpStatusCode = 400
    res.status(200).json({ status: 'SA054', message: 'Profile image not uploaded' })
    return next(error)
  }
  // res.send(file);
  res.status(200).json({ status: 'SA000', message: 'Profile image uploaded' })
})


//////////////////Report//////////
app.post('/getreport', db_report.getreport);
app.post('/getRank', db_report.getRank);
app.post('/getskillkit', db_report.getskillkit);
///////////////////Menu//////////////////////

app.post('/getTime', db_menu.getTime);
app.post('/setTime', db_menu.setTime);
app.post('/session_close', db_menu.session_close);


///////////////////hots//////////////////////
app.post('/getHots', db_hots.getHots);
app.post('/gethotssnd', db_hots.gethotssnd);

// //////////////////////sync////////////
app.post('/live_sync', db_sync.live_sync);
app.post('/local_sync', db_livesync.local_sync);


