//mvc_mongo = require('mvc/model/mongo');
var mongo = require('mongodb');

module.exports = {
    _db: null,
    _db_cmd: null,
    
    open: function(callback) {
        self = module.exports;
        if (typeof (callback) != 'function'){
            throw new Error(__filename + ": no callback");
        } else if (self._db) {            
            callback(null, self._db);
        } else {
            var database = new mongo.Db('noogle', new mongo.Server('localhost', 27017, {}), {
                native_parser: false
            });
            // new Db(exports.db_name, new Server(exports.host, exports.port, {}), module.exports.db_options);
            database.open(function(err, db) {
                if (err) {
                    callback(err);
                } else {
                 //  console.log(__filename + ':: returning database ');
                    self._db = db;
                    callback(null, db);
                };
            });
        }
    },
    
    open_cmd: function(callback){
        self = module.exports;
        if (typeof (callback) != 'function'){
            throw new Error(__filename + ": no callback");
        } else if (self._db) {            
            callback(null, self._db);
        } else {
            var database = new mongo.Db('noogle', new mongo.Server('localhost', 27017, {}), {
                native_parser: false
            });
            // new Db(exports.db_name, new Server(exports.host, exports.port, {}), module.exports.db_options);
            database.open(function(err, db) {
                if (err) {
                    callback(err);
                } else {
                    console.log(__filename + ':: returning database ');
                    self._db = db;
                    callback(null, db);
                };
            });
        }
    }
    
}