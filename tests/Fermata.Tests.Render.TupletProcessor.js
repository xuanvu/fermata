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
        var $fermata = {};
        var tupletProcessor = new TupletProcessor($fermata);
      });
    });
    
    describe("#hasTuplet" , function () {
      it("test true", function () {
        // Given
        var note = {
          notations: {
            tuplet: {}
          }
        };
        
        // When
        var result = TupletProcessor.hasTuplet(note);
        
        // Then
        assert.ok(result);
      });
   
      it("test true - table", function () {
        // Given
        var note = {
          notations: [
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

        arrayAssessor(boulbi, bar, foo, note);
        
        // When
        var result = TupletProcessor.hasTuplet(note);
        
        // Then
        assert.ok(result);
      });
      
      it("test false", function () {
        // Given
        var note = {};
        
        // When
        var result = TupletProcessor.hasTuplet(note);
        
        // Then
        assert.ok(!result);
      });

      it("test false - table", function () {      
        // Given
        var note = {
          notations: [
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
        assert.ok(!result);
      });
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
        assert.ok(result);
      });
      
      it("test false", function () {
        // Given
        var note = {};
        
        // When
        var result = TupletProcessor.hasTimeModification(note);
        
        // Then
        assert.ok(!result);       
      })
    });
    
    describe("#getTuplet" , function () {
      it("test basic", function () {      
        // Given
        var tuplet = {};
        var note = {
          notations: {
            tuplet: tuplet
          }
        };
        
        // When
        var result = TupletProcessor.getTuplet(note);
        
        // Then
        assert.strictEqual(result, tuplet);
      });
      
      it("test table", function () {      
        // Given
        var tuplet = {};
        var note = {
          notations: [
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
        assert.strictEqual(result, tuplet);
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
        assert.strictEqual(result, timeModification);
      });
    });
    
    describe("#addNote" , function () {
      it("first note", function () {
        var $fermata = {
          vexTuplets: []
        };
        var tupletProcessor = new TupletProcessor($fermata);
        
        // Given
        var notes = [
        {
          "time-modification": {
            "actual-notes": "3",
            "normal-notes": "2"
          },
          notations: {
            tuplet: {
              $type: "start",
              $bracket: "no"
            }
          }
        },
        {
          "time-modification": {
            "actual-notes": "3",
            "normal-notes": "2"
          }
        },
        {
          "time-modification": {
            "actual-notes": "3",
            "normal-notes": "2"
          },
          notations: {
            tuplet: {
              $type: "stop"
            }
          }
        }
        ];
        
        var vexNotes = [];
        for (var i = 0 ; i < notes.length ; i++)
        {
          vexNotes.push(new Fermata.Vex.Flow.StaveNote({
            keys: ["a/4"], 
            duration: "8"
          }));
        }
        
        // When
        for (var i = 0 ; i < vexNotes.length ; i++)
        {
          var note = notes[i];
          var vexNote = vexNotes[i];
          
          tupletProcessor.addNote(note, vexNote);
        }
        
        // Then
        assert.strictEqual($fermata.vexTuplets.length, 1);
        assert.ok($fermata.vexTuplets[0] instanceof Fermata.Vex.Flow.Tuplet);     
      });
    });
  });
}).call(this);
