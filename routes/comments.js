let express    = require("express"),
    router     = express.Router(),
    Player     = require("../models/player"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware"); //don't need to add index.js because it's auto included

// =======================================
// COMMENTS ROUTES =======================
// =======================================
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

module.exports = router;