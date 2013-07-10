(function () {
  "use strict";

  Fermata.Utils.AttributeDiff.UpdateBase = function () {
  };

  var UpdateBase = Fermata.Utils.AttributeDiff.UpdateBase;

  UpdateBase.prototype.canProcess = function (delta) {
    return this.pathExists(delta);
  };

  UpdateBase.prototype.pathExists = function (obj) {
    for (var i = 0; i < this.changePath.length; i++) {
      var pathElement = this.changePath[i];
      if (typeof obj[pathElement] !== "undefined") {
        obj = obj[pathElement];
      } else {
        return false;
      }
    }
    return true;
  };

  UpdateBase.prototype.process = function (attr1, attr2, delta, result) {
    this.createPathsIfNotExists(result);
    this.updatePaths(attr2, result);
  };

  UpdateBase.prototype.createPathsIfNotExists = function (result) {
    for (var i = 0; i < this.updatePaths.length; i++) {
      var updatePath = this.updatePaths[i];

      this.createPathIfNotExists(result, updatePath);
    }
  };

  UpdateBase.prototype.createPathIfNotExists = function (result, updatePath) {
    var i = 0;

    while (i < updatePath.length - 1 && !this.exists(result, updatePath, i)) {
      var pathElem = updatePath[i];
      result[pathElem] = {};
      result = result[pathElem];
      i++;
    }
  };

  UpdateBase.prototype.exists = function (result, updatePath, i) {
    var pathElem = updatePath[i];
    return typeof result[pathElem] !== "undefined";
  };

  UpdateBase.prototype.updatePaths = function (attr2, result) {
    for (var i = 0; i < this.updatePaths.length; i++) {
      var updatePath = this.updatePaths[i];

      this.update(attr2, result, updatePath);
    }
  };

  UpdateBase.prototype.update = function (attr2, result, updatePath) {
    for (var i = 0; i < updatePath.length - 1; i++) {
      var pathElem = updatePath[i];
      attr2 = attr2[pathElem];
      result = result[pathElem];
    }

    var pathElem = updatePath[i];
    result[pathElem] = attr2[pathElem];
  };

}).call(this);
