// var Fermata = require('../src/Fermata.Dev.Node.js');
var Fermata = require('..');

var score = {"score-partwise":{"$version":"3.0","part-list":{"score-part":[{"$id":"P1","part-name":"Music"}]},"part":[{"$id":"P1","measure":[{"$number":"1","attributes":[{"divisions":"1","key":{"fifths":"0"},"time":{"beats":"4","beat-type":"4"},"clef":{"sign":"G","line":"2"}}],"note":[{"pitch":{"step":"C","octave":"4"},"duration":"4","type":"whole"}]}]}]}};

var data = new Fermata.Data(score);
var render = new Fermata.Render(data);
render.renderAll();