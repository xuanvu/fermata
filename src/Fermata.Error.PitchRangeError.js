(function () {
  "use strict";
  Fermata.Error.PitchRangeError = function (message) {
    this.name = "PitchRangeError";
    this.message = message || "The pitch setted is outside authorized range";
  };

  var PitchRangeError = Fermata.Error.PitchRangeError;

  PitchRangeError.prototype = new Error();
  PitchRangeError.prototype.constructor = PitchRangeError;
}).call(this);
