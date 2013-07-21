(function () {
  "use strict";

  Fermata.Utils = {};
  
  Fermata.Utils.isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  Fermata.Utils.Clone = function (obj) {
    var newObj = (Object.prototype.toString.call(obj) ===
            '[object Array]') ? [] : {};
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

  Fermata.Utils.CloneEpure$fermata = function (obj) {
    var newObj = (Object.prototype.toString.call(obj) ===
            '[object Array]') ? [] : {};
    for (var i in obj) {
      if (obj.hasOwnProperty(i) &&
              i !== "$fermata") {
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
    return ({first: 0, last: obj.length - 1});
  };

  Fermata.Utils.minusToCamelCase = function (str) {
    return str.replace(/-([a-z])/g, camelCaseHandler);
  };

  var camelCaseHandler = function (c) {
    return c[1].toUpperCase();
  };

}).call(this);
