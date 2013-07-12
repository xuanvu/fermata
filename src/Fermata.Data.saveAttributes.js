(function () {
  "use strict";

  var Data = Fermata.Data;

  Data.prototype.saveAttributes = function ()
  {
    this.forEachPart(function (part) {
      var measures = part.measure;
      var previousMeasure = null;
      for (var i = 0 ; i < measures.length ; i++) {
        var measure = measures[i];
        
      }
    });
  };
}).call(this);
