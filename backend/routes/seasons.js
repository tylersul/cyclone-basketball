// ================================================================== //
// ====================== Variable Instantiation ==================== //
// ================================================================== //
let express = require('express'),
    router = express.Router(),
    Season = require('../src/models/season'),
    middleware = require('../middleware'); //don't need to add index.js because it's auto included

// ================================================================== //
// ====================== Routes ==================================== //
// ================================================================== //
router.get('/seasons', function (req, res) {
    if (req.query.search) {
        escapeRegex(req.query.search);
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Season.find({ 'season.year': regex }, function (err, allSeasons) {
            if (err) {
                console.log(err);
            } else {
                if (allSeasons.length < 1) {
                    return res.render('seasons/index', {
                        seasons: allSeasons,
                        error: 'No match! Please try again!',
                    });
                }
                res.render('seasons/index', {
                    seasons: allSeasons,
                    currentUser: req.user,
                });
            }
        });
    } else {
        // Get all players from DB
        Season.find({}, function (err, allSeasons) {
            if (err) {
                console.log(err);
            } else {
                res.render('seasons/index', {
                    seasons: allSeasons,
                    currentUser: req.user,
                });
            }
        });
    }
});

router.post('/seasons', middleware.isLoggedIn, function (req, res) {
    // get data from form and add to campgrounds array
    let year = req.body.year,
        image = req.body.image,
        head = req.body.headCoach,
        wins = req.body.wins,
        losses = req.body.losses,
        conf = req.body.conf,
        confWins = req.body.confWins,
        confLosses = req.body.confLosses,
        rank = req.body.confRank,
        desc = req.body.description,
        author = {
            id: req.user._id,
            username: req.user.username,
        };

    let newSeason = {
        year: year,
        image: image,
        headCoach: head,
        wins: wins,
        losses: losses,
        conf: conf,
        confWins: confWins,
        confLosses: confLosses,
        confRank: rank,
        description: desc,
        author: author,
    };

    // Create a new team and save to Mongo
    Season.create(newSeason, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            // Redirect back to seasons page
            console.log(newlyCreated);
            res.redirect('/seasons');
        }
    });
});

router.get('/seasons/new', middleware.isLoggedIn, function (req, res) {
    res.render('seasons/new');
});

// SHOW - shows more info about one campground
router.get('/seasons/:id', function (req, res) {
    //find the campground with provided ID
    Season.findById(req.params.id)
        .populate('comments')
        .exec(function (err, foundSeason) {
            if (err) {
                console.log(err);
            } else {
                console.log(foundSeason);
                //render show template with that campground
                res.render('seasons/show', { season: foundSeason });
            }
        });
});

// EDIT Season
router.get(
    '/seasons/:id/edit',
    middleware.checkSeasonOwnership,
    function (req, res) {
        Season.findById(req.params.id, function (err, foundSeason) {
            res.render('seasons/edit', { season: foundSeason });
        });
    }
);

// UPDATE Season
router.put(
    '/seasons/:id',
    middleware.checkSeasonOwnership,
    function (req, res) {
        console.log(req.body);
        Season.findByIdAndUpdate(
            req.params.id,
            req.body.season,
            function (err, updatedSeason) {
                if (err) {
                    res.redirect('/seasons');
                } else {
                    res.redirect('/seasons/' + req.params.id);
                }
            }
        );
    }
);

// DESTROY Season
router.delete(
    '/seasons/:id',
    middleware.checkSeasonOwnership,
    function (req, res) {
        Season.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                res.redirect('/seasons');
            } else {
                res.redirect('/seasons');
            }
        });
    }
);

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// ================================================================== //
// ====================== Exports =================================== //
// ================================================================== //

// Export seasons routes for use within application
module.exports = router;
