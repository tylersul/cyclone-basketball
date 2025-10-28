var mongoose = require('mongoose');
var Player = require('./app/models/player');
var Comment = require('./app/models/comment');

// See data for 3 separate players, input into the DB at app startup
var data = [
    {
        name: 'Tyler Sullivan',
        image: 'https://fadeawayworld.net/wp-content/uploads/2020/04/mj-yaco.jpg',
        position: 'SG',
        description: 'blah blah blah',
    },
    {
        name: 'Emma Filipow',
        image: 'https://i.pinimg.com/originals/0b/07/e3/0b07e3be3d10e4ba9ba915c71da5d592.jpg',
        position: 'PG',
        description: 'blah blah blah',
    },
    {
        name: 'The Franchise',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Big_12_Championship_-_Georges_Niang.jpg/220px-Big_12_Championship_-_Georges_Niang.jpg',
        position: 'The Franchise',
        description: 'blah blah blah',
    },
];

function seedDB() {
    //Remove all campgrounds
    Player.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('removed players!');
        //add a few players
        data.forEach(function (seed) {
            Player.create(seed, function (err, player) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Added a player.');
                    //create a comment
                    Comment.create(
                        {
                            text: 'This player was great, but I wish we won a championship',
                            author: 'Homer',
                        },
                        function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                player.comments.push(comment);
                                player.save();
                                console.log('Created new comment.');
                            }
                        }
                    );
                }
            });
        });
    });
    //add a few comments
}

// Export seedDB function
module.exports = seedDB;
