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

describe('Fermata.Data.Edit', function () {
  var helloWorld;
  beforeEach(function (done) {
    Fermata.Tests.Utils.LoadJSONFixture('hello-world.min.json', function (fixture) {
      helloWorld = fixture;
      done();
    });
  });

  describe('addMeasure()', function () {
    var fermataData;
    beforeEach(function () {
      fermataData = new Fermata.Data(helloWorld);
    });

    it('should add 1 measure at the end', function () {
      var part = fermataData.getPart(0), length = part.measure.length;
      fermataData.addMeasure(length);
      assert.equal(length + 1, part.measure.length);
    });

    it('should add 42 measure at the end', function () {
      var part = fermataData.getPart(0), length = part.measure.length;
      fermataData.addMeasure(length, 42);
      assert.equal(length + 42, part.measure.length);
    });

    it('should set a barline on the last measure', function () {
      var part = fermataData.getPart(0), length = part.measure.length;
      fermataData.addMeasure(length, 42);
      assert.equal(part.measure[part.measure.length - 1].barline.$location, 'right');
      assert.equal(part.measure[part.measure.length - 1].barline['bar-style'], 'light-heavy');
    });

    it('should add 1 measure at the beginning', function () {
      var part = fermataData.getPart(0), length = part.measure.length;
      fermataData.addMeasure(0, 1);
      assert.equal(length + 1, part.measure.length);
      assert.equal(part.measure[0].barline, undefined);
    });
  });
});