'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  path = require('path'),
  mongoose = require('mongoose'),
  Device = mongoose.model('Device'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  drivers = require(path.resolve('./drivers')),
  dispatcher = require('../dispatcher');

exports.driver = {};

/**
 * Device middleware
 */
exports.kind = function (req, res, next, name) {
  if (!_.hasIn(name, drivers.kinds)) {
    return res.status(400).send({
      message: 'Invalid driver kind.'
    });
  }
  req.kind = name;
  next();
};

/**
 * Device middleware
 */
exports.driver.byName = function (req, res, next, name) {
  var driver = _.find(drivers, {name: name});
  if (!driver) {
    return res.status(400).send({
      message: 'Invalid driver name.'
    });
  }
  req.driver = driver;
  next();
};

exports.driver.read = function (req, res) {
  res.json(req.driver ? req.driver : {});
};

/**
 * List of Device drivers
 */
exports.driver.list = function (req, res) {
  var _drivers = _.map(_.filter(drivers, function(value) {
    return value.kind && value.name;
  }), function(driver) {
    var _driver = _.pickBy(driver, function(value, key) {
      return !_.isFunction(value) && (key != 'params');
    });
    _driver.params = _.map(_.pickBy(driver.params.paths, function(value, key) {
      return (key.substr(0, 1) != '_');
    }), function(path, name) {
      var param = path.options;
      param.name = name;
      return param;
    });
    return _driver;
  });
  res.json(_drivers);
};


/**
 * Device middleware
 */
exports.byId = function (req, res, next, id) {

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
      dispatcher.add(device);
      res.json(device);
    }
  });
};

/**
 * Update an device
 */
exports.update = function (req, res) {
  var device = req.device;
  dispatcher.remove(device);
  Device.schema.eachPath(function(key) {
    if (_.has(req.body, key)) _.set(device, key, req.body[key]);
  });

  device.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      dispatcher.add(device);
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
      dispatcher.remove(device);
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
