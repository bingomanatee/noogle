var tags = require('./tags');
var field_module = require('./field');

module.exports = exports = {
  Form: function(fields, form_props, config, overrides, values) {
    this.set_form_props(form_props);
    this.set_fields(fields);
    
    if (config) {
    //  console.log(__filename + '::constructor:: config = ' + JSON.stringify(config));
      this.set_config(config);
    } else {      
      //console.log(__filename + '::constructor:: config MISSING ');
    }
    
    if (overrides) {
     // console.log(__filename + '::constructor:: overrides = ' + JSON.stringify(overrides));
      this.set_overrides(overrides);
       } else {      
     // console.log(__filename + '::constructor:: overrides MISSING ');
    }

    if (values) {
   //   console.log(__filename + '::constructor:: values = ' + JSON.stringify(values));
        this.set_values(values);
       } else {      
   //   console.log(__filename + '::constructor:: values MISSING ');
    }
  },
  TEXT:     'text',
  TEXTAREA: 'textarea',
  SELECT:   'select',
  SUBMIT:   'submit',
  BUTTON:   'button',
  CHECKBOX: 'checkbox',
  RADIO:    'radio'
}
/**
 * NOTE: form_props must have an ID property
 *       form items must have name properties
 */

exports.Form.prototype = {

  fields: {},

  _form_props: {},

  _config: {},
  set_action: function(action) {
    this._form_props.action = action;
  },
  set_fields: function(fields) {
    if (fields) {
      for (var name in fields){
          var field = fields[name];
          if (!field.hasOwnProperty('name')){
            field.name = name;
          }
          var type = field.type;
          delete field.type;
          var path = __dirname + '/fields/' + type;
          console.log('creating field ' + type + ': name =' + field.name + '; path = ' + path);
          var ft = require(path);
          if (this._form_props.hasOwnProperty('namespace') && this._form_props.namespace){
            name = fields.name = this._form_props.namespace + '[' + this._form_props.name + ']';
          }
          fields[name] = new ft.Field(field);
        
      }
      this.fields = fields;
    } else {
      this.fields = [];
    }
  },
  set_form_props: function(form_props) {
    if (!form_props) {
      form_props = {};
    }
    if (!form_props.hasOwnProperty('id')) {
      form_props.id = 'form' + Math.floor(Math.random() * 100);
    }
    if (!form_props.hasOwnProperty('method')) {
      form_props.method = 'post';
    }
    this._form_props = form_props ? form_props: {
      'action': '/',
      'method': 'post'
    };
  },

  set_values: function(values, mods) {
    for (var key in values) {
      console.log(__filename + '::set_values::setting ' + key + ' to ' + values[key]);
      var okey = key;
      if (mods) {
        if (mods.hasOwnProperty('prop_prefix')) {
          key = mods.prop_prefix + key;
        }
        if (mods.hasOwnProperty('prop_suffix')) {
          key = key + mods.prop_suffix;;
        }
      }
      if (this.fields.hasOwnProperty(key)) {
        this.fields[key].value = values[okey];
      } else {
        console.log('cannot find key ' + key + ' in form');
      }
    }
  },

  set_config: function(config) {
    for (var prop in config) {
      this._config[prop] = config[prop];
    }
  },

  set_overrides: function(config) {
    for (var prop in config) {
      this[prop] = config[prop];
    }
  },

  table_props: {
    width: '100%',
    className: 'form_table'
  },

  render: function() {
    var out = this._render_head();
    var form = this;
    var rows = [];
    var no_rows = [];
    
    for (var name in this.fields) {
      field = this.fields[name];
      if (field.no_frame){
        no_rows.push(field.render_tag());
      } else {
        rows.push(form._field_row(field));        
      }
    }
    // console.log('render: rows = ');
    //  console.log(rows);
    //   console.log('render: form_props = ');
    // console.log(this._form_props);
    return tags.tag('form', this._form_props, this._render(rows, no_rows));
  },
  _row_filter: function(row) {
    row[0] = {
      type: 'th',
      value: tags.tag('label', {},
      row[0])
    };
    return row;
  },
  _render: function(rows, no_rows) {
    return tags.table(rows, this.table_props, {
      row_filter: this._row_filter
    }) + (no_rows ? no_rows.join("\n") : '');
  },
  _field_row: function(field) {
    
 //   console.log('rendering field: ');
  //  console.log(field);    
  
    if (field.hasOwnProperty('container_props')){
      var cp = field.container_props();
    } else {
     //  console.log ('no cp:');
     //  console.log(field);
       var cp = {};
    }
    return {
      row_props: cp,
      cells: [field.render_label(), field.render_tag()]
    };
  },
  _render_foot: function() {
    var out = this._suffix;
    return out;
  },
  _render_head: function() {
    var out = tags.tag('form', this._form_props, '', tags.TAG_MODE_OPEN);

    out += this._prefix;

    return out + tags.tag('form', null, null, tags.TAG_MODE_CLOSE);
  }
}