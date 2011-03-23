var fs = require('fs');
var ejs = require('ejs');
var sys = require('sys');
var path = require('path');

module.exports = exports = {

    add_controller: function(options, callback) {

        path.exists(options.path,
        function(exists) {
            if (exists) {
                callback(new Error('already controller in ' + options.path));
            } else {

                var controller_stream = fs.createReadStream(__dirname + "/templates/meta/controller.js");
                var template = '';

                controller_stream.on('data',
                function(data) {
                    template += data;
                });

                controller_stream.on('end',
                function() {

                    var f = fs.createWriteStream(options.path);
                    var out = ejs.render(template, {
                        locals: options
                    });
                    console.log('meta::add_controller - adding controller to ' + options.path);
                    //   console.log(out);
                    f.write(out);
                    f.end();
                    callback();

                });
            };
        });
    },

    add_provider: function(options, callback) {
        path.exists(options.path,
        function(exists) {
            if (exists) {
                callback(new Error('already controller in ' + options.path));
            } else {
                var rs = fs.createReadStream(__dirname + '/templates/meta/provider.js');
                console.log('meta::add_profiver: writing provider to path ' + options.path);
                var ws = fs.createWriteStream(options.path);
                sys.pump(rs, ws, callback);
            }
        });
    }
}