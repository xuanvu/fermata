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

  var Measure = Fermata.Data.Measure;
  var BeatTypeValueError = Fermata.Error.BeatTypeValueError;
  var BeatsValueError = Fermata.Error.BeatsValueError;


  describe("Fermata.Data.Measure", function () {
    describe("#initBeat", function () {
      it("basic value", function () {
        // Given 
        var beats = 4;
        var beatType = 4;
        var data = {};
        var measure = new Measure(data);

        // When
        measure.initBeat(beats, beatType);

        // Then
        assert.strictEqual(data.attributes.time.beats, beats);
        assert.strictEqual(data.attributes.time["beat-type"], beatType);
      });

      it("bad beats value: string", function () {
        // Given 
        var beats = "badValue";
        var beatType = 4;
        var data = {};
        var measure = new Measure(data);

        // Then
        assert.throws(function () {
          measure.initBeat(beats, beatType);
        },
                BeatsValueError);
      });

      it("bad beats value: negative", function () {
        // Given 
        var beats = -5;
        var beatType = 4;
        var data = {};
        var measure = new Measure(data);

        // Then
        assert.throws(function () {
          measure.initBeat(beats, beatType);
        },
                BeatsValueError);
      });

      it("bad beats value: null", function () {
        // Given 
        var beats = 0;
        var beatType = 4;
        var data = {};
        var measure = new Measure(data);

        // Then
        assert.throws(function () {
          measure.initBeat(beats, beatType);
        },
                BeatsValueError);
      });

      it("bad beats value: float", function () {
        // Given 
        var beats = 1.8;
        var beatType = 4;
        var data = {};
        var measure = new Measure(data);

        // Then
        assert.throws(function () {
          measure.initBeat(beats, beatType);
        },
                BeatsValueError);
      });

      it("bad beat-type value: non power of 2", function () {
        // Given 
        var beats = 4;
        var beatType = 5;
        var data = {};
        var measure = new Measure(data);

        // Then
        assert.throws(function () {
          measure.initBeat(beats, beatType);
        },
                BeatTypeValueError);
      });
    });
  });
}).call(this);
