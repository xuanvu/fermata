(function () {
  "use strict";

  Fermata.Mapping = Fermata.Mapping || {};
  Fermata.Mapping.Connector = {};

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
