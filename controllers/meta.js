var fs = require('fs');
var path = require('path');
var meta = require('models/meta');

module.exports = exports = {

    index: function(req, res) {
        var cn = [];
        fs.readdir(__dirname,
        function(err, files) {
            if (err) throw err;
            files.forEach(function(file) {
                //       console.log('index: found file ' + file);
                if (/\.js$/.test(file)) {
                    //     console.log('pushing ' + file);
                    cn.push(file.replace(/\.js$/, ''));
                    //   console.log('cn = ');
                    //     console.dir(cn);
                } else {
                    //   console.log('... failed test - skipping');
                }
            });
            var options = {
                locals: {
                    cn: cn,
                    form: require('./../forms/meta/controller').form().render()
                }
            };
            //     console.dir(options);
            res.render(options);
        });
    },

    show: function(req, res, next) {
        var controller_path = __dirname + '/' + req.params.id + '.js';
        var provider_path = __dirname + '/../model/' + req.params.id + '.js';

        var controller = '';
        var provider = '';

        var c_read_path = fs.createReadStream(controller_path);
        c_read_path.on('data',
        function(data) {
            controller += data;
        });

        c_read_path.on('end',
        function() {
            console.log('show end');
            var p_read_path = fs.createReadStream(provider_path);
            p_read_path.on('data',
            function(data) {
                provider += data;
            });
            p_read_path.on('end',
            function() {
                var options = {
                    locals: {
                        provider: provider,
                        controller: controller,
                        name: req.params.id
                    }
                };
                console.log('show - render');
               // console.dir(options);
                res.render(options);
            }); // end p_read_path_on(end);
        }); // c_read_path.on(end);
    },

    create: function(req, res, next) {

        c = req.body.controller;
        var controller_path = __dirname + '/' + c.name + '.js';
        var provider_path = __dirname + '/../model/' + c.name + '.js';

        if (!c.name) {
            req.flash('info', 'Please include name for your new controller');
            res.redirect('back');
            return;
        }

        function try_and_render() {
            console.log('try_and_render');

            var controller = '';
            var provider = '';

            var c_read_path = fs.createReadStream(controller_path);
            c_read_path.on('data',
            function(data) {
                controller += data;
            });

            c_read_path.on('end',
            function() {
                var p_read_path = fs.createReadStream(provider_path);
                p_read_path.on('data',
                function(data) {
                    provider += data;
                });
                p_read_path.on('end',
                function() {
                    var options = {
                        locals: {
                            provider: provider,
                            controller: controller,
                            name: controller_path
                        }
                    };
                    console.log('try and render');
                    console.dir(options);
                    res.render('meta/show', options);
                }); // end p_read_path_on(end);
            }); // c_read_path.on(end);
        }

        function make_provider() {
            console.log('maake provider for ' + provider_path);
            path.exists(provider_path,
            function(exists) {
                console.log(provider_path + ' exists: ' + exists);
                if (exists) {
                    req.flash('There is already a provider for controller ' + c.name);
                    try_and_render();
                } else {
                    var options = {
                        path: provider_path,
                        name: c.name
                    };
                    console.log('adding provider');
                    console.dir(options);
                    meta.add_provider(options, try_and_render);
                }
            })
        }

        path.exists(controller_path,
        function(exists) {
            console.log(controller_path + ' exists: ' + exists);
            if (!exists) {
                var options = {
                    path: controller_path,
                    name: c.name,
                    actions: split_actions(c.actions)
                };
                console.log('adding controller for ' + c.name);
                console.dir(options);

                meta.add_controller(options,
                function() {
                    req.flash('info', 'controller created (unless it already exists!)');
                    var f = fs.createReadStream(controller_path);
                    var data = '';
                    f.on('data',
                    function(d) {
                        data += d;
                    }); // end on/data
                    f.on('end', make_provider); // end render
                }); // end on/end
            } else {
                req.flash('error', 'There is already a file for controller ' + c.name);
                make_provider();
            }
        }); // end path.exists
    }
}

function split_actions(a) {
    var out = [];
    for (var i = 0; i < c.actions.length; ++i) {
        var action = c.actions[i];
        var real_actions = action.split("+");
        for (var r = 0; r < real_actions.length; ++r) {
            out.push(real_actions[r]);
        }
    }
    return out;
}