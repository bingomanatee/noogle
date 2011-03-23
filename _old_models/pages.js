var mongo = require('./../lib/mongodb');
var events = require('events');
var BSON = mongo.hasOwnProperty('BSONPure') ? mongo.BSONPure: mongo.BSONNative;

/**
 * Since this applicatin is built specifically
 * to index the IRC chat logs of the NodeJS channel,
 * it is built with a "top down" two level heirarchy.
 * The pages collection contains links to chat logs.
 * Those links are kept in their own collection.
 * This collection is the collection of the (at this point single)
 * index page in which the links are stored.
 */

module.exports = exports = {
    pages: false,

    when_ready: function(callback) {
        var ready_handler = setInterval(function() {
            if (module.exports.ready()) {
                clearInterval(ready_handler);
                callback();
            }
        },
        500)
    },

    ready: function() {
        return module.exports.pages ? true: false;
    },

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

            console.log('opening collection pages');
            module.exports.pages = collection;
            callback(null, module.exports.pages);
        };

        database.collection('pages', _on_connect);
    },

    all: function(callback) {
        if (module.exports.pages) {
            module.exports.pages.find(callback);
        } else {
            module.exports.open(function() {
                module.exports.pages.find(callback);
            })
        }
    },

    add_one: function(record, callback) {

        module.exports.pages.insert(record, callback);

    },

    get: function(id, callback) {
        console.log('finding page id: ' + id);
        var obj_id = new BSON.ObjectID(id);
        console.log(obj_id);
        //var _id = new BSON.ObjectId(id);
        module.exports.pages.find({
            _id: obj_id
        },
        function(err, cursor) {
            if (err) {
                callback(err);
            } else {
                cursor.toArray(function(err2, a) {
                    callback(err2, a[0]);
                });
            }
        });

    },
    get_url: function(url, callback) {
        console.log('finding page url: ' + url);
        //var _id = new BSON.ObjectId(id);
        module.exports.pages.find({
            url: url
        },
        function(err, cursor) {
            if (err) {
                callback(err);
            } else {
                cursor.toArray(function(err2, a) {
                    console.log(__filename + '::get_url::found page:');
                    console.dir(a);
                    callback(err2, a[0]);
                });
            }
        });

    },

    exists: function(query, callback) {
        function handler() {
            module.exports.pages.count(query,
            function(err, c) {
                callback(err, c > 0 ? true: false);
            });
        }

        if (module.exports.pages) {
            handler();
        } else {
            module.exports.open(handler);
        }
    },

    update: function(cond, record, options) {
        module.exports.pages.update(cond, record, options);
    },

    remove: function(query) {
        provider_utils.delete(remove);
    },

    page_links: function(url, callback) {
        console.log('reading ' + url);
        //    console.log('reading repos: ' + url);
        var hits = /([^\/]+)(\/.*)/.exec(url);
        if (hits) {
            exports.read_page(hits[1], hits[2],
            function(url, content) {
                exports.find_links(url, links, callback)
            });
        } else {
            console.log('cannot parse url ' + url);
        }
    }

}