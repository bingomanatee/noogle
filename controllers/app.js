var _ = require('util/underscore');
var freq_model = require('models/word_freq');

module.exports = exports = {
    
    name: 'app',
    
    _freq_provider: null,

    freq_provider: function(callback) {
        if (typeof(callback) != 'function') {
            throw new Error(__filename + ':: provider called with no callback');
        } else if (module.exports._freq_provider) {
            console.log(__filename + ':: returning old provider');
            callback(null, module.exports._freq_provider);
        } else {
            freq_model.model(function(err, model) {
                if (err) {
                    console.log(__filename + '::provider::model error');
                    console.log(err);
                    callback(err);
                } else if (model) {
                 //   console.log(__filename + '::provider:: returning model to callback');
                 //   console.log(model);
                    module.exports._freq_provider = model;
                    callback(null, model);
                } else {
                    console.log(__filename + '::provider::no output');
                    callback(new Error('no output'));
                }
            });
        }
    },
    
    index: function(req, res, next){
        
        module.exports.freq_provider(function(err, model){
            if (err){
                throw err;
            }
          //  console.log(model);
            // coll is a connection object
            model.config.coll.find({ stop_word: {"$ne": 1}}, null, {limit: 300, sort: [['value', -1]]}, function(err2, cursor){
                if (err2) {
                    console.log(__filename + ':: error: ');
                    console.log(err);
                    throw err2;
                }
                
                cursor.toArray(function(err3, data_array){
                    if (err3) {
                        throw err3;
                    }
                    console.log('produced ' + data_array.length + ' documents50');
                    var f100 = data_array.slice(0, 50);
                    console.log(f100);
                    res.render('app/index.html', {locals: {data: data_array}});                    
                });
            });
            
        });
        
    }
}