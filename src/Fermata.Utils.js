(function () {
	"use strict";
	
  Fermata.Utils = {};
  Fermata.Utils.Clone = function (obj) {
    var newObj = (Object.prototype.toString.call(obj) === '[object Array]') ? [] : {};
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        if (obj[i] && typeof obj[i] === "object") {
          newObj[i] = Fermata.Utils.Clone(obj[i]);
        }
        else {
          newObj[i] = obj[i];
        }
      }
    }
    return newObj;
  };

  // Delete ?
  Fermata.Utils.FirstLast = function (obj)
  {
    return ({ first: 0, last: obj.length - 1 });
  };

}).call(this);
