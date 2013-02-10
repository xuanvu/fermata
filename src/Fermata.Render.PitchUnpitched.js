(function () {
  "use strict";
  
  Fermata.Render.PitchUnpitched = function (noteData)
  {
    this.data = noteData;
  };
  
  var PitchUnpitched = Fermata.Render.PitchUnpitched;
  
  PitchUnpitched.prototype.getType = function ()
  {
    return Fermata.Render.SoundType.UNPITCHED;
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
