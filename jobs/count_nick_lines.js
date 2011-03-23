require('./../context');
var lines = require('models/lines');

var nick = process.argv[2];
console.log('finding nicks of ' + nick);

lines.model(function(err, model) {
    if (err) {
        throw err;
    }
    model.count_nick_lines_2(nick,
    function(err, response) {
        if (err) throw err;
        console.log('count of nicks: ');
        console.log(response);
        model.config.db.close();
    });
});