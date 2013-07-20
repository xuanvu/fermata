(function () {
  "use strict";

  var Utils = Fermata.Utils;

  Data = Fermata.Data;

  Data.prototype.export = function () {
    this.saveAttributes();

    var $fermataList = [];
    this.remove$fermata($fermataList);
    var exportData = Utils.Clone(this.score);
    this.restore$fermata($fermataList);

    return exportData;
  };

  Data.prototype.remove$fermata = function ($fermataList) {
    var parts = this.getParts.idx;
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      var measures = part.measure;

      for (var j = 0; j < measure.length; i++) {
        var measure = measures[j];

        if (typeof measure.$fermata !== "undefined") {
          $fermataList.push(measure.$fermata);
          delete measure.$fermata;
        } else {
          $fermataList.push(null);
        }
      }
    }
  };

  Data.prototype.restore$fermata = function ($fermataList) {
    var fermataIdx = 0;
    var parts = this.getParts.idx;
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      var measures = part.measure;

      for (var j = 0; j < measure.length; i++) {
        var measure = measures[j];
        var $fermata = $fermataList[fermataIdx];

        if ($fermata !== null) {
          measure.$fermata = $fermata;
        }
        fermataIdx++;
      }
    }
  };

}).call(this);
