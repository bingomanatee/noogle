var a = require('./edit');

console.log('edit:');
console.log(a.form({id: 1, name: 'test chapter', 'text': 'test text'}, {id: 5}).render());

