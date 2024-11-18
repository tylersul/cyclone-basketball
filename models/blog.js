// ================================================================== //
// ====================== Variable Instantiation ==================== //
// ================================================================== //
let mongoose = require('mongoose');

// ================================================================== //
// ====================== Schema Definition ========================= //
// ================================================================== //
let blogSchema = new mongoose.Schema(
    {
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            username: String,
        },
        title: String,
        subheader: String,
        headerImage: String,
        content: String,
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
    },
    {
        timestamps: true,
    }
);

// ================================================================== //
// ====================== Exports =================================== //
// ================================================================== //
module.exports = mongoose.model('Blog', blogSchema);
