var fs        = require('fs');
var deformer  = new require('deformer');

var fields = {
   'user[un]':  { type: 'text', label: 'Member Name'},
   'user[pw]': {type: 'password', label: 'Password', required: true},
   submit: {type: 'submit', label: 'Sign In'} 
}

var form_props = {
  action: '/login',
  method: 'post'
}

module.exports.form = form = function (values){
  var form = new deformer.Form(fields, form_props);
  if (values) {
    form.set_values(values);
  }  
  return form;
}

module.exports.cache = function(){
  var write = fs.createWriteStream(__dirname + '/add.html');
  var render = module.exports.form().render();
  
 // console.log(render);
  write.write(render);
  write.end();
  return render;
}

module.exports.get_cached = function (callback){
  require("path").exists(__dirname + '/add.html', 
  function(exists) { 
    if (exists){
      var r = fs.createReadStream(__dirname + '/add.html');
      var data = '';
      r.on('data', function(chunk){data += chunk; });
      r.on('end', function(){callback(data);});
    } else {
      callback(module.exports.cache());
    }
  }
)};
