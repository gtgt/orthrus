'use strict';
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
