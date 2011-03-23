module.exports = {
    Stack: function(callback, context, args) {
        var t = typeof(callback);
        if (!(t == 'function')){
            switch (t){
                case 'object':
                    throw new Error('Object passed as callback  ' + JSON.stringify(callback));
                    break;
                
                case 'undefined':
                    throw new Error('Stack created without callback');
                    break;
                
                default:
                    throw new Error('Non function passed to stack: ' + callback);
            }
        }
        this._callback = callback;
        this._context = context ? contetxt: this;
        if (args) {
            this._args = args;
        }
    }
}

module.exports.Stack.prototype = {
    _callback: null,

    _args: {},

    _pending: 0,

    _started: false,

    _iter: null,
    
    _name: null,
    
    _inc: 1,
    
    _logging: false,
    
    log_work: function(name, inc){
        this._name = name;
        this._inc = inc ? inc : 1;
        this._logging = true;
    },

    add_work: function(items, msg) {
        if (!items) {
            items = 1;
        }
        if (this._pending < 1){
            this._pending = 0;
        }
        this._pending += items;
        if (msg) {
            if ((this._inc < 2) || ( this._pending % this._inc == 0)){
                console.log(msg + '(' + this._pending + ' total jobs)');
            }
        }
    },

    remove_work: function(items) {
        if (!items) {
            items = 1;
        }
        this._pending -= items;
        
        if (this._logging){
            if (this._inc == 1){
                console.log('Stack ' + this._name + ': ' + this._pending + ' tasks left');
            } else if (!(this._pending % this._inc)){                        
                console.log('Stack ' + this._name + ': ' + this._pending + ' tasks left( logging every ' + this._inc + ' items)');
            }
        }
    },

/*
* start can be callled repeatedly without hazard, even in a looping context.
* You can even wait to start the stack till you have several jobs underway. 
*/
    start: function(check) {
        if (this._logging){
            console.log('starting ' + this._name);
        }
        var self = this;
        
        if (!this._started) {
            this._started = true;
            if (!check) {
                check = 500;
            }
            this._iter = setInterval(function(){self._check.call(self)}, 500);
        }
    },
    
    reset: function(){
        this._started = false;
    },

    _check: function() {
    //    console.log('checking timeout');
      //  console.log(this);
        if (this._pending < 1) {
            clearInterval(this._iter);
            this._pending = 0;
            this._callback.call(this._context, this._args);
           // this._started = false;
        }
    }

}