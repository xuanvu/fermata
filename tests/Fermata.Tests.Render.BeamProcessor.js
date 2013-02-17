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
        var beam = {
          $number: expected
        };

        // When
        var actual = BeamProcessor.getBeamNumber(beam);

        // Then
        assert.strictEqual(actual, expected);
      });
    });
    
    describe("#getBeamType", function (){
      var tryValue = function (expected)
      {
        // Given
        var beam = {};
        beam.content = expected;

        // When
        var actual = BeamProcessor.getBeamType(beam);

        // Then
        assert.strictEqual(actual, expected);
      };
      
      it("begin", function (){
        tryValue(BeamType.BEGIN);
      });
      
      it("continue", function (){
        tryValue(BeamType.CONTINUE);
      });
      
      it("end", function (){
        tryValue(BeamType.END);
      });
      
      it("failure", function (){

        // Given
        var beam = {};
        beam.content = "bad value";

        // Then
        assert.throws(
          function() {
            BeamProcessor.getBeamType(beam);
          },
          function(err) {
            return (err instanceof Error) && /bad value/.test(err);
          }
          );
      });
    });  
   
    describe("Fermata.Render.BeamProcessor", function () {
      describe("#addNote", function (){
        it("test of basic use", function (){
          var $fermata = {
            vexBeams: []
          };
          var beamProcessor = new BeamProcessor($fermata);
          
          // Given
          var notes = [
          {
            beam: {
              content: BeamType.BEGIN, 
              number: 1
            }
          },{
            beam: {
              content: BeamType.CONTINUE, 
              number: 1
            }
          },{
            beam: {
              content: BeamType.END, 
              number: 1
            }
          }];
          
          var vexNotes = [
          new Vex.Flow.StaveNote({
            keys: ["c/4"], 
            duration: "8"
          }),
          new Vex.Flow.StaveNote({
            keys: ["d/4"], 
            duration: "8"
          }),
          new Vex.Flow.StaveNote({
            keys: ["g/4"], 
            duration: "8"
          }),
          ];
          
          // When
          for (var i = 0 ; i < notes.length ; ++i)
          {
            var note = notes[i];
            var vexNote = vexNotes[i];
            
            beamProcessor.addNote(note, vexNote);
          }
          
          // Then
          assert.strictEqual($fermata.vexBeams.length, 1);
          assert.ok($fermata.vexBeams[0] instanceof Vex.Flow.Beam);          
        });
      });
    });
  });
}).call(this);
