/**
 * Module dependencies.
 */

var fs      = require('fs');
var express = require('express/lib/express');
var mvc     = require('./lib/mvc');

exports.boot = function(app) {
    mvc.load(app);
    mvc.boot(app, __dirname + '/controllers');
};
