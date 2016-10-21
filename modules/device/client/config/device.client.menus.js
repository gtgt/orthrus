(function () {
  'use strict';

  angular.module('device')
  .run(function(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Device',
      state: 'device',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'device', {
      title: 'List',
      state: 'device.list',
      roles: ['*']
    });
  });
}());
