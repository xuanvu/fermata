(function () {
	"use strict";

  Fermata.Utils.AttributeDiff = function (attr1, attr2) {
    this.attr1 = attr1;
    this.attr2 = attr2;
    this.delta = jsondiffpatch.diff(attr1, attr2);
  };
  
  var AttributeDiff = Fermata.Utils.AttributeDiff;
  
  

}).call(this);
