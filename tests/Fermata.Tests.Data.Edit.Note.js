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

  describe('Note insertion in full of rest measure in 4/4', function() {
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

    it('should add a half and a eight in first measure', function () {
      // Given
      var part = fermataData['score']['score-partwise']['part'][0];
      var measure = part.measure[0];
      var notes = measure.note;

      // When
      fermataData.addNote(0, 0, 0, 3, 1, 1);
      fermataData.addNote(0, 0, 0, 3, 2, 1);
      fermataData.addNote(0, 0, 0, 3, 3, 1);
      fermataData.addNote(0, 0, 0, 3, 3, 1);
      _render.renderAll();

      // Then
      assert.equal(measure.note.length, 4);
      assert.equal(measure.$fermata.attributes.divisions, 2);
      assert.equal(notes[0].duration, 4);
      assert.equal(notes[0].duration, 2);
      assert.equal(notes[0].duration, 1);
      assert.equal(notes[0].duration, 1);
    });

    it('should add one half in first measure', function () {
      fermataData.addNote(0, 0, 0, 3, 1, 1);

      _render.renderAll();
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure.length, 10);
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure[0].note.length, 3);
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[0].note[1].rest) !== 'undefined');
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[0].note[2].rest) !== 'undefined');
    });

    it('should add two half in first measure', function () {
      fermataData.addNote(0, 0, 0, 3, 1, 1);
      fermataData.addNote(0, 0, 0, 3, 1, 1);

      _render.renderAll();
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure.length, 10);
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure[0].note.length, 2);
    });

    it('should add one half and one quarter in first measure', function () {
      fermataData.addNote(0, 0, 0, 3, 1, 1);
      fermataData.addNote(0, 0, 1, 3, 2, 1);

      _render.renderAll();
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure.length, 10);
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure[0].note.length, 3);
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[0].note[1].rest) === 'undefined');
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[0].note[2].rest) !== 'undefined');
    });

    it('should add one half and two quarter in first measure', function () {
      fermataData.addNote(0, 0, 0, 3, 1, 1);
      fermataData.addNote(0, 0, 0, 3, 2, 1);
      fermataData.addNote(0, 0, 0, 3, 2, 1);

      _render.renderAll();
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure.length, 10);
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure[0].note.length, 3);
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[0].note[0].rest) === 'undefined');
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[0].note[1].rest) === 'undefined');
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[0].note[2].rest) === 'undefined');
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

    it('should add one half, one quarter, one eigth in first measure', function () {
      fermataData.addNote(0, 0, 0, 3, 1, 1);
      fermataData.addNote(0, 0, 0, 3, 2, 1);
      fermataData.addNote(0, 0, 0, 3, 3, 1);
      
      _render.renderAll();
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure.length, 10);
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure[0].note.length, 4);
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[0].note[3].rest) !== 'undefined');
    });

    it('should add one eigth', function () {
      fermataData.addNote(0, 0, 0, 3, 3, 1);
      
      _render.renderAll();
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure.length, 10);
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure[0].note.length, 5);
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[0].note[1].rest) !== 'undefined');
    });

    it('should add 8 eigth', function () {
      for (var i = 0; i < 8; i++){
        fermataData.addNote(0, 0, 0, 3, 3, 1);  
      }
      
      _render.renderAll();
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure.length, 10);
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure[0].note.length, 8);
      for (var i = 8; i < 8; i++){
        assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[0].note[i].rest) === 'undefined');
      }
    });
  });

  describe('Note removing in measure of 4/4', function() {
    var fermataData, _render;

    beforeEach(function (done) {
      fermataData = new Fermata.Data(score);
      _render = new Fermata.Render(fermataData);
      _render.renderAll();

      fermataData.addNote(0, 0, 0, 3, 0, 1);
      fermataData.addNote(0, 1, 0, 3, 1, 1);
      fermataData.addNote(0, 1, 0, 3, 1, 1);
      fermataData.addNote(0, 2, 0, 3, 2, 1);
      fermataData.addNote(0, 2, 0, 3, 2, 1);
      fermataData.addNote(0, 2, 0, 3, 2, 1);
      fermataData.addNote(0, 2, 0, 3, 2, 1);
      fermataData.addNote(0, 3, 0, 3, 3, 1);
      fermataData.addNote(0, 3, 0, 3, 3, 1);
      fermataData.addNote(0, 3, 0, 3, 3, 1);
      fermataData.addNote(0, 3, 0, 3, 3, 1);
      fermataData.addNote(0, 3, 0, 3, 3, 1);
      fermataData.addNote(0, 3, 0, 3, 3, 1);
      fermataData.addNote(0, 3, 0, 3, 3, 1);
      fermataData.addNote(0, 3, 0, 3, 3, 1);
      done();
    });

    //remove note IdxS, IdxM, IdxN
    it('should remove a full', function () {
      fermataData.removeNote(0, 0, 0);

      _render.renderAll();
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure.length, 10);
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure[0].note.length, 1);
    });

    it('should remove one half', function () {
      fermataData.removeNote(0, 1, 0);

      _render.renderAll();
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure.length, 10);
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure[1].note.length, 2);
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[1].note[0].rest) !== 'undefined');

    });

    it('should remove two half', function () {
      fermataData.removeNote(0, 1, 0);
      fermataData.removeNote(0, 1, 1);

      _render.renderAll();
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure.length, 10);
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure[1].note.length, 2);
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[1].note[0].rest) !== 'undefined');
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[1].note[1].rest) !== 'undefined');
    });

    it('should remove a quarter', function () {
      fermataData.removeNote(0, 2, 1);

      _render.renderAll();
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure.length, 10);
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure[2].note.length, 4);
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[2].note[1].rest) !== 'undefined');
    });

    it('should remove two quarter', function () {
      fermataData.removeNote(0, 2, 0);
      fermataData.removeNote(0, 2, 2);

      _render.renderAll();
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure.length, 10);
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure[2].note.length, 4);
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[2].note[0].rest) !== 'undefined');
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[2].note[2].rest) !== 'undefined');
    });

    it('should remove 4 eigth', function () {
      fermataData.removeNote(0, 3, 0);
      fermataData.removeNote(0, 3, 2);
      fermataData.removeNote(0, 3, 4);
      fermataData.removeNote(0, 3, 6);

      _render.renderAll();
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure.length, 10);
      assert.equal(fermataData['score']['score-partwise']['part'][0].measure[3].note.length, 8);
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[3].note[0].rest) !== 'undefined');
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[3].note[2].rest) !== 'undefined');
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[3].note[4].rest) !== 'undefined');
      assert.ok(typeof(fermataData['score']['score-partwise']['part'][0].measure[3].note[6].rest) !== 'undefined');
    });
  });
});
