(function () {
  "use strict";

  Fermata.Render.PitchPitched = function (noteData)
  {
    this.data = noteData;
  };

  var PitchPitched = Fermata.Render.PitchPitched;

  PitchPitched.prototype.getType = function ()
  {
    return Fermata.Render.SoundType.PITCH;
  };

  PitchPitched.prototype.getStep = function ()
  {
    return this.data.pitch.step;
  };

  PitchPitched.prototype.getAlter = function ()
  {
    if (typeof(this.data.pitch.alter) !== "undefined") {
      return this.data.pitch.alter;
    }
    else {
      return null;
    }
  };

  PitchPitched.prototype.getOctave = function ()
  {
    return this.data.pitch.octave;
  };

  PitchPitched.prototype.setStep = function (step)
  {
    this.data.pitch.step = step;
  };

  PitchPitched.prototype.setOctave = function (octave)
  {
    this.data.pitch.octave = octave;
  };

}).call(this);
