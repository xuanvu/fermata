/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var Fermata = Fermata || {};

(function () {
  "use strict";
  
    
  Fermata.Render.prototype.renderNormalNote = function (normalNote)
  {
    this.renderFullNote(normalNote);
    var duration = normalNote.duration;
    this.renderNoteCommon(normalNote);
  };
  
}).call(this);
