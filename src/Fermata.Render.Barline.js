(function () {
  "use strict";

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
      { key: '$location', type: _render.FuncTypes.$01, dataType: 'string', dataKey: 'location'},
      { key: 'bar-style', type: _render.FuncTypes.$01, dataType: 'string'},
      { key: 'repeat', type: _render.FuncTypes.$01, func: _render.renderBarlineRepeat}
    ];

  Fermata.Render.prototype.renderBarlineRepeatProcess = [
      {key: '$direction', type: _render.FuncTypes.$1, dataType: 'string', dataKey: 'direction'},
      {key: 'time', type: _render.FuncTypes.$01, dataType: 'int'},
      {key: 'winged', type: _render.FuncTypes.$01, dataType: 'string'}
    ];

  Fermata.Render.prototype.renderBarline = function (score)
  {
    if (this.cur.measure.$fermata.barline === undefined) {
      this.cur.measure.$fermata.barline = [];
 x   }
    this.cur.measure.$fermata.barline.push(Fermata.Utils.Clone(_render.renderBarlineDefault));
    this.exploreSubNodes({object: score, processes: _render.barlineProcess, ctx: this, out: this.cur.measure.$fermata.barline[this.cur.measure.$fermata.barline.length - 1]});
  };

}).call(this);
