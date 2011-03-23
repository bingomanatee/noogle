var lines_model = require(MVC_ROOT + '/models/lines');

module.exports = exports = {

    name: 'line',
    _provider: null,

    provider: function(callback) {
        if (typeof(callback) != 'function') {
            throw new Error(__filename + ':: provider called with no callback');
        } else if (module.exports._provider) {
            console.log(__filename + ':: returning old provider');
            callback(null, module.exports._provider);
        } else {
            lines_model.model(function(err, model) {
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
    
    show: function(req, res, next){
        module.exports.provider(function(err, model){
            model.get(req.params.id, function(err, line){
                var index = line.index;
                var url = line.url;
                console.log('finding lines in  page ' + url + ' near index ' + index);
                model.find({url: url, index: {"$gt": index - 40, "$lt": index + 1000}}, function(err, lines){
                    console.log(__filename + ':: lines' );
                    console.log(lines);
                    if (!lines){
                        lines = [];
                        req.flash('error', 'Cannot find lines, because I\'m poorly written.')
                    }
                    res.render('line/show.html', {locals: {lines: lines, line: line}});
                }, {sort: 'index'});
            });            
        })
        
        
    }

}