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
  var Render = Fermata.Render; 
  var BeamType = Fermata.Render.BeamType;
  
  var renderMeasure = function (notesData)
  {
    var measure = createMeasure(notesData);
    var measureIdx = 0;
    var partIdx = 0;
    
    var part = {
      measure:[measure]
    };
    var parts = {
      idx:[part]
    };
    var data = {
      getParts: function () {
        return parts
      }
    };
 
    var fermataRender = new Render(data);
    fermataRender.renderMeasure(measureIdx, partIdx);
  }
  
  var createMeasure = function (notesData) {
    var notes = createNotes(notesData);
    var measure = {
      attributes: [{
        "divisions": "4",
        "key": {
          "fifths": "1",
          "mode": "major"
        },
        "time": {
          "beats": "2",
          "beat-type": "4"
        },
        "clef": {
          "sign": "G",
          "line": "2"
        }
      }],
      note: notes
    };
    
    return measure;
  };
  
  var createNotes = function (notesData) { 
    var notes = [];
    
    for (var i = 0 ; i < notesData.length ; i++)
    {
      var noteData = notesData[i];
      
      noteData.beam = {};
      if (notes.length === 0)
      {
        noteData.beam.content = BeamType.BEGIN;
      }
      else if (notes.length === notesData.length - 1)
      {
        noteData.beam.content = BeamType.END;
      }
      else
      {
        noteData.beam.content = BeamType.CONTINUE;
      }
      
      noteData.duration = "2";
      noteData.duration = "1";
      noteData.type = "eighth";
      noteData.number = "1";
      notes.push(noteData);
    }
    return notes;
  }
  
  describe("Fermata.Render.BeamProcessor.Integ", function () {
    describe("#Measure Rendering", function (){
      it("stem forced up", function (){

        var notesData = [
        {
          pitch: {
            step: "E",
            octave: "4"
          },
          stem: "up"
        }, {
          pitch: {
            step: "F",
            octave: "4"
          },
          stem: "up"
        }, {
          pitch: {
            step: "A",
            octave: "4"
          },
          stem: "up"
        }, {
          pitch: {
            step: "B",
            octave: "4"
          },
          stem: "up"
        }
        ];

        renderMeasure(notesData);
      });
      
      it("stem forced down", function (){

        var notesData = [
        {
          pitch: {
            step: "E",
            octave: "4"
          },
          stem: "down"
        }, {
          pitch: {
            step: "F",
            octave: "4"
          },
          stem: "down"
        }, {
          pitch: {
            step: "A",
            octave: "4"
          },
          stem: "down"
        }, {
          pitch: {
            step: "B",
            octave: "4"
          },
          stem: "down"
        }
        ];

        renderMeasure(notesData);
      });
      
      it("stem unspecified (close pitch)", function (){

        var notesData = [
        {
          pitch: {
            step: "D",
            octave: "4"
          }
        }, {
          pitch: {
            step: "E",
            octave: "4"
          }
        }, {
          pitch: {
            step: "F",
            octave: "4"
          }
        }, {
          pitch: {
            step: "G",
            octave: "4"
          }
        }
        ];
        
        renderMeasure(notesData);      
      });
      
      it("stem unspecified (distant pitch)", function (){

        var notesData = [
        {
          pitch: {
            step: "E",
            octave: "4"
          }
        }, {
          pitch: {
            step: "F",
            octave: "4"
          }
        }, {
          pitch: {
            step: "A",
            octave: "4"
          }
        }, {
          pitch: {
            step: "B",
            octave: "4"
          }
        }
        ];
        
        assert.throws(function () {
          renderMeasure(notesData);
        },
        Fermata.Vex.RuntimeError
        );        
      });
      
      it("stem forced bad", function (){

        var notesData = [
        {
          pitch: {
            step: "E",
            octave: "4"
          },
          stem: "down"
        }, {
          pitch: {
            step: "F",
            octave: "4"
          },
          stem: "up"
        }, {
          pitch: {
            step: "A",
            octave: "4"
          },
          stem: "down"
        }, {
          pitch: {
            step: "B",
            octave: "4"
          },
          stem: "up"
        }
        ];
        
        assert.throws(function () {
          renderMeasure(notesData);
        },
        Fermata.Vex.RuntimeError
        );        
      });      
    });
  });
}).call(this);
