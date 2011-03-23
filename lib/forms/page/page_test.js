require('./../../context');

var p = require('./page');

var f;

p.form({ 'page[name]': 'bob'},
function(err, form) {
  
    if (err) {
        throw err;
    } else {
        console.log(form.render());
    }
});