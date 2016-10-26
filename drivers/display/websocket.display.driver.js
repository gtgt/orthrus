'use strict';

var _ = require('lodash'),
  DisplayDriver = require('../display.driver'),
  Schema = require('mongoose').Schema;

exports.version = '1.0';
exports.label = 'Websocket emtter';
exports.params = new Schema({
  messageTypes: {
    label: 'Message Types',
    type: [String],
    default: ['auth'],
    values: ['auth'],
    required: 'Address cannot be blank'
  }
});
exports.params.path('messageTypes').validate((value) => {
  return _.includes(this.values, value);
});
exports.Class = class WSDriver extends DisplayDriver {
  init() {
    var self = this;
    return new Promise((resolve, reject) => {
      if (self.started) return reject();
      self.dispatcher.on('socketConnection', self.onSocketConnection.bind(self));
      self.started = 1;
    });
  }
  onSocketConnection(io, socket) {
    this.io = io;
    this.socket = socket;
  }
  display(message) {
    if (this.io) {
      console.log(message);
      this.io.emit('display', {
        type: 'auth',
        text: message,
        created: Date.now(),
        profileImageURL: this.socket.request.user.profileImageURL,
        username: this.socket.request.user.username
      });
    }
  }
  destroy() {
    return new Promise((resolve, reject) => {
      if (!this.started) return reject();
      this.started = 0;
      resolve();
    });
  }
}
