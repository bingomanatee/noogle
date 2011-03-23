var provider_utils = require('./utils');
var repository = [
    { id: 1, url: 'nodejs.debuggable.com', path: '/', root: 'http://nodejs.debuggable.com/'},
];
var _defaults = {id: 0, name: 'untitled'};

/**
 * Note - this is a "mock repository" for developing
 * your application and testing it against a stock dataset. 
 * supplant your provider functions with true repository calls
 * to enable a fully developed application. 
 */
module.exports = exports = {
    
    all: function(){
      return repository;
    },

    add: function (record){
      record.id = provider_utils.next_id(storys);
      provider_utils.extend(record, _defaults);
      
      provider.add(story);      
    },

    get: function(id, fn) {
        return provider_utils.get(repository, id, fn);
    },
    
    update: function(record, fn){
      provider_utils.update(repository, record, fn);
    },
    
    /**
     * note that unlike other actionable 
     * calls in the provider,
     * delete requires only the ID. 
     */
    'delete': function(id, fn){
      provider_utils.delete(repository, id, fn);
    }

}