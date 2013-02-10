(function () {
  "use strict";

  Fermata.Render.prototype.HarmonyType =
    {
      EXPLICIT: "explicit",
      IMPLIED: "implied",
      ALTERNATE: "alternate"
    };

  Fermata.Render.prototype.renderHarmony = function (harmony)
  {
    var HarmonyType = this.getHarmonyType(harmony);

    var processes = [
      {
        val: this.HarmonyType.EXPLICIT,
        func: function () {
          this.renderExplicitHarmony();
        }
      },
      {
        val: this.HarmonyType.IMPLIED,
        func: function () {
          this.renderImpliedHarmony();
        }
      },
      {
        val: this.HarmonyType.ALTERNATE,
        func: function () {
          this.renderAlternateHarmony();
        }
      }
    ];

    //TODO All.
  };

  Fermata.Render.prototype.getHarmonyType = function (harmony)
  {
  };

  Fermata.Render.prototype.renderExplicitHarmony = function (explicitHarmony)
  {
    //TODO: implement
  };

  Fermata.Render.prototype.renderImpliedHarmony = function (impliedHarmony)
  {
    //TODO: implement
  };

  Fermata.Render.prototype.renderAlternateHarmony = function (alternateHarmony)
  {
    //TODO: implement
  };

}).call(this);
