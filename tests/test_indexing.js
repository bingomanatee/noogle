require('./../context');
var fs = require('fs');
var url = 'http://nodejs.org/docs/v0.4.0/api/modules.html';

var doc_parser = require('docparser');

doc_parser.chunk_url(url,
function(err, nodes) {
    nodes = remove_tags(nodes, ['header', 'script']);
    nodes = remove_content(nodes, /id="toc"/);

    //console.log('contents of ' + url);
    // echo_nodes(nodes, 1);
    console.log(reassemble(nodes));
    fs.open(__dirname + '/ti_test.html', 'w', 0666,
    function(err, fd) {
        fs.writeSync(fd, reassemble(nodes));
    });

    var flat_nodes = flatten_nodes(nodes, []);
    console.log('$$$$$$$$$$$$$$$$$$$$$$$ FLAT NODES #$$$$$$$$$$$$$$$$$$$$$$$$$$');
    var s = node_sections(flat_nodes);
    console.log(JSON.stringify(s));
    console.log('$$$$$$$$$$$$$$$$$$$$$$$ SECTIONS #$$$$$$$$$$$$$$$$$$$$$$$$$$');
    console.log(s);

    fs.open(__dirname + '/ti_test_sections.html', 'w', 0666,
    function(err, fd) {
        for (var i in s) {
            var section = s[i];
            fs.writeSync(fd, '<hr />');
            fs.writeSync(fd, assemble_flat(section.tags));
        }
    });
});

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
function node_sections(fn) {
    var sections = [];
    var section = node_section();

    for (var i in fn) {
        var node = fn[i];

        if (node.type == 'tag') {
            if (/^h[\d]/.test(node.name)) {
                if (section.tags.length) {
                    section.content = assemble_flat(section.tags);
                    sections.push(section);
                    section = node_section();
                }
            }
            section.tags.push(node);
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

function flatten_nodes(nodes, fn) {
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

function echo_nodes(nodes, level) {
    var space = '                                    '.substring(0, level * 3);

    for (var i in nodes) {
        var n = nodes[i];
        for (var ii in n) {
            if (ii == 'children') {
                echo_nodes(n[ii], level + 1);
            } else {
                console.log(space + ii + ': ' + n[ii]);
            }
        }
        console.log('---------');
    }
}

function reassemble(nodes) {
    var out = '';
    for (var i in nodes) {
        var node = nodes[i];
        //  out += JSON.stringify(node);
        if (node.type == 'tag') {
            if (node.name != 'script') {
                out += '<' + node.data + '>';
                if (node.hasOwnProperty('children')) {
                    out += reassemble(node.children);
                }
                out += '</' + node.name + ">\n";
            } else {
                // out += JSON.stringify(node);
            }

        } else if (node.type == 'text') {
            out += node.raw;
        }
    }
    return out;
}