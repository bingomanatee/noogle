require('./../../../context');

var Model = require('./index');

var foos = new Model('foos', [{
    id: 1,
    name: 'a'
},
{
    id: 2,
    name: 'b'
}], null, {
    list: function() {
        this.all(function(err, data) {
            data.forEach(function(item) {
                console.log(item.id + ': ' + item.name);
            });
        });
    }
});

foos.list();

console.log('inserting ');
var n = {
    name: 'c'
};
console.log(n);

foos.put(n,
function(err, result) {
    console.log('new record');
    console.log(result);
    console.log('data set');
    foos.list();

    console.log('deleting ');
    foos.delete(n,
    function(err, result) {
        console.log('remaining records');
        foos.list();
        console.log('deleted');
        console.log(result);
    });
});