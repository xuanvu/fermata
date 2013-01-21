var Fermata = Fermata || {};

(function () {
	"use strict";
	
  Fermata.Utils = {};
  Fermata.Utils.Clone = function(obj) {
    var newObj = (obj instanceof Array) ? [] : {};
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        if (obj[i] && typeof obj[i] == "object") {
          newObj[i] = Fermata.Utils.Clone(obj[i]);
        }
        else {
          newObj[i] = obj[i];
        }
      }
    }
    return newObj;
  };

}).call(this);