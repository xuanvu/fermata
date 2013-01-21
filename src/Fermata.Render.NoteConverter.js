
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var Fermata = Fermata || {};

if (typeof(Fermata.Render) === "undefined")
{
  throw ("Fermata.Render.js MUST be included before Fermata.Render.NoteConverter.js");
}

(function(){
  
  //includes
  var NoteType = Fermata.Render.NoteType;
  var SoundType = Fermata.Render.SoundType;
  var PitchPitched = Fermata.Render.PitchPitched;
  var PitchRest = Fermata.Render.PitchRest;
  
  Fermata.Render.NoteConverter = function ()
  {
    
  }
  
  var NoteConverter = Fermata.Render.NoteConverter;
  
  NoteConverter.prototype.division = 0;
  NoteConverter.prototype.beats = 0;
  NoteConverter.prototype.beatType = 0;
  
  NoteConverter.prototype.convert = function (noteData, attributes)
  {
    if (typeof(attributes) !== "undefined") {
      this.fillAttributes(attributes);
    }
    else
    {
      this.fillAttributesDefault();
    }

    var noteType = Fermata.Render.getNoteType(noteData[0]);
    
    if (noteType === NoteType.NORMAL) {
      return this.convertNormalNote(noteData);
    }
    return null;
  };
  
  NoteConverter.prototype.fillAttributes = function (attributes)
  {
    this.beatType = attributes.beat.type;
    this.beats = attributes.beat.beats;
    this.divisions = attributes.division;
  };
  
  NoteConverter.prototype.fillAttributesDefault = function ()
  {
    this.beatType = 4;
    this.beats = 4;
    this.divisions = 1;
  };
  
  NoteConverter.prototype.convertPitch = function (dataPitch)
  {
    var dataOctave = dataPitch.getOctave();
    var dataStep = dataPitch.getStep();
    
    //TODO: extract on a mapping function instead of use toLowerCase
    var vexPitch = dataStep.toLowerCase() + "/" + dataOctave; 
    
    return vexPitch;
  }
  
  NoteConverter.prototype.convertDuration = function (noteData)
  {
    var dataDuration = noteData.duration;
    var actualDuration = dataDuration / this.divisions;
    var vexDuration = (this.beatType / actualDuration).toString();
    
    return vexDuration;
  }
  
  NoteConverter.prototype.convertNormalNote = function (noteData)
  {
    var dataPitch = this.extractPitch(noteData[0]);
    var vexDuration = this.convertDuration(noteData[0]);
    
    // Stem
    var stem = noteData[0].stem && noteData[0].stem.content;
    if (stem === 'down') {
      stem = Vex.Flow.StaveNote.STEM_DOWN;
    }
    else if (stem === 'up') {
      stem = Vex.Flow.StaveNote.STEM_UP;
    }
    // Choice best stem
    else {
      stem = dataPitch.getOctave() < 5 ? Vex.Flow.StaveNote.STEM_UP : Vex.Flow.StaveNote.STEM_DOWN;
    }

    if (dataPitch.getType() === SoundType.REST) {
      vexDuration += 'r';
    }
    
    var vexPitches = [];
    for (var i = 0 ; i < noteData.length ; i++)
    {
      dataPitch = this.extractPitch(noteData[i]);
      vexPitches.push(this.convertPitch(dataPitch));
    }
    
    var vexNote = new Vex.Flow.StaveNote({
      keys: vexPitches, 
      duration: vexDuration,
      stem_direction: stem
    });
    
    return vexNote;
  };
  
  NoteConverter.prototype.extractPitch = function (noteData)
  {
    var soundType = SoundType.getSoundType(noteData);
    
    if (soundType === SoundType.PITCH) {
      return new PitchPitched(noteData);
    }
    else if (soundType === SoundType.REST) {
      return new PitchRest(noteData);
    }
    else {
      return null;
    }
    
  }
  
}).call(this);
