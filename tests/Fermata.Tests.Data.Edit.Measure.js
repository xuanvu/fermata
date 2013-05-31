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
  var Data = Fermata.Data;
  var Utils = Fermata.Utils;
  
  // Tests data
  var testMeasures = [{$number:"1",$width:"366",print:{"system-layout":{"system-margins":{"left-margin":"3","right-margin":"0"},"top-system-distance":"280"},"measure-numbering":"system"},attributes:[{divisions:"24",key:{fifths:"-3",mode:"major"},time:{beats:"3","beat-type":"4"},clef:{sign:"G",line:"2"}}],direction:{$directive:"yes",$placement:"above","direction-type":{words:{"$default-y":"15","$font-size":"10.5","$font-weight":"bold",content:"Andantino"}},sound:{$tempo:"60"},noteAfter:0},note:[{rest:{$measure:"yes"},duration:"72",voice:"1"}]},{$number:"2",$width:"245",direction:[{$placement:"above","direction-type":{words:{"$default-x":"15","$default-y":"15","$font-size":"9","$font-style":"italic",content:"dolce"}},noteAfter:0},{$placement:"above","direction-type":{wedge:{"$default-y":"20",$spread:"0",$type:"crescendo"}},offset:"-8",noteBefore:0,noteAfter:1},{"direction-type":{wedge:{$spread:"11",$type:"stop"}},offset:"-11",noteBefore:2}],note:[{"$default-x":"27",pitch:{step:"G",octave:"4"},duration:"24",voice:"1",type:"quarter",stem:{"$default-y":"6",content:"up"},lyric:{"$default-y":"-80",$number:"1",syllabic:"single",text:"Dans"}},{"$default-x":"99",pitch:{step:"C",octave:"5"},duration:"24",voice:"1",type:"quarter",stem:{"$default-y":"-50.5",content:"down"},lyric:{"$default-y":"-80",$number:"1",syllabic:"single",text:"un"}},{"$default-x":"171",pitch:{step:"D",octave:"5"},duration:"24",voice:"1",type:"quarter",stem:{"$default-y":"-45.5",content:"down"},lyric:{"$default-y":"-80",$number:"1",syllabic:"begin",text:"som"}}]},{$number:"3",$width:"303",note:[{"$default-x":"26",pitch:{step:"E",alter:"-1",octave:"5"},duration:"24",tie:{$type:"start"},voice:"1",type:"quarter",stem:{"$default-y":"-40.5",content:"down"},notations:{tied:{$type:"start"}},lyric:{"$default-y":"-80",$number:"1",syllabic:"end",text:"meil",extend:{}}},{"$default-x":"92",pitch:{step:"E",alter:"-1",octave:"5"},duration:"8",tie:{$type:"stop"},voice:"1",type:"eighth","time-modification":{"actual-notes":"3","normal-notes":"2"},stem:{"$default-y":"-40",content:"down"},beam:{$number:"1",content:"begin"},notations:{tied:{$type:"stop"},tuplet:{$bracket:"no",$number:"1",$placement:"above",$type:"start"}}},{"$default-x":"122",pitch:{step:"D",octave:"5"},duration:"8",voice:"1",type:"eighth","time-modification":{"actual-notes":"3","normal-notes":"2"},stem:{"$default-y":"-42",content:"down"},beam:{$number:"1",content:"continue"},lyric:{"$default-y":"-80",$number:"1",syllabic:"single",text:"que"}},{"$default-x":"162",pitch:{step:"C",octave:"5"},duration:"8",voice:"1",type:"eighth","time-modification":{"actual-notes":"3","normal-notes":"2"},stem:{"$default-y":"-45",content:"down"},beam:{$number:"1",content:"end"},notations:{tuplet:{$number:"1",$type:"stop"}},lyric:{"$default-y":"-80",$number:"1",syllabic:"begin",text:"char"}},{"$default-x":"205",pitch:{step:"E",alter:"-1",octave:"5"},duration:"8",voice:"1",type:"eighth","time-modification":{"actual-notes":"3","normal-notes":"2"},stem:{"$default-y":"-40",content:"down"},beam:{$number:"1",content:"begin"},notations:{tuplet:{$bracket:"no",$number:"1",$placement:"above",$type:"start"}},lyric:{"$default-y":"-80",$number:"1",syllabic:"end",text:"mait"}},{"$default-x":"244",pitch:{step:"D",octave:"5"},duration:"8",voice:"1",type:"eighth","time-modification":{"actual-notes":"3","normal-notes":"2"},stem:{"$default-y":"-43",content:"down"},beam:{$number:"1",content:"continue"},lyric:{"$default-y":"-80",$number:"1",syllabic:"single",text:"ton"}},{"$default-x":"276",pitch:{step:"C",octave:"5"},duration:"8",voice:"1",type:"eighth","time-modification":{"actual-notes":"3","normal-notes":"2"},stem:{"$default-y":"-45",content:"down"},beam:{$number:"1",content:"end"},notations:{tuplet:{$number:"1",$type:"stop"}},lyric:{"$default-y":"-80",$number:"1",syllabic:"begin",text:"i"}}]},{$number:"4",$width:"284",direction:[{$placement:"above","direction-type":{wedge:{"$default-y":"20",$spread:"11",$type:"diminuendo"}},offset:"3",noteAfter:0},{"direction-type":{wedge:{$spread:"0",$type:"stop"}},offset:"2",noteBefore:0,noteAfter:1}],note:[{"$default-x":"27",pitch:{step:"C",octave:"5"},duration:"48",voice:"1",type:"half",stem:{"$default-y":"-50.5",content:"down"},lyric:{"$default-y":"-80",$number:"1",syllabic:"middle",text:"ma"}},{"$default-x":"197",pitch:{step:"B",alter:"-1",octave:"4"},duration:"24",voice:"1",type:"quarter",stem:{"$default-y":"-55.5",content:"down"},lyric:{"$default-y":"-80",$number:"1",syllabic:"end",text:"ge"}}]}];
  
  var checkMeasureNumbers = function (measures) {
    for (var i = 0 ; i < measures.length ; i++) {
      assert.equal(measures.$number, i + 1);
    }
  };
  
  var checkAttributes = function (measures, expectedAttributes) {
    for (var i = 0 ; i < measures.length ; i++) {
      assert.deepEqual(measures[i].attributes, expectedAttributes[i]);
    }
  };

  describe("Fermata.Edit.Measure", function () {
    describe("#addMeasure", function (){
      it("add at the begining of the measure", function (){
        // Given
        var measures = Utils.Clone(testMeasures);
        var expectedAttributes = [[{
          divisions: "24",
          key: {
            fifths: "-3",
            mode: "major"
          },
          time: {
            beats: "3",
            "beat-type": "4"
          },
          clef: {
            sign: "G",
            line: "2"
          }
        }
        ], 
        , 
        , 
        ,];
        var idx = 0;
        
        // When
        
        // Then
        checkMeasureNumbers(measures);
        assert.equal(measures.length, testMeasures.length + 1);
        checkAttributes(measures, expectedAttributes);
      });
    });
  });
}).call(this);
