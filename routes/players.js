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
        Player.find({}, function(err, allPlayers){
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

// SHOW - shows more info about one campground
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

            let pointTotal = foundPlayer.yearlyTotals.map(({
                pts}) => pts);

            let years = foundPlayer.season.map(({
                grade}) => grade);
                console.log("Years: " + years)
            //let yearTotal = [...years.values()];

            //render show template with that campground
            res.render("players/show", {player: foundPlayer, pointAvgs: pointAvg, astAvgs: astAvg, pointTotals: pointTotal, 
                                        yearTotals: years });
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

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;