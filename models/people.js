var db_module = require('./noogle_db');
var mvc_mongo = require('mvc/model/mongo');
var _ = require('util/underscore');
var file_utils = require('util/file_utils');

module.exports = {

    _model: null,

    mixins: { },

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
                    mvc_mongo.make_model('people', {db: db},
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
