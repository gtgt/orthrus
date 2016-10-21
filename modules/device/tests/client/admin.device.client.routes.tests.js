﻿(function () {
  'use strict';

  describe('Device Route Tests', function () {
    // Initialize global variables
    var $scope,
      DeviceService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DeviceService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DeviceService = _DeviceService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.device');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/device');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('admin.device.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('modules/device/client/views/admin/list-device.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DeviceAdminController,
          mockDevice;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.device.create');
          $templateCache.put('modules/device/client/views/admin/form-device.client.view.html', '');

          // Create mock device
          mockDevice = new DeviceService();

          // Initialize Controller
          DeviceAdminController = $controller('DeviceAdminController as vm', {
            $scope: $scope,
            deviceResolve: mockDevice
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.deviceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/device/create');
        }));

        it('should attach an device to the controller scope', function () {
          expect($scope.vm.device._id).toBe(mockDevice._id);
          expect($scope.vm.device._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/device/client/views/admin/form-device.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DeviceAdminController,
          mockDevice;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.device.edit');
          $templateCache.put('modules/device/client/views/admin/form-device.client.view.html', '');

          // Create mock device
          mockDevice = new DeviceService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Device about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          DeviceAdminController = $controller('DeviceAdminController as vm', {
            $scope: $scope,
            deviceResolve: mockDevice
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:deviceId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.deviceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            deviceId: 1
          })).toEqual('/admin/device/1/edit');
        }));

        it('should attach an device to the controller scope', function () {
          expect($scope.vm.device._id).toBe(mockDevice._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/device/client/views/admin/form-device.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
