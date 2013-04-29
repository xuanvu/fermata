/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


(function () {
  "use strict";

  Fermata.Render.TupletProcessor = function ()
  {
    
  };

  // includes
  var TupletProcessor = Fermata.Render.TupletProcessor;
  
  TupletProcessor.hasTuplet = function (note)
  {
    if (typeof note.notations === "undefined")
    {
      return false;
    }
    else if (note.notations instanceof [].constructor)
    {
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
      return typeof note.notations.tuplet !== "undefined";
    }
  };
  
  TupletProcessor.hasTimeModification = function (note) {
    return typeof note["time-modification"] !== "undefined";
  };
}).call(this);
