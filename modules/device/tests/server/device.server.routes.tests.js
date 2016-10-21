'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Device = mongoose.model('Device'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  device;

/**
 * Device routes tests
 */
describe('Device CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new device
    user.save(function () {
      device = {
        title: 'Device Title',
        content: 'Device Content'
      };

      done();
    });
  });

  it('should not be able to save an device if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/device')
          .send(device)
          .expect(403)
          .end(function (deviceaveErr, deviceaveRes) {
            // Call the assertion callback
            done(deviceaveErr);
          });

      });
  });

  it('should not be able to save an device if not logged in', function (done) {
    agent.post('/api/device')
      .send(device)
      .expect(403)
      .end(function (deviceaveErr, deviceaveRes) {
        // Call the assertion callback
        done(deviceaveErr);
      });
  });

  it('should not be able to update an device if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/device')
          .send(device)
          .expect(403)
          .end(function (deviceaveErr, deviceaveRes) {
            // Call the assertion callback
            done(deviceaveErr);
          });
      });
  });

  it('should be able to get a list of device if not signed in', function (done) {
    // Create new device model instance
    var deviceObj = new Device(device);

    // Save the device
    deviceObj.save(function () {
      // Request device
      request(app).get('/api/device')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single device if not signed in', function (done) {
    // Create new device model instance
    var deviceObj = new Device(device);

    // Save the device
    deviceObj.save(function () {
      request(app).get('/api/device/' + deviceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', device.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single device with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/device/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Device is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single device which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent device
    request(app).get('/api/device/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No device with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an device if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/device')
          .send(device)
          .expect(403)
          .end(function (deviceaveErr, deviceaveRes) {
            // Call the assertion callback
            done(deviceaveErr);
          });
      });
  });

  it('should not be able to delete an device if not signed in', function (done) {
    // Set device user
    device.user = user;

    // Create new device model instance
    var deviceObj = new Device(device);

    // Save the device
    deviceObj.save(function () {
      // Try deleting device
      request(app).delete('/api/device/' + deviceObj._id)
        .expect(403)
        .end(function (deviceDeleteErr, deviceDeleteRes) {
          // Set message assertion
          (deviceDeleteRes.body.message).should.match('User is not authorized');

          // Handle device error error
          done(deviceDeleteErr);
        });

    });
  });

  it('should be able to get a single device that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new device
          agent.post('/api/device')
            .send(device)
            .expect(200)
            .end(function (deviceaveErr, deviceaveRes) {
              // Handle device save error
              if (deviceaveErr) {
                return done(deviceaveErr);
              }

              // Set assertions on new device
              (deviceaveRes.body.title).should.equal(device.title);
              should.exist(deviceaveRes.body.user);
              should.equal(deviceaveRes.body.user._id, orphanId);

              // force the device to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the device
                    agent.get('/api/device/' + deviceaveRes.body._id)
                      .expect(200)
                      .end(function (deviceInfoErr, deviceInfoRes) {
                        // Handle device error
                        if (deviceInfoErr) {
                          return done(deviceInfoErr);
                        }

                        // Set assertions
                        (deviceInfoRes.body._id).should.equal(deviceaveRes.body._id);
                        (deviceInfoRes.body.title).should.equal(device.title);
                        should.equal(deviceInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single device if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new device model instance
    var deviceObj = new Device(device);

    // Save the device
    deviceObj.save(function () {
      request(app).get('/api/device/' + deviceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', device.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single device, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      username: 'deviceowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Device
    var _deviceOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _deviceOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Device
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new device
          agent.post('/api/device')
            .send(device)
            .expect(200)
            .end(function (deviceaveErr, deviceaveRes) {
              // Handle device save error
              if (deviceaveErr) {
                return done(deviceaveErr);
              }

              // Set assertions on new device
              (deviceaveRes.body.title).should.equal(device.title);
              should.exist(deviceaveRes.body.user);
              should.equal(deviceaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the device
                  agent.get('/api/device/' + deviceaveRes.body._id)
                    .expect(200)
                    .end(function (deviceInfoErr, deviceInfoRes) {
                      // Handle device error
                      if (deviceInfoErr) {
                        return done(deviceInfoErr);
                      }

                      // Set assertions
                      (deviceInfoRes.body._id).should.equal(deviceaveRes.body._id);
                      (deviceInfoRes.body.title).should.equal(device.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (deviceInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Device.remove().exec(done);
    });
  });
});
