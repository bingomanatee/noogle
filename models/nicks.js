var lines = require('./lines');
var db_module = require('./noogle_db');
var mvc_mongo = require('mvc/model/mongo');
var file_utils = require('util/file_utils');
var stat = require('util/stat');

module.exports = {

    _model: null,

    mixins: {

        load_nicks: function(callback) {
            if (!this._load_nicks) {
                var load_nicks = require('./nicks/load');
                load_nicks.enable(this);
            }
            this._load_nicks(callback);
        },

        update_nick_line_count: function(nick, callback) {
            if (!this._update_line_count) {
                var update_nicks = require('./nicks/update');
                update_nicks.enable(this);
            }
            this._update_line_count(nick, callback);
        },

        update_all_line_counts: function(callback) {
            if (!this._update_all_line_counts) {
                var update_nicks = require('./nicks/update');
                update_nicks.enable(this);
            }
            this._update_all_line_counts(callback);
        },

        sims_for: function(nick, callback) {
            if (!this._sims_for) {
                var sims_for = require('./nicks/sims_for');
                sims_for.enable(this);
            }
            this._sims_for(nick, callback);
        },

        add_alias: function(nick, alias, callback) {
            if (!this._add_alias) {
                var a = require('./nicks/alias');
                a.enable(this);
            }
            this._add_alias(nick, alias, callback);
        },

        get_nick: function(nick, callback) {
            this.find({
                "$or": [{
                    canonical_nick: nick
                },
                {
                    nicks: nick
                }]
            },
            function(err, nick) {
                if (err) {
                    callback(err);
                } else if (nick) {
                    //  console.log(__filename + '::get_nick');
                    //  console.log(nick);
                    callback(null, nick);
                } else {
                    callback(new Error('cannot find nick ' + nick));
                }
            });
        },

        _as_oid: function(id_str) {
            return id_str
        },

        nick_names: function(canonical, callback) {
            if (!this._nick_names) {
                var na = require('./nicks/names');
                na.enable(this);
            }

            this._nick_names(canonical, callback);
        },

        aliases: function(callback) {
            if (!this._aliases) {
                var na = require('./nicks/names');
                na.enable(this);
            }
            this._aliases(callback);
        },

        _nicks_style: function(nicks) {

            var weights = [];

            for (var i in nicks) {
                var n = nicks[i];
                if (n.hasOwnProperty('total_lines') && n.total_lines && _.isNumber(n.total_lines)) {
                    weights.push(n.total_lines);
                }
            }

            var a = stat.average(weights);
            var s = stat.standardDeviation(weights);
            var m = stat.max(weights);

            var range = {
                min: 0,
                small: a - s,
                med: a,
                large: a + s,
                max: m + 1
            }
            
            console.log(__filename + ':: _nicks_style: range ');
            console.log(range);

            for (var i in nicks) {
                var nick = nicks[i];
                var found = false;
                for (var name in range) {
                    var range_value = range[name];
                    if (!found && (range_value > nick.total_lines)) {
                        found = true;
                        nick.class_name = name;
                    }
                }
                if (nick.is_alias){
                    nick.class_name += ' alias';
                }
            }

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
                    mvc_mongo.make_model('nicks', {
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