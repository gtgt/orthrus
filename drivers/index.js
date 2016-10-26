'use strict';
var _ = require('lodash'),
  path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

exports = [];
exports.kinds = {
  auth: require('./auth.driver'),
  control: require('./control.driver'),
  display: require('./display.driver')
};

// Load `*.js` under current directory as properties
//  i.e., `User.js` will become `exports['User']` or `exports.User`
_.each(exports.kinds, function (driverClass, kind) {
  if (fs.existsSync(__dirname + '/' + kind)) {
    fs.readdirSync(__dirname + '/' + kind).forEach(function (file) {
      if (file.match(/\.js$/) !== null && file !== 'index.js') {
        var name = file.match(/^([^\.]+)\./);
        if (name && name[1]) {
          var driver = _.extend({
            kind: kind,
            name: name[1],
            label: name[1],
            version: '?',
            params: {}
          }, require(__dirname + '/' + kind + '/' + file));
          if (driver.Class && (driver.Class.prototype instanceof driverClass)) {
            if (!(driver.params instanceof Schema)) driver.params = new Schema(driver.params);
            driver.model = mongoose.model(driver.name+'Params',  driver.params);
            exports.push(driver);
          } else {
            console.warn(kind+' driver "'+driver.name+'" does not have proper class.');
          }
        }
      }
    });
  }
});

module.exports = exports;
