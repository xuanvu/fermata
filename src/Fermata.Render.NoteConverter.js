(function () {
  "use strict";

  //includes
  var NoteType = Fermata.Render.NoteType;
  var SoundType = Fermata.Values.SoundType;
  var PitchEncapsulator = Fermata.Data.PitchEncapsulator;

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

    console.log(noteData);
    var key = (typeof(noteData[0].staff) === 'undefined') ? 1 : noteData[0].staff;
    console.log(key);
    console.log(attributes);
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
    // console.log(noteData.duration);
    var dataDuration = noteData.duration;
    // console.log(this.divisions);
    var actualDuration = dataDuration / this.divisions;
    var vexDuration = Math.round(this.beatType / actualDuration).toString();

    return vexDuration;
  };

  NoteConverter.prototype.convertNormalNote = function (noteData)
  {
    var dataPitch = PitchEncapsulator.encapsulate(noteData[0], this.clefName);
    var vexDuration = this.convertDuration(noteData[0]);

    // Stem
    var stem = noteData[0].stem;
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
      vexDuration += 'r';
    }

    var vexPitches = [];
    for (var i = 0 ; i < noteData.length ; i++)
    {
      dataPitch = PitchEncapsulator.encapsulate(noteData[i], this.clefName);
      vexPitches.push(this.convertPitch(dataPitch));
    }

    var vexNote = new Vex.Flow.StaveNote({
      keys: vexPitches,
      duration: vexDuration,
      stem_direction: stem,
      auto_stem : auto_stem,
      clef : this.clefName
    });

    return vexNote;
  };

}).call(this);
