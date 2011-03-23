var fs        = require('fs');
var deformer  = new require('./../../lib/deformer/deformer');

var fields = {
    'chapter[name]':  {
        type: deformer.TEXT,
        label: 'Chapter Title',
        required: true
    },
    'chapter[text]': {
        type: deformer.TEXTAREA,
    label: 'Chapter', required: true},
    'chapter[id]': {type: 'hidden'},
    'chapter[story]': {type: 'hidden'},
    submit: {type: 'submit', label: 'Save Chapter'}
}

var form_props = {
    action: '/chapters/0', // should be overrridden below
    method: 'post'
}

module.exports.form = function (chapter, story) {
    console.log('chapter: ');
    console.log(chapter);

    console.log('story: ');
    console.log(story);

    var form = new deformer.Form(fields, form_props);
    if (chapter) {
        form.set_values(chapter, {prop_prefix: 'chapter[', prop_suffix: ']'});
        form.set_action( '/chapters/' + chapter.id + '/update');
    } else if (story){
        form.set_action('/chapters/' + story.id + '/create');
    }
    if (story){
        form.fields['chapter[story]'].value = story.id;
    }
    return form;
}
