var fu = require('./file_utils');
/*

var url = 'google.com/';

console.log('page data from ' + url);

console.log(fu);

var page_txt;
fu.read_url(null, url,
function(err, txt) {
    console.log('found txt');
    console.log(txt);
    
    fu.links_in_txt(null, txt,
    function(err, links) {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log('links in txt');
        console.log(links);
    });
}); */

var fs = require('fs');

var rt = fs.createReadStream(__dirname + '/sample_data.txt');

var txt = '';

rt.on('data', function(t){
    console.log('reading ' + txt.substring(0, 100) + "...");
      txt += t;
});

rt.on('error', function(err){
    console.log('error');
    console.log(err);
    });

rt.on('end', function(){
    console.log('digesting text ' + txt.substring(0, 100) + '...');
    fu.lines_in_txt(txt, function(err, lines){
        console.log('err: ');
        console.log(err);
        console.log('lines:');
        console.log(lines);
        });
});

