
module.exports.Field =  (function() {
  function Field() {
    Field.__super__.constructor.apply(this, arguments);
  }
  
  require('./../inherit').extends(Field, require('./../field').Field);
  Field.prototype.no_frame = true;
  Field.prototype.type = 'hidden';
  return Field;
})();