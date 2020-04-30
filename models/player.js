var mongoose = require("mongoose");

var playerSchema = new mongoose.Schema({
   name: String,
   image: String,
   position: String,
   description: String,
   height_feet: Number,
   height_inches: Number,
   weight: Number,
   dob: Date,
   hometown: String,
   country: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         // An array of comment IDs
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Player", playerSchema);