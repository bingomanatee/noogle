module.exports = {
    name: 'controller_template', // must be overridden!
    

    provider: function() {
        return module.exports._provider;
    },

    index: function(req, res, next) {
        res.render();
    },
    
    _l: function(result){
        var out = {};
        out[this.name] = result;
        return out;
    },

    show: function(req, res, next) {
        module.exports.provider().get(req.params.id, function(err, result) { (err) ? next(err) : res.render(this._l(result)); });
    },
    
    delete: function(req, res, next) {
        module.exports.provider().get(req.params.id, function(err, result) { err ? next(err) : res.render(result); });
    },

    destroy: function(req, res, next) {
        module.exports.provider().get(req.params.id, function(err, result) { err ? next(err) :
          module.exports.provider().delete(req.params.id, function(err, result) { res.render(result); });
        });
    },

    add: function(req, res, next) {
        res.render();
    },

    create: function(req, res, next) {
        /**
        * 
        * recieves response from add. 
        * note - the code below assumes that your form has fields
        * with names like "module.exports.name[foo]".
        * If your form does not use array notation for field names,
        * replace req.body.module.exports.name with req.body.
        */
        module.exports.provider().add(req.body[module.exports.name],
            function(err, result) { res.render();
        });

    },

    edit: function(req, res, next) {
        /* 
        * received by action 'update'
        */
        module.exports.provider().get(req.params.id,
        function(err, result) { err ? next(err) : res.render(this._l(result)); 
        });
    },

    update: function(req, res, next) {
        /**
        * 
        * note - the code below assumes that your form has fields
        * with names like "module.exports.name[foo]".
        * If your form does not use array notation for field names,
        * replace req.body.module.exports.name with req.body.
        */
        module.exports.provider().update(req.body[module.exports.name],
        function(err, result) {err ? next(err) : res.render(this._l(result)); 
        });
    }
}