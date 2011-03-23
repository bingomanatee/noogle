module.exports = {
        enable: function(model) {
                for (i in this) {
                        if (i != 'enable') {
                                model[i] = this[i];
                        }
                }
        },

        _sims_for: function(nick, callback) {
                if (!nick){
                        console.log('empty nick passed to _sims_for');
                        return callback(null, []);
                }
                console.log(__filename + '::_sims_for passed');
                console.log(nick);
                if (typeof(nick) == 'object') {
                        console.log(__filename + '::_sims_for reducing object');
                        console.log(nick);
                        nick = nick._id;
                }
                var nick_name = nick.replace(/^[_0-9]*/, '').replace(/[_0-9]*$/, '');
                if (!nick_name) {
                        return callcack(null, []);
                }
                var query = {
                        canonical_nick: new RegExp(nick_name, 'i')
                };

                this.config.coll.distinct('canonical_nick', query,
                function(err, sims) {
                        if (err) return callback(err);
                        sims = _.sortBy(sims,
                        function(a) {
                                return a;
                        });
                        console.log('sims query for ' + nick);
                        console.log(sims);
                        callback(null, sims);
                });

        }
}