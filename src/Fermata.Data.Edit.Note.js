(function () {
  "use strict";

  var PitchEncapsulator = Fermata.Render.PitchEncapsulator;
  var SoundType = Fermata.Render.SoundType;
  var NotImplementedError = Fermata.Error.NotImplementedError;

  // TODO: Fill with other values.
  var ValueLast = {
    HALF: 0,
    QUARTER: 1,
    EIGHTH: 2
  };

  Fermata.Data.prototype.getDuration = function (type) {
    if (type === ValueLast.HALF) {
      return 8;
    }
    else if (type === ValueLast.QUARTER) {
      return 4;
    }
    else if (type === ValueLast.EIGHTH) {
      return 2;
    }
    else {
      // TODO: Return biggest or smallest possible value?
      return 1;
    }
  };

  Fermata.Data.prototype.getQueue = function (voice) {
    // "up" and "down" are defined by the number of voices in the stave
    // TODO: return something else than "up" (voice calculation?)
    return "up";
  };

  Fermata.Data.prototype.getValue = function (type) {
    if (type === ValueLast.HALF) {
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
          step, octave, type, voice) {
    // TODO: handle salt (flat, sharp, etc.)
    if (!(idxS === undefined ||
            idxM === undefined ||
            idxN === undefined ||
            octave === undefined ||
            step === undefined ||
            type === undefined)) {
      if (voice === undefined) {
        voice = 1;
      }
      var part = this.getPart(idxS, Fermata.Data.cacheParts.IDX);
      if (part !== undefined) {
        if (idxM >= 0 && idxM < part.measure.length) {
          var note = {
            'duration': this.getDuration(type),
            'pitch': {
              'octave': octave,
              'step': step
            },
            'stem': this.getQueue(voice),
            'type': this.getValue(type),
            'voice': voice
          };
          if (idxN < 0 || idxN > part.measure[idxM].note.length) {
            idxN = part.measure[idxM].note.length;
          }
          part.measure[idxM].note.splice(idxN, 0, note);
        }
      }
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
        }
      }
    }
  };

  Fermata.Data.prototype.editNote = function (idxS, idxM, idxN,
          step, octave, type, voice) {
    if (!(idxS === undefined ||
            idxM === undefined ||
            idxN === undefined)) {
      var part = this.getPart(idxS, Fermata.Data.cacheParts.IDX);
      if (part !== undefined) {
        if (idxM >= 0 && idxM < part.measure.length &&
                idxN >= 0 && idxN < part.measure[idxM].note.length) {
          var note = part.measure[idxM].note[idxN];
          if (step !== undefined) {
            note.pitch.step = step;
          }
          if (octave !== undefined) {
            note.pitch.octave = octave;
          }
          if (type !== undefined) {
            note.type = this.getValue(type);
          }
          if (voice !== undefined) {
            note.voice = voice;
            note.stem = this.getQueue(voice);
          }
        }
      }
    }
  };

  Fermata.Data.prototype.changeNotePitch = function () {
    var note = null;
    var pitch = PitchEncapsulator.encapsulate(note, null);

    if (pitch.getType() === SoundType.PITCH) {
      pitch.changePitch();
    } else {
      var errorMsg = "pitch change is not supported on this type of note";
      throw new NotImplementedError(errorMsg);
    }
  };
}).call(this);
