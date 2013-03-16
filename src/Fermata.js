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
  window.Fermata = {};
  if (this === module)
  {
    console.log("node");
  }
  else if (this === window)
  {
    console.log("browser");
  }
}
//var Fermata = Fermata || {};
Fermata.Vex = Vex;
