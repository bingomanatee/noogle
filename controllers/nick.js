var nicks_model = require(MVC_ROOT + '/models/nicks');
var nicks_freq = require('models/nicks_freq');

module.exports = exports = {

    name: 'nick',
    _provider: null,

    provider: function(callback) {
        if (typeof(callback) != 'function') {
            throw new Error(__filename + ':: provider called with no callback');
        } else if (module.exports._provider) {
            console.log(__filename + ':: returning old provider');
            callback(null, module.exports._provider);
        } else {
            nicks_model.model(function(err, model) {
                if (err) {
                    console.log(__filename + '::provider::model error');
                    console.log(err);
                    callback(err);
                } else if (model) {
                    module.exports._provider = model;
                    callback(null, model);
                } else {
                    console.log(__filename + '::provider::no output');
                    callback(new Error('no output'));
                }
            });
        }
    },
    
    aliases: function (req, res, next){
        var me = this;
        module.exports.provider(function(err, model) {
            if (err) {
                console.log(err);
            }
            model.find({is_alias: true}, 
            function(err, nicks) {
                console.log(__filename + '::index nicks count: 1 ' + nicks.length);
                nicks = _.sortBy(nicks,
                function(a) {
                    return a._id
                });
                model._nicks_style(nicks);
                console.log(__filename + '::index nicks count: 2  ' + nicks.length);
                model.aliases(function(err, aliases) {
                    res.render('nick/index.html', {
                        locals: {
                            nicks: nicks,
                            title: 'Aliases'
                        }
                    });
                })

            });
        });
        
    },
    
    index: function(req, res, next) {
        var me = this;
        module.exports.provider(function(err, model) {
            if (err) {
                console.log(__filename + ': error getting provider');
                console.log(err);
            }
            model.find({is_alias: false, total_lines: {"$gt": 50}}, 
            function(err, nicks) {
                console.log(__filename + '::index nicks count: 1 ' + nicks.length);
                nicks = _.sortBy(nicks,
                function(a) {
                    return a._id
                });
                model._nicks_style(nicks);
                console.log(__filename + '::index nicks count: 2  ' + nicks.length);
                model.aliases(function(err, aliases) {
                    res.render('nick/index.html', {
                        locals: {
                            nicks: nicks,
                            'title': 'Contributors'
                        }
                    });
                })

            });
        });
    },
    
    claim: function(req, res, next) {
        module.exports.provider(function(err, model){
           var c_nick = req.params.canonical_nick;
           var nick_name   = req.params.nick;
           
           model.get_nick(c_nick, function(err, nick){
                res.render('nick/claim.html', {locals: {nick: nick[0], nick_name: nick_name}});
            });
        });
    },
    
    claim_attach: function(req, res, next) {
        req.flash('info', 'Doing a thing that we are not doing.');
        module.exports.provider(function(err, model) {
            var c_nick = req.params.canonical_nick;
            var nick_name = req.params.nick;

            model.get_nick(c_nick,
            function(err, nicks) {
                model.add_alias(nicks[0], nick_name, function(){
                    model.sims_for(nicks[0],
                    function(err, sims) {
                        res.render('nick/show.html', {
                            locals: {
                                nicks: nicks,
                                sims: sims
                            }
                        });
                    });
                });
            });
        });
    },
    
    show: function(req, res, next) {
        var nick = req.params.id;

        module.exports.provider(function(err, model) {
            model.get_nick(nick,
            function(err, nicks) {
                model.sims_for(nicks[0],
                function(err, sims) {
                    
                    res.render('nick/show.html', {
                        locals: {
                            nicks: nicks,
                            sims: sims
                        }
                    });
                })
            });
        })
    }

}