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
    
    describe("#checkStaff", function () {
      it("existing staff", function () {
        // given
        var noteStorage = new NoteStorage();
        var note = {};
        var voice = 1;
        var staff = 1;
        
        noteStorage.store(note, voice, staff);

        // when
        var staffExist = noteStorage.checkStaff(staff);
        
        // then
        assert.ok(staffExist, "staff should exist");
      });
      
      it("no staff", function () {
        // given
        var noteStorage = new NoteStorage();
        var staff = 1;

        // when
        var staffExist = noteStorage.checkStaff(staff);
        
        // then
        assert.ok(!staffExist, "staff shouldn't exist");
      });
      
      it("after clear", function () {
        // given
        var noteStorage = new NoteStorage();
        var note = {};
        var voice = 1;
        var staff = 1;
        
        noteStorage.store(note, voice, staff);
        noteStorage.clear();
         
        // when
        var staffExist = noteStorage.checkStaff(staff);
        
        // then
        assert.ok(!staffExist, "staff shouldn't exist");
      });
      
      it("store by string", function () {
        // given
        var noteStorage = new NoteStorage();
        var note = {};
        var voice = 1;
        var staff = 1;
        
        noteStorage.store(note, voice, staff.toString());
         
        // when
        var staffExist = noteStorage.checkStaff(staff);
        
        // then
        assert.ok(staffExist, "staff should exist");
      });
      
      it("retrieve by string", function () {
        // given
        var noteStorage = new NoteStorage();
        var note = {};
        var voice = 1;
        var staff = 1;
        
        noteStorage.store(note, voice, staff.toString());
         
        // when
        var staffExist = noteStorage.checkStaff(staff.toString());
        
        // then
        assert.ok(staffExist, "staff should exist");
      });
      
    });
    
    describe("#store", function () {
      it("store single note", function () {
        // given
        var noteStorage = new NoteStorage();
        var expected = {};
        var voice = 1;
        var staff = 1;

        // when
        noteStorage.store(expected, voice, staff);
        
        // then
        var actual = noteStorage.getNotes(voice, staff)[0];
        assert.strictEqual(actual, expected, "bad note returned");
      });
    });
    
  });
  
}).call(this);
