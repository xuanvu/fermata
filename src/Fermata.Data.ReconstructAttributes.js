(function () {
  "use strict";

  var Call = Fermata.Utils.Call;
  var Utils = Fermata.Utils;

  var Data = Fermata.Data;

  var defaultAttributes = {
    divisions: null,
    instrument: null,
    key: {
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

  Data.prototype.reconstructAttributes = function (measures)
  {
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
        fillAllAttributes(measure);
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

  var initAttributesOther = function (previousMeasure, measure) {
    measure.$fermata.attributes = Utils.Clone(previousMeasure.$fermata.attributes);
  };

  var hasAttributes = function (measure) {
    return typeof measure.attributes !== "undefined";
  };

  var fillAllAttributes = function (measure) {
    if (isArray(measure.attributes)) {
      for (var i = 0; i < measure.attributes.length; i++) {
        var attributesElem = measure.attributes[i];
        fillAttributes(attributesElem, measure.$fermata.attributes);
      }
    } else {
      fillAttributes(measure.attributes, measure.$fermata.attributes);
    }
  };

  var isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  var fillAttributes = function (sourceAttr, destAttr) {
    var p = {object: sourceAttr,
      processes: attributesProcess,
      ctx: this,
      out: destAttr};
    Call.exploreSubNodes(p, destAttr);
  };

  var attributesKeys = function (node, i, attributes)
  {
    var processes = typeof(node.fifths) !== 'undefined' ?
            attributesKeysTraditionalProcess :
            attributesKeysNonTraditionalProcess;
    var p = {object: node,
      ctx: this,
      processes: processes,
      out: attributes.key};
    Call.exploreSubNodes(p);
  };

  var attributesTime = function (node, i, attributes)
  {
    var p = {
      object: node,
      processes: attributesTimeProcess,
      ctx: this,
      out: attributes.time
    };
    Call.exploreSubNodes(p);
  };

  var attributesSymbol = function (node, attributes)
  {
    attributes["part-symbol"].symbol = typeof(node) === 'string' ?
            node :
            node.$t;
    if (node['top-staff']) {
      attributes["part-symbol"]["top-staff"] = node['top-staff'];
    }
    if (node['bottom-staff']) {
      attributes["part-symbol"]["bottom-staff"] = node['bottom-staff'];
    }
  };

  var attributesClef = function (node, i, attributes)
  {
    var clef = {
      sign: null,
      line: null,
      "clef-octave-change": 0
    };
    var p = {
      object: node,
      processes: attributesClefProcess,
      ctx: this,
      out: clef
    };

    Call.exploreSubNodes(p);
    attributes.clef.push(clef);
  };

  var attributesProcess = [
    {key: 'divisions', type: Call.FuncTypes.$01, dataType: 'int'},
    {key: 'key', type: Call.FuncTypes.$0n, func: attributesKeys},
    {key: 'time', type: Call.FuncTypes.$0n, func: attributesTime},
    {key: 'staves', type: Call.FuncTypes.$01, dataType: 'int'},
    {key: 'part-symbol', type: Call.FuncTypes.$01, func: attributesSymbol},
    {key: 'instruments', type: Call.FuncTypes.$01, dataType: 'string'},
    {key: 'clef', type: Call.FuncTypes.$0n, func: attributesClef},
    {key: 'staff-details', type: Call.FuncTypes.$0n, func: null},
    {key: 'transpose', type: Call.FuncTypes.$0n, func: null},
    {key: 'directive', type: Call.FuncTypes.$0n, func: null},
    {key: 'dirmeasure-styleective', type: Call.FuncTypes.$0n, func: null}
  ];

  var attributesKeysTraditionalProcess = [
    {key: 'cancel', type: Call.FuncTypes.$01, func: null},
    {key: 'fifths', type: Call.FuncTypes.$1, dataType: 'int'},
    {key: 'mode', type: Call.FuncTypes.$01, dataType: 'string'},
    {key: 'key-octave', type: Call.FuncTypes.$0n, func: null}
  ];

  var attributesKeysNonTraditionalProcess = [
    {key: "key-step", type: Call.FuncTypes.$1, func: null},
    {key: "key-alter", type: Call.FuncTypes.$1, func: null},
    {key: "key-accidental", type: Call.FuncTypes.$01, func: null},
    {key: 'key-octave', type: Call.FuncTypes.$0n, func: null}
  ];

  var attributesTimeProcess = [
    {key: 'beats', type: Call.FuncTypes.$1, dataType: 'int'},
    {key: 'beat-type', type: Call.FuncTypes.$1, dataType: 'int', dataKey: 'beat-type'}
  ];

  var attributesClefProcess = [
    {key: 'sign', type: Call.FuncTypes.$1, dataType: 'string'},
    {key: 'line', type: Call.FuncTypes.$01, dataType: 'int'},
    {key: 'clef-octave-change', type: Call.FuncTypes.$01, dataType: 'int', dataKey: 'clef-octave-change'}
  ];

}).call(this);
