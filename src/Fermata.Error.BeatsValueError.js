(function () {
  "use strict";
  Fermata.Error.BeatsValueError = function (beats, message) {
    this.name = "BeatsValueError";
    this.message = message || defaultMessage(beats);
    this.beats = beats;
  };

  var BeatsValueError = Fermata.Error.BeatsValueError;

  BeatsValueError.prototype = new Error();
  BeatsValueError.prototype.constructor = BeatsValueError;

  var defaultMessage = function (beats) {
    return "beats value " +
            beats +
            " is invalid. It has to be a positive non null integer";
  };

}).call(this);
