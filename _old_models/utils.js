var path = require('path');
var fs = require('fs');

module.exports = exports = {
    load: function(txt, callback) {
       // console.log('load: ' + txt);
        if (txt.length < 400) { // assuming short blocks are paths -- keep your JSON long!
            exports._load_file(txt, callback);
        } else {
            path.exists(txt,
            function(exists) {
                if (exists) {
                    exports._load_file(txt, callback);
                } else {
                    callback(JSON.parse(txt));
                }
            });
        }
    },

    _load_file: function(path, callback) {
      //  console.log('loading JSON file ' + path);
        var s = fs.createReadStream(path);
        var db = '';
        s.on('data',
        function(data) {
            db += data;
        });
        s.on('error',
        function(err) {
            callback(err);
            s.end();
            callback = null
        });
        s.on('end',
        function() {
            if (callback) {
                try {
                  //  console.log('parsing JSON: ');
                    //console.log(db);
                    callback(null, JSON.parse(db));
                } catch(err) {
                    callback(err);
                }
            }
        });
    },

    next_id: function(items) {
        id = 0;

        items.forEach(function(item) {
            id = Math.max(item.id, id);
        });
        return id + 1;
    },

    get_first_id: function(items) {
        var id = 0;

        items.forEach(function(item) {
            if (item.id < id) {
                id = item.id;
            }
        });
        return id;
    },

    /**
     * return the first record with the id passed; 
     * also, optionally, passes found as the second parameter
     * of the callback. 
     */
    get: function(repos, id, fn) {
        var found = false;
        repos.forEach(function(s) {
            if ((!found) && (s.id == id)) {
                found = s;
                if (fn) {
                    fn(null, s);
                }
            }
        });
        if (fn && (!found)) {
            // console.log(storys);
            fn(new Error('story::get: Storys ' + id + ' does not exist'));
        }

        return found;
    },

    find: function(repos, filter, fn) {
        var out = [];
        repos.forEach(function(repos_item) {
            if (filter(repos_item)) {
                //     console.log('find - including ');
                //     console.dir(repos_item);
                out.push(repos_item);
            } else {
                //     console.log('find - excluding ');
                //     console.dir(repos_item);
            }
        });
        fn(null, out);
    },

    update: function(repos, record, fn) {
        var i = this.index_of(repos, record);
        if (i == -1) {
            throw new Error(__file + '::delete: cannot find record id ' + record.id);
        }
        repos[i] = record;
        return fn(record);
    },

    'delete': function(repos, id, fn) {
        var i = this.index_of(repos, {
            id: id
        });

        if (i == -1) {
            throw new Error(__file + '::delete: cannot find record id ' + record.id);
        }
        var old_record = repos[i];
        delete repos[i];
        fn(old_record);
    },

    index_of: function(repos, record, fn) {
        /**
       * note - returns index of first record with a 
       * matching ID. Does not take into account 
       * non-unique IDs. 
       */
        for (var i = 0; i < repos.length; ++i) {
            if (repos[i].id == record.id) return fn(null, i);
        }
        return fn(new Error('cannot find id'));
    },

    extend: function(data, defaults) {
        /**
 * note - some known/unresolved problems with array/object confusion
 */
        for (var property in defaults) {
            //        console.log('set_defaults: testing property ' + property);
            if ((typeof data[property]) == 'undefined') {
                //          console.log('set_defaults: data\'s property ' + property + ' is undefined.');
                // data DOES NOT have a value for property
                if (typeof(defaults[property]) == 'object') {
                    if (defaults[property] == null) {
                        //                console.log('setting value to null for ' + property);
                        data[property] = null;
                    } else {
                        //              console.log('default value is an object: ');
                        //            console.log(defaults[property]);
                        // property is a subdocument, so set and recurse.
                        data[property] = {};
                        def = defaults[property];
                        if (def == __NOW__) {
                            defaults[property] = new Date();
                        }
                        exports.extend(data[property], def);
                    }

                } else {
                    // data DOES NOT have a value for property,
                    // and property value is not an object
                    //      console.log('set_defaults: missing data property ' + property);
                    if (defaults[property] == null) {
                        //        console.log('setting to null;');
                        data[property] = null;
                    } else if (defaults[property] == __NOW__) {
                        data[property] = new Date();
                        //      console.log('setting property ' + property + ' to date');
                    } else {
                        data[property] = defaults[property];

                    }
                }
            } else if (typeof(defaults[property]) == 'object') {
                if (defaults[property] == null) {
                    // console.log('default property is null; skip');
                } else {
                    //        console.log('set_defaults: defined property ' + property + ' is object: recursing' + defaults[property]);
                    //       console.log(defaults[property]);
                    // that is -- data DOES have a value for property, but
                    // it is an object -- so we recurse
                    // assuming data.property is also an object
                    exports.extend(data[property], defaults[property]);
                }
            }
        }
    }
}