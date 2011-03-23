var mongodb = require('./../lib/mongodb');
//dbh00.mongolab.com:27007/noogle -u <username> -p <password>
var host = 'dbh00.mongolab.com';
var port = 27027;

console.log('opening database');
require('../lib/mongodb/db').connect('mongo://aaabbb:1234567890@' + host + ':' + port + '/noogle', function(err, db) {
    if (err) {
        throw (err);
    } else {
        console.log('connected');
        db.dropCollection('made_with_node',
        function(err2, result) {
            if (err) {
                db.close();
                throw (err2);
            } else {
                console.log('dropped');
                db.collection('made_with_node',
                function(err3, collection) {
                    if (err3) {
                        db.close();
                        throw (err3);
                    } else {
                        collection.insert({
                            foo: 1,
                            bar: 2
                        },
                        function(err, data) {
                            if (err) {
                                db.close();
                                throw err;
                            } else {
                                console.log('inserted data');
                                console.log(data);
                                db.close();
                            }
                        });
                    };
                });
            };
        });

    }
});