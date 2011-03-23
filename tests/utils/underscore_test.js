var _ = require('./underscore');

var data = [{
    foo: 3,
    name: 'boob'
},
{
    foo: 4,
    name: 'sue'
},
{
    foo: 1,
    name: 'disco'
}];

console.log(_.sortBy(data, function(item){
    return item.foo;
}));
            
            