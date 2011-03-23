var mongo = require('./../lib/mongodb');
var events = require('events');
var BSON = mongo.hasOwnProperty('BSONPure') ? mongo.BSONPure: mongo.BSONNative;

/**
 * Since this applicatin is built specifically
 * to index the IRC chat logs of the NodeJS channel,
 * it is built with a "top down" two level heirarchy.
 * The pageaggs collection contains links to chat logs.
 * Those links are kept in their own collection.
 * This collection is the collection of the (at this point single)
 * index page in which the links are stored.
 */

module.exports = exports = {
    pageaggs: false,

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
        return module.exports.pageaggs ? true: false;
    },

    open: function(err, database, callback) {
        if (!database) {
            console.log('getting database from noogle_db');
            var noogle_db = require('./noogle_db');
            dataabase = noogle_db.database;
        }

        database.collection('pageaggs',
        function(err, collection) {
            console.log('opening collection pageaggs');
            module.exports.pageaggs = collection;
            callback(null, module.exports.pageaggs);
        });
    },

    all: function(callback) {
        if (module.exports.pageaggs) {
            module.exports.pageaggs.find(callback);
        } else {
            module.exports.open(function() {
                module.exports.pageaggs.find(callback);
            })
        }
    },

    add_one: function(record, callback) {

        console.log('page agg conn');
        console.log(module.exports.pageaggs);

        module.exports.pageaggs.count({
            url: record.url
        },
        function(err, count) {
            console.log('count: ' + count);
            if (err) {
                console.log(__filename + '::add_one::adding err record .' + record.url);
                module.exports.pageaggs.insert([record],
                function(result) {
                    console.log(__filename + '::add_one - inserted ');
                    console.log(result);

                    callback(err, result)
                });
            } else if (count < 1) {
                console.log(__filename + '::add_one::adding 0 record .' + record.url);
                module.exports.pageaggs.insert(record,
                function(err, result) {
                    console.log(__filename + '::add_one - inserted ');
                    if (err) {
                        console.log('err');
                        console.log(err);
                    } else {
                        console.log('result');
                        console.log(result);
                    }
                    callback(err, result)
                });
            } else {
                console.log(__filename + '::add_one::updating record .' + record.url);
                module.exports.pageaggs.update({
                    url: record.url
                },
                record,
                function(err, result) {

                    if (err) {
                        console.log('err');
                        console.log(err);
                    } else {
                        console.log('result');
                        console.log(result);
                    }
                    callback(err, result)
                });
            }
        });
    },

    get: function(id, callback) {
        console.log('finding page id: ' + id);
        var obj_id = new BSON.ObjectID(id);
        console.log(obj_id);

        module.exports.pageaggs.find({
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

        module.exports.pageaggs.find({
            url: url
        },
        function(err, cursor) {
            if (err) {
                callback(err);
            } else {
                cursor.toArray(function(err2, a) {
                    console.log(err2);
                    console.log(__filename + '::found page:');
                    console.dir(a);
                    callback(err2, a[0]);
                });
            }
        });
    },

    exists: function(query, callback) {
        function handler() {
            module.exports.pageaggs.count(query,
            function(err, c) {
                callback(err, c > 0 ? true: false);
            });
        }

        if (module.exports.pageaggs) {
            handler();
        } else {
            module.exports.open(handler);
        }
    },

    update: function(cond, record, options) {
        module.exports.pageaggs.update(cond, record, options);
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