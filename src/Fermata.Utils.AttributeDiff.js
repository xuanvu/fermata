(function () {
	"use strict";

  Fermata.Utils.AttributeDiff = function (attr1, attr2) {
    this.attr1 = attr1;
    this.attr2 = attr2;
    this.diffPlus = {};
    this.diffLess = {};
  };
  
  var AttributeDiff = Fermata.Utils.AttributeDiff;
  
  AttributeDiff.getPlus = function () {
    return this.diffPlus;
  };
  
  AttributeDiff.getLess = function () {
    return this.diffLess;
  };

}).call(this);
