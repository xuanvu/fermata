/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var Fermata =          Fermata || {};
Fermata.Mapping =      Fermata.Mapping || {};
Fermata.Mapping.Clef = {};

(function () {
  "use strict";

  var musicXMLToVexflow = {
    "G": "treble",
    "F": "bass",
    "C": "alto",
    "TAB": "TAB",
    "4": {"4": "C"}
  };

  var MAJOR_KEYS = [
    "C",
    "F",
    "Bb",
    "Eb",
    "Ab",
    "Db",
    "Gb",
    "Cb",
    "G",
    "D",
    "A",
    "E",
    "B",
    "F#",
    "C#"
  ];

  var MINOR_KEYS = [
    "Am",
    "Dm",
    "Gm",
    "Cm",
    "Fm",
    "Bbm",
    "Ebm",
    "Abm",
    "Em",
    "Bm",
    "F#m",
    "C#m",
    "G#m",
    "D#m",
    "A#m"
  ];

  var vexFlowToMusicXml = {};

  for (var key in this.musicXMLToVexflow) {
    if (this.musicXMLToVexflow.hasOwnProperty(key)) {
      this.vexFlowToMusicXml[musicXMLToVexflow[key]] = key;
    }
  }

  Fermata.Mapping.Clef.getVexflow = function (musicXml) {
    return musicXMLToVexflow[musicXml];
  };

  Fermata.Mapping.Clef.getMusicXml = function (vexflow) {
    return vexFlowToMusicXml[vexflow];
  };

  Fermata.Mapping.Clef.Sign = {};
  Fermata.Mapping.Clef.Sign.getVexflow = function (fifth, mode) {
    fifth = parseInt(fifth, 10);

    if (mode === 'minor') {
      if (fifth <= 0) {
        return MINOR_KEYS[Math.abs(fifth)];
      }
      return MINOR_KEYS[fifth + 8];
    }
    else {
      if (fifth <= 0) {
        return MAJOR_KEYS[Math.abs(fifth)];
      }
      return MAJOR_KEYS[fifth + 7];
    }
  };
}).call(this);
