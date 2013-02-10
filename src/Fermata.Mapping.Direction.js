(function () {
	"use strict";

  Fermata.Mapping = Fermata.Mapping || {};
  Fermata.Mapping.Direction = {};

	Fermata.Mapping.Direction.musicXMLToVexflow = {
    "crescendo": 1,
    "diminuendo" : 2,
    "above": 3,
    "below": 4
  };

	Fermata.Mapping.Direction.getVexflow = function (musicXml) {
    return Fermata.Mapping.Direction.musicXMLToVexflow[musicXml];
  };

}).call(this);
