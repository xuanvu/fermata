var Fermata = Fermata || {};

(function(){
  "use strict";
  
  Fermata.Render.TieRenderer = function ()
  {
    this.init();
  };
  
  var TieRenderer = Fermata.Render.TieRenderer;
  
  TieRenderer.prototype.init = function ()
  {
    this.previousTieNotes = [];
    this.vexNote = null;
    this.voice = null;
  };
  
  TieRenderer.prototype.render = function (note, vexNote, voice)
  {
    this.storeParams(note, vexNote, voice);
    
    if (this.isNoteTieStop(note))
    {
      this.drawTie();
    }
    if (this.isNoteTieStart(note))
    {
      this.saveTieNote();
    }
  };
  
  TieRenderer.prototype.storeParams = function (vexNote, voice)
  {
    this.vexNote = vexNote;
    this.voice = voice;
  };

  TieRenderer.prototype.isNoteTieStart = function (note)
  {
    if (this.isNoteTie(note))
    {
      if (note.tie instanceof Array)
      {
        return true;
      }
      else
      {
        return note.tie.type === "start";
      }
    }
    else
    {
      return false;
    }
  };
  
  TieRenderer.prototype.isNoteTieStop = function (note)
  {
    if (this.isNoteTie(note))
    {
      if (note.tie instanceof Array)
      {
        return true;
      }
      else
      {
        return note.tie.type === "stop";
      }
    }
    else
    {
      return false;
    }
  };

  TieRenderer.prototype.isNoteTie = function (note)
  {
    return typeof(note.tie) !== "undefined";
  };

  TieRenderer.prototype.drawTie = function ()
  {
      var previousVexNote = this.tieNoteStack[this.voice];
      var tie = new Vex.Flow.StaveTie({
        first_note: previousVexNote,
        last_note: this.vexNote,
        first_indices: [0],
        last_indices: [0]
      });
  
      tie.setContext(this.ctx);
      //TODO: store the tie
      tie.draw();    
  };

  TieRenderer.prototype.saveTieNote = function ()
  {
    this.tieNoteStack[this.voice] = this.vexNote;
  };

}).call(this);
