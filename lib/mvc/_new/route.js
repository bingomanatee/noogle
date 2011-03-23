var fs = require('fs');

module.exports = {
    pluralize: function(name) {
        return name + 's';
    },
    
    component_prefix: function(comp){
        var path = comp.hasOwnProperty('path') ? comp.path : comp.name;
        path = path.replace(/\/$/, '');
        if (path){
            return path + '/';
        } else {
            return '';
        }
    },
    
    route: function(app, component, controller_path) {
        if (!/\.js$/.test(controller_path)) {
            return;
        }
        var name = controller_path.replace('.js', '').split('/').pop();

        var controller = require(controller_path);
        var plural = module.exports.pluralize(name);
        
        console.log(__filename + '::route::' + name);
        console.log('plural: ' + plural);
        console.log('path: ' + controller_path);
        
        var actions = require(controller_path);
        
        prefix = plural;

        Object.keys(actions).map(function(action) {
            console.log(__filename + '::route:: action = ' + action);
            
            var fn = module.exports.controller_action(controller_path, name, plural, action, actions[action]);
            
            if (module.exports.route_patterns.hasOwnProperty(action)){
                method = 'get';
                suffix = module.exports.route_patterns[action];
                if (typeof(suffix) == 'object'){
                    method = suffix.method;
                    suffix = suffix.suffix;
                }
                
                path = prefix + suffix;
                console.log('adding route ' + path);
                                
                switch(method){
                    case 'get':
                        console.log('GET: ' + path);
                     //   console.log('handler: ' + fn.toString());
                        app.get(path, fn);
                        break;
                    
                    case 'put':
                        console.log('PUT: ' + path);
                        app.put(path, fn);
                        break;
                    
                    case 'del':
                        console.log('DELETE: ' + path);
                        app.del(path, fn);
                        break;
                }
            }
        });
    },
    
    route_patterns: {
        index:  '',
        show: '/:id.:format?',
        add: '/id/add',
        create: {
            suffix: '/:id',
            method: 'post'
        },
        edit:  '/:id/edit',
        update: {
            suffix: '/:id',
            method: 'put'
        },
        refresh: '/:id/refresh',
        delete: {
            method: 'del',
            suffix: '/:id'
        }
    },

    controller_action: function(controller_path, name, plural, action, fn) {
        console.log('creating action ' + action + ' for fucntion ' );
        console.log(fn.toString());
        
        return function(req, res, next) {

            var render = res.render,
            format = req.params.format,
            path = controller_path + '/../v/' + name + '/' + action + '.html';
            console.log('view path: ');
            console.log(path);
            
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
}