var Fermata = Fermata || {};

(function () {
  "use strict";

  Fermata.Render.prototype.renderDirection = function (direction)
  {
    this.exploreSubNodes(direction, this.renderDirectionProcess, this);
    this.renderDirectionAttribute(direction);
    if (this.renderDirectionData[this.renderDirectionData.length - 1].type !== null && this.renderDirectionData[this.renderDirectionData.length - 1].noteAfter === null)
      this.renderDirectionData[this.renderDirectionData.length - 1].noteAfter = direction.noteAfter;
    else
      this.renderDirectionData[this.renderDirectionData.length - 1].noteBefore = direction.noteBefore;
  };

  Fermata.Render.prototype.renderDirectionType = function (node) {
    if (node.wedge !== undefined && node.wedge["$type"] !== "stop") {
      var tmp = {
        placement: null,
        noteBefore: null,
        noteAfter: null,
        type: null,
        offset: null,
        voice: 1,
        staff: 1
      };
      this.renderDirectionData.push(Fermata.Utils.Clone(tmp));
      this.renderDirectionData[this.renderDirectionData.length - 1].type = node.wedge["$type"];
    }
  };

  Fermata.Render.prototype.renderDirectionOffset = function (node) {
    this.renderDirectionData.offset = node;
  };

  Fermata.Render.prototype.renderDirectionAttribute = function (node) {
     if (node["$placement"] !== 'undefined')
      this.renderDirectionData[this.renderDirectionData.length - 1].placement = node["$placement"];
  };

  Fermata.Render.prototype.renderDirectionVoice = function (node)
  {
    this.renderDirectionData[this.renderDirectionData.length - 1].voice = node;
  };

  Fermata.Render.prototype.renderDirectionStaff = function (staff)
  {
    this.renderDirectionData[this.renderDirectionData.length - 1].staff = staff ;
  };

  Fermata.Render.prototype.renderDirectionData = [];

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
    },
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
    },*/
    {
      key: "voice",
      type: Fermata.Render.prototype.FuncTypes.QUESTION,
      func: Fermata.Render.prototype.renderDirectionVoice
    },
      // End of Entity
    {
      key: "staff",
      type: Fermata.Render.prototype.FuncTypes.QUESTION,
      func: Fermata.Render.prototype.renderDirectionStaff
    }
    /*{
      key: "offset",
      type: Fermata.Render.prototype.FuncTypes.QUESTION,
      func: null
    }*/
  ];

}).call(this);