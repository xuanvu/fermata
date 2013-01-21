// 
// Developpement only, use SCons otherwise to build
//

var vm = require('vm'),
    fs = require('fs'),
    path = require('path');

var FermataFiles = [
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
  "Fermata.Render.Header.js"
];

var concatenated = '';
FermataFiles.forEach(function(file) {
  concatenated += fs.readFileSync(path.resolve(__dirname, file), 'UTF-8');
});

vm.runInThisContext(concatenated);
module.exports = Fermata;