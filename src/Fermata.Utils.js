(function () {
  "use strict";

  Fermata.Utils = {};
  
  var Utils = Fermata.Utils;
  
  Utils.isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  Utils.Clone = function (obj) {
    var newObj = (Utils.isArray(obj)) ? [] : {};
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

  Utils.CloneEpure$fermata = function (obj) {
    var newObj = (Utils.isArray(obj)) ? [] : {};
    for (var i in obj) {
      if (obj.hasOwnProperty(i) &&
              i !== "$fermata") {
        if (obj[i] && typeof obj[i] === "object") {
          newObj[i] = Fermata.Utils.CloneEpure$fermata(obj[i]);
        }
        else {
          newObj[i] = obj[i];
        }
      }
    }
    return newObj;
  };

  // Delete ?
  Utils.FirstLast = function (obj)
  {
    return ({first: 0, last: obj.length - 1});
  };

  Utils.minusToCamelCase = function (str) {
    return str.replace(/-([a-z])/g, camelCaseHandler);
  };

  var camelCaseHandler = function (c) {
    return c[1].toUpperCase();
  };

}).call(this);
