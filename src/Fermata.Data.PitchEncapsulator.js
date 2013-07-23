(function () {
  "use strict";

  // Includes
  var SoundType = Fermata.Values.SoundType;
  var PitchPitched = Fermata.Data.PitchPitched;
  var PitchRest = Fermata.Data.PitchRest;

  Fermata.Data.PitchEncapsulator = {};

  var PitchEncapsulator = Fermata.Data.PitchEncapsulator;

  PitchEncapsulator.encapsulate = function (noteData, attributes)
  {
    var soundType = SoundType.getSoundType(noteData);

    if (soundType === SoundType.PITCH) {
      return new PitchPitched(noteData);
    }
    else if (soundType === SoundType.REST) {
      return new PitchRest(noteData, attributes);
    }
    else {
      return null;
    }
  };

}).call(this);
