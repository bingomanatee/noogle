sys = require("sys");
var mdb = require('./../lib/mongodb');
var Db = mdb.Db,
Connection = mdb.Connection,
Server = mdb.Server;

if (mdb.hasOwnProperty('BSONNative')) {
    BSON = mdb.BSONNative;
} else {
    BSON = mdb.BSONPure;
}
console.log('BSON');
console.dir(BSON);

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

module.exports = exports = {
    links: false,
    open: function(err, database, callback) {
        if (err) {
            throw err;
        }

        if (!database) {
            var noogle_db = require('./noogle_db');
            dataabase = noogle_db.database;
        }

        function _on_connect(err, collection) {
            if (err) {
                throw err;
            }

            console.log('opening collection module.exports.links');
            module.exports.links = collection;
            callback(null, module.exports.pages);
        };

        database.collection('links', _on_connect);
    },

    // probably a really bad idea to call in production... 
    all: function(callback) {
        module.exports.links.find(callback);
    },

    add: function(record, callback) {
        console.log('inserting record into module.exports.links: ');
        console.log(record);

        var find = {
            from: record.from,
            to: record.to
        };

        module.exports.links.find(find,
        function(err, old) {
            if (err || !old.length) {
                console.log('_add: adding record');
                console.log(record);
                module.exports.links.insert(record, callback);
            } else {
                old.toArray(callback);
            }
        });
    },

    // note - call 
    add_links: function(url, new_links, callback, noDelay) {
        console.log('adding module.exports.links: ');
        console.log(new_links.slice(0, 3));
        console.log('...');

        var inserted = 0;
        var records = [];
        module.exports.links.remove({
            from: url
        },
        function() {
            new_links.forEach(function(link) {
                console.log('new link:');
                console.log(link);

                exports.add({
                    from: url,
                    to: link
                },
                function(err, data) {
                    if (err) {
                        console.log('insert:err');
                        console.dir(err);
                    } else {
                        console.log('insert::data');
                        console.log(data);
                        records.push(data[0]);
                    }
                });
            });
            console.log('new records:');
            console.log(records);
            callback(null, records);
        });
    },

    url_links: function(url, callback) {
        // url = url.replace(/^http(s)?:\/\//, '');
        console.log('finding module.exports.links with url ' + url);
        module.exports.links.find({
            from: url
        },
        {
            sort: ['to', 'ascending']
        },
        callback);
    },

    get: function(id, callback) {
        module.exports.links.find({
            _id: new BSON.ObjectID(id)
        },
        null, null,
        function(err, cursor) {
            cursor.toArray(function(err, a) {
                if (err) {
                    console.log('get a err');
                    console.log(err);
                    callback(err);
                } else {
                    console.log('get data');
                    console.log(a);
                    callback(null, a.pop());
                }
            });
        });
    },

    update: function(cond, record, options) {
        module.exports.links.update(cond, record, options);
    },

    remove: function(query, callback) {
        module.exports.links.remove(query, callback);
    }

}