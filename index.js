require('./context');

var express = require('express');
var pages_model = require('models/mongoose/pages');
var port = 3000;

var app = express.createServer();
require('./mvc').boot(app);
require('./route').route(app);

var page_module = require('models/mongoose/pages');

var Pages = page_module.model();

Pages.find({
    type: 'documentation',
    'deleted': {
        "$ne": true
    }
},

function(err, dmi) {
    var nr = /([\w_]+)(\.[\w]+)?$/;
    dmi.forEach(function(doc, i) {
        var n = nr.exec(doc.url);
        if (doc.sections.length > 1) {
            var ts = doc.sections[1];
            doc.name =(ts.name);
        } else if (n){
           dmi[i].name = n[1];
        } else {
            dmi[i].name = doc.url;
        }
        console.log(doc.url + ': ' + doc.name);

    })
    dmi = _.sortBy(dmi, function(n){return n.url});
    app.dynamicHelpers({
        session_user: function(req, res) {
            if (req.session.hasOwnProperty('session_user')) {
                return req.session.session_user;
            } else {
                return false;
            }
        },
        doc_menu_items: function(req, res) {
            return dmi;
        }
    })
    app.listen(port);
console.log('Express app started on port ' + port);
})
