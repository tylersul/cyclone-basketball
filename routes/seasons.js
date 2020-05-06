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
    // Get all players from DB
    Player.find({}, function(err, allPlayers){
        if(err){
            console.log(err);
        } else {
            res.render("seasons/index", {players: allPlayers, currentUser: req.user});
        }
    });
})


// ================================================================== //
// ====================== Exports =================================== //
// ================================================================== //

// Export seasons routes for use within application 
module.exports = router;
