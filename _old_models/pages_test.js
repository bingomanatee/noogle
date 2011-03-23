var http = require('http');

var c = http.createClient(80, process.argv[2]);

var r = c.request('GET', process.argv[3], {host: process.argv[2]});
r.on('response', function(re){
    console.log(re);
    
    re.setEncoding('utf8');
    re.on('data', console.log);
})
r.on('error', function(e){ console.log(e)});

r.end();
