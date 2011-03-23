var db_module = require('./noogle_db');
var mvc_mongo = require('mvc/model/mongo');
var _ = require('util/underscore');
var file_utils = require('util/file_utils');

module.exports = {

    _model: null,

    _url_map: function() {
        if (this.nick && this.url) {
            emit(this.url + ' ' + this.nick, 1);
        }
    },

    _url_reduce: function(key, current) {
        var c = 0;
        for(var i in current) c += current[i];
        return c;
    },
    
    _url_finalize: function(key, out){
        var a = key.split(' ');
        return {url: a[0], nick: a[1], lines: out};
    },

    mixins: {
        count_nick_lines_2: function(nick, callback) {
            var self = this;
            var query;
            
            if (!nick){
                query = null;
            } else if (_.isArray(nick)) {
                var query = {
                    nick: {
                        "$in": nick
                    }
                };
            } else {
                var query = {
                    nick: nick
                };
            }

            this.config.db.command({
                mapreduce: "lines",
                query:      query,
                map:        module.exports._url_map.toString(),
                reduce:     module.exports._url_reduce.toString(),
                finalize:   module.exports._url_finalize.toString(),
                out:        'nicks_freq'
            },
            callback);
        },
        
        count_nick_lines: function(nick, callback) {
            /*
             * this method returns a date-indexed set of line counts for
             * a given nick or nicks.
             */
            var self = this;

            if (_.isArray(nick)) {
                var query = {
                    nick: {
                        "$in": nick
                    }
                };
            } else {
                var query = {
                    nick: nick
                };
            }

            var date_freq = [];
            var jobs = 0;
            var started = false;

            console.log('query for date range: ');
            console.log(query);
            
            this.config.coll.distinct('url', query,
            function(err, dates) {
                console.log('dates range');
                console.log(dates.slice(0, 10));
                                
                dates.forEach(function(date) {
                    if (_.isArray(nick)) {
                        var query = {
                            nick: {
                                "$in": nick
                            },
                            url: date
                        };
                    } else {
                        var query = {
                            nick: nick,
                            url: date
                        };
                    }
                    started = true;
                    ++jobs;
                    console.log('counting frequency of ' + date);
                    self.config.coll.count(query,
                    function(err, c) {
                        console.log('frequency of ' + date + ' = ' + c);
                        date_freq[date] = c;
                        --jobs;
                    })
                });

            });
            
            console.log('@@@@@@@@@@@@@@@@@@@@@@ waiting for counts to finish');
            
            var jobwait = setInterval(function() {
                if (started && (jobs <= 0)) {
                    clearInterval(jobwait);
                    callback(null, date_freq);
                };
            },
            500);
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
                    mvc_mongo.make_model('lines', {
                        db: db
                    },
                    module.exports.mixins,
                    function(errm, model) {
                        if (model) {
                            module.exports._model = model;
                            //      console.log(__filename + '::model:: returning model');
                            //       console.log(model);
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
