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

  var UpdateDivisions = Fermata.Utils.AttributeDiff.UpdateDivisions;

  var createAttributes = function (divisions) {
    return {
      divisions: divisions
    };
  };

  describe("Fermata.Utils.AttributeDiff", function () {
    describe("UpdateDivisions", function () {
      var updateDivision;
      beforeEach(function () {
        updateDivision = new UpdateDivisions();
      });

      describe("#canProcess", function () {
        it("true", function () {
          // Given 
          var delta = {divisions: [1, 3]};

          // When
          var canProcess = updateDivision.canProcess(delta);

          // Then
          assert.equal(canProcess, true);
        });

        it("false", function () {
          // Given 
          var delta = {time: {beats: [1, 3]}};

          // When
          var canProcess = updateDivision.canProcess(delta);

          // Then
          assert.equal(canProcess, false);
        });
      });

      describe("#process", function () {
        it("basic", function () {
          // Given 
          var divisions1 = 2;
          var divisions2 = 4;
          var attributes1 = createAttributes(divisions1);
          var attributes2 = createAttributes(divisions2);
          var delta = {divisions: [divisions1, divisions2]};
          var result = {};
          var expectedResult = {divisions: divisions2};

          // When
          updateDivision.process(attributes1, attributes2, delta, result);

          // Then
          assert.deepEqual(result, expectedResult);
        });
      });
    });
  });
}).call(this);
