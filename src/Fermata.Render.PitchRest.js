/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var Fermata = Fermata || {};

(function () {
  "use strict";
  
  //includes
  var SoundType = Fermata.Render.SoundType;
  
  //TODO better constructor (check args)
  Fermata.Render.PitchRest = function (noteData, clef)
  {
    this.data = noteData;
    this.clef = clef;
  };
  
  var PitchRest = Fermata.Render.PitchRest;
  
  //includes
  var Clef = Fermata.Mapping.Clef;
  
  //TODO: use the mapping file
  PitchRest.ClefMapping = {
    "treble": {
      step: "B", 
      octave: 4
    },
    "alto": {
      step: "C",
      octave: 4
    },
    "bass": {
      step: "D", 
      octave: 3
    }
  };
  
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
      return Clef.getMusicXml(this.clef);
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
      return PitchRest.ClefMapping[this.clef].octave;
    }
  };
  
}).call(this);
