var _ = require('util/underscore');
var Model = require('mvc/model');
var mongo = require('mongodb');
/*
 ' Note - there are differences between methods like find and all
 * and analogous methods in the collection class.
 * in the case of get, one object is returned from the collection
 * (not an array of objects).
 * find and all returns an array of objects, not a cursor.
 * 
 */
module.exports = exports = {
    make_model: function(collection_name, config, mixins, callback) {
        
        if (!config || (!config.db)) {
            callback(new Error('no db in config'));
        }
        config.db.collection(collection_name,
        function(err, coll) {
             // console.log(__filename + ':: make_model:: 12 making model ' + collection_name);
            if (err) {
                 // console.log(__filename + ':: make_model: 14 error making database');
                 // console.log(err);
                callback(err);
            } else {
                config.coll = coll;
                var name = config.db.databaseName + '.' + collection_name;
                try {
                    var mongo_model = new Model(name, null, config, module.exports.mixins);
                    if (mixins){
                        _.extend(mongo_model, mixins);
                    }
                     // console.log(__filename + ': make_model:: 22 new model');
               // console.log(mongo_model);
                    callback(null, mongo_model);
                } catch(err2) {
                     // console.log(__filename + '::make_model:: 26 error making model');
                     // console.log(err2);
                    callback(err2);
                }
            };
        })
    },

    mixins: {

        all: function(callback) {
            q = this.soft_delete ? {deleted: {"$ne": true}} : {};
            this.find(q, callback);
        },
        
        count: function(q, callback){
            return this.config.coll.count(q, callback);  
        },

        _as_oid: function(id) {
             console.log(__filename + '::_as_oid: id ' + id);
            
            if (typeof(id) == 'string') {
                if (this.string_id){
                    console.log(__filename + ':: returning input (asid)');
                    return id;
                }
                var mongo = require('mongodb');
              // console.log(mongo);
                var BSON = mongo.BSONPure;
                return new BSON.ObjectID(id);
            } else {
                return id;
            }
        },
        
        string_id: false,

        get: function(id, callback) {
             // console.log(__filename + '::get id ' + id);
            if (!this.hasOwnProperty('_as_oid')){
                throw new Error('no _as_oid');
            }
            id = this._as_oid(id);
             // console.log(id);
            this.find({
                _id: id
            },
            function(err, result){
                callback(err, result ? result[0] : null);
            });
        },
        
        "delete": function(id, callback){
            console.log(__filename + ':: deleting ' );
            var query = {_id: this._as_oid(id)};
            console.log(query);
            if (this.soft_delete){
                console.log(__filename + ': soft deleting');
                this.config.coll.findAndModify(query, null, {"deleted": true}, true, false, callback);
            } else if (this.config.coll) {
                this.config.coll.remove(query, callback);
            } else {
                callback(new Error('No Connection'));
            }
            
        },
        
        

        put: function(data, callback) {
             // console.log(__filename + '::put::this');
      // console.log(this);
            if (this.config.coll) {
                if (data._id) {
                    this.update( data, callback, {_id: data._id});
                } else {
                    this.insert(data, callback);
                }
            } else {
                callback(new Error('No Connection'));
            }
        },

        insert: function(data, callback) {
             // console.log('inserting mongo data ');
             // console.log(data);
            this.config.coll.insert(data, callback);
        },
        
        soft_delete: false,
        
        delete: function(id, callback){
            var self = this;
            
            this.get(id, function(err, data){
                if (err){
                    callback(err);
                } else if (!data) {
                    callback(new Error('no record found'))
                } else if (self.soft_delete){
                    data.deleted = true;
                    self.put(data, callback);
                } else {
                    this.config.callback.delete(data, callback);
                }
            });
        },

        update: function(data, callback, filter, options) {
            if (this.config.coll) {
                if (!filter) {
                    if (data._id){
                    filter = {_id: data._id};
                    } else {
                        callback(new Error('attempt to update with no filter'));
                    }
                }
                 // console.log(__filename + '::update updating where ');
                 // console.log(filter);
                
                this.config.coll.update(filter, data, options, callback);
            } else {
                callback(new Error('No Connection'));
            }
        },

        find: function(query, callback, options) {
            if (typeof(query) == 'function'){
                callback = query;
                delete(query);
                var query = {};                
            }
            if (typeof (callback) != 'function'){
                console.log(__filename = ':: find callback = ' );
                console.log(callback);
                throw new Error(__filename + '::find:: no callback');
            }
            if (this.config.coll) {
                var handle = function(err, cursor) {
 
                    if (err) {
                         // console.log('error in finding ');

                        callback(err);
                    } else {
                        cursor.toArray(function(e, a) {
                             // console.log('find1');
                             // console.log(e);
                             // console.log(a);
                            callback(e, a);
                        });
                    }
                }
                
                 // console.log(__filename + '::find:: finding ');
                 // console.log(query);

                if (options) {
                    this.config.coll.find(query, options, handle);
                } else {
                    this.config.coll.find(query, handle);
                }
            } else {
                callback(new Error('No Connection'));
            }
        }
    }
}