(function () {
  "use strict";
  Fermata.Error.NotImplementedError = function (message) {
    this.name = "NotImplementedError";
    this.message = message || "This feature in not yet implemented";
  };

  var NotImplementedError = Fermata.Error.NotImplementedError;

  NotImplementedError.prototype = Error.prototype;
}).call(this);
