require('./../../context');

var nm = require('models/nicks');

nm.model(function(err, model) {

    model.get_nick('bingomanatee',
    function(err, nick) {
        model.update_nick_line_count(nick,
        function() {
            console.log('done updating nick');
            console.log(nick);
        });

    }) // end get_nick
    
}) // end model
