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
		'normal' : {'light-heavy' : 2},
		'forward' : {'heavy-light' : 4, 'light-heavy': 4},
		'backward' : {'heavy-light' : 5, 'light-heavy': 5},
		'both' : {'heavy-light' : 5, 'light-heavy': 5}
	};

	Fermata.Mapping.Barline.getVexflow = function (type, style)
	{
		console.log(type)
		console.log(style)
		console.log(Fermata.Mapping.Barline.MusicXmlToVexflow[type][style]);
		return Fermata.Mapping.Barline.MusicXmlToVexflow[type][style];
	};

}).call(this);