var Fermata = Fermata || {};

(function () {
  "use strict";

  Fermata.document = Vex.document;
  Fermata.Render = function (data, container) {
    this.data = data;
    this.container = container;
    this.staves = new Array();
    this.noteData = [];
    //NOTE: should be don by IOC
    this.tieRenderer = new Fermata.Render.TieRenderer();
    this.noteStorage = new Fermata.Render.NoteStorage();
    this.renderer = new Vex.Flow.Renderer(this.container, Vex.Flow.Renderer.Backends.CANVAS);
    this.ctx = this.renderer.getContext();
  };

  Fermata.Render.prototype.getStaves = function() {
    return this.staves;
  };
}).call(this);
