(function () {
  "use strict";

  Fermata.Render.BeamProcessor= function ($fermata)
  {
    this.$fermata = $fermata;
  };
  
  var BeamProcessor = Fermata.Render.BeamProcessor;
  
  BeamProcessor.hasBeam = function (note)
  {
    return typeof(note.beam) != "undefined";
  };
  
}).call(this);
