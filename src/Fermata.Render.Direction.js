(function () {
  "use strict";

  var Call = Fermata.Utils.Call;

  Fermata.Render.prototype.renderDirectionDefault = {
    $placement: null,
    noteBefore: null,
    noteAfter: null,
    'direction-type': {
      wedge: { $type: null },
      words: { content: null,
               '$default-y': 0,
               '$font-size': 0,
               'font-weight': null
              }
    },
    offset: null,
    voice: 1,
    staff: 1
  };

  var _render =  Fermata.Render.prototype;

  Fermata.Render.prototype.renderDirectionTypeWedgeProcess = [
    { key: '$type', type: Call.FuncTypes.$01, dataType: 'string', dataKey: '$type' }
  ];

  //TODO gestion des polices etc...
  Fermata.Render.prototype.renderDirectionTypeWordProcess = [
    {key: 'content', type: Call.FuncTypes.$1, dataType: 'string', dataKey: 'content' }
  ];

  Fermata.Render.prototype.renderDirectionTypeWedge = function (node) {
    Call.exploreSubNodes({ object: node, processes: _render.renderDirectionTypeWedgeProcess, ctx: this,
                           out: this.cur.measure.$fermata.direction[this.cur.measure.$fermata.direction.length -1]['direction-type'].wedge });
  };

  Fermata.Render.prototype.renderDirectionTypeWord = function (node) {
    Call.exploreSubNodes({ object: node, processes: _render.renderDirectionTypeWordProcess, ctx: this,
                           out: this.cur.measure.$fermata.direction[this.cur.measure.$fermata.direction.length -1]['direction-type'].words });
  };

  Fermata.Render.prototype.renderDirectionTypeProcess = [
    { key: 'wedge', type: Call.FuncTypes.$01, func: _render.renderDirectionTypeWedge },
    { key: "words", type: Call.FuncTypes.$01, func: _render.renderDirectionTypeWord }
  ];

  Fermata.Render.prototype.renderDirectionType = function (node) {
    Call.exploreSubNodes({ object: node, processes: _render.renderDirectionTypeProcess, ctx: this,
                           out: this.cur.measure.$fermata.direction[this.cur.measure.$fermata.direction.length -1]['direction-type'] });
  };

  Fermata.Render.prototype.renderDirectionProcess = [
    { key: "direction-type", type: Call.FuncTypes.$1n, func: _render.renderDirectionType },
    { key: "offset", type: Call.FuncTypes.$01, dataType: 'int', dataKey: 'offset'},
    { key: "voice", type: Call.FuncTypes.$01, dataType: 'int', dataKey: 'voice' },
    { key: "staff", type: Call.FuncTypes.$01, dataType: 'int', dataKey: 'staff' },
    { key: "$placement", type: Call.FuncTypes.$1, dataType: 'string', dataKey: '$placement' },
    { key: "noteBefore", type: Call.FuncTypes.$1, dataType: 'int', dataKey: 'noteBefore'},
    { key: "noteAfter", type: Call.FuncTypes.$1, dataType: 'int', dataKey: 'noteAfter'}
   /*{
      // Came from an Entity....
      key: "footnote",
      type: Fermata.Render.prototype.FuncTypes.$01,
      func: null// TO-DO TONTON
    },
    {
      key: "level",
      type: Fermata.Render.prototype.FuncTypes.$01,
      func: null// TO-DO TONTON
    },*/
  ];

  Fermata.Render.prototype.renderDirection = function (direction)
  {
    if (this.cur.measure.$fermata.direction === undefined) {
      this.cur.measure.$fermata.direction = [];
    }
    this.cur.measure.$fermata.direction.push(Fermata.Utils.Clone(_render.renderDirectionDefault));
    Call.exploreSubNodes({ object: direction, processes: _render.renderDirectionProcess, ctx: this,
                           out: this.cur.measure.$fermata.direction[this.cur.measure.$fermata.direction.length -1] });
  };

}).call(this);

// Ne pas enlever je vais pas le Farmer 10 fois !!!!!! TODO

// {
    //   key: "rehearsal",
    //   type: Fermata.Render.prototype.FuncTypes.$1n,
    //   func: null // TODO
    // },
    // {
    //   key: "segno",
    //   type: Fermata.Render.prototype.FuncTypes.$1n,
    //   func: null // TODO
    // },
    // {
    //   key: "coda",
    //   type: Fermata.Render.prototype.FuncTypes.$1n,
    //   func: null // TODO
    // },
    // {
    //   key: "dynamics",
    //   type: Fermata.Render.prototype.FuncTypes.$1n,
    //   func: null // TODO
    // },
    // {
    //   key: "dashes",
    //   type: Fermata.Render.prototype.FuncTypes.$1,
    //   func: null // TODO
    // },
    // {
    //   key: "bracket",
    //   type: Fermata.Render.prototype.FuncTypes.$1,
    //   func: null // TODO
    // },
    // {
    //   key: "pedal",
    //   type: Fermata.Render.prototype.FuncTypes.$1,
    //   func: null // TODO
    // },
    // {
    //   key: "metronome",
    //   type: Fermata.Render.prototype.FuncTypes.$1,
    //   func: null // TODO
    // },
    // {
    //   key: "octave-shift",
    //   type: Fermata.Render.prototype.FuncTypes.$1,
    //   func: null // TODO
    // },
    // {
    //   key: "harp-pedals",
    //   type: Fermata.Render.prototype.FuncTypes.$1,
    //   func: null // TODO
    // },
    // {
    //   key: "damp",
    //   type: Fermata.Render.prototype.FuncTypes.$1,
    //   func: null // TODO
    // },
    // {
    //   key: "damp-all",
    //   type: Fermata.Render.prototype.FuncTypes.$1,
    //   func: null // TODO
    // },
    // {
    //   key: "eyeglasses",
    //   type: Fermata.Render.prototype.FuncTypes.$1,
    //   func: null // TODO
    // },
    // {
    //   key: "scordatura",
    //   type: Fermata.Render.prototype.FuncTypes.$1,
    //   func: null // TODO
    // },
    // {
    //   key: "image",
    //   type: Fermata.Render.prototype.FuncTypes.$1,
    //   func: null // TODO
    // },
    // {
    //   key: "principal-voice",
    //   type: Fermata.Render.prototype.FuncTypes.$1,
    //   func: null // TODO
    // },
    // {
    //   key: "accordion-registration",
    //   type: Fermata.Render.prototype.FuncTypes.$1,
    //   func: null // TODO
    // },
    // {
    //   key: "string-mute",
    //   type: Fermata.Render.prototype.FuncTypes.$1,
    //   func: null // TODO
    // },
    // {
    //   key: "percussion",
    //   type: Fermata.Render.prototype.FuncTypes.$1n,
    //   func: null // TODO
    // },
    // {
    //   key: "other-direction",
    //   type: Fermata.Render.prototype.FuncTypes.$1,
    //   func: null // TODO
    // }

