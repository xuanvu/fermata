(function () {
  "use strict";

  Fermata.Render.StemProcessor = function ()
  {
    
  };
  
  // includes
  var StemType = Fermata.Render.StemType;
  
  var StemProcessor = Fermata.Render.StemProcessor;
  
  StemProcessor.prototype.processNote = function (note, vexArg)
  {
    var stemType = StemProcessor.getStemType(note.stem);
    var vexStemValue = this.convertStemType(stemType);
    this.recordValue(vexStemValue, vexArg);
  };
  
  StemProcessor.prototype.convertStemType = function (stemType)
  {
    if (stemType === StemType.UP)
    {
      return 1;
    }
    else if (stemType === StemType.DOWN)
    {
      return -1;
    }
  };
  
  StemProcessor.prototype.recordValue = function (vexStemValue, vexArg)
  {
    vexArg.stem_direction = vexStemValue;
  };
  
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
