require('./../context');
var fs = require('fs');

var page_model = require('models/pages');

page_model.model(function(err, model) {
    model.get('4d6079b7ccf4d1e36e000002',
    function(err, page) {

        console.log(page);
        model.reindex(page);
    })
});