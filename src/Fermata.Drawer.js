var Fermata = Fermata || {};

(function () {
  "use strict";

  Fermata.document = Vex.document;
  Fermata.Drawer = function (data, container) {
    this.data = data;
    this.parts = this.data.getParts();
    this.staves = [];
    this.container = container;

    this.renderer = new Vex.Flow.Renderer(this.container, Vex.Flow.Renderer.Backends.CANVAS);
    this.ctx = this.renderer.getContext();
  };
}).call(this);
