(function () {
  "use strict";

  Fermata.Utils.epureAttributes = function (attr) {
    epureAttributesObj(attr);
  };

  var epureAttributesObj = function (obj) {
    for (var key in obj) {
      epureAttributesObjProcess(obj, key);
    }
  };

  var epureAttributesObjProcess = function (parent, key) {
    var elem = parent[key];
    if (elem === null || typeof elem === "undefined") {
      delete parent[key];
    } else {
      processCommon(parent, key);
    }
  };

  var epureAttributesArray = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      epureAttributesArrayProcess(arr, i);
    }
  };

  var epureAttributesArrayProcess = function (parent, idx) {
    processCommon(parent, idx);
  };

  var processCommon = function (parent, key) {
    var elem = parent[key];

    if (typeof elem === "number") {
      parent[key] = elem.toString();
    } else if (isArray(elem)) {
      epureAttributesArray(elem);
    } else if (isObject(elem)) {
      epureAttributesObj(elem);
    }
  };

  var isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  var isObject = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  };

}).call(this);
