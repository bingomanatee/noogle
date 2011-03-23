require('./../context');

var page_model = require('models/pages');

page_model.model(function(err, model) {

    model.put({
        "name": "IRC log index",
        "url": "http://nodejs.debuggable.com/",
        "type": "index"
    },

    function(err, insert) {
    model.put({
        "name": "Node Documentation",
        "url": "http://nodejs.org/docs/v0.4.0/api/index.html"
    })
});
});