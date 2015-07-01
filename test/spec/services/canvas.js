'use strict';

describe('Service: Canvas', function () {

  // load the service's module
  beforeEach(module('testApp'));

  // instantiate service
  var Canvas;
  beforeEach(inject(function (_Canvas_) {
    Canvas = _Canvas_;
  }));

  it('should do something', function () {
    expect(!!Canvas).toBe(true);
  });

});
