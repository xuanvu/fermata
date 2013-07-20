(function () {
  "use strict";

  var Utils = Fermata.Utils;

  var Data = Fermata.Data;

  Data.prototype.export = function () {
    this.saveAttributes();

    var $fermataList = [];
    this.remove$fermata($fermataList);
    var exportData = Utils.Clone(this.score);
    this.restore$fermata($fermataList);
    
    removeCamelCaseKeys(exportData);
    return exportData;
  };

  Data.prototype.remove$fermata = function ($fermataList) {
    this.forEachMeasure(function (measure) {
      if (typeof measure.$fermata !== "undefined") {
        $fermataList.push(measure.$fermata);
        delete measure.$fermata;
      } else {
        $fermataList.push(null);
      }
    });
  };

  Data.prototype.restore$fermata = function ($fermataList) {
    var fermataIdx = 0;

    this.forEachMeasure(function (measure) {
      var $fermata = $fermataList[fermataIdx];

      if ($fermata !== null) {
        measure.$fermata = $fermata;
      }
      fermataIdx++;
    });
  };

  var removeCamelCaseKeys = function (exportData) {
    var scoreParts = exportData["score-partwise"]["part-list"]["score-part"];
    for (var i = 0; i < scoreParts.length; i++) {
      var scorePart = scoreParts[i];

      for (var key in scorePart) {
        var camelCaseKey = Utils.minusToCamelCase(key);
        if (camelCaseKey !== key &&
                scorePart[camelCaseKey] !== "undefined") {
          delete scorePart[camelCaseKey];
        }
      }
    }
  };
}).call(this);
