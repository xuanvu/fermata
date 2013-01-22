/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var Fermata = Fermata || {};

(function () {
  "use strict";

  var SymbolSize = Fermata.Render.SymbolSize;
  var NoteConverter = Fermata.Render.NoteConverter;

  Fermata.Render.prototype.renderNoteProcess = {};
  Fermata.Render.prototype.renderNoteProcess[Fermata.Render.NoteType.NORMAL] = Fermata.Render.prototype.renderNormalNote;
  Fermata.Render.prototype.renderNoteProcess[Fermata.Render.NoteType.CUE] = Fermata.Render.prototype.renderCueNote;
  Fermata.Render.prototype.renderNoteProcess[Fermata.Render.NoteType.GRACE] = Fermata.Render.prototype.renderGraceNote;

  Fermata.Render.prototype.extractNoteVoice = function (note)
  {
    if (typeof(note[0].voice) !== "undefined")
    {
      return note[0].voice;
    }
    else
    {
      return "1";
    }
  }

  Fermata.Render.prototype.extractNoteStaff = function (note)
  {
    if (typeof(note[0].staff) !== "undefined")
    {
      return note[0].staff;
    }
    else
    {
      return "1";
    }
  };
  
  Fermata.Render.prototype.recordNote = function (vexNote, voice, staff)
  {
    if (typeof(this.noteData[staff]) === "undefined")
    {
      this.noteData[staff] = [];
    }

    if (typeof(this.noteData[staff][voice]) === 'undefined')
    { 
      this.noteData[staff][voice] = [];
    }
    var noteArray = this.noteData[staff][voice];
    noteArray.push(vexNote);
  }

  Fermata.Render.prototype.isChordNote = function (note)
  {
    return typeof(note.chord) !== "undefined";
  }

  Fermata.Render.prototype.renderNotes = function (notes)
  {
    var i = 0;
    
    while (i < notes.length)
    {
      var notesToRender = [];
      notesToRender.push(notes[i]);
      i++;
      while (i < notes.length && this.isChordNote(notes[i]))
      {
        notesToRender.push(notes[i]);
        i++;
      }
      this.renderNote(notesToRender);
    }
  }

  Fermata.Render.prototype.renderNote = function (note)
  {
    var staff = this.extractNoteStaff(note);
    var voice = this.extractNoteVoice(note);
    var noteConverter = new NoteConverter();
    
    var vexNote = noteConverter.convert(note, this.Attributesdata);
    
    this.tieRenderer.render(note, vexNote, voice);
    
    this.recordNote(vexNote, voice, staff);
    //var noteType = Fermata.Render.getNoteType(note);
   //console.log(this.renderNoteProcess[noteType].call(this, note));
  };

  
  Fermata.Render.getNoteType = function (note)
  {
    if (typeof(note.grace) !== "undefined") {
      return Fermata.Render.NoteType.GRACE;
    }
    else if (typeof(note.cue) !== "undefined") {
      return Fermata.Render.NoteType.CUE;
    }
    else {
      return Fermata.Render.NoteType.NORMAL;
    }
  };
  
  Fermata.Render.prototype.renderFullNote = function (fullNote)
  {
    var _this = this;
    var processes = [
    {
      key: "pitch",
      type: this.FuncTypes.QUESTION,
      func: function (arg) {
        _this.renderPitch(arg);
      }
    },
    {
      key: "unpitched",
      type: this.FuncTypes.QUESTION,
      func: null//TODO: implement the function
    },
    {
      key: "rest",
      type: this.FuncTypes.QUESTION,
      func: null//TODO: implement the function
    }
    ];
 
    this.exploreSubNodes(fullNote, processes);
    
    var chord = false;
    if (typeof(fullNote.chord) !== "undefined")
    {
      chord = true;
    }
  };
  
  Fermata.Render.prototype.renderNoteCommon = function (note)
  {
    var _this = this;
    var processes = [
    {
      key: "type",
      type: this.FuncTypes.QUESTION,
      func: function (arg) {
        _this.renderType(arg);
      }//TODO: add the others elements
    }
    ];
  
    this.exploreSubNodes(note, processes);
  };
  
  Fermata.Render.prototype.renderPitch = function (pitch)
  {
    var alter = 0;
    var step = pitch.step;
    var octave = pitch.octave;
    
    if (typeof(pitch.alter) !== "undefined")
    {
      alter = pitch.alter;
    }
  };
  
  Fermata.Render.prototype.renderUnpitched = function (unpitched)
  {
    var displayStep = null;
    var displayOctave = null;
    
    if (typeof(unpitched["display-step"]) !== "undefined")
    {
      displayStep = unpitched["display-step"];
    }
    if (typeof(unpitched["display-octave"]) !== "undefined")
    {
      displayOctave = unpitched["display-octave"];
    }
  };
  
  Fermata.Render.prototype.renderRest = function (rest)
  {
    var displayStep = null;
    var displayOctave = null;
    var measure = false;
    
    if (typeof(rest["display-step"]) !== "undefined")
    {
      displayStep = rest["display-step"];
    }
    if (typeof(rest["display-octave"]) !== "undefined")
    {
      displayOctave = rest["display-octave"];
    }
    if (typeof(rest.measure) !== "undefined")
    {
      if (rest.measure === "yes")
      {
        measure = true;
      }
    }
  };
  
  Fermata.Render.prototype.renderTie = function (tie)
  {
  //TODO
  };
    
  Fermata.Render.prototype.renderType = function (type)
  {
    var size = SymbolSize.FULL;
    
    if (typeof(type.size) !== "undefined")
    {
      if (type.size === SymbolSize.CUE)
      {
        size = SymbolSize.CUE;
      }
      else if (type.size === SymbolSize.LARGE)
      {
        size = SymbolSize.LARGE;
      }
    }
  };

  Fermata.Render.prototype.getNote = function (number)
  {
    var pos = 0;
    while (true) {
      for (var first in this.noteData) {
        for (var second in this.noteData[first]) {
          for (var third = 0; third < this.noteData[first][second].length ; third++) {
            if (pos === number)
              return this.noteData[first][second][third];
            pos++;
          }
        }
      }
    }
  };
  
}).call(this);
