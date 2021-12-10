// ================================================================== //
// ====================== Variable Instantiation ==================== //
// ================================================================== //

let express    = require("express"),              // ExpressJS module 'Express' for Node web framework
    router     = express.Router(),
//  passport   = require("passport"),             // Not used ATM - will do research
    https      = require("https"),              
    Blog       = require("../models/blog");



// ================================================================== //
// ====================== Routes ==================================== //
// ================================================================== //

/* ~~~~~~~~~~ Newsletter ~~~~~~~~~~ */
router.get("/newsletter", function(req, res){
    res.render("footer/newsletter");
});

// Need to flush out errors on sign up, not displaying any errors ever currently
router.post("/newsletter", function(req, res) {
    var email = req.body.email;

    // Data for MailChimp API
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {}
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url      = process.env.MAILCHIMP  // Combine MC API URL with my main list ID, '8' comes from API key process.env.GMAILPW                   //String password
    const options  = {
        method: "POST",
        auth: process.env.MAILCHIMPAUTH              // Can use anything for username, key for pwd
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode === 200) {
            req.flash("success", "You've been succeessfully subscribed to the Cyclone Analytics newsletter!");
            return res.redirect("/home");
        } else {
            req.flash("error", "There's been an issue with your signup, maybe you're already subscribed!");
            return res.redirect("/home");
        }

        /*response.on("data", function(data){
            console.log(JSON.parse(data));
        });*/
    });

    request.write(jsonData);
    request.end();
});



/* ~~~~~~~~~~ About ~~~~~~~~~~ */
router.get("/about", function(req, res){
    res.render("footer/about");
});

/* ~~~~~~~~~~ Blog ~~~~~~~~~~ */
router.get("/blog", function(req, res){
    if(req.query.search){
        escapeRegex(req.query.search);
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Blog.find({name: regex}, function(err, allBlogs){
            if(err){
                console.log(err);
            } else {
                if(allBlogs.length < 1) {
                    return res.render("footer/blog", {blogs: allBlogs, "error": "No match! Please try again!"});
                }
                res.render("footer/blog",{blogs: allBlogs, currentUser: req.user});
            }
        });
    } else {
        // Get all players from DB
        Blog.find({}).sort('-createdAt').exec(function(err, allBlogs){
            if(err){
                console.log(err);
            } else {
                res.render("footer/blog",{blogs: allBlogs, currentUser: req.user});
            }
        });
    }
});

// Blog - Create New
router.post("/blog", function(req, res) {
    let title       = req.body.title,
        subheader   = req.body.subheader,
        headerImage = req.body.headerImage,
        content     = req.body.content,
        author      = {
        id: req.user._id,
        username: req.user.username
        };

    let newBlog = {title: title, subheader, subheader, headerImage: headerImage, content: content, author: author};

    Blog.create(newBlog, function(err, createdBlog) {
        if (err) {
            console.log(err)
        } else {
            console.log(createdBlog);
            res.redirect("/blog");
        }
    });
});


// Blog - View Create New Blog Form
router.get("/blog/new", function(req, res){
    res.render("footer/newBlog");
})

// Blog - Show requested blog
router.get("/blog/:id", function(req, res) {
    recentBlogs = Blog.find({}).sort('-createdAt').limit(3);
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            Blog.find({}).sort('-createdAt').limit(3).exec(function(err, recentBlog) {
                if (err) {
                    console.log(err);
                } else {
                    // Render show template with requested blog
                    res.render("footer/show", {blog: foundBlog, recent: recentBlog, currentUser: req.user});
                }
            });
        }
    });
});

// Blog - Edit requested blog
router.get("/blog/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        res.render("footer/edit", {blog: foundBlog});
    });
});


// Blog - Update requested blog
router.put("/blog/:id", function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if (err) {
            console.log(err);
            res.redirect("/blog");
        } else {
            res.redirect("/blog/" + req.params.id);
        }
    });
});

// Blog - Delete requested Blog
router.delete("/blog/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
            res.redirect("/blog");
        } else {
            res.redirect("/blog");
        }
    })
})
// ================================================================== //
// ====================== Exports =================================== //
// ================================================================== //

// Export index routes for use within application 
module.exports = router;
