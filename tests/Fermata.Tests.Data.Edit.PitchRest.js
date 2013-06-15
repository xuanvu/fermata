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

  var PitchRest = Fermata.Data.PitchRest;

  var initNote = function (step, octave) {
    return {
      rest: {
        "display-step": step,
        "display-octave": octave
      }
    };
  };

  describe("Fermata.Data.PitchRest", function () {
    describe("#changePitch", function () {
      it("basic increment", function () {
        var underTest = null;
        
        // Given 
        var restNote = initNote("C", 4);
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
