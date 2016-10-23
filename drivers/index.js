'use strict';
var _ = require('lodash'),
  path = require('path'),
  fs = require('fs'),
  deviceController = require(path.resolve('./modules/device/server/controllers/device.server.controller.js'));

exports.kinds = ['auth', 'control', 'display'];
// Load `*.js` under current directory as properties
//  i.e., `User.js` will become `exports['User']` or `exports.User`
_.each(exports.kinds, function (kind) {
  if (fs.existsSync(__dirname + '/' + kind)) {
    fs.readdirSync(__dirname + '/' + kind).forEach(function (file) {
      if (file.match(/\.js$/) !== null && file !== 'index.js') {
        var name = file.match(/^([^\.]+)\./);
        if (name && name[1]) {
          exports[name[1]] = require(__dirname + '/' + kind + '/' + file);
          exports[name[1]].kind = kind;
        }
      }
    });
  }
});
