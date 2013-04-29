(function () {
  "use strict";

  //includes
  var NoteType = Fermata.Render.NoteType;
  var SoundType = Fermata.Render.SoundType;
  var PitchPitched = Fermata.Render.PitchPitched;
  var PitchRest = Fermata.Render.PitchRest;
  var TupletProcessor = Fermata.Render.TupletProcessor;

  Fermata.Render.NoteConverter = function ()
  {};

  var NoteConverter = Fermata.Render.NoteConverter;

  NoteConverter.prototype.division = 0;
  NoteConverter.prototype.beats = 0;
  NoteConverter.prototype.beatType = 0;
  NoteConverter.prototype.clefName = "";
  NoteConverter.prototype.change = 0;

  NoteConverter.prototype.convert = function (noteData, attributes)
  {
    if (typeof(attributes) !== "undefined") {
      this.fillAttributes(attributes);
    }
    else {
      this.fillAttributesDefault();
    }

    var key = (typeof(noteData[0].staff) === 'undefined') ? 1 : noteData[0].staff;
    this.clefName = Fermata.Mapping.Clef.getVexflow(attributes.clef[key - 1].sign);
    this.change = attributes.clef[key - 1].change;
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
    this.divisions = attributes.divisions;
  };

  NoteConverter.prototype.fillAttributesDefault = function ()
  {
    this.beatType = 4;
    this.beats = 4;
    this.divisions = 1;
  };

  NoteConverter.prototype.convertPitch = function (dataPitch)
  {
    var dataOctave = parseInt(dataPitch.getOctave(), 10) - parseInt(this.change, 10);
    var dataStep = dataPitch.getStep();

    //TODO: extract on a mapping function instead of use toLowerCase
    var vexPitch = dataStep.toLowerCase() + '/' + dataOctave;

    return vexPitch;
  };

  NoteConverter.prototype.convertDuration = function (noteData)
  {
    var dataDuration = this.getDuration(noteData);
    var actualDuration = dataDuration / this.divisions;
    var vexBaseDuration = Math.ceil(this.beatType / actualDuration);
    var baseDuration = this.beatType / vexBaseDuration;
    var dotDuration = actualDuration - baseDuration;

    var vexDuration = {
      vexBaseDuration: vexBaseDuration.toString(),
      dotDuration: dotDuration
    };
    if (dotDuration > 0)
    {
      vexDuration.vexBaseDuration += "d";
    }

    return vexDuration;
  };

  NoteConverter.prototype.getDuration = function (noteData) {
    if (TupletProcessor.hasTimeModification(noteData))
    {
      var timeModification = TupletProcessor.getTimeModification(noteData);
      var actualNotes = timeModification["actual-notes"];
      var normalNotes = timeModification["normal-notes"];

      return noteData.duration * actualNotes / normalNotes;
    }
    else
    {
      return noteData.duration;
    }
  };

  NoteConverter.prototype.convertNormalNote = function (noteData)
  {
    var dataPitch = this.extractPitch(noteData[0]);
    var vexDuration = this.convertDuration(noteData[0]);
    var stem = null;

    // Stem
    if (typeof(noteData[0].stem) === 'object') {
      stem = noteData[0].stem.content;
    }
    else {
      stem = noteData[0].stem;
    }
    var auto_stem = false;

    if (stem === 'down') {
      stem = Vex.Flow.StaveNote.STEM_DOWN;
    }
    else if (stem === 'up') {
      stem = Vex.Flow.StaveNote.STEM_UP;
    }
    // Choice best stem
    else {
      auto_stem = true;
    }

    if (dataPitch.getType() === SoundType.REST) {
      vexDuration.vexBaseDuration += 'r';
    }

    var vexPitches = [];
    for (var i = 0 ; i < noteData.length ; i++)
    {
      dataPitch = this.extractPitch(noteData[i]);
      vexPitches.push(this.convertPitch(dataPitch));
    }

    var vexNote = new Vex.Flow.StaveNote({
      keys: vexPitches,
      duration: vexDuration.vexBaseDuration,
      stem_direction: stem,
      auto_stem : auto_stem,
      clef : this.clefName
    });
    
    if (vexDuration.dotDuration > 0)
    {
      vexNote.addDotToAll();
    }

    return vexNote;
  };

  NoteConverter.prototype.extractPitch = function (noteData)
  {
    var soundType = SoundType.getSoundType(noteData);

    if (soundType === SoundType.PITCH) {
      return new PitchPitched(noteData);
    }
    else if (soundType === SoundType.REST) {
      return new PitchRest(noteData, this.clefName);
    }
    else {
      return null;
    }
  };

}).call(this);
