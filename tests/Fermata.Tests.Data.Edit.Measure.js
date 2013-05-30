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
  
  // Tests data
  var testMeasures = [];
  
  var checkMeasureNumbers = function (measures) {
    for (var i = 0 ; i < measures.length ; i++) {
      assert.equal(measures.$number, i + 1);
    }
  };
  
  var checkAttributes = function (measures, expectedMeasures) {
    for (var i = 0 ; i < measures.length ; i++) {
      assert.deepEqual(measures[i].attributes, expectedMeasures[i].attributes);
    }
  };
  
  var checkLength = function (measures, expectedMeasures) {
    assert.strictEqual(measures.length, expectedMeasures.length);
  };

  describe("Fermata.Edit.Measure", function () {
    describe("#addMeasure", function (){
      it("add at the begining of the measure", function (){
        // Given
        var measures = Utils.Clone(testMeasures);
        var expectedMeasures = [];
        var idx = 0;
        
        // When
        
        // Then
        checkMeasureNumbers(measures);
        checkLength(measures, expectedMeasures);
        checkAttributes(measures, expectedMeasures);
        });
    });
  });
}).call(this);
