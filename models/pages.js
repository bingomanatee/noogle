var db_module = require('./noogle_db');
var mvc_mongo = require('mvc/model/mongo');
var file_utils = require('util/file_utils');

module.exports = {

    _model: null,

    mixins: {        
        reindex: function(page, callback) {
            console.log(__filename + ':: model reindexing');
            var self = this;
            
            if (!this.hasOwnProperty('_reindex')){
                var ri = require('./pages/indexing');
               ri.enable(self);
            }
            
            if (!this.hasOwnProperty('_reindex')){
                console.log('cannot install _reindex');
            } else {
                console.log(__filename + '::reindex - calling _reindex');
                this._reindex(page, callback);
            }
        },
        
        encomment_page: function(page, comments){
            if (page.sections){
                for(var c in comments){
                    var comment = comments[c];
                    
                    if (comment.section){
                        console.log(__filename + ': appending comment to section ' + comment.section);
                        var section = page.sections[comment.section]
                        if (section){
                            if (section.hasOwnProperty('comments')){
                                section.comments.push(comment);
                            } else {
                                section.comments = [comment];
                            }
                        }
                    }
                    
                }
            }
        },

        put: function(data, callback) {
            if (! (data.hasOwnProperty('url') && data.url)) {
                 var e = new Error('page must have url: ' + JSON.stringify(data));
                 if (callback){
                    callback(e);
                 } else {
                    throw e;
                 }
            } else if (this.config.coll) {
                var self = this;
                this.find({
                    url: data.url
                },
                function(err, result) {
                    if (result.length) {
                        data._id = result[0]._id;
                    }
                    if (data._id) {
                        self.update(data, callback);
                    } else {
                        self.insert(data, callback);
                    }
                });

            } else {
                callback(new Error('No Connection'));
            }
        },
        
        soft_delete: true
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
                    mvc_mongo.make_model(
                    'pages',
                    { db: db },
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