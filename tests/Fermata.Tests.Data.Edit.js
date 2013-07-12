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
  describe('Fermata.Data.Edit', function () {
    var helloWorld;
    beforeEach(function (done) {
      Fermata.Tests.Utils.LoadJSONFixture('hello-world.min.json', function (fixture) {
        helloWorld = fixture;
        done();
      });
    });

    describe('addPart()', function () {
      var fermataData = new Fermata.Data();
      var instrument = {'instrument-name': 'Piano'};
      var len;
      var next_len;
      var _score = fermataData.score['score-partwise'];

      beforeEach(function () {
        if (_score.hasOwnProperty('part-list') &&
                _score['part-list'].hasOwnProperty('score-part') &&
                _score['part-list']['score-part'] !== null) {
          len = fermataData.score['score-partwise']['part-list']['score-part'].length;
        } else {
          len = 0;
        }
        ;
        next_len = len + 1;
      });

      it('should add 1 part to an empty score', function () {
        fermataData.addPart(instrument);

        assert.equal(next_len, fermataData.score['score-partwise']['part-list']['score-part'].length);
        assert.equal('P' +
                next_len, fermataData.score['score-partwise']['part-list']['score-part'][len]['$id']);
        assert.equal('P' +
                next_len, fermataData.score['score-partwise']['part'][len]['$id']);
        assert.equal(instrument['instrument-name'], fermataData.score['score-partwise']['part-list']['score-part'][len]['part-name']);
        assert.equal(instrument['instrument-name'], fermataData.score['score-partwise']['part-list']['score-part'][len]['score-instrument']['instrument-name']);
      });

      it('should add 1 part with a piano instrument and the default id', function () {
        fermataData.addPart(instrument);
        assert.equal(next_len, fermataData.score['score-partwise']['part-list']['score-part'].length);
        assert.equal('P' +
                next_len, fermataData.score['score-partwise']['part-list']['score-part'][len]['$id']);
        assert.equal('P' +
                next_len, fermataData.score['score-partwise']['part'][len]['$id']);
        assert.equal(instrument['instrument-name'], fermataData.score['score-partwise']['part-list']['score-part'][len]['part-name']);
        assert.equal(instrument['instrument-name'], fermataData.score['score-partwise']['part-list']['score-part'][len]['score-instrument']['instrument-name']);
      });
    });
    
    var checkMeasureNumbers = function (measures) {
      for (var i = 0 ; i < measures.length ; i++) {
        var measure = measures[i];
        
        assert.equal(measure.$number, (i + 1).toString());
      }
    };

    describe('addMeasure()', function () {
      var fermataData;
      var fermataEmptyData;
      beforeEach(function () {
        fermataData = new Fermata.Data(helloWorld);
      });

      it('should add 1 measure in an empty part', function () {
        var part;

        fermataEmptyData = new Fermata.Data();
        fermataEmptyData.addPart({'instrument-name': 'Piano'});
        part = fermataData.getPart(0);
        fermataEmptyData.addMeasure(0);
        assert.equal(1, part.measure.length);
        checkMeasureNumbers(part.measure);
      });

      it('should add 1 measure at the end', function () {
        var part = fermataData.getPart(0), length = part.measure.length;
        fermataData.addMeasure(length);
        assert.equal(length + 1, part.measure.length);
        checkMeasureNumbers(part.measure);
      });

      it('should add 42 measure at the end', function () {
        var part = fermataData.getPart(0), length = part.measure.length;
        fermataData.addMeasure(length, 42);
        assert.equal(length + 42, part.measure.length);
        checkMeasureNumbers(part.measure);
      });

      it('should set a barline on the last measure', function () {
        var part = fermataData.getPart(0), length = part.measure.length;
        fermataData.addMeasure(length, 42);
        assert.equal(part.measure[part.measure.length -
                1].barline.$location, 'right');
        assert.equal(part.measure[part.measure.length -
                1].barline['bar-style'], 'light-heavy');
        checkMeasureNumbers(part.measure);
      });

      it('should add 1 measure at the beginning', function () {
        var part = fermataData.getPart(0), length = part.measure.length;
        fermataData.addMeasure(0, 1);
        assert.equal(length + 1, part.measure.length);
        assert.equal(part.measure[0].barline, undefined);
        checkMeasureNumbers(part.measure);
      });
    });

    describe('removeMeasure()', function () {
      var fermataData;
      beforeEach(function () {
        fermataData = new Fermata.Data(helloWorld);
      });

      it('should add 42 measure at the end and remove 24 of them', function () {
        var part = fermataData.getPart(0), length = part.measure.length;
        fermataData.addMeasure(length, 42);
        assert.equal(length + 42, part.measure.length);
        fermataData.removeMeasure(10, 24);
        assert.equal(length + 42 - 24, part.measure.length);
        checkMeasureNumbers(part.measure);
      });
    });
  });
}).call(this);
