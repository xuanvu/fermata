(function () {
  "use strict";

  var PitchEncapsulator = Fermata.Data.PitchEncapsulator;
  var SoundType = Fermata.Values.SoundType;
  var NotImplementedError = Fermata.Error.NotImplementedError;

  // TODO: Fill with other values.
  var ValueLast = {
    HALF:       "0",
    QUARTER:    "1",
    EIGHTH:     "2"
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
      var errorMsg = "this duration is not supported yet.";
      throw new NotImplementedError(errorMsg);
    }
  };

  Fermata.Data.prototype.getQueue = function (voice) {
    // "up" and "down" are defined by the number of voices in the stave
    // TODO: return something else than "up" (voice calculation?)
    return "up";
  };

  Fermata.Data.prototype.getStep = function (val) {
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

  Fermata.Data.prototype.getOctave = function (val) {
    val = (val > 0) ? Math.floor(val) : Math.ceil(val);
    var octave = 4
    octave += val;
    // for (i = val; i < 0; i++) {
    //   octave /= 2;
    // }
    // for (i = val; i > 0; i--) {
    //   octave *= 2;
    // }
    return octave;
  };

  Fermata.Data.prototype.getPitch = function (pitch) {
    var p_octave = 3.5;
    var n_octave = -p_octave;
    var step = "L";
    if (pitch < 0) {
      step = this.getStep(pitch % n_octave);
    }
    else {
      step = this.getStep(pitch % p_octave);
    }
    var octave = this.getOctave(pitch / p_octave);
    return { 'octave': octave, 'step': step};
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
          var note = {
            'duration': this.getDuration(type),
            'pitch': this.getPitch(pitch),
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
          pitch, octave, type, voice) {
    if (!(idxS === undefined ||
            idxM === undefined ||
            idxN === undefined)) {
      var part = this.getPart(idxS, Fermata.Data.cacheParts.IDX);
      if (part !== undefined) {
        if (idxM >= 0 && idxM < part.measure.length &&
                idxN >= 0 && idxN < part.measure[idxM].note.length) {
          var note = part.measure[idxM].note[idxN];
          if (note.rest !== undefined) {
            if (pitch !== undefined) {
              note.pitch = this.getPitch(pitch);
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
