// not an independent repo at this time ... should be?
var mongoose = require('mongoose/lib/mongoose');
//var comment_module = require('./comments');
module.exports = {
    schema: function() {
        console.log(__filename + ':: getting schema from Mongoose');
        var Schema = mongoose.Schema;
        return new Schema({
            id: Number,
            name: String,
            content: String
        });
    }
}