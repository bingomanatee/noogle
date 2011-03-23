require('./../../context');

var stat = require('util/stat');

data = {
    data_1: [1, 2, 3, 4, 5, 6, 7, 8],

    data_2: [1, 1, 1, 4, 5, 8, 8, 8],

    data_3: [1, 4, 4, 4, 5, 5, 5, 8],
};

for (var s in stat) {
    console.log('stat function: ' + s);
}

for (var list in data) {
    var d = data[list];
    console.log(list);
    console.log(data[list]);

    console.log('average:');
    console.log(stat.average(d));

    console.log('median:');
    console.log(stat.median(d));

    console.log('stdev:');
    console.log(stat.standardDeviation(d));
}