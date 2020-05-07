// ================================================================== //
// ====================== Variable Instantiation ==================== //
// ================================================================== //
let express    = require("express");
    router     = express.Router();
    Player     = require("../models/player");
    middleware = require("../middleware") //don't need to add index.js because it's auto included


// ================================================================== //
// ====================== Routes ==================================== //
// ================================================================== //
router.get("/seasons", function(req, res){
    if(req.query.search){
        escapeRegex(req.query.search);
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Player.find({"season.year" : regex}, function(err, allPlayers){
            if(err){
                console.log(err);
            } else {
                if(allPlayers.length < 1) {
                    return res.render("seasons/index", {players: allPlayers, "error": "No match! Please try again!"});
                }
                res.render("seasons/index",{players: allPlayers, currentUser: req.user});
            }
        });
    } else {
        // Get all players from DB
        Player.find({}, function(err, allPlayers){
            if(err){
                console.log(err);
            } else {
                res.render("seasons/index",{players:allPlayers, currentUser: req.user});
            }
        });
    }
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// ================================================================== //
// ====================== Exports =================================== //
// ================================================================== //

// Export seasons routes for use within application 
module.exports = router;
