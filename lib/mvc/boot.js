var fs = require('fs');

var boot_controller = require('./boot_controller');

module.exports = exports = function(app, path) {
    fs.readdir(path,
    function(err, files) {
        if (err) throw err;
        files.forEach(function(file) {
            boot_controller(app, file, path);
        });
    });
}