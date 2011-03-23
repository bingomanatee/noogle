require('./../../context');

var provider = require('models/mongoose/pages');

var Pages = provider.model();

Pages.find({type: 'documentation', 'deleted' : {"$ne": true}},
    
    function(err, docs){
     docs.forEach(function(doc) {
         console.log(doc.url + ': ');

             console.log(doc.sections.length);
             
             if (doc.sections.length > 1){
                 var ts = doc.sections[1];
                 console.log(ts.name);
             }
         
     })
    }
)