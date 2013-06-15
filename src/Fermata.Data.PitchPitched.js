(function () {
  "use strict";

  var Step = Fermata.Values.Step;
  var Octave = Fermata.Values.Octave;
  var PitchRangeError = Fermata.Error.PitchRangeError;
  var StepRangeError = Fermata.Error.StepRangeError;
  var OctaveRangeError = Fermata.Error.OctaveRangeError;
  var SoundType = Fermata.Values.SoundType.PITCH;

  Fermata.Data.PitchPitched = function (noteData)
  {
    this.data = noteData;
  };

  var PitchPitched = Fermata.Data.PitchPitched;

  PitchPitched.prototype.getType = function ()
  {
    return SoundType.PITCH;
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
    if (!Step.check(step)) {
      throw new StepRangeError(step);
    }

    this.data.pitch.step = step;
  };

  PitchPitched.prototype.setOctave = function (octave)
  {
    if (!Octave.check(octave)) {
      throw new OctaveRangeError(octave);
    }

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
  };

  PitchPitched.prototype.changePitch = function (shiftVal)
  {
    var stepIdx = Step.idx[this.getStep()];
    var shiftedStep = stepIdx + shiftVal;
    var octaveShift = calcOctaveShift(shiftedStep);
    var newOctave = this.getOctave() + octaveShift;
    var newStep = calcClearStep(shiftedStep);

    if (!Octave.check(newOctave)) {
      throw new PitchRangeError();
    }

    this.setOctave(newOctave);
    this.setStep(Step.values[newStep]);
  };

}).call(this);
