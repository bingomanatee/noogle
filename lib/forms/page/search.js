var fs        = require('fs');
var deformer  = new require('./../../lib/deformer/deformer');

var fields = {
    'search[term]': {
        type: 'textarea',
        label: 'Search For...',
        required: true,
        rows: 5,
        cols: 80,
        doc: 'filename for search: alphanums and underscores'
    },
    submit: {
        type: 'submit',
        value: 'Search'
    }
}

var form_props = {
    action: '/find', // should be overrridden below
    method: 'post'
}

module.exports.form = function (values) {

    var form = new deformer.Form(fields, form_props);
    if (values) {
        form.set_values(values);
    }
    return form;
}
