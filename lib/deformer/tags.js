module.exports = {
    _tag_props: function(props) {
        if (!props) {
            return '';
        }
        var out = '';
        for (var p in props) {
            out += p + '="' + props[p] + '" ';
        }
        return out ? ' ' + out : '';
    },
    _doc_tags: false,
    tag: function (name, props, content, mode) {
        if (this._doc_tags) {
            console.log('------------------');
            console.log('tag: name = ');
            console.log(name);

            console.log('tag: props = ');
            console.log(props);

            console.log('tag: content = ');
            console.log(content);

            console.log('tag: mode = ');
            console.log(mode);
        }

        if (!name) {
            throw(new Error(' no name passed to tag '));
        }
        
        switch(mode) {
            case this.TAG_MODE_OPEN:
                var out = '<' + name + this._tag_props(props) + '>';
                break;

            case this.TAG_MODE_CLOSE:
                var out = '</' + name + ">\n";
                break;

            case this.TAG_MODE_NORMAL:
            default:
                if (typeof content == 'undefined') {
                    var out = '<' + name + this._tag_props(props) + '/>';
                } else {
                    var out = '<' + name + this._tag_props(props) + '>' + content + '</' + name + ">\n";
                }
        }
        if (this._doc_tags)
            console.log('    returns: ' + out);
        return out;
    },
    TAG_MODE_OPEN : 1,
    TAG_MODE_CLOSE : 2,
    TAG_MODE_NORMAL : 3,

    table: function (rows, props, hooks) {
        var content = '';
        var tag = this;

        rows.forEach( function(row) {
            if (hooks && hooks.hasOwnProperty('row_filter')) {
                row = hooks.row_filter(row);
            }
            content += tag._table_row(row);
        });
        return this.tag('table', props, content);
    },
    _table_row: function(row) {
        var content = '';
        var tag = this;
        var row_props = {};

        if (row.hasOwnProperty('cells')) {
            if (row.hasOwnProperty('row_props')) {
                row_props = row.row_props;
            }
            row = row.cells;
        }

        row.forEach( function(cell) {
            content += tag._render_cell(cell)
        });
        return this.tag('tr', row_props, content);
    },
    _render_cell: function(cell) {

        if (typeof (cell) == 'object') {
            var type = cell.type;
            var body = cell.body;
            delete cell.type;
            delete cell.body;
            cell_props = cell;
        } else {
            var type = 'td';
            var cell_props = {};
            var body = cell;
        }
        return module.exports.tag(type, cell_props, body);
    },
    
    TEXT: 'text',
    TEXTAREA: 'textarea',
    SELECT: 'select',
    CHECKBOX: 'checkbox'
}