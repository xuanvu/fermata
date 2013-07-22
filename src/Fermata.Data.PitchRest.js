(function () {
  "use strict";

  //includes
  var Clef = Fermata.Mapping.Clef;
  var SoundType = Fermata.Values.SoundType;

  //TODO better constructor (check args)
  Fermata.Data.PitchRest = function (noteData, clef)
  {
    this.data = noteData;
    this.clef = clef;
  };

  var otherDurationLine = 3;
  var wholeDurationLine = 4;

  var PitchRest = Fermata.Data.PitchRest;

  //TODO: use the mapping file
  PitchRest.ClefMapping = {
    "treble": 4,
    "alto": 4,
    "bass": 3
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
      return PitchRest.ClefMapping[this.clef];
    }
  };

}).call(this);
