var Fermata = Fermata || {};
Fermata.Tests = Fermata.Tests || {};
Fermata.Tests.Utils = {};

Fermata.Tests.Utils.LoadJSONFixture = function (fixture, callback) {
  // Client-side, use jQuery
  if (typeof require === 'undefined') {
    $.getJSON('../fixtures/' + fixture, function(data) {
      callback(data);
    });
  }
  else {
    var fs = require('fs');
    fs.readFile(__dirname + '/fixtures/' + fixture, 'UTF-8', function(err, data) {
      callback(JSON.parse(data));
    });
  }
};

Fermata.Tests.Utils.CreateCanvas = function(selector) {
  if (typeof require !== 'undefined') {
    var Canvas = require('canvas');
    return new Canvas(200, 200);
  }
  else {
    var container = $(selector)[0];
    // container.getContext('2d').clear();
    $(selector).empty();
    return container;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Fermata;
}
else {
  CanvasRenderingContext2D.prototype.clear = 
    CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
    if (preserveTransform) {
      this.save();
      this.setTransform(1, 0, 0, 1, 0, 0);
    }

    this.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (preserveTransform) {
      this.restore();
    }           
  };
}