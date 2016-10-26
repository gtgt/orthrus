'use strict';
var Driver = require('./driver.js');

module.exports = class AuthDriver extends Driver {
  input(uid) {
    this.emit('read', uid, this);
  }
};
