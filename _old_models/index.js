module.exports.open = function(callback) {

    var d = require('./noogle_db');
    d.open(function(err, db) {
        var pa = require('./page_aggs');
        pa.open(err, db,
        function() {

            var li = require('./links');
            li.open(err, db,
            function() {
                var ln = require('./lines');
                ln.open(err, db,
                function() {
                    var pg = require('./pages');
                    pg.open(err, db, callback);
                });
            });

        });
    });

}
