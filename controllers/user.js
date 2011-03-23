var crypto = require('crypto');
var provider = require('models/users');

module.exports = {

    // /users
    index: function(req, res) {
        res.render(provider.all());
    },

    // /users/:id/login
    login: function(req, res) {
        var user_form = require('forms/users/login');
        res.render('user/login.html', {
            locals: {
                form: user_form.form()
            }
        });
    },

    logout: function(req, res) {
        delete req.session.session_user;
        req.flash('info', 'logged out');
        res.redirect('back');
    },

    loginsubmit: function(req, res, next) {
        console.log('loginsubmit:');
        provider.model(function(err, model) {
            if (err) {
                console.log(__filename + ':: error');
                console.log(err);
                res.render('app/err.html', {
                    locals: {
                        err: err
                    }
                });
            } else {
                try {
                    model.authenticate(req.body.user.un, req.body.user.pw,
                    function(err2, user) {
                        if (err2) {
                            res.render('app/err.html', {
                                locals: {
                                    err: err2
                                }
                            })
                        } else {
                            req.session.regenerate(function() {
                                // Store the user's primary key 
                                // in the session store to be retrieved,
                                // or in this case the entire user object
                                req.session.session_user = user;
                                req.flash('info', 'Successfully signed in as _' + user.un + '_.');
                                res.redirect('/');
                            });
                        }
                    });
                } catch(err) {
                    res.render('app/err.html', {
                        locals: {
                            err: err
                        }
                    });
                }
            }
        });
    },

    // /users/:id
    show: function(req, res, next) {
        provider.model(function(err, model) {
            model.get(req.params.id,
            function(err, user) {
                if (err) return next(err);
                res.render('user/show.html', {locals: {user: user}});
            });
        });
    },

    // /users/0/create
    add: function(req, res) {
        var f = require('forms/users/add');
        res.render('user/add', {
            locals: {
                form: f.form()
            }
        });
    },

    // POST /users/:id/
    create: function(req, res, next) {
        provider.model(function(err, model) {
            var new_user = req.body.user;
            new_user._id = new_user.un;
            model.get(new_user._id,
            function(err, user) {
                // note in this case we DON'T want to find a user!
                if (err) {
                    req.flash('error', 'We have a user named "' + req.body.user.un + '".  Try again. ');
                    res.redirect('back');
                } else {
                    console.log('adding user from req: ');
                    console.log(new_user);

                    model.add(new_user,
                    function(err2, user) {
                        if (err2) {
                            console.log('error adding user');
                            console.log(err2);
                            req.flash('error', 'Cannot add user; ' + JSON.stringify(err2));
                            res.redirect('back');
                        } else {
                            console.log('new user: ');
                            console.log(user);
                            var f = require('forms/users/login');
                            var form = f.form();
                            req.flash('info', 'added user "' + JSON.stringify(user) + '".');
                            res.render('user/create.html', {
                                locals: {
                                    user: user,
                                    form: form
                                }
                            });
                        }
                    });

                }
            });
        });
    },

    // /users/:id/edit
    edit: function(req, res, next) {
        provider.get(req.params.id,
        function(err, user) {
            if (err) return next(err);
            res.render(user);
        });
    },

    // PUT /users/:id
    update: function(req, res, next) {
        var id = req.params.id;
        provider.get(id,
        function(err) {
            if (err) return next(err);
            var user = users[id] = req.body.user;
            user.id = id;
            req.flash('info', 'Successfully updated _' + user.name + '_.');
            res.redirect('back');
        });
    },

    if_logged_in: function(req, res, next) {
        if (req.session.hasOwnProperty('user') && req.session.user) {
            console.log('if_logged_in:: pass');
            next();
        } else {
            console.log('if_logged_in:: fail');
            req.flash('error', 'You must be logged in to visit that page.');
            res.redirect('/');
        }
    },

    if_wrote_story: function(req, res, next) {
        var story_module = require('./story');
        var id = req.params.id;
        if (!id) {
            req.flash('error', 'no story id passed');
            res.redirect('/');
        } else if (story.author == id) {
            next();
        } else {
            req.flash('error', 'only the author of the story can do this.');
            res.redirect('/');
        }
    }
};