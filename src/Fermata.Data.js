(function () {
  "use strict";

  Fermata.Data = function (score) {
    this.score = Fermata.Utils.Clone(score) || {};
    this.scoreCache = { part: null }; // derivated score object for faster access

    // Init new score
    if (this.score['score-partwise'] === undefined) {
      this.score['score-partwise'] = {'$version': '3.0', 'part-list': {'score-part': null}};
    }
  };

  Fermata.Data.cacheParts = {
    IDX: 0,
    ID: 1,
    NAME: 2
  };

  Fermata.Data.prototype = {
    // Cache fncs
    cacheParts: function () {
      var cur, cached, i;

      // Index with 'part' idx, ids and names
      this.scoreCache.part = { idx: [], id: {}, name: {} };
      for (i = 0 ; i < this.score['score-partwise']['part-list']['score-part'].length ; ++i) {
        cur = this.score['score-partwise']['part-list']['score-part'][i];
        cached = {id: cur.$id, name: cur['part-name'], measure: null};

        this.scoreCache.part.id[cur.$id] = cached;
        this.scoreCache.part.name[cur['part-name']] = cached;
        this.scoreCache.part.idx.push(cached);
      }

      // Cache fast access to mesures
      for (i = 0 ; i < this.score['score-partwise'].part.length ; ++i) {
        cur = this.score['score-partwise'].part[i];
        this.scoreCache.part.id[cur.$id].measure = cur.measure;
      }

      return this.scoreCache.part;
    },

    // Getters
    getScorePartWise: function () { return this.score['score-partwise']; },
    getParts: function () { return this.scoreCache.part || this.cacheParts(); },
    getPart: function (id, type) {
      // Refresh cache
      if (this.scoreCache.part === null) {
        this.cacheParts();
      }

      // Get by type (Fermata.Data.cacheParts)
      if (type !== undefined) {
        if      (type === Fermata.Data.cacheParts.IDX) { return this.scoreCache.part.idx[id]; }
        else if (type === Fermata.Data.cacheParts.ID) { return this.scoreCache.part.id[id]; }
        else if (type === Fermata.Data.cacheParts.NAME) { return this.scoreCache.part.name[id]; }
      }
      // Get without type (getPart with type is preferred for performance reasons)
      else {
        if      (this.scoreCache.part.idx[id] !== undefined) { return this.scoreCache.part.idx[id]; }
        else if (this.scoreCache.part.id[id] !== undefined) { return this.scoreCache.part.id[id]; }
        else if (this.scoreCache.part.name[id] !== undefined) { return this.scoreCache.part.name[id]; }
      }
    },
    forEachPart: function (callback) {
      // Refresh cache
      if (this.scoreCache.part === null) {
        this.cacheParts();
      }

      for (var i = 0 ; i < this.scoreCache.part.idx.length ; i++) {
        callback(this.scoreCache.part.idx[i], i);
      }
    }
  };

}).call(this);