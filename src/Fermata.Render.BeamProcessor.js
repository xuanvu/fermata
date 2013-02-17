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

  BeamProcessor.getBeamNumber = function (beam)
  {
    return beam.number;
  };
  
  BeamProcessor.getBeamType = function (beam)
  {
    var values = [BeamType.BEGIN, BeamType.CONTINUE, BeamType.END];
    
    for (var i = 0 ; i < values.length ; ++i)
    {
      if (values[i] === beam.content)
      {
        return values[i];
      }
    }
    
    throw new Error("the beam type " + beam.content + " in not recognized");
  };
  
}).call(this);
