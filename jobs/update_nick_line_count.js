require('./../context');

var nm = require('models/nicks');

nm.model(function(err, model) {
        model.update_all_line_counts(
        function() {
            console.log('done updating nick line counts');
    }) // end get_nick
    
}) // end model
