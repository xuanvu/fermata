// 
// Developpement only, use SCons otherwise to build
//

var vm = require('vm'),
    fs = require('fs'),
    path = require('path');

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
    "Fermata.Data.js",
    "Fermata.Mapping.Clef.js",
    "Fermata.Mapping.Direction.js",
    "Fermata.Render.js",
    "Fermata.Render.Call.js",
    "Fermata.Render.SymbolSize.js",
    "Fermata.Render.NoteStorage.js",
    "Fermata.Render.NoteType.js",
    "Fermata.Render.SoundType.js",
    "Fermata.Render.PitchPitched.js",
    "Fermata.Render.PitchRest.js",
    "Fermata.Render.PitchUnpitched.js",
    "Fermata.Render.NoteConverter.js",
    "Fermata.Render.TieRenderer.js",
    "Fermata.Render.GraceNote.js",
    "Fermata.Render.CueNote.js",
    "Fermata.Render.NormalNote.js",
    "Fermata.Render.Note.js",
    "Fermata.Render.RenderAttribute.js",
    "Fermata.Render.Direction.js",
    "Fermata.Render.Barline.js",
    "Fermata.Render.Score.js",
    "Fermata.Render.PartList.js",
    "Fermata.Render.Header.js",
    "Fermata.Node.js"
    ];

// Execute
var concatenated = '';
vexflow_sources.forEach(function(file) {
  concatenated += fs.readFileSync(path.resolve(__dirname, '../deps/vexflow/src', file), 'UTF-8');
});
fermata_sources.forEach(function(file) {
  concatenated += fs.readFileSync(path.resolve(__dirname, file), 'UTF-8');
});

// VM
var context = vm.createContext({ require: require });
vm.runInContext(concatenated, context);
module.exports = context.Fermata;