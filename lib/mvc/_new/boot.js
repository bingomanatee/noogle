var fs = require('fs');
var route = require('./route');

module.exports = {

    load: function(app, root) {
        var components = {}
        fs.readdirSync(root + '/components').forEach(function(dir) {
            console.log(__filename + ' : booting ' + dir);
            var c_path = root + '/components/' + dir;
            module.exports.boot(app, components, c_path);
        });
    },

    boot: function(app, components, component_path) {
        var comp = require(component_path); // load index file of component
        components[comp.name] = comp;
        fs.readdirSync(component_path).forEach(function(dir) {

            console.log(__filename + ' : booting component ' + dir);

            switch (dir) {
            case 'm':
            case 'model':
                module.exports._add_models(comp, component_path + '/' + dir);
                break;

            case 'v':
            case 'view':
            case 'templates':
                break;

            case 'c':
            case 'controller':
                module.exports._add_controllers(app, comp, component_path + '/' + dir);
                break;

            default:
                console.log(__filename + '::boot:: cannot understand ' + component_path + '/' + dir);
            }
        });

    },

    _add_models: function(comp, path) {
        console.log(__filename + '::add_model:: adding models in ' + path);

        fs.readdirSync(path).forEach(function(dir) {
            var model_path = path + '/' + dir;
            console.log(__filename + '::add_models loading model ' + model_path);
            var model = require(model_path).Model;
            comp.models[model.name] = model;
            model.all(null,
            function(err, data) {
                data.forEach(function(u, i) {
                    console.log('model ' + model.name + ' item ' + i);
                    console.log(u);
                })
            });
        });

    },

    _add_controllers: function(app, comp, path) {
        console.log(__filename + '::_add_controllers:: adding controllers in ' + path);
        fs.readdirSync(path).forEach(function(item) {
            route.route(app, comp, path + '/' + item);
        });
    }
}