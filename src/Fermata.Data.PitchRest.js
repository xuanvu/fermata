(function () {
  "use strict";

  //includes
  var SoundType = Fermata.Values.SoundType;
  var Utils = Fermata.Utils;

  //TODO better constructor (check args)
  Fermata.Data.PitchRest = function (noteData, attributes)
  {
    this.data = noteData;
    this.attributes = attributes;
    this.clef = attributes.clef[0];
  };

  var PitchRest = Fermata.Data.PitchRest;

  var otherDurationLine = 3;
  var wholeDurationLine = 4;

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
      var pitch;
      if (isWhole(this.data, this.attributes)) {
        pitch = Utils.lineToPitch(wholeDurationLine, this.clef);
      } else {
        pitch = Utils.lineToPitch(otherDurationLine, this.clef);
      }
      return pitch.step;
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
      var pitch;
      if (isWhole(this.data, this.attributes)) {
        pitch = Utils.lineToPitch(wholeDurationLine, this.clef);
      } else {
        pitch = Utils.lineToPitch(otherDurationLine, this.clef);
      }
      return pitch.octave;
    }
  };

  var isWhole = function (note, attributes) {
    var divisionDuration = note.duration;
    var divisions = attributes.divisions;
    var quarterDuration = divisionDuration / divisions;
    return quarterDuration === 4;
  };

}).call(this);
