(function () {
  "use strict";
  
  var Call = Fermata.Utils.Call;

  Fermata.Render.prototype.renderBarlineDefault = {
    location : 'right',
    barStyle : null,
    repeat : {
      direction : null,
      time : 1,
      winged : 'none'
    }
  };

  var _render = Fermata.Render.prototype;

  Fermata.Render.prototype.renderBarlineRepeat = function (repeat)
  {
    this.exploreSubNodes({object: repeat, processes: _render.renderBarlineRepeatProcess, ctx: this, out: this.cur.measure.$fermata.barline[this.cur.measure.$fermata.barline.length - 1].repeat});
  };


  Fermata.Render.prototype.barlineProcess = [
      { key: '$location', type: Call.FuncTypes.$01, dataType: 'string', dataKey: 'location'},
      { key: 'bar-style', type: Call.FuncTypes.$01, dataType: 'string'},
      { key: 'repeat', type: Call.FuncTypes.$01, func: _render.renderBarlineRepeat}
    ];

  Fermata.Render.prototype.renderBarlineRepeatProcess = [
      {key: '$direction', type: Call.FuncTypes.$1, dataType: 'string', dataKey: 'direction'},
      {key: 'time', type: Call.FuncTypes.$01, dataType: 'int'},
      {key: 'winged', type: Call.FuncTypes.$01, dataType: 'string'}
    ];

  Fermata.Render.prototype.renderBarline = function (score)
  {
    if (this.cur.measure.$fermata.barline === undefined) {
      this.cur.measure.$fermata.barline = [];
    }
    this.cur.measure.$fermata.barline.push(Fermata.Utils.Clone(_render.renderBarlineDefault));
    this.exploreSubNodes({object: score, processes: _render.barlineProcess, ctx: this, out: this.cur.measure.$fermata.barline[this.cur.measure.$fermata.barline.length - 1]});
  };

}).call(this);
