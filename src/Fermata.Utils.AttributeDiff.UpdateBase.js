(function () {
  "use strict";

  Fermata.Utils.AttributeDiff.UpdateBase = function () {
  };

  var UpdateBase = Fermata.Utils.AttributeDiff.UpdateBase;

  UpdateBase.prototype.canProcess = function (delta) {
    return this.pathExists(delta);
  };

  UpdateBase.prototype.pathExists = function (obj) {
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

  UpdateBase.prototype.process = function (attr1, attr2, delta, result) {
    this.createIfNotExists(result);
    this.update(attr2, result);
  };

  UpdateBase.prototype.createIfNotExists = function (result) {
    var i = 0;

    while (i < this.path.length - 1 && !this.exists(result, i)) {
      var pathElem = this.path[i];
      result[pathElem] = {};
      result = result[pathElem];
      i++;
    }
  };

  UpdateBase.prototype.exists = function (result, i) {
    var pathElem = this.path[i];
    return typeof result[pathElem] !== "undefined";
  };

  UpdateBase.prototype.update = function (attr2, result) {
    for (var i = 0; i < path.length - 1; i++) {
      var pathElem = this.path[i];
      attr2 = attr2[pathElem];
      result = result[pathElem];
    }

    var pathElem = this.path[i];
    result[pathElem] = attr2[pathElem];
  };

}).call(this);
