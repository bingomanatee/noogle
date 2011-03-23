var mongo = require('./../lib/mongodb');
var BSON = mongo.BSONNative;

if (!global.hasOwnProperty('TEST_NOOGLE_DB')) {
    global.TEST_NOOGLE_DB = false;
}

module.exports = exports = {
    lines: false,

    ready: function() {
        return module.exports.lines ? true: false;
    },

    close: function(callback) {
        noogle_db.close(callback);
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
            module.exports.lines = collection;
            callback(null, module.exports.pages);
        };

        database.collection('lines', _on_connect);
    },

    all: function(callback) {
        module.exports.lines.find(callback);
    },

    add_one: function(record, callback) {
        module.exports.lines.insert(record, callback);
    },

    add_lines: function(url, lines, callback) {
        var i = 0;
     //   console.log(__filename + '::add_lines');
    //    console.log(lines);
        
        module.exports.lines.remove({
            url: url
        },
        function() {
            module.exports.lines.forEach(function(line) {
                line.url = url;
                line.index = i++;
            });
        module.exports.lines.insert(lines, callback); // note - asynchronous!
        });
    },

    remove: function(record, callback) {
        module.exports.lines.remove(record, callback);
    },

    get: function(id, callback) {
        console.log('finding line id: ' + id);
        //var _id = new BSON.ObjectId(id);
        module.exports.lines.find({
            _id: new BSON.ObjectID(id)
        },
        function(err, cursor) {
            if (err) {
                callback(err);
            } else {
                console.log('cursor: ');
                console.log(cursor);
                cursor.toArray(callback);
            }
        });
    },

    exists: function(query, callback) {
        module.exports.lines.count(query,
        function(err, c) {
            callback(err, c > 0 ? true: false);
        });
    },
    
    find_words: function(words, callback){
        var search = [];
        words.forEach(function(word, i){
            var w = word.replace(/^\w/g, '').toLowerCase();
            if (w){
                search.push({'$or': {words: w}});
            }
        });
                console.log('finding lines with words: ' + JSON.stringify(search));

        return module.exports.lines.find(search, {limit: 100}, callback);
    },

    update: function(cond, record, options) {
        module.exports.lines.update(cond, record, options);
    },

    remove: function(query) {
        provider_utils.delete(remove);
    }

}