module.exports.Field = (function() {

    function Field(data) {
        this._digest(data);
    }

    Field.prototype._digest = function(data) {
        if (data) {
            for (var prop in data) {
                this[prop] = data[prop];
            }
        }
      //  console.log('new field');
      //  console.log(this);
    }
    Field.prototype.type = 'text';
    Field.prototype.name = '';
    Field.prototype.className = '';
    Field.prototype.id = '';
    Field.prototype.value = null;
    Field.prototype.label = '';
    Field.prototype.required = false;
    Field.prototype.no_frame = false;
    
    Field.prototype.render_value = function(){
      if (this.value === null){
        return '';
      }
      return new String(this.value);
    },
    
    Field.prototype.render_type = function(){
        return this.type
    };
    
    Field.prototype.render_tag_props = function(){
        var out = {
          type: this.render_type(),
          name: this.name,
          value: this.render_value()
        };
        if (this.className){
            out["class"] = this.className;
        }
        return out;
    };
    
    Field.prototype.render_tag = function(){
        var props = this.render_tag_props();
        return require('./tags').tag('input', props);
    };
    
    Field.prototype.container_props = function(){
        return this.row_props();
    };

    Field.prototype.render_label = function(max_length) {
        var label = '&nbsp;';
        if (this.label) {
            if (max_length && max_length > label.length) {
                label = this.label.substring(0, max_length) + '...';
            } else {
                label = this.label;
            }
        }
        return label;
    }

    Field.prototype.render_value = function() {
        if (this.value === null) {
        var out = '';
        } else {
            var out = this.value;
        }
        console.log('render_value of ' + this.name + ' = ' + out);
        return out;
    }

    Field.prototype.render_id = function(prefix) {
        if (this.id) {
            return this.id;
        } else {
            return this.prefix + '_' + this.name;
        }
    }

    Field.prototype.row_props = function() {
        var row_props = {};
        if (this.required) {
            row_props.className = 'required';
        }
        return row_props;
    }

    return Field;
})();