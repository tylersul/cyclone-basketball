var express = require("express");
var router = express.Router();
var Player = require("../models/player");
var middleware = require("../middleware") //don't need to add index.js because it's auto included

//INDEX - show all campgrounds
// real route is /players, but added that default in the app.js routes
// TO DO - return flash message for empty search results
router.get("/", function(req, res){
    if(req.query.search){
        escapeRegex(req.query.search);
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Player.find({name: regex}, function(err, allPlayers){
            if(err){
                console.log(err);
            } else {
                if(allPlayers.length < 1) {
                    return res.render("players/index", {players: allPlayers, "error": "No match! Please try again!"});
                }
                res.render("players/index",{players: allPlayers, currentUser: req.user});
            }
        });
    } else {
        // Get all players from DB
        Player.find({}).sort('name').exec(function(err, allPlayers){
            if(err){
                console.log(err);
            } else {
                res.render("players/index",{players:allPlayers, currentUser: req.user});
            }
        });
    }
});

//CREATE PLAYER 
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    let name          = req.body.name,
        image         = req.body.image,
        position      = req.body.position,
        desc          = req.body.description,
        dob           = req.body.dob,
        hometown      = req.body.hometown,
        country       = req.body.country,
        height_feet   = req.body.height_feet,
        height_inches = req.body.height_inches,
        weight        = req.body.weight,
        author        = {
        id: req.user._id,
        username: req.user.username
        };

    var newPlayer = {name: name, image: image, position: position, description: desc, author: author, dob: dob, hometown: hometown,
                        country: country, height_feet: height_feet, height_inches: height_inches, weight: weight};

    // Create a new campground and save to DB
    Player.create(newPlayer, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/players");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("players/new"); 
});

// PLAYER - SHOW: shows more info about one player
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Player.findById(req.params.id).populate("comments").exec(function(err, foundPlayer){
        if(err){
            console.log(err);
        } else {
            let pointAvg = foundPlayer.season.map(({
                ppg}) => ppg);
            
            let astAvg = foundPlayer.season.map(({
                apg}) => apg);

            let rebAvg = foundPlayer.season.map(({
                rpg}) => rpg);

            let pointTotal = foundPlayer.yearlyTotals.map(({
                pts}) => pts);
            
            let astTotal = foundPlayer.yearlyTotals.map(({
                ast}) => ast);

            let years = foundPlayer.season.map(({
                grade}) => grade);
            
            let gp = foundPlayer.season.map(({
                gp}) => gp);

            let gs = foundPlayer.season.map(({
                gs}) => gs);

            let totalGP = gp.reduce((a, b) => a + b, 0);

            let totalGS = gs.reduce((a, b) => a + b, 0);

            let minutes = foundPlayer.yearlyTotals.map(({
                min}) => min);
            
            let totalMP = minutes.reduce((a, b) => a + b, 0);


            let fgMade = foundPlayer.yearlyTotals.map(({
                fgm}) => fgm);

            let totalFGM = fgMade.reduce((a, b) => a + b, 0);

            let fgAtt = foundPlayer.yearlyTotals.map(({
                fga}) => fga);

            let totalFGA = fgAtt.reduce((a, b) => a + b, 0)

            let tpAtt = foundPlayer.yearlyTotals.map(({
                tpa}) => tpa);

            let totalTPA = tpAtt.reduce((a, b) => a + b, 0)

            let tpMade = foundPlayer.yearlyTotals.map(({
                tpm}) => tpm);

            let totalTPM = tpMade.reduce((a, b) => a + b, 0)

            let ftAtt = foundPlayer.yearlyTotals.map(({
                fta}) => fta);

            let totalFTA = ftAtt.reduce((a, b) => a + b, 0)

            let ftMade = foundPlayer.yearlyTotals.map(({
                ftm}) => ftm);

            let totalFTM = ftMade.reduce((a, b) => a + b, 0)

            let orb = foundPlayer.yearlyTotals.map(({
                orb}) => orb);

            let totalORB = orb.reduce((a, b) => a + b, 0)

            let drb = foundPlayer.yearlyTotals.map(({
                drb}) => drb);

            let totalDRB = drb.reduce((a, b) => a + b, 0)

            let ast = foundPlayer.yearlyTotals.map(({
                ast}) => ast);

            let totalAST = ast.reduce((a, b) => a + b, 0)

            let stl = foundPlayer.yearlyTotals.map(({
                stl}) => stl);

            let totalSTL = stl.reduce((a, b) => a + b, 0)

            let blk = foundPlayer.yearlyTotals.map(({
                blk}) => blk);

            let totalBLK = blk.reduce((a, b) => a + b, 0)

            let pf = foundPlayer.yearlyTotals.map(({
                pf}) => pf);

            let totalPF = pf.reduce((a, b) => a + b, 0)

            let pts = foundPlayer.yearlyTotals.map(({
                pts}) => pts);

            let totalPTS = pts.reduce((a, b) => a + b, 0)

            let mpgAvg = foundPlayer.season.map(({
                mpg}) => mpg);
            
            let avgMPG = [];

            for (var i = 0; i < mpgAvg.length; i++) {
                avgMPG[i] = mpgAvg[i] * gp[i]
            }

            let careerMPGTemp = avgMPG.reduce((a, b) => (a + b), 0)

            let careerMPG = careerMPGTemp / totalGP;

            let careerFG = totalFGM / totalFGA;

            let careerTP = totalTPM / totalTPA;

            let careerFT = totalFTM / totalFTA;

            let careerRPG = (totalORB + totalDRB) / totalGP;

            let careerAPG = totalAST / totalGP;

            let careerSPG = totalSTL / totalGP;

            let careerBPG = totalBLK / totalGP;

            let careerPPG = totalPTS / totalGP;

            //render show template with that campground
            res.render("players/show", {player: foundPlayer, pointAvgs: pointAvg, astAvgs: astAvg, rebAvgs: rebAvg, 
                                            pointTotals: pointTotal, astTotals: astTotal, yearTotals: years, mpg: careerMPG, gp: totalGP, gs: totalGS, 
                                            mp: totalMP, fgm: totalFGM, fga: totalFGA, tpa: totalTPA, tpm: totalTPM, fta: totalFTA,
                                            ftm: totalFTM, orb: totalORB, drb: totalDRB, ast: totalAST, stl: totalSTL, blk: totalBLK,
                                            pf: totalPF, pts: totalPTS, careerFG: careerFG, careerTP: careerTP, careerFT: careerFT,
                                            careerRPG: careerRPG, careerAPG: careerAPG, careerSPG: careerSPG, careerBPG: careerBPG,
                                            careerPPG: careerPPG});
        }
    });
});

// EDIT Player
router.get("/:id/edit", middleware.checkPlayerOwnership, function(req, res){
    Player.findById(req.params.id, function(err, foundPlayer){
        res.render("players/edit", {player: foundPlayer});
    });
});

// UPDATE Player
router.put("/:id", middleware.checkPlayerOwnership, function(req, res){
    Player.findByIdAndUpdate(req.params.id, req.body.player, function(err, updatedPlayer){
        if(err){
            res.redirect("/players");
        } else {
            res.redirect("/players/" + req.params.id);
        }
    });
});

// DESTROY player
router.delete("/:id", middleware.checkPlayerOwnership, function(req, res){
    Player.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/players");
        } else {
            res.redirect("/players");
        }
    });
});

// Player Analytics
router.get("/:id/analytics", function(req, res){
    Player.findById(req.params.id, function(err, foundPlayer) { 
        if(err){
            console.log(err);
        } else {
            // Games & Miniutes
            let gp = foundPlayer.season.map(({
                gp}) => gp);

            let gs = foundPlayer.season.map(({
                gs}) => gs);

            let totalGP = gp.reduce((a, b) => a + b, 0);

            let totalGS = gs.reduce((a, b) => a + b, 0);

            let totalMin = foundPlayer.yearlyTotals.map(({
                min}) => min);

            let careerMin = totalMin.reduce((a, b) => a + b, 0);

            let minAvg = foundPlayer.season.map(({
                mpg}) => mpg);

            // Averages 
            let pointAvg = foundPlayer.season.map(({
                ppg}) => ppg);
            
            let astAvg = foundPlayer.season.map(({
                apg}) => apg);
    
            let rebAvg = foundPlayer.season.map(({
                rpg}) => rpg);
            
            let stlAvg = foundPlayer.season.map(({
                spg}) => spg);
    
            let fgpct = foundPlayer.season.map(({
                fg}) => fg);

            let tppct = foundPlayer.season.map(({
                tp}) => tp);

            let ftpct = foundPlayer.season.map(({
                ft}) => ft);

            let pointTotal = foundPlayer.yearlyTotals.map(({
                pts}) => pts);
    
            let astTotal = foundPlayer.yearlyTotals.map(({
                ast}) => ast);

            let dRebTotal = foundPlayer.yearlyTotals.map(({
                drb}) => drb);

            let oRebTotal = foundPlayer.yearlyTotals.map(({
                orb}) => orb);

            let rebTotal = dRebTotal.map(function(n, i) {
                return n + oRebTotal[i];
            });

            let stlTotal = foundPlayer.yearlyTotals.map(({
                stl}) => stl);

            let years = foundPlayer.season.map(({
                grade}) => grade);
    
            //render show template with that campground
            res.render("players/analytics", {player: foundPlayer, gp: gp, totalGP: totalGP, gs: gs, totalGS: totalGS, totalMin: totalMin, 
                                            careerMin: careerMin, minAvgs: minAvg, pointAvgs: pointAvg, astAvgs: astAvg, rebAvgs: rebAvg, 
                                            stlAvgs: stlAvg, fg: fgpct, tp: tppct, ft: ftpct, pointTotals: pointTotal, 
                                            rebTotals: rebTotal, astTotals: astTotal, stlTotals: stlTotal, yearTotals: years });
            }
    });
});

// Player Analytics - Advanced
router.get("/:id/advanced", function(req, res){
    Player.findById(req.params.id, function(err, foundPlayer) {
        if (err) {
            console.log(err)
        } else {
            // SHOOTING
            let fgpct = foundPlayer.season.map(({
                fg}) => fg);

            let fga = foundPlayer.yearlyTotals.map(({
                fga}) => fga);
            
            let fgm = foundPlayer.yearlyTotals.map(({
                fgm}) => fgm);

            let tppct = foundPlayer.season.map(({
                tp}) => tp);

            let tpa = foundPlayer.yearlyTotals.map(({
                tpa}) => tpa);
        
            let tpm = foundPlayer.yearlyTotals.map(({
                tpm}) => tpm);

            let ftpct = foundPlayer.season.map(({
                ft}) => ft);
            
            // True Shoot %
            let comboShooting = fgpct.map(function(n, i) {
                return n + tppct[i];
            });
            
            let allShooter = ftpct.map(function(n, i) {
                return n + comboShooting[i]
            });

            let ts = [];

            // Need to update TS with two point percentages, not fg
            for(var i = 0, length = allShooter.length; i < length; i++){
                ts[i] = allShooter[i]/3;
            }

            // Effective FG%
            let tpHalf = tpm;

            for (var i=0; i < tpm.length; i++) {
                tpm[i] = tpm[i]/2;
              }

            let eFgTemp = tpHalf.map(function(n, i) {
                return n + fgm[i]
            });

            let efg = eFgTemp.map(function(n, i) {
                return n / fga[i];
            })

            // 3 Point Attempt Rate 
            let tpAttRate = tpa.map(function(n, i) {
                return n / fga[i];
            })

            // Assist to Turnover Ratio
            let astTotal = foundPlayer.yearlyTotals.map(({
                ast}) => ast);

            let toTotal = foundPlayer.yearlyTotals.map(({
                to}) => to)

            let ato = astTotal.map(function(n, i) {
                return n / toTotal[i];
            });

            // Years at School (e.g. Freshman, Sophomore)
            let years = foundPlayer.season.map(({
                grade}) => grade);
            

            res.render("players/advanced", {player: foundPlayer, ts: ts, efg: efg, tpar: tpAttRate, atoRatio: ato, yearTotals: years})
        }
    });
});


// Player Analytics - Game Logs
router.get("/:id/games", function(req, res) {
    Player.findById(req.params.id, function(err, foundPlayer) {
        if (err) {
            console.log(err);
            return res.redirect("back");
        } else {
            // ***** Overall Record ***** //
            // Get array of total W's & L's
            let record = foundPlayer.gameLog.map(({
                result}) => result);
            
            // Function to count the occurrences of given value
            const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
            
            // Count total Wins
            let wins = countOccurrences(record, "W");
            
            // Count total losses
            let losses = countOccurrences(record, "L");
            
            // ***** Home Record ***** //
            // Get games played at home
            let home = foundPlayer.gameLog.filter(obj => {
                return obj.location === "Home";
            });

            let homeRecord = home.map(({
                result}) => result);

            let homeWins = countOccurrences(homeRecord, "W");
            
            let homeLosses = countOccurrences(homeRecord, "L");

            // ***** Neutral Record ***** //
            // Get games played at neutral site
            let neutral = foundPlayer.gameLog.filter(obj => {
                return obj.location === "Neutral";
            });

            let neutralRecord = neutral.map(({
                result}) => result);

            let neutralWins = countOccurrences(neutralRecord, "W");

            let neutralLosses = countOccurrences(neutralRecord, "L");

            // ***** Away Record ***** //
            let away = foundPlayer.gameLog.filter(obj => {
                return obj.location === "Away";
            });

            let awayRecord = away.map(({
                result}) => result);

            let awayWins = countOccurrences(awayRecord, "W");

            let awayLosses = countOccurrences(awayRecord, "L");
            
            // ***** Conference Tourney Record ***** //
            let tourney = foundPlayer.gameLog.filter(obj => {
                return obj.gameType === "CTOURN";
            });

            let tourneyRecord = tourney.map(({
                result}) => result);

            let tourneyWins = countOccurrences(tourneyRecord, "W");

            let tourneyLosses = countOccurrences(tourneyRecord, "L");
            console.log(tourney)
            
            // ***** NCAA Tourney Record ***** //
            let ncaa = foundPlayer.gameLog.filter(obj => {
                return obj.gameType === "NCAA";
            });

            let ncaaTourn = ncaa.map(({
                result}) => result);

            let ncaaWins = countOccurrences(ncaaTourn, "W");

            let ncaaLosses = countOccurrences(ncaaTourn, "L");

            // ***** Career High: Points ***** //
            let careerPTS = Math.max(...foundPlayer.gameLog.map(({
                pts}) => pts));

            // Career High: Assists
            let careerAST = Math.max(...foundPlayer.gameLog.map(({
                ast}) => ast));
            
            // Career High: Rebounds
            let dRebTotal = foundPlayer.gameLog.map(({
                drb}) => drb);

            let oRebTotal = foundPlayer.gameLog.map(({
                orb}) => orb);

            let careerREB = Math.max(...dRebTotal.map(function(n, i) {
                return n + oRebTotal[i];
            }));

            res.render("players/games", {player: foundPlayer, wins: wins, losses:losses, hWins: homeWins, hLosses: homeLosses, aWins: awayWins,
                                            aLosses: awayLosses, nWins: neutralWins, nLosses: neutralLosses, tWins: tourneyWins, tLosses: tourneyLosses,
                                            ncaaWins: ncaaWins, ncaaLosses: ncaaLosses, careerPTS: careerPTS, careerAST: careerAST, careerREB: careerREB});
        }
    })
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;