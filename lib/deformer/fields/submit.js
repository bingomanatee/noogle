
module.exports.Field =  (function() {
  function Field() {
    Field.__super__.constructor.apply(this, arguments);
  }
  require('./../inherit').extends(Field, require('./../field').Field);
  
  Field.prototype.render_label = function() {
    return '&nbsp;';
  };
  
  Field.prototype.render_type = function() { return 'submit';}
  Field.prototype.render_value = function(){
    if (this.value){
      return this.value;
    } else {
      return this.label;
    }
  };
  return Field;
})();