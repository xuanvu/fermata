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

describe('Fermata.Drawer', function () {
  var helloWorld, container;

  beforeEach(function (done) {
    container = Fermata.Tests.Utils.CreateCanvas('#hello-world');

    Fermata.Tests.Utils.LoadJSONFixture('hello-world.min.json', function (fixture) {
      helloWorld = fixture;
      done();
    });
  });

  describe('()', function () {
    it('sould create Vex.Flow.Renderer and get ctx', function () {
      var fermataData = new Fermata.Data(helloWorld);
      var fermataRender = new Fermata.Render(fermataData);
      fermataRender.renderAll();

      var fermataDrawer = new Fermata.Drawer(fermataData, container);
      assert.ok(fermataDrawer.renderer instanceof Fermata.Vex.Flow.Renderer);
      assert.ok(typeof module !== 'undefined' ? fermataDrawer.ctx.canvas instanceof Canvas : fermataDrawer.ctx instanceof Vex.Flow.RaphaelContext);
    });
  });

  describe('drawAll()', function () {
    it('sould display hello world (no assert)', function () {
      var fermataData = new Fermata.Data(helloWorld);
      var fermataRender = new Fermata.Render(fermataData);
      fermataRender.renderAll();

      var fermataDrawer = new Fermata.Drawer(fermataData, container);
      fermataDrawer.drawAll();
    });
  });
});