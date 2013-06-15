(function () {
  "use strict";

  var SoundType = Fermata.Values.SoundType.UNPITCHED;

  Fermata.Data.PitchUnpitched = function (noteData)
  {
    this.data = noteData;
  };

  var PitchUnpitched = Fermata.Data.PitchUnpitched;

  PitchUnpitched.prototype.getType = function ()
  {
    return SoundType.UNPITCHED;
  };

  PitchUnpitched.prototype.getStep = function ()
  {
    return this.data["display-step"];
  };

  PitchUnpitched.prototype.getAlter = function ()
  {
    return null;
  };

  PitchUnpitched.prototype.getOctave = function ()
  {
    return this.data["display-octave"];
  };

}).call(this);
