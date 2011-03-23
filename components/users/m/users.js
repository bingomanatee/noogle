var model = require('mvc/model');

var config = {
    schema: {
        fields: {
            name: 'string',
            password: 'string',
            roles: 'string[]'
        }
    }
}

var mixins = {};

module.exports.Model = new model.Model('users', config, mixins, [{
    _id: 1,
    name: 'bob',
    password: 'foo',
    roles: ['admin']
},
{_id: 2,
name: 'sue',
password: 'bar',
roles: ['guest']}
]);