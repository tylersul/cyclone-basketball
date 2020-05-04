// ================================================================== //
// ====================== Variable Instantiation ==================== //
// ================================================================== //

let express    = require("express"),              // ExpressJS module 'Express' for Node web framework
    router     = express.Router(),
    passport   = require("passport"),
    middleware = require("../middleware"),
    Player     = require("../models/player")
    User       = require("../models/user");



// ================================================================== //
// ====================== Routes ==================================== //
// ================================================================== //
// Need to implement access control
router.get("/admin", middleware.isLoggedIn, function(req, res){
    User.count(function(err, userCount) {
        if (err) {
            console.log(err)
        } else {
            console.log(req.user);
            res.render("admin/admin", {count: userCount});
        }
    });
});


router.get("/admin/users", middleware.isLoggedIn, function(req, res){
    User.find({}, function(err, allUsers){
        if(err){
            console.log(err);
        } else {
            res.render("admin/users", {users: allUsers});
        }
    });
});


router.get("/admin/players", middleware.isLoggedIn, function(req, res){
    Player.find({}, function(err, allPlayers){
        if(err){
            console.log(err);
        } else {
            res.render("admin/players", {players:allPlayers});
            console.log(allPlayers);
        }
    });
});


// ================================================================== //
// ====================== Exports =================================== //
// ================================================================== //

// Export index routes for use within application 
module.exports = router;