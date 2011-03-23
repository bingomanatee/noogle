var tags = require('./../tags');

module.exports.Field =  (function() {
  function Field() {
    Field.__super__.constructor.apply(this, arguments);
  }
  require('./../inherit').extends(Field, require('./../field').Field);

  Field.prototype.render_type = function() { return 'submit';}
  Field.prototype.render_options = function(){
    console.log(__filename + 'rendering value');
    var out = '';
    
    for (var value in this.options){
        var label = this.options[value];
        console.log('adding option ' + value + ':=' + label);
        out += tags.tag('option', {value: value},label);
    };
    return out;
  };
  Field.prototype.render_tag_props = function(){
        return {
          name: this.name
        };
  };
  Field.prototype.render_tag = function() {
    return tags.tag('select', this.render_tag_props(), this.render_options());
  };
  return Field;
})();
