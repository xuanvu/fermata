/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var Fermata = Fermata || {};

(function () {
  "use strict";
  
  Fermata.Render.SoundType =
    {
    PITCH: "pitch",
    UNPITCHED: "unpitched",
    REST: "rest"
  };
  
  var SoundType = Fermata.Render.SoundType;
  
  Fermata.Render.SoundType.getSoundType = function (noteData)
  {
    if (typeof(noteData.pitch) !== "undefined")
    {
      return SoundType.PITCH;
    }
    else if (typeof(noteData.unpitched) !== "undefined")
    {
      return SoundType.UNPITCHED;
    }
    else if (typeof(noteData.rest) !== "undefined")
    {
      return SoundType.REST;
    }
    else
    {
      return null;
    }
  };
  
}).call(this);
