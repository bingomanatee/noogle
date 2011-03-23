require("./../context.js");

var app = require('./app.js');

app.index(null, {
    render: function(path, locals){
        data = locals.data;
        for(var p in locals){
            console.log(p);
            console.log('');
        }
    console.log(locals.locals.data);
    }
}
);