(function () {
  "use strict";

  var UpdateBase = Fermata.Utils.AttributeDiff.UpdateBase;

  Fermata.Utils.AttributeDiff.UpdateBeatType = function () {
    this.diffPath = ["time", "beat-type"];
    this.changePaths = [
      this.diffPath,
      ["time", "beats"]
    ];
  };

  var UpdateBeatType = Fermata.Utils.AttributeDiff.UpdateBeatType;

  UpdateBeatType.prototype = new UpdateBase();
  UpdateBeatType.constructor = UpdateBeatType;

}).call(this);
