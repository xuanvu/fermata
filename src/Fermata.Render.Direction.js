var Fermata = Fermata || {};

(function () {
  "use strict";

  Fermata.Render.prototype.renderDirection = function (direction)
  {
    this.exploreSubNodes(direction, this.renderDirectionProcess, this);
    if (this.renderDirectionData.type !== null) {
      this.renderDirectionData.noteBefore = direction.noteBefore;
      this.renderDirectionData.noteAfter = direction.noteAfter; 
    }
  };

  Fermata.Render.prototype.renderDirectionType = function (node) {
    if (node.wedge !== undefined && node.wedge.type !== "stop")
      this.renderDirectionData.type = node.wedge.type;
  };

  Fermata.Render.prototype.renderDirectionOffset = function (node) {
    this.renderDirectionData.offset = node;
  };

  Fermata.Render.prototype.renderDirectionAttribute = function (node) {
    // if (node.placement !== undefined && node.placement)
  };

  Fermata.Render.prototype.renderDirectionData = {
    placement: null,
    noteBefore: null,
    noteAfter: null,
    type: null,
    offset: null,
    voice: 1
  };

  Fermata.Render.prototype.renderDirectionProcess = [
    { 
      key: "direction-type",
      type: Fermata.Render.prototype.FuncTypes.PLUS,
      func: Fermata.Render.prototype.renderDirectionType
    },
    {
      key: "offset",
      type: Fermata.Render.prototype.FuncTypes.QUESTION,
      func: Fermata.Render.prototype.renderDirectionOffset
    }
    /*{
      // Came from an Entity....
      key: "footnote",
      type: Fermata.Render.prototype.FuncTypes.QUESTION,
      func: null// TO-DO TONTON
    },
    {
      key: "level",
      type: Fermata.Render.prototype.FuncTypes.QUESTION,
      func: null// TO-DO TONTON
    },
    {
      key: "voice",
      type: Fermata.Render.prototype.FuncTypes.QUESTION,
      func: null//TO-DO TONTON
    },
      // End of Entity
    {
      key: "staff",
      type: Fermata.Render.prototype.FuncTypes.QUESTION,
      func: null// TODO
    },
    {
      key: "offset",
      type: Fermata.Render.prototype.FuncTypes.QUESTION,
      func: null
    }*/
  ];

}).call(this);