module.exports.CRUD = function (name, provider, mixins){
  this._provider = provider;
  
  for(var prop in mixins){
    this[prop] = mixins[prop];
  }
  
}

module.exports.CRUD.prototype = {
  name: 'crud',
  
  _provider: false,
  
  _get_provider: function(){
    if (!this._provider){
      this._provider = new require('./provider').Provider(); // TODO
    }
  },
  
  index: function(req, res){
    res.render(this._get_provider().all());
  },
  
  
  
}
