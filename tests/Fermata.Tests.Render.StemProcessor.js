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
  var StemProcessor = Fermata.Render.StemProcessor;
  var StemType = Fermata.Render.StemType;
  
  describe("Fermata.Render.StemProcessor", function () {
    describe("#constructor", function (){
      it("test of the constructor", function (){
        var stemProcessor = new StemProcessor();
      });
    });

    describe("#hasStem", function (){
      it("true", function (){
        // Given
        var note = {
          stem: {}
        };

        // When
        var hasStem = StemProcessor.hasStem(note);

        // Then
        assert.strictEqual(hasStem, true);
      });

      it("false", function (){
        // Given
        var note = {
        };

        // When
        var hasStem = StemProcessor.hasStem(note);

        // Then
        assert.strictEqual(hasStem, false);
      });
    });
  });
}).call(this);
