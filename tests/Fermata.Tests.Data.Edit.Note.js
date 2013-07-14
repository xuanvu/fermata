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

describe('Fermata.Data.Edit.Note', function () {
  var score;

  beforeEach(function (done) {
    Fermata.Tests.Utils.LoadJSONFixture('new-partition.min.json', function (fixture) {
      score = fixture;
      done();
    });
  });

  describe('Note interaction in full of rest measure', function() {
    var fermataData, _render;

    beforeEach(function (done) {
      fermataData = new Fermata.Data(score);
      _render = new Fermata.Render(fermataData);
      _render.renderAll();
      done();
    });

    // idxS, idxM, idxN, pitch, type, voice
    it('should add a full in first measure', function () {
      fermataData.addNote(0, 0, 0, 3, 0, 1);

      _render.renderAll();
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure.length, 10);
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure[0].note.length, 1);
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[0].note[0]) !== 'undefined');
    });

    it('should add two half in first measure', function () {
      fermataData.addNote(0, 0, 0, 3, 1, 1);
      fermataData.addNote(0, 0, 0, 3, 1, 1);

      _render.renderAll();
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure.length, 10);
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure[0].note.length, 2);
    });

    it('should add three quarter in first measure', function () {
      fermataData.addNote(0, 0, 0, 3, 2, 1);
      fermataData.addNote(0, 0, 0, 3, 2, 1);
      fermataData.addNote(0, 0, 0, 3, 2, 1);
      
      _render.renderAll();
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure.length, 10);
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure[0].note.length, 4);
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[0].note[3].rest) !== 'undefined');
    });

    it('should add four quarter in first measure', function () {
      fermataData.addNote(0, 0, 0, 3, 2, 1);
      fermataData.addNote(0, 0, 0, 3, 2, 1);
      fermataData.addNote(0, 0, 0, 3, 2, 1);
      fermataData.addNote(0, 0, 0, 3, 2, 1);
      
      _render.renderAll();
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure.length, 10);
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure[0].note.length, 4);
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[0].note[3].rest) === 'undefined');
    });
  });
});
