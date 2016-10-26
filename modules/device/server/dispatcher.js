'use strict';
/**
 * Created by gt on 2016.10.25..
 */
var path = require('path'),
  _ = require('lodash'),
  drivers = require(path.resolve('./drivers')),
  config = require(path.resolve('./config/config')),
  EventEmitter = require('events').EventEmitter;

class DeviceStack {
  constructor() {
    _.each(drivers.kinds, (kindClass, kind) => {
      this[kind] = [];
    });
  }
  invoke(method, args, kind, callback) {
    args = args || [];
    var self = this;
    return new Promise((resolve, reject) => {
      var devices = kind ? self[kind] : _.flatten(_.values(self));
      if (!devices || !devices.length) return resolve();
      if (!devices[0][method]) return reject('Method "'+func+'" not defined by driver "'+devices[0].driver+'" (device name: "'+devices[0].name+'")');
      var promise = devices[0][method].apply(devices[0], args);
      for (var i = 1; i < devices.length; i++) {
        var device = devices[i];
        promise = promise.then(() => {
          if (callback) callback.call(device, device, method, args);
          device[method].apply(device, args);
        });
      }
      promise.then(() => {
        if (callback) callback(devices[0], args);
        resolve();
      });
    });
  }

  call(method, args, kind, callback) {
    args = args || [];
    var devices = kind ? this[kind] : _.flatten(_.values(this));
    _.each(devices, (device) => {
      if (callback) callback(device, method, args);
      if (_.isFunction(device[method])) device[method].apply(device, args);
    });
  }

  broadcast(event, args, kind, callback) {
    args = args || [];
    args.unshift(event);
    return this.call('emit', args, kind, callback);
  }

  on(event, fn, kind, callback) {
    var args = [event, fn];
    return this.call('on', args, kind, callback);
  }
}

class Dispatcher extends EventEmitter {
  constructor() {
    super();
    this.devices = new DeviceStack();
  }
  destructor() {
    this.invoke('destroy');
  }
  add(deviceDocument) {
    var driver = _.find(drivers, {name: deviceDocument.driver});
    if (driver && this.devices[driver.kind] && driver.Class) {
      var params = new driver.model(deviceDocument.params);
      var device = new driver.Class(params, this);
      device.title = deviceDocument.title;
      device.document = deviceDocument;
      device.driver = driver;
      this.devices[driver.kind].push(device);
      return device;
    }
  }

  remove(deviceDocument) {
    this.devices = _.remove(this.devices, function(device) {
      return (device.document.name == deviceDocument.name);
    });
  }
}
module.exports = new Dispatcher();
