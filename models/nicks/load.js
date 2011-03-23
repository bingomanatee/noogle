module.exports = {
        enable: function(model) {
                for (i in this) {
                        if (i != 'enable') {
                                model[i] = this[i];
                        }
                }
        },

        _load_nicks: function(callback) { // nicks not used at this point
                var lines = require('models/lines');
                var self = this;
                nm = function() {
                        emit(this.nick, 1);
                }

                nr = function(key, current) {
                        var c = 0;
                        for (var i in current) c += current[i];
                        return c;
                },

                lines.model(function(err, line_model) {
                        if (err) throw err;

                        line_model.config.db.command({
                                mapreduce: "lines",
                                map: nm.toString(),
                                reduce: nr.toString(),
                                out: "nick_weight"
                        },

                        function() {
                                console.log(__filename + '::_load_nicks inserting new nicks - wait ten seconds. ');
                                setTimeout(function() {
                                        var nick_weight = require('models/nick_weight');
                                        nick_weight.model(function(err, nw_model) {
                                                nw_model.config.coll.find_p({

},
                                                function(err, cursor) {
                                                        if (err) throw err;
                                                        console.log(__filename + '::_load_nicks paginating through cursor');
                                                        cursor.each(function(err, doc) {
                                                                if (err) throw err;
                                                                self._add_weight_nick(err, doc);
                                                        });
                                                });
                                        });
                                },
                                10000);
                        });
                });

        },

        _add_weight_nick: function(err, doc) {
                var self = this;
                if (err) {
                        console.log(__filename + '::__add_weight_nick:: error ');
                        console.log(err);

                } else if (doc) {
                        console.log('Checking user ' + doc._id);
                        self.config.coll.findOne({
                                _id: doc._id
                        },
                        function(err, old_doc) {
                                if (old_doc) {
                                        //         console.log('updating old doc');
                                        old_doc.total_lines = doc.value;
                                        doc = old_doc;
                                        self.config.coll.update({
                                                _id: doc._id
                                        },
                                        doc);
                                } else {
                                        //            console.log('inserting new doc');
                                        doc.canonical_nick = doc._id; // backwards compatible - hope to phase out
                                        doc.lines = [];
                                        doc.is_alias = false;
                                        doc.nicks = [doc._id];
                                        doc.total_lines = doc.value;
                                        delete(doc.value);
                                        self.config.coll.insert([doc]);
                                }
                                //    console.log(doc);
                        });
                } else {
                        console.log('Done');
                }
        }
}