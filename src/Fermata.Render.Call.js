/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var Fermata = Fermata || {};

(function () {
  "use strict";

  Fermata.Render.prototype.FuncTypes =
  {
    $0n: '*',
    $1n: '+',
    $01: '?',
    $1: 'default'
  };

  /**
   * object is the node of interest
   * processes is an array of objects:
   * {type, key, func}
   * type is the number of apparitions of the object
   * key is the key of the child element.
   * func is the function to apply to the child elements
   */
  Fermata.Render.prototype.exploreSubNodes = function (p)
  {
    if (p === 'undefined' || typeof(p) !== 'object') {
      return false;
    }

    // p -> { object, processes, ctx }

    // Default context
    if (p.ctx === undefined) {
      p.ctx = this;
    }

    // Execute processes
    for (var i = 0 ; i < p.processes.length ; i++)
    {
      var process = p.processes[i];
      console.log(process);

      var _arguments = [];
      if (arguments.length > 1) {
        for (var j = 1 ; j < arguments.length ; j++) {
          _arguments.push(arguments[j]);
        }
      }

      // console.log('process', process, arguments, _arguments);

      // 0 to n
      if (process.type === this.FuncTypes.$0n) {
        if (typeof(p.object[process.key]) !== "undefined") {
          this.callProcessMultiple(p.object[process.key], p.ctx, process.func, _arguments);
        }
      }
      // 0 or 1
      else if (process.type === this.FuncTypes.$01) {
        if (typeof(p.object[process.key]) !== "undefined") {
          _arguments.unshift(p.object[process.key]);
          process.func.apply(p.ctx, _arguments);
        }
      }
      // 1 to n
      else if (process.type === this.FuncTypes.$1n) {
        this.callProcessMultiple(p.object[process.key], p.ctx, process.func, _arguments);
      }
      // 1
      else if (process.type === this.FuncTypes.$1) {
        _arguments.unshift(p.object[process.key]);
        process.func.apply(p.ctx, _arguments);
      }
    }
  };

  Fermata.Render.prototype.callProcessMultiple = function (child, _this, func, _arguments)
  {
    if (Object.prototype.toString.call(child) !== '[object Array]') {
      _arguments.unshift(child);
      // console.log('callProcessMultiple', _arguments);
      func.apply(_this, _arguments);
    }
    else {
      _arguments.unshift(child);
      for (var i = 0 ; i < child.length ; i++) {
        var _argumentsOne = [child[i], i];
        for (var j = 0 ; j < _arguments.length ; j++) {
          _argumentsOne.push(_arguments[j]);
        }

        // console.log('_argumentsOne', _argumentsOne);

        func.apply(_this, _argumentsOne);
      }
    }
  };
  
}).call(this);
