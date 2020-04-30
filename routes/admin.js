// ================================================================== //
// ====================== Variable Instantiation ==================== //
// ================================================================== //

let express    = require("express"),              // ExpressJS module 'Express' for Node web framework
    router     = express.Router(),
    passport   = require("passport"),
    User       = require("../models/user");



// ================================================================== //
// ====================== Routes ==================================== //
// ================================================================== //
// Need to implement access control
router.get("/admin", function(req, res){
    User.count(function(err, userCount) {
        if (err) {
            console.log(err)
        } else {
            console.log(userCount);
            res.render("admin/admin", {count: userCount});
        }
    });
});


// ================================================================== //
// ====================== Exports =================================== //
// ================================================================== //

// Export index routes for use within application 
module.exports = router;