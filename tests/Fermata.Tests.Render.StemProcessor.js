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

    describe("#processNote", function (){
      it("up", function (){
        var stemProcessor = new StemProcessor();
        
        // Given
        var note = {
          stem: {
            content: "up"
          }
        };
        var vexArg = {};

        // When
        stemProcessor.processNote(note, vexArg);

        // Then
        assert.ok(typeof vexArg.stem_direction !== "undefined");
        assert.equal(vexArg.stem_direction === 1);
      });

      it("down", function (){
        var stemProcessor = new StemProcessor();
        
        // Given
        var note = {
          stem: {
            content: "down"
          }
        };
        var vexArg = {};

        // When
        stemProcessor.processNote(note, vexArg);

        // Then
        assert.ok(typeof vexArg.stem_direction !== "undefined");
        assert.equal(vexArg.stem_direction === -1);
      });
    });
    
    describe("#getStemType", function (){
      var tryValue = function (expected)
      {
        // Given
        var stem = {};
        stem.content = expected;

        // When
        var actual = StemProcessor.getStemType(stem);

        // Then
        assert.strictEqual(actual, expected);
      };
      
      it("down", function (){
        tryValue(StemType.DOWN);
      });

      it("up", function (){
        tryValue(StemType.UP);
      });

      it("none", function (){
        tryValue(StemType.NONE);
      });

      it("double", function (){
        tryValue(StemType.DOUBLE);
      });

      it("failure", function (){

        // Given
        var stem = {
          content: "bad value"
        };

        // Then
        assert.throws(
          function() {
            StemProcessor.getStemType(stem);
          },
          function(err) {
            return (err instanceof Error) && /bad value/.test(err);
          }
          );
      });
    });
  });
}).call(this);
