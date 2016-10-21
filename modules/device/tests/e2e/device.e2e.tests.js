'use strict';

describe('Device E2E Tests:', function () {
  describe('Test device page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/device');
      expect(element.all(by.repeater('device in device')).count()).toEqual(0);
    });
  });
});
