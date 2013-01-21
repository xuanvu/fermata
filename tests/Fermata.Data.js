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
}

describe('Fermata.Data', function () {
  describe('Constructor', function () {
    it('should init an empty partition', function () {
      var fermataData = new Fermata.Data();
      assert.equal(fermataData['score']['score-partwise'].$version, '3.0');
    });
  });
});