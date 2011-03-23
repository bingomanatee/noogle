/**
 * While this model works fine for simple/small/nonpersistent data
 * it is intended to be more of an interface template
 * to be largely or wholly overwrote through mixins
 * than a working repository.
 * 
 * As an INTERFACE themplate, any additional parameters
 * required by mixin funcitons should occur AFTER the parameters
 * in the methods below.
 * 
 */

module.exports = Model = function(name, data, config, mixins) {

    if (mixins) {
        for (var p in mixins) {
            this[p] = mixins[p];
        }
    }

    this.name = name;
    this.data = data ? data: [];
    this.config = config ? config: {};

}

Model.prototype = {

    key: 'id',
    
    all: function(callback, sort){
        var data = this.data.slice(0);
        if (sort){
            try {
                callback(null, _.sortBy(data, sort));
            } catch(err){
                callback(err);
            }
        } else {
            callback(null, data);
        }
    },

    get: function(id, callback) {
        for (var index in this.data) {
            if (this.data[index] == id) return callback(null, data[index]);
        }
        return callback(new Error)
    },

    put: function(item, callback) {
        if (item.hasOwnProperty(this.key)) {
            this.update(item, callback);
        } else {
            this.insert(item, callback);
        }
    },
    
    delete: function(query, callback){
      var new_data = [];
      var deleted = [];
      var self = this;
      this.data.forEach(function(item){
        if (typeof(query) == 'function'){
            if (query(item)){
                new_data.push(item);
            } else {
                deleted.push(item);
            }
        } else {
            
            if (self._match(query, item)){
                deleted.push(item);
            } else {
               new_data.push(item);
            }
        }
      });
        this.data = new_data;
        
        callback(null, deleted);
    },
    
    _match: function(a, b){
        for(var p in a){
            if (a[p] != b[p]) return false;
        }
        return true;
    },

    insert: function(item, callback) {
        this._new_id(item);
        this.data.push(item);
        callback(null, item);
    },

/**
 * I know - its pretty verbose for scaffolding.
 * Wanted to allow for funcitonal and value baed updates
 * as well as single/multiple entry
 */
    update: function(item, callback, query) {
        if (query) {
            this.find(query,
            function(err, data) {
                if (err) {
                    callback(err);
                } else if (typeof(item) == 'function') {
                    var result = [];
                    data.forEach(function(data_item) {
                        var new_item = item(data_item);
                        if (new_item) {
                            this.update(new_item,
                            function(err, new_item) {
                                result.push(new_item)
                            });
                        }
                    });
                } else {
                    callback(new Error('query updates require functional item'));
                }
            });
        } else if (_isArray(item)) {
            var result = [];
            try {
                item.forEach(function(item_item) {
                    this.update(item_item,
                    function(err, result_set) {
                        if (err) throw (err);
                        result_set.forEach(function(rs_item) {
                            result.push(rs_item);
                        })
                    })
                })

                callback(null, result);
            } catch(err) {
                callback(err);
            }
        } else {
            result = [];
            try {
            this.data.forEach(function(old_item, index) {
                if (old_item.id == item.id) {
                    this.data[index] = item;
                    result.push(item);
                    throw new Error('done'); // yeah - its a hack. 
                }
            });
            } catch(error){
                if (err.message == 'done') {
                    callback(null, result);
                } else {
                    callback(error);
                }
            }
        }
    },

    _new_id: function(item) {
        if (!item.hasOwnProperty(this.key)) {
            item[this.key] = 0;
        }

        this.data.forEach(function(old_item) {
            if (item[this.key] <= old_item.id) {
                item[this.key] = old_item.id + 1;
            }
        });
    },

    find: function(query, callback) {
        try {
            callback(null, _.select(this.data, query));
        } catch(err) {
            callback(err);
        }
    }

}