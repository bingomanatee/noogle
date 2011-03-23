var _ = require('util/underscore');
var pages_model = require(MVC_ROOT + '/models/pages');
var lines_model = require(MVC_ROOT + '/models/lines');
var comment_provider = require('models/mongoose/comments');

module.exports = exports = {

    name: 'page',
    _provider: null,

    provider: function(callback) {
        if (typeof(callback) != 'function') {
            throw new Error(__filename + ':: provider called with no callback');
        } else if (module.exports._provider) {
            console.log(__filename + ':: returning old provider');
            callback(null, module.exports._provider);
        } else {
            pages_model.model(function(err, model) {
                if (err) {
                    console.log(__filename + '::provider::model error');
                    console.log(err);
                    callback(err);
                } else if (model) {
                    //   console.log(__filename + '::provider:: returning model to callback');
                    //   console.log(model);
                    module.exports._provider = model;
                    callback(null, model);
                } else {
                    console.log(__filename + '::provider::no output');
                    callback(new Error('no output'));
                }
            });
        }
    },

    _line_provider: null,

    line_provider: function(callback) {
        if (typeof(callback) != 'function') {
            throw new Error(__filename + ':: provider called with no callback');
        } else if (module.exports._line_provider) {
            console.log(__filename + ':: returning old provider');
            callback(null, module.exports._line_provider);
        } else {
            lines_model.model(function(err, model) {
                if (err) {
                    console.log(__filename + '::provider::model error');
                    console.log(err);
                    callback(err);
                } else if (model) {
                    //   console.log(__filename + '::provider:: returning model to callback');
                    //   console.log(model);
                    module.exports._line_provider = model;
                    callback(null, model);
                } else {
                    console.log(__filename + '::provider::no output');
                    callback(new Error('no output'));
                }
            });
        }
    },

    _search_query: function(phrase) {
        if (!phrase) {
            throw new Error('no phrase passed');
        }
        phrase = phrase.toLowerCase();

        var words = [];

        var wre = /[\w]+/g;
        var word = null;

        do {
            word = wre.exec(phrase);
            if (word) {
                words.push(word[0]);
            }
        } while ( word );

        if (words.length == 1) {
            return {
                words: words[0]
            }
        } else {
            return {
                words: {
                    "$all": words
                }
            };
        }
    },

    search: function(req, res, next) {
        var self = this;
        console.log('searching for ' + req.body.search);
     
        module.exports.line_provider(function(err, model) {
            var phrase = req.body.search;

            if (typeof(phrase) == 'undefined') {
                req.flash('error', 'No Search Phrase Passed');
                res.render('page/search.html', {
                    locals: {
                        linesets: {}
                    }
                });
            } else if (!phrase) {
                req.fash('error', 'Please Enter a search phrase');
                res.render('page/search.html', {
                    locals: {
                        linesets: {}
                    }
                });
            } else {
                query = module.exports._search_query(phrase);
                console.log('query: ');
                console.log(query);

                model.find(query,
                function(err, lines) {
                    console.log('aaa');
                    var ls =  module.exports._linesets(lines);
                    
                    console.log(__filename + ': linesets: ');
                    console.log(ls);
                    
                    res.render('page/search.html', {
                        locals: {
                            linesets: ls
                        }
                    });
                });
            }

        });
        
    },

    _linesets: function(lines) {

        var linesets = {};
        for (var i in lines) {
            var line = lines[i];
            if (linesets.hasOwnProperty(line.url)) {
                linesets[line.url].push(line);
            } else {
                linesets[line.url] = [line];
            }
        }
        
        console.log(__filename + ': linesets');
        console.log(linesets);

        var line_brackets = [];

        for (var url in linesets) {
            line_brackets.push({
                url: url,
                lines: _.sortBy(linesets[url],
                function(item) {
                    return item.index
                })
            });
        };
        return _.sortBy(line_brackets,
        function(l) {
            return l.url;
        });
    },

    search_get: function(req, res, next) {
        console.log(req);
        module.exports.line_provider(function(err, model) {
            query = module.exports._search_query(req.params.word);

            model.find(query,
            function(err, lines) {
                    var ls =  module.exports._linesets(lines);
                    
                    console.log(__filename + ': linesets: ');
                    console.log(ls);
                    
                    res.render('page/search.html', {
                        locals: {
                            linesets: ls
                        }
                    });
                });
        });
    },

    reindex: function(req, res, next) {
        var id = req.params.id;
        console.log('ID: ' + id);

        module.exports.provider(function(err, model) {
            if (err) {
                console.log(__filename + '::reindex cannot get model');
                console.log(err);
                throw err;
            } else {
                model.get(id,
                function(err, page) {
                    model.reindex(page,
                    function(err, page) {
                        req.flash('info', 'Page Reindexed');
                        res.redirect('back');
                    })
                });
            }
        });
    },

    comment: function(req, res) {
        var comment = req.body.comment;
        var page_id = comment.page;
                
        var new_comment = comment_provider.model(true);
        
        new_comment.page    = page_id;
        new_comment.body    = comment.text;
        new_comment.author  = comment.author;
        new_comment.section = comment.id;
        
        new_comment.save(function(err, document) {
            if(err){
                console.log(__filename + ':: error saving new_comment');
                console.log(new_comment);
                throw err;
            }
            
            module.exports.provider(function(err, model) {
    
                model.get(page_id,
                function(err, page) {
                    var section = page.sections[comment.id];
                    if (section.hasOwnProperty('comments')){
                        section.comments.push(comment);
                    } else {
                        section.comments = [comment];
                    }
                    model.put(section, function(){}); // asynchronous
                    
                    delete page.sections; // note this is a TEMPORARY deletion of the
                    // section data fro display purposes only
                    res.render('page/add_comment.html', {
                        locals: {
                            comment: req.body.comment,
                            page: page
                        }
                    });
                })
    
            });
            
        })
    },

    reindex_all: function(req, res, next) {
        var page_ids = req.body.page_ids;

        //  res.render('page/reindex_all.html', {locals: {body: JSON.stringify(req.body).replace(',', ",\n").replace('}', "}\n")}});
        module.exports.provider(function(err, model) {
            page_ids.forEach(function(id) {
                try {
                    if (req.body.submit == 'Delete Checked') {
                        var idr = model._as_oid(id);
                        console.log('deleting ');
                        console.log(idr);
                        model.delete(id,
                        function(err, page) {});
                    } else {
                        model.reindex(id,
                        function(err, page) {}) // note - asynchonous
                    }
                } catch(err) {}
            });
            req.flash('info', req.body.submit);

            model.all(function(err, pages) {
                pages = _.sortBy(pages,
                function(i) {
                    return i.url
                });
                res.render('page/index.html', {
                    locals: {
                        pages: pages,
                        refreshed: page_ids
                    }
                });
            });

        });
    },

    spider: function(req, res, next) {
        var id = req.params.id;
        module.exports.provider(function(err, model) {
            model.get(id,
            function(err, page) {
                res.render('page/spider.html', module.exports._l(page));
            })
        });
    },

    crawl: function(req, res, next) {
        var spider = req.body.spider;
        console.log(__filename + '::crawl spider');
        console.log(spider);

        var active_links = spider.link;
        var link_types = spider.link_type;
        var default_link_type = spider.default_link_type;
        var new_data = [];

        module.exports.provider(function(err, model) {
            for (var i in active_links) {
                var link = active_links[i];
                console.log(__filename + '::crawl: adding link ' + link);

                var type = link_types[link];
                console.log(__filename + '::crawl:type ' + type);
                if (type == 'default') {
                    type = default_link_type;
                }
                var data = {
                    url: link,
                    type: type
                };
                new_data.push(data);
                model.put(data); // note - asynchronous
            }
        });

        res.render('page/crawl.html', {
            locals: {
                pages: new_data
            }
        });
    },

    index: function(req, res, next) {
        module.exports.provider(function(err, model) {
            if (model) {
                console.log(__filename + '::index:: getting all pages');
                model.all(function(err, pages) {
                    console.log('pages: ');
                    console.log(pages);
                    pages = _.sortBy(pages,
                    function(i) {
                        return i.url
                    });
                    res.render('page/index.html', {
                        locals: {
                            pages: pages
                        }
                    });
                })
            } else {
                next(err);
            }
        });
    },

    _l: function(result) {
        var out = {
            locals: {}
        };
        out.locals[this.name] = result;
        return out;
    },

    show: function(req, res, next) {
        console.log(__filename + '::show::getting page ' + req.params.id);
        self = module.exports;
        module.exports.provider(function(err, p) {
            if (err) {
                console.log(__filename + '::show::provider::error');
                console.log(err);
                return next(err);
            } else {
                console.log(__filename + '::show::provider::model');
                console.log(p);
            }

            var id = req.params.id;
            var self = this;
            if (p.hasOwnProperty('get')) {
                console.log(__filename + '::getting id ' + id);
                // console.log(p.get.toString());
                p.get(id, function(err, page) {
                    if (err) {
                        console.log(__filename + '::show::error finding id ' + id);
                        console.log(err);
                        next(err);
                    } else {
                       if (page.sections){
                        page.sections.forEach(function(s){
                            delete s.tags;
                        })
                       }
                       console.log(__filename + ':: page = ');
                       console.log(page);
                        
                        var comment_model = comment_provider.model();
                        
                        comment_model.find({page: page._id}, function(err, c) {
                            p.encomment_page(page, c);
                            res.render('page/show.html', {locals: {page: page, comments: c}});
                        });
                        
                    }
                });
            } else {
                console.log(__filename + ': no get on provider');
            }

        });
    },

    delete: function(req, res, next) {
        module.exports.provider().get(req.params.id,
        function(err, result) {
            err ? next(err) : res.render(result);
        });
    },

    destroy: function(req, res, next) {
        module.exports.provider().get(req.params.id,
        function(err, result) {
            err ? next(err) : module.exports.provider().delete(req.params.id,
            function(err, result) {
                res.render(result);
            });
        });
    },

    add: function(req, res, next) {
        var p = require('forms/page/page');

        p.form({
            'page[name]': 'bob'
        },
        function(err, form) {
            console.log('form recieved');
            console.log(form);
            if (err) {
                next(err);
            } else {
                res.render('page/add.html', {
                    locals: {
                        form: form
                    }
                });
            }
        });
    },

    create: function(req, res, next) {
        console.log(__filename + '::create:: adding ');
        console.log(req.body.page);
        var self = module.exports;
        module.exports.provider(function(err, provider) {
            if (err) {
                console.log(__filename + '::create::provider error');
                console.log(err);
                next(err);
            } else {
                var page = req.body.page;
                delete page._id;

                console.log(__filename + '::create putting');
                console.log(page);
                provider.put(page,
                function(err, pages) {
                    if (err) {
                        console.log(__filename + '::create::put error');
                        console.log(err);
                    } else {
                        console.log(__filename + '::create rendering');
                        console.log(pages);
                        res.render('page/show.html', {
                            locals: {
                                page: pages[0]
                            }
                        });
                    }
                });
            }
        });
    },

    edit: function(req, res, next) {
        /* 
        * received by action 'update'
        */
        module.exports.provider().get(req.params.id,
        function(err, result) {
            err ? next(err) : res.render(this._l(result));
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
        function(err, result) {
            err ? next(err) : res.render(this._l(result));
        });
    }

}