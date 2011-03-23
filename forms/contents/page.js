var fs = require('fs');
var deformer = new require('./../../lib/deformer/deformer');

var exports = module.exports;

exports.form = function(values, callback) {
    var def_stream = fs.createReadStream(__dirname + '/page.json');
    var json = '';
    var form_data = null;
    
    def_stream.on('data',
    function(txt) {
        json += txt;
    });
    def_stream.on('end',
    function() {
        form_data = JSON.parse(json);
    var form = new deformer.Form(form_data.fields, form_data.props, null, values);
    callback(form);
    })
}