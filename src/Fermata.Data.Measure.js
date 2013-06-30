(function () {
  "use strict";

  var BeatsValueError = Fermata.Error.BeatsValueError;
  var BeatTypeValueError = Fermata.Error.BeatTypeValueError;

  Fermata.Data.Measure = function (measureData)
  {
    this.data = measureData;
    this.attributes = measureData.$fermata.attributes;
  };

  var Measure = Fermata.Data.Measure;

  Measure.prototype.initBeat = function (beats, beatType) {
    validateBeat(beats, beatType);
    this.data.attributes.time.beats = beats;
    this.data.attributes.time["beat-type"] = beatType;
  };

  var validateBeat = function (beats, beatType) {
    if (!checkBeats(beats)) {
      throw new BeatsValueError(beats);
    }
    if (!checkBeatType(beatType)) {
      throw new BeatTypeValueError(beatType);
    }
  };

  var checkBeatType = function (beatType) {
    var intValue = parseInt(beatType, 10);
    return isInteger(beatType) && isPowerOfTwo(intValue);
  };

  var isPowerOfTwo = function (value) {
    return value !== 0 && ((value & (value - 1)) === 0);
  };

  var checkBeats = function (beats) {
    var intValue = parseInt(beats, 10);
    return intValue > 0 && isInteger(beats);
  };

  var isInteger = function (value) {
    return parseInt(value, 10) === parseFloat(value) && !isNaN(value);
  };

}).call(this);
