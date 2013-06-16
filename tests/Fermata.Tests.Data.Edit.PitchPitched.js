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
  var PitchPitched = Fermata.Data.PitchPitched;
  var StepRangeError = Fermata.Error.StepRangeError;
  var OctaveRangeError = Fermata.Error.OctaveRangeError;
  var PitchRangeError = Fermata.Error.PitchRangeError;
  var SoundType = Fermata.Values.SoundType;

  var initNote = function (step, octave) {
    return {
      pitch: {
        step: step,
        octave: octave
      }
    };
  };

  describe("Fermata.Data.PitchPitched", function () {
    describe("#getType", function () {
      it("getType", function () {
        // Given 
        var note = initNote("C", 4);
        var pitch = new PitchPitched(note);

        // When
        var type = pitch.getType();

        // Then
        assert.strictEqual(type, SoundType.PITCH);
      });
    });

    describe("#setStep", function () {
      it("normal value", function () {
        // Given 
        var note = initNote("C", 4);
        var pitch = new PitchPitched(note);
        var newStep = "A";

        // When
        pitch.setStep(newStep);

        // Then
        assert.equal(note.pitch.step, newStep);
      });

      it("bad value", function () {
        // Given 
        var oldStep = "G";
        var note = initNote(oldStep, 4);
        var pitch = new PitchPitched(note);
        var newStep = "L";

        // When
        assert.throws(function () {
          pitch.setStep(newStep);
        },
                StepRangeError);

        // Then
        assert.equal(note.pitch.step, oldStep);
      });
    });

    describe("#setOctave", function () {
      it("normal value", function () {
        // Given 
        var note = initNote("C", 4);
        var pitch = new PitchPitched(note);
        var newOctave = 2;

        // When
        pitch.setOctave(newOctave);

        // Then
        assert.equal(note.pitch.octave, newOctave);
      });

      it("bad value (too low)", function () {
        // Given
        var oldOctave = 4;
        var note = initNote("C", oldOctave);
        var pitch = new PitchPitched(note);
        var newOctave = -4;

        // When
        assert.throws(function () {
          pitch.setOctave(newOctave);
        },
                OctaveRangeError);

        // Then
        assert.equal(note.pitch.octave, oldOctave);
      });

      it("bad value (too high)", function () {
        // Given
        var oldOctave = 4;
        var note = initNote("C", oldOctave);
        var pitch = new PitchPitched(note);
        var newOctave = 10;

        // When
        assert.throws(function () {
          pitch.setOctave(newOctave);
        },
                OctaveRangeError);

        // Then
        assert.equal(note.pitch.octave, oldOctave);
      });

      it("bad value (float value)", function () {
        // Given
        var oldOctave = 4;
        var note = initNote("C", oldOctave);
        var pitch = new PitchPitched(note);
        var newOctave = 4.3;

        // When
        assert.throws(function () {
          pitch.setOctave(newOctave);
        },
                OctaveRangeError);

        // Then
        assert.equal(note.pitch.octave, oldOctave);
      });
    });

    describe("#changePitch", function () {
      it("basic increment", function () {
        // Given 
        var note = initNote("C", 4);
        var pitch = new PitchPitched(note);
        var pitchChange = 1;

        // When
        pitch.changePitch(pitchChange);

        // Then
        assert.equal(note.pitch.step, "D");
        assert.equal(note.pitch.octave, 4);
      });

      it("basic decrement", function () {
        // Given 
        var note = initNote("D", 4);
        var pitch = new PitchPitched(note);
        var pitchChange = -1;

        // When
        pitch.changePitch(pitchChange);

        // Then
        assert.equal(note.pitch.step, "C");
        assert.equal(note.pitch.octave, 4);
      });

      it("octave jump up", function () {
        // Given
        var i = 0;
        var notes = [];
        for (i = 0; i < 9; i++) {
          notes.push(initNote("B", i));
        }
        var pitchChange = 1;

        // When
        for (i = 0; i < notes.length; i++) {
          var pitch = new PitchPitched(notes[i]);
          pitch.changePitch(pitchChange);
        }

        // Then
        for (i = 0; i < notes.length; i++) {
          var note = notes[i];

          assert.equal(note.pitch.step, "C");
          assert.equal(note.pitch.octave, i + 1);
        }
      });

      it("octave jump down", function () {
        // Given 
        var i = 0;
        var notes = [];
        for (i = 0; i < 9; i++) {
          notes.push(initNote("C", i + 1));
        }
        var pitchChange = -1;

        // When
        for (i = 0; i < notes.length; i++) {
          var pitch = new PitchPitched(notes[i]);
          pitch.changePitch(pitchChange);
        }

        // Then
        for (i = 0; i < notes.length; i++) {
          var note = notes[i];

          assert.equal(note.pitch.step, "B");
          assert.equal(note.pitch.octave, i);
        }
      });

      it("double octave jump up", function () {
        // Given 
        var note = initNote("A", 3);
        var pitch = new PitchPitched(note);
        var pitchChange = 13;

        // When
        pitch.changePitch(pitchChange);

        // Then
        assert.equal(note.pitch.step, "G");
        assert.equal(note.pitch.octave, 5);
      });

      it("double octave jump down", function () {
        // Given 
        var note = initNote("G", 3);
        var pitch = new PitchPitched(note);
        var pitchChange = -13;

        // When
        pitch.changePitch(pitchChange);

        // Then
        assert.equal(note.pitch.step, "A");
        assert.equal(note.pitch.octave, 1);
      });

      it("go to lowest value", function () {
        // Given 
        var note = initNote("F", 1);
        var pitch = new PitchPitched(note);
        var pitchChange = -10;

        // When
        pitch.changePitch(pitchChange);

        // Then
        assert.equal(note.pitch.step, "B");
        assert.equal(note.pitch.octave, 0);
      });

      it("go to highest value", function () {
        // Given 
        var note = initNote("F", 8);
        var pitch = new PitchPitched(note);
        var pitchChange = 10;

        // When
        pitch.changePitch(pitchChange);

        // Then
        assert.equal(note.pitch.step, "B");
        assert.equal(note.pitch.octave, 9);
      });

      it("move too low", function () {
        // Given 
        var oldStep = "C";
        var oldOctave = 0;
        var note = initNote(oldStep, oldOctave);
        var pitch = new PitchPitched(note);
        var pitchChange = -1;

        // When
        assert.throws(function () {
          pitch.changePitch(pitchChange);
        },
                PitchRangeError);

        // Then
        assert.equal(note.pitch.step, oldStep);
        assert.equal(note.pitch.octave, oldOctave);
      });

      it("move too high", function () {
        // Given 
        var oldStep = "B";
        var oldOctave = 9;
        var note = initNote(oldStep, oldOctave);
        var pitch = new PitchPitched(note);
        var pitchChange = 1;

        // When
        assert.throws(function () {
          pitch.changePitch(pitchChange);
        },
                PitchRangeError);

        // Then
        assert.equal(note.pitch.step, oldStep);
        assert.equal(note.pitch.octave, oldOctave);
      });

      it("octave string value", function () {
        // Given 
        var oldStep = "E";
        var oldOctave = "4";
        var note = initNote(oldStep, oldOctave);
        var pitch = new PitchPitched(note);
        var pitchChange = 1;

        // When
        pitch.changePitch(pitchChange);

        // Then
        assert.equal(note.pitch.step, "F");
        assert.equal(note.pitch.octave, oldOctave);
      });

      it("change string value", function () {
        // Given 
        var oldStep = "E";
        var oldOctave = 4;
        var note = initNote(oldStep, oldOctave);
        var pitch = new PitchPitched(note);
        var pitchChange = "1";

        // When
        pitch.changePitch(pitchChange);

        // Then
        assert.equal(note.pitch.step, "F");
        assert.equal(note.pitch.octave, oldOctave);
      });

      it("change and octave string values", function () {
        // Given 
        var oldStep = "E";
        var oldOctave = "4";
        var note = initNote(oldStep, oldOctave);
        var pitch = new PitchPitched(note);
        var pitchChange = "1";

        // When
        pitch.changePitch(pitchChange);

        // Then
        assert.equal(note.pitch.step, "F");
        assert.equal(note.pitch.octave, oldOctave);
      });
    });
  });
}).call(this);
