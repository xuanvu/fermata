/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


(function () {
  "use strict";

  Fermata.Render.TupletProcessor = function ($fermata)
  {
    this.currentVexNote = null;
    this.vexNotes = [];
    this.$fermata = $fermata;
  };

  // includes
  var TupletType = Fermata.Render.TupletType;
  var TupletProcessor = Fermata.Render.TupletProcessor;

  TupletProcessor.hasTuplet = function (note)
  {
    console.log("note: " + note);
    console.log("notations: " + (typeof note.notations === "undefined"));

    if (typeof note.notations === "undefined")
    {
      return false;
    }
    else if (TupletProcessor.isArray(note.notations))
    {
      console.log("ARRAY !!!");
      for (var i = 0 ; i < note.notations.length ; i++)
      {
        var notation = note.notations[i];
        if (typeof notation.tuplet !== "undefined")
        {
          return true;
        }
      }
      return false;
    }
    else
    {
      console.log("isArray: " + (note.notations instanceof Array));
      console.log("note.notations  type: " + (Object.prototype.toString.call(note.notations)));
      console.log("noArray. tuplet: " + (typeof note.notations.tuplet !== "undefined"));
      console.log("dafuck: " + ([] instanceof Array));
      return typeof note.notations.tuplet !== "undefined";
    }
  };

  TupletProcessor.hasTimeModification = function (note) {
    return typeof note["time-modification"] !== "undefined";
  };

  TupletProcessor.getTuplet = function (note) {
    if (TupletProcessor.isArray(note.notations))
    {
      for (var i = 0 ; i < note.notations.length ; i++)
      {
        var notation = note.notations[i];

        if (typeof notation.tuplet !== "undefined")
        {
          return notation.tuplet;
        }
      }
    }
    else
    {
      return note.notations.tuplet;
    }
  };

  TupletProcessor.getTimeModification = function (note) {
    return note["time-modification"];
  };

  TupletProcessor.isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  TupletProcessor.prototype.canProcess = function (note) {
    return TupletProcessor.hasTuplet(note) ||
    (TupletProcessor.hasTimeModification(note) &&
      this.hasRunningTuplet());
  };

  TupletProcessor.prototype.addNote = function (note, vexNote) {
    this.currentVexNote = vexNote;

    var tupletType = this.getTupletType(note);
    if (tupletType === TupletType.START) {
      this.startTuplet();
    } else if (tupletType === TupletType.CONTINUE) {
      this.continueTuplet();
    } else if (tupletType === TupletType.STOP) {
      this.stopTuplet();
    }
  };

  TupletProcessor.prototype.getTupletType = function (note) {
    if (TupletProcessor.hasTuplet(note))
    {
      var tuplet = TupletProcessor.getTuplet(note);
      if (tuplet.$type === TupletType.START) {
        return TupletType.START;
      } else if (tuplet.$type === TupletType.STOP) {
        return TupletType.STOP;
      }
    }
    else if (TupletProcessor.hasTimeModification(note) &&
      this.hasRunningTuplet())
      {
      return TupletType.CONTINUE;
    }
  };

  TupletProcessor.prototype.hasRunningTuplet = function () {
    return this.vexNotes.length > 0;
  };

  TupletProcessor.prototype.startTuplet = function ()
  {
    this.vexNotes.push(this.currentVexNote);
  };

  TupletProcessor.prototype.continueTuplet = function ()
  {
    this.vexNotes.push(this.currentVexNote);
  };

  TupletProcessor.prototype.stopTuplet = function ()
  {
    this.vexNotes.push(this.currentVexNote);
    var vexTuplet = new Vex.Flow.Tuplet(this.vexNotes, {
      beats_occupied: this.vexNotes.length / 3 * 2
      });
    this.$fermata.vexTuplets.push(vexTuplet);

    this.vexNotes = [];
  };

}).call(this);
