var Fermata = Fermata || {};

(function () {
  "use strict";

  Fermata.Render = function (data, container) {
    this.data = data;
    this.container = container;
    this.staves = [];
    this.noteData = [];
    //NOTE: should be don by IOC
    this.tieRenderer = new Fermata.Render.TieRenderer();
    this.noteStorage = new Fermata.Render.NoteStorage();

    // Client-side
    if (container !== null) {
      this.renderer = new Vex.Flow.Renderer(this.container, Vex.Flow.Renderer.Backends.CANVAS);
    }
    // Server-side // TODO
    else {
      this.renderer = new Vex.Flow.Renderer(this.container, Vex.Flow.Renderer.Backends.SVG);
    }

    this.ctx = this.renderer.getContext();

  //data.sortMeasure();
  //console.log(data.getMesure(1, 'P1'));
  };
}).call(this);
