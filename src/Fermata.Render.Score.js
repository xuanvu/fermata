(function () {
  "use strict";

  var Call = Fermata.Utils.Call;

  Fermata.Render.prototype.renderAll = function () {
    this.renderScoreHeader(this.data.getScorePartWise());
    this.renderMeasures();
    this.renderMeasuresWidth();
    this.renderAllStaves();
  };

  // Includes
  var BeamProcessor = Fermata.Render.BeamProcessor;
  var TupletProcessor = Fermata.Render.TupletProcessor;

  var _render = Fermata.Render.prototype;
  Fermata.Render.prototype.renderScoreHeaderProcess = [
    {
      key: "attributes",
      type: Call.FuncTypes.$0n,
      func: /*_render.renderAttributes*/ null
    }, // really ? hmmm... no.
    {
      key: "part-list",
      type: Call.FuncTypes.$1,
      func: _render.renderPartList
    },
    {
      key: "work",
      type: Call.FuncTypes.$01,
      func: _render.renderPartList
    },
    {
      key: "movement-number",
      type: Call.FuncTypes.$01,
      func: _render.renderHeaderMovNum
    },
    {
      key: "movement-title",
      type: Call.FuncTypes.$01,
      func: _render.renderHeaderMovTitle
    },
    {
      key: "identification",
      type: Call.FuncTypes.$01,
      func: _render.renderHeaderIdentifi
    },
    {
      key: "defaults",
      type: Call.FuncTypes.$01,
      func: _render.renderHeaderdefaults
    },
    {
      key: "credit",
      type: Call.FuncTypes.$0n,
      func: _render.renderHeaderCredit
    }
  ];

  Fermata.Render.prototype.renderScoreHeader = function (scoreHeader)
    {
      Call.exploreSubNodes({
        object: scoreHeader,
        processes: this.renderScoreHeaderProcess,
        ctx: this
      });
    };

  Fermata.Render.prototype.renderPart = function (partIdx)
  {
    for (var i = 0 ; i < this.parts.idx[partIdx].measure.length ; ++i) {
      this.renderMeasure(i, partIdx);
    }
  };

  Fermata.Render.prototype.renderPrint = function (print)
  {
    return;
  };

  Fermata.Render.prototype.renderMeasures = function () {
    for (var i = 0 ; i < this.parts.idx.length ; i++) {
      for (var j = 0 ; j < this.parts.idx[i].measure.length ; ++j) {
        this.renderMeasure(j, i);
      }
    }
  };

  Fermata.Render.prototype.renderMeasureProcess = [
    {
      key: "note",
      type: Call.FuncTypes.$01,
      func: _render.renderNotes
    },
    {
      key: "backup",
      type: Call.FuncTypes.$0n,
      func: _render.Renderbackup
    },
    {
      key: "forward",
      type: Call.FuncTypes.$0n,
      func: null
    },
    {
      key: "direction",
      type: Call.FuncTypes.$0n,
      func: _render.renderDirection
    },
    {
      key: "harmony",
      type: Call.FuncTypes.$0n,
      func: _render.renderHarmony
    },
    {
      key: "figured-bass",
      type: Call.FuncTypes.$0n,
      func: null
    },
    {
      key: "print",
      type: Call.FuncTypes.$0n,
      func: _render.renderPrint
    },
    {
      key: "sound",
      type: Call.FuncTypes.$0n,
      func: null
    },
    {
      key: "barline",
      type: Call.FuncTypes.$0n,
      func: _render.renderBarline
    },
    {
      key: "grouping",
      type: Call.FuncTypes.$0n,
      func: null
    },
    {
      key: "link",
      type: Call.FuncTypes.$0n,
      func: null
    },
    {
      key: "bookmark",
      type: Call.FuncTypes.$0n,
      func: null
    }
  ];

  Fermata.Render.prototype.renderMeasure = function (measureIdx, partIdx)
  {
    this.cur = {
      measure: this.parts.idx[partIdx].measure[measureIdx],
      measureIdx: measureIdx,
      part: this.parts.idx[partIdx],
      partIdx: partIdx
    };
    var $fermata = this.cur.measure.$fermata;
    $fermata.vexNotes = [];
    $fermata.vexStaves = [];
    $fermata.vexVoices = [];
    $fermata.vexBeams = [];
    $fermata.vexHairpin = [];
    $fermata.vexTuplets = [];

    this.beamProcessor = new BeamProcessor(this.cur.measure.$fermata);
    this.tupletProcessor = new TupletProcessor(this.cur.measure.$fermata);

    // Stave
    // this.renderMeasureAttributes(measure);

    // Measure content
    Call.exploreSubNodes({
      object: this.cur.measure,
      processes: this.renderMeasureProcess,
      ctx: this
    });
  // console.log(measure.$fermata);
  };

  Fermata.Render.prototype.renderMeasuresWidth = function () {
    if (this.parts.idx.length > 0) {
      for (var i = 0 ; i < this.parts.idx[0].measure.length ; i++) {
        this.renderMeasureWidth(i);
      }
    }
  };

  Fermata.Render.prototype.renderMeasureWidth = function (columnId) {
    var maxWidth;
    var maxNotes = 0;
    var i, j;

    for (j = 0 ; j < this.parts.idx.length ; j++) {
      if (! isNaN(this.parts.idx[j].measure[columnId].$width)) {
        if (typeof maxWidth === "undefined" || this.parts.idx[j].measure[columnId].$width > maxWidth) {
          maxWidth = this.parts.idx[j].measure[columnId].$width;
        }
      }

      var notePerVoice = [];
      for (i = 0 ; i < this.parts.idx[j].measure[columnId].note.length ; i++) {
        if (typeof notePerVoice[this.parts.idx[j].measure[columnId].note[i].voice] === "undefined") {
          notePerVoice[this.parts.idx[j].measure[columnId].note[i].voice] = this.noteWidth(this.parts.idx[j].measure[columnId].note[i]);
        }
        else {
          notePerVoice[this.parts.idx[j].measure[columnId].note[i].voice] += this.noteWidth(this.parts.idx[j].measure[columnId].note[i]);
        }
      }
      
      for (i = 0 ; i < notePerVoice.length ; i++) {
        if (typeof notePerVoice[i] !== "undefined" && notePerVoice[i] > maxNotes) {
          maxNotes = notePerVoice[i];
        }
      }
    }

    if (typeof maxWidth === "undefined") {
      maxWidth = maxNotes + this.armWidth(columnId);
      if (maxWidth === 0) {
        maxWidth = 40; //Dirty, will change very, very, very soon.
      }
    }

    for (j = 0 ; j < this.parts.idx.length ; j++) {
      this.parts.idx[j].measure[columnId].$width = maxWidth;
    }
  };

  Fermata.Render.prototype.armWidth = function (columnId) {
    // TODO: define clefWidth, signatureWidth and timeWidth.
    var width = 0;
    if (typeof this.parts.idx[0].measure[columnId].attributes !== "undefined") {
      if (typeof this.parts.idx[0].measure[columnId].attributes[0].clef !== "undefined") {
        //clefWidth
        width += 40;
      }
      if (typeof this.parts.idx[0].measure[columnId].attributes[0].key !== "undefined") {
        //signatureWidth
        width += 40;
      }
      if (typeof this.parts.idx[0].measure[columnId].attributes[0].time !== "undefined") {
        //timeWidth
        width += 40;
      }
    }
    return width;
  };

  Fermata.Render.prototype.noteWidth = function (note) {
    // TODO: consider vexflow note width + dot + alteration instead of return 40.
    //noteWidth
    var width = 40;
    if (typeof note.accidental !== "undefined") {
      //accidentalWidth
      width += 30;
    }
    // TODO: what is dot?
    // if (typeof note. !== "undefined")
    //   width += 30;//dotWidth;
    return width;
  };

  Fermata.Render.prototype.renderAllStaves = function () {
    for (var i = 0 ; i < this.parts.idx.length ; i++) {
      for (var j = 0 ; j < this.parts.idx[i].measure.length ; ++j) {
        this.renderStaves(j, i);
      }
    }
  };

  Fermata.Render.prototype.renderStaves = function (measureIdx, partIdx) {
    var part = this.parts.idx[partIdx], measure = part.measure[measureIdx], $fermata = measure.$fermata,
    $fermataLastMeasure = measureIdx === 0 ? null : part.measure[measureIdx - 1].$fermata;

    measure.$width = parseInt(measure.$width, 10);
    part.$fermata = part.$fermata || {};
    part.$fermata.staveY = partIdx === 0 ? 0 : this.parts.idx[partIdx - 1].$fermata.nextStaveY + 100;
    part.$fermata.nextStaveY = part.$fermata.staveY;

    for (var i = 0; i < $fermata.attributes.staves; i++) {
      if ($fermata.vexStaves[i] === undefined) {
        if (measureIdx === 0) {
          $fermata.vexStaves[i] = new Vex.Flow.Stave(20, (part.$fermata.nextStaveY += i * 100), measure.$width);
        }
        else {
          $fermata.vexStaves[i] = new Vex.Flow.Stave($fermataLastMeasure.vexStaves[i].x + $fermataLastMeasure.vexStaves[i].width,
            $fermataLastMeasure.vexStaves[i].y, measure.$width);
        }
      }

      // Draw clef and time if needing
      var clefName = Fermata.Mapping.Clef.getVexflow($fermata.attributes.clef[i].sign);
      $fermata.voiceWidth = 0;
      if (measureIdx  === 0 || clefName !== $fermataLastMeasure.vexStaves[i].clef)
      {
        $fermata.vexStaves[i].addClef(clefName);
        $fermata.voiceWidth += 25;
        if ($fermata.attributes.key.mode !== null) {
          var keySign = Fermata.Mapping.Clef.Sign.getVexflow($fermata.attributes.key.fifths, $fermata.attributes.key.mode);
          new Vex.Flow.KeySignature(keySign).addToStave($fermata.vexStaves[i]);
        }

        $fermata.vexStaves[i].addTimeSignature($fermata.attributes.time.beats + '/' + $fermata.attributes.time["beat-type"]);
        $fermata.voiceWidth += 25;
      }
      else {
        $fermata.vexStaves[i].clef = clefName;
      }
    }

    if ($fermata.direction !== undefined) {
      for (i = 0; i < $fermata.direction.length; i++) {
        var data = $fermata.direction;

        if (data[i]['direction-type'].wedge.$type !== null && data[i]['direction-type'].wedge.$type !== 'stop') {
          var renderOption = {
            height: 10,
            y_shift: 0,
            left_shift_px: 0,
            right_shift_px: 0
          };
          var tmpNote = {
            first_note : _render.getNoteTest(Fermata.Drawer.prototype.getGoodPos(data[i].noteAfter, data[i].noteBefore, renderOption, true), measure),
            last_note : _render.getNoteTest(Fermata.Drawer.prototype.getGoodPos(data[i + 1].noteAfter, data[i + 1].noteBefore, renderOption, false), measure)
          };
          if (tmpNote.first_note === tmpNote.last_note) {
            renderOption.right_shift_px += 70;
          }
          console.log(data[i].placement);
          var hp = new Vex.Flow.StaveHairpin(tmpNote, Fermata.Mapping.Direction.getVexflow(data[i]['direction-type'].wedge.$type));
          hp.setPosition(Fermata.Mapping.Direction.getVexflow(data[i].$placement));
          hp.setRenderOptions(renderOption);
          $fermata.vexHairpin.push(hp);
        }
        else if (data[i]['direction-type'].words.content !== null) {
          var note = _render.getNoteTest(data[i].noteAfter, measure);
          note.addAnnotation(0, Fermata.Drawer.prototype.AddNotation(data[i]['direction-type'].words.content, 1, 1));
        }
      }
    }

    for (var staffIdx = 1 ; staffIdx < $fermata.vexNotes.length ; staffIdx++) {
      for (var voiceIdx in $fermata.vexNotes[staffIdx]) {
        if ($fermata.vexNotes[staffIdx].hasOwnProperty(voiceIdx)) {
          var voice = new Vex.Flow.Voice({
            num_beats: measure.$fermata.attributes.time.beats,
            beat_value: measure.$fermata.attributes.time["beat-type"],
            resolution: Vex.Flow.RESOLUTION
            
          });
          voice.setStrict(false);
          voice.addTickables($fermata.vexNotes[staffIdx][voiceIdx]);
          // Add notes to voice
          // Format and justify the notes to 500 pixels
          var formatter = new Vex.Flow.Formatter();
          formatter.joinVoices([voice]);
          formatter.format([voice], /*measure.note.length * 50*/ measure.$width - $fermata.voiceWidth - 15);
          $fermata.vexVoices.push(voice);
        // voice.draw(this.ctx, $fermata.vexStaves[staffIdx - 1]);
        }
      }
    }
  };

// Fermata.Render.prototype.renderMeasureAttributes = function (measure)
// {
//   //TODO : do the rest
//   var number = measure.$number;
//   var implicit = false;
//   var nonControlling = false;
//   var width = 0; //TODO: default value unknown. We have to lnow which one it is


//   //TODO: refactor the verification
//   if (typeof(measure.implicit) !== "undefined") {
//     if (measure.implicit === "yes") {
//       implicit = true;
//     }
//     // else if (measure.implicit !== "no") {
//     //invalid value
//     //TODO: should we raise an exception ?
//     // }
//   }

//   if (typeof(measure["non-controlling"]) !== "undefined") {
//     if (measure["non-controlling"] === "yes") {
//       nonControlling = true;
//     }
//     // else if (measure["non-controlling"] !== "no") {
//     //invalid value
//     //TODO: should we raise an exception ?
//     // }
//   }

//   if (typeof(measure.width) !== "undefined") {
//     width = measure.width; //TODO: check if the value is a number
//   }
// };

}).call(this);
