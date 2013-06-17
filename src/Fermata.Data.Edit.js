(function () {
  "use strict";
  
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
