(function () {
  "use strict";
  
  Fermata.Data.prototype.getNoteFromContext = function (ctx) {
    var part = this.getPart(ctx.idxPart, Fermata.Data.cacheParts.IDX);
    var note = part.measure[ctx.idxMeasure].note[ctx.idxNote];
    
    return note;
  }
  
  Fermata.Data.prototype.setPitch = function (ctx, step, alter, octave) {
      var note = this.getNoteFromContext(ctx);
  }
    
}).call(this);
