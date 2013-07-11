(function () {
  "use strict";

  var UpdateBeatType = Fermata.Utils.AttributeDiff.UpdateBeatType;
  var UpdateBeats = Fermata.Utils.AttributeDiff.UpdateBeats;
  var UpdateDivisions = Fermata.Utils.AttributeDiff.UpdateDivisions;

  var AttributeDiff = Fermata.Utils.AttributeDiff;

  AttributeDiff.processorList = [
    new UpdateBeatType(),
    new UpdateBeats(),
    new UpdateDivisions()
  ];

}).call(this);
