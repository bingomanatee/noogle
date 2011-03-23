module.exports = {
    enable: function(model) {
        for (i in this) {
            if (i != 'enable') {
                model[i] = this[i];
            }
        }
    },

    _nick_names: function(canonical, callback) {
        console.log(__filename + '::nick_names - getting nicknames');
        if (canonical) {
            params = {
                query: {
                    is_alias: false
                }
                //  fields: {'canonical_nick': 1}
            }
        } else {
            params = {};
        }
        this.config.coll.find_p(params,
        function(err, cursor) {
            if (err) {
                console.log(__filename + 'error in finding nicks:');
                console.log(err);
                callback(err);
            } else {
                cursor.toArray(function(err, a) {
                    console.log('names: first 4 ');
                    console.log(a.slice(0, 4));

                    var names = [];

                    for (var i in a) {
                        names.push(a[i].canonical_nick);
                    }
                    names = _.sortBy(names,
                    function(n) {
                        return n;
                    });
                    console.log('returning names (first 4)');
                    console.log(names.slice(0, 4));
                    callback(null, names);
                });
            }

        });

    },

    _aliases: function(callback) {

        var query = {
            alias_of: {
                '$exists': true
            }
        };

        this.config.coll.distinct('_id', query, callback);
    }
}