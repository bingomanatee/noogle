module.exports.Field =  (function() {
  function Field() {
    Field.__super__.constructor.apply(this, arguments);
  }
  require('./../inherit').extends(Field, require('./../field').Field);
  Field.prototype.render_tag = function() {
    return require('./../tags').tag('textarea', this.render_tag_props(), this.render_value());
  };
  Field.prototype.render_type = function() {
    return 'textarea';
  }
  Field.prototype.render_tag_props = function(){
      var out = {
        name: this.name
      };
      if (this.hasOwnProperty('rows')){
         out.rows = this.rows;
      }
      if (this.hasOwnProperty('cols')){
        out.cols = this.cols;
      }
      console.log(__filename + ':: props');
      console.log(out);
      return out;
  };
  return Field;
})();