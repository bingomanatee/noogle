var st = require('util/work_stack');

module.exports = {
    enable: function(model) {
        for (i in this) {
            if (i != 'enable') {
                model[i] = this[i];
            }
        }
    },

/*
 * The stack will hold the callback untill all the updated nicks have been pushed.
 */
    _update_all_line_counts: function(callback) {
        var self = this;
        if (!(typeof (callback) == 'function')) throw new Error(__filename + ':: _update_all_line_counts not passed functional callback');
        var stack = new st.Stack(callback);
        stack.log_work('nick insertion', 10);
        this.config.coll.find(function(err, cursor) {
            if (err) throw err;
            cursor.each(function(err, nick) {
                if (nick) {
                    stack.add_work();
                    self.update_nick_line_count(nick,
                    function() {
                        stack.remove_work();
                    });
                }

            });
        });
        stack.start();
    },
    /*
     * the stack in this method delays the insertion of the nick until
     * all the lines have been accounted for.
     */
    
    _update_line_count: function (nick, callback){
        if (!(typeof (callback) == 'function')) throw new Error(__filename + ':: _update_Line_count not passed functional callback');
        var self = this;
        if (_.isArray(nick)){
            var stack = new st.Stack(callback);
            stack.log_work(__filename + '::_update_line_count for ' + nick[0].canonical_nick);
            for (var i in nick){
                stack.add_work();
                this._update_line_count(nick[i], function(){ stack.remove_work(); });
            }
            stack.start();
            return;
        }
        
        nick.lines = [];

        var re = /\/([^.]+)\.[\w]+$/;
        function date_of(txt) {
            var e = re.exec(txt);
            return (e && e[1]) ? e[1].replace(/-/i, '_') : '';
        }
        var echo = 0;
        var nf = require('models/nicks_freq');
        
        var stack = new st.Stack(function(){
            self.put(nick, callback);
        });
        stack.add_work();
        stack.log_work(nick.canonical_nick + '::update line freq');
        
        nf.model(function(err, nf_model) {
            nf_model.find({
                "value.nick": nick.canonical_nick
            },
            function(err, f_lines) {
                var total_lines = 0;
                for (var i in f_lines) {
                    var lf = f_lines[i].value;
                    var date = date_of(lf.url);
                    var lines = lf.lines;
                    nick.lines.push({
                        date: date,
                        lines: lines
                    });
                    total_lines += lines;
                }
                nick.total_lines = total_lines;
                
                stack.remove_work();
            });

        });
        stack.start();
        
    }

}