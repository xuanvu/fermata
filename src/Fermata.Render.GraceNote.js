(function () {
  "use strict";

  var Call = Fermata.Utils.Call;

  Fermata.Render.prototype.renderGraceNote = function (graceNote)
  {
    var _this = this;
    var processes = [
      {
        key: "grace",
        type: Call.FuncTypes.$1,
        func: function (arg) {
          _this.renderGrace(arg);
        }
      },
      {
        key: "tie",
        type: Call.FuncTypes.$0n,
        func: null//TODO implement
      }
    ];
    Call.exploreSubNodes({ object: graceNote, processes: processes, ctx: this });

    this.renderNoteCommon(graceNote);
    this.renderFullNote(graceNote);
  };

  Fermata.Render.prototype.renderGrace = function (grace)
  {
    this.renderGraceAttributes(grace);
  };

  Fermata.Render.prototype.renderGraceAttributes = function (grace)
  {
    var stealTimePrevious = 0;
    var stealTimeFollowing = 0;
    var makeTime = 0;
    var slash = false;

    if (typeof(grace["steal-time-previous"]) !== "undefined")
    {
      stealTimePrevious = grace["steal-time-previous"];
    }

    if (typeof(grace["steal-time-following"]) !== "undefined")
    {
      stealTimeFollowing = grace["steal-time-following"];
    }

    if (typeof(grace["make-time"]) !== "undefined")
    {
      makeTime = grace["make-time"];
    }

    if (typeof(grace.slash) !== "undefined")
    {
      if (grace.slash === "true")
      {
        slash = grace.slash;
      }
    //TODO: what do we do if the value is not false neither true ?
    }
  };

}).call(this);
