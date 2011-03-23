module.exports.Field =  (function() {
  function Field() {
    Field.__super__.constructor.apply(this, arguments);
  }
  require('./../inherit').extends(Field, require('./../field').Field);

    Field.prototype.render_tag = function(){
      console.log('chb: custom render');
      
        var props = this.render_tag_props();
        var tags =  require('./../tags');
        var out = '';
        
        for (var i = 0; i < this.options.length; ++i){
           var option = this.options[i];
           var props = {
             type: 'checkbox',
             name: option.name,
             value: option.value
           }
           if (option.hasOwnProperty('on') && option.on){
            props.checked = 'checked';
           }
           out +=  tags.tag('label', {style: 'display: block'}, tags.tag('input', props) + option.label);
        }
        return out;
    };
    console.log('here is a checkbox field');
  return Field;
})();