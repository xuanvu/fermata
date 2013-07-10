(function () {
  "use strict";

  var UpdateBase = Fermata.Utils.AttributeDiff.UpdateBase;

  Fermata.Utils.AttributeDiff.UpdateDivisions = function () {
    this.diffPath = ["divisions"];
    this.updatePaths = [this.diffPath];
  };

  var UpdateDivisions = Fermata.Utils.AttributeDiff.UpdateDivisions;

  UpdateDivisions.prototype = new UpdateBase();
  UpdateDivisions.constructor = UpdateDivisions;

}).call(this);
