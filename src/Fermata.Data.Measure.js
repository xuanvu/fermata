(function () {
  "use strict";

  var AttributeDiff = Fermata.Utils.AttributeDiff;
  var BeatsValueError = Fermata.Error.BeatsValueError;
  var BeatTypeValueError = Fermata.Error.BeatTypeValueError;
  var SoundType = Fermata.Values.SoundType;
  var Utils = Fermata.Utils;

  Fermata.Data.Measure = function (measureData)
  {
    this.data = measureData;
    if (this.isRendered()) {
      this.attributes = measureData.$fermata.attributes;
    }
    this.voices = null;
  };

  var Measure = Fermata.Data.Measure;

  Measure.prototype.getVoices = function () {
    if (this.voices === null) {
      this.fillVoices(measureData.note);
    }
    return this.voices;
  };

  Measure.prototype.getVoice = function (idx) {
    return this.getVoices[idx];
  };

  Measure.prototype.fillVoices = function (notes) {
    for (var i = 0; i < notes.length; i++) {
      var note = notes[i];

      var voiceIdx = 0;
      if (typeof note.voice !== "undefined") {
        voiceIdx = parseInt(note.voice, 10) - 1;
      }
      if (typeof this.voices[voiceIdx] === "undefined") {
        this.createVoice(voiceIdx);
      }
      this.voices[voiceIdx].push(note);
    }
  };

  Measure.prototype.createVoice = function (idx) {
    for (var i = 0; i <= idx; i++) {
      if (typeof this.voices[i] === "undefined") {
        this.voices[i] = [];
      }
    }
  };

  Measure.prototype.isRendered = function () {
    return typeof this.data.$fermata !== "undefined" &&
            typeof this.data.$fermata.attributes !== "undefined";
  };

  Measure.prototype.isCompliant = function () {
    var authorizedDuration = this.getAuthorizedDuration();
    for (var i = 0; i < this.getVoices().length; i++) {
      var actualDuration = this.getActualDuration(i);
      if (authorizedDuration !== actualDuration) {
        return false;
      }
    }
    return true;
  };

  Measure.prototype.initBeat = function (beats, beatType) {
    validateBeat(beats, beatType);

    if (typeof this.data.attributes === "undefined") {
      this.data.attributes = [{}];
    }
    if (typeof this.data.attributes[0].time === "undefined") {
      this.data.attributes[0].time = {};
    }

    this.data.attributes[0].time.beats = beats;
    this.data.attributes[0].time["beat-type"] = beatType;
  };

  Measure.prototype.setBeat = function (beats, beatType) {
    validateBeat(beats, beatType);
    this.attributes.time.beats = beats;
    this.attributes.time["beat-type"] = beatType;
    this.adjustDivisions();
    this.adjustNotesDuration();
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

    for (var i = 1; i <= num2; i++) {
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
    var actualDuration = this.getActualDuration();

    if (authorizedDuration > actualDuration) {
      this.fillMissingDivisionsWithRest(authorizedDuration - actualDuration);
    } else if (authorizedDuration < actualDuration) {
      this.removeExcedentDivisionsInRest(actualDuration - authorizedDuration);
    }
  };

  Measure.prototype.removeExcedentDivisionsInRest = function (divisionsToRemove) {
    var i = this.data.note.length - 1;
    while (i > 0 && isRest(this.data.note[i]) && divisionsToRemove > 0) {
      var note = this.data.note[i];
      if (divisionsToRemove < note.duration) {
        note.duration = divisionsToRemove;
      } else {
        this.data.note.pop();
      }
      divisionsToRemove -= note.duration;
      i--;
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

  Measure.prototype.getActualDuration = function (voiceIdx) {
    if (typeof voiceIdx === "undefined") {
      voiceIdx = 0;
    }
    var notes = this.getVoice(voiceIdx);
    var actualDuration = 0;
    for (var i = 0; i < notes.length; i++) {
      var note = notes[i];
      if (!isChord(note)) {
        var noteDuration = parseInt(note.duration, 10);
        actualDuration += noteDuration;
      }
    }

    return actualDuration;
  };

  var isChord = function (note) {
    return typeof note.chord !== "undefined";
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
      return this.data.attributes[0].time["beat-type"];
    }
  };

  Measure.prototype.getBeats = function () {
    if (this.isRendered()) {
      return this.attributes.time.beats;
    } else {
      return this.data.attributes[0].time.beats;
    }
  };

  Measure.prototype.getDivisions = function () {
    if (this.isRendered()) {
      return this.attributes.divisions;
    } else {
      return this.data.attributes[0].divisions;
    }
  };

  Measure.prototype.setDivisions = function (divisions) {
    if (this.isRendered()) {
      this.attributes.divisions = divisions;
    } else {
      this.data.attributes[0].divisions = divisions;
    }
  };

  Measure.prototype.updateAttributes = function () {
    if (this.isRendered()) {
      this.data.attributes = [Utils.Clone(this.attributes)];
      Utils.epureAttributes(this.data.attributes[0]);
      filterAttributes(this.data.attributes[0]);
    }
  };

  var filterAttributes = function (attr) {
    filterDefaultAttributes(attr);
    if (attr.clef.length === 1) {
      attr.clef = attr.clef[0];
    } else if (attr.clef.length === 0) {
      delete attr.clef;
    }
  };

  var filterDefaultAttributes = function (attr) {
    var defaultClefOctaveChange = "0";
    var defaultStaves = "1";

    for (var i = 0; i < attr.clef.length; i++) {
      var clef = attr.clef[i];
      if (clef["clef-octave-change"] === defaultClefOctaveChange) {
        delete clef["clef-octave-change"];
      }
    }
    if (attr.staves === defaultStaves) {
      delete attr.staves;
    }
    if (isDefaultPartSymbol(attr["part-symbol"])) {
      delete attr["part-symbol"];
    }
  };

  var isDefaultPartSymbol = function (partSymbol) {
    var defaultValues = [
      {key: "top-staff", value: "1"},
      {key: "bottom-staff", value: "2"},
      {key: "symbol", value: "brace"}
    ];

    for (var i = 0; i < defaultValues.length; i++) {
      var defaultValue = defaultValues[i];
      if (partSymbol[defaultValue.key] !== defaultValue.value) {
        return false;
      }
    }
    return true;
  };

  Measure.prototype.updateFromPrevious = function (previousMeasureData) {
    var previousAttributes = previousMeasureData.$fermata.attributes;
    var attributes = this.attributes;
    var attributeDiff = new AttributeDiff(previousAttributes, attributes);

    var result = attributeDiff.getResult();
    if (result !== null) {
      this.data.attributes = [result];
      Utils.epureAttributes(this.data.attributes[0]);
    } else if (typeof this.data.attributes !== "undefined") {
      delete this.data.attributes;
    }
  };

  Measure.prototype.clearMeasure = function () {
    console.log(this.data);
    for (var i = 1; i < this.data.$fermata.vexNotes.length; i++) {
      for (var j = 1; j < this.data.$fermata.vexNotes[i].length; j++) {
        for (var k = 0; k < this.data.$fermata.vexNotes[i][j].length; k++) {
          this.data.$fermata.vexNotes[i][j][k].st.remove();
        }
      }
    }
  };

}).call(this);
