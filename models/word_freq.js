var db_module = require('./noogle_db');
var mvc_mongo = require('mvc/model/mongo');
var DbCommand = require('mongodb/commands/db_command').DbCommand;
var fs = require('fs');

module.exports = {
    _model: null,

    mixins: {
        remove_stop_words: function(callback) {
            var sw = fs.readFileSync(__dirname + '/stop_words.txt', 'utf8');
            console.log('sw chunk: ' + sw.substring(0, 100) + '...');
            var stop_words = sw.split(',');
            console.log('stop words:');
            console.log(stop_words.slice(0, 5));

            var swc = 0;
            var self = this;

            stop_words.forEach(function(word) {++swc;
                self.delete({
                    _id: word
                },
                function() {--swc;
                });
            });

            var it = setInterval(function() {
                if (swc == 0) {
                    clearInterval(it);
                    callback();
                }
            },
            500);
        },

        reindex: function(callback) {
            var self = this;

            function word_freq_map() {
                this.words.forEach(function(word) {
                    emit(word, 1);
                });
            }

            function word_freq_reduce(prev, current) {
                var c = 0;
                for (var index in current) {
                    c += current[index];
                }
                return c;
            }

            var self = this;
            self.config.db.executeDbCommand({
                "mapreduce": "lines",
                "map": word_freq_map.toString(),
                "reduce": word_freq_reduce.toString(),
                "out": "word_freq"
            },
            function(err, result) {
                if (err) {
                    console.log(__filename + ':: word freq error: ');
                    console.log(err);
                    throw err;
                }

                console.log('marking stop words');
                var stop_words = fs.readFileSync(__dirname + '/stop_words.txt', 'utf8');
                var sw_array = stop_words.split(',');
                for (var i in sw_array) {
                    var sw = sw_array[i];
                    self.config.coll.findAndModify({
                        _id: sw
                    },
                    [], {
                        "$set": {
                            stop_word: 1
                        }
                    },
                    function() {}); // note - asynchronous
                }
                callback(err, result);

                console.log('marking numbers');
                self.config.coll.findAndModify({
                    _id: /^[\d]+$/
                },
                [], {
                    "$set": {
                        stop_word: 1,
                        is_number: 1
                    }
                },
                function() {});
                
                self.config.coll.ensureIndex({value: -1});
            });
        }

    },

    model: function(callback) {
        if (typeof(callback) != 'function') {
            throw new Exception(__filename + ':: model called without callback');
        } else if (module.exports._model) {
            callback(null, module.exports._model);
        } else {
            db_module.open(function(err, db) {
                if (err) {
                    callback(err);
                } else {
                    mvc_mongo.make_model('word_freq', {
                        db: db
                    },
                    module.exports.mixins,
                    function(errm, model) {
                        if (model) {
                            this._model = model;
                            callback(null, model);
                        } else {
                            console.log(__filename + '::model::error: ');
                            console.log(errm);
                            callback(errm);
                        }
                    });
                }
            })
        }
    }
}