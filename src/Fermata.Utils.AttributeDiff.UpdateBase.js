(function () {
  "use strict";

  Fermata.Utils.AttributeDiff.UpdateBase = function () {
  };

  var UpdateBase = Fermata.Utils.AttributeDiff.UpdateBase;

  UpdateBase.prototype.canProcess = function (delta) {
    return this.pathExists(delta);
  };

  UpdateBase.prototype.pathExists = function (obj) {
    for (var i = 0; i < this.diffPath.length; i++) {
      var pathElement = this.diffPath[i];
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
    for (var i = 0; i < this.changePaths.length; i++) {
      var changePath = this.changePaths[i];

      this.createPathIfNotExists(result, changePath);
    }
  };

  UpdateBase.prototype.createPathIfNotExists = function (result, changePath) {
    var i = 0;

    while (i < changePath.length - 1 && !this.exists(result, changePath, i)) {
      var pathElem = changePath[i];
      result[pathElem] = {};
      result = result[pathElem];
      i++;
    }
  };

  UpdateBase.prototype.exists = function (result, changePath, i) {
    var pathElem = changePath[i];
    return typeof result[pathElem] !== "undefined";
  };

  UpdateBase.prototype.updatePaths = function (attr2, result) {
    for (var i = 0; i < this.changePaths.length; i++) {
      var changePath = this.changePaths[i];

      this.update(attr2, result, changePath);
    }
  };

  UpdateBase.prototype.update = function (attr2, result, changePath) {
    for (var i = 0; i < changePath.length - 1; i++) {
      var pathElem = changePath[i];
      attr2 = attr2[pathElem];
      result = result[pathElem];
    }

    var pathElem = changePath[i];
    result[pathElem] = attr2[pathElem];
  };

}).call(this);
