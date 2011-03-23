require('./../context');
var ws = require('util/work_stack');
var nicks = require('models/nicks');

nicks.model(function(err, model) {
    var query = {
        _id: new RegExp(/_+$/)
    }
    var s = new ws.Stack(function(){ model.config.db.close(); console.log('done')});

    model.config.coll.find(query,
    function(err, cursor) {
        cursor.each(function(err,nick_) {
            if (nick_) {
                s.add_work();
                console.log(nick_._id);
                var base_nick_name = nick_._id.replace(/_+$/, '');                
                model.get(base_nick_name, function(err, base_nick){
                    if (err) {
                        console.log('error finding base: ');
                        console.log(err);
                        s.remove_work();
                    } else if (base_nick){
                        model.add_alias(base_nick, nick_._id, function(){s.remove_work();} );         //asynchronous                                       
                    }  else {
                        s.remove_work();
                    }
                }); // end find base
            }
        });
    }); // end find
    
    s.log_work('looking for aliases', 10);
    s.start();
    
})