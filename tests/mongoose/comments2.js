require('./../../context');

var provider = require('models/mongoose/comments');

var Comment = provider.model();

Comment.find({}, function(err, d){
    d.forEach(function(dd){
        console.log(dd);
    })
    
})