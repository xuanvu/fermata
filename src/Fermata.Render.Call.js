(function () {
  "use strict";

  Fermata.Render.prototype.FuncTypes = {
    $0n: '*',
    $1n: '+',
    $01: '?',
    $1: 'default'
  };



  var camelCaseHandler = function (c) {
    return c[1].toUpperCase();
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
    // p -> { object, processes, ctx }
    if (p === 'undefined' || typeof(p) !== 'object') {
      return false;
    }

    // Default context
    if (p.ctx === undefined) {
      p.ctx = this;
    }

    if (p.out === undefined) {
      p.out = p.object;
    }

    // Execute processes
    for (var i = 0; i < p.processes.length; i++)
    {
      var process = p.processes[i];

      var _arguments = [];
      if (arguments.length > 1) {
        for (var j = 1; j < arguments.length; j++) {
          _arguments.push(arguments[j]);
        }
      }

      // Helpers
      if (typeof(process.dataType) !== 'undefined') {
        if (typeof(process._key) === 'undefined') {
          if (typeof(process.dataKey) === 'undefined' || process.dataKey ===
                  'CamelCase') {
            process._key = process.key.replace(/-([a-z])/g, camelCaseHandler);
          }
          else if (typeof(process.dataKey) === 'string') {
            process._key = process.dataKey;
          }
          else {
            process._key = process.key;
          }
        }
        parseDataType(p, process);
      }
      //jshint +loopfunc

      // if (typeof(process.func) !== 'function') {
      //   console.warn('Fermata.Render.Call: No function defined for process', process);
      //   continue;
      // }

      // 0 to n
      if (process.type === this.FuncTypes.$0n) {
        if (typeof(p.object[process.key]) !== "undefined") {
          this.callProcessMultiple(p.object[process.key], p.ctx, process.func, _arguments);
        }
      }
      // 1 to n
      else if (process.type === this.FuncTypes.$1n) {
        this.callProcessMultiple(p.object[process.key], p.ctx, process.func, _arguments);
      }
      // 0 or 1
      else if (process.type === this.FuncTypes.$01) {
        if (typeof(p.object[process.key]) !== "undefined") {
          _arguments.unshift(p.object[process.key]);
          process.func.apply(p.ctx, _arguments);
        }
      }
      // 1
      else if (process.type === this.FuncTypes.$1) {
        _arguments.unshift(p.object[process.key]);
        process.func.apply(p.ctx, _arguments);
      }
    }
  };

  var parseDataType = function (parameter, process) {
    switch (process.dataType) {
      case 'string':
        process.func = function (str) {
          parameter.out[process._key] = typeof(parameter.object[process.key]) ===
                  'string' ? parameter.object[process.key] : '';
        };
        break;
      case 'int':
        process.func = function (str) {
          if (typeof(parameter.object[process.key]) === 'number') {
            parameter.out[process._key] = parameter.object[process.key];
          }
          else if (typeof(parameter.object[process.key]) === 'string') {
            parameter.out[process._key] = parseInt(parameter.object[process.key], 10);
          }
          else {
            parameter.out[process._key] = 0;
          }
        };
        break;
      case 'bool':
        process.func = function (str) {
          if (typeof(parameter.object) === 'boolean') {
            parameter.out[process._key] = parameter.object[process.key];
          }
          else if (parameter.object === 'yes') {
            parameter.out[process._key] = true;
          }
          else {
            parameter.out[process._key] = false;
          }
        };
        break;
    }
  };

  Fermata.Render.prototype.callProcessMultiple = function (child, _this, func, _arguments)
  {
    if (Object.prototype.toString.call(child) !== '[object Array]') {
      _arguments.unshift(child, 0);
      func.apply(_this, _arguments);
    }
    else {
      for (var i = 0; i < child.length; i++) {
        var _argumentsOne = [child[i], i];
        for (var j = 0; j < _arguments.length; j++) {
          _argumentsOne.push(_arguments[j]);
        }

        func.apply(_this, _argumentsOne);
      }
    }
  };
}).call(this);
