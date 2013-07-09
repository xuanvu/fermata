(function () {
  "use strict";

  Fermata.Utils.AttributeDiff = function (attr1, attr2) {
    this.attr1 = attr1;
    this.attr2 = attr2;
    this.delta = jsondiffpatch.diff(attr1, attr2);
    this.result = {};
    this.fillResult();
  };

  var AttributeDiff = Fermata.Utils.AttributeDiff;

  AttributeDiff.prototype.fillResult = function () {

  };

  AttributeDiff.prototype.getResult = function () {

  };

}).call(this);
