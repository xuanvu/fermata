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

  var initNote = function (step, octave) {
    return {
      pitch: {
        step: step,
        octave: octave
      }
    };
  };

  describe("Learning test - jsondiffpatch", function () {
    it("basic usage", function () {
      // Given 
      var attribute1 = {
        divisions: 1,
        time: {
          beats: 4,
          "beat-type": 4
        }
      };
      var attribute2 = {
        divisions: 1,
        time: {
          beats: 3,
          "beat-type": 8
        }
      };
      var destAttribute = {};
      var expectedAttribute = {
        time: {
          beats: 3,
          "beat-type": 8
        }
      };

      // When
      var delta = jsondiffpatch.diff(attribute1, attribute2);
      jsondiffpatch.patch(destAttribute, delta);

      // Then
      assert.deepEqual(destAttribute, expectedAttribute);
    });
  });
}).call(this);
