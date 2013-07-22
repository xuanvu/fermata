if (typeof require !== 'undefined') {
  var Fermata,
          fs = require('fs'),
          assert = require('assert');

  // Use Scons build version or devel version (using node vm)
  if (fs.existsSync(__dirname + '/../build/fermata/fermata.node.js')) {
    Fermata = require('..');
  }
  else {
    Fermata = require((process.env['FERMATA_COV'] ? '../src-cov' : '../src') +
            '/Fermata.Dev.Node.js');
  }

  // Test utils
  Fermata.Tests = require('./Fermata.Tests.Utils.js').Tests;
}

(function () {

  var PitchRest = Fermata.Data.PitchRest;
  var SoundType = Fermata.Values.SoundType;

  var initNote = function (step, octave) {
    return {
      rest: {
        "display-step": step,
        "display-octave": octave
      }
    };
  };

  describe("Fermata.Data.PitchRest", function () {
    var attributes;
    var gClef;
    var cClef;
    var fClef;
    beforeEach(function (done) {
      gClef = {
        sign: "G",
        line: "2"
      };
      fClef = {
        sign: "F",
        line: "4"
      };
      cClef = {
        sign: "C",
        line: "3"
      };
      attributes = {
        clef: [gClef],
        divisions: 1
      };
      done();
    });
    describe("#getType", function () {
      it("getType", function () {
        // Given 
        var note = initNote("C", 4);
        var pitch = new PitchRest(note, attributes);

        // When
        var type = pitch.getType();

        // Then
        assert.strictEqual(type, SoundType.REST);
      });
    });

    describe("#getStep & getOctave", function () {
      it("G clef", function () {
        // Given 
        var clef = gClef;
        var otherExpectedPitch = {
          octave: 4,
          step: "B"
        };
        var wholeExpectedPitch = {
          octave: 5,
          step: "D"
        };
        var divisions = 16;
        attributes.clef[0] = clef;
        attributes.divisions = divisions;
        var notes = createNotes();
        var pitch = new PitchRest(note, attributes);
        var pitchesData = [];

        // When
        for (var i = 0; i < notes.length; i++) {
          var note = notes[i];
          var pitch = new PitchRest(note, attributes);
          var pitchData = {
            octave: pitch.getOctave(),
            step: pitch.getStep()
          };
          pitchesData.push(pitchData);
        }

        // Then
        checkPitched(pitchesData, otherExpectedPitch, wholeExpectedPitch);
      });

      var createNotes = function () {
        var notes = [];
        for (var i = 1; i <= 64; i *= 2) {
          var note = {
            rest: {},
            duration: i.toString()
          };

          notes.push(note);
        }

        return notes;
      };

      var checkPitched = function (pitchesData, otherExpectedPitch, wholeExpectedPitch) {
        for (var i = 0; i < pitchesData.length; i++) {
          var pitchData = pitchesData[i];
          if (isWhole(i, pitchesData)) {
            assert.deepEqual(pitchData, wholeExpectedPitch);
          } else {
            assert.deepEqual(pitchData, otherExpectedPitch);
          }
        }
      };
      var isWhole = function (idx, pitchesData) {
        return isLast(idx, pitchesData);
      };

      var isLast = function (idx, tab) {
        return idx === tab.length - 1;
      };
    });
  });
}).call(this);
