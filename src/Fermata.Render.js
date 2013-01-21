var Fermata = Fermata || {};

(function () {
  "use strict";

  Fermata.Render = function (data, container) {
    this.data = data;
    this.container = container;
    this.staves = new Array();
    this.noteData = [];
    //NOTE: should be don by IOC
    this.tieRenderer = new Fermata.Render.TieRenderer();
    this.noteStorage = new Fermata.Render.NoteStorage();

    // Client-side
    if (container !== undefined) {
      this.renderer = new Vex.Flow.Renderer(this.container, Vex.Flow.Renderer.Backends.CANVAS);
    }
    // Server-side // TODO
    else {
      var raphael = require('node-raphael');
      raphael.generate(500, 500, function(r) {

      });
      console.log(Vex.Flow.Renderer.Backends);
      this.renderer = new Vex.Flow.Renderer(r, Vex.Flow.Renderer.Backends.RAPHAEL);
    }

    this.ctx = this.renderer.getContext();

  //data.sortMeasure();
  //console.log(data.getMesure(1, 'P1'));
  };
}).call(this);
