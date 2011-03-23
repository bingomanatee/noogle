var fu = require('./file_utils');

var d = require('./../model/noogle_db');
d.open(function(err, db) {
    var li = require('./../model/links');
    li.open(err, db,
    function() {
        var ln = require('./../model/lines');
        ln.open(err, db,
        function() {
            var pg = require('./../model/pages');
            pg.open(err, db,
            function() {
                var pa = require('./../model/page_aggs');
                pa.open(err, db,
                function() {
                    fu.index_url('http://nodejs.debuggable.com/',
                    function(err, data) {
                        console.log('------------- END OF THE RAINBOW --------------- ');
                    });
                });
            });
        });
    });
});