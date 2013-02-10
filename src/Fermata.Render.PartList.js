/* This file has all the functions related to the global
Organisation of the score (multi-part based, or not, on many staff, etc...)
It gonna fill a structure of data, used by the render-score
*/

(function () {
  "use strict";

  // Fermata.Render.prototype.getNbStave = function ()
  // {
  //   var nb = 0;
  //   for (var i in this.staves) {
  //     nb++;
  //   }
  //   return nb;
  // };

  Fermata.Render.prototype.isPartGroupExist = function (number) {
    for (var i = 0; i < this.PartListData.length; i++) {
      if (this.PartListData[i].partGroup.number === number) {
        return i;
      }
    }
    return -1;
  };

  Fermata.Render.prototype.renderScorePart = function (part) {
    // this.scorePartData.id = part.$id;
    this.exploreSubNodes({ object: part, processes: this.renderScorePartProcess, ctx: this });

    // this.PartListData[this.PartListData.length] = Fermata.Utils.Clone(this.scorePartData);
    // for (var prop in this.scorePartData) {
    //   if (this.scorePartData.hasOwnProperty(prop) && typeof(this.scorePartData[prop]) !== 'object') {
    //     this.scorePartData[prop] = null;
    //   }
    // }
  };

  Fermata.Render.prototype.renderPartGroup = function (group) {
    var val;
    if (group.type === 'start' && (val = this.isPartGroupExist(group)) > 0) {
      this.exploreSubNodes({ object: group, processes: this.renderPartGroupProcess, ctx: this });
      // this.scorePartData[val].partGroup.bairline = this.GroupPartData.barline;
      // this.scorePartData[val].partGroup.symbol = this.GroupPartData.symbol;
      // for (var prop in this.GroupPartData) {
      //   if (this.GroupPartData.hasOwnProperty(prop) && typeof(this.GroupPartData[prop]) !== 'object') {
      //     this.GroupPartData[prop] = null;
      //   }
      // }
    }
  };

  var _render = Fermata.Render.prototype;
  Fermata.Render.prototype.renderPartListProcess = [
    { key: "score-part", type: Fermata.Render.prototype.FuncTypes.$1n, func: Fermata.Render.prototype.renderScorePart },
    { key: "part-group", type: Fermata.Render.prototype.FuncTypes.$0n, func: Fermata.Render.prototype.renderPartGroup }
  ];

  Fermata.Render.prototype.renderScorePartProcess = [
    { key: "identification", type: Fermata.Render.prototype.FuncTypes.$01, func: null },
    { key: "part-name", type: Fermata.Render.prototype.FuncTypes.$1, dataType: 'string' },
    { key: "part-name-display", type: Fermata.Render.prototype.FuncTypes.$01, func: null },
    { key: "part-abbreviation", type: Fermata.Render.prototype.FuncTypes.$01, dataType: 'string' },
    { key: "part-abbreviation-display", type: Fermata.Render.prototype.FuncTypes.$01, func: null },
    { key: "group", type: Fermata.Render.prototype.FuncTypes.$0n, func: null },
    { key: "score-instrument", type: Fermata.Render.prototype.FuncTypes.$0n, dataType: 'string' },
    { key: "part-group", type: Fermata.Render.prototype.FuncTypes.$0n, dataType: 'string' }
  ];

  Fermata.Render.prototype.RenderPartGroupProcess = [
    { key: "group-name", type: Fermata.Render.prototype.FuncTypes.$01, func: null },
    { key: "group-name-display", type: Fermata.Render.prototype.FuncTypes.$01, func: null },
    { key: "group-abbreviation", type: Fermata.Render.prototype.FuncTypes.$01, func: null },
    { key: "group-abbreviation-display", type: Fermata.Render.prototype.FuncTypes.$01, func: null },
    { key: "group-symbol", type: Fermata.Render.prototype.FuncTypes.$01, dataType: 'string' },
    { key: "group-barline", type: Fermata.Render.prototype.FuncTypes.$01, dataType: 'bool' },
    { key: "group-time", type: Fermata.Render.prototype.FuncTypes.$01, func: null }
  ];

  Fermata.Render.prototype.renderPartList = function (list) {
    this.exploreSubNodes({ object: list, processes: this.renderPartListProcess, ctx: this });
  };

  Fermata.Render.prototype.GroupPartData = {
    symbol: null,
    bairline: null
  };

  Fermata.Render.prototype.scorePartData = {
    id: null,
    partName: null,
    abbreviation: null,
    scoreInstrument: null,
    midiInstrument: null,
    partGroup: {
      number: null,
      symbol: null,
      bairline: null
    }
  };

  Fermata.Render.prototype.PartListData = [];

}).call(this);
