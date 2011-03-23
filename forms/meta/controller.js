var fs        = require('fs');
var deformer  = new require('./../../lib/deformer/deformer');

var fields = {
    'controller[name]': {
        type: deformer.TEXT,
        label: 'Name',
        required: true,
        doc: 'filename for controller: alphanums and underscores'
    },
    'controller[doc]': {
        type: deformer.TEXTAREA,
        label: 'Documentation'
    },
    'controller[actions]': {
        type: 'checkbox',
        label: 'Actions',
        options:
        [
          {
              name: 'controller[actions]',
              label: 'index',
              value: 'index',
              on: true
          },
          {
              name: 'controller[actions]',
              label: 'show',
              value: 'show',
              on: true
          },
  
          {
              name: 'controller[actions]',
              label: 'edit and create',
              value: 'edit+create',
              on: true
          },
          {
  
              name: 'controller[actions]',
              label: 'update',
              value: 'update',
              on: false
          },
  
          {
              name: 'controller[actions]',
              label: 'delete and destroy',
              value: 'delete+destroy'
          }
        ]
    },
    submit: {
        type: 'submit',
        label: 'Save Chapter',
        value: 'Save'
    }
}

var form_props = {
    action: '/metas/0', // should be overrridden below
    method: 'post'
}

module.exports.form = function (values) {

    var form = new deformer.Form(fields, form_props);
    if (values) {
        form.set_values(values, {
            prop_prefix: 'contorller[',
            prop_suffix: ']'
        });
    }
    return form;
}
