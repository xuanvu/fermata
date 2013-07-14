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

describe('Fermata.Data.Width', function (){
  var score;

  beforeEach(function (done) {
    Fermata.Tests.Utils.LoadJSONFixture('new-partition.min.json', function (fixture) {
      score = fixture;
      done();
    });
  });

  describe('without width setted and voice indicated', function() {
    var fermataData;

    beforeEach(function (done) {
      fermataData = new Fermata.Data(score);
      done();
    });

    it('first Measure sould have a width bigger than 40', function (){
      var _render = new Fermata.Render(fermataData);
      _render.renderAll();

      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[0].$width) !== 'undefined');
      assert.ok(fermataData['score']['score-partwise']['part'][0].measure[0].$width > 40);
    });

    it ('first Measure should be larger than second one', function () {
      var _render = new Fermata.Render(fermataData);
      _render.renderAll();

      assert.ok(fermataData['score']['score-partwise']['part'][0].measure[0].$width !== 'undefined');
      assert.ok(fermataData['score']['score-partwise']['part'][0].measure[0].$width > fermataData['score']['score-partwise']['part'][0].measure[1].$width);
    });
  });
});