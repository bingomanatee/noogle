var a = require('./add');

console.log('render:');
console.log(a.form().render());

console.log('cached form: ');
a.get_cached(console.log); // ha!
