(function () {
  "use strict";
  
  Fermata.Render.NoteStorage = function ()
  {
    this.init();
  };
  
  var NoteStorage = Fermata.Render.NoteStorage;
  
  NoteStorage.prototype.init = function ()
  {
    this.data = [];
    this.allNotes = [];
  };
  
  NoteStorage.prototype.clear = function ()
  {
    this.data = [];
  };
  
  NoteStorage.prototype.store = function (note, voice, staff)
  {
    this.checkCreateVoice(staff, voice);
    
    this.data[staff][voice].push(note);
    this.allNotes.push(note);
  };
  
  NoteStorage.prototype.getNotes = function (voice, staff)
  {
    if (!this.checkStaff(staff))
    {
      throw new Error("there is no note stored for the staff" + staff.toString());
    }
    if (!this.checkVoice(staff, voice))
    {
      throw new Error("there is no note stored for the voice " + voice.toString() +
      " of the staff " + staff.toString());
    }
    return this.data[staff][voice];
  };
  
  NoteStorage.prototype.getAllNotes = function ()
  {
    return this.allNotes;
  };
  
  NoteStorage.prototype.checkCreateVoice = function (staff, voice)
  {
    this.checkCreateStaff(staff);
    if (!this.checkVoice(staff, voice))
    {
      this.data[staff][voice] = [];
    }
  };

  NoteStorage.prototype.checkCreateStaff = function (staff)
  {
    if (!this.checkStaff(staff))
    {
      this.data[staff] = [];
    }
  };

  NoteStorage.prototype.checkVoice = function (staff, voice)
  {
    if (!this.checkStaff(staff))
    {
      return false;
    }
    return typeof(this.data[staff][voice]) !== "undefined";
  };

  NoteStorage.prototype.checkStaff = function (staff)
  {
    return typeof(this.data[staff]) !== "undefined";
  };

}).call(this);
