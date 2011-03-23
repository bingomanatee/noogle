require('./../../../context');
mvc_mongo = require('./mongo');

var mongo = require('mongodb');

var database = new mongo.Db('pools', new mongo.Server('localhost', 27017, {}), {
    native_parser: false
});
// new Db(exports.db_name, new Server(exports.host, exports.port, {}), module.exports.db_options);
database.open(function(err, db) {
    mvc_mongo.make_model('mongo_db_test', {db: db}, {},
    function(err, model) {
        if (err){
            console.log('cannot make model');
            throw err;
        }
        console.log('inserting data');
        model.insert({
            a: 1
        },
        function() {
            db.close();
        });
    });
});