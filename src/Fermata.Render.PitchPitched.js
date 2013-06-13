(function () {
  "use strict";

  var Step = Fermata.Values.Step;

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

  var calcOctaveShift = function (stepIdx) {
    stepIdx /= Step.values.length;
    return Math.floor(stepIdx);
  };

  var calcClearStep = function (shiftedStep) {
    var clearStep = shiftedStep % Step.values.length;
    if (clearStep < 0) {
      clearStep += Step.values.length;
    }
    
    return clearStep;
  }

  PitchPitched.prototype.changePitch = function (shiftVal)
  {
    var stepIdx = Step.idx[this.getStep()];
    var shiftedStep = stepIdx + shiftVal;
    var octaveShift = calcOctaveShift(shiftedStep);
    var newOctave = this.getOctave() + octaveShift;
    var newStep = calcClearStep(shiftedStep);

    this.setOctave(newOctave);
    this.setStep(Step.values[newStep]);
  };

}).call(this);
