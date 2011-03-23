require('./../context');

var nicks = require('models/nicks');

nicks.model(function(err, model) {
    if (err) throw err;
    model.load_nicks( function() {
        console.log('done loading nicks');
        model.config.db.close();
    })
});