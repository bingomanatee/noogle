require('./../context');

var wf = require('./../models/word_freq');

wf.model(function(err, model) {
    if (err) {
        console.log(__filename + ':: word freq model error: ');
        console.log(err);
    } else {
        model.reindex(function() {
            console.log('reindexed');
            model.config.db.close();
        })
    }
})