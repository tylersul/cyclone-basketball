// ================================================================== //
// ====================== Variable Instantiation ==================== //
// ================================================================== //

var mongoose              = require("mongoose");                    // Require Mongoose for Schema creation
var passportLocalMongoose = require("passport-local-mongoose");     // Local Authentication to plugin to Mongoose


// ================================================================== //
// ====================== Schema Definition ========================= //
// ================================================================== //
// In Mongoose, everything is derived from a Schema  

// Create new userSchema with two String properties that will be used as authentication mechanisms
userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    email: {
        type: String,
        unique: true 
    },
    avatar: String,
    firstName: String,
    lastName: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {
        type: Boolean,
        default: false
    }
});


// ================================================================== //
// ====================== Plugins =================================== //
// ================================================================== //

// Plugin Passport-Local-Mongoose to userSchema that adds a username, hash, and salt field to
//   store the username, hashed pwd, and salt value
userSchema.plugin(passportLocalMongoose);


// ================================================================== //
// ====================== Exports =================================== //
// ================================================================== //
// Models are constructors compiled from Schema definitions (above)
// Can have multiple modles with the same schema 
//  To create or get documents from DB, need to use model

// Export model for use in other files within app
module.exports = mongoose.model("User", userSchema);