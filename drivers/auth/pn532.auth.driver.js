'use strict';

var AuthDriver = require('../auth.driver');
var pn532 = require('pn532');
var SerialPort = require('serialport');

exports.kind = 'auth';
exports.name = 'pn532';
exports.version = '1.0';
exports.label = 'pn532 NFC reader';
exports.params = {
  dev: {
    label: 'Device',
    type: String,
    default: '/dev/ttyUSB0',
    trim: true,
    required: 'Device cannot be blank'
  }
};
exports.Class = class PN532Driver extends AuthDriver {
  init() {
    var self = this;
    return new Promise((resolve, reject) => {
      if (self.started) return reject();
      self.hal = new SerialPort(self.params.dev, { baudrate: 115200 });
      self.nfc = new pn532.PN532(self.hal);
      self.nfc.on('ready', () => {
        self.nfc.on('tag', (tag) => {
          self.input(tag.uid);
        });
      });
      self.started = 1;
      resolve();
    });
  }
  destroy() {
    return new Promise((resolve, reject) => {
      if (!this.started) return reject();
      this.nfc = null;
      this.hal = null;
      this.started = 0;
      resolve();
    });
  }
}
