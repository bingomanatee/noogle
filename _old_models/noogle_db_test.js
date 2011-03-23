global.TEST_NOOGLE_DB = true;

var noogle_db = require('./noogle_db');

noogle_db.open(function(err, db){
    if (err){
        console.log('test- error connecting to db');
        console.log(err);
    } else {
        console.log('test - connected to db');
        console.log(db);
    }
});