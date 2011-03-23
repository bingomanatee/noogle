var crypto = require('crypto');
var provider_utils = require('./utils');
var users = null;

provider_utils.load(__dirname + '/users.json',
function(err, ch_list) {
  //  console.log('loaded users: ');
    console.dir(ch_list);
    users = ch_list;
users.forEach(encrypt);
});

function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

function encrypt(user) {
    user.salt = salt = Math.random();
    user.salt_pass = md5(user.pass + '' + salt);
}


module.exports = exports = {
    all: function() {
        return users;
    },

    add: function(user) {
        console.log('adding user');
        console.dir(user);

        user.id = provider_utils.next_id(users);
        encrypt(user);
        users.push(user);
        return user;
    },

    get: function(id, fn) {
        var found = false;
        users.forEach(function(s) {
            if (s.id == id) {
                found = s;
                fn(null, found);
            }
        });
        if (!found) {
            // console.log(users);
            fn(new Error('users::get: user ' + id + ' does not exist'));
        }
        return true;
    },
    get_user: function(username, fn) {
        var found = false;
        for (var i = 0; i < users.length; ++i) {
            s = users[i];
            console.log('comparing user ' + s.id + ' name (' + s.name + ') to ' + username);

            if ((!found) && (s.name == username)) {
                console.log('get_user(): found user ' + username);
                console.log(s);
                fn(null, s);
                found = true;
                break;
            }
        }

        if (!found) {
            console.log(users);
            var msg = 'get_user: users ' + username + ' does not exist';
            console.log(msg);
            fn(new Error(msg));
        }
    },
    // Authenticate using our plain-object database of doom!
    authenticate: function(name, pass, fn) {
        console.log('authenticating ' + name + '/' + pass);
        module.exports.get_user(name,
        function(err, user) {
            if (err) {
                fn(err);
            } else {
                // query the db for the given username
                if (!user) {
                    fn(new Error('cannot find user ' + name));
                } else {
                    // apply the same algorithm to the POSTed password, applying
                    // the md5 against the pass / salt, if there is a match we
                    // found the user
                    var salted_pass = md5(pass + '' + user.salt);
                    if (user.salt_pass == salted_pass) {
                        console.log('user passed auth: ' + user.name);
                        fn(null, user);
                    } else {
                        // Otherwise password is invalid
                        fn(new Error('invalid password; passed ' + pass + '(' + salted_pass + '),' + ' expected ' + user.pass + '(' + user.salt_pass + ')'));
                    }
                }
            }
        });
    }
}