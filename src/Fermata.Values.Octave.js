(function () {
  "use strict";

  Fermata.Values.Octave = {};
  var Octave = Fermata.Values.Octave;

  Octave.values = [];
  Octave.MIN = 0;
  Octave.MAX = 9;
  Octave.check = function (octave) {
    return (isInteger(octave) &&
            Octave.MIN <= octave && octave <= Octave.MAX);
  };

  var isInteger = function (value) {
    return parseFloat(value) === parseInt(value, 10) && !isNaN(value);
  };

  var fillValues = function () {
    for (var i = Octave.MIN; i <= Octave.MAX; i++) {
      Octave.values.push(i);
    }
  };

  fillValues();
}).call(this);
