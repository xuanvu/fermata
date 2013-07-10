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
  
  var defaultDivisions = 1;
  var defaultBeats = 4;
  var defaultBeatType = 4;

  var createAttributes = function () {
    return {
      divisions: defaultDivisions,
      time: {
        beats: defaultBeats,
        "beat-type": defaultBeatType
      }
    };
  };

  describe("Learning test - jsondiffpatch", function () {
    describe("#diff", function () {
      it("divisions", function () {
        // Given 
        var divisions1 = 1;
        var divisions2 = 2;

        var attribute1 = {
          divisions: divisions1,
          time: {
            beats: 4,
            "beat-type": 4
          }
        };
        var attribute2 = {
          divisions: divisions2,
          time: {
            beats: 4,
            "beat-type": 4
          }
        };

        var expectedDelta = {
          divisions: [divisions1, divisions2]
        };

        // When
        var delta = jsondiffpatch.diff(attribute1, attribute2);

        // Then
        assert.deepEqual(delta, expectedDelta);
      });
    });
  });
}).call(this);
