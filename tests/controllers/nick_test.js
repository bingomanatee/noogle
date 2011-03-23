require('./../context');

var nick = require('./nick');

nick.show({
    params: {
        id: 'bingomanatee'
    }
},
{
    render: function(path, params) {
        console.log('path: ' + path);
        console.log(params);
    }
});