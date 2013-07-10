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
    for (var i = 0; i < this.processorList.length; i++) {
      var attributesProcessor = this.processorList[i];

      if (attributesProcessor.canProcess(this.delta)) {
        attributesProcessor.process(this.attr1, this.attr2, this.delta, this.result);
      }
    }
  };

  AttributeDiff.prototype.getResult = function () {
    return this.result;
  };

}).call(this);
