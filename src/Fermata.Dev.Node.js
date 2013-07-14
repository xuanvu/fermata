//
// Developpement only, use SCons otherwise to build
//

var vm = require('vm'),
    fs = require('fs'),
    path = require('path');
    jsondiffpatch = require('jsondiffpatch');

/*global _$jscoverage:true */
if (typeof _$jscoverage === 'undefined') {
  _$jscoverage = {};
}

(function () {
  "use strict";

  var vexflow_sources, fermata_sources;

  // Sources list
  vexflow_sources = [
    "header.js",
    "vex.js",
    "flow.js",
    "fraction.js",
    "tables.js",
    "fonts/vexflow_font.js",
    "glyph.js",
    "stave.js",
    "staveconnector.js",
    "tabstave.js",
    "tickcontext.js",
    "tickable.js",
    "note.js",
    "ghostnote.js",
    "stavenote.js",
    "tabnote.js",
    "beam.js",
    "voice.js",
    "voicegroup.js",
    "modifier.js",
    "modifiercontext.js",
    "accidental.js",
    "dot.js",
    "formatter.js",
    "stavetie.js",
    "tabtie.js",
    "tabslide.js",
    "bend.js",
    "vibrato.js",
    "annotation.js",
    "articulation.js",
    "tuning.js",
    "stavemodifier.js",
    "keysignature.js",
    "timesignature.js",
    "clef.js",
    "music.js",
    "keymanager.js",
    "renderer.js",
    "raphaelcontext.js",
    "stavebarline.js",
    "stavehairpin.js",
    "stavevolta.js",
    "staverepetition.js",
    "stavesection.js",
    "stavetempo.js",
    "barnote.js",
    "tremolo.js",
    "tuplet.js",
    "boundingbox.js",
    "textnote.js",
    "frethandfinger.js",
    "stringnumber.js",
    "strokes.js"
  ];

  fermata_sources = [
    "Fermata.js",
    "Fermata.Utils.js",
    "Fermata.Utils.AttributeDiff.js",
    "Fermata.Utils.AttributeDiff.UpdateBase.js",
    "Fermata.Utils.AttributeDiff.UpdateBeatType.js",
    "Fermata.Utils.AttributeDiff.UpdateBeats.js",
    "Fermata.Utils.AttributeDiff.UpdateDivisions.js",
    "Fermata.Utils.AttributeDiff.processorList.js",
    "Fermata.Utils.epureAttributes.js",
    "Fermata.Utils.Call.js",
    "Fermata.Error.js",
    "Fermata.Error.NotImplementedError.js",
    "Fermata.Error.PitchRangeError.js",
    "Fermata.Error.OctaveRangeError.js",
    "Fermata.Error.StepRangeError.js",
    "Fermata.Values.js",
    "Fermata.Values.Octave.js",
    "Fermata.Values.Step.js",
    "Fermata.Values.SoundType.js",
    "Fermata.Mapping.Clef.js",
    "Fermata.Mapping.Direction.js",
    "Fermata.Mapping.Connector.js",
    "Fermata.Mapping.Barline.js",
    "Fermata.Data.js",
    "Fermata.Data.PitchPitched.js",
    "Fermata.Data.PitchRest.js",
    "Fermata.Data.PitchUnpitched.js",
    "Fermata.Data.PitchEncapsulator.js",
    "Fermata.Data.ReconstructAttributes.js",
    "Fermata.Data.Measure.js",
    "Fermata.Data.Edit.js",
    "Fermata.Data.Edit.Rest.js",
    "Fermata.Data.Edit.Note.js",
    "Fermata.Data.saveAttributes.js",
    "Fermata.Render.js",
    "Fermata.Render.Backup.js",
    "Fermata.Render.BeamType.js",
    "Fermata.Render.BeamProcessor.js",
    "Fermata.Render.TupletType.js",
    "Fermata.Render.TupletProcessor.js",
    "Fermata.Render.SymbolSize.js",
    "Fermata.Render.NoteStorage.js",
    "Fermata.Render.NoteType.js",
    "Fermata.Render.NoteConverter.js",
    "Fermata.Render.TieRenderer.js",
    "Fermata.Render.GraceNote.js",
    "Fermata.Render.CueNote.js",
    "Fermata.Render.NormalNote.js",
    "Fermata.Render.Note.js",
    "Fermata.Render.Direction.js",
    "Fermata.Render.Barline.js",
    "Fermata.Render.PartList.js",
    "Fermata.Render.Header.js",
    "Fermata.Render.Score.js",
    "Fermata.Drawer.js",
    "Fermata.Drawer.Score.js",
    "Fermata.Node.js"
    ];

  // Execute
  var concatenated = '';
  vexflow_sources.forEach(function (file) {
    concatenated += fs.readFileSync(path.resolve(__dirname, '../deps/vexflow/src', file), 'UTF-8');
  });
  fermata_sources.forEach(function (file) {
    concatenated += fs.readFileSync(path.resolve(__dirname, file), 'UTF-8');
  });


  // VM
  var context = vm.createContext({
    module: module,
    require: require,
    console: console,
    _$jscoverage: _$jscoverage,
    jsondiffpatch: jsondiffpatch
});
  vm.runInContext(concatenated, context);

  module.exports = context.Fermata;
}).call(this);
