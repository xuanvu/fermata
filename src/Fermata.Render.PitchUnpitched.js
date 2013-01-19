/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var Fermata = Fermata || {};

(function () {
  "use strict";
  
  //includes
  var SoundType = Fermata.Render.SoundType;
  
  Fermata.Render.PitchUnpitched = function (noteData)
  {
    this.data = noteData;
  };
  
  var PitchUnpitched = Fermata.Render.PitchUnpitched;
  
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
