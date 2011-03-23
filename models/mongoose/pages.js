var index = require('./index');
var mongoose = require('mongoose/lib/mongoose');
var comment_module = require('./comments');
var section_module = require('./sections');

module.exports = {
    model: function(return_new) {
        index.init();

        if (!module.exports._page_model) {
            var Schema = mongoose.Schema,
            ObjectId = Schema.ObjectId;
            console.log('section module: ');
            console.log(section_module);
            
            var Section_schema = new Schema({
                id: Number,
                name: String,
                content: String
            });
            var Page_schema = new Schema({
                url: String,
                name: String,
                type: String,
                sections: [Section_schema]
            });
            
            console.log('Page Schema:');
            console.log(Page_schema);
            mongoose.model('Pages', Page_schema);
            module.exports._page_model = mongoose.model('Pages');
        }
        return return_new ? new module.exports._page_model() : module.exports._page_model;
    },
    _page_model: false
}