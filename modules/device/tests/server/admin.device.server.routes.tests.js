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
describe('Device Admin CRUD tests', function () {
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
      roles: ['user', 'admin'],
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

  it('should be able to save an device if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new device
        agent.post('/api/device')
          .send(device)
          .expect(200)
          .end(function (deviceaveErr, deviceaveRes) {
            // Handle device save error
            if (deviceaveErr) {
              return done(deviceaveErr);
            }

            // Get a list of device
            agent.get('/api/device')
              .end(function (deviceGetErr, deviceGetRes) {
                // Handle device save error
                if (deviceGetErr) {
                  return done(deviceGetErr);
                }

                // Get device list
                var device = deviceGetRes.body;

                // Set assertions
                (device[0].user._id).should.equal(userId);
                (device[0].title).should.match('Device Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an device if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new device
        agent.post('/api/device')
          .send(device)
          .expect(200)
          .end(function (deviceaveErr, deviceaveRes) {
            // Handle device save error
            if (deviceaveErr) {
              return done(deviceaveErr);
            }

            // Update device title
            device.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing device
            agent.put('/api/device/' + deviceaveRes.body._id)
              .send(device)
              .expect(200)
              .end(function (deviceUpdateErr, deviceUpdateRes) {
                // Handle device update error
                if (deviceUpdateErr) {
                  return done(deviceUpdateErr);
                }

                // Set assertions
                (deviceUpdateRes.body._id).should.equal(deviceaveRes.body._id);
                (deviceUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an device if no title is provided', function (done) {
    // Invalidate title field
    device.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new device
        agent.post('/api/device')
          .send(device)
          .expect(400)
          .end(function (deviceaveErr, deviceaveRes) {
            // Set message assertion
            (deviceaveRes.body.message).should.match('Title cannot be blank');

            // Handle device save error
            done(deviceaveErr);
          });
      });
  });

  it('should be able to delete an device if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new device
        agent.post('/api/device')
          .send(device)
          .expect(200)
          .end(function (deviceaveErr, deviceaveRes) {
            // Handle device save error
            if (deviceaveErr) {
              return done(deviceaveErr);
            }

            // Delete an existing device
            agent.delete('/api/device/' + deviceaveRes.body._id)
              .send(device)
              .expect(200)
              .end(function (deviceDeleteErr, deviceDeleteRes) {
                // Handle device error error
                if (deviceDeleteErr) {
                  return done(deviceDeleteErr);
                }

                // Set assertions
                (deviceDeleteRes.body._id).should.equal(deviceaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single device if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new device model instance
    device.user = user;
    var deviceObj = new Device(device);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new device
        agent.post('/api/device')
          .send(device)
          .expect(200)
          .end(function (deviceaveErr, deviceaveRes) {
            // Handle device save error
            if (deviceaveErr) {
              return done(deviceaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (deviceInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
