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

  var UpdateBeats = Fermata.Utils.AttributeDiff.UpdateBeats;

  var defaultBeatType = 4;

  var createAttributes = function (beats) {
    return {
      time: {
        beats: beats,
        "beat-type": defaultBeatType
      }
    };
  };

  describe("Fermata.Utils.AttributeDiff", function () {
    describe("UpdateBeats", function () {
      var updateBeats;
      beforeEach(function () {
        updateBeats = new UpdateBeats();
      });

      describe("#canProcess", function () {
        it("true", function () {
          // Given 
          var delta = {time: {beats: [4, 2]}};

          // When
          var canProcess = updateBeats.canProcess(delta);

          // Then
          assert.equal(canProcess, true);
        });

        it("false", function () {
          // Given 
          var delta = {time: {"beat-type": [4, 2]}};

          // When
          var canProcess = updateBeats.canProcess(delta);

          // Then
          assert.equal(canProcess, false);
        });
      });

      describe("#process", function () {
        it("basic", function () {
          // Given 
          var beats1 = 2;
          var beats2 = 4;
          var attributes1 = createAttributes(beats1);
          var attributes2 = createAttributes(beats2);
          var delta = {time: {beats: [beats1, beats2]}};
          var result = {};
          var expectedResult = {time: {beats: beats2, "beat-type": defaultBeatType}};

          // When
          updateBeats.process(attributes1, attributes2, delta, result);

          // Then
          assert.deepEqual(result, expectedResult);
        });
      });
    });
  });
}).call(this);
