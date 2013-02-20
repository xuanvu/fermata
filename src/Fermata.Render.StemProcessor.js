(function () {
  "use strict";

  Fermata.Render.StemProcessor = function ()
  {
    
  };
  
  // includes
  var StemType = Fermata.Render.StemType;
  
  var StemProcessor = Fermata.Render.StemProcessor;
  
  StemProcessor.hasStem = function (note)
  {
    return typeof(note.stem) !== "undefined";
  };
  
  StemProcessor.getStemType = function (stem)
  {
    var values = [StemType.DOWN, StemType.UP, StemType.NONE, StemType.DOUBLE];
    
    for (var i = 0 ; i < values.length ; ++i)
    {
      if (values[i] === stem.content)
      {
        return values[i];
      }
    }
    
    throw new Error("the stem type " + stem.content + " in not recognized");
  };
  
}).call(this);
