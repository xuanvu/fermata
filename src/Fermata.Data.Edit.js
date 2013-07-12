(function () {
  "use strict";

  var Utils = Fermata.Utils;

  Fermata.Data.prototype.addPart = function (instrument, id) {
    var _score = this.score['score-partwise'];
    if (id === undefined || id === null) {
      if (_score.hasOwnProperty('part-list') &&
              _score['part-list'].hasOwnProperty('score-part') &&
              _score['part-list']['score-part'] !== null) {
        id = 'P' +
                (this.score['score-partwise']['part-list']['score-part'].length +
                        1);
      } else {
        this.score['score-partwise']['part-list']['score-part'] = [];
        this.score['score-partwise'].part = [];
        id = 'P1';
      }
    }
    var new_part_info = {
      '$id': id,
      'part-name': instrument['instrument-name'],
      'score-instrument': {'instrument-name': instrument['instrument-name']}
    };
    var new_part = {
      '$id': id,
      'measure': []
    };
    this.score['score-partwise']['part-list']['score-part'].push(new_part_info);
    this.score['score-partwise'].part.push(new_part);
  };

  Fermata.Data.prototype.updateMeasureNumber = function () {
    this.forEachPart(function (part) {
      for (var i = 0; i < part.measure.length; i++) {
        part.measure[i].$number = (i + 1).toString();
      }
    });
  };

  var defaultMeasure = {
    $number: "1",
    note: [],
    $fermata: {
      attributes: {
        divisions: "1",
        key: {
          "fifths": "0"
        },
        time: {
          beats: 4,
          "beat-type": 4
        },
        clef: [
          {
            sign: "G",
            line: "2"
          }
        ],
        "part-symbol": {
          "top-staff": 1,
          "bottom-staff": 2,
          symbol: 'brace'
        }
      }
    }
  };

  Fermata.Data.prototype.addMeasure = function (idx, number) {
    if (number === undefined) {
      number = 1;
    }

    this.forEachPart(function (part) {
      if (!part.hasOwnProperty('measure') || part.measure === null ||
              part.measure === undefined) {
        part.measure = [Utils.Clone(defaultMeasure)];
      }

      if (idx > part.measure.length) {
        idx = part.measure.length;
      }
// <<<<<<< HEAD

      var baseAttributes;
      if (part.measure.length === 0) {
        baseAttributes = defaultMeasure;
      } else if (idx === 0) {
        baseAttributes = part.measure[0].$fermata.attributes;
      } else {
        baseAttributes = part.measure[idx - 1].$fermata.attributes;
      }
      for (var i = 0; i < number; i++) {
        var measure = {
          '$number': (idx + i + 1).toString(),
          'note': [],
          $fermata: {
            attributes: Utils.Clone(baseAttributes)
          }
        };

        part.measure.splice(idx + i + 1, 0, measure);
// =======
//       var i = 0;
//       for (i = 0 ; i < number ; i++) {
//         part.measure.splice(idx + i, 0, {'$number': (idx + i + 1).toString(), 'note': [] });
// >>>>>>> 2e6a76eb1ec40a291d292a0bcacbda7fd36a1d01
        Fermata.Data.prototype.fillWithRest(part, idx);
      }
      for (i = number + idx ; i < part.measure.length ; i++) {
        part.measure[i].$number = (1 + i).toString();
      }

      if (idx + i >= part.measure.length) {
        part.measure[part.measure.length - 1].barline = {
          'bar-style': 'light-heavy',
          '$location': 'right'
        };
      }
    });
  };

  Fermata.Data.prototype.moveMeasure = function (idxFrom, idxDest) {
    if (idxDest > idxFrom) {
      idxDest--;
    }
    this.forEachPart(function (part) {
      var measure = part.measure[idxFrom];
      part.measure.splice(idxFrom, 1);
      part.measure.splice(idxDest, 0, measure);
    });
  };

  Fermata.Data.prototype.removeMeasure = function (idx, number) {
    if (number === undefined) {
      number = 1;
    }

    this.forEachPart(function (part) {
      if (idx >= 0 && idx < part.measure.length) {
        part.measure.splice(idx, number);
      }

      for (var i = idx; i < part.measure.length; i++) {
        part.measure[i].$number = (i + 1).toString();
      }
    });
  };
}).call(this);
