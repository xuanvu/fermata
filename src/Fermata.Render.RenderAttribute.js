(function () {
  "use strict";

  var Call = Fermata.Utils.Call;

  Fermata.Render.prototype.renderAttributesDefault = {
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

  var _render = Fermata.Render.prototype;

  Fermata.Render.prototype.AttributesClefProcess = [
    {key: 'sign', type: Call.FuncTypes.$1, dataType: 'string'},
    {key: 'line', type: Call.FuncTypes.$01, dataType: 'int'},
    {key: 'clef-octave-change', type: Call.FuncTypes.$01, dataType: 'int', dataKey: 'clef-octave-change'}
  ];

  Fermata.Render.prototype.AttributesClef = function (node, i, attribut)
  {
    var clef = {
      sign: null,
      line: null,
      "clef-octave-change": 0
    };

    this.exploreSubNodes({object: node, processes: _render.AttributesClefProcess, ctx: this, out: clef});
    this.cur.measure.$fermata.attributes.clef.push(clef);
  };

  Fermata.Render.prototype.AttributesTimeProcess = [
    {key: 'beats', type: Call.FuncTypes.$1, dataType: 'int'},
    {key: 'beat-type', type: Call.FuncTypes.$1, dataType: 'int', dataKey: 'beat-type'}
  ];

  Fermata.Render.prototype.AttributesTime = function (node, i, attribut)
  {
    this.exploreSubNodes({object: node, processes: _render.AttributesTimeProcess,
      ctx: this, out: this.cur.measure.$fermata.attributes.time});
  };

  Fermata.Render.prototype.AttributesKeysTraditionalProcess = [
    {key: 'cancel', type: Call.FuncTypes.$01, func: null},
    {key: 'fifths', type: Call.FuncTypes.$1, dataType: 'int'},
    {key: 'mode', type: Call.FuncTypes.$01, dataType: 'string'},
    {key: 'key-octave', type: Call.FuncTypes.$0n, func: null}
  ];

  Fermata.Render.prototype.AttributesKeysNonTraditionalProcess = [
    {key: "key-step", type: Call.FuncTypes.$1, func: null},
    {key: "key-alter", type: Call.FuncTypes.$1, func: null},
    {key: "key-accidental", type: Call.FuncTypes.$01, func: null},
    {key: 'key-octave', type: Call.FuncTypes.$0n, func: null}
  ];

  Fermata.Render.prototype.AttributesKeys = function (node, i, attribut)
  {
    this.exploreSubNodes({object: node, ctx: this,
      processes: typeof(node.fifths) !==
              'undefined' ? _render.AttributesKeysTraditionalProcess : _render.AttributesKeysNonTraditionalProcess,
      out: this.cur.measure.$fermata.attributes.keys});
  };

  // TODO: tests
  Fermata.Render.prototype.AttributesSymbol = function (node)
  {
    this.cur.measure.$fermata.attributes["part-symbol"].symbol = typeof(node) ===
            'string' ? node : node.$t;
    if (node['top-staff']) {
      this.cur.measure.$fermata.attributes["part-symbol"]["top-staff"] = node['top-staff'];
    }
    if (node['bottom-staff']) {
      this.cur.measure.$fermata.attributes["part-symbol"]["bottom-staff"] = node['bottom-staff'];
    }
  };

  Fermata.Render.prototype.renderAttributesProcess = [
    {key: 'divisions', type: Call.FuncTypes.$01, dataType: 'int'},
    {key: 'key', type: Call.FuncTypes.$0n, func: _render.AttributesKeys},
    {key: 'time', type: Call.FuncTypes.$0n, func: _render.AttributesTime},
    {key: 'staves', type: Call.FuncTypes.$01, dataType: 'int'},
    {key: 'part-symbol', type: Call.FuncTypes.$01, func: _render.AttributesSymbol},
    {key: 'instruments', type: Call.FuncTypes.$01, dataType: 'string'},
    {key: 'clef', type: Call.FuncTypes.$0n, func: _render.AttributesClef},
    {key: 'staff-details', type: Call.FuncTypes.$0n, func: null},
    {key: 'transpose', type: Call.FuncTypes.$0n, func: null},
    {key: 'directive', type: Call.FuncTypes.$0n, func: null},
    {key: 'dirmeasure-styleective', type: Call.FuncTypes.$0n, func: null}
  ];

  Fermata.Render.prototype.renderAttributes = function (attributes)
  {
    // Use default attributes
    if (this.cur.measureIdx === 0 ||
            typeof(this.cur.part.measure[this.cur.measureIdx - 1]) ===
            'undefined') {
      this.cur.measure.$fermata.attributes = Fermata.Utils.Clone(Fermata.Render.prototype.renderAttributesDefault);
    }
    // Use from last measure
    else {
      this.cur.measure.$fermata.attributes = Fermata.Utils.Clone(this.cur.part.measure[this.cur.measureIdx -
              1].$fermata.attributes);
    }

    if (typeof(attributes) !== 'undefined') {
      this.exploreSubNodes({object: attributes, processes: Fermata.Render.prototype.renderAttributesProcess,
        ctx: this, out: this.cur.measure.$fermata.attributes}, this.cur.measure.$fermata.attributes);
    }
  };

}).call(this);
