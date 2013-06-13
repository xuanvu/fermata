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
        // Given 
        var note = initNote("C", 4);
        var pitch = new PitchPitched(note);
        var newStep = "A";

        // When
        pitch.setStep(newStep);

        // Then
        assert.equal(note.pitch.step, newStep);       
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
    });

    describe("#changePitch", function (){
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
        var note = initNote("C", 4);
        var pitch = new PitchPitched(note);
        var pitchChange = -1;
        
        // When
        pitch.changePitch(pitchChange);
        
        // Then
        assert.equal(note.pitch.step, "B");
        assert.equal(note.pitch.octave, 4);        
      });

      it("octave jump up", function () {
        var pitch = null;
        
        // Given 
        var notes = [];
        for (var i = 0 ; i < 9 ; i++) {
          notes.push(initNote("G", i));
        }
        var pitchChange = 1;
        
        // When
        pitch.changePitch(pitchChange);
        
        // Then
        for (var j = 0 ; j < notes.length ; j++) {
          var note = notes[j];
          
          assert.equal(note.pitch.step, "A");
          assert.equal(note.pitch.octave, j + 1);
        }
      });

      it("octave jump down", function () {
        var pitch = null;
        
        // Given 
        var notes = [];
        for (var i = 0 ; i < 9 ; i++) {
          notes.push(initNote("A", i + 1));
        }
        var pitchChange = -1;
        
        // When
        pitch.changePitch(pitchChange);
        
        // Then
        for (var j = 0 ; j < notes.length ; j++) {
          var note = notes[j];
          
          assert.equal(note.pitch.step, "G");
          assert.equal(note.pitch.octave, j);
        }
      });
    });
  });
}).call(this);
