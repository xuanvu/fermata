(function () {
  "use strict";
  Fermata.Error.BeatTypeValueError = function (beatType, message) {
    this.name = "BeatTypeValueError";
    this.message = message || defaultMessage(beatType);
    this.beatType = beatType;
  };

  var BeatTypeValueError = Fermata.Error.BeatTypeValueError;

  BeatTypeValueError.prototype = new Error();
  BeatTypeValueError.prototype.constructor = BeatTypeValueError;

  var defaultMessage = function (beatType) {
    return "beat type value " +
            beatType +
            " is invalid. It has to be a power of two number";
  };

}).call(this);
