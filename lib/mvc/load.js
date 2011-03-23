var express = require('express');

module.exports =
function bootApplication(app) {
    app.use(express.logger({
        format: ':method :url :status'
    }));
    
    var public_path = MVC_ROOT + '/public';
    console.log('setting public to ' + public_path);
    
    app.use(express.bodyDecoder());
    app.use(express.methodOverride());
    app.use(express.cookieDecoder());
    app.use(express.session({secret: Math.random()}));
    app.use(app.router);
    app.use(express.staticProvider(public_path));

    // Example 500 page
    app.error(function(err, req, res) {
        console.dir(err);
        res.render('500');
    });
    // Example 404 page via simple Connect middleware
    app.use(function(req, res) {
        res.render('404');
    });
    // Setup ejs views as default, with .html as the extension
    app.set('views', MVC_ROOT + '/views');
    app.register('.html', require('ejs'));
    app.set('view engine', 'html');

    // Some dynamic view helpers
    app.dynamicHelpers({
        request: function(req) {
            return req;
        },
        hasMessages: function(req) {
            return Object.keys(req.session.flash || {}).length;
        },
        messages: function(req) {
            return function() {
                var msgs = req.flash();
                return Object.keys(msgs).reduce(function(arr, type) {
                    return arr.concat(msgs[type]);
                },
                []);
            }
        }
    });
}

