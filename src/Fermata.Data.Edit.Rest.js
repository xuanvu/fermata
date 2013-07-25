(function () {
  "use strict";

  var NotImplementedError = Fermata.Error.NotImplementedError;
  var Measure = Fermata.Data.Measure;

  Fermata.Data.prototype.getTypeFromDuration = function (beats, duration) {
    // TODO: study beats impact on type (well, impact is already known but has to be studied deeper).
    // TODO: put all stuff about duration in the same file, factorize. (and handle more cases)
    if (duration === 8) {
      return "half";
    }
    else if (duration === 4) {
      return "quarter";
    }
    else if (duration === 2) {
      return "eighth";
    }
    else {
      var errorMsg = "error: can't access the number of stave, or beat in part. throw exception.";
      throw new NotImplementedError(errorMsg);
    }
  };

  Fermata.Data.prototype.fillWithRest = function (part, idx) {
    var measureData = part.measure[idx];
    var measure = new Measure(measureData);
    measure.adjustDivisions();
    measure.adjustNotesDuration();
  };

}).call(this);