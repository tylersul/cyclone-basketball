const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');

// Passport configuration function
const configurePassport = (app) => {
    // Initialize passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Configure local strategy
    passport.use(new LocalStrategy(User.authenticate()));
    
    // Serialize user for the session
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    // Middleware to set current user and flash messages
    app.use((req, res, next) => {
        res.locals.currentUser = req.user;
        res.locals.error = req.flash('error');
        res.locals.success = req.flash('success');
        next();
    });
};

module.exports = configurePassport;
