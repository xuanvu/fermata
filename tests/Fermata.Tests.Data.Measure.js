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
      attributes: [
        {
          divisions: "1",
          time: {
            beats: (nbNote + nbRest).toString(),
            "beat-type": "4"
          }
        }
      ],
      note: [],
      $fermata: {
        attributes: {
          divisions: 1,
          time: {
            beats: nbNote + nbRest,
            "beat-type": 4
          },
          clef: [],
          staves: "1",
          "part-symbol": {
            "top-staff": 1,
            "bottom-staff": 2,
            symbol: 'brace'
          }
        }
      }
    };
    
    var i = 0;
    for (i = 0; i < nbNote; i++) {
      var note = createPitchNote();
      measure.note.push(note);
    }
    for (i = 0; i < nbRest; i++) {
      var rest = createRestNote();
      measure.note.push(rest);
    }

    return measure;
  };

  var createPitchNote = function () {
    return {
      duration: 1,
      pitch: {
        sign: "C",
        line: 4
      }
    };
  };

  var createRestNote = function () {
    return {
      duration: 1,
      rest: {}
    };
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
        assert.strictEqual(data.attributes[0].time.beats, beats);
        assert.strictEqual(data.attributes[0].time["beat-type"], beatType);
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
        var notes = measureToCharTab(data);
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
        var notes = measureToCharTab(data);
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
        var notes = measureToCharTab(data);
        assert.deepEqual(notes, expectedNotes);
        assert.equal(measure.getBeats(), beats);
        assert.strictEqual(measure.isCompliant(), false);
      });

      it("decrease beats with beatType increased- compliant", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest);
        var beats = 7;
        var beatType = 8;
        var measure = new Measure(data);
        var expectedNotes = ["p", "p", "r", "r"];

        // When
        measure.setBeat(beats, beatType);

        // Then
        var notes = measureToCharTab(data);
        var firstNote = data.note[0];
        var lastNote = data.note[data.note.length - 1];
        assert.deepEqual(notes, expectedNotes);
        assert.equal(measure.getBeats(), beats);
        assert.strictEqual(measure.isCompliant(), true);
        assert.equal(measure.getDivisions(), 2);
        assert.equal(firstNote.duration, 2);
        assert.equal(lastNote.duration, 1);
      });
    });

    describe("#getDivisions", function () {
      it("non rendered", function () {
        // Given 
        var expectedDivisions = 1;
        var data = getTestData(2, 2);
        delete data.$fermata;
        var measure = new Measure(data);

        // When
        var divisions = measure.getDivisions();

        // Then
        assert.equal(divisions, expectedDivisions);
      });

      it("rendered", function () {
        // Given 
        var expectedDivisions = 2;
        var data = getTestData(2, 2);
        var measure = new Measure(data);
        data.$fermata.attributes.divisions = expectedDivisions;

        // When
        var divisions = measure.getDivisions();

        // Then
        assert.equal(divisions, expectedDivisions);
      });
    });

    describe("#multiplyDivisions", function () {
      it("normalCase", function () {
        // Given 
        var expectedDivisions = 4;
        var expectedDuration = 4;
        var data = getTestData(2, 2);
        var measure = new Measure(data);

        // When
        measure.multiplyDivisions(4);

        // Then
        assert.equal(measure.getDivisions(), expectedDivisions);
        for (var i = 0; i < data.note.length; i++) {
          var note = data.note[i];
          assert.equal(note.duration, expectedDuration);
        }
      });
    });

    describe("#getBeatType", function () {
      it("non rendered", function () {
        // Given 
        var expectedBeatType = 4;
        var data = getTestData(2, 2);
        delete data.$fermata;
        var measure = new Measure(data);

        // When
        var beatType = measure.getBeatType();

        // Then
        assert.equal(beatType, expectedBeatType);
      });

      it("rendered", function () {
        // Given 
        var expectedBeatType = 5;
        var data = getTestData(2, 2);
        var measure = new Measure(data);
        data.$fermata.attributes.time["beat-type"] = expectedBeatType;

        // When
        var beatType = measure.getBeatType();

        // Then
        assert.equal(beatType, expectedBeatType);
      });
    });

    describe("#getBeats", function () {
      it("non rendered", function () {
        // Given 
        var expectedBeats = 4;
        var data = getTestData(2, 2);
        delete data.$fermata;
        var measure = new Measure(data);


        // When
        var beats = measure.getBeats();

        // Then
        assert.equal(beats, expectedBeats);
      });

      it("rendered", function () {
        // Given 
        var expectedBeats = 5;
        var data = getTestData(2, 2);
        var measure = new Measure(data);
        data.$fermata.attributes.time.beats = expectedBeats;

        // When
        var beats = measure.getBeats();

        // Then
        assert.equal(beats, expectedBeats);
      });
    });

    describe("#getAuthorizedDuration", function () {
      it("basic case", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest);
        var measure = new Measure(data);

        // When
        var authorizedDuration = measure.getAuthorizedDuration();

        // Then
        assert.equal(authorizedDuration, 4);
      });

      it("non compliant", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest);
        data.note.push(createPitchNote());
        var measure = new Measure(data);

        // When
        var authorizedDuration = measure.getAuthorizedDuration();

        // Then
        assert.equal(authorizedDuration, 4);
      });
    });

    describe("#getActualDuration", function () {
      it("basic case", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest);
        var measure = new Measure(data);

        // When
        var actualDuration = measure.getActualDuration();

        // Then
        assert.equal(actualDuration, 4);
      });

      it("non compliant", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest);
        data.note.push(createPitchNote());
        var measure = new Measure(data);

        // When
        var actualDuration = measure.getActualDuration();

        // Then
        assert.equal(actualDuration, 5);
      });
    });

    describe("#updateAttributes", function () {
      it("basic case", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest);
        var measure = new Measure(data);

        // When
        measure.setBeat(7, 8);
        measure.multiplyDivisions(3);
        measure.updateAttributes();

        // Then
        assert.deepEqual(measure.data.attributes[0], measure.attributes);
      });
    });
  });
}).call(this);
