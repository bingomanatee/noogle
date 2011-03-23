var fs = require('fs');
var deformer = require('deformer');

module.exports.form = function(values, callback) {
    try {
        var json = fs.readFileSync(__dirname + '/page.json');
        var form_data = JSON.parse(json);
        var form = new deformer.Form(form_data.fields, form_data.props, null, null, values);
    //    console.log(__filename + '::form');
   //     console.log(form);
        callback(null, form);
    } catch(err) {
        console.log(__filename + '::error');
        console.log(err);
        callback(err);
    }
}