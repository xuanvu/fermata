(function () {
  "use strict";

  var BeatsValueError = Fermata.Error.BeatsValueError;
  var BeatTypeValueError = Fermata.Error.BeatTypeValueError;
  var SoundType = Fermata.Values.SoundType;

  Fermata.Data.Measure = function (measureData)
  {
    this.data = measureData;
    if (this.isRendered()) {
      this.attributes = measureData.$fermata.attributes;
    }
  };

  var Measure = Fermata.Data.Measure;

  Measure.prototype.isRendered = function () {
    return typeof this.data.$fermata !== "undefined" &&
            typeof this.data.$fermata.attributes !== "undefined";
  };

  Measure.prototype.initBeat = function (beats, beatType) {
    validateBeat(beats, beatType);

    if (typeof this.data.attributes === "undefined") {
      this.data.attributes = {};
    }
    if (typeof this.data.attributes.time === "undefined") {
      this.data.attributes.time = {};
    }

    this.data.attributes.time.beats = beats;
    this.data.attributes.time["beat-type"] = beatType;
  };

  Measure.prototype.adjustDivisions = function () {
    var beatTypeDivisions = this.getBeatTypeDivisions();
    var currentDivisions = this.getDivisions();
    var newDivisions = lcm(beatTypeDivisions, currentDivisions);
    if (newDivisions !== currentDivisions) {
      this.multiplyDivisions(newDivisions / currentDivisions);
    }
  };

  var lcm = function (a, b) {
    var num1 = a > b ? a : b;
    var num2 = a > b ? b : a;

    for (var i = 1; i < num2; i++) {
      if ((num1 * i) % num2 === 0) {
        return num1 * i;
      }
    }
    return num2;
  };

  Measure.prototype.multiplyDivisions = function (value) {
    var divisions = this.getDivisions();
    divisions *= value;
    this.setDivisions(divisions);
    for (var i = 0; i < this.data.note.length; i++) {
      var note = this.data.note[i];
      note.duration *= value;
    }
  };

  Measure.prototype.getBeatTypeDivisions = function () {
    var quarterBeatType = wholeDivisionToQuarterCoeff(this.getBeatType());
    if (quarterBeatType >= 1) {
      return 1;
    } else {
      return 1 / quarterBeatType;
    }
  };

  Measure.prototype.adjustNotesDuration = function () {
    var authorizedDuration = this.getAuthorizedDuration();
    var actualDuration = this.getAuthorizedDuration();

    if (authorizedDuration > actualDuration) {
      this.removeExcedendDivisionsInRest(authorizedDuration - actualDuration);
    } else if (actualDuration < authorizedDuration) {
      this.fillMissingDivisionsWithRest(actualDuration - authorizedDuration);
    }
  };

  Measure.prototype.removeExcedentDivisionsInRest = function (divisionsToRemove) {
    var i = this.data.note.length - 1;
    while (i > 0 && isRest(this.data.note[i]) && divisionsToRemove > 0) {
      var note = this.data.note;
      if (divisionsToRemove < note.duration) {
        note.duration = divisionsToRemove;
      } else {
        this.data.note.pop();
      }
      divisionsToRemove -= note.duration;
    }
  };

  var isRest = function (note) {
    return SoundType.getSoundType(note) === SoundType.REST;
  };

  Measure.prototype.fillMissingDivisionsWithRest = function (divisionsToAdd) {
    var beatTypeDivisions = this.getBeatTypeDivisions();
    while (divisionsToAdd > 0) {
      var note = createRest();
      if (divisionsToAdd < beatTypeDivisions) {
        note.duration = divisionsToAdd;
      } else {
        note.duration = beatTypeDivisions;
      }
      divisionsToAdd -= note.duration;
      this.data.note.push(note);
    }
  };

  var createRest = function () {
    return {
      duration: 1,
      rest: {}
    };
  };

  Measure.prototype.getAuthorizedDuration = function () {
    var quarterBeatType = wholeDivisionToQuarterCoeff(this.getBeatType());
    var divisionsBeatType = quarterBeatType * this.getDivisions();
    var authorizedDuration = divisionsBeatType * this.getBeats();

    return authorizedDuration;
  };

  var wholeDivisionToQuarterCoeff = function (wholeDivision) {
    return 4 / wholeDivision;
  };

  Measure.prototype.getActualDuration = function () {
    var actualDuration = 0;
    for (var i = 0; i < this.data.note.length; i++) {
      var note = this.data.note[i];
      var noteDuration = note.duration;
      var noteDivisions = noteDuration * this.getDivisions();

      actualDuration += noteDivisions;
    }

    return actualDuration;
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

  Measure.prototype.getBeatType = function () {
    if (this.isRendered()) {
      return this.attributes.time["beat-type"];
    } else {
      return this.data.attributes.time["beat-type"];
    }
  };

  Measure.prototype.getBeats = function () {
    if (this.isRendered()) {
      return this.attributes.time.beats;
    } else {
      return this.data.attributes.time.beats;
    }
  };

  Measure.prototype.getDivisions = function () {
    if (this.isRendered()) {
      return this.attributes.divisions;
    } else {
      return this.data.attributes.divisions;
    }
  };

  Measure.prototype.setDivisions = function (divisions) {
    if (this.isRendered()) {
      this.attributes.divisions = divisions;
    } else {
      this.data.attributes.divisions = divisions;
    }
  };

}).call(this);
