require('./../../context');

var nm = require('models/nicks');

nm.model(function(err, model) {
    if (err) throw err;
    
    model.sims_for('bingomanatee',
        function(err, nick) {
            console.log('nicks like bingomanatee');
            console.log(nick);
        });
    
}) // end model
