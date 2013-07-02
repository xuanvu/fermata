(function () {
  "use strict";
  
  Fermata.Data.prototype.addPart = function (instrument, id) {
    if (id === undefined || id === null) {
      if (this.score['score-partwise']['part-list']['score-part'] === undefined) {
        id = 'P1';
      } else {
        id = 'P' + this.score['score-partwise']['part-list']['score-part'].length;
      }
    }
    var new_part_info = {
      '$id': id, 
      'part-name': instrument['instrument-name'], 
      'score-instrument': {'instrument-name': instrument['instrument-name']}
    };
    var new_part = {
      '$id': id,
      'measure': null
    };

    this.score['score-partwise']['part-list'].push(new_part_info);
    this.score['score-partwise'].part.push(new_part);
  };

  Fermata.Data.prototype.updateMeasureNumber = function () {
    this.forEachPart(function (part) {
      for (var i = 0 ; i < part.measure.length ; i++) {
        part.measure[i].$number = (i + 1).toString();
      }
    });
  };

  Fermata.Data.prototype.addMeasure = function (idx, number) {
    if (number === undefined) {
      number = 1;
    }

    this.forEachPart(function (part) {
      if (idx > part.measure.length) {
        idx = part.measure.length;
      }

      for (var i = 0 ; i < number ; i++) {
        part.measure.splice(idx, 0, {'$number': idx + number, 'note': [] });
        Fermata.Data.prototype.fillWithRest(part, idx);
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
    });
  };
}).call(this);
