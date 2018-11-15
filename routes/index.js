var dbPath = "../db.js";
var appPath = '../app.js';
var express = require('express');
var router = express.Router();
var mysql = require('mysql');


var DatabaseHandler = require(dbPath);
const CURRENTSEASONNUMB = 1;

//Promise handling loop from:
//https://stackoverflow.com/questions/40328932/javascript-es6-promise-for-loop

/* GET home page. */
router.get('/', function(req, res, next) {

  var context = {};
  context.title = "Splat Stats";
  res.render('index', context);


});

router.get('/search_results', function(req,res,next) {
    var context = {};
    var DB = new DatabaseHandler();
    console.log(JSON.stringify(req.query));
    var terms = [];
    terms = req.query.searchTerm.split(/[ ,]+/);
    context.title = "SearchResults ";
    console.log(terms);

    console.log(terms.length);

    new Promise((resolve, reject) => {

        (function loop(i) {
            if (i === terms.length) {
                console.log(JSON.stringify(context));
                DB.close();
                res.render('search', context);
            } else if (i < terms.length) {
                var SQL = [ "SELECT map_id, map_name FROM maps WHERE map_name LIKE "
                    + "'%" + terms[i] + "%' LIMIT 10",
                            "SELECT team_id, team_name FROM teams WHERE team_name LIKE "
                    + "'%" + terms[i] + "%' LIMIT 10",
                    "SELECT league_id, league_name FROM leagues WHERE league_name LIKE "
                    + "'%" + terms[i] + "%' LIMIT 10",
                    "SELECT user_id, user_name FROM users WHERE user_name LIKE "
                    + "'%" + terms[i] + "%' LIMIT 20"
                    ];

                DB.query(SQL[0]).then(rows => {
                    context.maps = rows;
                }).then(()=>{
                    DB.query(SQL[1]).then( rows =>{
                        context.teams = rows;
                    }).then(()=>{
                        DB.query(SQL[2]).then( rows => {
                            context.leagues = rows;
                        }).then(()=> {
                            DB.query(SQL[3]).then(rows => {
                                context.users = rows;
                            }).then(
                                loop.bind(null, i + 1));
                        });
                    });
                });

            }
        })(0);
        resolve();

    }).catch(err => {
        console.log("oh no " + err);
    });
});



router.get('/leagues/:league_id', function(req, res, next){
    var DB = new DatabaseHandler();
    var context = {};
    var LeagueSQL = "SELECT leagues.start_date, leagues.end_date," +
        " leagues.league_name FROM leagues "+
        "WHERE leagues.league_id = " + "'" + req.params.league_id + "'";

    var TeamsSQL = "SELECT teams.team_name, leagues.start_date, leagues.end_date," +
        " teams.team_id, leagues.league_name FROM teams " +
        "INNER JOIN leagues_teams ON leagues_teams.team_id = teams.team_id " +
        "INNER JOIN leagues ON leagues_teams.league_id = leagues.league_id " +
        "WHERE leagues.league_id = " + "'" + req.params.league_id + "'";
    DB.query(LeagueSQL).then(rows=>{
        if(rows.length > 0){
            context.league_id = req.params.league_id;
            context.league_name = rows[0].league_name;
            context.start = rows[0].start_date;
            context.end = rows[0].end_date;
        }
        DB.query(TeamsSQL).then(rows=>{
            context.teams = rows;
        }).then(()=> {
            DB.close();
            res.render('league', context);
        });
    }).catch(err =>{
        console.log("oh no " + err);
    });
});

router.post('/newLeague', function(req, res, next) {
    var DB = new DatabaseHandler();
    var context = {};
    console.log("What maps");
    var SQL = "INSERT INTO leagues(league_name, season_numb, start_date, end_date) VALUES (?,?,?,?);";
    var name = req.body.newLeagueName;
    var inserts = [name, 1, '2018-10-01', '2018-12-20'];
    var what = DB.insertInto(SQL, inserts).then(()=>{
        DB.close();
        res.redirect('/leagues');
    }).catch(err =>{
        console.log("oh no " + err);
    });

});

router.post('/deleteLeague', function(req, res){
    var DB = new DatabaseHandler();
    var context = {};
    console.log("Get outta hear leeg");
    var SQL = "DELETE FROM leagues WHERE league_id = ?;";
    DB.deleteFrom(SQL, [req.body.delete_button]).then(()=>{
        DB.close();
        res.redirect('/leagues');
    }).catch(err =>{
        console.log("oh no " + err);
    });

    console.log(JSON.stringify(req.body));
});


router.get('/maps', function(req, res, next) {
    var DB = new DatabaseHandler();
    var context = {};
    var createString = "SELECT * FROM maps;";
    context.title = "Maps";
    var what = DB.query(createString).then(rows =>{
        context.results = rows;
        console.log("SQL stuff");
    }).then(()=>{
        DB.close();
        res.render('maps', context);
    }).catch(err =>{
        console.log("oh no " + err);
    });

});


router.post('/newMap', function(req, res, next) {
    console.log("POSTING maps");

    var DB = new DatabaseHandler();
    var context = {};
    context.title = "Maps";

    var SQL = "INSERT INTO maps(map_name) VALUES (?);";
    var name = req.body.newMapName;
    var what = DB.insertInto(SQL, [name]).then(()=>{
        DB.close();
        console.log("GIT maps");
        res.redirect('/maps')
    }).catch(err =>{
        console.log("oh no " + err);
    });

});

router.post('/deleteMap', function(req, res){
    var DB = new DatabaseHandler();
    var context = {};
    console.log("Get outta hear mapp");
    var SQL = "DELETE FROM maps WHERE maps.map_id = ?;";
    DB.deleteFrom(SQL, [req.body.delete_button]).then(()=>{
        DB.close();
        res.redirect('/maps');
    }).catch(err =>{
        console.log("oh no " + err);
    });

    console.log(JSON.stringify(req.body));
});


router.get('/leagues', function(req, res, next) {
    var DB = new DatabaseHandler();
    var context = {};
    context.seasonNumb = CURRENTSEASONNUMB;
    var createString = "SELECT * FROM leagues WHERE leagues.season_numb = " + CURRENTSEASONNUMB + ";";
    context.title = "Leagues";
    var what = DB.query(createString).then(rows =>{
        context.results = rows;

    }).then(()=> {
        DB.close();
        res.render('leagues', context);
    }).catch(err =>{
        console.log("oh no " + err);
    });
});





router.get('/teams', function(req, res, next) {
    var DB = new DatabaseHandler();
    var leagueTeams = {};
    var context = {};
    context.seasonNumber = CURRENTSEASONNUMB;
    var createString = "SELECT leagues.league_name, leagues.league_id FROM leagues " +
    "WHERE leagues.season_numb = " + CURRENTSEASONNUMB;

    context.title = "Leagues for Season " + CURRENTSEASONNUMB;
    DB.query(createString).then( rows =>{
       context.leagues = rows;
    }).then(function(){ new Promise((resolve,reject)=> {

        (function loop(i) {
            if(i === context.leagues.length){
                DB.close();
                res.render('teams', context);
            }else if (i < context.leagues.length) {
                createString = "SELECT teams.team_name, teams.team_id, leagues.league_name FROM teams " +
                    "INNER JOIN leagues_teams ON leagues_teams.team_id = teams.team_id " +
                    "INNER JOIN leagues ON leagues_teams.league_id = leagues.league_id " +
                    "WHERE leagues.league_name = " + "'" + context.leagues[i].league_name + "'";
                DB.query(createString).then(rows => {
                    var name = "teams";

                    Object.assign(context.leagues[i], {[name]: rows});

                }).then(
                    loop.bind(null, i + 1));
            }
        })(0);
        resolve();

    }).catch(err =>{
        console.log("oh no " + err);
    });

})});

router.post('/newTeam/:leagueID', function(req, res){

    var leagueID = req.params.leagueID;
    var insertID;
    var name = req.body["newTeamName" + leagueID];
    console.log("newTeamName" + leagueID);

    console.log("League ID: " + leagueID + ", team name : " + name);

    var DB = new DatabaseHandler();
    var sql = "INSERT INTO teams (team_name, description) VALUES ('"+ name+ "', 'Generic')";
    console.log(sql);

    var inserts = [name, "Generically generated description"];
    DB.insertInto(sql).then(results => {
        console.log(results.insertId);
        insertID = results.insertId;
    }).then (()=>{
        inserts = [leagueID, insertID];
        sql = "INSERT INTO leagues_teams (league_id, team_id) VALUES (?, ?)";
        DB.query(sql, inserts).then(rows =>{
            console.log(req.body);
            DB.close();
            res.redirect(req.body.originatesFrom);
        })
    }).catch(err => {
        console.log("oh no " + err);
    });
});

router.post('/deleteTeam', function(req, res){
    var DB = new DatabaseHandler();
    var context = {};
    console.log("Get outta hear team");
    var SQL = "DELETE FROM teams WHERE teams.team_id = ?;";
    DB.deleteFrom(SQL, [req.body.delete_button]).then(()=>{
        console.log(JSON.stringify(req.body));
        DB.close();
        res.redirect(req.body.originatesFrom);
    }).catch(err =>{
        console.log("oh no " + err);
    });

    console.log(JSON.stringify(req.body));
});


router.post('/deleteUser', function(req, res){
    var DB = new DatabaseHandler();
    var context = {};
    console.log("Get outta hear user");
    var SQL = "DELETE FROM users WHERE users.user_id = ?;";
    DB.deleteFrom(SQL, [req.body.delete_button]).then(()=>{
        console.log(JSON.stringify(req.body));
        DB.close();
        res.redirect(req.body.originatesFrom);
    }).catch(err =>{
        console.log("oh no " + err);
    });

    console.log(JSON.stringify(req.body));
});



router.post('/deleteMatch', function(req, res){
    var DB = new DatabaseHandler();
    var context = {};
    console.log("Get outta hear user");
    var SQL = "DELETE FROM matches WHERE matches.match_id = ?;";
    DB.deleteFrom(SQL, [req.body.delete_button]).then(()=>{
        console.log(JSON.stringify(req.body));
        DB.close();
        res.redirect(req.body.originatesFrom);
    }).catch(err =>{
        console.log("oh no " + err);
    });

    console.log(JSON.stringify(req.body));
});


router.post('/teams/:team_id', function(req, res) {
    console.log("Posting to DB page");
    var name = req.body.newUsername;
    var userID;
    var DB = new DatabaseHandler();
    console.log("adding " + name);

    var sql = "INSERT INTO users (user_name, email) VALUES (?,?)";
    var inserts = [req.body.newUsername, "email@email.com"];

    DB.insertInto(sql, inserts).then(results => {
            userID = results.insertId;
            sql = "INSERT INTO teams_users (user_id, team_id) VALUES (?,?)";
            inserts = [userID, req.params.team_id];
        }).then(()=> {
            DB.query(sql, inserts).then(() => {
                DB.close();
                res.redirect('/teams/' + req.params.team_id);
        });
    }).catch(err => {
        console.log("oh no " + err);
    });
});

router.post('/newmatch', function(req, res){
    console.log(req.body);
    var DB = new DatabaseHandler();

    var SQL = "INSERT into matches(team1_id, team2_id, league_id, map_id, " +
        "team1_score, team2_score, match_date) VALUES (?,?,?,?,?,?,?)";
    var inserts = [req.body.addteam1_id, req.body.addteam2_id, req.body.addleague_id,
        req.body.addmap_id, req.body.addteam1_score, req.body.addteam2_score, req.body.addmatch_date];
    DB.insertInto(SQL, inserts).then( ()=>{
        DB.close();
    }).then(()=> {
            res.redirect('/teams/' + req.body.addteam1_id);
    }).catch(err => {
        console.log("oh no " + err);
    });
});

var Handlebars = require('hbs');

Handlebars.registerHelper('ifLeague', function(conditional, options){
    if(conditional === "Not currently in any league"){

    }else {
        return options.fn(this);
    }
});


router.get('/teams/:team_id', function(req, res, next) {
    var DB = new DatabaseHandler();
    var teamID = req.params.team_id;
    var SQL = "SELECT teams.team_name, teams.description FROM teams " +
        "WHERE teams.team_id = " + teamID + ";";

    var LeagueSQL = "SELECT  l.league_id, l.league_name FROM teams " +
        "INNER JOIN leagues_teams lt ON lt.team_id = teams.team_id " +
        "INNER JOIN leagues l ON l.league_id = lt.league_id " +
        "WHERE teams.team_id = " + teamID + ";";

    var createString = "SELECT users.user_id, users.user_name FROM users " +
        "INNER JOIN teams_users tu ON tu.user_id = users.user_id " +
        "INNER JOIN teams ON tu.team_id = teams.team_id " +
        "WHERE teams.team_id = " + teamID + ";";

    var context = {"teamID": teamID};
    context.title = "Teams";
    //console.log(createString);

    DB.query(SQL).then(rows => {
        //console.log(JSON.stringify(rows[0]));
        context.teamName = rows[0].team_name;
        context.description = rows[0].description;
        DB.query(LeagueSQL).then(rows=>{
            console.log(JSON.stringify(rows));

            if(rows.length > 0) {
                context.leagueName = rows[0].league_name;
                context.leagueID = rows[0].league_id;
            }else{
                console.log("norows");
                context.leagueName = "Not currently in any league";
            }
        }).then( ()=>{
            DB.query(createString).then(rows => {
                context.results = rows;
                createString = "SELECT t1.team_name AS `home team`, m.team1_score, m.team2_score, " +
                    "t2.team_name AS `away_team`,  m.team1_id, m.team2_id, m.match_id, m.match_type, m.match_date, " +
                    "m.map_id, maps.map_name FROM matches AS m " +
                    "INNER JOIN teams t1 ON m.team1_id = t1.team_id " +
                    "INNER JOIN teams t2 ON m.team2_id = t2.team_id " +
                    "LEFT JOIN maps ON maps.map_id = m.map_id " +
                    "WHERE m.team1_id = " + teamID + " OR m.team2_id = " + teamID + ";";

            }).then(() => {
                DB.query(createString).then(rows => {
                    context.matches = rows;

                }).then(rows => {
                    if(context.leagueName !== "Not currently in any league") {

                        SQL = "SELECT t.team_name, t.team_id FROM teams t " +
                            "INNER JOIN leagues_teams lt ON lt.team_id = t.team_id " +
                            "INNER JOIN leagues l ON l.league_id = lt.league_id " +
                            "WHERE t.team_ID <> " + teamID + " AND l.league_id = " + context.leagueID;
                        DB.query(SQL).then(rows => {
                            context.teams = rows;
                            DB.query("SELECT m.map_name, m.map_id FROM maps m;").then(rows => {
                                context.maps = rows;
                                DB.close();
                                res.render('team', context);
                            });

                        });
                    }else {
                        DB.close();
                        res.render('team', context);
                    }
            }).catch(err => {
                    console.log("oh no " + err);
                });
            });
        });

    }).catch(err => {
        console.log("oh no " + err);
    });
});

router.get('/users/:user_id', function(req, res, next) {
    var DB = new DatabaseHandler();
    var createString = "SELECT u.user_name, t.team_id, t.team_name, tm.join_date, tm.leave_date from users AS u " +
        "INNER JOIN teams_users tm ON u.user_id = tm.user_id " +
        "INNER JOIN teams t ON t.team_id = tm.team_id " +
        "WHERE u.user_id = " + req.params.user_id +" ORDER BY tm.join_date;";
    var context = {};


    DB.query(createString).then(rows=> {
        if(rows.length > 0){
            context.activity = rows;
            context.userName = rows[0].user_name;
            context.title = context.userName;

            context.lastTeam = rows[rows.length - 1].team_id;
            createString = "SELECT m.match_date, t1.team_id AS `team1_id`, t2.team_id AS `team2_id`, t1.team_name AS `home team`, m.team1_score," +
                " m.team2_score, t2.team_name AS `away_team`,  m.match_type, m.map_id," +
                " maps.map_name, l.league_name FROM matches AS m " +
                "INNER JOIN teams t1 ON m.team1_id = t1.team_id " +
                "INNER JOIN teams t2 ON m.team2_id = t2.team_id " +
                "INNER JOIN leagues l ON m.league_id = l.league_id " +
                "LEFT JOIN maps ON maps.map_id = m.map_id " +
                "WHERE team1_id = " + context.lastTeam + " OR team2_id = " + context.lastTeam +
                " ORDER BY m.match_date LIMIT 10;\n";}
    }).then(() =>{ DB.query(createString).then( rows =>{
        console.log(JSON.stringify(rows));
        context.matches = rows;

    }).then(() =>{
        DB.close();
        res.render('user', context);

    });

})});


// router.get('/matches', function(req, res, next) {
//     var DB = new DatabaseHandler();
//     var context = {};
//     var createString = "SELECT * FROM matches;";
//     context.title = "Teams";
//     DB.query(createString, function(err, rows, fields){
//         if(err){
//             console.log("OH no");
//             next(err);
//             return;
//         }
//         context.results = rows;
//
//         res.render('team', context);
//
//     });
// });


module.exports = router;
