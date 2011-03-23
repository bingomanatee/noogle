
module.exports.Field =  (function() {
  function Field() {
    Field.__super__.constructor.apply(this, arguments);
  }
  
  require('./../inherit').extends(Field, require('./../field').Field);
  Field.prototype.type= 'password';
  return Field;
})();