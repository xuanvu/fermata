(function () {
  "use strict";

  var PitchEncapsulator = Fermata.Data.PitchEncapsulator;
  var SoundType = Fermata.Values.SoundType;
  var NotImplementedError = Fermata.Error.NotImplementedError;
  var Step = Fermata.Values.Step;
  var Measure = Fermata.Data.Measure;
  var Utils = Fermata.Utils;

  // TODO: Fill with other values.
  var ValueLast = {
    FULL: 0,
    HALF: 1,
    QUARTER: 2,
    EIGHTH: 3
  };

  var typeToQuarterDuration = function (type) {
    if (type === ValueLast.FULL) {
      return 4;
    }
    else if (type === ValueLast.HALF) {
      return 2;
    }
    else if (type === ValueLast.QUARTER) {
      return 1;
    }
    else if (type === ValueLast.EIGHTH) {
      return 0.5;
    }
    else {
      var errorMsg = "this duration is not supported yet.";
      throw new NotImplementedError(errorMsg);
    }
  };

  var getQueue = function (voice) {
    // "up" and "down" are defined by the number of voices in the stave
    // TODO: return something else than "up" (voice calculation?)
    return "up";
  };

  var getValue = function (type) {
    if (type === ValueLast.FULL) {
      return "full";
    }
    else if (type === ValueLast.HALF) {
      return "half";
    }
    else if (type === ValueLast.QUARTER) {
      return "quarter";
    }
    else if (type === ValueLast.EIGHTH) {
      return "eighth";
    }
    else {
      // TODO: throw error? Send smallest or biggest possible value?
      return "";
    }
  };

  Fermata.Data.prototype.addNote = function (idxS, idxM, idxN,
          pitch, type, voice) {
    // TODO: handle salt (flat, sharp, etc.)
    if (!(idxS === undefined ||
            idxM === undefined ||
            idxN === undefined ||
            pitch === undefined ||
            type === undefined)) {
      if (voice === undefined) {
        voice = 1;
      }
      var part = this.getPart(idxS, Fermata.Data.cacheParts.IDX);
      if (part !== undefined) {
        if (idxM >= 0 && idxM < part.measure.length) {
          var measureData = part.measure[idxM];
          var measure = new Measure(measureData);
          var divisions = measure.getDivisions();
          var quarterDuration = typeToQuarterDuration(type);
          var divisionsDuration = quarterDuration * divisions;

          if (isEnoughSpace(measure, divisionsDuration, idxN)) {
            makeAddNote(measure, divisionsDuration, idxN, pitch, voice, type);
          }
        }
      }
    }
  };

  var isEnoughSpace = function (measure, divisionsNeeded, idx) {
    divisionsNeeded -= measure.calcAvailableSpaceAtIdx(divisionsNeeded, idx);
    if (divisionsNeeded > 0 &&
            !measure.isContinousSpacesToEnd(idx)) {
      divisionsNeeded -= measure.calcAvailableSpaceFromEnd(divisionsNeeded);
    }
    return divisionsNeeded === 0;
  };

  var makeAddNote = function (measure, divisionsDuration, idxN, line, voice, type) {
    if (divisionsDuration < 1) {
      measure.multiplyDivisions(1 / divisionsDuration);
      divisionsDuration = 1;
    }
    removeSpaces(measure, divisionsDuration, idxN);
    var clef = measure.data.$fermata.attributes.clef[0];
    var note = {
      'duration': divisionsDuration,
      'pitch': Utils.lineToPitch(line, clef),
      'stem': getQueue(voice),
      'type': getValue(type),
      'voice': voice
    };
    if (idxN < 0 || idxN > measure.data.note.length) {
      idxN = measure.data.note.length;
    }
    measure.data.note.splice(idxN, 0, note);
  };

  var removeSpaces = function (measure, divisionsNeeded, idx) {
    divisionsNeeded -= measure.removeSpacesAtIdx(divisionsNeeded, idx);
    if (divisionsNeeded > 0) {
      measure.removeSpacesFromEnd(divisionsNeeded);
    }
  };

  Fermata.Data.prototype.removeNote = function (idxS, idxM, idxN) {
    if (!(idxS === undefined ||
            idxM === undefined ||
            idxN === undefined)) {
      var part = this.getPart(idxS, Fermata.Data.cacheParts.IDX);
      if (part !== undefined) {
        if (idxM >= 0 && idxM < part.measure.length &&
                idxN >= 0 && idxN < part.measure[idxM].note.length) {
          var rest = {
            'duration': part.measure[idxM].note[idxN].duration,
            'rest': {},
            'staff': part.measure[idxM].note[idxN].staff,
            'type': part.measure[idxM].note[idxN].type,
            'voice': part.measure[idxM].note[idxN].voice
          };
          part.measure[idxM].note.splice(idxN, 1, rest);
          var _measure = new Fermata.Data.Measure(part.measure[idxM]);
          _measure.adjustNotesDuration();
        }
      }
    }
  };

  Fermata.Data.prototype.editNote = function (idxS, idxM, idxN,
          pitch, type, voice) {
    if (!(idxS === undefined ||
            idxM === undefined ||
            idxN === undefined)) {
      var part = this.getPart(idxS, Fermata.Data.cacheParts.IDX);
      if (part !== undefined) {
        if (idxM >= 0 && idxM < part.measure.length &&
                idxN >= 0 && idxN < part.measure[idxM].note.length) {
          var measure = part.measure[idxM];
          var note = measure.note[idxN];
          var clef = measure.$fermata.attributes.clef[0];
          if (note.rest === undefined) {
            if (pitch !== undefined) {
              note.pitch = Utils.lineToPitch(pitch, clef);
            }
            if (type !== undefined) {
              note.type = getValue(type);
            }
            if (voice !== undefined) {
              note.voice = voice;
              note.stem = getQueue(voice);
            }
          }
        }
      }
    }
  };

  Fermata.Data.prototype.changeNoteDuration = function (staveIdx, measureIdx, noteIdx, voice, type) {
    var voiceIdx = voice - 1;
    var part = this.getPart(staveIdx, Fermata.Data.cacheParts.IDX);
    var measureData = part.measure[measureIdx];
    var measure = new Measure(measureData);
    var note = measure.getVoice(voiceIdx)[noteIdx];
    if (isRest(note)) {
      // TODO: throw an exception
      return;
    }

    var divisions = measure.getDivisions();
    var quarterDuration = typeToQuarterDuration(type);
    var divisionsDuration = quarterDuration * divisions;
    var oldDuration = note.duration;
    var durationShift = divisionsDuration - oldDuration;
    if (durationShift > 0) {
      if (!isEnoughSpaceToIncreaseDuraiton(measure, durationShift, voiceIdx)) {
        // TODO: Throw an exception
        return ;
      }
      note.duration = divisionsDuration;
      measure.removeSpacesFromEnd(durationShift, voiceIdx);
    } else {
      durationShift = -durationShift;
      if (divisionsDuration < 1) {
        var coeff = 1 / divisionsDuration;
        measure.multiplyDivisions(coeff);
        divisionsDuration = 1;
        durationShift *= coeff;
      }
      note.duration = divisionsDuration;
      measure.addSpacesAtEnd(durationShift, voiceIdx);
    }
  };
  
  var isEnoughSpaceToIncreaseDuraiton = function (measure, divisionsNeeded, voiceIdx) {
    var availableSpaces = measure.calcAvailableSpaceFromEnd(divisionsNeeded, voiceIdx);
    return availableSpaces === divisionsNeeded;
  };

  Fermata.Data.prototype.changeNotePitch = function (staveIdx, measureIdx, noteIdx, value) {
    var note = this.fetchNote(staveIdx, measureIdx, noteIdx);
    var pitch = PitchEncapsulator.encapsulate(note, null);

    if (pitch.getType() === SoundType.PITCH) {
      pitch.changePitch(value);
    } else {
      var errorMsg = "pitch change is not supported on this type of note";
      throw new NotImplementedError(errorMsg);
    }
  };

  Fermata.Data.prototype.fetchNote = function (staveIdx, measureIdx, noteIdx) {
    var part = this.getPart(staveIdx, Fermata.Data.cacheParts.IDX);
    var measure = part.measure[measureIdx];
    var note = measure.note[noteIdx];

    return note;
  };
  
  var isRest = function (note) {
    return SoundType.getSoundType(note) === SoundType.REST;
  };
}).call(this);
