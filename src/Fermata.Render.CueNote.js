/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var Fermata = Fermata || {};

(function () {
  "use strict";
  
  Fermata.Render.prototype.renderCueNote = function (cueNote)
  {
    var obj = this;
    var processes = [
      {
        key: "cue",
        type: this.FuncTypes.DEFAULT,
        func: null//TODO: implement the function
      }
    ];
    this.exploreSubNodes(cueNote, processes);
      
    this.renderFullNote(cueNote);
    var duration = cueNote.duration;
  };
  
}).call(this);
