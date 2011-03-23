var fs = require('fs');
var user_module = {
    if_logged_in: function(req, res, next) {
        if (req.session.hasOwnProperty('user') && req.session.user) {
            console.log('if_logged_in:: pass');
            next();
        } else {
            console.log('if_logged_in:: fail');
            req.flash('error', 'You must be logged in to visit that page.');
            res.redirect('/');
        }
    }
};

exports.boot = // Bootstrap controllers
function(app, path) {
    fs.readdir(path,
    function(err, files) {
        if (err) throw err;
        files.forEach(function(file) {
            exports.boot_controller(app, file, path);
        });
    });
}

// Example (simplistic) controller support
exports.boot_controller = function(app, file, root) {
    if (!/\.js$/.test(file)) {
        return;
    }
    var name = file.replace('.js', ''),
    actions = require(root + '/' + name),
    plural = name + 's',
    // realistically we would use an inflection lib
    prefix = '/' + plural;

    // Special case for "app"
    if (name == 'app') {
        prefix = '/';
    }

    Object.keys(actions).map(function(action) {
        var fn = exports.controller_action(name, plural, action, actions[action]);
        //  console.log('mapping action ' + action);
        switch (action) {
        case 'index':
            var path = prefix;
            console.log('GET ' + path);
            app.get(path, fn);
            break;
        
        case 'show':
            var path = prefix + '/:id.:format?';
            console.log('GET: ' + path);
            app.get(path, fn);
            break;
        
        case 'add':
            var path = prefix + '/:id/add';
            console.log('GET: ' + path);
            app.get(path, fn);
            break;
        case 'create':
            var path = prefix + '/:id';
            console.log('POST: ' + path);
            app.post(path, fn);
            break;
        
        case 'edit':
            var path = prefix + '/:id/edit';
            console.log('GET: ' + path);
            app.get(path, fn);
            break;
        
        case 'update':
            var path = prefix + '/:id';
            console.log('PUT: ' + path);
            app.put(path, fn);
            break;
        
        case 'refresh':
            var path = prefix +'/:id/refresh';
            console.log('GET: ' + path);
            app.get(path, fn);
            break;
        
        case 'destroy':
            var path = prefix + '/:id';
            console.log('DEL: ' + path);
            app.del(path, fn);
            break;
        
        default:
            console.log('NON mvc controller method: ' + action);
        }
    });
}

exports.controller_action = function(name, plural, action, fn) {

    return function(req, res, next) {

        var render = res.render,
        format = req.params.format,
        path = __dirname + '/../../views/' + name + '/' + action + '.html';

        if (req.session.user) {
            global.user = req.session.user;
        } else {
            global.user = false;
        }
        res.render = function(obj, options, fn) {
            res.render = render;
            // Template path
            if (typeof obj === 'string') {
                return res.render(obj, options, fn);
            }

            // Format support
            if (action == 'show' && format) {
                if (format === 'json') {
                    return res.send(obj);
                } else {
                    throw new Error('unsupported format "' + format + '"');
                }
            }

            // Render template
            res.render = render;
            options = options || {};
            console.log('mvc render: obj');
            console.log(obj);

            if (obj) {
                if (obj.hasOwnProperty('locals')) {
                    options.locals = obj.locals;
                    delete obj.locals;
                } else {
                    options.locals = {};
                }
                // options.locals = obj.locals || {};
                // Expose obj as the local IF it has not already been assigned
                if ((action == 'index') && (!options.locals.hasOwnProperty(plural))) {
                    options.locals[plural] = obj;
                } else if (!options.locals.hasOwnProperty(name)) {
                    options.locals[name] = obj;
                }

            } else {
                options.locals = {};
            }
            return res.render(path, options, fn);
        };
        fn.apply(this, arguments);
    };
}