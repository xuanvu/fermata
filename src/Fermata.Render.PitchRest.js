/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var Fermata = Fermata || {};

(function () {
  "use strict";
  
  //includes
  var SoundType = Fermata.Render.SoundType;
  
  Fermata.Render.PitchRest = function (noteData)
  {
    this.data = noteData;
  };
  
  var PitchRest = Fermata.Render.PitchRest;
  
  PitchRest.prototype.getType = function ()
  {
    return SoundType.REST;
  };
  
  PitchRest.prototype.getStep = function ()
  {
    if (typeof(this.data["display-step"]) !== "undefined")
    {
      return this.data["display-step"];
    }
    else
    {
      //TODO: check what is the good default value
      return "E";
    }
  };
  
  PitchRest.prototype.getAlter = function ()
  {
    return null;
  };
  
  PitchRest.prototype.getOctave = function ()
  {
    if (typeof(this.data["display-octave"]) !== "undefined")
    {
      return this.data["display-octave"];
    }
    else
    {
      //TODO: check what is the good default value
      return "5";
    }
  };
  
}).call(this);
