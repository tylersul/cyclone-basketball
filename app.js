// ================================================================== //
// ====================== Variable Instantiation ==================== //
// ================================================================== //

// NodeJS provides the 'require' function whose job is to load modules 
//   and grant access to their exports 
const express        = require("express"),           // ExpressJS module 'Express' for Node web framework                        
      app            = express(),                    // Create a new instance of Express as App
      bodyParser     = require("body-parser"),       // Middleware to handle HTTP POST requests in Express, exposes body of request as req.body for easier interface  
      mongoose       = require("mongoose"),          // Object modeling with validation to abstract MongoDB from app with data schemas
      flash          = require("connect-flash"),     // Middleware for storing messages displayed to user, done in combo w/ redirects
      session        = require("express-session"),   // Allows each user of site to be assigned a unique session to store user state
      passport       = require("passport"),          // Authentication middleware for Node with various login types, we're using Local
      moment         = require("moment"),            // Dynamic times in Javascript
      LocalStrategy  = require("passport-local"),    // Passport strategy for authenticating w/ username and password
      methodOverride = require("method-override"),   // Middleware for requests from clients that only support simple HTTP verbs like GET & POST
      Player         = require("./models/player"),   // Import custom 'player' model for use in Mongoose
      Comment        = require("./models/comment"),  // Import custom 'comment' model for use in Mongoose
      User           = require("./models/user"),     // Import custom 'user' model for use in Mongoose
      seedDB         = require("./seeds");           // Import seeDB custom function to fill empty MongoDB with test data
      port           = process.env.PORT;             // Set Port exposed constant to 3000 for localhost 
                         

const commentRoutes  = require("./routes/comments"), // These  three lines import routes from the 
      playerRoutes   = require("./routes/players"),  //   separate directory to make the code more 
      indexRoutes    = require("./routes/index"),    //   modular and scale easier as more are added
      footerRoutes   = require("./routes/footer"),
      seasonRoutes   = require("./routes/seasons"),
      adminRoutes    = require("./routes/admin");
    
                       require('dotenv').config();   // Environment variables

// ================================================================== //
// ====================== Backend Connection ======================== //
// ================================================================== //
// Local Mongo Instance Connection - configued in env file

// MongoDB Atlas Connection for Cloud-based app
// MongoDB Atlas Connection instead with Environment Variables for added security
// Env Variable set within Atlas, but can be set for local connection as well
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true});


// ================================================================== //
// ====================== Middleware ================================ //
// ================================================================== //
// App.Use loads a function to be used as middleware
// Express understands functions as middleware with the following signature:
//    function(request, response, next) {}

// MW for parsing bodies from URL that only looks at requests where Content-Type header matches type option
// Available for use in req.body and stored as key-value pairs
// Extended option allows for POST of nested objectsd
app.use(bodyParser.urlencoded({extended: true}));

// Views directory in app is where template files are located 
// View engine is template to use & after being set, don't have to specify the engine
// Set the View Engine to EJS, allows removal of .ejs file extension references in application
app.set("view engine", "ejs");

// Express.Static middleware function that serves static files in Express
// Adding dynamic directory name and public for CSS stylesheets and images
// Serves all files inside of 'public' directory to '/' directory
app.use(express.static(__dirname + "/public"));

// Allows usage of HTTP verbs such as PUT or DELETE where client doesn't support it
// Overriding using a query value, e.g. a delete html form will have ?_method=DELETE appended to the action
//  which in turn overrides the typical POST to a DELETE method 
app.use(methodOverride("_method"));

// Use imported connect-flash middleware for success and error messages presented to user
app.use(flash());

// Seed the test MongoDB with example data by calling seeDB function imported from file
//seedDB();

// Add MomentJS for time-based content
app.locals.moment = require("moment");

// ~~~ Express Session Config ~~~ //
// Requiring express-session module here rather than in the instantiation up top, will change later
// By default, Express requests are sequential and no request can be linked to each other
//   No way to know if req comes from client that already performed it previously
// Sessions allow users to be identified with unique sessions and store user state
app.use(session({
    secret: "Franchise is the best.",       // Secret is only required param that is a unique string for app
    resave: false,                          // Forces the session to be saved back to session store, but not with false
    saveUninitialized: false                // Forces a session that is uninitialized to be save to store, not with false
}));

// ~~~ Passport Config ~~~ //
// Initialize passport authentication module allowing auth strategies to be applied
app.use(passport.initialize());

// Used for persistent login sessions
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for determining if a user is logged in
// req.user comes from passport with login  details
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});


// ~~~ Route Files ~~~ ///
app.use(indexRoutes);
app.use("/players", playerRoutes);  // appends /players in front of all player routes to DRY code
app.use(seasonRoutes);
app.use(commentRoutes);
app.use(footerRoutes);
app.use(adminRoutes);



// 404 Redirects - this is in progress
app.get("*", function (req, res) {
    res.send("What???", 404);
});

// ================================================================== //
// ====================== Listeners ================================= //
// ================================================================== //
// Localhost listener using Port constant defined above
//app.listen(port, () => console.log(`HTML app listening at http://localhost:${port}`));

// Dynamic listener that utilizes environment variables for port and IP details
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Has Started!");
 });