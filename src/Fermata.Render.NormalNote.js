(function () {
  "use strict";
  
  Fermata.Render.prototype.renderNormalNote = function (normalNote)
  {
    this.renderFullNote(normalNote);
    var duration = normalNote.duration;
    this.renderNoteCommon(normalNote);
  };
  
}).call(this);
