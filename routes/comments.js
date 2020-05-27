// ================================================================== //
// ====================== Variable Instantiation ==================== //
// ================================================================== //
let express    = require("express"),
    router     = express.Router(),
    Player     = require("../models/player"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware"); //don't need to add index.js because it's auto included

// ================================================================== //
// ====================== Routes ==================================== //
// ================================================================== //
// <--------------------- Players ----------------------------------> //
router.get("/players/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Player.findById(req.params.id, function(err, player){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {player: player});
        }
    });
});

router.post("/players/:id/comments", middleware.isLoggedIn, function(req, res){
    // lookup player using ID
    Player.findById(req.params.id, function(err, player){
        if(err){
            console.log(err);
            res.redirect("/players");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //add username & id 
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Create new comment
                    comment.save();
                    // Connet new comment to player
                    player.comments.push(comment);
                    player.save();
                    req.flash("success", "Comment added.");
                    // Redirect to player show page
                    res.redirect("/players/" + player._id);
                }
            })
        }
    });
});

// COMMENT - Like Route
router.post("/players/:id/comments/:comment_id/like", middleware.isLoggedIn, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            console.log(err);
            return res.redirect("/players");
        }
        // check if req.user._id exists in foundComment.likes
        var foundUserLike = foundComment.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundComment.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundComment.likes.push(req.user);
        }

        foundComment.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/players");
            }
            return res.redirect("/players/" + req.params.id);
        });
    });
});


// Edit comments
router.get("/players/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {player_id: req.params.id, comment: foundComment});
        }
    })
});

// Update comments
router.put("/players/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err){
            res.redirect("back");
        } else {
            res.redirect("/players/" + req.params.id);
        }
    })
});

// DESTROY comments
router.delete("/players/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted.");
            res.redirect("/players/" + req.params.id);
        }
    })
});


// <--------------------- Seasons ----------------------------------> //
router.get("/seasons/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Season.findById(req.params.id, function(err, foundSeason){
        if(err){
            console.log(err);
        } else {
            res.render("comments/newSeason", {season: foundSeason});
        }
    });
});

router.post("/seasons/:id/comments", middleware.isLoggedIn, function(req, res){
    // lookup player using ID
    Season.findById(req.params.id, function(err, season){
        if(err){
            console.log(err);
            res.redirect("/seasons");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //add username & id 
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Create new comment
                    comment.save();
                    // Connet new comment to player
                    season.comments.push(comment);
                    season.save();
                    req.flash("success", "Comment added.");
                    // Redirect to player show page
                    res.redirect("/seasons/" + season._id);
                }
            })
        }
    });
});

// Edit comments
router.get("/players/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {player_id: req.params.id, comment: foundComment});
        }
    })
});

// Update comments
router.put("/players/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err){
            res.redirect("back");
        } else {
            res.redirect("/players/" + req.params.id);
        }
    })
});

// DESTROY comments
router.delete("/players/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted.");
            res.redirect("/players/" + req.params.id);
        }
    })
});
// ================================================================== //
// ====================== Exports =================================== //
// ================================================================== //
// Export Comment routes for use within application

module.exports = router;