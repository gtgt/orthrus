(function () {
  'use strict';

  angular
    .module('wsdisplay')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Monitor',
      state: 'wsdisplay'
    });
  }
}());
