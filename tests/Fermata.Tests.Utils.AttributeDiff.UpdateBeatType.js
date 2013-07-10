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

  var UpdateBeatType = Fermata.Utils.AttributeDiff.UpdateBeatType;

  var defaultBeats = 4;

  var createAttributes = function (beatType) {
    return {
      time: {
        beats: defaultBeats,
        "beat-type": beatType
      }
    };
  };

  describe("Fermata.Utils.AttributeDiff", function () {
    describe("UpdateBeatType", function () {
      var updateBeatType;
      beforeEach(function () {
        updateBeatType = new UpdateBeatType();
      });

      describe("#canProcess", function () {
        it("true", function () {
          // Given 
          var delta = {time: {"beat-type": [4, 2]}};

          // When
          var canProcess = updateBeatType.canProcess(delta);

          // Then
          assert.equal(canProcess, true);
        });

        it("false", function () {
          // Given 
          var delta = {time: {"beats": [4, 2]}};

          // When
          var canProcess = updateBeatType.canProcess(delta);

          // Then
          assert.equal(canProcess, false);
        });
      });

      describe("#process", function () {
        it("basic", function () {
          // Given 
          var beatType1 = 2;
          var beatType2 = 4;
          var attributes1 = createAttributes(beatType1);
          var attributes2 = createAttributes(beatType2);
          var delta = {time: {"beat-type": [beatType1, beatType2]}};
          var result = {};
          var expectedResult = {time: {"beat-type": beatType2, beats: defaultBeats}};

          // When
          updateBeatType.process(attributes1, attributes2, delta, result);

          // Then
          assert.deepEqual(result, expectedResult);
        });
      });
    });
  });
}).call(this);
