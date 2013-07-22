(function () {
  "use strict";

  Fermata.Utils = {};

  var Utils = Fermata.Utils;

  Utils.isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  Utils.Clone = function (obj) {
    var newObj = (Utils.isArray(obj)) ? [] : {};
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        if (obj[i] && typeof obj[i] === "object") {
          newObj[i] = Fermata.Utils.Clone(obj[i]);
        }
        else {
          newObj[i] = obj[i];
        }
      }
    }
    return newObj;
  };

  Utils.CloneEpure$fermata = function (obj) {
    var newObj = (Utils.isArray(obj)) ? [] : {};
    for (var i in obj) {
      if (obj.hasOwnProperty(i) &&
              i !== "$fermata") {
        if (obj[i] && typeof obj[i] === "object") {
          newObj[i] = Fermata.Utils.CloneEpure$fermata(obj[i]);
        }
        else {
          newObj[i] = obj[i];
        }
      }
    }
    return newObj;
  };

  // Delete ?
  Utils.FirstLast = function (obj)
  {
    return ({first: 0, last: obj.length - 1});
  };

  Utils.minusToCamelCase = function (str) {
    return str.replace(/-([a-z])/g, camelCaseHandler);
  };

  var camelCaseHandler = function (c) {
    return c[1].toUpperCase();
  };

  Utils.lineToPitch = function (line, clef) {
    var valueCorrection = calcValueCorrection(clef);
    line = parseInt(line, 10);
    line += valueCorrection;
    var p_octave = 3.5;
    var n_octave = -p_octave;
    var step = "L";
    if (line < 0) {
      step = getStep(line % n_octave);
    }
    else {
      step = getStep(line % p_octave);
    }
    var octave = 4 + Math.floor(line / p_octave);
    return {'octave': octave, 'step': step};
  };

  var calcValueCorrection = function (clef) {
    var refGLine = 2;
    var refGStepFromOrigin = refGLine * 2;

    var signShift = distanceFromG[clef.sign];
    var clefStepFromOrigin = clef.line * 2;
    var actualGStepFromOrigin = clefStepFromOrigin + signShift;
    var stepCorrection = refGStepFromOrigin - actualGStepFromOrigin;
    var valueCorrection = stepCorrection / 2;

    return valueCorrection;
  };

  var distanceFromG = {
    "G": 0,
    "C": Step.idx.G - Step.idx.C,
    "F": Step.idx.G - Step.idx.F + Step.values.length
  };

  var getStep = function (val) {
    if (val === 0) {
      return "C";
    }
    if (val === 0.5 || val === -3) {
      return "D";
    }
    if (val === 1 || val === -2.5) {
      return "E";
    }
    if (val === 1.5 || val === -2) {
      return "F";
    }
    if (val === 2 || val === -1.5) {
      return "G";
    }
    if (val === 2.5 || val === -1) {
      return "A";
    }
    if (val === 3 || val === -0.5) {
      return "B";
    }
  };

}).call(this);
