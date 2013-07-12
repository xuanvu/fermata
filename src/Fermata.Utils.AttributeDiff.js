(function () {
  "use strict";

  Fermata.Utils.AttributeDiff = function (attr1, attr2) {
    this.attr1 = attr1;
    this.attr2 = attr2;
    this.delta = jsondiffpatch.diff(attr1, attr2);
    if (typeof this.delta !== "undefined") {
      this.result = {};
      this.fillResult();
    } else {
      this.result = null;
    }
    this.hasProcessed = false;
  };

  var AttributeDiff = Fermata.Utils.AttributeDiff;

  AttributeDiff.prototype.fillResult = function () {
    for (var i = 0; i < AttributeDiff.processorList.length; i++) {
      var attributesProcessor = AttributeDiff.processorList[i];

      if (attributesProcessor.canProcess(this.delta)) {
        attributesProcessor.process(this.attr1, this.attr2, this.delta, this.result);
        this.hasProcessed = true;
      }
    }
  };

  AttributeDiff.prototype.getResult = function () {
    if (this.hasProcessed) {
    return this.result;
    } else {
      return null;
    }
  };

}).call(this);
