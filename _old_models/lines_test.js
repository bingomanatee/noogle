global.TEST_NOOGLE_DB = true;

var lines = require('./lines');

/**
 *note - this uses a "mock data source" to echo inserts
 */

var state = {
    end: '',
    line: 1,
    data: false,
    model: {
        open: function(callback){
            console.log('opening: ');
            callback(null, state.coll, state);
        }
    },
    coll: {
        remove: function(selector, callback) {
            console.log('removing: ');
            console.log(selector);
            if (callback) {
                callback();
            } else {
                console.log('no callback?');
            }
        },
            insert: function(data, callback) {
                console.log('inserting: ');
                console.log(data);
                if (callback) {
                    callback();
                }
            }
        }
    };

/*    lines._parse_lines("[18:51] <bingomanatee_> what I would do is find every single possible handler for IRC and do a try{} catch attempt to join in each one. \n" + "[18:51] <bingomanatee_> By brute force you should be able to figure out which hook to put your callback in.  \n" + "[18:51] <bingomanatee_> Don't envyy this approach.  \n" + "[18:51] <bingomanatee_> but it would work.  \n" + "[18:52] <bingomanatee_> Keep in mind this is VERY abstract problem solving on my part. " + "Node in general provides event hooks that exist to allow you to trigger callbacks at the first opportunity that is appropriate for them. \n" + "[18:53] <bingomanatee_> so it stands to reason that there is an event that triggers when conditions are right to join a channel. You just have to find that hook.  \n" + "[19:13] <ryah> <3 list \n" + "[19:16] <unlink> Does ClientRequest support httpss?", {
        insert: console.log
    },
    state);  */

    lines.refresh_page_lines('nodejs.debuggable.com/2009-12-07.txt',
    function(err, state) {
        if (err) {
            console.log('err: ');
            console.log(err);
        } else {
            console.log('state: ');
            console.log(state);
        }
    }, state);
    /*
lines.open(function(err, conn) {
    console.log('lines open handler');
    console.log(arguments);

    if (err) {
        console.log('test- error connecting to conn');
        console.log(err);
        var db = require('/noogle_db');
        db.close();
    } else if (conn) {
        console.log('test - connected to conn');
        console.log(conn);

        conn.insert([{
            foo: 1,
            bar: 2
        }],
        function() {
            conn.find({},
            {
                limit: 4
            },
            function(err, cursor) {
                console.log('paging through lines');
                cursor.each(function(err, doc) {
                    if (doc) {
                        console.log('');
                        console.log(doc);
                    } else {
                        lines.close();

                    }
                })
            });

        });
    } else {
        lines.close();
        console.log('where is my connection?');
    }
}); */
    