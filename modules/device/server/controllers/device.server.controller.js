'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Device = mongoose.model('Device'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Device middleware
 */
exports.kind = function (req, res, next, id) {
  req.kind = id;
  next();
};

exports.type = {};
/**
 * List of Device types
 */
exports.type.list = function (req, res) {
  var types = [];
  if (req.params.kind === 'auth') {
    types.push({ name: 'pn532', label: 'pn532 NFC reader', kind: req.params.kind });
    types.push({ name: 'bluetooth', label: 'BlueZ bluetooth controller', kind: req.params.kind });
  } else if (req.params.kind === 'control') {
    types.push({ name: 'gpio-relay', label: 'Simple GPIO Relay', kind: req.params.kind });
  } else if (req.params.kind === 'display') {
    types.push({ name: 'lcd-16x2-i2c', label: '16x2 LCD with i2c protocol', kind: req.params.kind });
  }
  res.json(types);
};

/**
 * Get Device Type params
 */
exports.type.get = function (req, res) {
  res.json({name: req.params.name, kind: req.params.kind, version: '1.0'});
};

/**
 * Get Device Type params
 */
exports.type.params = function (req, res) {
  res.json({
    param1: {
      type: String,
      default: '',
      trim: true,
      required: 'Title cannot be blank',
      unique: true
    }
  });
};

/**
 * Device middleware
 */
exports.get = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Device is invalid'
    });
  }

  Device.findById(id).populate('user', 'displayName').exec(function (err, device) {
    if (err) {
      return next(err);
    } else if (!device) {
      return res.status(404).send({
        message: 'No device with that identifier has been found'
      });
    }
    req.device = device;
    next();
  });
};

/**
 * Create an device
 */
exports.create = function (req, res) {
  var device = new Device(req.body);
  device.user = req.user;

  device.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(device);
    }
  });
};

/**
 * Show the current device
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var device = req.device ? req.device.toJSON() : {};

  // Add a custom field to the Device, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Device model.
  device.isCurrentUserOwner = !!(req.user && device.user && device.user._id.toString() === req.user._id.toString());

  res.json(device);
};

/**
 * Update an device
 */
exports.update = function (req, res) {
  var device = req.device;

  device.title = req.body.title;
  device.content = req.body.content;

  device.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(device);
    }
  });
};

/**
 * Delete an device
 */
exports.delete = function (req, res) {
  var device = req.device;

  device.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(device);
    }
  });
};

/**
 * List of Device
 */
exports.list = function (req, res) {
  Device.find().sort('-created').populate('user', 'displayName').exec(function (err, device) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(device);
    }
  });
};
