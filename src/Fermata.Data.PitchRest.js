(function () {
  "use strict";

  //includes
  var Clef = Fermata.Mapping.Clef;
  var SoundType = Fermata.Values.SoundType;
  var Utils = Fermata.Utils;

  //TODO better constructor (check args)
  Fermata.Data.PitchRest = function (noteData, attributes)
  {
    this.data = noteData;
    this.attributes = attributes;
    this.clef = attributes.clef[0];
    this.clefName = Fermata.Mapping.Clef.getVexflow(this.clef.sign);
  };

  var PitchRest = Fermata.Data.PitchRest;

  var otherDurationLine = 3;
  var wholeDurationLine = 4;

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
      return Clef.getMusicXml(this.clefName);
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
      return PitchRest.ClefMapping[this.clefName];
    }
  };

  var isWhole = function (note, attributes) {
    var divisionDuration = note.duration;
    var divisions = attributes.divisions;
    var quarterDuration = divisionDuration / divisions;
    return quarterDuration === 4;
  };

}).call(this);
