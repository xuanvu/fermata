/**
 * @preserve
 * Fermata __FERMATA_VERSION__
 *
 * Build ID: __FERMATA_BUILD_PREFIX__@__FERMATA_GIT_SHA1__
 * Build date: __FERMATA_BUILD_DATE__
 *
 */

if (typeof Fermata === "undefined")
{
  this.Fermata = {};
  if (typeof module !== "undefined" && module === this)
  {
    console.log("node");
  }
  else if (typeof window !== "undefined" && this === window)
  {
    console.log("browser");
  }
}
//var Fermata = Fermata || {};
Fermata.Vex = Vex;
