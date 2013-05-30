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
    
  }
  
  
   
  describe("Fermata.Edit.Measure", function () {
    describe("#addMeasure", function (){
      it("add at the begining of the measure", function (){
        // Given
        var measures = Utils.Clone(testMeasures);
        var resultMeasures = [];
        var idx = 0;
        
        // When
        
        // Then
        
        
        
          
        });
    });
  });
}).call(this);
