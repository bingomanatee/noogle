var index = require('./index');
var mongoose = require('mongoose/lib/mongoose');
            var Schema =  mongoose.Schema,
            ObjectId = Schema.ObjectId;

module.exports = {
    Schema:  new Schema({
                title: String,
                body: String,
                author: String,
                date: Date,
                page: ObjectId,
                section: Number
            }),
    
    model: function(return_new) {

        index.init();

        if (!module.exports._comment_model) {
    
            var Comment_schema = module.exports.Schema;
            
            console.log('Comment Schema:');
            console.log(Comment_schema);
            mongoose.model('Comments', Comment_schema);
            module.exports._comment_model = mongoose.model('Comments');
        }
        return return_new ? new module.exports._comment_model() : module.exports._comment_model;
    },
    _comment_model: false
}