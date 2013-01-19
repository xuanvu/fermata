/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var Fermata = Fermata || {};

(function () {
  "use strict";
  
  //includes
  var SoundType = Fermata.Render.SoundType;
  
  Fermata.Render.PitchPitched = function (noteData)
  {
    this.data = noteData;
  };
  
  var PitchPitched = Fermata.Render.PitchPitched;
  
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
  
}).call(this);
