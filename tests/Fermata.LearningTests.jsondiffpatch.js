if (typeof require !== 'undefined') {
  var Fermata,
      fs = require('fs'),
      assert = require('assert'),
      jsondiffpatch = require('jsondiffpatch');
  // Use Scons build version or devel version (using node vm)
  if (fs.existsSync(__dirname + '/../build/fermata/fermata.node.js')) {
    Fermata = require('..');
  }
  else {
    Fermata = require((process.env['FERMATA_COV'] ? '../src-cov' : '../src') +
            '/Fermata.Dev.Node.js');
  }

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
        var divisions1 = defaultDivisions;
        var divisions2 = 2;
        var attributes1 = createAttributes();
        var attributes2 = createAttributes();
        attributes2.divisions = divisions2;
        var expectedDelta = {
          divisions: [divisions1, divisions2]
        };

        // When
        var delta = jsondiffpatch.diff(attributes1, attributes2);

        // Then
        assert.deepEqual(delta, expectedDelta);
      });

      it("beats", function () {
        // Given 
        var beats1 = defaultBeats;
        var beats2 = 2;
        var attributes1 = createAttributes();
        var attributes2 = createAttributes();
        attributes2.time.beats = beats2;
        var expectedDelta = {
          time: {
            beats: [beats1, beats2]
          }
        };

        // When
        var delta = jsondiffpatch.diff(attributes1, attributes2);

        // Then
        assert.deepEqual(delta, expectedDelta);
      });

      it("beatType", function () {
        // Given 
        var beatType1 = defaultBeats;
        var beatType2 = 2;
        var attributes1 = createAttributes();
        var attributes2 = createAttributes();
        attributes2.time["beat-type"] = beatType2;
        var expectedDelta = {
          time: {
            "beat-type": [beatType1, beatType2]
          }
        };

        // When
        var delta = jsondiffpatch.diff(attributes1, attributes2);

        // Then
        assert.deepEqual(delta, expectedDelta);
      });
    });
  });
}).call(this);
