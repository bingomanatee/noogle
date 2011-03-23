module.exports = exports = {
    next_id: function(items) {
        id = 0;

        items.forEach( function(item) {
            id = Math.max(item.id, id);
        });
        return id + 1;
    },
    
    get_first_id: function(items) {
        var id = 0;

        items.forEach( function(item) {
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
        repos.forEach( function(s) {
            if ((!found) && (s.id == id)) {
                found = s;
               if (fn){
                  fn(null, s);
               } 
            }
        });
        if (fn && (!found)) {
            // console.log(storys);
            fn(new Error('record ' + id + ' does not exist'));
        }
        
        return found;
    },
    
    find: function (repos, fn){
      var out = [];
      repos.forEach(function(repos_item){
        if (fn(repos_item)){
          out.push(repos_item);
        }
      });
      return out;
    }
}