var nicks_model = require('./nicks');

var db_module = require('./noogle_db');
var mvc_mongo = require('mvc/model/mongo');
var DbCommand = require('mongodb/commands/db_command').DbCommand;
var fs = require('fs');

module.exports = {
    _model: null,

    mixins: {
        _update_nnd: function(nnd, nick_name, date, lines){
            if (!nnd.hasOwnProperty(nick_name)){
                nnd[nick_name] = {_id: nick_name, lines: {}}
            }
            nnd[nick_name].lines[date] = lines;
        },
        
        aggregate: function(callback) {

            nicks_model.model(function(err, nicks) {
                if (err){
                    console.log('cannot get nicks model');
                    throw err;
                } else {
                    console.log('nicks model');
                  //  console.log(nicks);
                }
                var new_nick_data = {};
                var nfr_cache = {};
                    
                nicks.config.coll.find(function(err, cursor) {
                    console.log(__filename + '::find callback');
                    if (err){
                        throw err;
                    } else {
                        console.log('examining cursor');
                    }
                    
                    
                    function cache_nfr(n, l, d){
                        if (nfr_cache.hasOwnProperty(n)){
                            nfr_cache[n].lines[d] = l;
                        } else {
                            var dl = {};
                            dl[d] = l;                            
                            nfr_cache[n] = {_id: n, lines: dl};
                        }
                    }
                    
                    cursor.each(function(err, nick_freq_record) {
                        if (nick_freq_record) {
                            var nick_name   = nick_freq_record.value.nick;
                            var lines       = nick_freq_record.value.lines;
                            var date        = nick_freq_record.value.date;
                            console.log('nn: ' + nick_name + '; lines: ' + lines + '; date: ' + date);
                            var crit = {_id: nick_name};
                            var set_item = {};
                            set_item['lines.' + date] = lines;
                            nicks.config.coll.find(crit, function(err, nick_record){
                               if (nick_record){
                                  nicks.config.coll.update(crit, {"$set": set_item}); // note - asynchronous
                               } else {
                                  cache_nfr(nick_name, lines, date);
                               }
                            });                            
                        }                                               
                    }); // end cursor.each
                    
                    var cache_nfr_array = [];
                    for (var i in nfr_cache){
                        var n = nfr_cache[i];
                        cache_nfr_array.push(n);    
                    };                    
                    
                    nicks.config.coll.insert(cache_nfr_array);
                    
                }); // end find
                var nnd_array = [];
                
              //  new_nick_data.forEach(function(nick){nnd_array.push(nick); });
                
              //  nicks.config.coll.insert(nnd_array);
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
                    mvc_mongo.make_model('nicks_freq', {
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


/* 
if (process.argv[2] == 'agg') {
    module.exports.model(function (err, model){
        if (err){
            throw err;
        }
        model.aggregate(function(err, response){
            console.log('done with nicks aggregation');
            console.log(response);
            model.config.db.close();
        });
    });
}
    if (nf_reacord) {
         nicks.get({_id: nick_name},
         function(err, nick_data) {
             if (!nick_data) {
                self._update_nnd(new_nick_data, nick_name, date, lines);
             } else {
                 var set_term = {};
                 var key = 'lines.' + date;
                 set_term[key] = lines;
                 nicks.config.coll.update({_id: nick_name}, { $set: set_term });
             }
         }) // end get;
     } // end if; */