(function () {
  "use strict";

  var PitchEncapsulator = Fermata.Data.PitchEncapsulator;
  var SoundType = Fermata.Values.SoundType;
  var NotImplementedError = Fermata.Error.NotImplementedError;
  var Step = Fermata.Values.Step;
  var Measure = Fermata.Data.Measure;

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

  var distanceFromG = {
    "G": 0,
    "C": Step.idx.G - Step.idx.C,
    "F": Step.idx.G - Step.idx.F + Step.values.length
  };

  var calcValueCorrection = function (sign, line) {
    var clefStepIdx = Step.idx[sign];

    var refGLine = 2;
    var gSign = "G";
    var refGStepFromOrigin = refGLine * 2;

    var signShift = distanceFromG[sign];
    var clefStepFromOrigin = line * 2;
    var actualGStepFromOrigin = clefStepFromOrigin + signShift;
    var stepCorrection = refGStepFromOrigin - actualGStepFromOrigin;
    var valueCorrection = stepCorrection / 2;

    return valueCorrection;
  };

  var getStep = function (val) {
    if (val === 0) {
      return "C";
    }
    if (val === 0.5 || val === -3) {
      return "D";
    }
    if (val === 1 || val === -2.5) {
      return "E";
    }
    if (val === 1.5 || val === -2) {
      return "F";
    }
    if (val === 2 || val === -1.5) {
      return "G";
    }
    if (val === 2.5 || val === -1) {
      return "A";
    }
    if (val === 3 || val === -0.5) {
      return "B";
    }
  };

  var getPitch = function (pitch, sign, line) {
    var valueCorrection = calcValueCorrection(sign, line);
    pitch = parseInt(pitch, 10);
    pitch += valueCorrection;
    var p_octave = 3.5;
    var n_octave = -p_octave;
    var step = "L";
    if (pitch < 0) {
      step = getStep(pitch % n_octave);
    }
    else {
      step = getStep(pitch % p_octave);
    }
    var octave = 4 + Math.floor(pitch / p_octave);
    return {'octave': octave, 'step': step};
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

  var isEnoughSpace = function (notes, divisionsDuration, idx) {
    var i = idx;
    while (i < notes.length && divisionsDuration > 0) {
      var note = notes[i];
      if (!isRest(note)) {
        return false;
      }
      if (note.duration > divisionsDuration) {
        note.duration -= divisionsDuration;
        return true;
      } else {
        divisionsDuration -= note.duration;
        i++;
      }
    }
    return divisionsDuration === 0;
  };

  var isRest = function (note) {
    return SoundType.getSoundType(note) === SoundType.REST;
  };

  var makeAddNote = function (measure, divisionsDuration, idxN, pitch, voice, type) {
    removeSpaces(measure.note, divisionsDuration, idxN);
    var clef = measure.$fermata.attributes.clef[0];
    if (divisionsDuration < 1) {
      adaptMeasureDivisions(measure, divisionsDuration);
    }
    var note = {
      'duration': divisionsDuration,
      'pitch': getPitch(pitch, clef.sign, clef.line),
      'stem': getQueue(voice),
      'type': getValue(type),
      'voice': voice
    };
    if (idxN < 0 || idxN > measure.note.length) {
      idxN = measure.note.length;
    }
    measure.note.splice(idxN, 0, note);
  };

  var removeSpaces = function (notes, divisionsDuration, idx) {
    while (divisionsDuration > 0) {
      var note = notes[idx];
      if (note.duration > divisionsDuration) {
        note.duration -= divisionsDuration;
        divisionsDuration = 0;
      } else {
        divisionsDuration -= note.duration;
        notes.splice(idx, 0);
      }
    }
  };

  var adaptMeasureDivisions = function (measureData, divisionsDuration) {
    var measure = new Measure(measureData);
    measure.multiplyDivisions(1 / divisionsDuration);
    divisionsDuration = 1;
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
              note.pitch = getPitch(pitch, clef.sign, clef.line);
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
