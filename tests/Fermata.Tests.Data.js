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

  var Utils = Fermata.Utils;

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

      it('should init with an existant score', function () {
        var fermataData = new Fermata.Data(helloWorld);
        assert.equal(helloWorld['score-partwise'].$version, fermataData.score['score-partwise'].$version);
      });
    });

    describe('getScorePartWise()', function () {
      it('should return score-partwise from a cloned object', function () {
        var fermataData = new Fermata.Data(helloWorld);
        assert.notEqual(fermataData.getScorePartWise(), helloWorld['score-partwise']);
        assert.equal(fermataData.getScorePartWise().$version, helloWorld['score-partwise'].$version);
      });
    });

    describe('cacheParts()', function () {
      var fermataData;
      beforeEach(function () {
        fermataData = new Fermata.Data(helloWorld);
        fermataData.cacheParts();
      });

      it('should cache by measure idx', function () {
        assert.equal(fermataData.scoreCache.part.idx[0].name, helloWorld['score-partwise']['part-list']['score-part'][0]['part-name']);
      });

      it('should cache by measure name', function () {
        var measure = helloWorld['score-partwise']['part-list']['score-part'][0];
        assert.equal(fermataData.scoreCache.part.name[measure['part-name']].id, measure.$id);
      });

      it('should cache by measure id', function () {
        var measure = helloWorld['score-partwise']['part-list']['score-part'][0];
        assert.equal(fermataData.scoreCache.part.id[measure.$id].name, measure['part-name']);
      });

      it('should have cached the first measure', function () {
        assert.equal(fermataData.scoreCache.part.idx[0].measure[0].$number, helloWorld['score-partwise'].part[0].measure[0].$number);
      });
    });

    describe('getParts()', function () {
      var fermataData;
      beforeEach(function () {
        fermataData = new Fermata.Data(helloWorld);
      });

      it('should cache parts on first call', function () {
        assert.equal(fermataData.scoreCache.part, null);
        fermataData.getParts();
        assert.equal(fermataData.scoreCache.part.idx.length, 1);
      });

      it('should return parts', function () {
        var parts = fermataData.getParts();
        assert.equal(parts.idx.length, 1);
      });
    });

    describe('getPart()', function () {
      var fermataData;
      beforeEach(function () {
        fermataData = new Fermata.Data(helloWorld);
      });

      it('should cache parts on first call', function () {
        assert.equal(fermataData.scoreCache.part, null);
        fermataData.getParts();
        assert.equal(fermataData.scoreCache.part.idx.length, 1);
      });

      it('should return undefined on unknow part', function () {
        assert.equal(fermataData.getPart(42, Fermata.Data.cacheParts.ID), undefined);
        assert.equal(fermataData.getPart('Piano', Fermata.Data.cacheParts.NAME), undefined);
        assert.equal(fermataData.getPart(1), undefined);
      });

      it('should return part with idx = 0 and type = Fermata.Data.cacheParts.IDX', function () {
        assert.equal(fermataData.getPart(0, Fermata.Data.cacheParts.IDX).name, helloWorld['score-partwise']['part-list']['score-part'][0]['part-name']);
      });

      it('should return part with idx = 0 and guessing type', function () {
        assert.equal(fermataData.getPart(0).name, helloWorld['score-partwise']['part-list']['score-part'][0]['part-name']);
      });

      it('should return part with id = P1 and type = Fermata.Data.cacheParts.ID', function () {
        assert.equal(fermataData.getPart('P1', Fermata.Data.cacheParts.ID).name, helloWorld['score-partwise']['part-list']['score-part'][0]['part-name']);
      });

      it('should return part with id = P1 and guessing type', function () {
        assert.equal(fermataData.getPart('P1').name, helloWorld['score-partwise']['part-list']['score-part'][0]['part-name']);
      });

      it('should return part with name = Music and type = Fermata.Data.cacheParts.NAME', function () {
        assert.equal(fermataData.getPart('Music', Fermata.Data.cacheParts.NAME).id, helloWorld['score-partwise']['part-list']['score-part'][0].$id);
      });

      it('should return part with name = Music and guessing type', function () {
        assert.equal(fermataData.getPart('Music').id, helloWorld['score-partwise']['part-list']['score-part'][0].$id);
      });
    });

    describe('forEachPart()', function () {
      var fermataData;
      beforeEach(function () {
        fermataData = new Fermata.Data(helloWorld);
      });

      it('should call callback for each part', function (done) {
        var remaining = fermataData.getParts().idx.length;

        fermataData.forEachPart(function (part, i) {
          assert.equal(part, fermataData.getParts().idx[i]);
          if (--remaining <= 0) {
            done();
          }
        });
      });
    });

    describe('setBeat()', function () {
      var fermataData;
      beforeEach(function () {
        fermataData = new Fermata.Data(helloWorld);
      });

      it('should set the beat of each part with the one passed at the measure passed', function () {
        var measure_idx = 0;
        var beat = 5;

        fermataData.setBeat(measure_idx, beat);
        for (var i = 0, len = fermataData.score['score-partwise'].part.length; i <
                len; i++) {
          assert.equal(beat, fermataData.score['score-partwise'].part[i].measure[measure_idx].$fermata.attributes.time.beats);
        }
      });
    });

    describe('setBeatType()', function () {
      var fermataData;
      beforeEach(function () {
        fermataData = new Fermata.Data(helloWorld);
      });

      it('should set the beat type of each part with the one passed at the measure passed', function () {
        var measure_idx = 0;
        var beatType = 2;

        fermataData.setBeatType(measure_idx, beatType);
        for (var i = 0, len = fermataData.score['score-partwise'].part.length; i <
                len; i++) {
          assert.equal(beatType, fermataData.score['score-partwise'].part[i].measure[measure_idx].$fermata.attributes.time['beat-type']);
        }
      });
    });

    describe('setFifths()', function () {
      var fermataData;
      beforeEach(function () {
        fermataData = new Fermata.Data(helloWorld);
      });

      it('should set the fifths of each part with the one passed at the measure passed', function () {
        var measure_idx = 0;
        var fifths = 0;

        fermataData.setFifths(measure_idx, fifths);
        for (var i = 0, len = fermataData.score['score-partwise'].part.length; i <
                len; i++) {
          assert.equal(fifths, fermataData.score['score-partwise'].part[i].measure[measure_idx].attributes[0].key.fifths);
        }
      });
    });

    describe('setTitle()', function () {
      var fermataData;
      beforeEach(function () {
        fermataData = new Fermata.Data(helloWorld);
      });

      it('should set the title of the score', function () {
        var title = 'Test title';

        fermataData.setTitle(title);
        assert.equal(title, fermataData.score['score-partwise']['movement-title']);
      });
    });


    describe('#saveAttributes', function () {
      var fermataData;
      beforeEach(function () {
        fermataData = new Fermata.Data(helloWorld);
      });

      it('hello world', function () {
        // Given
        var expectedAttributes = [];
        var actualAttributes = [];
        extractAttributes(fermataData.getParts().idx, expectedAttributes);
        
        // When
        fermataData.saveAttributes();

        // Then
        extractAttributes(fermataData.getParts().idx, actualAttributes);
        assert.deepEqual(actualAttributes, expectedAttributes);
      });

      var extractAttributes = function (parts, dest) {
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          var attributesTab = [];
          dest.push(attributesTab);
          var measures = part.measure;
          for (var j = 0; j < measures.length; j++) {
            var measure = measures[j];
            if (typeof measure.attributes !== "undefined") {
              attributesTab.push(Utils.Clone(measure.attributes[0]));
            } else {
              attributesTab.push(null);
            }
          }
        }
      };
    });
  });
}).call(this);
