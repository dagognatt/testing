'use strict';

describe('Service: polygon', function () {

  // load the service's module
  beforeEach(module('testApp'));

  // instantiate service
  var polygon;
  beforeEach(inject(function (_polygon_) {
    polygon = _polygon_;
  }));

  it('should do something', function () {
    expect(!!polygon).toBe(true);
  });

});
