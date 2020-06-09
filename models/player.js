// ================================================================== //
// ====================== Variable Instantiation ==================== //
// ================================================================== //
let mongoose = require("mongoose");

// ================================================================== //
// ====================== Schema Definition ========================= //
// ================================================================== //
let playerSchema = new mongoose.Schema({
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
   season: [
      {
         year: String,
         grade: String,
         gp: Number,
         gs: Number,
         mpg: Number,
         fg: Number,
         tp: Number,
         ft: Number,
         rpg: Number,
         apg: Number,
         spg: Number,
         bpg: Number,
         ppg: Number
      }
   ],
   yearlyTotals: [
      {
         year: String,
         min: Number,
         fga: Number,
         fgm: Number,
         tpa: Number,
         tpm: Number,
         fta: Number,
         ftm: Number,
         orb: Number,
         drb: Number,
         ast: Number,
         stl: Number,
         blk: Number,
         pf: Number,
         to: Number,
         pts: Number,
      }
   ],
   comments: [
      {
         // An array of comment IDs
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

// ================================================================== //
// ====================== Exports =================================== //
// ================================================================== //
module.exports = mongoose.model("Player", playerSchema);