(function () {
  "use strict";

  Fermata.Render.prototype.renderAll = function () {
    this.renderScoreHeader(this.data.getScorePartWise());

    for (var i = 0 ; i < this.parts.idx.length ; i++) {
      this.renderPart(this.parts.idx[i], i);
    }
  };

  var _render = Fermata.Render.prototype;
  Fermata.Render.prototype.renderScoreHeaderProcess = [
    { key: "attributes", type: _render.FuncTypes.$0n, func: /*_render.renderAttributes*/ null }, // really ? hmmm... no.
    { key: "part-list", type: _render.FuncTypes.$1, func: _render.renderPartList },
    { key: "work", type: _render.FuncTypes.$01, func: _render.renderPartList },
    { key: "movement-number", type: _render.FuncTypes.$01, func: _render.renderHeaderMovNum },
    { key: "movement-title", type: _render.FuncTypes.$01, func: _render.renderHeaderMovTitle },
    { key: "identification", type: _render.FuncTypes.$01, func: _render.renderHeaderIdentifi },
    { key: "defaults", type: _render.FuncTypes.$01, func: _render.renderHeaderdefaults },
    { key: "credit", type: _render.FuncTypes.$0n, func: _render.renderHeaderCredit }
  ];

  Fermata.Render.prototype.renderScoreHeader = function (scoreHeader)
  {
    this.exploreSubNodes({ object: scoreHeader, processes: this.renderScoreHeaderProcess, ctx: this });
  };

  Fermata.Render.prototype.renderPart = function (part, partIdx)
  {
    for (var i = 0 ; i < part.measure.length ; ++i) {
      this.renderMeasure(part.measure[i], i, partIdx);
    }
  };
  
  Fermata.Render.prototype.renderPrint = function (print)
  {
    return;
  };

  Fermata.Render.prototype.renderMeasureProcess = [
    { key: "attributes", type: _render.FuncTypes.$1n, func: _render.renderAttributes },
    { key: "note", type: _render.FuncTypes.$01, func: _render.renderNotes },
    { key: "backup", type: _render.FuncTypes.$0n, func: _render.Renderbackup },
    { key: "forward", type: _render.FuncTypes.$0n, func: null },
    { key: "direction", type: _render.FuncTypes.$0n, func: _render.renderDirection },
    { key: "harmony", type: _render.FuncTypes.$0n, func: _render.renderHarmony },
    { key: "figured-bass", type: _render.FuncTypes.$0n, func: null },
    { key: "print", type: _render.FuncTypes.$0n, func: _render.renderPrint },
    { key: "sound", type: _render.FuncTypes.$0n, func: null },
    { key: "barline", type: _render.FuncTypes.$0n, func: _render.renderBarline },
    { key: "grouping", type: _render.FuncTypes.$0n, func: null },
    { key: "link", type: _render.FuncTypes.$0n, func: null },
    { key: "bookmark", type: _render.FuncTypes.$0n, func: null }
  ];

  Fermata.Render.prototype.renderMeasure = function (measure, measureIdx, partIdx)
  {
    this.cur = { measure: measure, measureIdx: measureIdx, part: this.parts.idx[partIdx], partIdx: partIdx };
    measure.$fermata = { vexNotes: [], vexStaves: [], vexVoices: [] };

    // Stave
    // this.renderMeasureAttributes(measure);

    // Measure content
    this.exploreSubNodes({ object: measure, processes: this.renderMeasureProcess, ctx: this });
    // this.renderMeasureWidth();
    this.renderStaves(measure, measureIdx, partIdx);

    // console.log(measure.$fermata);
  };

  Fermata.Render.prototype.renderMeasureWidth = function () {
    console.log(this.cur.measure);
  };

  Fermata.Render.prototype.renderStaves = function (measure, measureIdx, partIdx) {
    var $fermata = measure.$fermata,
        $fermataLastMeasure = measureIdx === 0 ? null : this.cur.part.measure[measureIdx - 1].$fermata;

    measure.$width = parseInt(measure.$width, 10);
    this.cur.part.$fermata = this.cur.part.$fermata || {};
    this.cur.part.$fermata.staveY = partIdx === 0 ? 0 : this.parts.idx[partIdx - 1].$fermata.nextStaveY + 100;
    this.cur.part.$fermata.nextStaveY = this.cur.part.$fermata.staveY;

    for (var i = 0; i < $fermata.attributes.staves; i++) {
      if ($fermata.vexStaves[i] === undefined) {
        if (measureIdx === 0) {
          $fermata.vexStaves[i] = new Vex.Flow.Stave(20, (this.cur.part.$fermata.nextStaveY += i * 100), /*measure.note.length * 50*/measure.$width);
        }
        else {
          $fermata.vexStaves[i] = new Vex.Flow.Stave($fermataLastMeasure.vexStaves[i].x + $fermataLastMeasure.vexStaves[i].width,
            $fermataLastMeasure.vexStaves[i].y, /*measure.note.length * 50*/measure.$width);
        }
      }

      // Draw clef and time if needing
      var clefName = Fermata.Mapping.Clef.getVexflow($fermata.attributes.clef[i].sign);
      $fermata.voiceWidth = 0;
      if (measureIdx  === 0 || clefName !== $fermataLastMeasure.vexStaves[i].clef)
      {
        $fermata.vexStaves[i].addClef(clefName);
        $fermata.voiceWidth += 25;
        if ($fermata.attributes.keys.mode !== null) {
          var keySign = Fermata.Mapping.Clef.Sign.getVexflow($fermata.attributes.keys.fifths, $fermata.attributes.keys.mode);
          new Vex.Flow.KeySignature(keySign).addToStave($fermata.vexStaves[i]);
        }
        
        $fermata.vexStaves[i].addTimeSignature($fermata.attributes.beat.beats + '/' + $fermata.attributes.beat.type);
        $fermata.voiceWidth += 25;
      }
      else {
        $fermata.vexStaves[i].clef = clefName;
      }
    }

    for (var staffIdx = 1 ; staffIdx < $fermata.vexNotes.length ; staffIdx++) {
      for (var voiceIdx in $fermata.vexNotes[staffIdx]) {
        if ($fermata.vexNotes[staffIdx].hasOwnProperty(voiceIdx)) {
          var voice = new Vex.Flow.Voice({
            num_beats: measure.$fermata.attributes.beat.beats,
            beat_value: measure.$fermata.attributes.beat.type,
            resolution: Vex.Flow.RESOLUTION
          });
          voice.addTickables($fermata.vexNotes[staffIdx][voiceIdx]);
          // Add notes to voice
          // Format and justify the notes to 500 pixels
          var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], /*measure.note.length * 50*/ measure.$width - $fermata.voiceWidth - 15);
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
