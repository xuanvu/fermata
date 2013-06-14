(function () {
  "use strict";
  var PitchRangeError = Fermata.Error.PitchRangeError;

  Fermata.Error.OctaveRangeError = function (octave) {
    this.name = "OctaveRangeError";
    this.octave = octave;
    this.message = "octave value " + octave + " is outside authorized range";
  };

  var OctaveRangeError = Fermata.Error.OctaveRangeError;

  OctaveRangeError.prototype = new PitchRangeError();
  OctaveRangeError.prototype.constructor = OctaveRangeError;
}).call(this);
