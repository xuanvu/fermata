(function () {
  "use strict";

  Fermata.document = Vex.document;
  Fermata.Drawer = function (data, container) {
    this.data = data;
    this.parts = this.data.getParts();
    this.staves = [];
    this.container = container;

    // Client-side
    if (typeof module === 'undefined') {
      this.renderer = new Vex.Flow.Renderer(this.container, Vex.Flow.Renderer.Backends.RAPHAEL);
    }
    // Server-side
    else {
      this.renderer = new Vex.Flow.Renderer(this.container, Vex.Flow.Renderer.Backends.CANVAS);
    }
    this.ctx = this.renderer.getContext();
  };
}).call(this);
