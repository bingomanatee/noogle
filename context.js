global.MVC_ROOT = __dirname;
require.paths.unshift(MVC_ROOT + '/lib/mongodb-native/lib');
require.paths.unshift(MVC_ROOT + '/lib/connect/lib');
require.paths.unshift(MVC_ROOT + '/lib/express/lib');
require.paths.unshift(MVC_ROOT);
require.paths.unshift(MVC_ROOT + '/lib');
global._  = require('util/underscore');