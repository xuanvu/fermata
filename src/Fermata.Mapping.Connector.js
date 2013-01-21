var Fermata =          Fermata || {};
Fermata.Mapping =      Fermata.Mapping || {};
Fermata.Mapping.Connector = {};

(function () {
	"use strict";

	Fermata.Mapping.Connector.MusicXmlToVexflow = {
		"single" : 1,
		"double" : 2,
		"brace" : 3,
		"bracket" : 4
	};

	Fermata.Mapping.Connector.getVexflow = function (musicXML) 
	{
		return Fermata.Mapping.Connector.MusicXmlToVexflow[musicXML];
	};

}).call(this);