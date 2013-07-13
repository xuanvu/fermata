(function () {
  "use strict";

  var Measure = Fermata.Data.Measure;

  var Data = Fermata.Data;

  Data.prototype.saveAttributes = function ()
  {
    this.forEachPart(function (part) {
      var measures = part.measure;
      var previousMeasure = null;
      for (var i = 0; i < measures.length; i++) {
        var measure = measures[i];
        if (i === 0) {
          saveAttributesFirst(measure);
        } else {
          saveAttributesOther(previousMeasure, measure);
        }
        previousMeasure = measure;
      }
    });
  };

  var saveAttributesFirst = function (measureData) {
    var measure = new Measure(measureData);

    measure.updateAttributes();
  };

  var saveAttributesOther = function (previousMeasure, measureData) {
    var measure = new Measure(measureData);
    
    measure.updateFromPrevious(previousMeasure);
  };

}).call(this);
