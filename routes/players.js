let express = require('express'),
    router = express.Router(),
    Player = require('../models/player'),
    middleware = require('../middleware'); //don't need to add index.js because it's auto included

//INDEX - show all players
// TO DO - return flash message for empty search results
router.get('/', async (req, res) => {
    try {
        // Path: If user searches for a specific player, find players matching search term
        if (req.query.search) {
            // Legacy Regex Search
            escapeRegex(req.query.search);
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            const foundPlayers = await Player.find({ name: regex });

            if (foundPlayers.length < 1) {
                return res.render('players/index', {
                    players: foundPlayers,
                    error: 'No match. Please try again.',
                });
            }

            res.render('players/index', {
                players: foundPlayers,
                currentUser: req.user,
            });
        } else {
            // Get all players from DB
            const allPlayers = await Player.find({}).sort('name').exec();
            res.render('players/index', {
                players: allPlayers,
                currentUser: req.user,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('An error occurred while retrieving players.');
        res.redirect('index/home');
    }
});

// READ - Player Search: Advanced Search
router.get('/search', async (req, res) => {
    try {
        // Path: If user searches for a specific player, find players matching search term
        if (req.query.search) {
            // Default aggregation pipeline starting point
            // $Search - uses default Atlas Search Index with a wildcard search
            // $Project - limits returning payload & returns searchScore & highlights
            let options = [
                {
                    $search: {
                        index: 'default',
                        text: {
                            query: req.query.search,
                            path: { wildcard: '*' },
                        } /*,
                        highlight: {path: "plot"}*/,
                    },
                },
                {
                    $project: {
                        searchScore: { $meta: 'searchScore' },
                        /*highlights: {$meta: "searchHighlights"},*/
                        name: 1,
                        position: 1,
                        image: 1,
                    },
                },
                { $limit: 30 },
            ];

            // Run aggregation using Atlas Search & return movies that match criteria
            const foundPlayers = await Player.aggregate(options).exec();

            // If no players are returned
            if (foundPlayers.length < 1) {
                return res.render('players/search', {
                    players: foundPlayers,
                    error: 'No match. Please try again.',
                });
            }

            return res.render('players/search', {
                players: foundPlayers,
                query: req.query.search,
            });
        } else {
            // Get search page entry point
            res.render('players/search', {
                players: {},
                currentUser: req.user,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('An error occurred while retrieving players.');
        res.redirect('players/index');
    }
});

// Create - New Player: POST player
router.post('/', middleware.isLoggedIn, async (req, res) => {
    try {
        // Destructure properties from req.body
        const {
            name,
            image,
            position,
            desc,
            dob,
            hometown,
            country,
            height_feet,
            height_inches,
            weight,
        } = req.body;

        // Create author object from req.user
        const author = {
            id: req.user._id,
            username: req.user.username,
        };

        // Combine properties into new player object
        const newPlayer = {
            name,
            image,
            position,
            desc,
            author,
            dob,
            hometown,
            country,
            height_feet,
            height_inches,
            weight,
        };

        // Insert new player to database
        const newlyCreated = await Player.create(newPlayer);
        console.log(newlyCreated);
        res.redirect('/players');
    } catch (err) {
        console.log(err);
        res.status(500).error({ error: 'An error occurred.' });
        res.redirect('/players');
    }
});

// Create - New Player: GET Render Form
router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('players/new');
});

// PLAYER - SHOW: shows more info about one player
router.get('/:id', async (req, res) => {
    try {
        const searchedPlayer = await Player.findById(req.params.id)
            .populate('comments')
            .exec((err, foundPlayer) => {
                if (err) {
                    console.log(err);
                } else {
                    /*let pointAvg = foundPlayer.season.map(({ ppg }) => ppg);

                let astAvg = foundPlayer.season.map(({ apg }) => apg);

                let rebAvg = foundPlayer.season.map(({ rpg }) => rpg);

                let pointTotal = foundPlayer.yearlyTotals.map(({ pts }) => pts);

                let astTotal = foundPlayer.yearlyTotals.map(({ ast }) => ast);

                let years = foundPlayer.season.map(({ grade }) => grade);

                let gp = foundPlayer.season.map(({ gp }) => gp);

                let gs = foundPlayer.season.map(({ gs }) => gs);

                let totalGP = gp.reduce((a, b) => a + b, 0);

                let totalGS = gs.reduce((a, b) => a + b, 0);

                let minutes = foundPlayer.yearlyTotals.map(({ min }) => min);

                let totalMP = minutes.reduce((a, b) => a + b, 0);

                let fgMade = foundPlayer.yearlyTotals.map(({ fgm }) => fgm);

                let totalFGM = fgMade.reduce((a, b) => a + b, 0);

                let fgAtt = foundPlayer.yearlyTotals.map(({ fga }) => fga);

                let totalFGA = fgAtt.reduce((a, b) => a + b, 0);

                let tpAtt = foundPlayer.yearlyTotals.map(({ tpa }) => tpa);

                let totalTPA = tpAtt.reduce((a, b) => a + b, 0);

                let tpMade = foundPlayer.yearlyTotals.map(({ tpm }) => tpm);

                let totalTPM = tpMade.reduce((a, b) => a + b, 0);

                let ftAtt = foundPlayer.yearlyTotals.map(({ fta }) => fta);

                let totalFTA = ftAtt.reduce((a, b) => a + b, 0);

                let ftMade = foundPlayer.yearlyTotals.map(({ ftm }) => ftm);

                let totalFTM = ftMade.reduce((a, b) => a + b, 0);

                let orb = foundPlayer.yearlyTotals.map(({ orb }) => orb);

                let totalORB = orb.reduce((a, b) => a + b, 0);

                let drb = foundPlayer.yearlyTotals.map(({ drb }) => drb);

                let totalDRB = drb.reduce((a, b) => a + b, 0);

                let ast = foundPlayer.yearlyTotals.map(({ ast }) => ast);

                let totalAST = ast.reduce((a, b) => a + b, 0);

                let stl = foundPlayer.yearlyTotals.map(({ stl }) => stl);

                let totalSTL = stl.reduce((a, b) => a + b, 0);

                let blk = foundPlayer.yearlyTotals.map(({ blk }) => blk);

                let totalBLK = blk.reduce((a, b) => a + b, 0);

                let pf = foundPlayer.yearlyTotals.map(({ pf }) => pf);

                let totalPF = pf.reduce((a, b) => a + b, 0);

                let pts = foundPlayer.yearlyTotals.map(({ pts }) => pts);

                let totalPTS = pts.reduce((a, b) => a + b, 0);

                let mpgAvg = foundPlayer.season.map(({ mpg }) => mpg);

                let avgMPG = [];

                for (var i = 0; i < mpgAvg.length; i++) {
                    avgMPG[i] = mpgAvg[i] * gp[i];
                }

                let careerMPGTemp = avgMPG.reduce((a, b) => a + b, 0);

                let careerMPG = careerMPGTemp / totalGP;

                let careerFG = totalFGM / totalFGA;

                let careerTP = totalTPM / totalTPA;

                let careerFT = totalFTM / totalFTA;

                let careerRPG = (totalORB + totalDRB) / totalGP;

                let careerAPG = totalAST / totalGP;

                let careerSPG = totalSTL / totalGP;

                let careerBPG = totalBLK / totalGP;

                let careerPPG = totalPTS / totalGP; */
                }

                //render show template with that campground
                res.render('players/show', {
                    player: foundPlayer /*,
                pointAvgs: pointAvg,
                astAvgs: astAvg,
                rebAvgs: rebAvg,
                pointTotals: pointTotal,
                astTotals: astTotal,
                yearTotals: years,
                mpg: careerMPG,
                gp: totalGP,
                gs: totalGS,
                mp: totalMP,
                fgm: totalFGM,
                fga: totalFGA,
                tpa: totalTPA,
                tpm: totalTPM,
                fta: totalFTA,
                ftm: totalFTM,
                orb: totalORB,
                drb: totalDRB,
                ast: totalAST,
                stl: totalSTL,
                blk: totalBLK,
                pf: totalPF,
                pts: totalPTS,
                careerFG: careerFG,
                careerTP: careerTP,
                careerFT: careerFT,
                careerRPG: careerRPG,
                careerAPG: careerAPG,
                careerSPG: careerSPG,
                careerBPG: careerBPG,
                careerPPG: careerPPG,*/,
                });
            });
        /*res.render('players/index', {
            players: allPlayers,
            currentUser: req.user,
        });*/
    } catch (err) {}
});

// EDIT Player
router.get('/:id/edit', middleware.checkPlayerOwnership, function (req, res) {
    Player.findById(req.params.id, function (err, foundPlayer) {
        res.render('players/edit', { player: foundPlayer });
    });
});

// UPDATE Player
router.put('/:id', middleware.checkPlayerOwnership, function (req, res) {
    Player.findByIdAndUpdate(
        req.params.id,
        req.body.player,
        function (err, updatedPlayer) {
            if (err) {
                res.redirect('/players');
            } else {
                res.redirect('/players/' + req.params.id);
            }
        }
    );
});

// DESTROY player
router.delete('/:id', middleware.checkPlayerOwnership, function (req, res) {
    Player.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect('/players');
        } else {
            res.redirect('/players');
        }
    });
});

// Player Analytics
router.get('/:id/analytics', function (req, res) {
    Player.findById(req.params.id, function (err, foundPlayer) {
        if (err) {
            console.log(err);
        } else {
            // Games & Miniutes
            let gp = foundPlayer.season.map(({ gp }) => gp);

            let gs = foundPlayer.season.map(({ gs }) => gs);

            let totalGP = gp.reduce((a, b) => a + b, 0);

            let totalGS = gs.reduce((a, b) => a + b, 0);

            let totalMin = foundPlayer.yearlyTotals.map(({ min }) => min);

            let careerMin = totalMin.reduce((a, b) => a + b, 0);

            let minAvg = foundPlayer.season.map(({ mpg }) => mpg);

            // Averages
            let pointAvg = foundPlayer.season.map(({ ppg }) => ppg);

            let astAvg = foundPlayer.season.map(({ apg }) => apg);

            let rebAvg = foundPlayer.season.map(({ rpg }) => rpg);

            let stlAvg = foundPlayer.season.map(({ spg }) => spg);

            let fgpct = foundPlayer.season.map(({ fg }) => fg);

            let tppct = foundPlayer.season.map(({ tp }) => tp);

            let ftpct = foundPlayer.season.map(({ ft }) => ft);

            let pointTotal = foundPlayer.yearlyTotals.map(({ pts }) => pts);

            let astTotal = foundPlayer.yearlyTotals.map(({ ast }) => ast);

            let dRebTotal = foundPlayer.yearlyTotals.map(({ drb }) => drb);

            let oRebTotal = foundPlayer.yearlyTotals.map(({ orb }) => orb);

            let rebTotal = dRebTotal.map(function (n, i) {
                return n + oRebTotal[i];
            });

            let stlTotal = foundPlayer.yearlyTotals.map(({ stl }) => stl);

            let years = foundPlayer.season.map(({ grade }) => grade);

            //render show template with that campground
            res.render('players/analytics', {
                player: foundPlayer,
                gp: gp,
                totalGP: totalGP,
                gs: gs,
                totalGS: totalGS,
                totalMin: totalMin,
                careerMin: careerMin,
                minAvgs: minAvg,
                pointAvgs: pointAvg,
                astAvgs: astAvg,
                rebAvgs: rebAvg,
                stlAvgs: stlAvg,
                fg: fgpct,
                tp: tppct,
                ft: ftpct,
                pointTotals: pointTotal,
                rebTotals: rebTotal,
                astTotals: astTotal,
                stlTotals: stlTotal,
                yearTotals: years,
            });
        }
    });
});

// Player Analytics - Advanced
router.get('/:id/advanced', function (req, res) {
    Player.findById(req.params.id, function (err, foundPlayer) {
        if (err) {
            console.log(err);
        } else {
            // SHOOTING
            let fgpct = foundPlayer.season.map(({ fg }) => fg);

            let fga = foundPlayer.yearlyTotals.map(({ fga }) => fga);

            let fgm = foundPlayer.yearlyTotals.map(({ fgm }) => fgm);

            let tppct = foundPlayer.season.map(({ tp }) => tp);

            let tpa = foundPlayer.yearlyTotals.map(({ tpa }) => tpa);

            let tpm = foundPlayer.yearlyTotals.map(({ tpm }) => tpm);

            let ftpct = foundPlayer.season.map(({ ft }) => ft);

            // True Shoot %
            let comboShooting = fgpct.map(function (n, i) {
                return n + tppct[i];
            });

            let allShooter = ftpct.map(function (n, i) {
                return n + comboShooting[i];
            });

            let ts = [];

            // Need to update TS with two point percentages, not fg
            for (var i = 0, length = allShooter.length; i < length; i++) {
                ts[i] = allShooter[i] / 3;
            }

            // Effective FG%
            let tpHalf = tpm;

            for (i = 0; i < tpm.length; i++) {
                tpm[i] = tpm[i] / 2;
            }

            let eFgTemp = tpHalf.map(function (n, i) {
                return n + fgm[i];
            });

            let efg = eFgTemp.map(function (n, i) {
                return n / fga[i];
            });

            // 3 Point Attempt Rate
            let tpAttRate = tpa.map(function (n, i) {
                return n / fga[i];
            });

            // Assist to Turnover Ratio
            let astTotal = foundPlayer.yearlyTotals.map(({ ast }) => ast);

            let toTotal = foundPlayer.yearlyTotals.map(({ to }) => to);

            let ato = astTotal.map(function (n, i) {
                return n / toTotal[i];
            });

            // Years at School (e.g. Freshman, Sophomore)
            let years = foundPlayer.season.map(({ grade }) => grade);

            res.render('players/advanced', {
                player: foundPlayer,
                ts: ts,
                efg: efg,
                tpar: tpAttRate,
                atoRatio: ato,
                yearTotals: years,
            });
        }
    });
});

// Player Analytics - Game Logs
router.get('/:id/games', function (req, res) {
    Player.findById(req.params.id, function (err, foundPlayer) {
        if (err) {
            console.log(err);
            return res.redirect('back');
        } else {
            // Function to count the occurrences of given value
            const countOccurrences = (arr, val) =>
                arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

            // ***** Overall Record ***** //
            // Get array of total W's & L's
            let record = foundPlayer.gameLog.map(({ result }) => result);

            // Count total Wins
            let wins = countOccurrences(record, 'W');

            // Count total losses
            let losses = countOccurrences(record, 'L');

            // ***** Home Record ***** //
            // Get games played at home
            let home = foundPlayer.gameLog.filter((obj) => {
                return obj.location === 'Home';
            });

            let homeRecord = home.map(({ result }) => result);

            let homeWins = countOccurrences(homeRecord, 'W');

            let homeLosses = countOccurrences(homeRecord, 'L');

            // ***** Neutral Record ***** //
            // Get games played at neutral site
            let neutral = foundPlayer.gameLog.filter((obj) => {
                return obj.location === 'Neutral';
            });

            let neutralRecord = neutral.map(({ result }) => result);

            let neutralWins = countOccurrences(neutralRecord, 'W');

            let neutralLosses = countOccurrences(neutralRecord, 'L');

            // ***** Away Record ***** //
            let away = foundPlayer.gameLog.filter((obj) => {
                return obj.location === 'Away';
            });

            let awayRecord = away.map(({ result }) => result);

            let awayWins = countOccurrences(awayRecord, 'W');

            let awayLosses = countOccurrences(awayRecord, 'L');

            // ***** NCAA Tourney Record ***** //
            let ncaa = foundPlayer.gameLog.filter((obj) => {
                return obj.gameType === 'NCAA';
            });

            let ncaaTourn = ncaa.map(({ result }) => result);

            let ncaaWins = countOccurrences(ncaaTourn, 'W');

            let ncaaLosses = countOccurrences(ncaaTourn, 'L');

            // ***** Career High: Points ***** //
            let careerPTS = Math.max(
                ...foundPlayer.gameLog.map(({ pts }) => pts)
            );

            // Career High: Assists
            let careerAST = Math.max(
                ...foundPlayer.gameLog.map(({ ast }) => ast)
            );

            // Career High: Rebounds
            let dRebTotal = foundPlayer.gameLog.map(({ drb }) => drb);

            let oRebTotal = foundPlayer.gameLog.map(({ orb }) => orb);

            let careerREB = Math.max(
                ...dRebTotal.map(function (n, i) {
                    return n + oRebTotal[i];
                })
            );

            res.render('players/games', {
                player: foundPlayer,
                wins: wins,
                losses: losses,
                hWins: homeWins,
                hLosses: homeLosses,
                aWins: awayWins,
                aLosses: awayLosses,
                nWins: neutralWins,
                nLosses: neutralLosses,
                ncaaWins: ncaaWins,
                ncaaLosses: ncaaLosses,
                careerPTS: careerPTS,
                careerAST: careerAST,
                careerREB: careerREB,
            });
        }
    });
});

// Player Analytics - Conference Play
router.get('/:id/games/conference', function (req, res) {
    Player.findById(req.params.id, function (err, foundPlayer) {
        if (err) {
            console.log(err);
            return res.redirect('back');
        } else {
            // Function to count the occurrences of given value
            const countOccurrences = (arr, val) =>
                arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

            // Refer to Games route for detailed explanation on below
            // ***** Conference Record *****//
            let conf = foundPlayer.gameLog.filter((obj) => {
                return obj.gameType === 'REG - CONF';
            });

            let confRecord = conf.map(({ result }) => result);

            let confWins = countOccurrences(confRecord, 'W');

            let confLosses = countOccurrences(confRecord, 'L');

            // ***** Conference Record: Home ***** //
            let confHome = conf.filter((obj) => {
                return obj.location === 'Home';
            });

            let confHomeRecord = confHome.map(({ result }) => result);

            let confHomeWins = countOccurrences(confHomeRecord, 'W');

            let confHomeLosses = countOccurrences(confHomeRecord, 'L');

            // ***** Conference Record: Home ***** //
            let confAway = conf.filter((obj) => {
                return obj.location === 'Away';
            });

            let confAwayRecord = confAway.map(({ result }) => result);

            let confAwayWins = countOccurrences(confAwayRecord, 'W');

            let confAwayLosses = countOccurrences(confAwayRecord, 'L');

            // ***** Conference Tourney Record ***** //
            let tourney = foundPlayer.gameLog.filter((obj) => {
                return obj.gameType === 'CTOURN';
            });

            let tourneyRecord = tourney.map(({ result }) => result);

            let tourneyWins = countOccurrences(tourneyRecord, 'W');

            let tourneyLosses = countOccurrences(tourneyRecord, 'L');

            console.log(conf.map(({ season }) => season));

            res.render('players/conference', {
                player: foundPlayer,
                conf: conf,
                cWins: confWins,
                cLosses: confLosses,
                cHomeWins: confHomeWins,
                cHomeLosses: confHomeLosses,
                cAwayWins: confAwayWins,
                cAwayLosses: confAwayLosses,
                tWins: tourneyWins,
                tLosses: tourneyLosses,
            });
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports = router;
