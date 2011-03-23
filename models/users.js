var db_module = require('./noogle_db');
var mvc_mongo = require('mvc/model/mongo');
var file_utils = require('util/file_utils');
var string_module = require('util/string');

module.exports = {

    _model: null,

    mixins: {
        
        aggregate: function(user){
            var user_nicks = [user._id];
            for (var i in user.nicks){
                user_nicks.push[user.nicks[i]];
            }
            // @TODO: cleanup, sort
            var nick_model = require('./nicks')
            for (var n in user_nicks){
                
            }
        },
        
        string_id: true,
        
        authenticate: function(un, pw, callback){
            console.log(__filename + ':: getting user ' + un);
            var self = this;
            
            self.get(un, function(err, user) {
                if (user){
                    if(user.pw == pw){
                    callback(null, user);
                    } else {
                        callback(new Error('Wrong password. Guess again!'));
                    }
                } else {
                    callback(new Error('no user with that password/username exists'));
                }
            });
        },
        
        add: function(new_user, callback) {
            var self = this;
            var err = {user: new_user};
            var is_err = false;
            var rf = ['un', 'pw', 'email'];
            for (var f in rf) {
                var ff = rf[f];
                if (!new_user[ff]) {
                    err[ff] = "missing";
                    is_err = true;
                }
            }
            
            if (is_err){
                callback(err);
            } else {
                new_user.email = string_module.trim(new_user.email.toLowerCase());          ;
                var crit = {email: new_user.email};
                console.log(__filename + ':: criteria/email');
                console.log(crit);
                self.count(crit, function(err, n){
                    if (n > 0){
                        is_err = true;
                        var err2 = new Error('duplicate mail');
                        console.log(__filename + ':: duplicate mail');
                        callback(err2);
                    } else {
                        new_user.un = string_module.trim(new_user.un.toLowerCase());
                        self.get(new_user.un, function(err, old_user){
                            if (old_user) {
                                is_err = true;
                                error.dupe_user = 'duplicate user';
                                callback(err);
                            } else { // no passing out of err
                                if (new_user.nicks && (typeof(new_user.nicks) == 'string')){
                                    new_user.nicks = new_user.nicks.split(/[\r\n, ]+/);
                                }
                                self.config.coll.insert(new_user, function(err, news){
                                    if (news) {
                                        console.log(__filename + ': insert result');
                                        console.log(news);
                                    }
                                    callback(err, news);
                                });
                            }
                        });
                        
                    }
                });
                
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
                    mvc_mongo.make_model('users', {
                        db: db
                    },
                    module.exports.mixins,
                    function(errm, model) {
                        if (model) {
                            module.exports._model = model;
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