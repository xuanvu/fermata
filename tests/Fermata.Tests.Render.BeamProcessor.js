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
  var BeamProcessor = Fermata.Render.BeamProcessor;
  var BeamType = Fermata.Render.BeamType;
  
  describe("Fermata.Render.BeamProcessor", function () {
    describe("#constructor", function (){
      it("test of the constructor", function (){
        var beamProcessor = new BeamProcessor();
      });
    });
    
    describe("#getBeamNumber", function (){
      it("test of the method", function (){
        var expected = 3;

        // Given
        var beam = {};
        beam.number = expected;

        // When
        var actual = BeamProcessor.getBeamNumber(beam);

        // Then
        assert.strictEqual(actual, expected);
      });
    });
    
  });
  
}).call(this);
