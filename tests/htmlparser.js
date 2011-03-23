require('./../context');

var dp = require('docparser');
var url = "http://nodejs.org/docs/v0.4.0/api/modules.html";

dp.chunk_url(url, function(err, doc){
    console.log('****************** DOC *********************');
    console.log(doc);
})

