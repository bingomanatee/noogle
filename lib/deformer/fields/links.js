
module.exports.tag = function(field){
    this._digest(field);
}

module.exports.tag.prototype.__proto__ = require('./../field').Field.prototype