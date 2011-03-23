var np = require('htmlparser');
var sys = require('sys');

var fu = require('util/file_utils');

module.exports.chunk_url = function(url, callback) {

    fu.read_url(url, function(err, txt) {
        _get_body(txt, function(err, nodes) {
            nodes = remove_tags(nodes, ['header', 'script']);
            nodes = remove_content(nodes, /id="toc"/);
            var flat_nodes = flatten_nodes(nodes);
            var sections = node_sections(flat_nodes);
            callback(null, sections);
        })
    })
}

function flatten_nodes(nodes, fn) {
    if (!fn) {
        fn = [];
    }
    for (var i in nodes) {
        var node = nodes[i];
        if (node.type == 'tag') {
            fn.push(node);

            if (node.hasOwnProperty('children')) {
                flatten_nodes(node.children, fn);
                delete node.children;
            }
            fn.push({
                type: 'close_tag',
                name: node.name
            });
        } else {
            fn.push(node);
        }
    }
    return fn;
}

function _parse_ele(nodes, callback) {
    var docs = [];

    var doc = [];
    for (var n in nodes) {
        var node = nodes[n];
        console.log(node.name);

        if (/h[\d]/i.test(node.name)) {
            console.log('found title');
            console.log(node);
            if (doc.length) {

                docs.push(_c_data(doc));
                doc = [];
            }
        }
        doc.push(node)
    }
    if (doc.length) {
        docs.push(_c_data(doc));
    }
    callback(null, docs);
}

function _c_data(doc) {
    var data = {
        title: _unparse([doc.shift()])
    };
    data.body = _unparse(doc);
    return data;
}

function _unparse(doc) {
    var s = '';

    for (var i in doc) {
        var n = doc[i];

        if (n.type == 'tag') {
            s += '<' + n.name + '>';
            s += _unparse(n.children);
            s += '</' + n.name + '>';
        } else {
            s += n.data;
        }

    }
    return s;
}

function _get_body(page, callback) {
    var handler = new np.DefaultHandler(function(error, dom) {
        if (error) {
            callback(error);
        }
    }, {
        ignoreWhitespace: true
    });
    var parser = new np.Parser(handler);
    parser.parseComplete(page);

    for (var i in handler.dom) {
        var node = handler.dom[i];

        if (node.name == 'html') {
            console.log('found html');
            for (var j in node.children) {
                var n = node.children[j];
                if (n.name == 'body') {
                    console.log('found body');
                    return callback(null, n.children);
                }
            }
        }
    }
}

function assemble_flat(tags) {
    var out = '';

    for (var i in tags) {
        var tag = tags[i];

        if (tag.type == 'tag') {
            out += '<' + tag.raw + '>';
        } else if (tag.type == 'close_tag') {
            out += '</' + tag.name + '>';
        } else {
            out += tag.raw;
        }
    }
    return out;
}

function node_section(name) {
    return {
        name: name,
        tags: []
    };
}

/**
 * takes a flat list of nodes -
 * chunks them into header delimited sections
 */

function node_sections(fn) {
    var sections = [];
    var section = node_section();
    var name = '';
    console.log(__filename + ':: node_sections: --------------------------');
    console.log('nodes: ' + fn.length);
    for (var i in fn) {
        var node = fn[i];
        console.log('node.type: ' + node.type);
        console.log('node.data: ' + node.data);
        if (node.type == 'tag') {
            if (/^h[\d]/.test(node.name)) {
                if (section.tags.length) {
                    section.content = assemble_flat(section.tags);
                    sections.push(section);
                    section = node_section();
                }
            }
            section.tags.push(node);
        } else if (node.type == 'text') {
            section.tags.push(node);
            if (section.name) {
                console.log('name: ' + section.name);
            } else {
                console.log(__filename + '::node_sections: adding title ' + node.data);
                section.name = node.data;
            }
        } else {
            section.tags.push(node);            
        }
    }
    if (section.tags.length) {
        section.content = assemble_flat(section.tags);
        sections.push(section);
    }

    return sections;
}

function remove_content(nodes, content_regex) {
    var clean_nodes = [];

    for (var i in nodes) {
        var node = nodes[i];
        if (!content_regex.test(node.raw)) {

            if (node.hasOwnProperty('children')) {
                node.children = remove_content(node.children, content_regex);
            }

            clean_nodes.push(node);
        }
    }

    return clean_nodes;
}

function remove_tags(nodes, tags) {
    var clean_nodes = [];
    for (var i in nodes) {
        var node = nodes[i];

        if (node.type == 'tag') {
            if (tags.indexOf(node.name) == -1) {

                if (node.hasOwnProperty('children')) {
                    node.children = remove_tags(node.children, tags);
                }

                clean_nodes.push(node);
            }
        } else {
            clean_nodes.push(node);
        }
    }

    return clean_nodes;
}