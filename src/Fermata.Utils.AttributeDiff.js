(function () {
  "use strict";

  var UpdateBeatType = Fermata.Utils.AttributeDiff.UpdateBeatType;
  var UpdateBeats = Fermata.Utils.AttributeDiff.UpdateBeats;
  var UpdateDivisions = Fermata.Utils.AttributeDiff.UpdateDivisions;

  Fermata.Utils.AttributeDiff = function (attr1, attr2) {
    this.attr1 = attr1;
    this.attr2 = attr2;
    this.delta = jsondiffpatch.diff(attr1, attr2);
    this.result = {};
    this.fillResult();
  };

  var AttributeDiff = Fermata.Utils.AttributeDiff;

  var attributesProcessors = [
    new UpdateBeatType(),
    new UpdateBeats(),
    new UpdateDivisions()
  ];

  AttributeDiff.prototype.fillResult = function () {
    for (var i = 0; i < attributesProcessors.length; i++) {
      var attributesProcessor = attributesProcessors[i];

      if (attributesProcessor.canProcess(this.delta)) {
        attributesProcessor.process(this.attr1, this.attr2, this.delta, this.result);
      }
    }
  };

  AttributeDiff.prototype.getResult = function () {
    return this.result;
  };

}).call(this);
