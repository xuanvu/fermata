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
    });
  });
}).call(this);
