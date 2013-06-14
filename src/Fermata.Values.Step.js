(function () {
  "use strict";

  Fermata.Values.Step = {};
  var Step = Fermata.Values.Step;

  Step.values = ["A", "B", "C", "D", "E", "F", "G"];
  Step.idx = {};
  Step.check = function (step) {
    return step in Step.idx;
  };

  var fillIdx = function (values, idx) {
    for (var i = 0; i < values.length; i++) {
      var value = values[i];

      idx[value] = i;
    }
  };

  fillIdx(Step.values, Step.idx);
}).call(this);
