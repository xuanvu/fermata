(function () {
  "use strict";

  Fermata.Data.prototype.getTypeFromDuration = function (beats, duration) {
    // TODO: study beats impact on type (well, impact is already known but has to be studied deeper).
    // TODO: put all stuff about duration in the same file, factorize. (and handle more cases)
    if          (duration === 8)    { return "half"; }
    else if     (duration === 4)    { return "quarter"; }
    else if     (duration === 2)    { return "eighth"; }
    else {
      // TODO: throw error? Send smallest or biggest possible value?
      return "";
    }
  };

  Fermata.Data.prototype.fillWithRest = function (part, idx) {
    var nstave = 0;
    var beat;
    if (part.measure[idx].$fermata !== undefined) {
      if (part.measure[idx].$fermata.attributes !== undefined
          && part.measure[idx].$fermata.attributes.beat !== undefined) {
        beats = part.measure[idx].$fermata.attributes.beat;
      }
      if (part.measure[idx].$fermata.vexStaves !== undefined) {
        nstave = part.mesure[idx].$fermata.vexStaves.length;
      }
    }
    if (nstave === 0 || beat === undefined) {
      for (var i = 0 ; i < part.measure.length ; i++) {
        if (part.measure[i].$fermata !== undefined) {
          if (part.measure[i].$fermata.attributes !== undefined
              && part.measure[i].$fermata.attributes.beat !== undefined) {
            beat = part.measure[i].$fermata.attributes.beat;
          }
          if (part.measure[i].$fermata.vexStaves !== undefined) {
            nstave = part.measure[i].$fermata.vexStaves.length;
          }
          if (nstave !== 0 && beat !== undefined) {
            break;
          }
        }
      }
    }
    if (nstave === 0 || beat === undefined) {
      console.log(nstave, beat);
      console.log("error: can't access the number of stave, or beat in part. throw exception.")
      return;
    }
    for (var i = 0 ; i < nstave ; i++) {
      var duration = beat.beats * beat.type;
      var rest = {
        'duration': duration,
        'rest': {},
        'staff': i + 1,
        'type': this.getTypeFromDuration(beat, duration),
        'voice': 1
      };
      part.measure[idx].note.splice(i, 0, rest);
    }
  };

}).call(this);