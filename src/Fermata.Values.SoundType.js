(function () {
  "use strict";

  Fermata.Values.SoundType =
    {
    PITCH: "pitch",
    UNPITCHED: "unpitched",
    REST: "rest"
  };

  var SoundType = Fermata.Values.SoundType;

  Fermata.Values.SoundType.getSoundType = function (noteData)
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
