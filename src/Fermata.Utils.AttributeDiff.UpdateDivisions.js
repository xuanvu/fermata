(function () {
  "use strict";

  var UpdateBase = Fermata.Utils.AttributeDiff.UpdateBase;

  Fermata.Utils.AttributeDiff.UpdateDivisions = function () {
    this.path = ["divisions"];
  };

  var UpdateDivisions = Fermata.Utils.AttributeDiff.UpdateDivisions;

  UpdateDivisions.prototype = new UpdateBase();
  UpdateDivisions.constructor = UpdateDivisions;

  UpdateDivisions.prototype.canProcess = function (delta) {
    return this.pathExists(delta);
  };

  UpdateDivisions.prototype.pathExists = function (obj) {
    for (var i = 0; i < this.path.length; i++) {
      var pathElement = this.path[i];
      if (typeof obj[pathElement] !== "undefined") {
        obj = obj[pathElement];
      } else {
        return false;
      }
    }
    return true;
  };

  UpdateDivisions.prototype.process = function (attr1, attr2, delta, result) {
    result.divisions = attr2.divisions;
  };

}).call(this);
