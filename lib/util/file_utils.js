var lines = require('models/lines');
var pages = require('models/pages');

module.exports = {
    links_in_txt: function(txt, callback) {

         // console.log('finding links in data: ' + txt);
        var link_regex = /href="([^"]+)"/gi;
        var links = [];
        do {
            var regex_result = link_regex.exec(txt);
            if (regex_result != null) {
                links.push(regex_result[1]);
            }
        } while ( regex_result != null );

        callback(null, links);
    },

    parse_url: function(url) {
        if (!url) {
            throw new Error('no url passed');
        }
        // console.log('parsing url ' + url);
        var hits = /http(s)?:\/\/([^\/]+)(\/.*)/.exec(url);
        if (hits) {
            // console.log('hits: ');
            // console.log(hits);
            return (hits) ? {
                host: hits[2],
                path: hits[3]
            }: {
                host: url,
                path: '/'
            };
        } else {
            hits = /([^\/]+)(\/.*)/.exec(url);
            // console.log('hits: ');
            // console.log(hits);
            return (hits) ? {
                host: hits[1],
                path: hits[2]
            }: {
                host: url,
                path: '/'
            };
        }

    },

    read_url: function(url, callback) {

         // console.log(__filename + '::read_url: reading ' + url);

        var parts = module.exports.parse_url(url);
        // console.log('parts2');
        // console.log(parts);
        host = parts.host;
        path = parts.path;

        var content = '';
        // console.log('repo, opening: ' + host + path);
        var client = require('http').createClient(80, host);

        // console.log('creating request for path ' + path);
        var request = client.request('GET', path, {
            host: host
        });

        request.on('response',
        function(response) {
            response.setEncoding('utf8');
            response.on('data',
            function(d) {
                content += d;
            });
            response.on('error',
            function(err) {
                callback(err)
            });
            response.on('end',
            function() {
                 // console.log(__filename + '::read_url::processing ' + content.substring(0, 100) + ' from ' + url);
                callback(null, content);
            });
        });
        request.on('error',
        function(err) {
             // console.log('request error');
             // console.log(err);
            callback(err);
        });
        request.end();
    },

    index_link_id: function(id, callback) {
        links.get(id,
        function(err, link) {
            module.exports.index_link(err, link, callback);
        });
    },

    index_link: function(err, link, callback) {
         // console.log(__filename + '::index_link:: indexing ' + link.to);
        var url = link.from + link.to;
        module.exports.read_url(null, url,
        function(err, txt) {
            module.exports.lines_in_txt(txt,
            function(err, new_lines) {
                 // console.log(__filename + '::index_link:: lines in ' + url + ': ' + new_lines.length);
                lines.add_lines(url, new_lines, function (){
                    callback(err, {
                        url: url,
                        link: link,
                        lines: new_lines,
                        words: []
                    });               
                })
            });
        });
    },

    index_url: function(url, page_callback) {
        pages.get_url(url,
        function(err, page) {
            if (err) {
                 // console.log('cannot retrieve page');
            } else {
                 // console.log(__filename + ': loading page ' + JSON.stringify(page));
                module.exports.index_page(null, page, page_callback);
            }
        });
    },

    index_page_id: function(id, page_callback) {
        pages.get(id, module.exports.index_page);
    },

    index_page: function(err, page, page_callback) {
         // console.log(__filename + '::index_page::' + page.url);
        links.remove({
            url: page.url
        },
        function() {
            module.exports.read_url(null, page.url,
            function(err, txt) {

                module.exports.links_in_txt(err, txt,
                function(err, new_links) {
                    links.add_links(page.url, new_links,
                    function(err, result) {
                        module.exports.lines_from_links(page.url, page_callback);
                    })
                })
            })
        });
    },

    lines_from_links: function(url, page_callback) {
        links.url_links(url,
        function(err, cursor) {
            if (err) {
                page_callback(err);
            } else if (cursor) {
                cursor.each(function(err, link) {
                    if (link) {
                        module.exports.index_link(err, link,
                        function(err2, data) {
                            data.url = link.from + link.to;
                            page_aggs.add_one(data, page_callback);
                        });
                    } else {
                        page_callback(null, {
                            status: "done"
                        });
                    }
                });

            } else {
                page_callback(new Error('no cursor'));
            }
        })
    },

    index_text: function(text, callback) {

        var word_regex = /[\w]+/;
        var words = {};
        var match = null;
        do {
            if (match = word_regex.exec(text)) {
                var word = march[0];
                word = word.toLowerCase();
                if (words.hasOwnProperty(word)) {++words[word];
                } else {
                    words[word] = 1;
                }
            }
        } while ( match );

        callback(words);
    },

    words_in_lines: function(lines, callback) {
        var words = {};
        lines.forEach(function(line, i) {
            // console.log(__filename + '::words_in_line:: line ' + i + ': ');
            // console.log(line);
            for (var ii = 0; ii < line.words.length; ++ii) {
                if (ii < 2) {
                     // console.log(__filename + '::words_in_lines::word');
                     // console.log(word);
                }
                var word = line.words[ii];
                if (word) {
                    try {
                        if (words.hasOwnProperty(word)) {
                            words[word]++;
                        } else {
                            words[word] = 1;
                        }
                    } catch(err) {
                         // console.log('error with word ');
                         // console.log(word);
                    }
                }
            };
        });
         // console.log(__filename + ':: calling word_freq');
        module.exports.word_freq(null, words, callback);
    },

    word_freq: function(err, words, callback) {
         // console.log(__filename + '::word_freq::words:');
        console.dir(JSON.stringify(words).substring(0, 2000));
         // console.log('========================== ');
        var tokens = [];

        if (words) {
             // console.log('freq_dumping ' + words.length + ' words');
            var cc = 0;
            for (var word in words) {
                var c = words[word];
                // console.log('word: ' + word + ', count: ' + c);
                var found = false;
                for (var i in tokens) {
                    var token = tokens[i];
                    if (token.freq == c) {
                        found = true;
                        token.words.push(word);
                    }
                }
                if (!found) {
                    tokens.push({
                        words: [word],
                        freq: c
                    })
                }; ++cc;
            }
             // console.log('processed ' + cc + ' words.');

            var counter = [];
            for (var i in tokens) {
                var token = tokens[i];
                if (token.freq) {
                    counter[token.freq] = token.words;
                }
            }
             // console.log(__filename + '::word_freq::returning counter');
            callback(null, counter);
        } else {
            callback(new Error('no words passed to word_freq'));
        }
    },

    lines_in_txt: function(txt, callback) {
        var lines = txt.split(/[\n\r]+/);
        /*
        for (var i = 0; i < lines.length && i < 3; ++i) {
             // console.log(i + ': ' + lines[i]);
        } */

        var out = []
        var word_re = /[\w]+/g;

        var re = /\[([\d:]+)\] (.*)/i;
        var line = '';
        var hits = '';
        var time = '';
        var line_text = '';
        var words = [];
        var data = null;
        var ce = /the channel$/;

        for (var i = 0; i < lines.length; ++i) {
            line = lines[i];
            if (ce.test(line)) continue;

            // console.log('text_lines: ' + line);
            hits = re.exec(line);

            if (hits) {
                // console.log('REGEX MATCH');
                // console.log(hits);
                time = hits[1];
                line_text = hits[2];
                data = {
                    index: i,
                    time: time,
                    text: line_text,
                    words: []
                };
            } else {
                // console.log('REGEX FAIL');
                line_text = line;
                data = {
                    index: i,
                    time: time,
                    text: line_text,
                    words: []
                };
            }

            line_text = line_text.replace("'", '');
            var lc_line_text = line_text.toLowerCase();
            do {
                word = word_re.exec(lc_line_text);
                // console.log(__filename + 'lines_in_txt::regex words in : ' + line_text);
                if (word) {
                    // console.log(word);
                    data.words.push(word[0]);
                }
            } while ( word );
            // console.log(__filename + '::lines_in_text::words: ');
            // console.log(data.words);
            if (data.words.length) {
                data.nick = data.words.shift();
            }
            out.push(data);
        }
        callback(null, out);
    }
}