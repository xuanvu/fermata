(function () {
  "use strict";

  Fermata.Render.BeamProcessor = function ($fermata)
  {
    this.$fermata = $fermata;

    this.beamNumber = 0;
    this.beamType = "";
    this.vexNote = null;
    
    this.beamNotes = [];
  };
  
  // includes
  var BeamType = Fermata.Render.BeamType;
  
  var BeamProcessor = Fermata.Render.BeamProcessor;
  
  BeamProcessor.hasBeam = function (note)
  {
    return typeof(note.beam) != "undefined";
  };
  
  BeamProcessor.prototype.addNote = function (note, vexNote)
  {
    if (note.beam instanceof Array)
    {
      this.processBeams(note.beam, vexNote);
    }
    else
    {
      this.processBeam(note.beam, vexNote);
    }
  };
  
  BeamProcessor.prototype.processBeams = function (beams, vexNote)
  {
    for (var i = 0 ; i < beams.length ; ++i)
    {
      var beam = beams[i];
      
      this.processBeam(beam);
    }
  };
  
  BeamProcessor.prototype.processBeam = function (beam, vexNote)
  {
    
  };

  BeamProcessor.prototype.getBeamNumber = function (beam)
  {
    return beam.number;
  };
  
  BeamProcessor.prototype.getBeamType = function (beam)
  {
    for (var beamType in BeamType)
    {
      if (beam.content === BeamType[beamType])
      {
        return beamType;
      }
    }
    
    throw new Error("the beam type " + beam.content + " in not recognized");
  };
  
}).call(this);
