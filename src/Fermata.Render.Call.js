/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var Fermata = Fermata || {};

(function () {
  "use strict";

  Fermata.Render.prototype.FuncTypes =
  {
    STAR: "*",
    PLUS: "+",
    QUESTION: "?",
    DEFAULT: "default"
  };

  /**
   * object is the node of interest
   * processes is an array of objects:
   * {type, key, func}
   * type is the number of apparitions of the object
   * key is the key of the child element.
   * func is the function to apply to the child elements
   */
  Fermata.Render.prototype.exploreSubNodes = function (object, processes, _this)
  {
    // Default context
    if (_this === undefined) {
      _this = this;
    }

    // Execute processes
    for (var i = 0 ; i < processes.length ; i++)
    {
      var process = processes[i];

      // 0 to n
      if (process.type === this.FuncTypes.STAR) {
        if (typeof(object[process.key]) !== "undefined") {
          this.callProcessMultiple(object[process.key], _this, process.func);
        }
      }
      // 0 or 1
      else if (process.type === this.FuncTypes.QUESTION) {
        if (typeof(object[process.key]) !== "undefined") {
          process.func.call(_this, object[process.key]);
        }
      }
      // 1 to n
      else if (process.type === this.FuncTypes.PLUS) {
        this.callProcessMultiple(object[process.key], _this, process.func);
      }
      // 1
      else if (process.type === this.FuncTypes.DEFAULT) {
        process.func.call(_this, object[process.key]);
      }
    }
  };

  Fermata.Render.prototype.callProcessMultiple = function (child, _this, func)
  {
    if (Object.prototype.toString.call(child) !== '[object Array]') {
      func.call(_this, child);
    }
    else {
      for (var i = 0 ; i < child.length ; i++) {
        func.call(_this, child[i], i);
      }
    }
  };
  
}).call(this);
