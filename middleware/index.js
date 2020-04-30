// All middleware for web app

var Player           = require("../models/player");
var Comment          = require("../models/comment");
var middlewareObject = {};

middlewareObject.checkPlayerOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Player.findById(req.params.id, function(err, foundPlayer){
            if(err || !foundPlayer){
                req.flash("error", "Could not find requested player.");
                res.redirect("back");
            } else {
                if(foundPlayer.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "Permission denied.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login.");
        res.redirect("back");
    }
}

middlewareObject.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "That comment does not exist.");
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "Permission denied.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObject.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    req.flash("error", "Please login.");
    res.redirect("/login");
}


// Export middlewareObject with the three available functions from above
// Can also export each one individually as module.exports.checkPlayeronwership = checkPlayerOwnership
module.exports = middlewareObject;