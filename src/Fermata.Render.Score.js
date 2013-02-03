var Fermata = Fermata || {};

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
    { key: "attributes", type: _render.FuncTypes.$0n, func: _render.renderAttributes },
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
    this.exploreSubNodes(scoreHeader, this.renderScoreHeaderProcess, this);
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
    { key: "attributes", type: _render.FuncTypes.$0n, func: _render.renderAttributes },
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
    measure.$fermata = { vexNotes: [] };

    // TODO: Need to store it ?
    // var index = 0;
    // this.noteData = [];
    // for (var pos in this.staves) {
    //   if (pos == partId)
    //     break;
    //   index += this.staves[pos].length;
    // }

    // Stave
    this.renderMeasureAttributes(measure);

    // Measure content
    this.exploreSubNodes(measure, this.renderMeasureProcess, this);

    // TODO widths of measures
    // for (var i = 0; i < this.Attributesdata.stave; i++)
    // {
    //   if (this.staves[partId][i] === undefined) {
    //     this.staves[partId][i] = [];
    //     if (i > 0)
    //       index++;
    //   }
    //   if (this.staves[partId][i].length === 0 ||  this.staves[partId][i][measureId] === undefined && measureId >= this.staves[partId][i].length) {
    //     if (measureId === 0) {
    //       this.staves[partId][i].push(new Vex.Flow.Stave(20, 0 + index * 100, 100 + measure.note.length * 50));
    //     }
    //     else {
    //       this.staves[partId][i].push(new Vex.Flow.Stave(this.staves[partId][i][this.staves[partId][i].length - 1].x + this.staves[partId][i][this.staves[partId][i].length - 1].width,
    //         this.staves[partId][i][this.staves[partId][i].length - 1].y, measure.note.length * 50));
    //     }
    //   }

    //   // Draw clef and time if needing
    //   var clefName = Fermata.Mapping.Clef.getVexflow(this.Attributesdata.clef[i].sign);
    //   if (measureId  === 0 || clefName !== this.staves[partId][i][measureId - 1].clef)
    //   {
    //     this.staves[partId][i][measureId].addClef(clefName);
    //     if (this.Attributesdata.keys.mode !== null) {
    //       var keySign = Fermata.Mapping.Clef.Sign.getVexflow(this.Attributesdata.keys.fifths, this.Attributesdata.keys.mode);
    //       new Vex.Flow.KeySignature(keySign).addToStave(this.staves[partId][i][measureId]);
    //     }
    //     //this.staves[partId][measureId].addTimeSignature(Fermata.Mapping.Clef.getVexflow(this.Attributesdata.beat.beats)[this.Attributesdata.beat.type]);
    //     this.staves[partId][i][measureId].addTimeSignature(this.Attributesdata.beat.beats + '/' + this.Attributesdata.beat.type);
    //   }
    //   else
    //     this.staves[partId][i][measureId].clef = clefName;
    //   this.staves[partId][i][measureId].setContext(this.ctx);
    //   this.staves[partId][i][measureId].draw();

    //   // Draw line in case of sytem
    //   if (this.Attributesdata.stave > 1)
    //   {
    //     var line = new Vex.Flow.StaveConnector(this.staves[partId][0][measureId], this.staves[partId][i][measureId]);
    //     line.setType(Vex.Flow.StaveConnector.type.SINGLE);
    //     line.setContext(this.ctx);
    //     line.draw();
    //   }
    // }

    // // Draw connector if needed
    // if (this.Attributesdata.stave > 1)
    // {
    //   var connector = new Vex.Flow.StaveConnector(this.staves[partId][this.Attributesdata.partSymbol.topStaff - 1][0], this.staves[partId][this.Attributesdata.partSymbol.bottomStaff - 1][0]); 
    //   connector.setType(Fermata.Mapping.Connector.getVexflow(this.Attributesdata.partSymbol.symbol));
    //   connector.setContext(this.ctx);
    //   connector.draw();
    // }

    // // Then Add note to their voice, format them and draw it
    // for (var staffIdx = 1 ; staffIdx < this.noteData.length ; staffIdx++) {
    //   for (var voiceIdx in this.noteData[staffIdx]) {
    //     var voice = new Vex.Flow.Voice({
    //       num_beats: this.Attributesdata.beat.beats,
    //       beat_value: this.Attributesdata.beat.type,
    //       resolution: Vex.Flow.RESOLUTION
    //     });
    //     voice.addTickables(this.noteData[staffIdx][voiceIdx]);
    //     // Add notes to voice
    //     // Format and justify the notes to 500 pixels
    //     var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], measure.note.length * 50);
    //     voice.draw(this.ctx, this.staves[partId][staffIdx - 1][measureId]);
    //   }
    // }
    // for (i = 0; i < this.renderDirectionData.length; i++) {
    //   var data = this.renderDirectionData[i];
    //   var tmpNote = {
    //     first_note : this.getNote(data.noteAfter),
    //     last_note : this.getNote(data.noteBefore)
    //   };
    //   var hp = new Vex.Flow.StaveHairpin(tmpNote, Fermata.Mapping.Direction.getVexflow(data.type));
    //   hp.setContext(this.ctx);
    //   hp.setPosition(Fermata.Mapping.Direction.getVexflow(this.renderDirectionData.placement));
    //   hp.draw();
    //   if (i === this.renderDirectionData.length -1 ) {
    //     this.renderDirectionData = [];
    //   }
    // }
    delete this.cur;
  };

  Fermata.Render.prototype.renderMeasureAttributes = function(measure)
  {
    //TODO : do the rest
    var number = measure.$number;
    var implicit = false;
    var nonControlling = false;
    var width = 0; //TODO: default value unknown. We have to lnow which one it is


    //TODO: refactor the verification
    if (typeof(measure.implicit) !== "undefined") {
      if (measure.implicit === "yes") {
        implicit = true;
      }
      else if (measure.implicit !== "no") {
      //invalid value
      //TODO: should we raise an exception ?
      }
    }

    if (typeof(measure["non-controlling"]) !== "undefined") {
      if (measure["non-controlling"] === "yes") {
        nonControlling = true;
      }
      else if (measure["non-controlling"] !== "no") {
      //invalid value
      //TODO: should we raise an exception ?
      }
    }

    if (typeof(measure.width) !== "undefined") {
      width = measure.width; //TODO: check if the value is a number
    }
  };

}).call(this);
