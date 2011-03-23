var content = require('./../controllers/content');

console.log( content._read(process.argv[2], process.argv[3], function(u, d){
    console.log('data from ' + u);
    console.log(d);
}));