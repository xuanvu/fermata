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

describe('Fermata.Data', function () {
  var helloWorld;
  beforeEach(function (done) {
    Fermata.Tests.Utils.LoadJSONFixture('hello-world.min.json', function (fixture) {
      helloWorld = fixture;
      done();
    });
  });

  describe('()', function () {
    it('should init an empty score', function () {
      var fermataData = new Fermata.Data();
      assert.equal(fermataData['score']['score-partwise'].$version, '3.0');
    });

    it('should init with an existant score', function (done) {
      var fermataData = new Fermata.Data(helloWorld);
      assert.equal(helloWorld['score-partwise'].$version, fermataData.score['score-partwise'].$version);
      done();
    });
  });

  describe('getScorePartWise()', function () {
    it('should return score-partwise from a cloned object', function (done) {
      var fermataData = new Fermata.Data(helloWorld);
      assert.notEqual(fermataData.getScorePartWise(), helloWorld['score-partwise']);
      assert.equal(fermataData.getScorePartWise().$version, helloWorld['score-partwise'].$version);
      done();
    });
  });

  // describe('cacheParts()', function () {
  //   it('');
  // });
});