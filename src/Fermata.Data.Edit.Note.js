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
          var measure = part.measure[idxM];
          var divisions = measure.$fermata.attributes.divisions;
          var quarterDuration = typeToQuarterDuration(type);
          var divisionsDuration = quarterDuration * divisions;

          if (isEnoughSpace(measure.note, divisionsDuration, idxN)) {
            makeAddNote(measure, divisionsDuration, idxN, pitch, voice, type);
          }
        }
      }
    }
  };

  var isEnoughSpace = function (notes, divisionsNeeded, idx) {
    divisionsNeeded -= calcAvailableSpaceAtIdx(notes, divisionsNeeded, idx);
    if (divisionsNeeded > 0 && !isContinousSpace(notes, idx)) {
      divisionsNeeded -= calcAvailableSpaceFromEnd(notes, divisionsNeeded);
    }
    return divisionsNeeded === 0;
  };

  var isContinousSpace = function (notes, idx) {
    for (var i = idx; i < notes.length; i++) {
      var note = notes[i];
      if (!isRest(note)) {
        return false;
      }
    }
    return true;
  };

  var calcAvailableSpaceAtIdx = function (notes, divisionsNeeded, idx) {
    var spaceAvailable = divisionsNeeded;
    var i = idx;
    while (i < notes.length && divisionsNeeded > 0) {
      var note = notes[i];
      if (!isRest(note)) {
        return spaceAvailable - divisionsNeeded;
      }
      if (note.duration > divisionsNeeded) {
        divisionsNeeded = 0;
      } else {
        divisionsNeeded -= note.duration;
        i++;
      }
    }
    return spaceAvailable - divisionsNeeded;
  };

  var calcAvailableSpaceFromEnd = function (notes, divisionsNeeded) {
    var spaceAvailable = divisionsNeeded;
    var i = notes.length - 1;
    while (i >= 0 && divisionsNeeded > 0) {
      var note = notes[i];
      if (!isRest(note)) {
        return spaceAvailable - divisionsNeeded;
      } else if (note.duration > divisionsNeeded) {
        divisionsNeeded = 0;
      } else {
        divisionsNeeded -= note.duration;
        i--;
      }
    }
    return spaceAvailable - divisionsNeeded;
  };

  var isRest = function (note) {
    return SoundType.getSoundType(note) === SoundType.REST;
  };

  var makeAddNote = function (measureData, divisionsDuration, idxN, line, voice, type) {
    var measure = new Measure(measureData);

    if (divisionsDuration < 1) {
      measure.multiplyDivisions(1 / divisionsDuration);
      divisionsDuration = 1;
    }
    removeSpaces(measure, divisionsDuration, idxN);
    var clef = measureData.$fermata.attributes.clef[0];
    var note = {
      'duration': divisionsDuration,
      'pitch': Utils.lineToPitch(line, clef),
      'stem': getQueue(voice),
      'type': getValue(type),
      'voice': voice
    };
    if (idxN < 0 || idxN > measureData.note.length) {
      idxN = measureData.note.length;
    }
    measureData.note.splice(idxN, 0, note);
  };

  var removeSpaces = function (measure, divisionsNeeded, idx) {
    divisionsNeeded -= measure.removeSpacesAtIdx(divisionsNeeded, idx);
    if (divisionsNeeded > 0) {
      measure.removeSpacesFromEnd(divisionsNeeded);
    }
  };

  var removeSpacesAtIdx = function (notes, divisionsNeeded, idx) {
    var spaceConsumed = divisionsNeeded;
    while (divisionsNeeded > 0) {
      var note = notes[idx];
      if (!isRest(note)) {
        return spaceConsumed - divisionsNeeded;
      } else if (note.duration > divisionsNeeded) {
        note.duration -= divisionsNeeded;
        divisionsNeeded = 0;
      } else {
        divisionsNeeded -= note.duration;
        notes.splice(idx, 1);
      }
    }
    return spaceConsumed - divisionsNeeded;
  };

  var removeSpacesFromEnd = function (notes, divisionsNeeded) {
    while (divisionsNeeded > 0) {
      var note = notes[notes.length - 1];
      if (note.duration > divisionsNeeded) {
        note.duration -= divisionsNeeded;
        divisionsNeeded = 0;
      } else {
        divisionsNeeded -= note.duration;
        notes.splice(-1, 1);
      }
    }
  };

  var adaptMeasureDivisions = function (measureData, divisionsDuration) {
    var measure = new Measure(measureData);
    measure.multiplyDivisions(1 / divisionsDuration);
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
}).call(this);
