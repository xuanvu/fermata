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
    beforeEach(function (done) {
      attributes = {
        clef: [{
            sign: "G",
            line: "2"
          }
        ],
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
  });
}).call(this);
