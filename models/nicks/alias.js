module.exports = {
        enable: function(model) {
                for (i in this) {
                        if (i != 'enable') {
                                model[i] = this[i];
                        }
                }
        },

        _add_alias: function(nick, alias, callback) { // to do: protect against circular aliasing
                var self = this;
                if (typeof(nick) == 'string') {
                        return this.get(nick,
                        function(err, old_nick) {
                                if (old_nick) {
                                        return self.add_alias(old_nick, alias, callback);
                                } else {
                                        return;
                                }
                        });
                }
                if (!nick.hasOwnProperty('nicks')) throw new Error('No nick for ' + JSON.stringify(nick));
                nick.nicks.push(alias);

                nick.nicks = _.sortBy(_.uniq(nick.nicks),
                function(a) {
                        return a
                });

                /*
 * Mark the alias nick
 * so it can be filtered out of views etc.
 */
                this.get(alias,
                function(err, alias_nick) {
                        if (alias_nick) {
                                alias_nick.alias_of = nick._id;
                                alias_nick.is_alias = true;
                                console.log('putting alias');
                                console.log(alias_nick);
                                self.put(alias_nick, callback);
                                
                        } else {
                                callback;
                        }
                }); // asynchronous
        }
}