var Fermata = Fermata || {};

(function () {
  "use strict";

  Fermata.Drawer.prototype.drawAll = function () {
    var i;

    // TODO
    // this.renderScoreHeader(this.data.getScorePartWise());

    // for (var i = 0; i < this.PartListData.length; i++) {
    //   // this.staves[this.PartListData[i].id] = [];
    //   this.container.height += 100;
    // }
    for (i = 0 ; i < this.parts.idx.length ; i++) {
      this.staves[i] = [];
      this.container.height += 100;
      this.drawPart(this.parts.idx[i], i);
    }

    // draw line between each part drawn
    if (this.parts.idx.length > 1)
    {
      var info = Fermata.Utils.FirstLast(this.staves);
      var line = new Vex.Flow.StaveConnector(this.staves[info.first][0][0], this.staves[info.last][this.staves[info.last].length - 1][0]);
      line.setType(Vex.Flow.StaveConnector.type.SINGLE);
      line.setContext(this.ctx);
      line.draw();
    }
  };

  Fermata.Drawer.prototype.drawPart = function (part, partIdx)
  {
    for (var i = 0 ; i < part.measure.length ; ++i) {
      this.drawMeasure(part.measure[i], i, partIdx);
    }
  };

  Fermata.Drawer.prototype.drawMeasure = function (measure, measureIdx, partIdx)
  {
    // TODO: Need to store it ?
    var index = 0;
    for (var pos in this.staves) {
      if (pos == partIdx)
        break;
      index += this.staves[pos].length;
    }


    // TODO widths of measures
    for (var i = 0; i < measure.$fermata.attributes.stave; i++)
    {
      if (this.staves[partIdx][i] === undefined) {
        this.staves[partIdx][i] = [];
        if (i > 0)
          index++;
      }
      if (this.staves[partIdx][i].length === 0 ||  this.staves[partIdx][i][measureIdx] === undefined && measureIdx >= this.staves[partIdx][i].length) {
        if (measureIdx === 0) {
          this.staves[partIdx][i].push(new Vex.Flow.Stave(20, 0 + index * 100, 100 + measure.note.length * 50));
        }
        else {
          this.staves[partIdx][i].push(new Vex.Flow.Stave(this.staves[partIdx][i][this.staves[partIdx][i].length - 1].x + this.staves[partIdx][i][this.staves[partIdx][i].length - 1].width,
            this.staves[partIdx][i][this.staves[partIdx][i].length - 1].y, measure.note.length * 50));
        }
      }

      // Draw clef and time if needing
      var clefName = Fermata.Mapping.Clef.getVexflow(measure.$fermata.attributes.clef[i].sign);
      if (measureIdx  === 0 || clefName !== this.staves[partIdx][i][measureIdx - 1].clef)
      {
        this.staves[partIdx][i][measureIdx].addClef(clefName);
        if (measure.$fermata.attributes.keys.mode !== null) {
          var keySign = Fermata.Mapping.Clef.Sign.getVexflow(measure.$fermata.attributes.keys.fifths, measure.$fermata.attributes.keys.mode);
          new Vex.Flow.KeySignature(keySign).addToStave(this.staves[partIdx][i][measureIdx]);
        }
        //this.staves[partIdx][measureIdx].addTimeSignature(Fermata.Mapping.Clef.getVexflow(measure.$fermata.attributes.beat.beats)[measure.$fermata.attributes.beat.type]);
        this.staves[partIdx][i][measureIdx].addTimeSignature(measure.$fermata.attributes.beat.beats + '/' + measure.$fermata.attributes.beat.type);
      }
      else {
        this.staves[partIdx][i][measureIdx].clef = clefName;
      }
      this.staves[partIdx][i][measureIdx].setContext(this.ctx);
      this.staves[partIdx][i][measureIdx].draw();

      // Draw line in case of sytem
      if (measure.$fermata.attributes.stave > 1)
      {
        var line = new Vex.Flow.StaveConnector(this.staves[partIdx][0][measureIdx], this.staves[partIdx][i][measureIdx]);
        line.setType(Vex.Flow.StaveConnector.type.SINGLE);
        line.setContext(this.ctx);
        line.draw();
      }
    }

    // Draw connector if needed
    if (measure.$fermata.attributes.stave > 1)
    {
      var connector = new Vex.Flow.StaveConnector(this.staves[partIdx][measure.$fermata.attributes.partSymbol.topStaff - 1][0], this.staves[partIdx][measure.$fermata.attributes.partSymbol.bottomStaff - 1][0]); 
      connector.setType(Fermata.Mapping.Connector.getVexflow(measure.$fermata.attributes.partSymbol.symbol));
      connector.setContext(this.ctx);
      connector.draw();
    }

    // Then Add note to their voice, format them and draw it
    for (var staffIdx = 1 ; staffIdx < measure.$fermata.vexNotes.length ; staffIdx++) {
      for (var voiceIdx in measure.$fermata.vexNotes[staffIdx]) {
        var voice = new Vex.Flow.Voice({
          num_beats: measure.$fermata.attributes.beat.beats,
          beat_value: measure.$fermata.attributes.beat.type,
          resolution: Vex.Flow.RESOLUTION
        });
        voice.addTickables(measure.$fermata.vexNotes[staffIdx][voiceIdx]);
        // Add notes to voice
        // Format and justify the notes to 500 pixels
        var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], measure.note.length * 50);
        voice.draw(this.ctx, this.staves[partIdx][staffIdx - 1][measureIdx]);
      }
    }
    // TODO: clean & mv renderDirectionData
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
  };
}).call(this);
