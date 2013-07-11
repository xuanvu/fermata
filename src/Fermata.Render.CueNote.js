(function () {
  "use strict";

  var Call = Fermata.Utils.Call;

  Fermata.Render.prototype.renderCueNote = function (cueNote)
  {
    var obj = this;
    var processes = [
      {
        key: "cue",
        type: Call.FuncTypes.$1,
        func: null//TODO: implement the function
      }
    ];
    Call.exploreSubNodes({ object: cueNote, processes: processes, ctx: this });

    this.renderFullNote(cueNote);
    var duration = cueNote.duration;
  };

}).call(this);
