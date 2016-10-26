(function (app) {
  'use strict';

  app.registerModule('wsdisplay', ['core']);
  app.registerModule('wsdisplay.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
