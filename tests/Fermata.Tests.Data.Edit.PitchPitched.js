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
  var Data = Fermata.Data;
  var Utils = Fermata.Utils;
  
  var initPitchedNote = function (step, octave) {
    return {
      pitch: {
        step: step,
        octave: octave
      }
    };
  };

  describe("Fermata.Edit.Note", function () {
    describe("#setStep", function () {
      it("normal value", function () {
        var underTest = null;

        // Given 
        var pitchedNote = initPitchedNote("C", 4);
        var newStep = "A";

        // When
        underTest.setStep(newStep);

        // Then
        assert.equal(pitchedNote.pitch.step, newStep);       
      });
    });

    describe("#setStep", function () {
      it("normal value", function () {
        var underTest = null;
        
        // Given 
        var pitchedNote = initPitchedNote("C", 4);
        var newOctave = 2;

        // When
        underTest.setOctave(newOctave);

        // Then
        assert.equal(pitchedNote.pitch.octave, newOctave);       
      });
    });

    describe("#changePitch", function (){
      it("increment pitched note", function () {
        var underTest = null;
        
        // Given 
        var pitchedNote = initPitchedNote("C", 4);
        var pitchChange = 1;
        
        // When
        underTest.changePitch(pitchChange);
        
        // Then
        assert.equal(pitchedNote.pitch.step, "D");
        assert.equal(pitchedNote.pitch.octave, 4);        
      });
      
      it("decrement pitched note", function () {
        var underTest = null;
        
        // Given 
        var pitchedNote = initPitchedNote("C", 4);
        var pitchChange = -1;
        
        // When
        underTest.changePitch(pitchChange);
        
        // Then
        assert.equal(pitchedNote.pitch.step, "B");
        assert.equal(pitchedNote.pitch.octave, 4);        
      });

      it("octave up jump on pitched notes", function () {
        var underTest = null;
        
        // Given 
        var pitchedNotes = [];
        for (var i = 0 ; i < 9 ; i++) {
          pitchedNotes.push(initPitchedNote("G", i));
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

      it("octave down jump on pitched notes", function () {
        var underTest = null;
        
        // Given 
        var pitchedNotes = [];
        for (var i = 0 ; i < 9 ; i++) {
          pitchedNotes.push(initPitchedNote("A", i + 1));
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
