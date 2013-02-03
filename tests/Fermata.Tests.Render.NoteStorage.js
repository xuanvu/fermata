/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

if (typeof require !== 'undefined') {
  var Fermata,
  fs = require('fs'),
  assert = require('assert');

  // Use Scons build version or devel version (using node vm)
  if (fs.existsSync(__dirname + '/../build/fermata/fermata.node.js')) {
    Fermata = require('..');
  }
  else {
    Fermata = require((process.env['FERMATA_COV'] ? '../src-cov' : '../src') + '/Fermata.Dev.Node.js');
  }

  // Test utils
  Fermata.Tests = require('./Fermata.Tests.Utils.js').Tests;
}

(function(){
  var NoteStorage = Fermata.Render.NoteStorage;
  
  //var assert = require("assert");
  describe("Fermata.Render.NoteStorage", function () {
    describe("#constructor", function (){
      it("test of the constructor", function (){
        var noteStorage = new NoteStorage();
      });
    });
  });
  
}).call(this);
