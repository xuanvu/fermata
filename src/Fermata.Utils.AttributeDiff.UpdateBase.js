(function () {
  "use strict";

  Fermata.Utils.AttributeDiff.UpdateBase = function () {
  };

  var UpdateBase = Fermata.Utils.AttributeDiff.UpdateBase;

  UpdateBase.prototype.canProcess = function (delta) {
    return this.changePathExists(delta);
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
    this.createIfNotExists(result);
    this.update(attr2, result);
  };

  UpdateBase.prototype.createIfNotExists = function (result) {
    var i = 0;

    while (i < this.changePath.length - 1 && !this.exists(result, i)) {
      var pathElem = this.changePath[i];
      result[pathElem] = {};
      result = result[pathElem];
      i++;
    }
  };

  UpdateBase.prototype.exists = function (result, i) {
    var pathElem = this.changePath[i];
    return typeof result[pathElem] !== "undefined";
  };

  UpdateBase.prototype.update = function (attr2, result) {
    for (var i = 0; i < this.changePath.length - 1; i++) {
      var pathElem = this.changePath[i];
      attr2 = attr2[pathElem];
      result = result[pathElem];
    }

    var pathElem = this.changePath[i];
    result[pathElem] = attr2[pathElem];
  };

}).call(this);
