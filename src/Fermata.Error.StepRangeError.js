(function () {
  "use strict";
  var PitchRangeError = Fermata.Error.PitchRangeError;

  Fermata.Error.StepRangeError = function (step) {
    this.name = "StepRangeError";
    this.step = step;
    this.message = "step value " + step + " is outside authorized range";
  };

  var StepRangeError = Fermata.Error.StepRangeError;

  StepRangeError.prototype = new PitchRangeError();
  StepRangeError.prototype.constructor = StepRangeError;
}).call(this);
