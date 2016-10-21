'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  _ = require('lodash');

/**
 * Device Schema
 */
var DeviceSchema = new Schema({
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank',
    unique: true
  },
  kind: {
    type: String,
    default: '',
    index: true,
    validate: [function(val) {
      return _.findIndex(['auth', 'control', 'display'], val);
    }, 'This could be only auth, control or display']
  },
  type: {
    type: String,
    default: '',
    index: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Device', DeviceSchema);
