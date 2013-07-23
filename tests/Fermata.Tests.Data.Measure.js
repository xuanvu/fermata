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


  var getTestData = function (nbNote, nbRest, nbVoices) {
    if (typeof nbVoices === "undefined") {
      nbVoices = 1;
    }
    var measure = createBaseMeasure(nbNote + nbRest);

    for (var voiceIdx = 0; voiceIdx < nbVoices; voiceIdx++) {
      var i = 0;
      for (i = 0; i < nbNote; i++) {
        var note = createPitchNote(voiceIdx);
        measure.note.push(note);
      }
      for (i = 0; i < nbRest; i++) {
        var rest = createRestNote(voiceIdx);
        measure.note.push(rest);
      }
    }

    return measure;
  };

  var getTestDataFromTab = function (typeTab, nbVoices) {
    if (typeof nbVoices === "undefined") {
      nbVoices = 1;
    }
    var measure = createBaseMeasure(typeTab.length);
    for (var voiceIdx = 0; voiceIdx < nbVoices; voiceIdx++) {
      for (var i = 0; i < typeTab.length; i++) {
        var type = typeTab[i];
        var note;
        if (type === "r") {
          note = createRestNote(voiceIdx);
          measure.note.push(note);
        } else {
          note = createPitchNote(voiceIdx);
        }
      }
    }
    return measure;
  };

  var createBaseMeasure = function (beats) {
    var measure = {
      attributes: [
        {
          divisions: "1",
          time: {
            beats: beats.toString(),
            "beat-type": "4"
          }
        }
      ],
      note: [],
      $fermata: {
        attributes: {
          divisions: 1,
          time: {
            beats: beats,
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
  };

  var createPitchNote = function (voiceIdx) {
    if (typeof voiceIdx === "undefined") {
      voiceIdx = 0;
    }

    var voice = (voiceIdx + 1).toString();
    return {
      duration: 1,
      pitch: {
        sign: "C",
        line: 4
      },
      voice: voice
    };
  };

  var createRestNote = function (voiceIdx) {
    if (typeof voiceIdx === "undefined") {
      voiceIdx = 0;
    }

    var voice = (voiceIdx + 1).toString();
    return {
      duration: 1,
      rest: {},
      voice: voice
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

      it("with strings", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest);
        changeIntToStringInDurations(data);
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

      it("empty notes", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest);
        data.note = [];
        var measure = new Measure(data);

        // When
        var actualDuration = measure.getActualDuration();

        // Then
        assert.equal(actualDuration, 0);
      });
    });

    describe("#updateAttributes", function () {
      it("basic case", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest);
        var measure = new Measure(data);
        var expectedAttributes = getTestData(nbNote, nbRest).attributes[0];
        expectedAttributes.time.beats = "7";
        expectedAttributes.time["beat-type"] = "8";
        expectedAttributes.divisions = "6";

        // When
        measure.setBeat(7, 8);
        measure.multiplyDivisions(3);
        measure.updateAttributes();

        // Then
        assert.deepEqual(measure.data.attributes[0], expectedAttributes);
      });
    });

    describe("#makeAddNote", function () {
      it("basic case", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest);
        var measure = new Measure(data);
        var newNote = {};
        var insertionIdx = 2;

        // When
        measure.makeAddNote(newNote, insertionIdx);
        // Then
        assert.equal(measure.data.note.length, 5);
        assert.equal(measure.voices[0].length, 5);
        assert.equal(measure.voices[0][insertionIdx], newNote);
        assert.equal(measure.data.note[insertionIdx], newNote);
      });

      it("defaut voice", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest, 2);
        var measure = new Measure(data);
        var newNote = {};
        var insertionIdx = 2;

        // When
        measure.makeAddNote(newNote, insertionIdx);
        // Then
        assert.equal(measure.data.note.length, 9);
        assert.equal(measure.voices[0].length, 5);
        assert.equal(measure.voices[0][insertionIdx], newNote);
        assert.equal(measure.data.note[insertionIdx], newNote);
      });

      it("on empty voice", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest, 2);
        var measure = new Measure(data);
        var newNote = {};
        var insertionIdx = 0;

        // When
        measure.makeAddNote(newNote, insertionIdx, 2);
        // Then
        assert.equal(measure.data.note.length, 9);
        assert.equal(measure.voices[2].length, 1);
        assert.equal(measure.voices[2][insertionIdx], newNote);
        assert.equal(measure.data.note[0], newNote);
      });

      it("at begining - voice 1", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest, 2);
        var measure = new Measure(data);
        var newNote = {};
        var insertionIdx = 0;
        var voiceIdx = 0;

        // When
        measure.makeAddNote(newNote, insertionIdx, voiceIdx);
        // Then
        assert.equal(measure.data.note.length, 9);
        assert.equal(measure.voices[voiceIdx].length, 5);
        assert.equal(measure.voices[voiceIdx][insertionIdx], newNote);
        assert.equal(measure.data.note[0], newNote);
      });

      it("at end - voice 1", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest, 2);
        var measure = new Measure(data);
        var newNote = {};
        var insertionIdx = 4;
        var voiceIdx = 0;

        // When
        measure.makeAddNote(newNote, insertionIdx, voiceIdx);
        // Then
        assert.equal(measure.data.note.length, 9);
        assert.equal(measure.voices[voiceIdx].length, 5);
        assert.equal(measure.voices[voiceIdx][insertionIdx], newNote);
        assert.equal(measure.data.note[4], newNote);
      });

      it("at begining - voice 2", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest, 2);
        var measure = new Measure(data);
        var newNote = {};
        var insertionIdx = 0;
        var voiceIdx = 1;

        // When
        measure.makeAddNote(newNote, insertionIdx, voiceIdx);
        // Then
        assert.equal(measure.data.note.length, 9);
        assert.equal(measure.voices[voiceIdx].length, 5);
        assert.equal(measure.voices[voiceIdx][insertionIdx], newNote);
        assert.equal(measure.data.note[4], newNote);
      });

      it("at end - voice 2", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest, 2);
        var measure = new Measure(data);
        var newNote = {};
        var insertionIdx = 4;
        var voiceIdx = 1;

        // When
        measure.makeAddNote(newNote, insertionIdx, voiceIdx);
        // Then
        assert.equal(measure.data.note.length, 9);
        assert.equal(measure.voices[voiceIdx].length, 5);
        assert.equal(measure.voices[voiceIdx][insertionIdx], newNote);
        assert.equal(measure.data.note[8], newNote);
      });
    });

    describe("#makeRemoveNote", function () {
      it("basic case", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest);
        var measure = new Measure(data);
        var voiceIdx = 0;
        var suppressionIdx = 2;
        var noteToDelete = measure.getVoice(voiceIdx)[suppressionIdx];

        // When
        measure.makeRemoveNote(suppressionIdx);

        // Then
        assert.equal(measure.data.note.length, 3);
        assert.equal(measure.voices[voiceIdx].length, 3);
        assert.equal(measure.voices[voiceIdx].indexOf(noteToDelete), -1);
        assert.equal(measure.data.note.indexOf(noteToDelete), -1);
      });

      it("basic case", function () {
        // Given 
        var nbNote = 2;
        var nbRest = 2;
        var data = getTestData(nbNote, nbRest, 2);
        var measure = new Measure(data);
        var voiceIdx = 1;
        var suppressionIdx = 2;
        var noteToDelete = measure.getVoice(voiceIdx)[suppressionIdx];

        // When
        measure.makeRemoveNote(suppressionIdx, 1);

        // Then
        assert.equal(measure.data.note.length, 7);
        assert.equal(measure.voices[voiceIdx].length, 3);
        assert.equal(measure.voices[voiceIdx].indexOf(noteToDelete), -1);
        assert.equal(measure.data.note.indexOf(noteToDelete), -1);
      });
    });

    describe("#calcAvailableSpaceAtIdx", function () {
      it("enough space", function () {
        // Given 
        var noteTab = ["r", "r", "r", "r"];
        var data = getTestDataFromTab(noteTab);
        var measure = new Measure(data);
        var voiceIdx = 0;
        var noteIdx = 0;
        var divisionsNeeded = 2;
        var expectedResult = divisionsNeeded;

        // When
        var availableSpace = measure.calcAvailableSpaceAtIdx(divisionsNeeded, noteIdx, voiceIdx);

        // Then
        assert.equal(availableSpace, expectedResult);
      });

      it("not enough space (reach end) - miss 1", function () {
        // Given 
        var noteTab = ["r", "r", "r", "r"];
        var data = getTestDataFromTab(noteTab);
        var measure = new Measure(data);
        var voiceIdx = 0;
        var noteIdx = 2;
        var divisionsNeeded = 3;
        var expectedResult = 2;

        // When
        var availableSpace = measure.calcAvailableSpaceAtIdx(divisionsNeeded, noteIdx, voiceIdx);

        // Then
        assert.equal(availableSpace, expectedResult);
      });

      it("not enough space (reach end) - miss 2", function () {
        // Given 
        var noteTab = ["r", "r", "r", "r"];
        var data = getTestDataFromTab(noteTab);
        var measure = new Measure(data);
        var voiceIdx = 0;
        var noteIdx = 3;
        var divisionsNeeded = 3;
        var expectedResult = 1;

        // When
        var availableSpace = measure.calcAvailableSpaceAtIdx(divisionsNeeded, noteIdx, voiceIdx);

        // Then
        assert.equal(availableSpace, expectedResult);
      });

      it("not enough space (reach note) - miss 1", function () {
        // Given 
        var noteTab = ["r", "r", "r", "n"];
        var data = getTestDataFromTab(noteTab);
        var measure = new Measure(data);
        var voiceIdx = 0;
        var noteIdx = 1;
        var divisionsNeeded = 3;
        var expectedResult = 2;

        // When
        var availableSpace = measure.calcAvailableSpaceAtIdx(divisionsNeeded, noteIdx, voiceIdx);

        // Then
        assert.equal(availableSpace, expectedResult);
      });

      it("not enough space (reach note) - miss 1", function () {
        // Given 
        var noteTab = ["r", "r", "n", "n"];
        var data = getTestDataFromTab(noteTab);
        var measure = new Measure(data);
        var voiceIdx = 0;
        var noteIdx = 1;
        var divisionsNeeded = 3;
        var expectedResult = 1;

        // When
        var availableSpace = measure.calcAvailableSpaceAtIdx(divisionsNeeded, noteIdx, voiceIdx);

        // Then
        assert.equal(availableSpace, expectedResult);
      });
    });
  });

  var changeIntToStringInDurations = function (measure) {
    var notes = measure.note;
    for (var i = 0; i < notes.length; i++) {
      var note = notes[i];

      note.duration = note.duration.toString();
    }
  };
}).call(this);
