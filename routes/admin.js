// ================================================================== //
// ====================== Variable Instantiation ==================== //
// ================================================================== //

const express    = require("express"),              // ExpressJS module 'Express' for Node web framework
      router     = express.Router(),
      passport   = require("passport"),
      middleware = require("../middleware"),
      Player     = require("../models/player")
      User       = require("../models/user");



// ================================================================== //
// ====================== Routes ==================================== //
// ================================================================== //
// Need to implement access control
router.get("/admin", middleware.isAdmin, (req, res) => {
    User.count((err, userCount) => {
        if (err) {
            console.log(err)
        } else {
            console.log(req.user);
            res.render("admin/admin", {count: userCount});
        }
    });
});


router.get("/admin/users", middleware.isAdmin, (req, res) => {
    User.find({}, (err, allUsers) => {
        if(err){
            console.log(err);
        } else {
            res.render("admin/users", {users: allUsers});
        }
    });
});


router.get("/admin/players", middleware.isAdmin, (req, res) => {
    Player.find({}, (err, allPlayers) => {
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