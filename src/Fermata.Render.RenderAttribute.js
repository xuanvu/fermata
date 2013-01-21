/*
  Files that is containing all functions to treat with measures
  attributes
  */

var Fermata = Fermata || {};

/*
    this functions takes a node of attribute using to
    describes a measure.
    it's not the same as renderMeasureAttributes using to parse
    attribute in XML declaration !!
   */

(function () {
  "use strict";

  Fermata.Render.prototype.renderAttributes = function (attributes)
  {
    // Elements entities will be implement later

    var attribut = {
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

    var _this = this;
    var process = [
      {
        key: "divisions",
        type: this.FuncTypes.QUESTION,
        func: function (arg) {
          _this.Attributedivision(arg, attribut);
        }
      },
      {
        key: "key",
        type: this.FuncTypes.STAR,
        func: function (arg) {
          _this.AttributesKeys(arg, attribut);
        }
      },
      {
        key: "time",
        type: this.FuncTypes.STAR,
        func: function (arg) {
          _this.AttributesTime(arg, attribut);
        }
      },
      {
        key: "staves",
        type: this.FuncTypes.QUESTION,
        func: function (arg) {
          _this.AttributesStave(arg, attribut);
        }
      },
      {
        key: "part-symbol",
        type: this.FuncTypes.QUESTION,
        func: function (arg) {
          _ths.AttributesSymbol(arg, attribut);
        }
      },
      {
        key: "instruments",
        type: this.FuncTypes.QUESTION,
        func: function (arg) {
          _this.AttributeInstrument(arg, attribut);
        }
      },
      {
        key: "clef",
        type: this.FuncTypes.STAR,
        func: function (arg) {
          _this.AttributesClef(arg, attribut);
        }
      },
      {
        key: "staff-details",
        type: this.FuncTypes.STAR,
        func: null // TODO
      },
      {
        key: "transpose",
        type: this.FuncTypes.STAR,
        func: null // TODO
      },
      {
        key: "directive",
        type: this.FuncTypes.STAR,
        func: null // TODO
      },
      {
        key: "measure-style",
        type: this.FuncTypes.STAR,
        func: null
      }
    ];

    this.exploreSubNodes(attributes, process);
    this.Attributesdata = Fermata.Utils.clone(attribut);
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
                      change: null
                    };

    var process = [
      {
        key: "sign",
        type: this.FuncTypes.DEFAULT,
        func: function (arg) {
          _this.AttributesClefSign(arg, clef);
        }
      },
      {
        key: "line",
        type: this.FuncTypes.QUESTION,
        func: function (arg) {
          _this.AttributesClefLine(arg, clef);
        }
      },
      {
        key: "clef-octave-change",
        type: this.FuncTypes.QUESTION,
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
        type: this.FuncTypes.DEFAULT,
        func: function (arg) {
          _this.renderAttributesTimeBeats(arg, attribut);
        }
      },
      {
        key: "beat-type",
        type: this.FuncTypes.DEFAULT,
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
          type: this.FuncTypes.QUESTION,
          func: null // TODO
        },
        {
          key: "fifths",
          type: this.FuncTypes.DEFAULT,
          func: function (arg) {
            _this.AttributeKeyFifth(arg, attribut);
          }
        },
        {
          key: "mode",
          type: this.FuncTypes.QUESTION,
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
          type: this.FuncTypes.DEFAULT,
          func: null // TODO
        },
        {
          key: "key-alter",
          type: this.FuncTypes.DEFAULT,
          func: null // TODO
        },
        {
          key: "key-accidental",
          type: this.FuncTypes.QUESTION,
          func: null // TODO
        }
      ];
      this.exploreSubNodes(node, process);
    }
    
    process = [
      {
        key: "key-octave",
        type: this.FuncTypes.STAR,
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

  Fermata.Render.prototype.Attributesdata = {};

}).call(this);