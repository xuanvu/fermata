(function () {
  "use strict";

  var Call = Fermata.Utils.Call;
  var Utils = Fermata.Utils;
  
  var Data = Fermata.Data;

  var defaultAttributes = {
    divisions: null,
    instrument: null,
    keys: {
      cancel: null,
      fifths: null,
      mode: null
    },
    time: {
      beats: null,
      "beat-type": null,
      interchangeable: null
    },
    clef: [],
    staves: 1,
    "part-symbol": {
      "top-staff": 1,
      "bottom-staff": 2,
      symbol: 'brace'
    }
  };

  Data.prototype.reconstructAttributes = function ()
  {
    var measures = [];

    for (var i = 0; i < measures.length; i++) {
      var measure = measures[i];
      createAttributes(measure);
      if (i === 0) {
        initAttributesFirst(measure);
      } else {
        var previousMeasure = measures[i - 1];
        initAttributesOther(previousMeasure, measure);
      }
      if (hasAttributes(measure)) {
        fillAttributes(measure);
      }
    }
  };

  var createAttributes = function (measure) {
    if (typeof measure.$fermata === "undefined") {
      measure.$fermata = {};
    }
  };

  var initAttributesFirst = function (measure) {
    measure.$fermata.attributes = Utils.Clone(defaultAttributes);
  };

  var initAttributesOthers = function (previousMeasure, measure) {
    measure.$fermata.attributes = Utils.Clone(previousMeasure.$fermata.attributes);
  };
  
  var hasAttributes = function (measure) {
    return typeof measure.attributes !== "undefined";
  };
  
  var fillAttributes = function (measure) {
    //TODO: code
  };

}).call(this);
