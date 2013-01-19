/* This file has all the functions related to the global
Organisation of the score (multi-part based, or not, on many staff, etc...)
It gonna fill a structure of data, used by the render-score
*/

var Fermata = Fermata || {};

(function () {
  "use strict";

   Fermata.Render.prototype.RenderPartName = function (partName)
  {
    if (typeof(partName.content) === 'undefined' && typeof(partName) === 'string') {
      this.scorePartData.partName = partName;
    }
    else if (typeof(partName.content) === 'string') {
      this.scorePartData.partName = partName.content;
    }
    else
      return ;
  };

  Fermata.Render.prototype.renderBarline = function (barline) {
    if (barline === "yes")
      this.GroupPartData.barline = true;
    this.GroupPartData.barline = false;
  };

  Fermata.Render.prototype.renderSymbolGroup = function (groupSymbol) {
    if (typeof(groupSymbol.content) === 'undefined' && typeof(groupSymbol) === "string")
      this.GroupPartData.groupSymbol = groupSymbol;
    else if (typeof(groupSymbol.content) === "string") {
      this.GroupPartData.groupSymbol = groupSymbol.content;
    }
    else
      return ;
  };

  Fermata.Render.prototype.isPartGroupExist = function (number) {
    for (var i = 0; i < this.PartListData.length; i++) {
      if (this.PartListData[i].partGroup.number === number)
        return i;
    }
    return -1;
  };

  Fermata.Render.prototype.renderScorePartNumber = function (partGroup)
  {
    this.scorePartData.partGroup.number = partGroup;
  };

  Fermata.Render.prototype.renderScorePart = function (part) {
    if (typeof(part["$id"]) === 'undefined')
        throw ("scorePart without any ID, check file !");
    this.scorePartData.id = part["$id"];
    this.exploreSubNodes(part, this.renderScorePartProcess, this);
    this.PartListData[this.PartListData.length] = Fermata.Utils.clone(this.scorePartData);
    for (var prop in this.scorePartData) {

      if (this.scorePartData.hasOwnProperty(prop) && typeof(this.scorePartData[prop]) !== 'object' ) { 
        this.scorePartData[prop] = null; } }
  };

   Fermata.Render.prototype.renderpartGroup = function (group) {
    if (group.type === "start" && (val = this.isPartGroupExist(group)) > 0) {
      this.exploreSubNodes(part, this.renderPartGroupProcess, this);
      this.scorePartData[val].partGroup.bairline = this.GroupPartData.barline;
      this.scorePartData[val].partGroup.symbol = this.GroupPartData.symbol;
      for (prop in this.GroupPartData) { 
        if (this.GroupPartData.hasOwnProperty(prop) && typeof(this.GroupPartData[prop]) !== 'object' ) { 
          this.GroupPartData[prop] = null; } }
    }
  };

  Fermata.Render.prototype.renderScoreInstrument = function (instrument)
  {
    this.scorePartData.scoreInstrument = instrument;
  };

  Fermata.Render.prototype.RenderMidiInstrument = function (midi)
  {
    this.scorePartData.midiInstrument = midi;
  };

  Fermata.Render.prototype.renderScorePartAbbreviation = function (abbre) {
    this.scorePartData.abbreviation = abbre;
  };

	Fermata.Render.prototype.renderPartListProcess = [
		{
			key: "score-part",
      type: Fermata.Render.prototype.FuncTypes.PLUS,
      func: Fermata.Render.prototype.renderScorePart
		},
    {
      key: "part-group",
      type: Fermata.Render.prototype.FuncTypes.STAR,
      func: Fermata.Render.prototype.renderpartGroup
    }
	];

	Fermata.Render.prototype.renderScorePartProcess = [
		{
			key: "identification",
			type: Fermata.Render.prototype.FuncTypes.QUESTION,
			func: null // todo
		},
		{
			key: "part-name",
			type: Fermata.Render.prototype.FuncTypes.DEFAULT,
			func: Fermata.Render.prototype.RenderPartName
		},
		{
			key: "part-name-display",
			type: Fermata.Render.prototype.FuncTypes.QUESTION,
			func: null //todo
		},
		{
			key: "part-abbreviation",
			type: Fermata.Render.prototype.FuncTypes.QUESTION,
			func: Fermata.Render.prototype.renderScorePartAbbreviation
		},
		{
			key: "part-abbreviation-display",
			type: Fermata.Render.prototype.FuncTypes.QUESTION,
			func: null // todo
		},
		{
			key: "group",
			type: Fermata.Render.prototype.FuncTypes.STAR,
			func: null //todo
		},
		{
			key: "score-instrument",
			type: Fermata.Render.prototype.FuncTypes.STAR,
			func: Fermata.Render.prototype.renderScoreInstrument
		},
		{
			key: "part-group",
			type: Fermata.Render.prototype.FuncTypes.STAR,
			func: Fermata.Render.prototype.renderScorePartNumber
		}
	];

	Fermata.Render.prototype.RenderPartGroupProcess = [
		{
			key: "group-name",
			type: Fermata.Render.prototype.FuncTypes.QUESTION,
			func : null // todo
		},
		{
			key: "group-name-display",
			type: Fermata.Render.prototype.FuncTypes.QUESTION,
			func: null
		},
		{
			key: "group-abbreviation",
			type: Fermata.Render.prototype.FuncTypes.QUESTION,
			func: null //TODO
		},
		{
			key: "group-abbreviation-display",
			type: Fermata.Render.prototype.FuncTypes.QUESTION,
			func: null // TODO
		},
		{
			key: "group-symbol",
			type: Fermata.Render.prototype.FuncTypes.QUESTION,
			func: Fermata.Render.prototype.renderSymbolGroup
		},
		{
			key: "group-barline",
			type: Fermata.Render.prototype.FuncTypes.QUESTION,
			func: Fermata.Render.prototype.renderBarline
		},
		{
			key: "group-time",
			type: Fermata.Render.prototype.FuncTypes.QUESTION,
			func: null
		}
	];

  Fermata.Render.prototype.renderPartList = function (list) {
  	this.exploreSubNodes(list, this.renderPartListProcess, this);
  };

  Fermata.Render.prototype.GroupPartData = {
  	symbol: null,
  	bairline:null
  };

  Fermata.Render.prototype.scorePartData = {
  	id :null,
  	partName: null,
    abbreviation : null,
  	scoreInstrument : null,
  	midiInstrument : null,
  	partGroup: {
  		number: null,
  		symbol: null,
  		bairline: null
  	}
  };

  Fermata.Render.prototype.PartListData = [];

}).call(this);