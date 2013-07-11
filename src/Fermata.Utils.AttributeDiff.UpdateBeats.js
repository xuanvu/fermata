(function () {
  "use strict";

  var UpdateBase = Fermata.Utils.AttributeDiff.UpdateBase;

  Fermata.Utils.AttributeDiff.UpdateBeats = function () {
    this.diffPath = ["time", "beats"];
    this.changePaths = [
      this.diffPath,
      ["time", "beat-type"]
    ];
  };

  var UpdateBeats = Fermata.Utils.AttributeDiff.UpdateBeats;

  UpdateBeats.prototype = new UpdateBase();
  UpdateBeats.constructor = UpdateBeats;

}).call(this);
