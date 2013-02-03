var Fermata = Fermata || {};

(function () {
  "use strict";

  Fermata.Render.prototype.renderAttributesDefault = {
    division: null,
    instrument: null,
    keys:  {
      cancel: null,
      fifths: null,
      mode: null
    },
    beat: {
      beats: null,
      type: null,
      interchangeable: null
    },
    clef: [],
    stave: 1,
    partSymbol: {
      topStaff : 1,
      bottomStaff : 2,
      symbol : 'brace'
    }
  };

  Fermata.Render.prototype.AttributesSymbol = function (node, attribut)
  {
    if (typeof(node.content) === 'undefined' && typeof(node) === 'string')
      attribut.partSymbol.symbol = node;
    else if (typeof(node.content) === 'string')
      attribut.partSymbol.symbol = node.content;

    if (node["top-staff"])
      attribut.partSymbol.topStaff = node["top-staff"];
    if (node["bottom-staff"])
      attribut.partSymbol.bottomStaff = node["bottom-staff"];
  };

  Fermata.Render.prototype.AttributesClef = function (node, attribut)
  {
    // TOdo beaucoup d'Entities ici !
    var _this = this;
    var clef = { 
        sign: null,
        line: null,
        change: 0
      };

    var process = [
      {
        key: "sign",
        type: Fermata.Render.prototype.FuncTypes.$1,
        func: function (arg) {
          _this.AttributesClefSign(arg, clef);
        }
      },
      {
        key: "line",
        type: Fermata.Render.prototype.FuncTypes.$01,
        func: function (arg) {
          _this.AttributesClefLine(arg, clef);
        }
      },
      {
        key: "clef-octave-change",
        type: Fermata.Render.prototype.FuncTypes.$01,
        func: function (arg) {
          _this.AttributeClefChange(arg, clef);
        }
      }
    ];

    this.exploreSubNodes(node, process);
    attribut.clef.push(clef);
  };

  Fermata.Render.prototype.AttributeClefChange = function (change, attribut)
  {
    attribut.change = change;
  };

  Fermata.Render.prototype.AttributesClefLine = function (node, attribut)
  {
    attribut.line = node;
  };

  Fermata.Render.prototype.AttributesClefSign = function (node, attribut)
  {
    attribut.sign = node;
  };

  Fermata.Render.prototype.AttributesTime = function (node, attribut)
  {
    //To do géré la multidefinition de beat
    var _this = this;
    var process = [
      {
        key: "beats",
        type: Fermata.Render.prototype.FuncTypes.$1,
        func: function (arg) {
          _this.renderAttributesTimeBeats(arg, attribut);
        }
      },
      {
        key: "beat-type",
        type: Fermata.Render.prototype.FuncTypes.$1,
        func: function (arg) {
          _this.renderAttributesTimeTypes(arg, attribut);
        }
      }
    ];

    this.exploreSubNodes(node, process);
  };

  Fermata.Render.prototype.renderAttributesTimeBeats = function (node, attribut)
  {
    attribut.beat.beats = node;
  };

  Fermata.Render.prototype.renderAttributesTimeTypes = function (node, attribut)
  {
    attribut.beat.type = node;
  };

  Fermata.Render.prototype.AttributesStave = function (stave, attribut)
  {
    attribut.stave = stave;
  };

  Fermata.Render.prototype.AttributesKeys = function (node, attribut)
  {
    var _this = this,
        process;

    if (typeof(node.fifths) !== "undefined")
    {
      process = [
        {
          key: "cancel",
          type: Fermata.Render.prototype.FuncTypes.$01,
          func: null // TODO
        },
        {
          key: "fifths",
          type: Fermata.Render.prototype.FuncTypes.$1,
          func: function (arg) {
            _this.AttributeKeyFifth(arg, attribut);
          }
        },
        {
          key: "mode",
          type: Fermata.Render.prototype.FuncTypes.$01,
          func: function (arg) {
            _this.AttributeKeyMode(arg, attribut);
          }
        }
      ];
      this.exploreSubNodes(node, process);
    }
    else
    {
      // TODO manage fact that this key can appaears many times
      process = [
        {
          key: "key-step",
          type: Fermata.Render.prototype.FuncTypes.$1,
          func: null // TODO
        },
        {
          key: "key-alter",
          type: Fermata.Render.prototype.FuncTypes.$1,
          func: null // TODO
        },
        {
          key: "key-accidental",
          type: Fermata.Render.prototype.FuncTypes.$01,
          func: null // TODO
        }
      ];
      this.exploreSubNodes(node, process);
    }
    
    process = [
      {
        key: "key-octave",
        type: Fermata.Render.prototype.FuncTypes.$0n,
        func: null
      }
    ];
    
    this.exploreSubNodes(node, process);
  };

  Fermata.Render.prototype.AttributeKeyMode = function (node, attribut)
  {
    //if (node !== 'major' || node !== 'minor')
      //throw ("Bad mode settings !!");
    attribut.keys.mode = node;
  };

  Fermata.Render.prototype.Attributedivision = function (node, attribut)
  {
    attribut.division = node;
  };

  Fermata.Render.prototype.AttributeInstrument = function (node, attribut)
  {
    attribut.instrument = node;
  };

  Fermata.Render.prototype.AttributeKeyFifth = function (node, attribut)
  {
    attribut.keys.fifths = node;
  };


  var _render = Fermata.Render.prototype;
  Fermata.Render.prototype.renderAttributesProcess = [
    { key: 'divisions', type: _render.FuncTypes.$01, func: _render.Attributedivision },
    { key: 'key', type: _render.FuncTypes.$0n, func: _render.AttributesKeys },
    { key: 'time', type: _render.FuncTypes.$0n, func: _render.AttributesTime },
    { key: 'staves', type: _render.FuncTypes.$01, func: _render.AttributesStave },
    { key: 'part-symbol', type: _render.FuncTypes.$01, func: _render.AttributesSymbol },
    { key: 'instruments', type: _render.FuncTypes.$01, func: _render.AttributeInstrument },
    { key: 'clef', type: _render.FuncTypes.$0n, func: _render.AttributesClef },
    { key: 'staff-details', type: _render.FuncTypes.$0n, func: null },
    { key: 'transpose', type: _render.FuncTypes.$0n, func: null },
    { key: 'directive', type: _render.FuncTypes.$0n, func: null },
    { key: 'dirmeasure-styleective', type: _render.FuncTypes.$0n, func: null }
  ];

  Fermata.Render.prototype.renderAttributes = function (attributes)
  {
    this.cur.measure.$fermata.attributes = Fermata.Utils.Clone(Fermata.Render.prototype.renderAttributesDefault);
    this.exploreSubNodes(attributes, Fermata.Render.prototype.renderAttributesProcess,
                         this, this.cur.measure.$fermata.attributes);
  };

}).call(this);
