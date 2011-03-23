var d = require('./../model/noogle_db');
d.open(function(err, db) {
    var pa = require('./../model/page_aggs');
    pa.open(err, db,
    function() {
        pa.pageaggs.find(function(err, c){
            console.log('found');
            console.dir(c);
            c.each(function(err, data){
                if (data){
                    console.log(data);
                }
            });
        });
        
        pa.add_one({
            url: 'foo'
        },
        function(result) {
            console.log(result);
        });

    });
});
/*
var li = require('./../model/links');
li.open(err, db,
function() {
    var ln = require('./../model/lines');
    ln.open(err, db,
    function() {
        var pg = require('./../model/pages');
        pg.open(err, db,
    });
}); */