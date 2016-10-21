(function () {
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
          mainstate = $state.get('device');
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
          liststate = $state.get('device.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('modules/device/client/views/list-device.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          DeviceController,
          mockDevice;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('device.view');
          $templateCache.put('modules/device/client/views/view-device.client.view.html', '');

          // create mock device
          mockDevice = new DeviceService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Device about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          DeviceController = $controller('DeviceController as vm', {
            $scope: $scope,
            deviceResolve: mockDevice
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:deviceId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.deviceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            deviceId: 1
          })).toEqual('/device/1');
        }));

        it('should attach an device to the controller scope', function () {
          expect($scope.vm.device._id).toBe(mockDevice._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/device/client/views/view-device.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('device.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('device/');
          $rootScope.$digest();

          expect($location.path()).toBe('/device');
          expect($state.current.templateUrl).toBe('modules/device/client/views/list-device.client.view.html');
        }));
      });
    });
  });
}());
