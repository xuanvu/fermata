(function () {
  "use strict";

  // Includes
  var SoundType = Fermata.Render.SoundType;
  var PitchPitched = Fermata.Render.PitchPitched;
  var PitchRest = Fermata.Render.PitchRest;

  Fermata.Render.PitchEncapsulator = {};

  var PitchEncapsulator = Fermata.Render.PitchEncapsulator;

  PitchEncapsulator.encapsulate = function (noteData, clefName)
  {
    var soundType = SoundType.getSoundType(noteData);

    if (soundType === SoundType.PITCH) {
      return new PitchPitched(noteData);
    }
    else if (soundType === SoundType.REST) {
      return new PitchRest(noteData, clefName);
    }
    else {
      return null;
    }
  };

}).call(this);
