module.exports = exports = function(name, plural, action, fn) {

    return function(req, res, next) {

        var render = res.render,
        format = req.params.format,
        path = MVC_ROOT + '/views/' + name + '/' + action + '.html';

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