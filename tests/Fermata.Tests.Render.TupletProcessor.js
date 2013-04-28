/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


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
  var TupletProcessor = Fermata.Render.TupletProcessor;
  
  describe("Fermata.Render.TupletProcessor", function () {
    describe("#constructor", function (){
      it("test of the constructor", function (){
        var tupletProcessor = new TupletProcessor();
      });
    });
    describe("#hasTuplet" , function () {
      it("test true", function () {      
        // Given
        var note = {
          notation: {
            tuplet: {}
          }
        };
        
        // When
        var result = TupletProcessor.hasTuplet(note);
        
        // Then
        assert.assertOk(result);
      });
      
      it("test true - table", function () {      
        // Given
        var note = {
          notation: [
          {
            tuplet: {}
          },
          {
            tied: {}
          },
          {
            glissando: {}
          }
          ]
        };
        
        // When
        var result = TupletProcessor.hasTuplet(note);
        
        // Then
        assert.assertOk(result);
      });
      
      it("test false", function () {
        // Given
        var note = {};
        
        // When
        var result = TupletProcessor.hasTuplet(note);
        
        // Then
        assert.assertOk(!result);       
      })
    });
    
    it("test false - table", function () {      
      // Given
      var note = {
        notation: [
        {
          tied: {}
        },
        {
          glissando: {}
        }
        ]
      };
        
      // When
      var result = TupletProcessor.hasTuplet(note);
        
      // Then
      assert.assertOk(!result);
    });
    
    describe("#hasTimeModification" , function () {
      it("test true", function () {      
        // Given
        var note = {
          "time-modification": {}
        };
        
        // When
        var result = TupletProcessor.hasTimeModification(note);
        
        // Then
        assert.assertOk(result);
      });
      
      it("test false", function () {
        // Given
        var note = {};
        
        // When
        var result = TupletProcessor.hasTimeModification(note);
        
        // Then
        assert.assertOk(!result);       
      })
    });

    describe("#getTuplet" , function () {
      it("test basic", function () {      
        // Given
        var tuplet = {};
        var note = {
          notation: {
            tuplet: tuplet
          }
        };
        
        // When
        var result = TupletProcessor.getTuplet(note);
        
        // Then
        assert.assertStrictEqual(result, tuplet);
      });

      it("test table", function () {      
        // Given
        var tuplet = {};
        var note = {
          notation: [
          {
            tuplet: tuplet
          },
          {
            tied: {}
          },
          {
            glissando: {}
          }
          ]
        };
        
        // When
        var result = TupletProcessor.getTuplet(note);
        
        // Then
        assert.assertStrictEqual(result, tuplet);
      });
    });

    describe("#getTimeModification" , function () {
      it("test basic", function () {      
        // Given
        var timeModification = {};
        var note = {
          "time-modification": timeModification
        };

        // When
        var result = TupletProcessor.getTimeModification(note);
        
        // Then
        assert.assertStrictEqual(result, timeModification);
      });
    });
  });
}).call(this);
