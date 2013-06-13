if (typeof require !== 'undefined') {
  var Fermata,
  fs = require('fs'),
  assert = require('assert');

  // Use Scons build version or devel version (using node vm)
  if (fs.existsSync(__dirname + '/../build/fermata/fermata.node.js')) {
    Fermata = require('..');
  }
  else {
    Fermata = require((process.env['FERMATA_COV'] ? '../src-cov' : '../src') + '/Fermata.Dev.Node.js');
  }

  // Test utils
  Fermata.Tests = require('./Fermata.Tests.Utils.js').Tests;
}

(function(){
  var PitchPitched = Fermata.Render.PitchPitched;
  
  var initNote = function (step, octave) {
    return {
      pitch: {
        step: step,
        octave: octave
      }
    };
  };

  describe("Fermata.Data.PitchPitched", function () {
    describe("#setStep", function () {
      it("normal value", function () {
        var underTest = null;

        // Given 
        var pitchedNote = initNote("C", 4);
        var newStep = "A";

        // When
        underTest.setStep(newStep);

        // Then
        assert.equal(pitchedNote.pitch.step, newStep);       
      });
    });

    describe("#setOctave", function () {
      it("normal value", function () {
        var underTest = null;
        
        // Given 
        var pitchedNote = initNote("C", 4);
        var newOctave = 2;

        // When
        underTest.setOctave(newOctave);

        // Then
        assert.equal(pitchedNote.pitch.octave, newOctave);       
      });
    });

    describe("#changePitch", function (){
      it("basic increment", function () {
        var underTest = null;
        
        // Given 
        var pitchedNote = initNote("C", 4);
        var pitchChange = 1;
        
        // When
        underTest.changePitch(pitchChange);
        
        // Then
        assert.equal(pitchedNote.pitch.step, "D");
        assert.equal(pitchedNote.pitch.octave, 4);        
      });
      
      it("basic decrement", function () {
        var underTest = null;
        
        // Given 
        var pitchedNote = initNote("C", 4);
        var pitchChange = -1;
        
        // When
        underTest.changePitch(pitchChange);
        
        // Then
        assert.equal(pitchedNote.pitch.step, "B");
        assert.equal(pitchedNote.pitch.octave, 4);        
      });

      it("octave jump up", function () {
        var underTest = null;
        
        // Given 
        var pitchedNotes = [];
        for (var i = 0 ; i < 9 ; i++) {
          pitchedNotes.push(initNote("G", i));
        }
        var pitchChange = 1;
        
        // When
        underTest.changePitch(pitchChange);
        
        // Then
        for (var j = 0 ; j < pitchedNotes.length ; j++) {
          var pitchedNote = pitchedNotes[j];
          
          assert.equal(pitchedNote.pitch.step, "A");
          assert.equal(pitchedNote.pitch.octave, j + 1);
        }
      });

      it("octave jump down", function () {
        var underTest = null;
        
        // Given 
        var pitchedNotes = [];
        for (var i = 0 ; i < 9 ; i++) {
          pitchedNotes.push(initNote("A", i + 1));
        }
        var pitchChange = -1;
        
        // When
        underTest.changePitch(pitchChange);
        
        // Then
        for (var j = 0 ; j < pitchedNotes.length ; j++) {
          var pitchedNote = pitchedNotes[j];
          
          assert.equal(pitchedNote.pitch.step, "G");
          assert.equal(pitchedNote.pitch.octave, j);
        }
      });
    });
  });
}).call(this);
