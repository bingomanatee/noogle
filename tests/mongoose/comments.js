require('./../../context');

var provider = require('models/mongoose/comments');

var Comment = provider.model();

var new_comment = new Comment();

new_comment.title = 'Foo';
new_comment.body  = 'Foo body';

new_comment.save(function(err){
    if (!err){
        console.log('saved');
    }
});