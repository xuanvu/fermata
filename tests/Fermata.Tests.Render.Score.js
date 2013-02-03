if (typeof require !== 'undefined') {
  var Fermata;
  var fs = require('fs'),
      assert = require('assert'),
      Canvas = require('canvas');

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

describe('Fermata.Render.Score', function () {
  var helloWorld, container;

  beforeEach(function (done) {
    container = Fermata.Tests.Utils.CreateCanvas('canvas.hello-world');

    Fermata.Tests.Utils.LoadJSONFixture('hello-world.min.json', function (fixture) {
      helloWorld = fixture;
      done();
    });
  });

  describe('Fermata.Render.prototype.renderAll()', function () {
    it('should', function () {
      var fermataData = new Fermata.Data(helloWorld);
      var fermataRender = new Fermata.Render(fermataData);
      fermataRender.renderAll();
      assert.ok(typeof(fermataData.getPart(0).measure[0].$fermata) !== 'undefined');
      // Todo: use [0][0] as indexes ?
      assert.ok(fermataData.getPart(0).measure[0].$fermata.vexNotes[1][1][0] instanceof Fermata.Vex.Flow.StaveNote);
    });
  });
});