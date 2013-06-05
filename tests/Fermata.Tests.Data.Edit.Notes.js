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

  var initRestNote = function (step, octave) {
    return {
      rest: {
        "display-step": step,
        "display-octave": octave
      }
    };
  };

  describe("Fermata.Edit.Note", function () {
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

      it("increment rest note", function () {
        var underTest = null;
        
        // Given 
        var restNote = initRestNote("C", 4);
        var pitchChange = 1;
        
        // When
        underTest.changePitch(pitchChange);
        
        // Then
        assert.equal(pitchedNote.rest["display-step"], "D");
        assert.equal(pitchedNote.rest["display-octave"], 4);
      });
    });
  });
}).call(this);
