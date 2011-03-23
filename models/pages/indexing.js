var file_utils = require('util/file_utils');

var doc_parser = require('docparser');

module.exports = {
    _reindex: function(page, callback) {
        console.log(__filename + '::reindexing page: ' + page.url);
     //   console.log(page);
        page.indexed = new Date();
        if (typeof(page) == 'string') {
            var self = this;
            return this.get(page,
            function(err, page) {
                self._reindex(page, callback);
            });
        }
        if (!page) {
            callback(new Error('no page'));
        } else {
            switch (page.type) {
            case 'index':
                console.log(__filename + ':: indexing links');
                this._reindex_links(page, callback);
                break;

            case 'irc':
                console.log(__filename + ':: indexing irc');
                this._reindex_irc_lines(page, callback);
                break;

            case 'documentation':
                this._reindex_documentation(page, callback);
                break;

            default:
                console.log(__filename + ':: indexing page ' + page.type + ' -- WARNING !!!!! cannnot do this');
                this._reindex_page(page, callback);

            }
        }
    },

    enable: function(model) {
        for (i in this) {
            if (i != 'enable') {
                model[i] = this[i];
            }
        }
    },
    
    _reindex_documentation: function(page, callback){
        var self = this;
        doc_parser.chunk_url(page.url, function(err, sections){
            page.sections = sections;
            self.put(page, callback);
        })
    },

    _reindex_irc_lines: function(page, callback) {
        var self = this;
        var lines_being_put = 0;
        file_utils.read_url(page.url,
        function(err, txt) {
            file_utils.lines_in_txt(txt,
            function(err, new_lines) {

                var lines_model = require('models/lines');
                lines_model.model(function(err, model) {
                    model.delete({
                        url: page.url
                    },
                    function() {
                        new_lines.forEach(function(line, i) {
                            if (! (i % 1000)) {
                                console.log(__filename + ':: indexing line ' + i + ' of ' + new_lines.length + ' of page ' + page.url);
                            }
                            line.url = page.url; ++lines_being_put;
                            model.put(line,
                            function() {--lines_being_put;
                            });
                        });

                        var interval = setInterval(function() {
                            console.log(page.url + ': remaining lines: ' + lines_being_put);
                            if (lines_being_put < 1) {
                                console.log('ending parse of ' + page.url);
                                clearInterval(interval);

                                self.put(page,
                                function(err, page) {
                                    page.indexed = new Date();
                                    self.put(page, callback);
                                });
                            }
                        },
                        2000);
                    });
                });
            });
        });
    },

    _make_link: function(url, link){
        url = url.replace(/[\w.]+$/, '');
        if(url.substring(url.length - 1) != '/'){
            url += '/';
        }
        var out = url + link;
        var regex = /\/[^\/]\/\.\.\//;
        while(regex.test(out)) out = out.replace(regex, '/');
        return out;
    },
    
    _update_links: function(model, page, new_links, callback) {
        var self = this;
        console.log(__filename + '::lit return ');
        //  console.log('links = ');
        //  console.log(new_links);
        page.links = [];
        for (var p in new_links) {
            var link = self._make_link(page.url, new_links[p]);
            page.links.push(link);
        }

        page.txt = '';
        // console.log(__filename + '::_reindex_links::new page');
        model.put(page, callback);

    },

    _reindex_links: function(page, callback) {
        var self = this;
        page.indexed = new Date();
        this.put(page, function(err, page){
        file_utils.read_url(page.url,
        function(err, txt) {

            page.txt = txt;
            console.log(__filename + '::_reindex_links:: finding links in txt');
            file_utils.links_in_txt(txt,
            function(err, links) {
                if (err) {
                    console.log(__filename + ':: error in _reindex_links::links_in_txt');
                    console.log(err);
                    callback(err);
                } else {
                    self._update_links(self, page, links, callback);
                }
            })
        })
        })
    }
}