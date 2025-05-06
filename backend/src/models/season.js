var mongoose = require('mongoose');

var seasonSchema = new mongoose.Schema({
    year: String,
    image: String,
    headCoach: String,
    wins: Number,
    losses: Number,
    conf: String,
    confWins: Number,
    confLosses: Number,
    confRank: Number,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        username: String,
    },
    comments: [
        {
            // An array of comment IDs
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
});

module.exports = mongoose.model('Season', seasonSchema);
