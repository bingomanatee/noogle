var mongoose_module = require('lib/mongoose');

module.exports = {
    
    init: function(){
       if (!module.exports.connected){
        mongoose_module.connect('mongodb://localhost/noogle');
        module.exports.connected = true;
       }
    },
    
    connected: false   
}