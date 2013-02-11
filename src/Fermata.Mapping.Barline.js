(function () {
  "use strict";

	Fermata.Mapping = Fermata.Mapping || {};
  Fermata.Mapping.Barline = {};

//   Vex.Flow.Barline.type = {
//   SINGLE: 1,
//   DOUBLE: 2,
//   END: 3,
//   REPEAT_BEGIN: 4,
//   REPEAT_END: 5,
//   REPEAT_BOTH: 6,
//   NONE: 7
// };

	Fermata.Mapping.Barline.MusicXmlToVexflow = {
		'light-heavy' : 2
	};

	Fermata.Mapping.Barline.getVexflow = function (musicXML)
	{
		return Fermata.Mapping.Barline.MusicXmlToVexflow[musicXML];
	};

}).call(this);