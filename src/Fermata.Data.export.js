(function () {
  "use strict";

  var Utils = Fermata.Utils;

  var Data = Fermata.Data;

  Data.prototype.export = function () {
    this.saveAttributes();
    var exportData = Utils.CloneEpure$fermata(this.score);
    removeCamelCaseKeys(exportData);
    return exportData;
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
