(function () {
  "use strict";

  Fermata.Render.prototype.renderBarlineDefault = {
  	location :'right',
  	barStyle : null
  };

  var _render = Fermata.Render.prototype;

  Fermata.Render.prototype.barlineProcess = [
  		{ key: '$location', type: _render.FuncTypes.$01, dataType: 'string', dataKey: 'location'},
  		{ key: 'bar-style', type: _render.FuncTypes.$01, dataType: 'string' }
  	];

  Fermata.Render.prototype.renderBarline = function (score)
  {
    this.cur.measure.$fermata.barline = Fermata.Utils.Clone(Fermata.Render.prototype.renderBarlineDefault);

  	this.exploreSubNodes({object: score, processes: _render.barlineProcess, ctx: this, out: this.cur.measure.$fermata.barline});
  };

}).call(this);
