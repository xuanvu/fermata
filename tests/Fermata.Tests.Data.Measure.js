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

  var Measure = Fermata.Data.Measure;
  var BeatTypeValueError = Fermata.Error.BeatTypeValueError;
  var BeatsValueError = Fermata.Error.BeatsValueError;


  var getTestData = function (nbNote, nbRest) {
    var measure = {
      attributes: {
        divisions: 1,
        time: {
          beats: nbNote + nbRest,
          "beat-type": 4
        }
      },
      note: [],
      $fermata: {
        attributes: {
          divisions: 1,
          time: {
            beats: nbNote + nbRest,
            "beat-type": 4
          }
        }
      }
    };
    var i = 0;
    for (i = 0; i < nbNote; i++) {
      var note = {
        duration: 1,
        pitch: {
          sign: "C",
          line: 4
        }
      };
      measure.note.push(note);
    }
    for (i = 0; i < nbRest; i++) {
      var rest = {duration: 1,
        rest: {}
      };
      measure.note.push(note);
    }

    return measure;
  };

  var measureToCharTab = function (measure) {
    var notes = [];
    for (var i = 0; i < measure.note.length; i++) {
      var note = measure.note[i];
      var char = noteToChar(note);

      notes.push(char);
    }

    return notes;
  };

  var noteToChar = function (note) {
    if (typeof note.pitch !== "undefined") {
      return "p";
    } else if (typeof note.rest !== "undefined") {
      return "r";
    } else {
      throw new Error("note type not supported");
    }
  };

  describe("Fermata.Data.Measure", function () {
    describe("#initBeat", function () {
      it("basic value", function () {
// Given 
        var beats = 4;
        var beatType = 4;
        var data = {};
        var measure = new Measure(data);

        // When
        measure.initBeat(beats, beatType);

        // Then
        assert.strictEqual(data.attributes.time.beats, beats);
        assert.strictEqual(data.attributes.time["beat-type"], beatType);
      });

      it("bad beats value: string", function () {
// Given 
        var beats = "badValue";
        var beatType = 4;
        var data = {};
        var measure = new Measure(data);

        // Then
        assert.throws(function () {
          measure.initBeat(beats, beatType);
        },
                BeatsValueError);
      });

      it("bad beats value: negative", function () {
// Given 
        var beats = -5;
        var beatType = 4;
        var data = {};
        var measure = new Measure(data);

        // Then
        assert.throws(function () {
          measure.initBeat(beats, beatType);
        },
                BeatsValueError);
      });

      it("bad beats value: null", function () {
// Given 
        var beats = 0;
        var beatType = 4;
        var data = {};
        var measure = new Measure(data);

        // Then
        assert.throws(function () {
          measure.initBeat(beats, beatType);
        },
                BeatsValueError);
      });

      it("bad beats value: float", function () {
// Given 
        var beats = 1.8;
        var beatType = 4;
        var data = {};
        var measure = new Measure(data);

        // Then
        assert.throws(function () {
          measure.initBeat(beats, beatType);
        },
                BeatsValueError);
      });

      it("bad beat-type value: non power of 2", function () {
// Given 
        var beats = 4;
        var beatType = 5;
        var data = {};
        var measure = new Measure(data);

        // Then
        assert.throws(function () {
          measure.initBeat(beats, beatType);
        },
                BeatTypeValueError);
      });
    });

    describe("#setBeat", function () {
      it("increase beats", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest);
        var beats = 5;
        var measure = new Measure(data);
        var expectedNotes = ["p", "p", "r", "r", "r"];

        // When
        measure.setBeat(beats, measure.getBeatType());

        // Then
        var notes = notesToCharTab(data);
        assert.deepEqual(notes, expectedNotes);
        assert.equal(measure.getBeats(), beats);
        assert.ok(measure.isCompliant());
      });

      it("decrease beats - still compliant", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest);
        var beats = 3;
        var measure = new Measure(data);
        var expectedNotes = ["p", "p", "r"];

        // When
        measure.setBeat(beats, measure.getBeatType());

        // Then
        var notes = notesToCharTab(data);
        assert.deepEqual(notes, expectedNotes);
        assert.equal(measure.getBeats(), beats);
        assert.ok(measure.isCompliant());
      });

      it("decrease beats - not compliant", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest);
        var beats = 1;
        var measure = new Measure(data);
        var expectedNotes = ["p", "p"];

        // When
        measure.setBeat(beats, measure.getBeatType());

        // Then
        var notes = notesToCharTab(data);
        assert.deepEqual(notes, expectedNotes);
        assert.equal(measure.getBeats(), beats);
        assert.strictEqual(measure.isCompliant(), false);
      });
    });
  });
}).call(this);
