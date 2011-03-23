var textarea = require('./fields/textarea');

var tf_props = { name: 'body', label: 'Texarea',
                                 value: 'bla', id: 'body_field'};
var tf = new textarea.Field(tf_props);

var text = require('./fields/text');

var txf_props = { name: 'count', label: 'Textfield',
                                 value: '3', id: 'count_field'};
var txf = new text.Field(txf_props);

var submit = require('./fields/submit');
var sub_props = {name: 'submit_btn', label: 'Submit Me'};
var sub = new submit.Field(sub_props);

console.log('textarea');
console.log(tf.render_tag());

console.log('text');
console.log(txf.render_tag());

console.log('submit');
console.log(sub.render_tag());

var deformer = require('./deformer');

tf_props.type = 'text';
txf_props.type = 'textarea';
sub_props.type = 'submit';
var form = new deformer.Form([tf_props, txf_props, sub_props],
                             {action: '/save'});

console.log(form.render());