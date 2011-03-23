var controller_action = require('./controller_action');

module.exports = exports = function(app, file, root) {
    if (!/\.js$/.test(file)) {
        return;
    }
    var name = file.replace('.js', ''),
    actions = require(root + '/' + name),
    plural = name + 's';
    // realistically we would use an inflection lib


    // Special case for "app"
    if (name == 'app') {
        prefix = '/';
    } else {
        prefix = '/' + plural + '/';    
    }

    Object.keys(actions).map(function(action) {
        var fn = controller_action(name, plural, action, actions[action]);
        //  console.log('mapping action ' + action);
        switch (action) {
        case 'index':
            var path = prefix;
            console.log('GET ' + path);
            app.get(path, fn);
            break;

        case 'show':
            var path = prefix + ':id.:format?';
            console.log('GET: ' + path);
            app.get(path, fn);
            break;

        case 'add':
            var path = prefix + ':id/add';
            console.log('GET: ' + path);
            app.get(path, fn);
            break;
        
        case 'create':
            var path = prefix + ':id';
            console.log('POST: ' + path);
            app.post(path, fn);
            break;

        case 'edit':
            var path = prefix + ':id/edit';
            console.log('GET: ' + path);
            app.get(path, fn);
            break;

        case 'update':
            var path = prefix + ':id';
            console.log('PUT: ' + path);
            app.put(path, fn);
            break;

        case 'refresh':
            var path = prefix + ':id/refresh';
            console.log('GET: ' + path);
            app.get(path, fn);
            break;

        case 'delete':
            var path = prefix + ':id/delete';
            console.log('GET: ' + path);
            app.get(path, fn);
            break;
        
        case 'destroy':
            var path = prefix + ':id';
            console.log('DEL: ' + path);
            app.del(path, fn);
            break;

        default:
            console.log('NON mvc controller method: ' + action);
        }
    });
}