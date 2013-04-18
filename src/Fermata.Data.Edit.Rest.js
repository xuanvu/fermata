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

  Fermata.Data.prototype.fillWithRest = function (measure) {
    for (var i = 0 ; i < measure.$fermata.vexStaves.length ; i++) {
      var duration = measure.$fermata.attributes.beats.beat * measure.$fermata.attributes.beats.type;
      var rest = {
        'duration': duration,
        'rest': {},
        'staff': i + 1,
        'type': this.getTypeFromDuration(measure.$fermata.attributes.beats, duration),
        'voice': 1
      };
      measure.note.splice(i, 0, rest);
    }
  };
  
}).call(this);