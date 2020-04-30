// ================================================================== //
// ====================== Variable Instantiation ==================== //
// ================================================================== //

var express    = require("express");              // ExpressJS module 'Express' for Node web framework
var router     = express.Router();
var passport   = require("passport");
var async      = require("async");
var nodemailer = require("nodemailer");
var crypto     = require("crypto");
var https      = require("https");
var User       = require("../models/user");
var Player     = require("../models/player");


// ================================================================== //
// ====================== Routes ==================================== //
// ================================================================== //
// Routing referes to determining how an app responds to a client request to a particular
//    endpoint.  Each route can have one or more handler functions.

// Route definition takes the following structure: app.METHOD(PATH, HANDLER)
// app: instance of Express, in this file instance is 'router'
// method: HTTP request method in lowercase
// path: path on the server 
// handler: function executed when the route is matched

// The below routes use the full path, as opposed to the routes being shortened in the app file

/* ~~~~~~~~~~ Landing & Home Page ~~~~~~~~~~ */
router.get("/", function(req, res){
    res.render("index/landing");
});

// Home Page
router.get("/home", function(req, res){
    res.render("index/home");
});



/* ~~~~~~~~~~ Register ~~~~~~~~~~ */
router.get("/register", function(req, res){
    res.render("index/register");
});

router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username, 
        firstName: req.body.firstName, 
        lastName: req.body.lastName, 
        avatar: req.body.avatar,
        email: req.body.email
    });

    if(req.body.adminCode === "cycl0nesf0r3v3r"){
        newUser.isAdmin = true;
    }

    User.register(newUser, req.body.password, function(err, User){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Account successfully created.");
            res.redirect("/players");
        });
    });
});


/* ~~~~~~~~~~ Login ~~~~~~~~~~ */
router.get("/login", function(req, res){
    res.render("index/login");
});

// app.post, middleware, callback
// middleware calls auth method from above "User.auth"
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/players",
        failureRedirect: "/login"
    }), function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have successfully logged out.");
    res.redirect("/players");
});


/* ~~~~~~~~~~ Password Reset ~~~~~~~~~~ */
router.get("/passwordreset", function(req, res){
    res.render("index/passwordreset");
});

router.post("/passwordreset", function(req, res, next){
    async.waterfall([
        function(done){
            crypto.randomBytes(20, function(err, buf){
                var token = buf.toString("hex");
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({email: req.body.email}, function(err, user) {
                if(!user){
                    req.flash('error', "No account with that email address exists.");
                    return res.redirect("/passwordreset");
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;
                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.PWDRESETUSER,
                    pass: process.env.GMAILPW                   //String password
                }
            });
            var mailOptions = {
                to: user.email,
                from: "Cyclone Analytics,
                subject: "Cyclone Analytics Password Reset",
                text: "You are receiving this message because you (or someone else) request a password reset for youir account\n" +
                "Please click the link below, or paste it into your browser, to reset your password:\n" +
                "http://" + req.headers.host + "/reset/" + token + "\n" +
                "If you did not request this change, please ignore this email."
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                console.log("Email sent");
                req.flash("success", "An email has been sent to " + user.email + " with further instructions.");
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect("/passwordreset");
    });
});

router.get("/reset/:token", function(req, res){
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, User){
        if(!User) {
            req.flash("error", "Password reset token is invalid or has expired.");
            return res.redirect("/passwordreset");
        }
        res.render("index/passwordchange", {token: req.params.token});
    });
});

router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: process.env.PWDRESETUSER,
            pass: process.env.GMAILPW                   //String password
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'learntocodeinfo@mail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/home');
    });
});


/* ~~~~~~~~~~ User profiles ~~~~~~~~~~ */
router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "The user does not exist.");
            return res.redirect("/players");
        } 
        res.render("users/show", {user: foundUser});
    });
});




// ================================================================== //
// ====================== Exports =================================== //
// ================================================================== //

// Export index routes for use within application 
module.exports = router;

