(function () {
  "use strict";

  Fermata.Data = function (score) {
    this.score = Fermata.Utils.Clone(score) || {};
    this.scoreCache = {part: null}; // derivated score object for faster access

    // Init new score
    if (this.score['score-partwise'] === undefined) {
      this.score['score-partwise'] = {'$version': '3.0', 'part-list': {'score-part': null}};
    }
  };

  var CacheParts = Fermata.Data.cacheParts = {
    IDX: 0,
    ID: 1,
    NAME: 2
  };

  Fermata.Data.prototype = {
    // Cache fncs
    cacheParts: function () {
      var cur, cached, i, parts;

      // Index with 'part' idx, ids and names
      this.scoreCache.part = {idx: [], id: {}, name: {}};
      parts = this.score['score-partwise']['part-list']['score-part'];

      for (i = 0; i < parts.length; ++i) {
        cur = parts[i];
        cached = {id: cur.$id, name: cur['part-name'], measure: null};

        this.scoreCache.part.id[cur.$id] = cached;
        this.scoreCache.part.name[cur['part-name']] = cached;
        this.scoreCache.part.idx.push(cached);
      }

      // Cache fast access to mesures
      for (i = 0; i < this.score['score-partwise'].part.length; ++i) {
        cur = this.score['score-partwise'].part[i];
        this.scoreCache.part.id[cur.$id].measure = cur.measure;
      }

      return this.scoreCache.part;
    },
    // Getters
    getScorePartWise: function () {
      return this.score['score-partwise'];
    },
    getParts: function () {
      return this.scoreCache.part || this.cacheParts();
    },
    getPart: function (id, type) {
      // Refresh cache
      if (this.scoreCache.part === null) {
        this.cacheParts();
      }

      // Get by type (Fermata.Data.cacheParts)
      if (type !== undefined) {
        if (type === CacheParts.IDX) {
          return this.scoreCache.part.idx[id];
        }
        else if (type === CacheParts.ID) {
          return this.scoreCache.part.id[id];
        }
        else if (type === CacheParts.NAME) {
          return this.scoreCache.part.name[id];
        }
      }
      // Get without type (getPart with type is preferred for performance reasons)
      else {
        if (this.scoreCache.part.idx[id] !== undefined) {
          return this.scoreCache.part.idx[id];
        }
        else if (this.scoreCache.part.id[id] !== undefined) {
          return this.scoreCache.part.id[id];
        }
        else if (this.scoreCache.part.name[id] !== undefined) {
          return this.scoreCache.part.name[id];
        }
      }
    },
    forEachPart: function (callback) {
      // Refresh cache
      if (this.scoreCache.part === null) {
        this.cacheParts();
      }

      for (var i = 0; i < this.scoreCache.part.idx.length; i++) {
        callback(this.scoreCache.part.idx[i], i);
      }
    },
    setBeat: function (measure_idx, beat) {
      for (var i = 0, len = this.score['score-partwise'].part.length; i <
              len; i++) {
        this.score['score-partwise'].part[i].measure[measure_idx].attributes[0].time.beats = beat +
                '';
      }
    },
    setBeatType: function (measure_idx, beatType) {
      for (var i = 0, len = this.score['score-partwise'].part.length; i <
              len; i++) {
        this.score['score-partwise'].part[i].measure[measure_idx].attributes[0].time['beat-type'] = beatType +
                '';
      }
    },
    setFifths: function (measure_idx, fifths) {
      for (var i = 0, len = this.score['score-partwise'].part.length; i <
              len; i++) {
        this.score['score-partwise'].part[i].measure[measure_idx].attributes[0].key.fifths = fifths +
                '';
      }
    },
    setTitle: function (title) {
      this.score['score-partwise']['movement-title'] = title + '';
    },
    reconstructAttributes: function () {
      for (var i = 0; i < this.getParts().idx.length; i++) {
        var part = this.getPart(i, CacheParts.IDX);
        var measures = part.measures;
        for (var i = 0; i < measures.length; i++) {
          var measure = measures[i];
        }
      }
    }
  };

}).call(this);