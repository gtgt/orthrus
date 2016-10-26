'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  path = require('path'),
  chalk = require('chalk'),
  mongoose = require('mongoose'),
  Device = mongoose.model('Device'),
  dispatcher = require(path.resolve('./modules/device/server/dispatcher')),
  config = require(path.resolve('./config/config'));

var init = function() {
  return new Promise(function (resolve, reject) {
    Device.find().populate('user', 'displayName').exec(function (err, devices) {
      if (err) return console.error(err);
      _.each(devices, function(device) {
        dispatcher.add(device);
      });
      dispatcher.devices.invoke('init', [], null, (device) => {
        console.log('Initialization of '+device.title+' ('+device.driver.name+') success!');
      }).then(() => {
        console.log(chalk.blue('All devices initialized!'));
        resolve(dispatcher);
      }, (err) => {
        console.log(chalk.red(err));
        reject();
      });
    });
  })
};

/**
 * Module init function.
 */
module.exports = function (app, db) {
  init().then(function(dispatcher) {
    dispatcher.devices.on('read', function(input) {
      dispatcher.devices.call('display', ['Read: "'+input+'" from "'+this.title+'" authentication device!'], 'display');
    }, 'auth');
  });
};
