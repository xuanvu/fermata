(function () {
  "use strict";

  Fermata.Render = function (data) {
    this.data = data;
    this.parts = this.data.getParts();
  };
}).call(this);
