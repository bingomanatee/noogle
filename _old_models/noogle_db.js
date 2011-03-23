sys = require("sys");
var m = require('./../lib/mongodb');
var Db = m.Db,
Connection = m.Connection,
Server = m.Server,
// BSON = require('../lib/mongodb').BSONPure;
BSON = m.BSONPure;

if (!global.hasOwnProperty('TEST_NOOGLE_DB')) {
    global.TEST_NOOGLE_DB = false;
}


module.exports = exports = {
    classes: {
        Db: Db,
        Connection: Connection,
        Server: Server,
        BSON: BSON
    },
    db_name: 'noogle',
    host: process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost',
    port: process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : 27017,
    state: 'connecting',
    database: false,
    close: function() {
        if (module.exports.database) {
            module.exports.database.close();
        }
    },
    db_options: {
        native_parser: false
    },
    _error: null,
    open: function(callback) {
        module.exports.database = new Db(module.exports.db_name, new Server(module.exports.host, module.exports.port, {}), {native_parser:false});
        // new Db(exports.db_name, new Server(exports.host, exports.port, {}), module.exports.db_options);
        module.exports.database.open(function(err, db) {
            module.exports.database = db;
            callback(err, db);
        });
    },
    close: function() {
        module.exports.database.close();
    }
}