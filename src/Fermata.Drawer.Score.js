(function () {
  "use strict";

  Fermata.Drawer.PART_HEIGHT = 100;
  var _render = Fermata.Render.prototype;

  Fermata.Drawer.prototype.drawAll = function () {
    // Todo: precalcul in render
    this.container.height += this.parts.idx.length * Fermata.Drawer.PART_HEIGHT;

    for (var i = 0 ; i < this.parts.idx.length ; i++) {
      this.staves[i] = [];
      this.drawPart(this.parts.idx[i], i);
    }

    // draw line between each part drawn
    if (this.parts.idx.length > 1)
    {

      var lastPartlastMeasure = this.parts.idx[this.parts.idx.length - 1].measure[this.parts.idx[this.parts.idx.length - 1].measure.length - 1];
      // var info = Fermata.Utils.FirstLast(this.staves);
      var line = new Vex.Flow.StaveConnector(this.parts.idx[0].measure[0].$fermata.vexStaves[0],
        lastPartlastMeasure.$fermata.vexStaves[lastPartlastMeasure.$fermata.vexStaves.length - 1]);
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
    // console.log(measure, measureIdx);

    // TODO: Need to store it ?
    // Use for (;;;)
    // var index = 0;
    // for (var pos in this.staves) {
    //   if (this.staves.hasOwnProperty(pos)) {
    //     if (pos === partIdx) {
    //       break;
    //     }
    //     index += this.staves[pos].length;
    //   }
    // }

    // TODO widths of measures
    var i;
    for (i = 0; i < measure.$fermata.attributes.staves; i++)
    {
      // if (this.staves[partIdx][i] === undefined) {
      //   this.staves[partIdx][i] = [];
      //   if (i > 0) {
      //     index++;
      //   }
      // }
      // if (this.staves[partIdx][i].length === 0 ||  this.staves[partIdx][i][measureIdx] === undefined && measureIdx >= this.staves[partIdx][i].length) {
      //   if (measureIdx === 0) {
      //     this.staves[partIdx][i].push(new Vex.Flow.Stave(20, 0 + index * 100, 100 + measure.note.length * 50));
      //   }
      //   else {
      //     this.staves[partIdx][i].push(new Vex.Flow.Stave(this.staves[partIdx][i][this.staves[partIdx][i].length - 1].x + this.staves[partIdx][i][this.staves[partIdx][i].length - 1].width,
      //       this.staves[partIdx][i][this.staves[partIdx][i].length - 1].y, measure.note.length * 50));
      //   }
      // }

      // // Draw clef and time if needing
      // var clefName = Fermata.Mapping.Clef.getVexflow(measure.$fermata.attributes.clef[i].sign);
      // if (measureIdx  === 0 || clefName !== this.staves[partIdx][i][measureIdx - 1].clef)
      // {
      //   this.staves[partIdx][i][measureIdx].addClef(clefName);
      //   if (measure.$fermata.attributes.keys.mode !== null) {
      //     var keySign = Fermata.Mapping.Clef.Sign.getVexflow(measure.$fermata.attributes.keys.fifths, measure.$fermata.attributes.keys.mode);
      //     new Vex.Flow.KeySignature(keySign).addToStave(this.staves[partIdx][i][measureIdx]);
      //   }
      //   //this.staves[partIdx][measureIdx].addTimeSignature(Fermata.Mapping.Clef.getVexflow(measure.$fermata.attributes.beat.beats)[measure.$fermata.attributes.beat.type]);
      //   this.staves[partIdx][i][measureIdx].addTimeSignature(measure.$fermata.attributes.beat.beats + '/' + measure.$fermata.attributes.beat.type);
      // }
      // else {
      //   this.staves[partIdx][i][measureIdx].clef = clefName;
      // }

      if (measure.$fermata.barline !== undefined)
      {
        // console.log(measure.$fermata.barline);
        for (var u = 0; u < measure.$fermata.barline.length; u++) {
          var _barline = measure.$fermata.barline[u];
          var type = 'normal';
          if (_barline.repeat.direction !== null) {
            type = _barline.repeat.direction;
          }
          switch (_barline.location) {
          case 'right':
            measure.$fermata.vexStaves[i].setEndBarType(Fermata.Mapping.Barline.getVexflow(type, _barline.barStyle));
            break;
          case 'left':
            measure.$fermata.vexStaves[i].setBegBarType(Fermata.Mapping.Barline.getVexflow(type, _barline.barStyle));
            break;
          default:
            break;
          }
        }
      }

      // console.log('STAVE', measure.$fermata);
      measure.$fermata.vexStaves[i].setContext(this.ctx);
      measure.$fermata.vexStaves[i].draw();

      // Draw line in case of sytem
      if (measure.$fermata.attributes.staves > 1 /*&& measure.$fermata.barline === undefined*/) // <== Faudra m'expliquer ca.
      {
        var line = new Vex.Flow.StaveConnector(measure.$fermata.vexStaves[0], measure.$fermata.vexStaves[i]);
        line.setType(Vex.Flow.StaveConnector.type.SINGLE);
        line.setContext(this.ctx);
        line.draw();
      }
    }

    // Draw connector if needed
    if (measureIdx === 0 && measure.$fermata.attributes.staves > 1)
    {
      var connector = new Vex.Flow.StaveConnector(measure.$fermata.vexStaves[measure.$fermata.attributes.partSymbol.topStaff - 1], measure.$fermata.vexStaves[measure.$fermata.attributes.partSymbol.bottomStaff - 1]);
      connector.setType(Fermata.Mapping.Connector.getVexflow(measure.$fermata.attributes.partSymbol.symbol));
      connector.setContext(this.ctx);
      connector.draw();
    }

    // Then Add note to their voice, format them and draw it
    // for (var staffIdx = 1 ; staffIdx < measure.$fermata.vexNotes.length ; staffIdx++) {
    //   for (var voiceIdx in measure.$fermata.vexNotes[staffIdx]) {
    //     if (measure.$fermata.vexNotes[staffIdx].hasOwnProperty(voiceIdx)) {
    //       var voice = new Vex.Flow.Voice({
    //         num_beats: measure.$fermata.attributes.beat.beats,
    //         beat_value: measure.$fermata.attributes.beat.type,
    //         resolution: Vex.Flow.RESOLUTION
    //       });
    //       voice.addTickables(measure.$fermata.vexNotes[staffIdx][voiceIdx]);
    //       // Add notes to voice
    //       // Format and justify the notes to 500 pixels
    //       var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], measure.note.length * 50);
    //       voice.draw(this.ctx, this.staves[partIdx][staffIdx - 1][measureIdx]);
    //     }
    //   }
    // }

    // console.log(measure.$fermata.vexVoices);
    for (i = 0 ; i < measure.$fermata.vexVoices.length ; ++i) {
      // console.log(measure.$fermata.vexVoices[i]);
      measure.$fermata.vexVoices[i].draw(this.ctx, measure.$fermata.vexStaves[i]);
    }

    for (i = 0 ; i < measure.$fermata.vexHairpin.length ; ++i) {
      measure.$fermata.vexHairpin[i].setContext(this.ctx);
      measure.$fermata.vexHairpin[i].draw();
    }

    this.drawBeam(measure);
  };

  Fermata.Drawer.prototype.getGoodPos =  function (noteOne, noteTwo, renderOption, first) {
    if (noteOne !== 0 && noteTwo !== 0 && noteOne !== noteTwo) {
      if (first) {
          // renderOption.left_shift_px -= 40;
        return noteOne;
      }
      else {
          // renderOption.right_shift_px += 40;
        return noteTwo;
      }
    }
    if (noteTwo === 0) {
      return noteOne;
    }
    if (noteOne === 0) {
      return noteTwo;
    }
  };

  Fermata.Drawer.prototype.drawBeam = function (measure)
  {
    for (var i = 0 ; i < measure.$fermata.vexBeams.length ; ++i) {
      var vexBeam = measure.$fermata.vexBeams[i];

      vexBeam.setContext(this.ctx).draw();
    }
  };

  Fermata.Drawer.prototype.AddNotation = function (text, hJustifcation, vJustifcation) {
    var ret = new Vex.Flow.Annotation(text).setFont("Arial", Vex.Flow.Test.Font.size).setJustification(hJustifcation).setVerticalJustification(vJustifcation);
    return ret;
  };

}).call(this);
