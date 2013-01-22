var Fermata = Fermata || {};

(function () {
  "use strict";

  Fermata.Render.prototype.renderAll = function () {
    this.renderScoreHeader(this.data.getScorePartWise());
    for (var i = 0; i < this.PartListData.length; i++) {
      this.staves[this.PartListData[i].id] = new Array();
      this.container.height += 100;
    }
    var parts = this.data.getParts();

    for (var i = 0 ; i < parts.idx.length ; i++) {
      var part = parts.idx[i];
      this.renderPart(part);
    }
    // draw line between each part drawn
    if (parts.idx.length > 1)
    {
      var info = Fermata.Utils.FirstLast(this.staves);
      var line = new Vex.Flow.StaveConnector(this.staves[info.first][0][0], this.staves[info.last][this.staves[info.last].length - 1][0]);
      line.setType(Vex.Flow.StaveConnector.type.SINGLE);
      line.setContext(this.ctx);
      line.draw();
    }
    this.render()
;  };

  Fermata.Render.prototype.render = function () {
    
  };

  //Note: info in score element
  Fermata.Render.prototype.renderScorePartwise = function (scorePartwise)
  {
    var _this = this;
    var processes = [
      {
        key: "part",
        type: this.FuncTypes.PLUS,
        func: function () {
          _this.renderPart();
        }
      }
    ];

    this.exploreSubNodes(scorePartwise, processes);
  };

  Fermata.Render.prototype.renderScoreHeader = function (scoreHeader)
  {
    var _this = this;
    var processes = [
      {
        key: "part-list",
        type: this.FuncTypes.DEFAULT,
        func: function (arg) {
          _this.renderPartList(arg) }
      },
      {
        key: "work",
        type: this.FuncTypes.QUESTION,
        func: function (arg) {
          _this.renderPartList(arg) }
      },
      {
        key: "movement-number",
        type: this.FuncTypes.QUESTION,
        func: function (arg) {
          _this.renderHeaderMovNum(arg) }
      },
      {
        key: "movement-title",
        type: this.FuncTypes.QUESTION,
        func: function (arg) {
          _this.renderHeaderMovTitle(arg)
        }
      },
      {
        key: "identification",
        type: this.FuncTypes.QUESTION,
        func: function (arg) {
          _this.renderHeaderIdentifi(arg)
        }
      },
      {
        key: "defaults",
        type: this.FuncTypes.QUESTION,
        func: function (arg) {
          _this.RenderHeaderdefaults(arg)
        }
      },
      {
        key: "credit",
        type: this.FuncTypes.STAR,
        func: function (arg) {
          _this.RenderHeaderCredit(arg)
        }
      }
    ];

    this.exploreSubNodes(scoreHeader, processes);
  };

  Fermata.Render.prototype.renderPart = function (part)
  {
    var _this = this;
    var processes = [
      {
        key: "measure",
        type: this.FuncTypes.PLUS,
        func: function (arg, idx) {
          _this.renderMeasure(arg, idx, part.id);
        }
      }
    ];

    this.exploreSubNodes(part, processes);
  };

  Fermata.Render.prototype.renderPrint = function (print)
  {
    return;
  };

  Fermata.Render.prototype.renderMeasureProcess = [
    {
      key: "attributes",
      type: Fermata.Render.prototype.FuncTypes.STAR,
      func: Fermata.Render.prototype.renderAttributes
    },
    {
      key: "note",
      type: Fermata.Render.prototype.FuncTypes.QUESTION,
      func: Fermata.Render.prototype.renderNotes
    },
    {
      key: "backup",
      type: Fermata.Render.prototype.FuncTypes.STAR,
      func: Fermata.Render.prototype.Renderbackup
    },
    {
      key: "forward",
      type: Fermata.Render.prototype.FuncTypes.STAR,
      func: null//TODO implement this function
    },
    {
      key: "direction",
      type: Fermata.Render.prototype.FuncTypes.STAR,
      func: Fermata.Render.prototype.renderDirection
    },
    {
      key: "harmony",
      type: Fermata.Render.prototype.FuncTypes.STAR,
      func: Fermata.Render.prototype.renderHarmony
    },
    {
      key: "figured-bass",
      type: Fermata.Render.prototype.FuncTypes.STAR,
      func: null//TODO implement this function
    },
    {
      key: "print",
      type: Fermata.Render.prototype.FuncTypes.STAR,
      func: Fermata.Render.prototype.renderPrint
    },
    {
      key: "sound",
      type: Fermata.Render.prototype.FuncTypes.STAR,
      func: null//TODO implement this function
    },
    {
      key: "barline",
      type: Fermata.Render.prototype.FuncTypes.STAR,
      func: Fermata.Render.prototype.renderBarline
    },
    {
      key: "grouping",
      type: Fermata.Render.prototype.FuncTypes.STAR,
      func: null//TODO implement this function
    },
    {
      key: "link",
      type: Fermata.Render.prototype.FuncTypes.STAR,
      func: null//TODO implement this function
    },
    {
      key: "bookmark",
      type: Fermata.Render.prototype.FuncTypes.STAR,
      func: null//TODO implement this function
    }
  ];


  Fermata.Render.prototype.renderMeasure = function (measure, measureId, partId)
  {
    // TODO: Need to store it ?
    var index = 0;
    this.noteData = [];
    for (var pos in this.staves) {
      if (pos == partId)
        break;
      index += this.staves[pos].length;
    }
    // Stave
    this.renderMeasureAttributes(measure);

    // Measure content
    this.exploreSubNodes(measure, this.renderMeasureProcess, this);

    // TODO widths of measures
    for (var i = 0; i < this.Attributesdata.stave; i++)
    {
      if (this.staves[partId][i] === undefined) {
        this.staves[partId][i] = new Array();
        if (i > 0)
          index++;
      }
      if (this.staves[partId][i].length === 0 ||  this.staves[partId][i][measureId] === undefined && measureId >= this.staves[partId][i].length) {
        if (measureId === 0) {
          this.staves[partId][i].push(new Vex.Flow.Stave(20, 0 + index * 100, 100 + measure.note.length * 50));
          }
        else {
          this.staves[partId][i].push(new Vex.Flow.Stave(this.staves[partId][i][this.staves[partId][i].length - 1].x + this.staves[partId][i][this.staves[partId][i].length - 1].width,
                                              this.staves[partId][i][this.staves[partId][i].length - 1].y, measure.note.length * 50));
        }
      }

      // Draw clef and time if needing
      var clefName = Fermata.Mapping.Clef.getVexflow(this.Attributesdata.clef[i].sign);
      if (measureId  === 0 || clefName !== this.staves[partId][i][measureId - 1].clef)
      {
       this.staves[partId][i][measureId].addClef(clefName);

        if (this.Attributesdata.keys.mode !== null) {
          var keySign = Fermata.Mapping.Clef.Sign.getVexflow(this.Attributesdata.keys.fifths, this.Attributesdata.keys.mode);
          new Vex.Flow.KeySignature(keySign).addToStave(this.staves[partId][i][measureId]);

        // this.staves[partId][measureId].addTimeSignature(Fermata.Mapping.Clef.getVexflow(this.Attributesdata.beat.beats)[this.Attributesdata.beat.type]);
        this.staves[partId][i][measureId].addTimeSignature(this.Attributesdata.beat.beats + '/' + this.Attributesdata.beat.type);
        }
      }
      else
        this.staves[partId][i][measureId].clef = clefName;
      this.staves[partId][i][measureId].setContext(this.ctx);
      this.staves[partId][i][measureId].draw();

       // Draw connector if needed
      if (i === this.Attributesdata.stave - 1 && this.Attributesdata.stave > 1)
      {
       var connector = new Vex.Flow.StaveConnector(this.staves[partId][this.Attributesdata.partSymbol.topStaff - 1][0], this.staves[partId][this.Attributesdata.partSymbol.bottomStaff - 1][0]); 
       connector.setType(Fermata.Mapping.Connector.getVexflow(this.Attributesdata.partSymbol.symbol));
       connector.setContext(this.ctx);
       connector.draw();
      }
    }
    // Then Add note to their voice, format them and draw it
    for (var i = 1 ; i < this.noteData.length ; i++) {
      for (var toto in this.noteData[i]) {
        var voice = new Vex.Flow.Voice({
        num_beats: this.Attributesdata.beat.beats,
        beat_value: this.Attributesdata.beat.type,
        resolution: Vex.Flow.RESOLUTION
        });
        voice.addTickables(this.noteData[i][toto]);
        // Add notes to voice
        // Format and justify the notes to 500 pixels
      var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], measure.note.length * 50);
      voice.draw(this.ctx, this.staves[partId][i - 1][measureId]);
      }
    }

    if (this.renderDirectionData.type !== null) {
      var tmpNote = {
        first_note : this.noteData[this.renderDirectionData.voice][this.renderDirectionData.noteBefore],
        last_note : this.noteData[this.renderDirectionData.voice][this.renderDirectionData.noteAfter]
      };

      var hp = new Vex.Flow.StaveHairpin(tmpNote, Fermata.Mapping.Direction.getVexflow(this.renderDirectionData.type));
      hp.setContext(this.ctx);
      hp.setPosition(Fermata.Mapping.Direction.getVexflow(this.renderDirectionData.placement));
      hp.draw();
    }
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