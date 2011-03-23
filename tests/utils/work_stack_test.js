

var ws = require('./work_stack');

var cb = function(){
    console.log('done');
};

var stack = new ws.Stack(cb);
stack.log_work('test script', 2);

stack.add_work(20);

setInterval(function(){ if (stack._pending > 0) stack.remove_work();}, 100);

stack.start();