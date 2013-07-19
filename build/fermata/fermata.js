/*

 VexFlow Engraver 1.0-pre2
 A library for rendering musical notation and guitar tablature in HTML5.

                    http://www.vexflow.com

 Copyright (c) 2010 Mohit Muthanna Cheppudira <mohit@muthanna.com>

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 This library makes use of Simon Tatham's awesome font - Gonville.

 Build ID: debug-4@84161de73e7898406094c22c081bfc597c832090
 Build date: 2013-07-19 02:50:28.530346

*/
function Vex() {
}
if(typeof module !== "undefined") {
  module.exports = Vex
}
if(typeof document !== "undefined") {
  Vex.document = document
}else {
  if(typeof require !== "undefined") {
    try {
      Vex.documentRequire = require;
      Vex.document = Vex.documentRequire("jsdom").jsdom()
    }catch(e) {
    }
  }
}
Vex.Debug = true;
Vex.LogLevels = {DEBUG:5, INFO:4, WARN:3, ERROR:2, FATAL:1};
Vex.LogLevel = 5;
Vex.LogMessage = function(level, message) {
  if(level <= Vex.LogLevel && window.console) {
    var log_message = message;
    if(typeof message == "object") {
      log_message = {level:level, message:message}
    }else {
      log_message = "VexLog: [" + level + "] " + log_message
    }
    window.console.log(log_message)
  }
};
Vex.LogDebug = function(message) {
  Vex.LogMessage(Vex.LogLevels.DEBUG, message)
};
Vex.LogInfo = function(message) {
  Vex.LogMessage(Vex.LogLevels.INFO, message)
};
Vex.LogWarn = function(message) {
  Vex.LogMessage(Vex.LogLevels.WARN, message)
};
Vex.LogError = function(message) {
  Vex.LogMessage(Vex.LogLevels.ERROR, message)
};
Vex.LogFatal = function(message, exception) {
  Vex.LogMessage(Vex.LogLevels.FATAL, message);
  if(exception) {
    throw exception;
  }else {
    throw"VexFatalError";
  }
};
Vex.Log = Vex.LogDebug;
Vex.L = Vex.LogDebug;
Vex.AssertException = function(message) {
  this.message = message
};
Vex.AssertException.prototype.toString = function() {
  return"AssertException: " + this.message
};
Vex.Assert = function(exp, message) {
  if(Vex.Debug && !exp) {
    if(!message) {
      message = "Assertion failed."
    }
    throw new Vex.AssertException(message);
  }
};
Vex.RuntimeError = function(code, message) {
  this.code = code;
  this.message = message
};
Vex.RuntimeError.prototype.toString = function() {
  return"RuntimeError: " + this.message
};
Vex.RERR = Vex.RuntimeError;
Vex.Merge = function(destination, source) {
  for(var property in source) {
    destination[property] = source[property]
  }
  return destination
};
Vex.Min = function(a, b) {
  return a > b ? b : a
};
Vex.Max = function(a, b) {
  return a > b ? a : b
};
Vex.SortAndUnique = function(arr, cmp, eq) {
  if(arr.length > 1) {
    var newArr = [];
    var last;
    arr.sort(cmp);
    for(var i = 0;i < arr.length;++i) {
      if(i == 0 || !eq(arr[i], last)) {
        newArr.push(arr[i])
      }
      last = arr[i]
    }
    return newArr
  }else {
    return arr
  }
};
Vex.Contains = function(a, obj) {
  var i = a.length;
  while(i--) {
    if(a[i] === obj) {
      return true
    }
  }
  return false
};
Vex.getCanvasContext = function(canvas_sel) {
  if(!canvas_sel) {
    throw new Vex.RERR("BadArgument", "Invalid canvas selector: " + canvas_sel);
  }
  var canvas = Vex.document.getElementById(canvas_sel);
  if(!(canvas && canvas.getContext)) {
    throw new Vex.RERR("UnsupportedBrowserError", "This browser does not support HTML5 Canvas");
  }
  return canvas.getContext("2d")
};
Vex.drawDot = function(ctx, x, y, color) {
  var c = color || "#f55";
  ctx.save();
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
  ctx.restore()
};
Vex.BM = function(s, f) {
  var start_time = (new Date).getTime();
  f();
  var elapsed = (new Date).getTime() - start_time;
  Vex.L(s + elapsed + "ms")
};
Vex.Flow = {};
Vex.Flow.RESOLUTION = 16384;
Vex.Flow.IsKerned = true;
Vex.Flow.Fraction = function(numerator, denominator) {
  this.set(numerator, denominator)
};
Vex.Flow.Fraction.prototype.constructor = Vex.Flow.Fraction;
Vex.Flow.Fraction.prototype.set = function(numerator, denominator) {
  this.numerator = numerator === undefined ? 1 : numerator;
  this.denominator = denominator === undefined ? 1 : denominator;
  return this
};
Vex.Flow.Fraction.prototype.value = function() {
  return this.numerator / this.denominator
};
Vex.Flow.Fraction.prototype.simplify = function() {
  var u = this.numerator;
  var d = this.denominator;
  var gcd = Vex.Flow.Fraction.GCD(u, d);
  u /= gcd;
  d /= gcd;
  if(d < 0) {
    d = -d;
    u = -u
  }
  return this.set(u, d)
};
Vex.Flow.Fraction.prototype.add = function(param1, param2) {
  var otherNumerator;
  var otherDenominator;
  if(param1 instanceof Vex.Flow.Fraction) {
    otherNumerator = param1.numerator;
    otherDenominator = param1.denominator
  }else {
    if(param1 !== undefined) {
      otherNumerator = param1
    }else {
      otherNumerator = 0
    }
    if(param2 !== undefined) {
      otherDenominator = param2
    }else {
      otherDenominator = 1
    }
  }
  var lcm = Vex.Flow.Fraction.LCM(this.denominator, otherDenominator);
  var a = lcm / this.denominator;
  var b = lcm / otherDenominator;
  var u = this.numerator * a + otherNumerator * b;
  return this.set(u, lcm)
};
Vex.Flow.Fraction.prototype.subtract = function(param1, param2) {
  var otherNumerator;
  var otherDenominator;
  if(param1 instanceof Vex.Flow.Fraction) {
    otherNumerator = param1.numerator;
    otherDenominator = param1.denominator
  }else {
    if(param1 !== undefined) {
      otherNumerator = param1
    }else {
      otherNumerator = 0
    }
    if(param2 !== undefined) {
      otherDenominator = param2
    }else {
      otherDenominator = 1
    }
  }
  var lcm = Vex.Flow.Fraction.LCM(this.denominator, otherDenominator);
  var a = lcm / this.denominator;
  var b = lcm / otherDenominator;
  var u = this.numerator * a - otherNumerator * b;
  return this.set(u, lcm)
};
Vex.Flow.Fraction.prototype.multiply = function(param1, param2) {
  var otherNumerator;
  var otherDenominator;
  if(param1 instanceof Vex.Flow.Fraction) {
    otherNumerator = param1.numerator;
    otherDenominator = param1.denominator
  }else {
    if(param1 !== undefined) {
      otherNumerator = param1
    }else {
      otherNumerator = 1
    }
    if(param2 !== undefined) {
      otherDenominator = param2
    }else {
      otherDenominator = 1
    }
  }
  return this.set(this.numerator * otherNumerator, this.denominator * otherDenominator)
};
Vex.Flow.Fraction.prototype.divide = function(param1, param2) {
  var otherNumerator;
  var otherDenominator;
  if(param1 instanceof Vex.Flow.Fraction) {
    otherNumerator = param1.numerator;
    otherDenominator = param1.denominator
  }else {
    if(param1 !== undefined) {
      otherNumerator = param1
    }else {
      otherNumerator = 1
    }
    if(param2 !== undefined) {
      otherDenominator = param2
    }else {
      otherDenominator = 1
    }
  }
  return this.set(this.numerator * otherDenominator, this.denominator * otherNumerator)
};
Vex.Flow.Fraction.__compareA = new Vex.Flow.Fraction;
Vex.Flow.Fraction.__compareB = new Vex.Flow.Fraction;
Vex.Flow.Fraction.__tmp = new Vex.Flow.Fraction;
Vex.Flow.Fraction.prototype.equals = function(compare) {
  var a = Vex.Flow.Fraction.__compareA.copy(compare).simplify();
  var b = Vex.Flow.Fraction.__compareB.copy(this).simplify();
  return a.numerator === b.numerator && a.denominator === b.denominator
};
Vex.Flow.Fraction.prototype.clone = function() {
  return new Vex.Flow.Fraction(this.numerator, this.denominator)
};
Vex.Flow.Fraction.prototype.copy = function(copy) {
  return this.set(copy.numerator, copy.denominator)
};
Vex.Flow.Fraction.prototype.quotient = function() {
  return Math.floor(this.numerator / this.denominator)
};
Vex.Flow.Fraction.prototype.fraction = function() {
  return this.numerator % this.denominator
};
Vex.Flow.Fraction.prototype.abs = function() {
  this.denominator = Math.abs(this.denominator);
  this.numerator = Math.abs(this.numerator);
  return this
};
Vex.Flow.Fraction.prototype.toString = function() {
  return this.numerator + "/" + this.denominator
};
Vex.Flow.Fraction.prototype.toSimplifiedString = function() {
  return Vex.Flow.Fraction.__tmp.copy(this).simplify().toString()
};
Vex.Flow.Fraction.prototype.toMixedString = function() {
  var s = "";
  var q = this.quotient();
  var f = Vex.Flow.Fraction.__tmp.copy(this);
  if(q < 0) {
    f.abs().fraction()
  }else {
    f.fraction()
  }
  if(q !== 0) {
    s += q;
    if(f.numerator !== 0) {
      s += " " + f.toSimplifiedString()
    }
  }else {
    if(f.numerator === 0) {
      s = "0"
    }else {
      s = f.toSimplifiedString()
    }
  }
  return s
};
Vex.Flow.Fraction.prototype.parse = function(str) {
  var i = str.split("/");
  var n = parseInt(i[0], 0);
  var d = i[1] ? parseInt(i[1], 0) : 1;
  return this.set(n, d)
};
Vex.Flow.Fraction.GCD = function(a, b) {
  if(typeof a !== "number" || typeof b !== "number") {
    throw new Vex.RERR("BadArgument", "Invalid numbers: " + a + ", " + b);
  }
  var t;
  while(b != 0) {
    t = b;
    b = a % b;
    a = t
  }
  return a
};
Vex.Flow.Fraction.LCM = function(a, b) {
  return a * b / Vex.Flow.Fraction.GCD(a, b)
};
Vex.Flow.Fraction.LCMM = function(args) {
  if(args.length == 0) {
    return 0
  }else {
    if(args.length == 1) {
      return args[0]
    }else {
      if(args.length == 2) {
        return Vex.Flow.Fraction.LCM(args[0], args[1])
      }else {
        var arg0 = args[0];
        args.shift();
        return Vex.Flow.Fraction.LCM(arg0, Vex.Flow.Fraction.LCMM(args))
      }
    }
  }
};
Vex.Flow.clefProperties = function(clef) {
  if(!clef) {
    throw new Vex.RERR("BadArgument", "Invalid clef: " + clef);
  }
  var props = Vex.Flow.clefProperties.values[clef];
  if(!props) {
    throw new Vex.RERR("BadArgument", "Invalid clef: " + clef);
  }
  return props
};
Vex.Flow.clefProperties.values = {"treble":{line_shift:0}, "bass":{line_shift:6}, "tenor":{line_shift:4}, "alto":{line_shift:3}, "percussion":{line_shift:0}};
Vex.Flow.keyProperties = function(key, clef) {
  if(clef === undefined) {
    clef = "treble"
  }
  var pieces = key.split("/");
  if(pieces.length < 2) {
    throw new Vex.RERR("BadArguments", "Key must have note + octave and an optional glyph: " + key);
  }
  var k = pieces[0].toUpperCase();
  var value = Vex.Flow.keyProperties.note_values[k];
  if(!value) {
    throw new Vex.RERR("BadArguments", "Invalid key name: " + k);
  }
  if(value.octave) {
    pieces[1] = value.octave
  }
  var o = pieces[1];
  var base_index = o * 7 - 4 * 7;
  var line = (base_index + value.index) / 2;
  line += Vex.Flow.clefProperties(clef).line_shift;
  var stroke = 0;
  if(line <= 0 && line * 2 % 2 == 0) {
    stroke = 1
  }
  if(line >= 6 && line * 2 % 2 == 0) {
    stroke = -1
  }
  var int_value = typeof value.int_val != "undefined" ? o * 12 + value.int_val : null;
  var code = value.code;
  var shift_right = value.shift_right;
  if(pieces.length > 2 && pieces[2]) {
    var glyph_name = pieces[2].toUpperCase();
    var note_glyph = Vex.Flow.keyProperties.note_glyph[glyph_name];
    if(note_glyph) {
      code = note_glyph.code;
      shift_right = note_glyph.shift_right
    }
  }
  return{key:k, octave:o, line:line, int_value:int_value, accidental:value.accidental, code:code, stroke:stroke, shift_right:shift_right, displaced:false}
};
Vex.Flow.keyProperties.note_values = {"C":{index:0, int_val:0, accidental:null}, "CN":{index:0, int_val:0, accidental:"n"}, "C#":{index:0, int_val:1, accidental:"#"}, "C##":{index:0, int_val:2, accidental:"##"}, "CB":{index:0, int_val:-1, accidental:"b"}, "CBB":{index:0, int_val:-2, accidental:"bb"}, "D":{index:1, int_val:2, accidental:null}, "DN":{index:1, int_val:2, accidental:"n"}, "D#":{index:1, int_val:3, accidental:"#"}, "D##":{index:1, int_val:4, accidental:"##"}, "DB":{index:1, int_val:1, 
accidental:"b"}, "DBB":{index:1, int_val:0, accidental:"bb"}, "E":{index:2, int_val:4, accidental:null}, "EN":{index:2, int_val:4, accidental:"n"}, "E#":{index:2, int_val:5, accidental:"#"}, "E##":{index:2, int_val:6, accidental:"##"}, "EB":{index:2, int_val:3, accidental:"b"}, "EBB":{index:2, int_val:2, accidental:"bb"}, "F":{index:3, int_val:5, accidental:null}, "FN":{index:3, int_val:5, accidental:"n"}, "F#":{index:3, int_val:6, accidental:"#"}, "F##":{index:3, int_val:7, accidental:"##"}, "FB":{index:3, 
int_val:4, accidental:"b"}, "FBB":{index:3, int_val:3, accidental:"bb"}, "G":{index:4, int_val:7, accidental:null}, "GN":{index:4, int_val:7, accidental:"n"}, "G#":{index:4, int_val:8, accidental:"#"}, "G##":{index:4, int_val:9, accidental:"##"}, "GB":{index:4, int_val:6, accidental:"b"}, "GBB":{index:4, int_val:5, accidental:"bb"}, "A":{index:5, int_val:9, accidental:null}, "AN":{index:5, int_val:9, accidental:"n"}, "A#":{index:5, int_val:10, accidental:"#"}, "A##":{index:5, int_val:11, accidental:"##"}, 
"AB":{index:5, int_val:8, accidental:"b"}, "ABB":{index:5, int_val:7, accidental:"bb"}, "B":{index:6, int_val:11, accidental:null}, "BN":{index:6, int_val:11, accidental:"n"}, "B#":{index:6, int_val:12, accidental:"#"}, "B##":{index:6, int_val:13, accidental:"##"}, "BB":{index:6, int_val:10, accidental:"b"}, "BBB":{index:6, int_val:9, accidental:"bb"}, "R":{index:6, int_val:9, rest:true}, "X":{index:6, accidental:"", octave:4, code:"v3e", shift_right:5.5}};
Vex.Flow.keyProperties.note_glyph = {"D0":{code:"v27", shift_right:-0.5}, "D1":{code:"v2d", shift_right:-0.5}, "D2":{code:"v22", shift_right:-0.5}, "D3":{code:"v70", shift_right:-0.5}, "T0":{code:"v49", shift_right:-2}, "T1":{code:"v93", shift_right:0.5}, "T2":{code:"v40", shift_right:0.5}, "T3":{code:"v7d", shift_right:0.5}, "X0":{code:"v92", shift_right:-2}, "X1":{code:"v95", shift_right:-0.5}, "X2":{code:"v7f", shift_right:0.5}, "X3":{code:"v3b", shift_right:-2}};
Vex.Flow.integerToNote = function(integer) {
  if(typeof integer == "undefined") {
    throw new Vex.RERR("BadArguments", "Undefined integer for integerToNote");
  }
  if(integer < -2) {
    throw new Vex.RERR("BadArguments", "integerToNote requires integer > -2: " + integer);
  }
  var noteValue = Vex.Flow.integerToNote.table[integer];
  if(!noteValue) {
    throw new Vex.RERR("BadArguments", "Unkown note value for integer: " + integer);
  }
  return noteValue
};
Vex.Flow.integerToNote.table = {0:"C", 1:"C#", 2:"D", 3:"D#", 4:"E", 5:"F", 6:"F#", 7:"G", 8:"G#", 9:"A", 10:"A#", 11:"B"};
Vex.Flow.tabToGlyph = function(fret) {
  var glyph = null;
  var width = 0;
  var shift_y = 0;
  if(fret.toString().toUpperCase() == "X") {
    glyph = "v7f";
    width = 7;
    shift_y = -4.5
  }else {
    width = Vex.Flow.textWidth(fret.toString())
  }
  return{text:fret, code:glyph, width:width, shift_y:shift_y}
};
Vex.Flow.textWidth = function(text) {
  return 6 * text.toString().length
};
Vex.Flow.articulationCodes = function(artic) {
  return Vex.Flow.articulationCodes.articulations[artic]
};
Vex.Flow.articulationCodes.articulations = {"a.":{code:"v23", width:4, shift_right:-2, shift_up:0, shift_down:0}, "av":{code:"v28", width:4, shift_right:0, shift_up:2, shift_down:5}, "a>":{code:"v42", width:10, shift_right:5, shift_up:-2, shift_down:2}, "a-":{code:"v25", width:9, shift_right:-4, shift_up:8, shift_down:10}, "a^":{code:"va", width:8, shift_right:0, shift_up:-10, shift_down:-1}, "a+":{code:"v8b", width:9, shift_right:-4, shift_up:6, shift_down:12}, "ao":{code:"v94", width:8, shift_right:0, 
shift_up:-4, shift_down:4}, "ah":{code:"vb9", width:7, shift_right:0, shift_up:-4, shift_down:4}, "a@a":{code:"v43", width:25, shift_right:0, shift_up:5, shift_down:0}, "a@u":{code:"v5b", width:25, shift_right:0, shift_up:0, shift_down:-3}, "a|":{code:"v75", width:8, shift_right:0, shift_up:0, shift_down:11}, "am":{code:"v97", width:13, shift_right:0, shift_up:0, shift_down:14}, "a,":{code:"vb3", width:6, shift_right:8, shift_up:-4, shift_down:4}};
Vex.Flow.accidentalCodes = function(acc) {
  return Vex.Flow.accidentalCodes.accidentals[acc]
};
Vex.Flow.accidentalCodes.accidentals = {"#":{code:"v18", width:10, shift_right:0, shift_down:0}, "##":{code:"v7f", width:13, shift_right:-1, shift_down:0}, "b":{code:"v44", width:8, shift_right:0, shift_down:0}, "bb":{code:"v26", width:14, shift_right:-3, shift_down:0}, "n":{code:"v4e", width:8, shift_right:0, shift_down:0}};
Vex.Flow.keySignature = function(spec) {
  var keySpec = Vex.Flow.keySignature.keySpecs[spec];
  if(keySpec == undefined) {
    throw new Vex.RERR("BadKeySignature", "Bad key signature spec: '" + spec + "'");
  }
  if(!keySpec.acc) {
    return[]
  }
  var code = Vex.Flow.accidentalCodes.accidentals[keySpec.acc].code;
  var notes = Vex.Flow.keySignature.accidentalList(keySpec.acc);
  var acc_list = new Array;
  for(var i = 0;i < keySpec.num;++i) {
    var line = notes[i];
    acc_list.push({glyphCode:code, line:line})
  }
  return acc_list
};
Vex.Flow.keySignature.keySpecs = {"C":{acc:null, num:0}, "Am":{acc:null, num:0}, "F":{acc:"b", num:1}, "Dm":{acc:"b", num:1}, "Bb":{acc:"b", num:2}, "Gm":{acc:"b", num:2}, "Eb":{acc:"b", num:3}, "Cm":{acc:"b", num:3}, "Ab":{acc:"b", num:4}, "Fm":{acc:"b", num:4}, "Db":{acc:"b", num:5}, "Bbm":{acc:"b", num:5}, "Gb":{acc:"b", num:6}, "Ebm":{acc:"b", num:6}, "Cb":{acc:"b", num:7}, "Abm":{acc:"b", num:7}, "G":{acc:"#", num:1}, "Em":{acc:"#", num:1}, "D":{acc:"#", num:2}, "Bm":{acc:"#", num:2}, "A":{acc:"#", 
num:3}, "F#m":{acc:"#", num:3}, "E":{acc:"#", num:4}, "C#m":{acc:"#", num:4}, "B":{acc:"#", num:5}, "G#m":{acc:"#", num:5}, "F#":{acc:"#", num:6}, "D#m":{acc:"#", num:6}, "C#":{acc:"#", num:7}, "A#m":{acc:"#", num:7}};
Vex.Flow.keySignature.accidentalList = function(acc) {
  if(acc == "b") {
    return[2, 0.5, 2.5, 1, 3, 1.5, 3.5]
  }else {
    if(acc == "#") {
      return[0, 1.5, -0.5, 1, 2.5, 0.5, 2]
    }
  }
};
Vex.Flow.parseNoteDurationString = function(durationString) {
  if(typeof durationString !== "string") {
    return null
  }
  var regexp = /(\d+|[a-z])(d*)([nrhms]|$)/;
  var result = regexp.exec(durationString);
  if(!result) {
    return null
  }
  var duration = result[1];
  var dots = result[2].length;
  var type = result[3];
  if(type.length === 0) {
    type = "n"
  }
  return{duration:duration, dots:dots, type:type}
};
Vex.Flow.parseNoteData = function(noteData) {
  var duration = noteData.duration;
  var durationStringData = Vex.Flow.parseNoteDurationString(duration);
  if(!durationStringData) {
    return null
  }
  var ticks = Vex.Flow.durationToTicks(durationStringData.duration);
  if(ticks == null) {
    return null
  }
  var type = noteData.type;
  if(type) {
    if(!(type === "n" || type === "r" || type === "h" || type === "m" || type === "s")) {
      return null
    }
  }else {
    type = durationStringData.type;
    if(!type) {
      type = "n"
    }
  }
  var dots = 0;
  if(noteData.dots) {
    dots = noteData.dots
  }else {
    dots = durationStringData.dots
  }
  if(typeof dots !== "number") {
    return null
  }
  var currentTicks = ticks;
  for(var i = 0;i < dots;i++) {
    if(currentTicks <= 1) {
      return null
    }
    currentTicks = currentTicks / 2;
    ticks += currentTicks
  }
  return{duration:durationStringData.duration, type:type, dots:dots, ticks:ticks}
};
Vex.Flow.durationToTicks = function(duration) {
  var alias = Vex.Flow.durationAliases[duration];
  if(alias !== undefined) {
    duration = alias
  }
  var ticks = Vex.Flow.durationToTicks.durations[duration];
  if(ticks === undefined) {
    return null
  }
  return ticks
};
Vex.Flow.durationToTicks.durations = {1:Vex.Flow.RESOLUTION / 1, 2:Vex.Flow.RESOLUTION / 2, 4:Vex.Flow.RESOLUTION / 4, 8:Vex.Flow.RESOLUTION / 8, 16:Vex.Flow.RESOLUTION / 16, 32:Vex.Flow.RESOLUTION / 32, 64:Vex.Flow.RESOLUTION / 64, 256:Vex.Flow.RESOLUTION / 256};
Vex.Flow.durationAliases = {"w":"1", "h":"2", "q":"4", "b":"256"};
Vex.Flow.durationToGlyph = function(duration, type) {
  var alias = Vex.Flow.durationAliases[duration];
  if(alias !== undefined) {
    duration = alias
  }
  var code = Vex.Flow.durationToGlyph.duration_codes[duration];
  if(code === undefined) {
    return null
  }
  if(!type) {
    type = "n"
  }
  glyphTypeProperties = code.type[type];
  if(glyphTypeProperties === undefined) {
    return null
  }
  return Vex.Merge(Vex.Merge({}, code.common), glyphTypeProperties)
};
Vex.Flow.durationToGlyph.duration_codes = {1:{common:{head_width:16.5, stem:false, stem_offset:0, flag:false}, type:{"n":{code_head:"v1d"}, "h":{code_head:"v46"}, "m":{code_head:"v92", stem_offset:-3}, "r":{code_head:"v5c", head_width:10.5, rest:true, position:"D/5"}, "s":{head_width:15, position:"B/4"}}}, 2:{common:{head_width:10.5, stem:true, stem_offset:0, flag:false}, type:{"n":{code_head:"v81"}, "h":{code_head:"v2d"}, "m":{code_head:"v95", stem_offset:-3}, "r":{code_head:"vc", stem:false, rest:true, 
position:"B/4"}, "s":{head_width:15, position:"B/4"}}}, 4:{common:{head_width:10.5, stem:true, stem_offset:0, flag:false}, type:{"n":{code_head:"vb"}, "h":{code_head:"v22"}, "m":{code_head:"v3e", stem_offset:-3}, "r":{code_head:"v7c", stem:false, rest:true, position:"B/4"}, "s":{head_width:15, position:"B/4"}}}, 8:{common:{head_width:10.5, stem:true, stem_offset:0, flag:true, beam_count:1, code_flag_upstem:"v54", code_flag_downstem:"v9a"}, type:{"n":{code_head:"vb"}, "h":{code_head:"v22"}, "m":{code_head:"v3e"}, 
"r":{code_head:"va5", stem:false, flag:false, rest:true, position:"B/4"}, "s":{head_width:15, position:"B/4"}}}, 16:{common:{beam_count:2, head_width:10.5, stem:true, stem_offset:0, flag:true, code_flag_upstem:"v3f", code_flag_downstem:"v8f"}, type:{"n":{code_head:"vb"}, "h":{code_head:"v22"}, "m":{code_head:"v3e"}, "r":{code_head:"v3c", stem:false, flag:false, rest:true, position:"B/4"}, "s":{head_width:15, position:"B/4"}}}, 32:{common:{beam_count:3, head_width:10.5, stem:true, stem_offset:0, flag:true, 
code_flag_upstem:"v47", code_flag_downstem:"v2a"}, type:{"n":{code_head:"vb"}, "h":{code_head:"v22"}, "m":{code_head:"v3e"}, "r":{code_head:"v55", stem:false, flag:false, rest:true, position:"B/4"}, "s":{head_width:15, position:"B/4"}}}, 64:{common:{beam_count:3, head_width:10.5, stem:true, stem_offset:0, flag:true, code_flag_upstem:"va9", code_flag_downstem:"v58"}, type:{"n":{code_head:"vb"}, "h":{code_head:"v22"}, "m":{code_head:"v3e"}, "r":{code_head:"v38", stem:false, flag:false, rest:true, position:"B/4"}, 
"s":{head_width:15, position:"B/4"}}}};
Vex.Flow.TIME4_4 = {num_beats:4, beat_value:4, resolution:Vex.Flow.RESOLUTION};
Vex.Flow.Font = {"glyphs":{"v0":{"x_min":0, "x_max":514.5, "ha":525, "o":"m 236 648 b 246 648 238 648 242 648 b 288 646 261 648 283 648 b 472 513 364 634 428 587 b 514 347 502 464 514 413 b 462 163 514 272 499 217 b 257 44 409 83 333 44 b 50 163 181 44 103 83 b 0 347 14 217 0 272 b 40 513 0 413 12 464 b 236 648 87 591 155 638 m 277 614 b 253 616 273 616 261 616 b 242 616 247 616 243 616 b 170 499 193 609 181 589 b 159 348 163 446 159 398 b 166 222 159 308 161 266 b 201 91 174 138 183 106 b 257 76 215 81 235 76 b 311 91 277 76 299 81 b 347 222 330 106 338 138 b 353 348 352 266 353 308 b 344 499 353 398 351 446 b 277 614 333 587 322 606 m 257 -1 l 258 -1 l 255 -1 l 257 -1 m 257 673 l 258 673 l 255 673 l 257 673 "}, 
"v1":{"x_min":-1.359375, "x_max":344.359375, "ha":351, "o":"m 126 637 l 129 638 l 198 638 l 266 638 l 269 635 b 274 631 272 634 273 632 l 277 627 l 277 395 b 279 156 277 230 277 161 b 329 88 281 123 295 106 b 344 69 341 81 344 79 b 337 55 344 62 343 59 l 333 54 l 197 54 l 61 54 l 58 55 b 50 69 53 59 50 62 b 65 88 50 79 53 81 b 80 97 72 91 74 93 b 117 156 103 113 112 129 b 117 345 117 161 117 222 l 117 528 l 100 503 l 38 406 b 14 383 24 384 23 383 b -1 398 5 383 -1 390 b 4 415 -1 403 1 409 b 16 437 5 416 10 426 l 72 539 l 100 596 b 121 632 119 631 119 631 b 126 637 122 634 125 635 m 171 -1 l 172 -1 l 170 -1 l 171 -1 m 171 673 l 172 673 l 170 673 l 171 673 "}, 
"v2":{"x_min":-1.359375, "x_max":458.6875, "ha":468, "o":"m 197 648 b 216 648 201 648 208 648 b 258 646 232 648 253 648 b 419 546 333 637 393 599 b 432 489 428 528 432 509 b 356 342 432 440 405 384 b 235 278 322 313 288 295 b 69 170 166 256 107 217 b 69 169 69 170 69 169 b 69 169 69 169 69 169 b 74 173 69 169 72 170 b 209 222 112 204 163 222 b 310 195 247 222 274 215 b 371 179 332 184 352 179 b 396 181 379 179 387 179 b 428 202 409 184 423 194 b 442 212 431 209 436 212 b 458 197 450 212 458 206 b 441 148 458 190 449 165 b 299 44 409 84 353 44 b 288 45 295 44 292 44 b 250 61 274 45 268 49 b 122 99 212 86 164 99 b 73 91 104 99 88 97 b 28 63 53 84 34 72 b 14 54 25 56 20 54 b 1 62 9 54 4 56 l -1 65 l -1 79 b 0 99 -1 91 0 95 b 2 113 1 102 2 108 b 164 309 20 197 81 272 b 285 470 232 341 277 398 b 287 487 287 476 287 481 b 171 595 287 551 239 595 b 155 595 166 595 160 595 b 142 592 145 594 142 594 b 145 589 142 592 142 591 b 179 527 168 576 179 551 b 132 455 179 496 163 467 b 104 451 122 452 112 451 b 27 530 62 451 27 487 b 29 555 27 538 27 546 b 197 648 44 601 115 639 m 228 -1 l 230 -1 l 227 -1 l 228 -1 m 228 673 l 230 673 l 227 673 l 228 673 "}, 
"v3":{"x_min":-1.359375, "x_max":409.6875, "ha":418, "o":"m 174 648 b 191 648 176 648 183 648 b 225 648 204 648 220 648 b 402 523 317 638 389 588 b 404 503 404 517 404 510 b 402 484 404 495 404 488 b 264 373 389 437 334 394 b 257 370 259 371 257 371 b 257 370 257 370 257 370 b 264 369 258 370 261 369 b 409 202 359 334 409 267 b 318 72 409 152 381 104 b 200 43 281 52 240 43 b 23 113 134 43 69 68 b 0 169 6 129 0 149 b 77 249 0 210 29 249 l 77 249 b 152 174 125 249 152 212 b 103 102 152 145 137 116 b 103 102 103 102 103 102 b 147 94 103 101 132 95 b 153 94 149 94 151 94 b 265 206 219 94 265 141 b 264 226 265 213 265 219 b 147 355 253 299 204 353 b 126 371 133 356 126 362 b 147 388 126 383 132 388 b 254 474 196 391 238 424 b 259 502 258 484 259 494 b 182 592 259 544 228 582 b 156 595 175 595 166 595 b 115 592 142 595 129 594 l 111 591 l 115 588 b 152 524 141 574 152 549 b 92 449 152 491 130 458 b 76 448 87 448 81 448 b -1 530 32 448 -1 488 b 20 581 -1 548 5 566 b 174 648 55 619 108 641 m 204 -1 l 205 -1 l 202 -1 l 204 -1 m 204 673 l 205 673 l 202 673 l 204 673 "}, 
"v4":{"x_min":0, "x_max":468.21875, "ha":478, "o":"m 174 637 b 232 638 175 638 189 638 b 277 638 245 638 259 638 l 378 638 l 381 635 b 389 623 386 632 389 627 b 382 609 389 617 386 613 b 366 589 381 606 372 598 l 313 528 l 245 451 l 209 410 l 155 348 l 84 267 b 59 240 72 252 59 240 b 59 240 59 240 59 240 b 151 238 59 238 68 238 l 242 238 l 242 303 b 243 371 242 369 242 370 b 289 426 245 374 254 385 l 303 441 l 317 456 l 338 483 l 360 506 l 371 520 b 386 527 375 526 381 527 b 400 519 392 527 397 524 b 401 440 401 516 401 514 b 401 377 401 423 401 402 l 401 238 l 426 238 b 453 237 449 238 450 238 b 465 217 461 234 465 226 b 460 202 465 212 464 206 b 426 197 454 197 453 197 l 401 197 l 401 180 b 451 88 402 129 412 109 b 468 69 465 81 468 79 b 461 55 468 62 466 59 l 458 54 l 321 54 l 185 54 l 182 55 b 175 69 176 59 175 62 b 191 88 175 79 176 81 b 240 180 230 109 240 129 l 240 197 l 125 197 b 73 195 104 195 87 195 b 8 197 10 195 9 197 b 0 212 2 199 0 205 b 0 212 0 212 0 212 b 20 242 0 219 0 219 b 163 610 104 344 163 492 b 174 637 163 628 166 634 m 234 -1 l 235 -1 l 232 -1 l 234 -1 m 234 673 l 235 673 l 232 673 l 234 673 "}, 
"v5":{"x_min":0, "x_max":409.6875, "ha":418, "o":"m 47 637 b 53 638 49 638 50 638 b 69 634 55 638 61 637 b 210 610 114 619 161 610 b 363 634 259 610 311 619 b 382 638 372 637 378 638 b 392 634 386 638 389 637 b 397 623 396 630 397 627 b 393 610 397 620 396 616 b 298 505 368 552 338 520 b 212 494 277 498 246 494 b 65 517 163 494 106 502 b 61 517 62 517 61 517 b 61 517 61 517 61 517 b 51 408 61 517 51 412 b 51 408 51 408 51 408 b 51 408 51 408 51 408 b 61 412 53 408 55 409 b 125 434 80 421 103 430 b 185 441 145 440 166 441 b 409 244 310 441 409 353 b 401 191 409 227 406 209 b 197 43 375 105 287 43 b 159 47 183 43 171 44 b 23 123 112 56 61 86 b 0 180 6 140 0 159 b 76 260 0 220 31 260 b 92 259 81 260 87 259 b 152 183 132 251 152 216 b 100 112 152 152 134 122 b 95 111 98 112 95 111 b 95 111 95 111 95 111 b 129 98 95 109 119 101 b 148 97 136 97 141 97 b 264 235 206 97 261 158 b 265 248 265 240 265 244 b 210 398 265 312 243 373 b 179 408 201 406 194 408 b 174 408 178 408 176 408 b 53 369 130 408 88 394 b 34 359 39 359 38 359 b 17 374 24 359 17 365 b 39 628 17 384 38 625 b 47 637 40 631 43 635 m 204 -1 l 205 -1 l 202 -1 l 204 -1 m 204 673 l 205 673 l 202 673 l 204 673 "}, 
"v6":{"x_min":0, "x_max":475.03125, "ha":485, "o":"m 255 648 b 274 648 259 648 266 648 b 314 646 288 648 307 648 b 450 555 374 637 438 594 b 454 530 453 546 454 538 b 375 451 454 485 416 451 b 328 467 359 451 343 455 b 300 526 310 483 300 503 b 352 598 300 557 319 589 b 356 599 355 598 356 599 b 352 602 356 599 355 601 b 288 616 330 612 308 616 b 210 584 257 616 230 605 b 164 433 189 559 174 508 b 160 374 163 415 160 381 b 160 374 160 374 160 374 b 160 374 160 374 160 374 b 168 377 160 374 164 376 b 258 395 200 390 228 395 b 366 367 294 395 328 387 b 475 223 436 333 475 283 b 472 197 475 215 473 206 b 349 65 462 141 419 95 b 259 43 317 51 288 43 b 167 69 230 43 200 52 b 4 290 80 113 20 195 b 0 349 1 309 0 328 b 20 467 0 391 6 433 b 255 648 58 563 155 637 m 269 363 b 257 363 265 363 261 363 b 210 345 236 363 220 356 b 186 226 196 324 186 272 b 187 198 186 216 186 206 b 213 95 191 151 202 112 b 257 76 221 83 238 76 b 270 77 261 76 266 76 b 321 156 299 81 310 99 b 329 229 326 183 329 206 b 321 301 329 252 326 274 b 269 363 311 342 298 359 m 236 -1 l 238 -1 l 235 -1 l 236 -1 m 236 673 l 238 673 l 235 673 l 236 673 "}, 
"v7":{"x_min":0, "x_max":442.359375, "ha":451, "o":"m 147 648 b 166 649 153 649 160 649 b 313 598 217 649 273 630 b 340 587 323 588 328 587 l 341 587 b 412 628 367 587 390 601 b 427 638 416 635 421 638 b 439 632 431 638 435 637 b 442 623 441 630 442 628 b 430 569 442 616 439 603 b 352 369 408 492 377 410 b 300 259 325 324 313 298 b 273 84 283 205 273 140 b 265 55 273 65 272 59 l 261 54 l 181 54 l 99 54 l 96 55 b 91 61 95 56 92 59 l 89 63 l 89 77 b 147 263 89 133 111 202 b 261 401 176 313 212 355 b 378 541 315 449 349 489 l 382 548 l 375 544 b 240 495 333 512 285 495 b 129 535 198 495 160 509 b 84 560 108 552 95 560 b 76 559 81 560 78 560 b 31 487 59 555 43 530 b 14 470 27 473 24 470 b 1 477 8 470 4 471 l 0 480 l 0 553 l 0 627 l 1 630 b 16 638 4 635 9 638 b 23 635 17 638 20 637 b 49 626 36 626 39 626 b 96 638 59 626 80 630 b 104 639 99 638 102 639 b 117 644 107 641 112 642 b 147 648 125 645 137 648 m 220 -1 l 221 -1 l 219 -1 l 220 -1 m 220 673 l 221 673 l 219 673 l 220 673 "}, 
"v8":{"x_min":0, "x_max":488.640625, "ha":499, "o":"m 217 648 b 245 649 225 648 235 649 b 453 516 343 649 430 595 b 458 478 455 503 458 491 b 412 370 458 440 441 398 b 411 369 412 369 411 369 b 415 365 411 367 412 367 b 488 231 462 331 488 281 b 472 165 488 208 483 186 b 243 43 434 86 338 43 b 63 104 178 43 112 62 b 0 233 20 140 0 186 b 73 365 0 283 24 331 l 77 369 l 72 374 b 29 476 42 406 29 441 b 217 648 29 557 103 635 m 258 605 b 242 606 253 605 247 606 b 157 552 198 606 157 580 b 160 541 157 548 159 544 b 319 413 176 503 242 452 l 337 403 l 338 406 b 359 476 352 428 359 452 b 258 605 359 537 318 595 m 138 326 b 130 330 134 328 130 330 b 130 330 130 330 130 330 b 107 305 127 330 112 313 b 84 231 91 281 84 256 b 243 86 84 156 151 86 b 249 87 245 86 246 87 b 347 156 303 88 347 120 b 344 172 347 162 345 167 b 156 319 325 227 257 281 b 138 326 151 322 144 324 m 243 -1 l 245 -1 l 242 -1 l 243 -1 m 243 673 l 245 673 l 242 673 l 243 673 "}, 
"v9":{"x_min":0, "x_max":475.03125, "ha":485, "o":"m 191 646 b 212 649 198 648 205 649 b 255 644 227 649 243 646 b 458 448 348 616 428 539 b 475 342 469 415 475 378 b 460 244 475 308 469 274 b 193 44 421 124 303 44 b 91 69 157 44 122 51 b 19 161 43 97 19 126 b 21 181 19 167 20 174 b 98 241 32 220 65 241 b 170 186 129 241 160 223 b 172 166 171 179 172 173 b 121 94 172 134 152 102 b 117 93 118 94 117 93 b 121 90 117 93 118 91 b 185 76 142 80 164 76 b 270 119 220 76 251 91 b 308 259 287 145 300 194 b 313 317 310 277 313 310 b 313 317 313 317 313 317 b 313 317 313 317 313 317 b 304 315 313 317 308 316 b 216 295 273 302 245 295 b 145 308 193 295 170 299 b 19 398 88 327 42 360 b 0 469 5 420 0 444 b 24 551 0 496 8 526 b 191 646 54 596 125 637 m 227 614 b 215 616 224 616 220 616 b 202 614 210 616 206 616 b 152 535 174 610 163 592 b 144 463 147 509 144 485 b 152 391 144 440 147 417 b 216 328 163 344 179 328 b 280 391 253 328 269 344 b 288 463 285 417 288 440 b 280 535 288 485 285 509 b 227 614 269 594 258 610 m 236 -1 l 238 -1 l 235 -1 l 236 -1 m 236 673 l 238 673 l 235 673 l 236 673 "}, 
"va":{"x_min":-149.71875, "x_max":148.359375, "ha":151, "o":"m -8 -1 b -1 0 -5 -1 -4 0 b 16 -11 5 0 13 -4 b 83 -186 17 -12 47 -90 l 148 -358 l 148 -363 b 127 -385 148 -376 138 -385 b 112 -378 122 -385 118 -383 b 54 -226 110 -374 114 -385 b 0 -81 24 -147 0 -81 b -55 -226 -1 -81 -25 -147 b -114 -378 -115 -385 -111 -374 b -129 -385 -119 -383 -123 -385 b -149 -363 -140 -385 -149 -376 l -149 -358 l -84 -186 b -19 -11 -49 -90 -19 -12 b -8 -1 -17 -8 -12 -4 "}, "vb":{"x_min":0, "x_max":428.75, "ha":438, 
"o":"m 262 186 b 273 186 266 186 272 186 b 274 186 273 186 274 186 b 285 186 274 186 280 186 b 428 48 375 181 428 122 b 386 -68 428 12 416 -29 b 155 -187 329 -145 236 -187 b 12 -111 92 -187 38 -162 b 0 -51 4 -91 0 -72 b 262 186 0 58 122 179 "}, "vc":{"x_min":0, "x_max":447.8125, "ha":457, "o":"m 0 86 l 0 173 l 223 173 l 447 173 l 447 86 l 447 0 l 223 0 l 0 0 l 0 86 "}, "vf":{"x_min":0, "x_max":370.21875, "ha":378, "o":"m 0 0 l 0 277 l 61 277 l 122 277 l 122 0 l 122 -278 l 61 -278 l 0 -278 l 0 0 m 246 -1 l 246 277 l 308 277 l 370 277 l 370 -1 l 370 -278 l 308 -278 l 246 -278 l 246 -1 "}, 
"v10":{"x_min":0, "x_max":559.421875, "ha":571, "o":"m 5 127 b 14 127 6 127 9 127 b 51 126 25 127 43 127 b 175 98 93 122 138 112 l 186 94 b 279 51 210 86 255 65 b 285 47 280 51 283 48 b 319 27 291 44 311 31 l 326 22 b 359 0 332 19 352 4 l 367 -6 b 371 -9 368 -6 370 -8 l 379 -15 b 387 -22 383 -18 386 -20 l 398 -30 l 411 -40 l 417 -47 l 427 -55 l 434 -61 b 441 -66 436 -62 439 -65 l 446 -72 l 453 -77 l 462 -87 b 558 -188 490 -113 549 -176 b 559 -195 559 -191 559 -194 b 548 -205 559 -201 555 -205 b 541 -204 547 -205 544 -205 b 534 -198 539 -201 536 -199 l 525 -191 b 481 -162 518 -187 490 -167 b 472 -155 477 -159 472 -156 b 468 -152 470 -155 469 -154 b 461 -149 466 -152 464 -151 b 428 -130 454 -145 441 -137 b 371 -99 413 -122 372 -99 b 363 -95 371 -99 367 -98 b 353 -91 357 -94 353 -91 b 348 -90 353 -91 352 -91 b 332 -81 343 -87 341 -86 b 27 -12 230 -37 127 -13 b 0 -5 4 -11 2 -11 b 0 58 0 -2 0 27 b 0 122 0 88 0 120 b 5 127 1 124 4 126 "}, 
"v11":{"x_min":-155.171875, "x_max":153.8125, "ha":157, "o":"m -137 353 b -130 353 -136 353 -133 353 b -112 349 -125 353 -119 352 b -100 342 -110 347 -104 344 b 0 317 -69 326 -35 317 b 111 349 38 317 76 328 b 129 353 117 352 123 353 b 153 327 142 353 153 344 b 144 302 153 320 153 317 b 27 6 93 226 50 113 b 21 -13 24 -11 24 -11 b 0 -26 17 -22 8 -26 b -24 -12 -9 -26 -19 -22 b -28 5 -24 -9 -27 -2 b -145 302 -53 117 -95 224 b -155 327 -155 317 -155 320 b -137 353 -155 340 -148 349 "}, "v18":{"x_min":0, 
"x_max":323.9375, "ha":331, "o":"m 217 535 b 225 537 220 537 221 537 b 245 524 235 537 242 533 l 246 521 l 247 390 l 247 258 l 273 265 b 306 270 288 269 299 270 b 322 259 315 270 319 267 b 323 208 323 256 323 233 b 322 158 323 184 323 159 b 288 140 318 148 315 147 b 247 130 254 131 247 130 b 247 65 247 130 247 104 b 247 20 247 51 247 36 l 247 -88 l 273 -81 b 306 -76 289 -77 299 -76 b 318 -81 311 -76 315 -77 b 323 -123 323 -87 323 -86 l 323 -138 l 323 -154 b 318 -195 323 -191 323 -190 b 269 -210 314 -199 315 -199 b 249 -216 259 -213 250 -216 l 247 -216 l 247 -349 l 246 -483 l 245 -487 b 225 -499 242 -495 234 -499 b 206 -487 219 -499 210 -495 l 205 -483 l 205 -355 l 205 -227 l 204 -227 l 181 -233 l 138 -244 b 117 -249 127 -247 117 -249 b 115 -385 115 -249 115 -256 l 115 -523 l 114 -526 b 95 -538 110 -534 102 -538 b 74 -526 87 -538 78 -534 l 73 -523 l 73 -391 b 72 -260 73 -269 73 -260 b 72 -260 72 -260 72 -260 b 19 -273 61 -263 23 -273 b 0 -260 10 -273 4 -267 b 0 -209 0 -256 0 -256 l 0 -162 l 1 -158 b 61 -134 5 -148 5 -148 l 73 -131 l 73 -22 b 72 86 73 79 73 86 b 72 86 72 86 72 86 b 19 74 61 83 23 74 b 0 86 10 74 4 79 b 0 137 0 90 0 90 l 0 184 l 1 188 b 61 212 5 198 5 198 l 73 215 l 73 348 l 73 481 l 74 485 b 95 498 78 492 87 498 b 103 495 98 498 100 496 b 114 485 107 494 111 489 l 115 481 l 115 353 l 115 226 l 121 226 b 159 235 123 227 141 231 l 198 247 l 205 248 l 205 384 l 205 521 l 206 524 b 217 535 209 528 212 533 m 205 9 b 205 119 205 70 205 119 l 205 119 b 182 113 204 119 194 116 l 138 102 b 117 97 127 99 117 97 b 115 -12 115 97 115 91 l 115 -122 l 121 -120 b 159 -111 123 -119 141 -115 l 198 -101 l 205 -98 l 205 9 "}, 
"v1b":{"x_min":0, "x_max":559.421875, "ha":571, "o":"m 544 204 b 548 204 545 204 547 204 b 559 194 555 204 559 199 b 559 190 559 192 559 191 b 530 156 559 188 556 184 b 462 86 510 134 481 104 b 453 76 458 81 454 77 l 446 70 l 441 65 b 434 59 439 63 436 61 l 427 54 b 409 37 426 51 416 44 b 392 23 398 29 394 26 b 387 19 389 22 387 20 b 379 13 386 19 383 16 l 371 8 l 367 5 l 359 -1 l 337 -16 b 285 -48 319 -29 298 -41 l 279 -52 b 186 -95 255 -66 210 -87 l 175 -99 b 23 -129 127 -117 68 -129 b 17 -129 20 -129 19 -129 b 1 -123 2 -129 2 -129 b 0 -49 0 -122 0 -83 b 0 4 0 -22 0 1 b 27 11 2 9 4 9 b 185 31 78 12 145 20 b 198 34 186 31 193 33 b 314 73 234 44 277 58 b 349 88 328 79 340 84 b 353 90 352 90 353 90 b 363 94 353 90 357 93 b 371 98 367 97 371 98 b 428 129 372 98 413 120 b 461 148 441 136 454 144 b 468 151 464 149 466 151 b 472 154 469 152 470 154 b 481 161 473 155 477 158 b 525 190 490 166 518 186 l 534 197 b 540 201 536 198 539 199 b 544 204 541 202 544 204 "}, 
"v1d":{"x_min":0, "x_max":619.3125, "ha":632, "o":"m 274 184 b 307 186 285 186 296 186 b 616 22 465 186 597 116 b 619 -1 617 13 619 5 b 308 -187 619 -104 483 -187 b 0 -1 133 -187 0 -102 b 5 36 0 11 1 23 b 274 184 29 115 141 176 m 289 161 b 272 162 284 162 277 162 b 171 41 209 162 171 108 b 205 -73 171 5 182 -34 b 345 -163 243 -133 298 -163 b 436 -98 385 -163 420 -142 b 446 -43 443 -80 446 -62 b 289 161 446 47 377 147 "}, "v1e":{"x_min":-402.890625, "x_max":401.53125, "ha":410, "o":"m -219 173 b -213 174 -217 174 -215 174 b -202 173 -209 174 -205 173 b -114 86 -200 172 -179 151 b -28 0 -66 37 -28 0 b 40 84 -28 0 2 37 b 117 174 111 173 110 172 b 122 174 118 174 119 174 b 132 173 125 174 129 173 b 295 11 134 172 171 134 l 307 -1 l 336 34 b 374 76 366 72 368 74 b 381 77 375 77 378 77 b 401 56 392 77 401 68 b 400 48 401 54 401 51 b 223 -172 397 41 230 -166 b 210 -176 220 -174 215 -176 b 201 -174 206 -176 204 -176 b 112 -87 198 -173 178 -152 b 27 0 65 -38 27 0 b -42 -86 27 0 -4 -38 b -118 -174 -112 -174 -111 -173 b -123 -176 -119 -176 -121 -176 b -133 -174 -126 -176 -130 -174 b -296 -12 -136 -173 -172 -137 l -308 0 l -337 -34 b -375 -77 -367 -73 -370 -76 b -382 -79 -377 -79 -379 -79 b -402 -58 -393 -79 -402 -69 b -401 -49 -402 -55 -402 -52 b -224 172 -398 -43 -228 167 b -219 173 -223 172 -220 173 "}, 
"v1f":{"x_min":-340.28125, "x_max":338.921875, "ha":346, "o":"m -32 520 b -29 521 -31 520 -31 521 b -23 519 -27 521 -24 520 b -20 513 -21 517 -20 516 b -21 506 -20 512 -20 509 b -31 474 -23 502 -27 488 l -53 402 l -66 352 l -68 349 l -57 349 b -32 351 -51 349 -40 351 b 123 370 19 352 74 359 b 137 371 127 370 133 371 b 170 356 152 371 164 366 b 171 355 170 355 170 355 b 216 366 174 355 183 358 b 280 378 268 377 266 377 b 287 378 283 378 284 378 b 332 349 307 378 322 369 b 338 319 336 341 338 330 b 332 301 338 310 336 302 b 242 280 329 299 246 280 b 242 280 242 280 242 280 b 235 288 236 280 235 283 b 235 292 235 290 235 291 b 236 302 236 297 236 299 b 220 337 236 316 230 330 l 216 340 l 210 335 b 159 276 189 322 172 301 b 118 149 152 265 156 274 b 81 34 84 36 85 36 b -8 13 78 33 -4 13 b -8 13 -8 13 -8 13 b -14 20 -12 15 -14 15 b -8 44 -14 24 -12 31 b -2 66 -5 55 -2 65 b -2 66 -2 66 -2 66 l -2 66 b -43 41 -2 66 -21 55 b -114 4 -98 8 -98 8 b -144 0 -123 0 -134 0 b -242 99 -197 0 -242 43 b -242 109 -242 102 -242 105 b -212 219 -240 122 -242 116 b -185 312 -197 270 -185 312 l -185 312 b -189 312 -185 312 -186 312 b -259 312 -200 312 -227 312 b -321 310 -291 312 -310 310 b -334 312 -330 310 -334 312 b -340 319 -338 313 -340 316 b -336 326 -340 322 -338 324 b -291 337 -334 326 -314 331 l -247 347 l -210 348 b -172 348 -190 348 -172 348 b -168 363 -172 348 -171 355 b -145 442 -151 424 -145 441 b -133 452 -144 444 -140 446 l -77 489 b -32 520 -53 506 -32 520 m 57 334 b 53 335 55 335 54 335 b 44 334 50 335 49 335 b -70 316 8 326 -28 320 b -78 309 -78 316 -78 316 b -108 202 -80 305 -88 274 b -141 81 -136 112 -141 93 b -140 74 -141 79 -141 77 b -117 49 -137 59 -127 49 b -107 52 -114 49 -110 51 b 16 127 -106 54 14 126 b 42 217 16 127 42 215 b 49 241 42 222 44 229 b 73 320 53 251 73 317 b 57 334 73 327 65 333 "}, 
"v22":{"x_min":0, "x_max":432.828125, "ha":442, "o":"m 209 186 b 213 187 210 187 212 187 b 216 187 215 187 216 187 b 224 174 216 186 220 180 b 420 -1 269 105 338 43 b 432 -12 431 -8 432 -9 b 421 -23 432 -15 432 -16 b 228 -180 345 -70 264 -137 b 219 -188 221 -188 221 -188 l 219 -188 b 208 -177 215 -188 215 -188 b 10 1 163 -106 93 -44 b 0 11 0 6 0 8 b 10 22 0 13 0 15 b 202 179 87 69 167 136 b 209 186 206 183 209 186 "}, "v23":{"x_min":0, "x_max":133.390625, "ha":136, "o":"m 54 66 b 65 68 58 68 61 68 b 122 37 88 68 110 56 b 133 -1 130 26 133 12 b 104 -58 133 -23 123 -44 b 66 -69 92 -65 78 -69 b 10 -38 44 -69 23 -58 b 0 -1 2 -27 0 -13 b 54 66 0 30 20 61 "}, 
"v25":{"x_min":0, "x_max":318.5, "ha":325, "o":"m 20 376 b 167 377 23 377 96 377 b 296 376 231 377 294 377 b 318 347 311 371 318 359 b 296 316 318 333 311 320 b 159 315 294 315 227 315 b 21 316 91 315 24 315 b 0 345 6 320 0 333 b 20 376 0 359 6 371 "}, "v26":{"x_min":-21.78125, "x_max":483.1875, "ha":493, "o":"m -8 631 b -1 632 -6 632 -4 632 b 19 620 8 632 16 628 b 20 383 20 616 20 616 l 20 148 l 21 151 b 140 199 59 183 102 199 b 206 179 164 199 187 192 l 210 176 l 210 396 l 210 617 l 212 621 b 231 632 216 628 223 632 b 250 620 239 632 247 628 b 251 383 251 616 251 616 l 251 148 l 254 151 b 370 199 291 183 332 199 b 415 191 385 199 400 197 b 483 84 458 176 483 134 b 461 0 483 58 476 29 b 332 -142 439 -40 411 -72 l 255 -215 b 231 -229 240 -229 239 -229 b 216 -223 224 -229 220 -227 b 210 -158 210 -217 210 -223 b 210 -120 210 -148 210 -136 l 210 -29 l 205 -34 b 100 -142 182 -65 159 -88 l 23 -215 b -1 -229 9 -229 6 -229 b -20 -216 -9 -229 -17 -224 l -21 -212 l -21 201 l -21 616 l -20 620 b -8 631 -17 624 -13 630 m 110 131 b 96 133 106 133 100 133 b 89 133 93 133 91 133 b 24 87 63 129 40 113 l 20 80 l 20 -37 l 20 -156 l 23 -152 b 144 81 96 -72 144 20 l 144 83 b 110 131 144 113 134 126 m 341 131 b 328 133 337 133 332 133 b 322 133 326 133 323 133 b 257 87 296 129 273 113 l 251 80 l 251 -37 l 251 -156 l 255 -152 b 375 81 328 -72 375 20 l 375 83 b 341 131 375 113 367 126 "}, 
"v27":{"x_min":0, "x_max":432.828125, "ha":442, "o":"m 208 184 b 213 187 209 186 212 187 b 224 176 217 187 221 183 b 245 147 225 172 235 159 b 419 -1 288 90 347 38 b 431 -8 424 -4 431 -8 b 432 -12 432 -9 432 -11 b 430 -18 432 -13 432 -16 b 364 -61 424 -20 383 -47 b 225 -183 307 -102 250 -152 b 223 -187 224 -184 223 -187 b 220 -188 221 -188 220 -188 b 208 -176 216 -188 210 -184 b 187 -148 205 -173 197 -159 b 12 0 144 -90 84 -38 b 0 11 4 5 0 8 b 16 24 0 13 4 18 b 183 158 83 69 141 115 b 208 184 194 169 198 173 m 183 105 b 176 113 181 109 176 113 b 172 109 176 113 175 112 b 92 45 149 90 117 62 l 88 41 l 102 31 b 247 -105 160 -6 210 -55 l 254 -115 l 257 -112 l 269 -102 b 340 -45 287 -87 319 -61 l 344 -43 l 330 -33 b 183 105 272 6 221 54 "}, 
"v28":{"x_min":-73.5, "x_max":72.140625, "ha":74, "o":"m -72 252 l -73 254 l 0 254 l 72 254 l 70 252 b 0 -1 70 248 0 -1 b -72 252 -1 -1 -72 248 "}, "v2a":{"x_min":-21.78125, "x_max":366.140625, "ha":374, "o":"m 276 1378 b 284 1379 279 1379 281 1379 b 306 1360 292 1379 298 1374 b 352 1247 326 1326 343 1286 b 366 1139 362 1213 366 1175 b 347 1009 366 1093 359 1049 l 344 1002 l 347 992 b 352 971 348 986 351 977 b 366 863 362 936 366 899 b 347 732 366 818 359 773 l 344 725 l 347 716 b 352 695 348 710 351 700 b 366 588 362 659 366 623 b 223 262 366 464 314 345 b 189 233 212 252 212 252 b 35 76 126 183 73 129 b -1 16 20 56 2 27 b -19 4 -4 9 -12 4 l -21 4 l -21 137 l -21 270 l -17 270 b 186 344 59 281 134 308 b 319 606 270 399 319 499 b 317 650 319 620 319 635 l 315 659 l 314 655 b 223 537 288 607 258 570 b 189 509 212 528 212 528 b 35 352 126 459 73 405 b -1 292 20 333 2 303 b -19 280 -4 285 -12 280 l -21 280 l -21 413 l -21 546 l -17 546 b 186 620 59 557 134 584 b 319 882 270 675 319 775 b 317 925 319 896 319 911 l 315 935 l 314 931 b 223 813 288 884 258 846 b 189 785 212 805 212 805 b 35 628 126 735 73 681 b -1 569 20 609 2 580 b -19 556 -4 562 -12 556 l -21 556 l -21 689 l -21 823 l -17 823 b 202 907 68 835 152 867 b 319 1157 280 968 319 1061 b 270 1338 319 1218 303 1281 b 262 1358 264 1349 262 1353 b 262 1364 262 1360 262 1363 b 276 1378 265 1371 269 1376 "}, 
"v2d":{"x_min":0, "x_max":438.28125, "ha":447, "o":"m 212 190 b 219 191 213 191 216 191 b 236 176 225 191 228 190 b 419 18 277 105 341 49 b 436 5 431 13 434 11 b 438 -1 438 4 438 1 b 424 -16 438 -8 432 -13 b 356 -49 409 -20 379 -36 b 234 -180 306 -83 258 -133 b 219 -192 230 -188 224 -192 b 200 -176 213 -192 206 -187 b 9 -15 157 -102 89 -45 b 0 0 2 -12 0 -6 b 16 18 0 9 2 12 b 200 176 93 48 159 104 b 212 190 205 186 208 188 m 239 113 b 236 117 238 116 238 117 b 230 108 235 117 234 115 b 92 -15 196 58 140 8 b 88 -18 91 -16 88 -18 b 92 -20 88 -18 91 -19 b 198 -116 130 -43 166 -74 b 200 -117 200 -117 200 -117 b 201 -117 200 -117 201 -117 b 264 -43 212 -98 242 -62 b 345 15 288 -19 321 4 b 348 18 347 16 348 16 b 344 20 348 18 347 19 b 239 113 307 41 266 79 "}, 
"v2f":{"x_min":-1.359375, "x_max":680.5625, "ha":694, "o":"m 597 1042 b 604 1042 600 1042 602 1042 b 642 1002 627 1042 642 1022 b 619 966 642 988 635 974 b 439 927 574 942 503 927 l 426 927 l 426 921 b 430 838 428 893 430 866 b 345 480 430 696 398 560 b 179 391 307 423 249 391 b 156 392 171 391 164 392 b 138 394 149 394 142 394 b 103 434 115 396 103 416 b 129 471 103 451 111 466 b 141 474 133 473 137 474 b 172 459 153 474 164 469 b 181 455 175 456 176 455 b 187 456 182 455 185 455 b 253 520 212 460 234 483 b 315 836 294 605 315 714 b 311 928 315 867 314 898 b 302 945 310 943 311 942 b 245 953 283 950 262 953 b 130 891 193 953 149 931 b 84 860 119 870 102 860 b 36 905 61 860 39 877 b 36 910 36 907 36 909 b 80 970 36 931 50 949 b 249 1017 125 1000 187 1017 b 322 1009 273 1017 299 1014 l 341 1003 b 436 991 372 995 406 991 b 577 1031 495 991 545 1004 b 597 1042 583 1038 590 1041 m 416 360 b 424 360 419 360 421 360 b 481 309 454 360 479 338 b 503 145 484 280 495 199 b 585 -185 525 16 555 -106 b 630 -245 596 -213 613 -237 l 634 -247 l 638 -245 b 647 -244 641 -245 645 -244 b 680 -278 666 -244 680 -262 b 664 -308 680 -290 675 -301 b 638 -312 658 -310 650 -312 b 613 -309 631 -312 623 -310 b 477 -201 555 -303 502 -260 b 417 -2 460 -159 434 -72 b 416 5 417 1 416 5 b 416 5 416 5 416 5 b 411 -5 415 5 413 0 b 359 -97 397 -33 377 -70 b 353 -106 355 -102 353 -105 b 359 -112 353 -108 355 -109 b 409 -130 375 -123 390 -129 b 426 -134 420 -130 421 -131 b 431 -147 428 -137 431 -141 b 420 -162 431 -152 427 -159 b 382 -169 409 -166 396 -169 b 323 -155 363 -169 341 -165 l 317 -152 l 314 -155 b 62 -303 240 -240 148 -295 b 36 -305 55 -305 44 -305 b 23 -303 29 -305 24 -305 b -1 -273 6 -299 -1 -287 b 31 -240 -1 -256 10 -240 b 36 -240 32 -240 34 -240 b 42 -241 38 -241 39 -241 b 134 -204 63 -241 99 -226 b 367 288 265 -115 357 81 b 375 330 368 313 370 320 b 416 360 383 347 400 358 m 360 -359 b 379 -359 363 -359 371 -359 b 424 -360 396 -359 416 -359 b 646 -502 536 -373 624 -430 b 649 -527 649 -510 649 -519 b 530 -673 649 -578 604 -635 l 521 -677 l 529 -681 b 653 -811 592 -714 637 -762 b 660 -853 658 -827 660 -839 b 645 -911 660 -873 656 -892 b 426 -1021 608 -981 519 -1021 b 283 -989 377 -1021 328 -1011 b 235 -949 249 -972 239 -964 b 234 -936 234 -946 234 -941 b 234 -928 234 -934 234 -931 l 235 -925 l 234 -927 l 225 -934 b 87 -982 186 -966 138 -982 b 80 -982 85 -982 83 -982 b 55 -981 70 -981 58 -981 b 17 -943 32 -981 17 -964 b 54 -904 17 -921 35 -904 b 78 -914 62 -904 72 -909 l 83 -918 l 88 -918 b 190 -831 122 -918 166 -881 b 269 -506 242 -727 269 -612 b 268 -462 269 -492 269 -477 b 266 -449 266 -458 266 -452 b 265 -444 266 -445 266 -444 b 257 -446 264 -444 261 -445 b 132 -545 196 -470 152 -505 b 88 -573 122 -563 104 -573 b 39 -523 63 -573 39 -553 b 63 -476 39 -505 44 -494 b 360 -359 136 -408 235 -369 m 419 -424 b 393 -423 411 -423 406 -423 l 375 -423 l 377 -426 b 379 -439 377 -427 378 -434 b 383 -510 382 -463 383 -487 b 314 -811 383 -609 360 -710 b 266 -893 296 -850 285 -870 b 264 -898 265 -896 264 -898 l 264 -898 b 264 -898 264 -898 264 -898 b 268 -898 264 -898 266 -898 b 273 -898 270 -898 272 -898 b 300 -909 283 -898 291 -900 b 426 -957 340 -941 385 -957 b 476 -949 443 -957 460 -954 b 547 -853 522 -931 547 -893 b 485 -745 547 -816 526 -775 b 397 -707 460 -727 432 -714 b 366 -675 375 -703 366 -692 b 396 -642 366 -657 377 -645 b 530 -557 455 -637 511 -601 b 536 -527 534 -548 536 -537 b 419 -424 536 -480 490 -437 "}, 
"v33":{"x_min":-423.3125, "x_max":421.9375, "ha":431, "o":"m -10 276 b -2 277 -8 277 -5 277 b 17 265 5 277 13 273 b 19 163 19 260 19 260 l 19 68 l 39 45 b 277 -95 122 -34 200 -81 b 289 -97 281 -97 285 -97 b 378 0 332 -97 371 -54 b 378 11 378 4 378 6 b 302 83 378 55 345 83 b 242 66 283 83 262 77 b 208 56 231 59 219 56 b 148 120 175 56 148 81 b 200 186 148 151 164 172 b 261 198 220 194 240 198 b 420 45 341 198 411 137 b 421 22 421 37 421 29 b 257 -198 421 -86 347 -188 b 242 -198 251 -198 247 -198 b 20 -105 181 -198 95 -163 l 19 -104 l 19 -183 b 19 -216 19 -195 19 -206 b 12 -273 19 -272 17 -267 b -2 -278 8 -277 2 -278 b -21 -266 -10 -278 -19 -274 b -23 -165 -23 -263 -23 -262 l -23 -69 l -44 -47 b -250 86 -117 23 -183 66 b -295 94 -270 93 -284 94 b -315 91 -302 94 -308 94 b -381 5 -356 81 -381 43 b -355 -56 -381 -16 -372 -40 b -299 -81 -338 -73 -319 -81 b -246 -68 -283 -81 -265 -77 b -212 -58 -234 -61 -223 -58 b -168 -77 -196 -58 -179 -65 b -151 -122 -156 -90 -151 -105 b -179 -174 -151 -141 -160 -162 b -239 -195 -194 -184 -217 -192 b -257 -197 -245 -195 -250 -197 b -423 -5 -349 -197 -423 -113 b -423 0 -423 -4 -423 -1 b -277 194 -420 97 -362 173 b -247 197 -268 197 -258 197 b -24 104 -185 197 -100 162 l -23 102 l -23 181 b -21 265 -23 260 -23 260 b -10 276 -20 269 -14 274 "}, 
"v38":{"x_min":-1.359375, "x_max":651.96875, "ha":665, "o":"m 389 644 b 405 645 394 645 400 645 b 504 566 450 645 492 613 b 507 541 506 557 507 549 b 480 471 507 514 498 489 l 477 467 l 483 470 b 609 591 539 485 586 531 b 613 601 611 595 613 599 b 631 609 619 607 624 609 b 651 588 641 609 651 602 b 200 -946 651 584 204 -941 b 182 -957 197 -953 190 -957 b 163 -945 174 -957 166 -953 b 161 -939 161 -942 161 -942 b 217 -743 161 -931 170 -904 b 272 -555 247 -639 272 -555 b 272 -555 272 -555 272 -555 b 264 -560 272 -555 268 -557 b 140 -603 227 -589 182 -603 b 36 -567 102 -603 65 -592 b -1 -487 12 -548 -1 -517 b 17 -427 -1 -466 5 -445 b 103 -380 38 -395 70 -380 b 191 -433 137 -380 172 -398 b 205 -484 201 -448 205 -466 b 178 -553 205 -509 196 -535 l 175 -557 l 182 -555 b 307 -435 236 -539 284 -494 b 372 -213 308 -430 372 -215 b 372 -213 372 -213 372 -213 b 364 -219 372 -213 368 -216 b 240 -262 328 -247 283 -262 b 137 -226 202 -262 166 -249 b 99 -145 112 -206 99 -176 b 118 -84 99 -124 106 -104 b 204 -38 138 -54 171 -38 b 292 -91 238 -38 273 -56 b 306 -141 302 -106 306 -124 b 279 -212 306 -167 296 -194 l 276 -215 l 281 -213 b 408 -93 336 -198 385 -151 b 473 129 409 -88 473 127 b 473 129 473 129 473 129 b 465 122 473 129 469 126 b 341 80 428 94 383 80 b 236 115 303 80 266 91 b 200 195 213 136 200 165 b 217 256 200 217 206 238 b 304 303 239 287 272 303 b 393 249 338 303 374 285 b 406 199 402 234 406 217 b 379 129 406 173 397 148 l 377 126 l 382 127 b 509 248 436 142 485 190 b 574 470 510 254 574 469 b 574 470 574 470 574 470 b 566 464 574 470 570 467 b 442 421 529 435 484 421 b 337 458 404 421 367 433 b 300 537 313 478 300 508 b 389 644 300 585 334 635 "}, 
"v3b":{"x_min":0, "x_max":484.5625, "ha":494, "o":"m 228 245 b 239 247 234 247 239 247 b 243 247 240 247 242 247 b 303 238 257 247 287 242 b 484 -2 417 208 484 104 b 412 -177 484 -65 461 -127 b 243 -248 363 -226 303 -248 b 6 -63 138 -248 36 -180 b 0 -1 1 -41 0 -20 b 228 245 0 127 98 240 m 255 181 b 240 183 247 183 245 183 b 232 181 238 183 235 183 b 142 152 200 180 168 170 l 138 149 l 190 97 l 242 44 l 294 97 l 345 149 l 340 152 b 255 181 315 169 284 180 m 147 -54 l 197 -1 l 147 51 l 95 104 l 91 99 b 62 -1 72 70 62 34 b 66 -43 62 -15 63 -29 b 91 -101 72 -63 80 -84 l 95 -106 l 147 -54 m 393 99 b 389 104 390 102 389 104 b 337 51 389 104 366 80 l 285 -1 l 337 -54 l 389 -106 l 393 -101 b 421 -1 412 -72 421 -36 b 393 99 421 34 412 69 m 294 -98 b 242 -45 265 -69 242 -45 b 190 -98 242 -45 219 -69 l 138 -151 l 142 -154 b 242 -184 172 -174 206 -184 b 340 -154 276 -184 311 -174 l 345 -151 l 294 -98 "}, 
"v3c":{"x_min":0, "x_max":450.53125, "ha":460, "o":"m 189 302 b 204 303 193 302 198 303 b 303 224 250 303 292 270 b 306 199 304 216 306 208 b 279 129 306 173 296 147 l 276 126 l 281 127 b 408 249 337 142 385 190 b 412 259 409 254 412 258 b 430 267 417 265 423 267 b 450 247 441 267 450 259 b 200 -605 450 242 204 -599 b 182 -616 197 -612 190 -616 b 163 -602 174 -616 166 -610 b 161 -598 161 -601 161 -601 b 217 -402 161 -589 170 -562 b 272 -213 247 -298 272 -213 b 272 -213 272 -213 272 -213 b 264 -219 272 -213 268 -216 b 140 -262 227 -247 182 -262 b 36 -226 102 -262 65 -249 b 0 -145 12 -206 0 -176 b 17 -84 0 -124 5 -104 b 103 -38 38 -54 70 -38 b 191 -91 137 -38 172 -56 b 205 -141 201 -106 205 -124 b 178 -212 205 -167 196 -194 l 175 -215 l 182 -213 b 307 -93 236 -198 284 -151 b 372 129 308 -88 372 127 b 372 129 372 129 372 129 b 364 122 372 129 368 126 b 240 80 328 94 283 80 b 137 115 202 80 166 91 b 99 194 111 136 99 165 b 189 302 99 244 133 292 "}, 
"v3e":{"x_min":0, "x_max":406.96875, "ha":415, "o":"m 21 183 b 28 183 24 183 25 183 b 42 181 34 183 39 183 b 127 108 47 179 47 179 b 202 41 168 72 202 41 b 279 108 204 41 238 72 b 357 177 321 145 356 176 b 375 183 363 181 370 183 b 406 151 392 183 406 169 b 404 137 406 147 405 141 b 322 62 401 131 398 129 b 251 0 284 27 251 0 b 322 -63 251 -1 284 -29 b 404 -138 398 -130 401 -133 b 406 -152 405 -142 406 -148 b 375 -184 406 -170 392 -184 b 357 -179 370 -184 363 -183 b 279 -109 356 -177 321 -147 b 202 -43 238 -73 204 -43 b 127 -109 202 -43 168 -73 b 49 -179 85 -147 50 -177 b 31 -184 43 -183 36 -184 b 0 -152 13 -184 0 -170 b 2 -138 0 -148 0 -142 b 83 -63 5 -133 8 -130 b 155 0 122 -29 155 -1 b 83 62 155 0 122 27 b 8 129 43 97 10 127 b 0 151 2 136 0 144 b 21 183 0 165 8 177 "}, 
"v3f":{"x_min":-24.5, "x_max":317.140625, "ha":324, "o":"m -24 -147 l -24 -5 l -20 -5 b -1 -19 -12 -5 -4 -11 b 58 -123 6 -43 31 -86 b 196 -278 93 -173 134 -219 b 317 -570 274 -356 317 -460 b 294 -713 317 -617 308 -666 l 289 -724 l 294 -735 b 317 -873 308 -780 317 -827 b 235 -1132 317 -963 288 -1054 b 209 -1165 228 -1140 224 -1146 b 189 -1177 204 -1172 196 -1177 b 171 -1164 182 -1177 175 -1172 b 168 -1154 170 -1161 168 -1159 b 181 -1132 168 -1149 172 -1142 b 269 -891 238 -1064 269 -975 b 269 -881 269 -886 269 -884 b 262 -814 269 -857 265 -827 b 258 -800 261 -811 259 -806 b 142 -628 240 -731 198 -667 b -8 -589 112 -606 47 -589 b -20 -589 -13 -589 -19 -589 l -24 -589 l -24 -449 l -24 -308 l -20 -308 b -1 -322 -12 -308 -4 -313 b 58 -424 6 -345 31 -388 b 194 -580 93 -476 136 -523 b 259 -660 221 -606 245 -635 b 261 -663 259 -662 261 -663 b 264 -656 262 -663 262 -660 b 269 -587 268 -632 269 -610 b 264 -521 269 -566 268 -544 b 262 -512 264 -517 262 -513 b 258 -498 261 -509 259 -503 b 142 -326 240 -428 198 -365 b -8 -287 112 -303 47 -288 b -20 -287 -13 -287 -19 -287 l -24 -287 l -24 -147 "}, 
"v40":{"x_min":-1.359375, "x_max":436.921875, "ha":446, "o":"m 213 205 b 217 205 215 205 216 205 b 234 194 224 205 234 199 b 236 187 234 194 235 190 l 245 167 l 261 129 l 270 106 b 355 -61 294 54 329 -13 b 420 -163 381 -105 402 -138 b 436 -188 435 -184 436 -184 b 436 -191 436 -190 436 -190 b 421 -206 436 -201 431 -206 l 421 -206 l 416 -206 l 405 -201 b 217 -158 347 -172 283 -158 b 31 -201 153 -158 88 -172 l 20 -206 l 14 -206 l 14 -206 b 0 -191 5 -206 0 -201 b -1 -188 0 -190 -1 -190 b 14 -163 -1 -186 0 -184 b 95 -34 36 -136 72 -77 b 166 106 119 8 148 68 l 175 129 l 183 148 l 200 188 b 213 205 205 199 208 202 "}, 
"v41":{"x_min":-1.359375, "x_max":556.6875, "ha":568, "o":"m 294 322 b 318 323 299 322 308 323 b 360 320 334 323 352 322 b 526 217 430 310 490 273 b 543 166 537 202 543 184 b 447 70 543 117 503 70 b 445 70 447 70 446 70 b 359 159 394 72 359 113 b 368 201 359 173 362 187 b 442 245 382 229 412 245 b 455 244 446 245 451 245 b 460 244 458 244 460 244 b 460 244 460 244 460 244 b 454 248 460 244 458 245 b 325 291 417 276 372 291 b 285 287 313 291 299 290 b 144 -2 183 269 144 190 b 281 -290 144 -208 179 -280 b 304 -291 289 -291 298 -291 b 524 -105 412 -291 506 -212 b 541 -84 526 -88 530 -84 b 556 -101 551 -84 556 -90 b 549 -138 556 -111 553 -122 b 334 -322 521 -237 435 -310 b 302 -324 323 -323 313 -324 b 13 -101 172 -324 54 -234 b -1 -1 4 -68 -1 -34 b 294 322 -1 161 121 303 "}, 
"v42":{"x_min":-348.4375, "x_max":24.5, "ha":25, "o":"m -330 155 b -322 156 -329 156 -326 156 b -315 156 -319 156 -317 156 b -298 147 -311 155 -308 154 b -19 30 -224 98 -122 55 l 2 26 b 24 -1 17 22 24 13 b 2 -27 24 -15 17 -23 l -19 -31 b -298 -148 -122 -56 -224 -99 b -322 -158 -313 -158 -315 -158 b -348 -131 -338 -158 -348 -145 b -344 -117 -348 -127 -347 -122 b -328 -104 -341 -112 -338 -111 b -127 -8 -269 -65 -202 -33 b -106 0 -115 -4 -106 -1 b -127 6 -106 0 -115 2 b -328 102 -202 31 -269 63 b -344 116 -338 109 -341 111 b -348 130 -347 120 -348 124 b -330 155 -348 141 -341 152 "}, 
"v43":{"x_min":-442.359375, "x_max":441, "ha":450, "o":"m -31 487 b -1 488 -21 488 -10 488 b 434 104 216 488 397 330 b 441 27 438 79 441 47 b 439 12 441 20 439 15 b 419 0 435 4 427 0 b 404 5 413 0 408 1 b 398 30 400 11 398 13 b 0 351 390 213 213 351 b -59 348 -20 351 -39 349 b -400 30 -251 324 -393 191 b -405 5 -400 13 -401 11 b -420 0 -409 1 -415 0 b -441 12 -428 0 -436 4 b -442 27 -441 15 -442 20 b -435 104 -442 47 -439 79 b -31 487 -401 316 -235 474 m -13 131 b -1 133 -9 133 -5 133 b 51 105 19 133 39 123 b 61 70 58 95 61 83 b 51 34 61 58 58 45 b -1 6 39 16 19 6 b -46 27 -17 6 -34 13 b -62 69 -57 38 -62 54 b -13 131 -62 98 -44 124 "}, 
"v44":{"x_min":-21.78125, "x_max":251.8125, "ha":257, "o":"m -8 631 b -1 632 -6 632 -4 632 b 19 620 8 632 16 628 b 20 383 20 616 20 616 l 20 148 l 21 151 b 137 199 59 183 99 199 b 182 191 152 199 167 197 b 251 84 227 176 251 134 b 228 0 251 58 243 29 b 100 -142 206 -40 178 -72 l 23 -215 b 0 -229 9 -229 6 -229 b -20 -216 -9 -229 -17 -224 l -21 -212 l -21 201 l -21 616 l -20 620 b -8 631 -17 624 -13 630 m 110 131 b 96 133 106 133 100 133 b 89 133 93 133 91 133 b 24 87 63 129 40 113 l 20 80 l 20 -37 l 20 -156 l 23 -152 b 144 81 96 -72 144 20 l 144 83 b 110 131 144 113 134 126 "}, 
"v45":{"x_min":-402.890625, "x_max":401.53125, "ha":410, "o":"m -10 273 b -4 274 -9 273 -6 274 b 16 262 4 274 12 269 b 17 158 17 259 17 259 l 17 56 l 62 112 b 117 174 110 172 110 172 b 122 174 118 174 119 174 b 132 173 125 174 129 173 b 295 11 134 172 171 134 l 307 -1 l 336 34 b 374 76 366 72 368 74 b 381 77 375 77 378 77 b 401 56 392 77 401 68 b 400 48 401 54 401 51 b 223 -172 397 41 230 -166 b 210 -176 220 -174 215 -176 b 201 -174 206 -176 204 -176 b 112 -87 198 -173 178 -152 b 27 0 65 -38 27 0 b 21 -6 27 0 24 -2 l 17 -12 l 17 -147 b 17 -210 17 -173 17 -194 b 10 -292 17 -297 16 -287 b -2 -299 6 -297 2 -299 b -21 -287 -10 -299 -19 -295 b -24 -174 -23 -284 -23 -284 l -24 -63 l -66 -117 b -121 -176 -110 -170 -114 -176 b -125 -176 -122 -176 -123 -176 b -296 -12 -134 -174 -125 -184 l -308 0 l -337 -34 b -375 -77 -367 -73 -370 -76 b -382 -79 -377 -79 -379 -79 b -402 -58 -393 -79 -402 -69 b -401 -49 -402 -55 -402 -52 b -224 170 -398 -43 -231 165 b -212 174 -221 173 -216 174 b -202 173 -208 174 -205 174 b -39 11 -200 172 -151 122 l -28 -1 l -25 1 l -24 4 l -24 130 b -23 260 -24 256 -24 258 b -10 273 -20 266 -16 270 "}, 
"v46":{"x_min":0, "x_max":627.46875, "ha":640, "o":"m 306 190 b 314 191 308 191 311 191 b 326 184 318 191 322 190 l 336 173 b 510 52 377 127 442 80 b 515 49 513 51 515 49 b 611 16 537 40 579 24 b 627 0 624 13 627 9 b 607 -18 627 -11 624 -13 b 330 -181 490 -49 389 -109 b 314 -192 323 -190 319 -192 b 306 -191 311 -192 308 -192 b 294 -177 302 -188 302 -188 b 257 -140 287 -170 265 -148 b 19 -18 193 -84 114 -44 b 0 0 2 -13 0 -11 b 16 16 0 9 2 13 b 110 49 47 24 89 40 b 117 52 111 49 114 51 b 145 65 126 56 130 58 b 281 163 200 93 245 124 b 300 186 288 170 291 174 b 306 190 300 187 303 188 m 317 137 b 313 142 315 141 314 142 b 308 137 313 142 311 141 b 161 4 276 84 220 33 b 155 0 159 1 155 0 b 163 -4 155 0 159 -2 b 308 -138 220 -34 276 -84 b 313 -142 311 -141 313 -142 b 317 -138 314 -142 315 -141 b 464 -4 351 -84 406 -34 b 470 0 468 -2 470 0 b 464 4 470 0 468 1 b 317 137 406 33 351 84 "}, 
"v47":{"x_min":-24.5, "x_max":315.78125, "ha":322, "o":"m -24 -145 l -24 -5 l -20 -5 b 1 -26 -10 -5 -6 -9 b 175 -241 31 -86 96 -166 b 314 -548 259 -323 304 -420 b 315 -589 315 -555 315 -571 b 314 -630 315 -606 315 -623 b 298 -730 311 -664 306 -699 l 295 -742 l 296 -748 b 314 -850 304 -778 311 -813 b 315 -892 315 -857 315 -874 b 314 -932 315 -909 315 -925 b 298 -1032 311 -967 306 -1002 l 295 -1045 l 296 -1050 b 314 -1153 304 -1081 311 -1115 b 315 -1193 315 -1160 315 -1177 b 314 -1235 315 -1211 315 -1228 b 217 -1526 306 -1338 270 -1444 b 201 -1533 213 -1532 208 -1533 b 182 -1522 193 -1533 185 -1529 b 179 -1514 181 -1518 179 -1517 b 189 -1489 179 -1508 182 -1501 b 266 -1217 240 -1403 266 -1308 b 262 -1156 266 -1196 265 -1177 b 110 -907 247 -1043 190 -950 b 0 -889 87 -895 50 -889 l -1 -889 l -24 -889 l -24 -749 l -24 -610 l -20 -610 b 1 -631 -10 -610 -6 -614 b 175 -846 31 -691 96 -771 b 259 -956 213 -884 236 -914 b 265 -966 262 -961 264 -966 b 265 -966 265 -966 265 -966 b 265 -953 265 -964 265 -959 b 266 -920 266 -943 266 -932 b 262 -853 266 -898 265 -873 b 110 -605 247 -741 190 -648 b 0 -587 87 -592 50 -587 l -1 -587 l -24 -587 l -24 -448 l -24 -308 l -20 -308 b 1 -328 -10 -308 -6 -312 b 175 -544 31 -388 96 -469 b 259 -655 213 -581 236 -612 b 265 -663 262 -659 264 -663 b 265 -663 265 -663 265 -663 b 265 -650 265 -663 265 -657 b 266 -617 266 -641 266 -630 b 262 -551 266 -595 265 -570 b 110 -303 247 -438 190 -345 b 0 -284 87 -290 50 -284 l -1 -284 l -24 -284 l -24 -145 "}, 
"v49":{"x_min":0, "x_max":630.203125, "ha":643, "o":"m 308 204 b 314 205 310 205 313 205 b 326 201 319 205 323 204 b 355 154 328 199 338 180 b 401 83 362 142 392 95 l 409 72 b 431 41 412 66 424 49 b 619 -174 498 -51 570 -134 b 630 -192 626 -180 630 -186 b 626 -202 630 -195 628 -199 b 616 -206 623 -205 620 -206 b 552 -188 608 -206 592 -202 b 310 -155 488 -169 392 -155 b 268 -156 295 -155 281 -155 b 77 -188 197 -161 126 -173 b 13 -206 35 -202 20 -206 b 9 -206 12 -206 10 -206 b 0 -191 2 -202 0 -197 b 8 -176 0 -186 2 -180 b 204 49 58 -136 138 -43 l 220 72 l 227 83 b 295 188 245 108 281 166 b 308 204 299 197 304 202 m 315 147 b 314 147 315 147 314 147 b 314 147 314 147 314 147 b 306 129 314 145 310 138 l 296 105 b 281 72 292 97 284 77 l 274 56 b 181 -123 247 -4 212 -72 l 174 -134 l 176 -133 b 314 -123 215 -127 272 -123 b 451 -133 356 -123 413 -127 l 454 -134 l 449 -123 b 353 56 417 -72 381 -4 l 347 72 b 332 105 344 77 336 97 l 322 129 b 315 147 318 138 315 145 "}, 
"v4a":{"x_min":70.78125, "x_max":378.390625, "ha":315, "o":"m 246 373 b 254 373 249 373 251 373 b 372 324 303 373 360 351 b 378 302 377 317 378 309 b 338 251 378 278 362 255 b 328 249 334 249 332 249 b 283 294 303 249 283 270 b 288 315 283 301 284 308 b 289 319 289 317 289 319 b 289 319 289 319 289 319 b 283 320 289 320 287 320 b 270 322 279 322 274 322 b 206 288 242 322 215 308 b 206 283 206 287 206 285 b 257 223 206 267 230 238 b 284 206 272 213 277 210 b 351 90 328 173 351 130 b 340 47 351 74 348 59 b 205 -30 314 -2 264 -30 b 182 -29 198 -30 190 -30 b 84 15 147 -24 103 -5 b 70 48 74 24 70 36 b 108 99 70 70 85 94 b 121 102 112 101 117 102 b 167 56 147 102 167 80 b 159 31 167 48 164 40 l 156 26 l 157 26 b 190 20 167 22 178 20 b 220 26 201 20 212 22 b 258 65 243 34 258 51 b 257 70 258 66 258 69 b 204 126 249 94 234 109 b 114 258 148 158 114 209 b 125 302 114 273 118 288 b 246 373 147 342 193 370 "}, 
"v4d":{"x_min":-311.6875, "x_max":310.328125, "ha":317, "o":"m -9 388 b -2 390 -8 390 -5 390 b 5 388 1 390 4 390 b 19 378 10 387 16 383 b 23 333 23 371 23 371 b 24 298 23 299 24 298 b 81 276 34 298 65 285 b 213 91 145 240 190 177 b 224 24 217 76 224 36 b 257 24 224 24 235 24 b 299 19 292 24 292 24 b 310 -1 306 15 310 6 b 299 -23 310 -11 306 -19 b 257 -27 292 -27 292 -27 b 224 -29 235 -27 224 -29 b 213 -95 224 -40 217 -80 b 81 -280 190 -181 145 -244 b 24 -301 65 -290 34 -301 b 23 -335 24 -301 23 -303 l 23 -340 b 17 -381 23 -374 23 -374 b -1 -391 13 -388 5 -391 b -21 -381 -9 -391 -17 -388 b -27 -340 -27 -374 -27 -374 l -27 -335 b -28 -301 -27 -303 -27 -301 b -85 -280 -38 -301 -69 -290 b -217 -95 -149 -244 -194 -181 b -228 -29 -221 -80 -228 -40 b -259 -27 -228 -29 -238 -27 b -300 -23 -294 -27 -294 -27 b -311 -2 -307 -19 -311 -11 b -294 23 -311 8 -304 19 b -259 24 -291 23 -284 24 b -228 24 -239 24 -228 24 b -217 91 -228 36 -221 76 b -85 276 -194 177 -149 240 b -28 298 -69 285 -38 298 b -27 333 -27 298 -27 299 b -27 371 -27 362 -27 369 b -9 388 -24 378 -17 385 m -27 136 b -28 247 -27 197 -28 247 b -61 216 -31 247 -53 226 b -123 33 -95 172 -121 98 l -125 24 l -76 24 l -27 24 l -27 136 m 29 242 b 24 247 27 245 24 247 b 23 136 24 247 23 197 l 23 24 l 72 24 l 121 24 l 119 33 b 29 242 115 116 77 206 m -27 -140 l -27 -27 l -76 -27 l -125 -27 l -123 -36 b -61 -220 -121 -102 -95 -176 b -28 -251 -53 -230 -31 -251 b -27 -140 -28 -251 -27 -201 m 119 -36 l 121 -27 l 72 -27 l 23 -27 l 23 -140 b 24 -251 23 -201 24 -251 b 57 -220 27 -251 49 -230 b 119 -36 91 -176 117 -102 "}, 
"v4e":{"x_min":0, "x_max":239.5625, "ha":244, "o":"m 10 460 b 20 462 13 462 14 462 b 39 449 28 462 35 458 l 40 446 l 40 326 b 40 205 40 259 40 205 b 127 227 40 205 80 215 b 220 249 196 244 213 249 b 227 247 224 249 225 248 b 238 237 231 245 235 241 l 239 233 l 239 -106 l 239 -448 l 238 -451 b 219 -463 234 -459 225 -463 b 198 -451 210 -463 202 -459 l 197 -448 l 197 -324 b 197 -201 197 -248 197 -201 b 110 -223 196 -201 157 -210 b 17 -245 42 -240 24 -245 b 10 -242 13 -245 13 -244 b 0 -233 6 -241 2 -237 l 0 -230 l 0 108 l 0 446 l 0 449 b 10 460 2 453 6 458 m 197 22 b 197 70 197 41 197 58 b 196 116 197 113 197 116 l 196 116 b 118 97 196 116 160 106 l 40 77 l 40 -18 b 40 -112 40 -69 40 -112 l 119 -93 l 197 -73 l 197 22 "}, 
"v52":{"x_min":-10.890625, "x_max":298.078125, "ha":294, "o":"m 138 473 b 142 474 140 473 141 474 b 164 459 148 474 153 470 b 191 402 183 442 191 423 b 181 353 191 388 187 371 b 178 349 179 352 178 349 b 179 348 178 348 179 348 b 185 349 181 348 182 348 b 255 376 210 355 234 363 b 272 381 264 381 266 381 b 298 355 287 381 298 370 b 288 330 298 348 298 345 b 171 34 238 254 194 141 b 166 13 168 16 168 16 b 144 1 161 5 152 1 b 121 15 134 1 125 5 b 115 33 119 18 117 24 b 0 330 91 145 49 252 b -10 355 -9 345 -10 348 b 13 381 -10 371 0 381 b 31 376 19 381 25 380 b 132 345 61 358 103 345 l 136 345 l 137 355 b 145 378 138 359 142 370 b 152 415 149 394 152 405 b 137 452 152 427 148 438 b 133 464 134 458 133 460 b 138 473 133 467 134 470 "}, 
"v54":{"x_min":-24.5, "x_max":317.140625, "ha":324, "o":"m -24 -161 l -24 -5 l -20 -5 b 0 -24 -9 -5 -2 -12 b 171 -315 21 -124 84 -233 b 317 -660 268 -406 317 -531 b 187 -1014 317 -782 274 -909 b 161 -1034 172 -1034 171 -1034 b 141 -1013 149 -1034 141 -1025 b 152 -991 141 -1004 142 -1002 b 266 -682 228 -899 266 -788 b 174 -430 266 -588 236 -498 b -23 -317 136 -388 66 -348 b -24 -161 -23 -316 -24 -285 "}, "v55":{"x_min":0, "x_max":551.25, "ha":563, "o":"m 289 644 b 304 645 294 645 299 645 b 404 566 349 645 392 613 b 406 541 405 557 406 549 b 379 471 406 514 397 489 l 377 467 l 382 470 b 509 591 438 485 485 531 b 513 601 510 595 513 599 b 530 609 518 607 524 609 b 551 588 540 609 551 602 b 200 -605 551 584 204 -599 b 182 -616 197 -612 190 -616 b 163 -602 174 -616 166 -610 b 161 -598 161 -601 161 -601 b 217 -402 161 -589 170 -562 b 272 -213 247 -298 272 -213 b 272 -213 272 -213 272 -213 b 264 -219 272 -213 268 -216 b 140 -262 227 -247 182 -262 b 36 -226 102 -262 65 -249 b 0 -145 12 -206 0 -176 b 17 -84 0 -124 5 -104 b 103 -38 38 -54 70 -38 b 191 -91 137 -38 172 -56 b 205 -141 201 -106 205 -124 b 178 -212 205 -167 196 -194 l 175 -215 l 182 -213 b 307 -93 236 -198 284 -151 b 372 129 308 -88 372 127 b 372 129 372 129 372 129 b 364 122 372 129 368 126 b 240 80 328 94 283 80 b 137 115 202 80 166 91 b 99 195 112 136 99 165 b 118 256 99 217 106 238 b 204 303 138 287 171 303 b 292 249 238 303 273 285 b 306 199 302 234 306 217 b 279 129 306 173 296 148 l 276 126 l 281 127 b 408 248 336 142 385 190 b 473 470 409 254 473 469 b 473 470 473 470 473 470 b 465 464 473 470 469 467 b 341 421 428 435 383 421 b 236 458 303 421 266 433 b 200 537 212 478 200 508 b 289 644 200 585 234 635 "}, 
"v58":{"x_min":-21.78125, "x_max":367.5, "ha":375, "o":"m 259 1553 b 265 1553 261 1553 264 1553 b 288 1540 272 1553 277 1550 b 367 1351 340 1493 367 1424 b 336 1221 367 1308 357 1263 l 332 1211 l 333 1208 b 367 1077 356 1170 367 1124 b 336 945 367 1032 357 986 l 332 935 l 333 932 b 367 800 356 893 367 848 b 336 669 367 756 357 710 l 332 659 l 333 656 b 367 523 356 617 367 571 b 345 412 367 485 360 446 b 231 273 322 356 284 310 b -1 19 121 195 27 93 b -17 4 -4 11 -10 5 l -21 4 l -21 134 l -21 265 l -17 265 b 133 291 20 265 96 278 b 318 537 245 328 318 433 b 307 603 318 559 315 582 b 303 614 304 612 304 614 b 298 609 302 614 300 613 b 231 549 281 589 258 567 b -1 295 121 471 27 369 b -17 280 -4 287 -10 281 l -21 280 l -21 410 l -21 541 l -17 541 b 133 567 20 541 96 555 b 318 813 245 605 318 709 b 307 880 318 835 315 859 b 303 891 304 888 304 891 b 298 885 302 891 300 888 b 231 825 281 866 258 843 b -1 571 121 748 27 645 b -17 556 -4 563 -10 557 l -21 556 l -21 687 l -21 817 l -17 817 b 133 843 20 817 96 830 b 318 1089 245 881 318 985 b 307 1156 318 1111 315 1134 b 303 1167 304 1164 304 1167 b 298 1161 302 1167 300 1164 b 231 1102 281 1140 258 1120 b -1 848 121 1024 27 921 b -17 832 -4 839 -10 834 l -21 832 l -21 963 l -21 1093 l -17 1093 b 114 1113 12 1093 78 1103 b 313 1314 215 1142 289 1218 b 318 1364 317 1331 318 1347 b 255 1511 318 1422 295 1478 b 243 1532 247 1519 243 1525 b 259 1553 243 1540 250 1550 "}, 
"v59":{"x_min":0, "x_max":464.140625, "ha":474, "o":"m 0 0 l 0 347 l 76 347 l 153 347 l 153 0 l 153 -348 l 76 -348 l 0 -348 l 0 0 m 308 -1 l 308 347 l 386 347 l 464 347 l 464 -1 l 464 -348 l 386 -348 l 308 -348 l 308 -1 "}, "v5b":{"x_min":-441, "x_max":439.640625, "ha":449, "o":"m -428 -2 b -421 0 -427 -1 -424 0 b -406 -6 -416 0 -409 -2 b -400 -31 -401 -12 -400 -15 b -1 -352 -392 -215 -215 -352 b 58 -349 19 -352 38 -351 b 398 -31 250 -326 392 -192 b 404 -6 398 -15 400 -12 b 419 -1 408 -2 413 -1 b 439 -13 427 -1 435 -5 b 439 -29 439 -16 439 -22 b 434 -105 439 -48 438 -80 b 0 -489 397 -333 213 -489 b -68 -484 -23 -489 -44 -488 b -441 -36 -280 -452 -436 -263 b -441 -30 -441 -34 -441 -31 b -428 -2 -441 -11 -439 -5 m -13 -9 b -1 -8 -9 -8 -5 -8 b 50 -36 19 -8 39 -19 b 61 -72 57 -47 61 -59 b 50 -106 61 -84 57 -97 b -1 -134 39 -124 19 -134 b -46 -115 -17 -134 -34 -129 b -62 -72 -57 -102 -62 -87 b -13 -9 -62 -44 -44 -16 "}, 
"v5c":{"x_min":0, "x_max":447.8125, "ha":457, "o":"m 0 -87 l 0 0 l 223 0 l 447 0 l 447 -87 l 447 -174 l 223 -174 l 0 -174 l 0 -87 "}, "v62":{"x_min":46.28125, "x_max":669.671875, "ha":563, "o":"m 183 376 b 189 376 185 376 187 376 b 212 374 197 376 208 376 b 265 337 234 369 253 355 b 274 317 268 331 273 320 b 274 316 274 317 274 316 b 280 323 276 316 276 319 b 311 358 288 337 299 348 b 319 366 315 360 318 365 b 356 376 326 373 340 376 b 382 371 364 376 374 374 b 428 337 400 366 417 352 b 436 317 431 331 436 320 b 438 316 436 317 436 316 b 442 323 438 316 439 319 b 475 358 451 337 462 348 b 483 366 477 360 481 365 b 518 376 488 373 503 376 b 544 373 528 376 536 376 b 604 285 579 360 604 326 b 597 249 604 273 601 258 b 543 63 596 247 544 70 b 541 54 543 61 541 55 b 540 44 540 51 540 47 b 552 23 540 33 545 23 b 552 23 552 23 552 23 b 647 126 586 29 627 72 b 658 138 651 136 653 138 b 660 138 660 138 660 138 b 669 129 666 137 669 136 b 654 88 669 122 665 109 b 562 -12 631 43 602 9 l 549 -19 b 521 -27 540 -24 530 -27 b 447 30 490 -27 458 -4 b 443 58 445 38 443 48 b 450 93 443 72 446 84 b 504 278 453 97 504 272 b 507 288 506 283 506 287 b 509 298 507 292 509 295 b 491 326 509 310 502 320 b 487 327 490 327 488 327 b 479 324 484 327 483 326 b 441 270 462 316 443 288 b 435 249 441 265 436 254 b 398 127 434 248 419 195 b 362 4 379 61 362 5 b 328 -1 359 -1 362 -1 b 314 -1 323 -1 319 -1 b 302 -1 310 -1 306 -1 b 266 4 266 -1 269 -1 b 265 6 265 5 265 5 b 303 144 265 13 272 34 b 343 278 325 216 343 276 b 344 288 343 281 344 285 b 345 298 345 291 345 295 b 330 326 345 310 340 320 b 323 327 328 327 325 327 b 317 324 322 327 321 326 b 279 270 300 316 281 288 b 273 249 279 265 274 254 b 236 127 272 248 255 195 b 200 4 216 61 200 5 b 164 -1 197 -1 198 -1 b 151 -1 161 -1 156 -1 b 140 -1 147 -1 142 -1 b 103 4 104 -1 106 -1 b 103 6 103 5 103 5 b 141 144 103 13 108 34 b 181 278 161 216 179 276 b 182 288 181 281 181 285 b 183 298 182 291 183 295 b 168 324 183 310 178 320 b 160 327 166 326 163 327 b 141 320 156 327 151 324 b 69 230 112 305 85 272 b 57 215 65 217 62 215 b 55 215 57 215 55 215 b 46 224 49 215 46 217 b 59 260 46 231 50 242 b 151 363 81 306 112 341 b 161 369 155 365 160 367 b 183 376 166 371 174 374 "}, 
"v70":{"x_min":0, "x_max":436.921875, "ha":446, "o":"m 213 190 b 217 191 215 191 216 191 b 231 184 223 191 228 188 b 249 154 240 167 246 159 b 419 18 292 91 348 45 b 436 -1 435 11 436 8 b 424 -16 436 -9 434 -13 b 308 -87 394 -26 340 -59 b 231 -186 276 -117 257 -142 b 219 -192 228 -191 225 -192 b 198 -174 209 -192 208 -191 b 47 -33 161 -113 110 -63 b 10 -16 34 -26 17 -19 b 0 -1 2 -13 0 -9 b 17 18 0 8 1 11 b 198 173 95 48 156 101 b 213 190 206 187 208 188 "}, "v72":{"x_min":-423.3125, "x_max":421.9375, 
"ha":431, "o":"m -262 197 b -247 197 -257 197 -253 197 b -118 162 -210 197 -163 184 b 40 45 -61 134 -13 98 b 277 -95 119 -33 200 -81 b 289 -97 281 -97 285 -97 b 378 0 332 -97 371 -55 b 378 11 378 4 378 6 b 302 83 378 55 345 83 b 242 66 283 83 262 77 b 208 56 231 59 219 56 b 148 120 175 56 148 81 b 201 186 148 151 164 172 b 261 198 220 194 240 198 b 420 45 341 198 411 136 b 421 22 421 37 421 29 b 245 -199 421 -93 338 -199 b 238 -198 243 -199 240 -199 b -44 -47 148 -194 50 -141 b -250 86 -114 22 -183 66 b -295 94 -270 91 -283 94 b -315 91 -302 94 -307 94 b -381 4 -356 81 -381 43 b -355 -56 -381 -18 -372 -40 b -298 -81 -338 -73 -319 -81 b -246 -68 -283 -81 -265 -77 b -212 -58 -234 -61 -223 -58 b -178 -69 -200 -58 -189 -62 b -151 -122 -160 -81 -151 -101 b -171 -167 -151 -138 -157 -155 b -239 -195 -185 -181 -213 -192 b -257 -197 -245 -197 -250 -197 b -423 -5 -352 -197 -423 -109 b -412 65 -423 16 -419 40 b -262 197 -389 137 -329 188 "}, 
"v74":{"x_min":-206.890625, "x_max":428.75, "ha":438, "o":"m 389 -351 b 394 -351 390 -351 393 -351 b 428 -385 413 -351 428 -367 b 428 -394 428 -388 428 -391 b 394 -428 426 -406 421 -410 l 332 -473 l 269 -516 l 205 -560 l 141 -603 l 77 -648 l 13 -692 l -50 -737 l -114 -780 l -145 -802 b -171 -813 -157 -810 -163 -813 b -175 -813 -172 -813 -174 -813 b -206 -777 -194 -811 -206 -795 b -202 -760 -206 -771 -205 -766 b -87 -675 -197 -752 -206 -757 l -34 -639 l 83 -557 l 145 -514 l 209 -470 l 272 -427 b 389 -351 375 -356 381 -352 "}, 
"v75":{"x_min":-149.71875, "x_max":148.359375, "ha":151, "o":"m -137 381 b -130 383 -134 383 -133 383 b -111 371 -122 383 -114 378 b -55 224 -110 370 -85 305 b 0 80 -25 145 -1 80 b 54 224 0 80 24 145 b 112 377 114 384 110 373 b 127 384 118 381 122 384 b 148 362 138 384 148 374 l 148 356 l 83 183 b 16 9 47 88 17 11 b -1 0 12 2 5 0 b -14 5 -5 0 -10 1 b -84 183 -19 9 -13 -6 l -149 356 l -149 362 b -137 381 -149 371 -145 378 "}, "v79":{"x_min":-1.359375, "x_max":899.703125, "ha":918, "o":"m 307 349 b 332 351 315 351 323 351 b 443 340 367 351 408 347 b 741 47 607 306 720 195 b 744 0 743 31 744 16 b 660 -303 744 -90 713 -206 b 28 -755 534 -531 304 -695 b 14 -756 23 -755 19 -756 b -1 -741 4 -756 -1 -750 b 21 -720 -1 -731 1 -728 b 567 -56 337 -601 548 -344 b 568 -11 568 -41 568 -24 b 442 285 568 129 525 233 b 325 319 406 308 367 319 b 93 177 232 319 137 266 b 84 154 91 170 84 155 b 84 154 84 154 84 154 b 88 156 84 154 85 155 b 159 177 110 170 134 177 b 257 134 194 177 231 162 b 294 41 281 108 294 73 b 171 -97 294 -24 246 -90 b 156 -98 166 -97 161 -98 b 6 74 73 -98 6 -22 b 6 80 6 76 6 79 b 307 349 10 223 141 340 m 839 215 b 845 216 841 216 842 216 b 862 213 852 216 860 215 b 899 163 887 206 899 184 b 872 117 899 145 890 127 b 847 111 865 112 856 111 b 808 130 833 111 818 117 b 796 162 800 140 796 151 b 839 215 796 187 812 212 m 839 -112 b 845 -112 841 -112 842 -112 b 862 -115 852 -112 860 -113 b 899 -165 887 -122 899 -144 b 872 -210 899 -183 890 -201 b 847 -217 865 -215 856 -217 b 808 -198 833 -217 818 -210 b 796 -165 800 -188 796 -177 b 839 -112 796 -140 812 -116 "}, 
"v7c":{"x_min":0, "x_max":300.8125, "ha":307, "o":"m 49 505 b 53 506 50 505 51 506 b 70 496 58 506 62 503 b 81 485 73 492 78 488 l 96 473 l 111 459 l 122 449 l 134 438 l 182 396 l 255 330 b 292 291 292 298 292 298 l 292 290 l 292 284 l 283 270 b 209 36 234 197 209 113 b 288 -170 209 -44 235 -119 b 299 -184 295 -179 299 -181 b 300 -191 300 -187 300 -188 b 285 -206 300 -199 294 -206 b 280 -206 283 -206 281 -206 b 247 -201 270 -202 259 -201 b 176 -222 223 -201 197 -208 b 114 -340 136 -249 114 -292 b 172 -471 114 -384 134 -433 b 185 -492 182 -481 185 -487 b 181 -502 185 -496 183 -499 b 171 -508 176 -505 174 -508 b 152 -498 166 -508 160 -503 b 0 -284 65 -428 12 -352 b 0 -260 0 -278 0 -270 b 1 -238 0 -252 0 -242 b 148 -140 16 -177 73 -140 b 209 -148 167 -140 189 -142 b 215 -149 212 -148 215 -149 b 215 -149 215 -149 215 -149 l 215 -149 b 201 -136 215 -148 209 -142 l 157 -97 l 96 -41 b 17 34 21 24 17 29 b 17 37 17 36 17 36 b 17 38 17 37 17 38 b 25 56 17 44 17 44 b 110 298 81 131 110 219 b 46 474 110 367 88 431 b 38 491 40 480 38 487 b 49 505 38 498 42 502 "}, 
"v7d":{"x_min":-1.359375, "x_max":436.921875, "ha":446, "o":"m 213 205 b 217 205 215 205 216 205 b 234 194 224 205 234 199 b 236 187 234 194 235 190 l 245 167 l 261 129 l 270 106 b 355 -61 294 54 329 -13 b 420 -163 381 -105 402 -138 b 436 -188 435 -184 436 -184 b 436 -191 436 -190 436 -190 b 421 -206 436 -201 431 -206 l 421 -206 l 416 -206 l 405 -201 b 217 -158 347 -172 283 -158 b 31 -201 153 -158 88 -172 l 20 -206 l 14 -206 l 14 -206 b 0 -191 5 -206 0 -201 b -1 -188 0 -190 -1 -190 b 14 -163 -1 -186 0 -184 b 95 -34 36 -136 72 -77 b 166 106 119 8 148 68 l 175 129 l 183 148 l 200 188 b 213 205 205 199 208 202 "}, 
"v7f":{"x_min":0, "x_max":367.5, "ha":375, "o":"m 0 124 l 0 187 l 61 187 l 122 187 l 122 138 l 122 91 l 153 61 l 183 30 l 213 61 l 243 91 l 243 138 l 243 187 l 306 187 l 367 187 l 367 124 l 367 61 l 321 61 l 274 61 l 243 30 l 213 0 l 243 -31 l 274 -62 l 321 -62 l 367 -62 l 367 -124 l 367 -188 l 306 -188 l 243 -188 l 243 -140 l 243 -93 l 213 -62 l 183 -31 l 153 -62 l 122 -93 l 122 -140 l 122 -188 l 61 -188 l 0 -188 l 0 -124 l 0 -62 l 46 -62 l 92 -62 l 123 -31 l 153 0 l 123 30 l 92 61 l 46 61 l 0 61 l 0 124 "}, 
"v80":{"x_min":29.9375, "x_max":420.578125, "ha":371, "o":"m 115 345 b 221 347 117 345 166 347 b 411 345 306 347 409 345 b 420 330 416 342 420 335 b 415 319 420 326 419 321 b 178 118 397 303 179 118 b 178 117 178 118 178 117 b 181 117 178 117 178 117 b 189 117 182 117 185 117 b 193 117 190 117 191 117 b 247 98 215 117 232 111 b 296 75 266 83 280 76 b 302 75 299 75 300 75 b 322 91 311 75 315 79 b 322 91 322 91 322 91 b 322 91 322 91 322 91 b 319 91 322 91 321 91 b 313 90 318 90 315 90 b 283 107 300 90 288 97 b 277 126 279 114 277 121 b 319 167 277 149 295 167 b 319 167 319 167 319 167 b 362 118 347 167 362 147 b 355 82 362 108 359 96 b 311 33 349 65 340 55 b 224 1 284 12 253 1 b 194 5 213 1 204 2 b 168 18 183 8 178 11 b 110 36 151 30 130 36 b 57 15 88 36 68 29 b 47 11 54 12 51 11 b 31 20 40 11 34 13 b 29 26 31 22 29 25 b 68 66 29 36 39 45 b 285 250 73 71 281 248 b 285 250 285 250 285 250 b 231 252 285 252 261 252 b 137 250 190 252 141 250 b 93 227 122 248 110 241 b 78 220 88 222 83 220 b 66 227 74 220 70 222 b 63 234 65 229 63 231 b 85 291 63 241 69 252 b 115 345 108 342 108 344 "}, 
"v81":{"x_min":0, "x_max":428.75, "ha":438, "o":"m 262 186 b 273 186 266 186 272 186 b 274 186 273 186 274 186 b 285 186 274 186 280 186 b 428 48 375 181 428 122 b 386 -68 428 12 416 -29 b 155 -187 329 -145 236 -187 b 12 -111 92 -187 38 -162 b 0 -51 4 -91 0 -72 b 262 186 0 58 122 179 m 366 131 b 352 134 362 133 357 134 b 219 81 321 134 269 115 b 47 -111 126 23 50 -62 b 47 -112 47 -111 47 -112 b 77 -136 47 -129 58 -136 b 264 -45 118 -136 194 -101 b 382 109 336 12 382 76 b 366 131 382 120 377 129 "}, 
"v83":{"x_min":-1.359375, "x_max":847.96875, "ha":865, "o":"m 488 1499 b 495 1500 490 1500 492 1500 b 541 1465 507 1500 521 1490 b 679 1078 622 1372 679 1210 b 677 1050 679 1068 677 1060 b 477 642 668 893 604 764 l 443 609 l 431 596 l 431 592 l 438 562 l 449 508 l 460 458 b 481 355 475 390 481 355 b 481 355 481 355 481 355 b 490 356 481 355 485 355 b 528 358 495 356 511 358 b 558 356 540 358 552 356 b 839 95 699 338 808 237 b 847 22 845 72 847 47 b 631 -303 847 -113 766 -242 b 620 -309 623 -308 620 -309 l 620 -310 b 631 -359 620 -310 626 -333 l 646 -435 l 660 -496 b 672 -588 668 -535 672 -563 b 664 -653 672 -610 669 -630 b 383 -875 630 -792 509 -875 b 201 -810 321 -875 257 -855 b 129 -680 151 -768 129 -730 b 274 -530 129 -592 200 -530 b 351 -553 300 -530 326 -538 b 412 -669 393 -582 412 -626 b 287 -805 412 -735 366 -800 l 279 -805 l 285 -809 b 383 -830 318 -823 351 -830 b 586 -718 464 -830 540 -789 b 626 -584 612 -678 626 -631 b 619 -528 626 -566 623 -548 b 612 -495 619 -526 616 -510 b 577 -324 590 -387 577 -324 b 577 -324 577 -324 577 -324 b 568 -326 575 -324 571 -324 b 528 -334 558 -328 537 -333 b 465 -338 506 -337 485 -338 b 24 -11 269 -338 87 -206 b -1 145 8 41 -1 93 b 96 442 -1 249 32 351 b 322 714 166 541 236 626 l 352 745 l 345 782 l 332 843 l 315 921 b 303 984 310 950 304 978 b 295 1082 298 1017 295 1049 b 413 1426 295 1208 336 1329 b 488 1499 436 1456 477 1496 m 549 1301 b 541 1301 547 1301 544 1301 b 411 1207 500 1301 447 1263 b 355 1004 374 1152 355 1079 b 359 942 355 984 356 963 b 371 881 362 927 363 917 l 385 818 b 392 782 389 799 392 784 l 392 782 b 434 828 393 782 424 816 b 607 1165 534 941 594 1060 b 608 1193 608 1175 608 1183 b 597 1270 608 1224 604 1254 b 549 1301 589 1286 571 1299 m 398 528 b 393 555 396 542 393 553 b 392 555 393 555 393 555 b 317 470 390 555 347 505 b 190 298 266 408 212 334 b 127 70 148 227 127 148 b 155 -77 127 19 137 -30 b 468 -303 209 -216 333 -303 b 519 -299 484 -303 502 -302 b 568 -284 541 -295 568 -287 l 568 -284 b 563 -263 568 -284 566 -274 l 534 -120 l 511 -13 l 496 61 l 480 133 b 469 187 472 176 469 187 b 468 188 469 187 469 188 b 416 162 462 188 430 172 b 337 13 364 126 337 69 b 413 -124 337 -40 363 -93 b 428 -144 424 -131 428 -137 b 428 -149 428 -145 428 -148 b 409 -166 426 -161 419 -166 b 394 -162 405 -166 400 -165 b 240 77 302 -122 240 -27 l 240 77 b 430 342 240 197 315 301 l 436 344 l 426 394 l 398 528 m 548 194 b 526 195 540 195 532 195 b 519 195 524 195 521 195 l 514 195 l 518 177 l 539 79 l 552 15 l 566 -48 l 594 -187 l 605 -240 b 612 -266 609 -254 611 -266 b 612 -266 612 -266 612 -266 b 641 -248 613 -266 630 -256 b 744 -98 692 -212 730 -156 b 751 -40 749 -79 751 -59 b 548 194 751 76 665 181 "}, 
"v84":{"x_min":25.859375, "x_max":164.6875, "ha":168, "o":"m 34 369 b 40 370 35 370 38 370 b 59 353 49 370 50 367 b 164 40 122 254 155 158 b 164 0 164 33 164 16 b 164 -40 164 -16 164 -34 b 59 -353 155 -158 122 -254 b 40 -371 53 -366 47 -371 b 34 -370 38 -371 36 -370 b 25 -358 28 -367 25 -363 b 31 -337 25 -352 27 -347 b 92 0 72 -234 92 -117 b 31 335 92 116 72 233 b 25 356 27 345 25 352 b 34 369 25 363 28 366 "}, "v8b":{"x_min":0, "x_max":319.859375, "ha":326, "o":"m 149 508 b 159 509 152 509 155 509 b 186 494 170 509 181 503 b 190 440 190 487 190 488 l 190 430 l 190 377 l 242 377 l 251 377 b 303 373 298 377 296 377 b 319 345 314 367 319 356 b 304 319 319 335 314 324 b 250 315 296 315 299 315 l 242 315 l 190 315 l 190 262 l 190 252 b 186 198 190 204 190 205 b 159 183 179 188 170 183 b 132 198 148 183 138 188 b 127 252 127 205 127 204 l 127 262 l 127 315 l 76 315 l 68 315 b 14 319 20 315 21 315 b 0 347 4 324 0 335 b 14 373 0 356 4 367 b 68 377 21 377 20 377 l 76 377 l 127 377 l 127 430 l 127 440 b 132 494 127 488 127 487 b 149 508 136 501 142 505 "}, 
"v8c":{"x_min":-330.75, "x_max":329.390625, "ha":336, "o":"m -133 483 b -117 484 -127 484 -122 484 b 31 373 -51 484 9 440 b 35 348 34 365 35 356 b -25 285 35 313 10 285 b -87 331 -55 285 -76 302 b -167 402 -100 376 -133 402 b -191 398 -175 402 -183 401 b -227 341 -215 388 -227 369 b -225 320 -227 334 -227 327 b -13 74 -209 230 -125 133 b 6 65 -4 70 5 66 l 9 63 l 10 65 b 117 231 12 68 40 112 l 189 341 l 242 424 b 268 460 262 456 264 458 b 283 464 273 463 277 464 b 308 438 296 464 308 453 l 308 437 b 287 396 308 430 308 428 l 95 98 l 59 43 l 58 41 l 65 37 b 253 -156 151 -8 217 -77 b 281 -285 272 -199 281 -244 b 148 -481 281 -381 231 -463 b 115 -485 137 -484 126 -485 b -32 -376 51 -485 -9 -442 b -36 -349 -35 -366 -36 -358 b 25 -287 -36 -315 -12 -287 b 85 -333 54 -287 74 -302 b 166 -403 99 -377 133 -403 b 190 -399 174 -403 182 -402 b 225 -342 215 -390 225 -370 b 224 -322 225 -335 225 -328 b 12 -76 208 -231 125 -134 b -8 -66 2 -72 -6 -68 l -10 -65 l -12 -66 b -118 -231 -13 -68 -42 -113 l -190 -342 l -243 -426 b -269 -462 -264 -458 -265 -458 b -284 -466 -274 -464 -279 -466 b -310 -440 -298 -466 -310 -455 l -310 -438 b -288 -398 -310 -430 -308 -430 l -96 -99 l -59 -44 l -59 -43 l -66 -38 b -281 284 -198 33 -281 158 l -281 284 b -133 483 -281 392 -220 474 m 254 177 b 266 179 258 177 262 179 b 319 149 287 179 307 167 b 329 115 326 140 329 127 b 319 79 329 102 326 90 b 268 51 307 61 287 51 b 221 72 250 51 234 58 b 205 115 210 84 205 99 b 254 177 205 142 223 170 m -281 -54 b -269 -52 -277 -52 -273 -52 b -223 -73 -253 -52 -235 -59 b -206 -116 -212 -84 -206 -101 b -216 -151 -206 -129 -209 -141 b -269 -179 -228 -170 -249 -179 b -314 -159 -285 -179 -302 -173 b -330 -116 -325 -147 -330 -131 b -281 -54 -330 -88 -313 -61 "}, 
"v8f":{"x_min":-21.78125, "x_max":362.0625, "ha":369, "o":"m 302 1031 b 308 1032 304 1032 307 1032 b 330 1016 318 1032 325 1027 b 362 867 351 970 362 920 b 340 738 362 824 353 780 l 336 727 l 340 717 b 362 591 355 677 362 634 b 257 323 362 496 325 401 b 204 272 243 306 227 290 b 20 56 129 206 66 133 b -1 18 12 44 0 22 b -19 4 -4 9 -12 4 l -21 4 l -21 140 l -21 276 l -12 277 b 167 333 61 288 127 309 b 319 598 262 388 319 491 b 311 664 319 620 317 642 l 310 673 l 304 664 b 204 548 279 620 250 587 b 20 333 129 483 66 409 b -1 292 12 320 0 298 b -19 280 -4 285 -12 280 l -21 280 l -21 416 l -21 552 l -12 553 b 167 609 61 564 127 585 b 319 874 264 666 319 770 b 294 992 319 914 311 954 b 288 1011 288 1004 288 1007 b 302 1031 288 1021 294 1028 "}, 
"v92":{"x_min":0, "x_max":598.890625, "ha":611, "o":"m 62 181 b 77 183 66 183 72 183 b 91 181 83 183 88 183 b 202 131 100 180 106 177 l 299 87 l 394 131 b 517 183 499 181 502 183 b 519 183 517 183 518 183 b 598 104 567 183 598 144 b 577 49 598 84 592 65 b 518 15 567 38 563 37 b 484 0 499 6 484 0 b 518 -16 484 -1 499 -8 b 577 -51 563 -38 567 -40 b 598 -105 592 -66 598 -86 b 519 -184 598 -145 567 -184 b 517 -184 518 -184 517 -184 b 394 -133 502 -184 499 -183 l 299 -88 l 202 -133 b 81 -184 99 -183 95 -184 b 77 -184 80 -184 78 -184 b 0 -105 29 -184 0 -145 b 20 -51 0 -86 5 -66 b 80 -16 29 -40 34 -38 b 114 -1 98 -8 114 -1 b 80 15 114 0 98 6 b 20 49 34 37 29 38 b 0 104 6 65 0 84 b 62 181 0 140 23 174 m 88 134 b 74 136 85 134 80 136 b 68 134 72 136 69 136 b 46 104 54 130 46 117 b 55 81 46 95 49 88 b 149 34 59 76 53 80 b 224 -1 190 15 224 0 b 144 -38 224 -1 187 -18 b 54 -84 59 -79 58 -79 b 46 -105 49 -90 46 -98 b 76 -137 46 -122 58 -137 b 78 -137 77 -137 77 -137 b 194 -86 87 -137 76 -141 b 298 -36 250 -58 298 -36 b 298 -36 298 -36 298 -36 b 402 -84 299 -36 345 -58 b 518 -137 522 -141 510 -137 b 521 -137 519 -137 519 -137 b 551 -105 539 -137 551 -122 b 541 -83 551 -98 548 -90 b 447 -36 537 -77 544 -81 b 374 -1 406 -16 374 -1 b 447 34 374 0 406 15 b 541 81 544 80 537 76 b 551 104 548 88 551 97 b 521 136 551 120 539 136 b 518 136 519 136 519 136 b 517 136 518 136 517 136 l 517 136 b 402 83 511 136 511 136 b 298 34 345 56 299 34 b 298 34 298 34 298 34 b 194 84 298 34 250 56 b 88 134 137 111 89 133 "}, 
"v93":{"x_min":0, "x_max":438.28125, "ha":447, "o":"m 212 205 b 219 205 213 205 216 205 b 239 183 228 205 231 204 b 421 -163 298 40 363 -83 b 438 -191 434 -180 438 -186 b 436 -197 438 -192 438 -195 b 424 -206 434 -204 431 -206 b 406 -201 420 -206 415 -205 b 216 -156 347 -172 281 -156 b 23 -205 148 -156 80 -173 b 14 -206 20 -206 17 -206 b 0 -191 6 -206 0 -201 b 6 -176 0 -187 1 -183 b 202 192 63 -104 142 45 b 212 205 205 199 208 202 m 264 48 l 249 81 l 243 94 l 242 91 b 89 -126 208 36 137 -66 b 81 -138 85 -133 81 -138 b 81 -138 81 -138 81 -138 b 81 -138 81 -138 81 -138 b 95 -133 81 -138 87 -136 b 280 -94 156 -108 221 -94 b 334 -98 299 -94 317 -95 b 343 -99 338 -99 343 -99 b 343 -99 343 -99 343 -99 b 338 -94 343 -99 341 -97 b 264 48 318 -58 287 1 "}, 
"v94":{"x_min":-149.71875, "x_max":148.359375, "ha":151, "o":"m -9 215 b 0 217 -6 217 -4 217 b 19 205 8 217 14 213 b 20 142 20 202 20 201 l 20 84 l 23 84 b 144 -27 81 74 129 30 b 148 -66 147 -40 148 -54 b 36 -213 148 -134 103 -197 b 0 -219 24 -217 12 -219 b -145 -104 -68 -219 -129 -173 b -149 -68 -148 -91 -149 -79 b -24 84 -149 6 -98 74 l -21 84 l -21 142 b -19 205 -20 201 -20 202 b -9 215 -17 209 -13 213 m -21 -15 b -23 41 -21 37 -21 41 b -23 41 -23 41 -23 41 b -76 11 -35 40 -62 26 b -108 -65 -98 -11 -108 -38 b -1 -176 -108 -122 -65 -176 b 107 -65 63 -176 107 -122 b 74 11 107 -38 96 -11 b 20 41 61 26 32 41 b 20 -15 20 41 20 15 b 19 -74 20 -72 20 -72 b 0 -87 14 -83 6 -87 b -19 -74 -8 -87 -16 -83 b -21 -15 -20 -72 -20 -72 "}, 
"v95":{"x_min":0, "x_max":406.96875, "ha":415, "o":"m 55 181 b 70 183 61 183 66 183 b 111 170 85 183 99 179 b 160 130 115 167 137 149 l 202 95 l 245 130 b 319 181 299 176 302 179 b 334 183 325 183 330 183 b 406 109 375 183 406 148 b 401 81 406 99 405 91 b 348 24 394 65 390 59 b 318 -1 332 11 318 0 b 348 -26 318 -1 332 -12 b 401 -83 390 -61 394 -66 b 406 -111 405 -93 406 -101 b 334 -184 406 -149 375 -184 b 319 -183 330 -184 325 -184 b 245 -131 302 -180 299 -177 l 202 -97 l 160 -131 b 85 -183 107 -177 103 -180 b 70 -184 80 -184 76 -184 b 0 -111 31 -184 0 -149 b 4 -83 0 -101 1 -93 b 58 -26 10 -66 16 -61 b 88 -1 74 -12 88 -1 b 58 24 88 0 74 11 b 10 69 23 54 17 59 b 0 109 2 81 0 95 b 55 181 0 142 21 173 m 83 133 b 72 136 78 136 76 136 b 57 131 66 136 61 134 b 46 109 49 126 46 117 b 50 93 46 104 47 98 b 107 45 51 91 77 70 b 160 0 137 20 160 0 b 107 -47 160 -1 137 -22 b 50 -94 77 -72 51 -93 b 46 -111 47 -99 46 -105 b 59 -134 46 -120 50 -130 b 72 -137 62 -136 68 -137 b 83 -136 76 -137 80 -136 b 144 -84 84 -134 107 -116 b 202 -36 176 -58 202 -36 b 261 -84 202 -36 230 -58 b 323 -136 299 -116 321 -134 b 334 -137 326 -136 330 -137 b 345 -134 338 -137 343 -136 b 360 -111 355 -130 360 -120 b 355 -94 360 -105 359 -99 b 299 -47 353 -93 329 -72 b 245 0 269 -22 245 -1 b 299 45 245 0 269 20 b 355 93 329 70 353 91 b 360 109 359 98 360 104 b 345 133 360 119 355 129 b 334 136 343 134 338 136 b 323 134 330 136 326 134 b 261 83 321 133 299 115 b 202 34 230 56 202 34 b 144 83 202 34 176 56 b 83 133 106 115 84 133 "}, 
"v97":{"x_min":-228.671875, "x_max":227.3125, "ha":232, "o":"m -217 487 l -213 488 l 0 488 l 212 488 l 216 487 b 225 476 220 484 224 480 l 227 473 l 227 244 l 227 15 l 225 12 b 206 0 223 4 215 0 b 197 1 204 0 200 0 b 187 12 193 4 189 6 l 186 15 l 186 138 l 186 262 l -1 262 l -187 262 l -187 138 l -187 15 l -189 12 b -208 0 -193 4 -200 0 b -227 12 -216 0 -223 4 l -228 15 l -228 244 l -228 473 l -227 476 b -217 487 -225 480 -221 484 "}, "v9a":{"x_min":-21.78125, "x_max":367.5, "ha":375, "o":"m 230 1031 b 238 1032 232 1032 235 1032 b 259 1014 245 1032 251 1027 b 367 662 330 906 367 782 b 364 602 367 641 367 621 b 232 317 352 488 304 384 b 57 120 155 245 103 187 b -1 18 31 84 6 40 b -19 4 -4 11 -12 4 l -21 4 l -21 159 l -21 315 l -16 315 b 96 335 10 315 62 324 b 315 695 227 380 315 527 b 313 738 315 709 314 724 b 224 991 304 825 273 916 b 216 1013 219 999 216 1007 b 230 1031 216 1021 220 1028 "}, 
"v9c":{"x_min":-166.0625, "x_max":-25.859375, "ha":0, "o":"m -49 369 b -42 370 -46 369 -44 370 b -27 360 -36 370 -29 366 b -25 355 -27 359 -25 358 b -32 335 -25 351 -28 347 b -92 52 -66 248 -87 159 b -93 -1 -93 43 -93 20 b -92 -54 -93 -23 -93 -45 b -32 -337 -85 -162 -66 -251 b -25 -355 -27 -349 -25 -352 b -42 -371 -25 -365 -32 -371 b -61 -353 -50 -371 -51 -369 b -163 -63 -119 -262 -153 -165 b -166 -1 -166 -37 -166 -31 b -163 62 -166 30 -166 36 b -61 352 -153 163 -119 260 b -49 369 -54 365 -51 366 "}, 
"va3":{"x_min":58.53125, "x_max":228.671875, "ha":294, "o":"m 138 371 b 142 373 140 371 141 373 b 178 342 149 373 156 366 b 228 251 217 297 228 278 b 228 244 228 248 228 247 b 176 147 227 212 212 184 b 123 73 152 122 132 93 b 121 62 122 70 121 66 b 145 13 121 48 129 31 b 153 -2 151 6 153 1 b 149 -9 153 -5 152 -6 b 144 -11 148 -11 145 -11 b 129 -1 140 -11 136 -8 b 61 87 89 37 68 68 b 58 113 59 95 58 105 b 110 215 58 144 74 177 b 163 287 134 240 155 269 b 166 299 166 291 166 295 b 141 348 166 313 157 330 b 133 360 134 356 133 358 b 133 363 133 362 133 362 b 138 371 133 367 136 370 "}, 
"va5":{"x_min":0, "x_max":349.8125, "ha":357, "o":"m 88 302 b 103 303 93 302 98 303 b 202 224 149 303 191 270 b 205 199 204 216 205 208 b 178 129 205 173 196 147 l 175 126 l 182 127 b 307 249 236 142 284 190 b 313 259 308 254 311 258 b 329 267 317 265 323 267 b 349 247 340 267 349 259 b 201 -263 349 242 204 -258 b 182 -273 197 -270 190 -273 b 163 -260 174 -273 166 -269 b 161 -256 161 -259 161 -258 b 217 -59 161 -248 170 -220 b 272 129 247 43 272 127 b 272 129 272 129 272 129 b 264 122 272 129 268 126 b 140 80 227 94 183 80 b 36 115 102 80 65 91 b 0 194 10 136 0 165 b 88 302 0 244 32 292 "}, 
"va9":{"x_min":-24.5, "x_max":314.421875, "ha":321, "o":"m -24 -145 l -24 -5 l -20 -5 b 0 -23 -9 -5 -2 -12 b 27 -87 4 -38 14 -66 b 138 -220 53 -136 88 -177 b 235 -328 179 -255 208 -288 b 314 -592 287 -409 314 -501 b 292 -732 314 -639 307 -687 l 289 -742 l 294 -756 b 314 -896 307 -802 314 -849 b 292 -1035 314 -943 307 -991 l 289 -1045 l 294 -1057 b 314 -1197 307 -1104 314 -1152 b 292 -1338 314 -1246 307 -1292 l 289 -1347 l 294 -1360 b 314 -1500 307 -1407 314 -1454 b 273 -1689 314 -1565 300 -1628 b 250 -1712 265 -1710 261 -1712 b 228 -1691 236 -1712 228 -1704 l 228 -1685 l 234 -1675 b 270 -1507 258 -1621 270 -1564 b 98 -1193 270 -1381 209 -1261 b 40 -1174 76 -1179 58 -1174 b -10 -1189 24 -1174 8 -1178 b -20 -1192 -14 -1192 -16 -1192 l -24 -1192 l -24 -1052 l -24 -913 l -20 -913 b 0 -931 -9 -913 -2 -920 b 27 -995 4 -946 14 -974 b 138 -1128 53 -1043 88 -1085 b 257 -1275 190 -1172 228 -1220 b 262 -1283 259 -1279 262 -1283 l 262 -1283 b 269 -1249 264 -1282 268 -1260 b 270 -1206 270 -1233 270 -1220 b 98 -891 270 -1075 206 -957 b 40 -871 76 -877 58 -871 b -10 -886 24 -871 8 -875 b -20 -889 -14 -889 -16 -889 l -24 -889 l -24 -749 l -24 -610 l -20 -610 b 0 -628 -9 -610 -2 -617 b 27 -692 4 -644 14 -671 b 138 -825 53 -741 88 -782 b 257 -973 190 -870 228 -917 b 262 -981 259 -977 262 -981 l 262 -981 b 269 -946 264 -979 268 -957 b 270 -903 270 -931 270 -917 b 98 -588 270 -774 206 -655 b 40 -569 76 -574 58 -569 b -10 -584 24 -569 8 -574 b -20 -587 -14 -587 -16 -587 l -24 -587 l -24 -448 l -24 -308 l -20 -308 b 0 -326 -9 -308 -2 -315 b 27 -390 4 -341 14 -369 b 138 -523 53 -438 88 -480 b 257 -670 190 -567 228 -614 b 262 -678 259 -674 262 -678 b 262 -678 262 -678 262 -678 b 269 -644 264 -677 268 -656 b 270 -601 270 -628 270 -614 b 98 -285 270 -471 206 -352 b 40 -266 76 -273 58 -266 b -10 -281 24 -266 8 -272 b -20 -284 -14 -284 -16 -284 l -24 -284 l -24 -145 "}, 
"vad":{"x_min":0, "x_max":873.828125, "ha":892, "o":"m 0 0 l 0 703 l 81 703 l 164 703 l 164 0 l 164 -705 l 81 -705 l 0 -705 l 0 0 m 225 0 l 225 703 l 246 703 l 268 703 l 268 366 l 268 30 l 274 36 b 314 79 284 44 302 63 b 413 302 357 137 392 213 b 432 327 419 324 421 327 b 449 306 443 327 447 322 b 611 115 457 195 529 115 b 651 122 624 115 638 117 b 728 316 705 140 724 188 b 729 388 728 342 729 366 b 671 635 729 533 711 602 b 581 662 649 652 616 662 b 477 637 545 662 510 653 l 475 635 l 477 634 b 503 627 488 632 495 631 b 545 556 532 612 545 584 b 491 480 545 524 526 491 b 465 474 481 476 473 474 b 379 563 417 474 379 516 b 389 602 379 576 382 588 b 541 691 409 641 479 681 b 582 694 555 692 568 694 b 865 462 714 694 834 598 b 873 392 871 440 873 416 b 865 317 873 367 871 341 b 639 84 839 194 748 101 b 612 83 630 83 620 83 b 511 116 577 83 543 94 b 504 120 509 119 506 120 b 504 120 504 120 504 120 b 469 59 504 120 488 93 l 432 -1 l 469 -61 b 504 -122 488 -94 504 -122 b 504 -122 504 -122 504 -122 b 511 -117 506 -122 509 -120 b 612 -84 543 -95 577 -84 b 665 -91 630 -84 647 -87 b 869 -338 771 -122 850 -216 b 873 -392 872 -356 873 -374 b 798 -595 873 -469 847 -539 b 581 -695 741 -662 660 -695 b 406 -626 517 -695 454 -671 b 381 -563 389 -607 381 -585 b 465 -477 381 -519 413 -477 b 545 -559 514 -477 545 -519 b 503 -628 545 -587 532 -613 b 477 -635 495 -632 488 -634 l 475 -637 l 477 -638 b 581 -663 510 -655 545 -663 b 671 -637 616 -663 649 -653 b 729 -391 711 -603 729 -534 b 728 -317 729 -367 728 -344 b 623 -117 722 -173 698 -124 b 611 -116 619 -116 615 -116 b 449 -308 528 -116 457 -198 b 432 -328 447 -323 443 -328 b 413 -303 421 -328 419 -326 b 314 -80 392 -215 357 -138 b 274 -37 302 -65 284 -45 l 268 -31 l 268 -367 l 268 -705 l 246 -705 l 225 -705 l 225 0 "}, 
"vb3":{"x_min":0, "x_max":227.3125, "ha":232, "o":"m 91 213 b 100 215 93 215 96 215 b 227 58 167 215 224 144 b 227 52 227 56 227 54 b 61 -201 227 -43 164 -138 b 29 -216 44 -212 36 -216 b 23 -210 27 -216 24 -213 b 21 -205 21 -208 21 -206 b 34 -192 21 -201 25 -197 b 122 -55 89 -161 122 -106 b 104 6 122 -33 117 -12 l 103 9 l 96 9 b 4 79 57 9 17 38 b 0 112 1 90 0 101 b 91 213 0 163 36 209 "}, "vb6":{"x_min":0, "x_max":556.6875, "ha":568, "o":"m 289 545 b 298 546 292 545 295 546 b 318 533 306 546 315 541 b 319 428 319 530 319 528 l 319 327 l 334 327 b 526 223 412 326 485 285 b 543 172 537 206 543 190 b 447 76 543 122 503 76 b 445 76 446 76 446 76 b 359 165 394 77 359 119 b 368 205 359 179 362 192 b 441 251 382 233 412 251 b 455 249 446 251 451 251 b 460 248 458 249 460 248 b 460 248 460 248 460 248 b 454 254 460 249 458 251 b 334 295 419 280 378 294 l 319 295 l 319 4 l 319 -287 l 321 -285 b 328 -285 322 -285 325 -285 b 524 -99 424 -277 507 -198 b 541 -79 526 -84 530 -79 b 556 -97 551 -79 556 -84 b 548 -133 556 -105 553 -117 b 334 -317 521 -233 434 -306 b 322 -319 329 -317 323 -317 l 319 -319 l 319 -424 b 319 -471 319 -444 319 -459 b 313 -541 319 -544 318 -535 b 298 -548 308 -545 303 -548 b 279 -534 289 -548 281 -542 b 277 -424 277 -531 277 -530 l 277 -317 l 273 -317 b 13 -95 153 -305 51 -217 b 0 2 4 -62 0 -29 b 182 295 0 126 66 238 b 274 324 210 309 249 320 l 277 324 l 277 427 b 279 533 277 528 277 530 b 289 545 281 538 285 542 m 277 2 b 277 291 277 161 277 291 b 268 288 277 291 273 290 b 144 1 179 265 144 184 b 276 -284 144 -199 175 -267 l 277 -285 l 277 2 "}, 
"vb9":{"x_min":-122.5, "x_max":121.140625, "ha":124, "o":"m -16 145 b 0 147 -10 147 -5 147 b 121 -1 66 147 121 77 b 114 -49 121 -16 118 -33 b -1 -148 95 -112 47 -148 b -85 -106 -31 -148 -61 -134 b -122 -1 -110 -76 -122 -38 b -16 145 -122 68 -81 134 m 12 111 b 0 113 8 113 4 113 b -68 22 -29 113 -61 73 b -70 0 -69 15 -70 6 b -13 -113 -70 -49 -47 -98 b -1 -115 -9 -115 -5 -115 b 63 -40 24 -115 53 -83 b 68 -1 66 -27 68 -15 b 12 111 68 48 46 97 "}, "vba":{"x_min":-118.421875, "x_max":597.53125, "ha":381, 
"o":"m 460 574 b 464 574 461 574 462 574 b 488 574 470 574 481 574 b 500 573 491 574 498 574 b 594 503 543 570 588 538 b 597 488 596 498 597 494 b 528 417 597 449 564 417 b 502 423 519 417 510 419 b 465 481 477 434 465 458 b 488 528 465 499 472 516 b 490 530 490 530 490 530 b 490 530 490 530 490 530 b 468 517 488 530 475 523 b 349 340 419 485 377 420 b 347 330 348 334 347 330 b 383 328 347 328 363 328 b 428 326 423 328 424 328 b 442 302 438 320 442 312 b 430 281 442 294 438 285 b 385 276 424 277 426 276 l 377 276 l 332 276 l 330 269 b 178 -117 303 126 250 -9 b 1 -249 129 -194 69 -237 b -20 -251 -6 -251 -13 -251 b -114 -187 -65 -251 -100 -227 b -118 -156 -117 -177 -118 -166 b -51 -84 -118 -116 -91 -84 b -31 -87 -46 -84 -39 -86 b 16 -152 0 -95 16 -124 b -12 -205 16 -173 8 -194 b -16 -208 -14 -206 -16 -208 b -14 -208 -16 -208 -14 -208 b -9 -206 -14 -208 -12 -208 b 74 -124 23 -197 54 -166 b 172 224 98 -79 125 22 b 185 276 178 252 183 274 b 185 276 185 276 185 276 b 141 276 185 276 181 276 b 91 280 96 276 96 276 b 77 302 83 285 77 294 b 91 326 77 312 83 320 b 148 328 95 328 96 328 l 198 330 l 202 341 b 460 574 249 473 351 566 "}, 
"vbf":{"x_min":-53.078125, "x_max":513.140625, "ha":485, "o":"m 185 383 b 196 384 187 383 191 384 b 277 334 230 384 259 365 b 288 301 281 324 288 306 b 288 297 288 298 288 297 b 294 302 289 297 291 299 b 394 370 323 338 367 367 b 404 371 398 370 401 371 b 510 272 453 371 498 328 b 513 237 513 262 513 251 b 507 172 513 217 511 192 b 326 -34 487 59 412 -26 b 314 -36 322 -36 318 -36 b 274 -24 298 -36 283 -31 l 265 -16 b 224 44 246 -1 232 20 b 223 49 224 47 223 49 b 223 49 223 49 223 49 b 149 -197 221 48 149 -194 b 149 -198 149 -197 149 -198 b 170 -210 149 -202 155 -205 b 187 -215 174 -210 175 -212 b 204 -231 201 -219 204 -222 b 197 -245 204 -240 202 -242 l 194 -248 l 76 -248 l -42 -248 l -46 -245 b -53 -231 -51 -242 -53 -240 b -35 -215 -53 -222 -49 -217 b -13 -210 -21 -212 -20 -212 b -6 -208 -10 -209 -8 -208 b 0 -206 -6 -208 -2 -206 b 25 -188 13 -201 21 -195 b 163 280 28 -183 163 276 b 166 291 163 283 164 287 b 167 302 167 295 167 299 b 155 324 167 315 161 324 b 155 324 155 324 155 324 b 65 230 125 322 85 280 b 53 215 61 217 58 215 b 51 215 53 215 51 215 b 42 224 46 215 42 217 b 57 263 42 231 47 244 b 140 360 77 305 104 337 b 152 370 144 365 149 369 b 185 383 157 376 172 381 m 374 306 b 366 308 371 308 368 308 b 300 273 348 308 321 294 b 284 254 288 262 287 259 b 280 242 283 249 281 245 b 257 169 279 240 270 213 l 236 98 l 236 93 b 251 48 238 77 243 61 b 279 27 258 37 272 27 b 281 27 279 27 280 27 b 291 31 281 27 287 30 b 396 170 334 52 378 109 b 406 247 402 197 406 224 b 401 277 406 259 405 270 b 374 306 397 290 383 303 "}, 
"vc3":{"x_min":-10.890625, "x_max":299.4375, "ha":294, "o":"m 136 460 b 142 462 137 462 140 462 b 166 449 152 462 161 456 b 171 428 168 446 168 445 b 288 131 194 322 238 209 b 298 115 295 120 296 117 b 299 106 298 112 299 109 b 273 81 299 91 287 81 b 255 86 268 81 261 83 b 155 116 225 104 183 116 l 152 116 l 149 108 b 141 83 148 102 144 91 b 134 48 137 69 134 58 b 149 9 134 34 140 24 b 153 -1 152 5 153 1 b 149 -9 153 -5 152 -6 b 144 -11 148 -11 147 -11 b 122 2 138 -11 133 -6 b 95 61 104 20 95 38 b 107 108 95 74 99 90 b 108 113 107 111 108 112 b 107 113 108 113 108 113 b 102 113 106 113 104 113 b 31 86 76 108 53 98 b 14 80 24 81 20 80 b -10 106 0 80 -10 91 b 0 131 -10 115 -9 116 b 115 430 49 209 91 317 b 136 460 119 451 123 456 "}}, 
"cssFontWeight":"normal", "ascender":1903, "underlinePosition":-125, "cssFontStyle":"normal", "boundingBox":{"yMin":-2065.375, "xMin":-695.53125, "yMax":1901.578125, "xMax":1159.671875}, "resolution":1E3, "descender":-2066, "familyName":"VexFlow-18", "lineHeight":4093, "underlineThickness":50};
Vex.Flow.renderGlyph = function(ctx, x_pos, y_pos, point, val, nocache) {
  var scale = point * 72 / (Vex.Flow.Font.resolution * 100);
  var metrics = Vex.Flow.Glyph.loadMetrics(Vex.Flow.Font, val, !nocache);
  Vex.Flow.Glyph.renderOutline(ctx, metrics.outline, scale, x_pos, y_pos)
};
Vex.Flow.Glyph = function(code, point, options) {
  this.code = code;
  this.point = point;
  this.context = null;
  this.options = {cache:true, font:Vex.Flow.Font};
  this.width = null;
  this.metrics = null;
  this.x_shift = 0;
  this.y_shift = 0;
  if(options) {
    this.setOptions(options)
  }else {
    this.reset()
  }
};
Vex.Flow.Glyph.prototype.setOptions = function(options) {
  Vex.Merge(this.options, options);
  this.reset()
};
Vex.Flow.Glyph.prototype.setStave = function(stave) {
  this.stave = stave;
  return this
};
Vex.Flow.Glyph.prototype.setXShift = function(x_shift) {
  this.x_shift = x_shift;
  return this
};
Vex.Flow.Glyph.prototype.setYShift = function(y_shift) {
  this.y_shift = y_shift;
  return this
};
Vex.Flow.Glyph.prototype.setContext = function(context) {
  this.context = context;
  return this
};
Vex.Flow.Glyph.prototype.getContext = function(context) {
  return this.context
};
Vex.Flow.Glyph.prototype.reset = function() {
  this.metrics = Vex.Flow.Glyph.loadMetrics(this.options.font, this.code, this.options.cache);
  this.scale = this.point * 72 / (this.options.font.resolution * 100)
};
Vex.Flow.Glyph.prototype.getMetrics = function() {
  if(!this.metrics) {
    throw new Vex.RuntimeError("BadGlyph", "Glyph " + this.code + " is not initialized.");
  }
  return{x_min:this.metrics.x_min * this.scale, x_max:this.metrics.x_max * this.scale, width:(this.metrics.x_max - this.metrics.x_min) * this.scale}
};
Vex.Flow.Glyph.prototype.render = function(ctx, x_pos, y_pos) {
  if(!this.metrics) {
    throw new Vex.RuntimeError("BadGlyph", "Glyph " + this.code + " is not initialized.");
  }
  var outline = this.metrics.outline;
  var scale = this.scale;
  var outlineLength = outline.length;
  Vex.Flow.Glyph.renderOutline(ctx, outline, scale, x_pos, y_pos)
};
Vex.Flow.Glyph.prototype.renderToStave = function(x) {
  if(!this.metrics) {
    throw new Vex.RuntimeError("BadGlyph", "Glyph " + this.code + " is not initialized.");
  }
  if(!this.stave) {
    throw new Vex.RuntimeError("GlyphError", "No valid stave");
  }
  if(!this.context) {
    throw new Vex.RERR("GlyphError", "No valid context");
  }
  var outline = this.metrics.outline;
  var scale = this.scale;
  var outlineLength = outline.length;
  Vex.Flow.Glyph.renderOutline(this.context, outline, scale, x + this.x_shift, this.stave.getYForGlyphs() + this.y_shift)
};
Vex.Flow.Glyph.loadMetrics = function(font, code, cache) {
  var glyph = font.glyphs[code];
  if(!glyph) {
    throw new Vex.RuntimeError("BadGlyph", "Glyph " + code + " does not exist in font.");
  }
  var x_min = glyph["x_min"];
  var x_max = glyph["x_max"];
  var outline;
  if(glyph["o"]) {
    if(cache) {
      if(glyph.cached_outline) {
        outline = glyph.cached_outline
      }else {
        outline = glyph["o"].split(" ");
        glyph.cached_outline = outline
      }
    }else {
      if(glyph.cached_outline) {
        delete glyph.cached_outline
      }
      outline = glyph["o"].split(" ")
    }
    return{x_min:x_min, x_max:x_max, outline:outline}
  }else {
    throw new Vex.RuntimeError("BadGlyph", "Glyph " + this.code + " has no outline defined.");
  }
};
Vex.Flow.Glyph.renderOutline = function(ctx, outline, scale, x_pos, y_pos) {
  var outlineLength = outline.length;
  ctx.beginPath();
  ctx.moveTo(x_pos, y_pos);
  for(var i = 0;i < outlineLength;) {
    var action = outline[i++];
    switch(action) {
      case "m":
        ctx.moveTo(x_pos + outline[i++] * scale, y_pos + outline[i++] * -scale);
        break;
      case "l":
        ctx.lineTo(x_pos + outline[i++] * scale, y_pos + outline[i++] * -scale);
        break;
      case "q":
        var cpx = x_pos + outline[i++] * scale;
        var cpy = y_pos + outline[i++] * -scale;
        ctx.quadraticCurveTo(x_pos + outline[i++] * scale, y_pos + outline[i++] * -scale, cpx, cpy);
        break;
      case "b":
        var x = x_pos + outline[i++] * scale;
        var y = y_pos + outline[i++] * -scale;
        ctx.bezierCurveTo(x_pos + outline[i++] * scale, y_pos + outline[i++] * -scale, x_pos + outline[i++] * scale, y_pos + outline[i++] * -scale, x, y);
        break
    }
  }
  ctx.fill()
};
Vex.Flow.Stave = function(x, y, width, options) {
  if(arguments.length > 0) {
    this.init(x, y, width, options)
  }
};
Vex.Flow.Stave.prototype.init = function(x, y, width, options) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.glyph_start_x = x + 5;
  this.start_x = this.glyph_start_x;
  this.context = null;
  this.glyphs = [];
  this.modifiers = [];
  this.measure = 0;
  this.clef = "treble";
  this.font = {family:"sans-serif", size:8, weight:""};
  this.options = {vertical_bar_width:10, glyph_spacing_px:10, num_lines:5, spacing_between_lines_px:10, space_above_staff_ln:4, space_below_staff_ln:4, top_text_position:1, bottom_text_position:6};
  this.bounds = {x:this.x, y:this.y, w:this.width, h:0};
  Vex.Merge(this.options, options);
  this.options.line_config = [];
  for(var i = 0;i < this.options.num_lines;i++) {
    this.options.line_config.push({visible:true})
  }
  this.height = (this.options.num_lines + this.options.space_above_staff_ln) * this.options.spacing_between_lines_px;
  this.modifiers.push(new Vex.Flow.Barline(Vex.Flow.Barline.type.SINGLE, this.x));
  this.modifiers.push(new Vex.Flow.Barline(Vex.Flow.Barline.type.SINGLE, this.x + this.width))
};
Vex.Flow.Stave.prototype.setNoteStartX = function(x) {
  this.start_x = x;
  return this
};
Vex.Flow.Stave.prototype.getNoteStartX = function() {
  var start_x = this.start_x;
  if(this.modifiers[0].barline == Vex.Flow.Barline.type.REPEAT_BEGIN) {
    start_x += 10
  }
  return start_x
};
Vex.Flow.Stave.prototype.getNoteEndX = function() {
  return this.x + this.width
};
Vex.Flow.Stave.prototype.getTieStartX = function() {
  return this.start_x
};
Vex.Flow.Stave.prototype.getTieEndX = function() {
  return this.x + this.width
};
Vex.Flow.Stave.prototype.setContext = function(context) {
  this.context = context;
  return this
};
Vex.Flow.Stave.prototype.getContext = function() {
  return this.context
};
Vex.Flow.Stave.prototype.getX = function() {
  return this.x
};
Vex.Flow.Stave.prototype.getNumLines = function() {
  return this.options.num_lines
};
Vex.Flow.Stave.prototype.setY = function(y) {
  this.y = y;
  return this
};
Vex.Flow.Stave.prototype.setWidth = function(width) {
  this.width = width;
  this.modifiers[1].setX(this.x + this.width);
  return this
};
Vex.Flow.Stave.prototype.setMeasure = function(measure) {
  this.measure = measure;
  return this
};
Vex.Flow.Stave.prototype.setBegBarType = function(type) {
  if(type == Vex.Flow.Barline.type.SINGLE || type == Vex.Flow.Barline.type.REPEAT_BEGIN || type == Vex.Flow.Barline.type.NONE) {
    this.modifiers[0] = new Vex.Flow.Barline(type, this.x)
  }
  return this
};
Vex.Flow.Stave.prototype.setEndBarType = function(type) {
  if(type != Vex.Flow.Barline.type.REPEAT_BEGIN) {
    this.modifiers[1] = new Vex.Flow.Barline(type, this.x + this.width)
  }
  return this
};
Vex.Flow.Stave.prototype.setRepetitionTypeLeft = function(type, y) {
  this.modifiers.push(new Vex.Flow.Repetition(type, this.x, y));
  return this
};
Vex.Flow.Stave.prototype.setRepetitionTypeRight = function(type, y) {
  this.modifiers.push(new Vex.Flow.Repetition(type, this.x, y));
  return this
};
Vex.Flow.Stave.prototype.setVoltaType = function(type, number_t, y) {
  this.modifiers.push(new Vex.Flow.Volta(type, number_t, this.x, y));
  return this
};
Vex.Flow.Stave.prototype.setSection = function(section, y) {
  this.modifiers.push(new Vex.Flow.StaveSection(section, this.x, y));
  return this
};
Vex.Flow.Stave.prototype.setTempo = function(tempo, y) {
  this.modifiers.push(new Vex.Flow.StaveTempo(tempo, this.x, y));
  return this
};
Vex.Flow.Stave.prototype.getHeight = function() {
  return this.height
};
Vex.Flow.Stave.prototype.getSpacingBetweenLines = function() {
  return this.options.spacing_between_lines_px
};
Vex.Flow.Stave.prototype.getBoundingBox = function() {
  return new Vex.Flow.BoundingBox(this.x, this.y, this.width, this.getBottomY() - this.y)
};
Vex.Flow.Stave.prototype.getBottomY = function() {
  var options = this.options;
  var spacing = options.spacing_between_lines_px;
  var score_bottom = this.getYForLine(options.num_lines) + options.space_below_staff_ln * spacing;
  return score_bottom
};
Vex.Flow.Stave.prototype.getYForLine = function(line) {
  var options = this.options;
  var spacing = options.spacing_between_lines_px;
  var headroom = options.space_above_staff_ln;
  var y = this.y + (line * spacing + headroom * spacing);
  return y
};
Vex.Flow.Stave.prototype.getYForTopText = function(line) {
  var l = line || 0;
  return this.getYForLine(-l - this.options.top_text_position)
};
Vex.Flow.Stave.prototype.getYForBottomText = function(line) {
  var l = line || 0;
  return this.getYForLine(this.options.bottom_text_position + l)
};
Vex.Flow.Stave.prototype.getYForNote = function(line) {
  var options = this.options;
  var spacing = options.spacing_between_lines_px;
  var headroom = options.space_above_staff_ln;
  var y = this.y + headroom * spacing + 5 * spacing - line * spacing;
  return y
};
Vex.Flow.Stave.prototype.getYForGlyphs = function() {
  return this.getYForLine(3)
};
Vex.Flow.Stave.prototype.addGlyph = function(glyph) {
  glyph.setStave(this);
  this.glyphs.push(glyph);
  this.start_x += glyph.getMetrics().width;
  return this
};
Vex.Flow.Stave.prototype.addModifier = function(modifier) {
  this.modifiers.push(modifier);
  modifier.addToStave(this, this.glyphs.length == 0);
  return this
};
Vex.Flow.Stave.prototype.addKeySignature = function(keySpec) {
  this.addModifier(new Vex.Flow.KeySignature(keySpec));
  return this
};
Vex.Flow.Stave.prototype.addClef = function(clef) {
  this.clef = clef;
  this.addModifier(new Vex.Flow.Clef(clef));
  return this
};
Vex.Flow.Stave.prototype.addTimeSignature = function(timeSpec) {
  this.addModifier(new Vex.Flow.TimeSignature(timeSpec));
  return this
};
Vex.Flow.Stave.prototype.addTrebleGlyph = function() {
  this.clef = "treble";
  this.addGlyph(new Vex.Flow.Glyph("v83", 40));
  return this
};
Vex.Flow.Stave.prototype.draw = function(context) {
  if(!this.context) {
    throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
  }
  var num_lines = this.options.num_lines;
  var width = this.width;
  var x = this.x;
  for(var line = 0;line < num_lines;line++) {
    var y = this.getYForLine(line);
    if(this.options.line_config[line].visible) {
      this.context.fillRect(x, y, width, 1)
    }
  }
  x = this.glyph_start_x;
  var bar_x_shift = 0;
  for(var i = 0;i < this.glyphs.length;++i) {
    var glyph = this.glyphs[i];
    if(!glyph.getContext()) {
      glyph.setContext(this.context)
    }
    glyph.renderToStave(x);
    x += glyph.getMetrics().width;
    bar_x_shift += glyph.getMetrics().width
  }
  if(bar_x_shift > 0) {
    bar_x_shift += this.options.vertical_bar_width
  }
  for(var i = 0;i < this.modifiers.length;i++) {
    if(typeof this.modifiers[i].draw == "function") {
      this.modifiers[i].draw(this, bar_x_shift)
    }
  }
  if(this.measure > 0) {
    this.context.save();
    this.context.setFont(this.font.family, this.font.size, this.font.weight);
    var text_width = this.context.measureText("" + this.measure).width;
    var y = this.getYForTopText(0) + 3;
    this.context.fillText("" + this.measure, this.x - text_width / 2, y);
    this.context.restore()
  }
  return this
};
Vex.Flow.Stave.prototype.drawVertical = function(x, isDouble) {
  this.drawVerticalFixed(this.x + x, isDouble)
};
Vex.Flow.Stave.prototype.drawVerticalFixed = function(x, isDouble) {
  if(!this.context) {
    throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
  }
  var top_line = this.getYForLine(0);
  var bottom_line = this.getYForLine(this.options.num_lines - 1);
  if(isDouble) {
    this.context.fillRect(x - 3, top_line, 1, bottom_line - top_line + 1)
  }
  this.context.fillRect(x, top_line, 1, bottom_line - top_line + 1)
};
Vex.Flow.Stave.prototype.drawVerticalBar = function(x) {
  this.drawVerticalBarFixed(this.x + x, false)
};
Vex.Flow.Stave.prototype.drawVerticalBarFixed = function(x) {
  if(!this.context) {
    throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
  }
  var top_line = this.getYForLine(0);
  var bottom_line = this.getYForLine(this.options.num_lines - 1);
  this.context.fillRect(x, top_line, 1, bottom_line - top_line + 1)
};
Vex.Flow.Stave.prototype.getConfigForLines = function() {
  return this.options.line_config
};
Vex.Flow.Stave.prototype.setConfigForLine = function(line_number, line_config) {
  if(line_number >= this.options.num_lines || line_number < 0) {
    throw new Vex.RERR("StaveConfigError", "The line number must be within the range of the number of lines in the Stave.");
  }
  if(!line_config.hasOwnProperty("visible")) {
    throw new Vex.RERR("StaveConfigError", "The line configuration object is missing the 'visible' property.");
  }
  if(typeof line_config.visible !== "boolean") {
    throw new Vex.RERR("StaveConfigError", "The line configuration objects 'visible' property must be true or false.");
  }
  this.options.line_config[line_number] = line_config;
  return this
};
Vex.Flow.Stave.prototype.setConfigForLines = function(lines_configuration) {
  if(lines_configuration.length !== this.options.num_lines) {
    throw new Vex.RERR("StaveConfigError", "The length of the lines configuration array must match the number of lines in the Stave");
  }
  for(var line_config in lines_configuration) {
    if(!lines_configuration[line_config]) {
      lines_configuration[line_config] = this.options.line_config[line_config]
    }
    Vex.Merge(this.options.line_config[line_config], lines_configuration[line_config])
  }
  this.options.line_config = lines_configuration;
  return this
};
Vex.Flow.StaveConnector = function(top_stave, bottom_stave) {
  this.init(top_stave, bottom_stave)
};
Vex.Flow.StaveConnector.type = {SINGLE:1, DOUBLE:2, BRACE:3, BRACKET:4};
Vex.Flow.StaveConnector.prototype.init = function(top_stave, bottom_stave) {
  this.width = 3;
  this.top_stave = top_stave;
  this.bottom_stave = bottom_stave;
  this.type = Vex.Flow.StaveConnector.type.DOUBLE
};
Vex.Flow.StaveConnector.prototype.setContext = function(ctx) {
  this.ctx = ctx;
  return this
};
Vex.Flow.StaveConnector.prototype.setType = function(type) {
  if(type >= Vex.Flow.StaveConnector.type.SINGLE && type <= Vex.Flow.StaveConnector.type.BRACKET) {
    this.type = type
  }
  return this
};
Vex.Flow.StaveConnector.prototype.draw = function() {
  if(!this.ctx) {
    throw new Vex.RERR("NoContext", "Can't draw without a context.");
  }
  var topY = this.top_stave.getYForLine(0);
  var botY = this.bottom_stave.getYForLine(this.bottom_stave.getNumLines() - 1);
  var width = this.width;
  var topX = this.top_stave.getX();
  var attachment_height = botY - topY;
  switch(this.type) {
    case Vex.Flow.StaveConnector.type.SINGLE:
      width = 1;
      break;
    case Vex.Flow.StaveConnector.type.DOUBLE:
      topX -= this.width + 2;
      break;
    case Vex.Flow.StaveConnector.type.BRACE:
      width = 12;
      var x1 = this.top_stave.getX() - 2;
      var y1 = topY;
      var x3 = x1;
      var y3 = botY;
      var x2 = x1 - width;
      var y2 = y1 + attachment_height / 2;
      var cpx1 = x2 - 0.9 * width;
      var cpy1 = y1 + 0.2 * attachment_height;
      var cpx2 = x1 + 1.1 * width;
      var cpy2 = y2 - 0.135 * attachment_height;
      var cpx3 = cpx2;
      var cpy3 = y2 + 0.135 * attachment_height;
      var cpx4 = cpx1;
      var cpy4 = y3 - 0.2 * attachment_height;
      var cpx5 = x2 - width;
      var cpy5 = cpy4;
      var cpx6 = x1 + 0.4 * width;
      var cpy6 = y2 + 0.135 * attachment_height;
      var cpx7 = cpx6;
      var cpy7 = y2 - 0.135 * attachment_height;
      var cpx8 = cpx5;
      var cpy8 = cpy1;
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);
      this.ctx.bezierCurveTo(cpx3, cpy3, cpx4, cpy4, x3, y3);
      this.ctx.bezierCurveTo(cpx5, cpy5, cpx6, cpy6, x2, y2);
      this.ctx.bezierCurveTo(cpx7, cpy7, cpx8, cpy8, x1, y1);
      this.ctx.fill();
      this.ctx.stroke();
      break;
    case Vex.Flow.StaveConnector.type.BRACKET:
      topY -= 4;
      botY += 4;
      attachment_height = botY - topY;
      Vex.Flow.renderGlyph(this.ctx, topX - 5, topY - 3, 40, "v1b", true);
      Vex.Flow.renderGlyph(this.ctx, topX - 5, botY + 3, 40, "v10", true);
      topX -= this.width + 2;
      break
  }
  if(this.type != Vex.Flow.StaveConnector.type.BRACE) {
    this.ctx.fillRect(topX, topY, width, attachment_height)
  }
};
Vex.Flow.TabStave = function(x, y, width, options) {
  if(arguments.length > 0) {
    this.init(x, y, width, options)
  }
};
Vex.Flow.TabStave.prototype = new Vex.Flow.Stave;
Vex.Flow.TabStave.prototype.constructor = Vex.Flow.TabStave;
Vex.Flow.TabStave.superclass = Vex.Flow.Stave.prototype;
Vex.Flow.TabStave.prototype.init = function(x, y, width, options) {
  var superclass = Vex.Flow.TabStave.superclass;
  var tab_options = {spacing_between_lines_px:13, num_lines:6, top_text_position:1, bottom_text_position:7};
  Vex.Merge(tab_options, options);
  superclass.init.call(this, x, y, width, tab_options)
};
Vex.Flow.TabStave.prototype.setNumberOfLines = function(lines) {
  this.options.num_lines = lines;
  return this
};
Vex.Flow.TabStave.prototype.getYForGlyphs = function() {
  return this.getYForLine(2.5)
};
Vex.Flow.TabStave.prototype.addTabGlyph = function() {
  var glyphScale;
  var glyphOffset;
  switch(this.options.num_lines) {
    case 6:
      glyphScale = 40;
      glyphOffset = 0;
      break;
    case 5:
      glyphScale = 30;
      glyphOffset = -6;
      break;
    case 4:
      glyphScale = 23;
      glyphOffset = -12;
      break
  }
  var tabGlyph = new Vex.Flow.Glyph("v2f", glyphScale);
  tabGlyph.y_shift = glyphOffset;
  this.addGlyph(tabGlyph);
  return this
};
Vex.Flow.TickContext = function() {
  this.init()
};
Vex.Flow.TickContext.prototype.init = function() {
  this.currentTick = new Vex.Flow.Fraction(0, 1);
  this.maxTicks = new Vex.Flow.Fraction(0, 1);
  this.minTicks = null;
  this.width = 0;
  this.padding = 3;
  this.pixelsUsed = 0;
  this.x = 0;
  this.tickables = [];
  this.notePx = 0;
  this.extraLeftPx = 0;
  this.extraRightPx = 0;
  this.ignore_ticks = true;
  this.preFormatted = false;
  this.context = null
};
Vex.Flow.TickContext.prototype.setContext = function(context) {
  this.context = context;
  return this
};
Vex.Flow.TickContext.prototype.getContext = function() {
  return this.context
};
Vex.Flow.TickContext.prototype.getMetrics = function() {
  return{width:this.width, notePx:this.notePx, extraLeftPx:this.extraLeftPx, extraRightPx:this.extraRightPx}
};
Vex.Flow.TickContext.prototype.setCurrentTick = function(tick) {
  this.currentTick = tick;
  this.preFormatted = false
};
Vex.Flow.TickContext.prototype.getCurrentTick = function() {
  return this.currentTick
};
Vex.Flow.TickContext.prototype.shouldIgnoreTicks = function() {
  return this.ignore_ticks
};
Vex.Flow.TickContext.prototype.getWidth = function() {
  return this.width + this.padding * 2
};
Vex.Flow.TickContext.prototype.getX = function() {
  return this.x
};
Vex.Flow.TickContext.prototype.setX = function(x) {
  this.x = x;
  return this
};
Vex.Flow.TickContext.prototype.getExtraPx = function() {
  var left_shift = 0;
  var right_shift = 0;
  var extraLeftPx = 0;
  var extraRightPx = 0;
  for(var i = 0;i < this.tickables.length;i++) {
    extraLeftPx = Math.max(this.tickables[i].extraLeftPx, extraLeftPx);
    extraRightPx = Math.max(this.tickables[i].extraRightPx, extraRightPx);
    var mContext = this.tickables[i].modifierContext;
    if(mContext && mContext != null) {
      left_shift = Math.max(left_shift, mContext.state.left_shift);
      right_shift = Math.max(right_shift, mContext.state.right_shift)
    }
  }
  return{left:left_shift, right:right_shift, extraLeft:extraLeftPx, extraRight:extraRightPx}
};
Vex.Flow.TickContext.prototype.getPixelsUsed = function() {
  return this.pixelsUsed
};
Vex.Flow.TickContext.prototype.setPixelsUsed = function(pixelsUsed) {
  this.pixelsUsed = pixelsUsed;
  return this
};
Vex.Flow.TickContext.prototype.setPadding = function(padding) {
  this.padding = padding;
  return this
};
Vex.Flow.TickContext.prototype.getMaxTicks = function() {
  return this.maxTicks
};
Vex.Flow.TickContext.prototype.getMinTicks = function() {
  return this.minTicks
};
Vex.Flow.TickContext.prototype.getTickables = function() {
  return this.tickables
};
Vex.Flow.TickContext.prototype.addTickable = function(tickable) {
  if(!tickable) {
    throw new Vex.RERR("BadArgument", "Invalid tickable added.");
  }
  if(!tickable.shouldIgnoreTicks()) {
    this.ignore_ticks = false;
    var ticks = tickable.getTicks();
    if(ticks.value() > this.maxTicks.value()) {
      this.maxTicks = ticks.clone()
    }
    if(this.minTicks == null) {
      this.minTicks = ticks.clone()
    }else {
      if(ticks.value() < this.minTicks.value()) {
        this.minTicks = ticks.clone()
      }
    }
  }
  tickable.setTickContext(this);
  this.tickables.push(tickable);
  this.preFormatted = false;
  return this
};
Vex.Flow.TickContext.prototype.preFormat = function() {
  if(this.preFormatted) {
    return
  }
  var note_width = 0;
  for(var i = 0;i < this.tickables.length;++i) {
    var tickable = this.tickables[i];
    tickable.preFormat();
    var metrics = tickable.getMetrics();
    this.extraLeftPx = Math.max(this.extraLeftPx, metrics.extraLeftPx + metrics.modLeftPx);
    this.extraRightPx = Math.max(this.extraRightPx, metrics.extraRightPx + metrics.modRightPx);
    this.notePx = Math.max(this.notePx, metrics.noteWidth);
    this.width = this.notePx + this.extraLeftPx + this.extraRightPx
  }
  return this
};
Vex.Flow.Tickable = function() {
  this.init()
};
Vex.Flow.Tickable.prototype.init = function() {
  this.intrinsicTicks = 0;
  this.tickMultiplier = new Vex.Flow.Fraction(1, 1);
  this.ticks = new Vex.Flow.Fraction(0, 1);
  this.width = 0;
  this.x_shift = 0;
  this.voice = null;
  this.tickContext = null;
  this.modifierContext = null;
  this.modifiers = [];
  this.preFormatted = false;
  this.tuplet = null;
  this.ignore_ticks = false;
  this.context = null
};
Vex.Flow.Tickable.prototype.setContext = function(context) {
  this.context = context
};
Vex.Flow.Tickable.prototype.getTuplet = function() {
  return this.tuplet
};
Vex.Flow.Tickable.prototype.setTuplet = function(tuplet) {
  if(this.tuplet) {
    var noteCount = this.tuplet.getNoteCount();
    var beatsOccupied = this.tuplet.getBeatsOccupied();
    this.applyTickMultiplier(noteCount, beatsOccupied)
  }
  if(tuplet) {
    var noteCount = tuplet.getNoteCount();
    var beatsOccupied = tuplet.getBeatsOccupied();
    this.applyTickMultiplier(beatsOccupied, noteCount)
  }
  this.tuplet = tuplet;
  return this
};
Vex.Flow.Tickable.prototype.addToModifierContext = function(mc) {
  this.modifierContext = mc;
  this.preFormatted = false
};
Vex.Flow.Tickable.prototype.addModifier = function(mod) {
  this.modifiers.push(mod);
  this.preFormatted = false;
  return this
};
Vex.Flow.Tickable.prototype.setTickContext = function(tc) {
  this.tickContext = tc;
  this.preFormatted = false
};
Vex.Flow.Tickable.prototype.preFormat = function() {
  if(preFormatted) {
    return
  }
  this.width = 0;
  if(this.modifierContext) {
    this.modifierContext.preFormat();
    this.width += this.modifierContext.getWidth()
  }
};
Vex.Flow.Tickable.prototype.getBoundingBox = function() {
  return null
};
Vex.Flow.Tickable.prototype.getIntrinsicTicks = function() {
  return this.intrinsicTicks
};
Vex.Flow.Tickable.prototype.setIntrinsicTicks = function(intrinsicTicks) {
  this.intrinsicTicks = intrinsicTicks;
  this.ticks = this.tickMultiplier.clone().multiply(this.intrinsicTicks)
};
Vex.Flow.Tickable.prototype.getTickMultiplier = function() {
  return this.tickMultiplier
};
Vex.Flow.Tickable.prototype.applyTickMultiplier = function(numerator, denominator) {
  this.tickMultiplier.multiply(numerator, denominator);
  this.ticks = this.tickMultiplier.clone().multiply(this.intrinsicTicks)
};
Vex.Flow.Tickable.prototype.getTicks = function() {
  return this.ticks
};
Vex.Flow.Tickable.prototype.shouldIgnoreTicks = function() {
  return this.ignore_ticks
};
Vex.Flow.Tickable.prototype.getWidth = function() {
  return this.width
};
Vex.Flow.Tickable.prototype.setXShift = function(x) {
  this.x_shift = x
};
Vex.Flow.Tickable.prototype.getVoice = function() {
  if(!this.voice) {
    throw new Vex.RERR("NoVoice", "Tickable has no voice.");
  }
  return this.voice
};
Vex.Flow.Tickable.prototype.setVoice = function(voice) {
  this.voice = voice
};
Vex.Flow.Note = function(note_struct) {
  if(arguments.length > 0) {
    this.init(note_struct)
  }
};
Vex.Flow.Note.prototype = new Vex.Flow.Tickable;
Vex.Flow.Note.superclass = Vex.Flow.Tickable.prototype;
Vex.Flow.Note.constructor = Vex.Flow.Note;
Vex.Flow.Note.prototype.init = function(note_struct) {
  var superclass = Vex.Flow.Note.superclass;
  superclass.init.call(this);
  if(!note_struct) {
    throw new Vex.RuntimeError("BadArguments", "Note must have valid initialization data to identify " + "duration and type.");
  }
  var initData = Vex.Flow.parseNoteData(note_struct);
  if(!initData) {
    throw new Vex.RuntimeError("BadArguments", "Invalid note initialization object: " + JSON.stringify(note_struct));
  }
  this.duration = initData.duration;
  this.dots = initData.dots;
  this.noteType = initData.type;
  this.setIntrinsicTicks(initData.ticks);
  this.modifiers = [];
  if(this.positions && (typeof this.positions != "object" || !this.positions.length)) {
    throw new Vex.RuntimeError("BadArguments", "Note keys must be array type.");
  }
  this.playNote = null;
  this.tickContext = null;
  this.modifierContext = null;
  this.ignore_ticks = false;
  this.width = 0;
  this.extraLeftPx = 0;
  this.extraRightPx = 0;
  this.x_shift = 0;
  this.left_modPx = 0;
  this.right_modPx = 0;
  this.voice = null;
  this.preFormatted = false;
  this.ys = [];
  this.context = null;
  this.stave = null
};
Vex.Flow.Note.prototype.setPlayNote = function(note) {
  this.playNote = note;
  return this
};
Vex.Flow.Note.prototype.getPlayNote = function() {
  return this.playNote
};
Vex.Flow.Note.prototype.isRest = function() {
  return false
};
Vex.Flow.Note.prototype.addStroke = function(index, stroke) {
  stroke.setNote(this);
  stroke.setIndex(index);
  this.modifiers.push(stroke);
  this.setPreFormatted(false);
  return this
};
Vex.Flow.Note.prototype.setYs = function(ys) {
  this.ys = ys;
  return this
};
Vex.Flow.Note.prototype.getStave = function() {
  return this.stave
};
Vex.Flow.Note.prototype.setStave = function(stave) {
  this.stave = stave;
  this.setYs([stave.getYForLine(0)]);
  this.context = this.stave.context;
  return this
};
Vex.Flow.Note.prototype.setContext = function(context) {
  this.context = context;
  return this
};
Vex.Flow.Note.prototype.getExtraLeftPx = function() {
  return this.extraLeftPx
};
Vex.Flow.Note.prototype.getExtraRightPx = function() {
  return this.extraRightPx
};
Vex.Flow.Note.prototype.setExtraLeftPx = function(x) {
  this.extraLeftPx = x;
  return this
};
Vex.Flow.Note.prototype.setExtraRightPx = function(x) {
  this.extraRightPx = x;
  return this
};
Vex.Flow.Note.prototype.shouldIgnoreTicks = function() {
  return this.ignore_ticks
};
Vex.Flow.Note.prototype.getYs = function() {
  if(this.ys.length == 0) {
    throw new Vex.RERR("NoYValues", "No Y-values calculated for this note.");
  }
  return this.ys
};
Vex.Flow.Note.prototype.getYForTopText = function(text_line) {
  if(!this.stave) {
    throw new Vex.RERR("NoStave", "No stave attached to this note.");
  }
  return this.stave.getYForTopText(text_line)
};
Vex.Flow.Note.prototype.getBoundingBox = function() {
  return null
};
Vex.Flow.Note.prototype.getVoice = function() {
  if(!this.voice) {
    throw new Vex.RERR("NoVoice", "Note has no voice.");
  }
  return this.voice
};
Vex.Flow.Note.prototype.setVoice = function(voice) {
  this.voice = voice;
  this.preFormatted = false;
  return this
};
Vex.Flow.Note.prototype.getTickContext = function() {
  return this.tickContext
};
Vex.Flow.Note.prototype.setTickContext = function(tc) {
  this.tickContext = tc;
  this.preFormatted = false;
  return this
};
Vex.Flow.Note.prototype.getDuration = function() {
  return this.duration
};
Vex.Flow.Note.prototype.isDotted = function() {
  return this.dots > 0
};
Vex.Flow.Note.prototype.getDots = function() {
  return this.dots
};
Vex.Flow.Note.prototype.getNoteType = function() {
  return this.noteType
};
Vex.Flow.Note.prototype.setModifierContext = function(mc) {
  this.modifierContext = mc;
  return this
};
Vex.Flow.Note.prototype.addModifier = function(modifier, index) {
  modifier.setNote(this);
  modifier.setIndex(index || 0);
  this.modifiers.push(modifier);
  this.setPreFormatted(false);
  return this
};
Vex.Flow.Note.prototype.getModifierStartXY = function(position, index) {
  if(!this.preFormatted) {
    throw new Vex.RERR("UnformattedNote", "Can't call GetModifierStartXY on an unformatted note");
  }
  var x = 0;
  return{x:this.getAbsoluteX() + x, y:this.ys[0]}
};
Vex.Flow.Note.prototype.getMetrics = function() {
  if(!this.preFormatted) {
    throw new Vex.RERR("UnformattedNote", "Can't call getMetrics on an unformatted note.");
  }
  var modLeftPx = 0;
  var modRightPx = 0;
  if(this.modifierContext != null) {
    modLeftPx = this.modifierContext.state.left_shift;
    modRightPx = this.modifierContext.state.right_shift
  }
  var width = this.getWidth();
  return{width:width, noteWidth:width - modLeftPx - modRightPx - this.extraLeftPx - this.extraRightPx, left_shift:this.x_shift, modLeftPx:modLeftPx, modRightPx:modRightPx, extraLeftPx:this.extraLeftPx, extraRightPx:this.extraRightPx}
};
Vex.Flow.Note.prototype.getWidth = function() {
  if(!this.preFormatted) {
    throw new Vex.RERR("UnformattedNote", "Can't call GetWidth on an unformatted note.");
  }
  return this.width + this.x_shift + (this.modifierContext ? this.modifierContext.getWidth() : 0)
};
Vex.Flow.Note.prototype.setWidth = function(width) {
  this.width = width
};
Vex.Flow.Note.prototype.setXShift = function(x) {
  this.x_shift = x;
  return this
};
Vex.Flow.Note.prototype.getX = function(x) {
  if(!this.tickContext) {
    throw new Vex.RERR("NoTickContext", "Note needs a TickContext assigned for an X-Value");
  }
  return this.tickContext.getX() + this.x_shift
};
Vex.Flow.Note.prototype.getAbsoluteX = function(x) {
  if(!this.tickContext) {
    throw new Vex.RERR("NoTickContext", "Note needs a TickContext assigned for an X-Value");
  }
  var x = this.tickContext.getX();
  if(this.stave) {
    x += this.stave.getNoteStartX() + 12
  }
  return x
};
Vex.Flow.Note.prototype.setPreFormatted = function(value) {
  this.preFormatted = value;
  if(this.preFormatted) {
    var extra = this.tickContext.getExtraPx();
    this.left_modPx = Math.max(this.left_modPx, extra.left);
    this.right_modPx = Math.max(this.right_modPx, extra.right)
  }
};
Vex.Flow.GhostNote = function(duration) {
  if(arguments.length > 0) {
    this.init(duration)
  }
};
Vex.Flow.GhostNote.prototype = new Vex.Flow.Note;
Vex.Flow.GhostNote.superclass = Vex.Flow.Note.prototype;
Vex.Flow.GhostNote.constructor = Vex.Flow.GhostNote;
Vex.Flow.GhostNote.prototype.init = function(parameter) {
  if(!parameter) {
    throw new Vex.RuntimeError("BadArguments", "Ghost note must have valid initialization data to identify " + "duration.");
  }
  var note_struct;
  if(typeof parameter === "string") {
    note_struct = {duration:parameter}
  }else {
    if(typeof parameter === "object") {
      note_struct = parameter
    }else {
      throw new Vex.RuntimeError("BadArguments", "Ghost note must have valid initialization data to identify " + "duration.");
    }
  }
  var superclass = Vex.Flow.GhostNote.superclass;
  superclass.init.call(this, note_struct);
  this.setWidth(0)
};
Vex.Flow.GhostNote.prototype.isRest = function() {
  return true
};
Vex.Flow.GhostNote.prototype.setStave = function(stave) {
  var superclass = Vex.Flow.GhostNote.superclass;
  superclass.setStave.call(this, stave)
};
Vex.Flow.GhostNote.prototype.addToModifierContext = function(mc) {
  return this
};
Vex.Flow.GhostNote.prototype.preFormat = function() {
  this.setPreFormatted(true);
  return this
};
Vex.Flow.GhostNote.prototype.draw = function() {
  if(!this.stave) {
    throw new Vex.RERR("NoStave", "Can't draw without a stave.");
  }
  for(var i = 0;i < this.modifiers.length;++i) {
    var modifier = this.modifiers[i];
    modifier.setContext(this.context);
    modifier.draw()
  }
};
Vex.Flow.StaveNote = function(note_struct) {
  if(arguments.length > 0) {
    this.init(note_struct)
  }
};
Vex.Flow.StaveNote.prototype = new Vex.Flow.Note;
Vex.Flow.StaveNote.superclass = Vex.Flow.Note.prototype;
Vex.Flow.StaveNote.constructor = Vex.Flow.StaveNote;
Vex.Flow.StaveNote.STEM_UP = 1;
Vex.Flow.StaveNote.STEM_DOWN = -1;
Vex.Flow.StaveNote.prototype.getCategory = function() {
  return"stavenotes"
};
Vex.Flow.StaveNote.prototype.init = function(note_struct) {
  var superclass = Vex.Flow.StaveNote.superclass;
  superclass.init.call(this, note_struct);
  this.keys = note_struct.keys;
  this.clef = note_struct.clef;
  this.glyph = Vex.Flow.durationToGlyph(this.duration, this.noteType);
  if(!this.glyph) {
    throw new Vex.RuntimeError("BadArguments", "Invalid note initialization data (No glyph found): " + JSON.stringify(note_struct));
  }
  this.keyProps = [];
  this.displaced = false;
  var last_line = null;
  for(var i = 0;i < this.keys.length;++i) {
    var key = this.keys[i];
    var props = Vex.Flow.keyProperties(key, this.clef);
    if(!props) {
      throw new Vex.RuntimeError("BadArguments", "Invalid key for note properties: " + key);
    }
    var line = props.line;
    if(last_line == null) {
      last_line = line
    }else {
      if(Math.abs(last_line - line) == 0.5) {
        this.displaced = true;
        props.displaced = true;
        if(this.keyProps.length > 0) {
          this.keyProps[i - 1].displaced = true
        }
      }
    }
    last_line = line;
    this.keyProps.push(props)
  }
  this.keyProps.sort(function(a, b) {
    return a.line - b.line
  });
  this.modifiers = [];
  this.render_options = {glyph_font_scale:38, stem_height:35, stroke_px:3, stroke_spacing:10, annotation_spacing:5};
  var auto_stem_direction;
  if(note_struct.auto_stem) {
    this.min_line = this.keyProps[0].line;
    if(this.min_line < 3) {
      auto_stem_direction = 1
    }else {
      auto_stem_direction = -1
    }
    this.setStemDirection(auto_stem_direction)
  }else {
    this.setStemDirection(note_struct.stem_direction)
  }
  this.calcExtraPx()
};
Vex.Flow.StaveNote.prototype.getBoundingBox = function() {
  if(!this.preFormatted) {
    throw new Vex.RERR("UnformattedNote", "Can't call getBoundingBox on an unformatted note.");
  }
  var metrics = this.getMetrics();
  var w = metrics.width;
  var x = this.getAbsoluteX() - metrics.modLeftPx - metrics.extraLeftPx;
  var min_y = 0;
  var max_y = 0;
  var half_line_spacing = this.getStave().getSpacingBetweenLines() / 2;
  if(this.glyph.stem) {
    var ys = this.getStemExtents();
    ys.baseY += half_line_spacing * this.stem_direction;
    min_y = Vex.Min(ys.topY, ys.baseY);
    max_y = Vex.Max(ys.topY, ys.baseY)
  }else {
    min_y = null;
    max_y = null;
    for(var i = 0;i < this.ys.length;++i) {
      var yy = this.ys[i];
      if(i == 0) {
        min_y = yy;
        max_y = yy
      }else {
        min_y = Vex.Min(yy, min_y);
        max_y = Vex.Max(yy, max_y)
      }
      min_y -= half_line_spacing;
      max_y += half_line_spacing
    }
  }
  return new Vex.Flow.BoundingBox(x, min_y, w, max_y - min_y)
};
Vex.Flow.StaveNote.prototype.isRest = function() {
  return this.glyph.rest
};
Vex.Flow.StaveNote.prototype.hasStem = function() {
  return this.glyph.stem
};
Vex.Flow.StaveNote.prototype.getYForTopText = function(text_line) {
  var extents = this.getStemExtents();
  return Vex.Min(this.stave.getYForTopText(text_line), extents.topY - this.render_options.annotation_spacing * (text_line + 1))
};
Vex.Flow.StaveNote.prototype.getYForBottomText = function(text_line) {
  var extents = this.getStemExtents();
  return Vex.Max(this.stave.getYForTopText(text_line), extents.baseY + this.render_options.annotation_spacing * text_line)
};
Vex.Flow.StaveNote.prototype.setStave = function(stave) {
  var superclass = Vex.Flow.StaveNote.superclass;
  superclass.setStave.call(this, stave);
  var ys = [];
  for(var i = 0;i < this.keyProps.length;++i) {
    var line = this.keyProps[i].line;
    ys.push(this.stave.getYForNote(line))
  }
  return this.setYs(ys)
};
Vex.Flow.StaveNote.prototype.getKeys = function() {
  return this.keys
};
Vex.Flow.StaveNote.prototype.getKeyProps = function() {
  return this.keyProps
};
Vex.Flow.StaveNote.prototype.getStemDirection = function() {
  return this.stem_direction
};
Vex.Flow.StaveNote.prototype.getStemX = function() {
  var x_begin = this.getAbsoluteX() + this.x_shift;
  var x_end = this.getAbsoluteX() + this.x_shift + this.glyph.head_width;
  var stem_x = this.stem_direction == Vex.Flow.StaveNote.STEM_DOWN ? x_begin : x_end;
  return stem_x
};
Vex.Flow.StaveNote.prototype.getStemExtents = function() {
  if(!this.ys || this.ys.length == 0) {
    throw new Vex.RERR("NoYValues", "Can't get top stem Y when note has no Y values.");
  }
  var top_pixel = this.ys[0];
  var base_pixel = this.ys[0];
  for(var i = 0;i < this.ys.length;++i) {
    var stem_top = this.ys[i] + this.render_options.stem_height * -this.stem_direction;
    if(this.stem_direction == Vex.Flow.StaveNote.STEM_DOWN) {
      top_pixel = top_pixel > stem_top ? top_pixel : stem_top;
      base_pixel = base_pixel < this.ys[i] ? base_pixel : this.ys[i]
    }else {
      top_pixel = top_pixel < stem_top ? top_pixel : stem_top;
      base_pixel = base_pixel > this.ys[i] ? base_pixel : this.ys[i]
    }
    if(this.noteType == "s" || this.noteType == "x") {
      top_pixel -= this.stem_direction * 7;
      base_pixel -= this.stem_direction * 7
    }
  }
  return{topY:top_pixel, baseY:base_pixel}
};
Vex.Flow.StaveNote.prototype.getTieRightX = function() {
  var tieStartX = this.getAbsoluteX();
  tieStartX += this.glyph.head_width + this.x_shift + this.extraRightPx;
  if(this.modifierContext) {
    tieStartX += this.modifierContext.getExtraRightPx()
  }
  return tieStartX
};
Vex.Flow.StaveNote.prototype.getTieLeftX = function() {
  var tieEndX = this.getAbsoluteX();
  tieEndX += this.x_shift - this.extraLeftPx;
  return tieEndX
};
Vex.Flow.StaveNote.prototype.getModifierStartXY = function(position, index) {
  if(!this.preFormatted) {
    throw new Vex.RERR("UnformattedNote", "Can't call GetModifierStartXY on an unformatted note");
  }
  if(this.ys.length == 0) {
    throw new Vex.RERR("NoYValues", "No Y-Values calculated for this note.");
  }
  var x = 0;
  if(position == Vex.Flow.Modifier.Position.LEFT) {
    x = -1 * 2
  }else {
    if(position == Vex.Flow.Modifier.Position.RIGHT) {
      x = this.glyph.head_width + this.x_shift + 2
    }else {
      if(position == Vex.Flow.Modifier.Position.BELOW || position == Vex.Flow.Modifier.Position.ABOVE) {
        x = this.glyph.head_width / 2
      }
    }
  }
  return{x:this.getAbsoluteX() + x, y:this.ys[index]}
};
Vex.Flow.StaveNote.prototype.setStemDirection = function(direction) {
  if(!direction) {
    direction = Vex.Flow.StaveNote.STEM_UP
  }
  if(direction != Vex.Flow.StaveNote.STEM_UP && direction != Vex.Flow.StaveNote.STEM_DOWN) {
    throw new Vex.RERR("BadArgument", "Invalid stem direction: " + direction);
  }
  this.stem_direction = direction;
  this.beam = null;
  if(this.preFormatted) {
    this.preFormat()
  }
  return this
};
Vex.Flow.StaveNote.prototype.setBeam = function(beam) {
  this.beam = beam;
  return this
};
Vex.Flow.StaveNote.prototype.getGlyph = function() {
  return this.glyph
};
Vex.Flow.StaveNote.prototype.addToModifierContext = function(mc) {
  this.setModifierContext(mc);
  for(var i = 0;i < this.modifiers.length;++i) {
    this.modifierContext.addModifier(this.modifiers[i])
  }
  this.modifierContext.addModifier(this);
  this.setPreFormatted(false)
};
Vex.Flow.StaveNote.prototype.addModifier = function(index, modifier) {
  modifier.setNote(this);
  modifier.setIndex(index);
  this.modifiers.push(modifier);
  this.setPreFormatted(false);
  return this
};
Vex.Flow.StaveNote.prototype.addAccidental = function(index, accidental) {
  accidental.setNote(this);
  accidental.setIndex(index);
  this.modifiers.push(accidental);
  this.setPreFormatted(false);
  return this
};
Vex.Flow.StaveNote.prototype.addArticulation = function(index, articulation) {
  articulation.setNote(this);
  articulation.setIndex(index);
  this.modifiers.push(articulation);
  this.setPreFormatted(false);
  return this
};
Vex.Flow.StaveNote.prototype.addAnnotation = function(index, annotation) {
  annotation.setNote(this);
  annotation.setIndex(index);
  this.modifiers.push(annotation);
  this.setPreFormatted(false);
  return this
};
Vex.Flow.StaveNote.prototype.addDot = function(index) {
  var dot = new Vex.Flow.Dot;
  dot.setNote(this);
  dot.setIndex(index);
  this.modifiers.push(dot);
  this.setPreFormatted(false);
  this.dots++;
  return this
};
Vex.Flow.StaveNote.prototype.addDotToAll = function() {
  for(var i = 0;i < this.keys.length;++i) {
    this.addDot(i)
  }
  return this
};
Vex.Flow.StaveNote.prototype.getAccidentals = function() {
  return this.modifierContext.getModifiers("accidentals")
};
Vex.Flow.StaveNote.prototype.getDots = function() {
  return this.modifierContext.getModifiers("dots")
};
Vex.Flow.StaveNote.prototype.getVoiceShiftWidth = function() {
  return this.glyph.head_width * (this.displaced ? 2 : 1)
};
Vex.Flow.StaveNote.prototype.calcExtraPx = function() {
  this.setExtraLeftPx(this.displaced && this.stem_direction == -1 ? this.glyph.head_width : 0);
  this.setExtraRightPx(this.displaced && this.stem_direction == 1 ? this.glyph.head_width : 0)
};
Vex.Flow.StaveNote.prototype.preFormat = function() {
  if(this.preFormatted) {
    return
  }
  if(this.modifierContext) {
    this.modifierContext.preFormat()
  }
  var width = this.glyph.head_width + this.extraLeftPx + this.extraRightPx;
  if(this.glyph.flag && this.beam == null && this.stem_direction == 1) {
    width += this.glyph.head_width
  }
  this.setWidth(width);
  this.setPreFormatted(true)
};
Vex.Flow.StaveNote.prototype.draw = function() {
  if(!this.context) {
    throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
  }
  if(!this.stave) {
    throw new Vex.RERR("NoStave", "Can't draw without a stave.");
  }
  if(this.ys.length == 0) {
    throw new Vex.RERR("NoYValues", "Can't draw note without Y values.");
  }
  var ctx = this.context;
  var x = this.getAbsoluteX() + this.x_shift;
  var ys = this.ys;
  var keys = this.keys;
  var glyph = this.glyph;
  var stem_direction = this.stem_direction;
  var default_head_x = null;
  var render_head = true;
  var render_stem = this.beam == null;
  var render_flag = this.beam == null;
  var x_begin = x;
  var x_end = x + glyph.head_width;
  var y_top = null;
  var y_bottom = null;
  var last_line = null;
  var displaced = false;
  var start_i = 0;
  var end_i = keys.length;
  var step_i = 1;
  if(stem_direction == Vex.Flow.StaveNote.STEM_DOWN) {
    start_i = keys.length - 1;
    end_i = -1;
    step_i = -1
  }
  var highest_line = 5;
  var lowest_line = 1;
  function drawSlashNoteHead(stavenote, ctx, x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y + 11);
    ctx.lineTo(x, y + 1);
    ctx.lineTo(x + 15, y - 10);
    ctx.lineTo(x + 15, y);
    ctx.lineTo(x, y + 11);
    ctx.closePath();
    if(stavenote.duration != 1 && stavenote.duration != 2 && stavenote.duration != "h" && stavenote.duration != "w") {
      ctx.fill()
    }else {
      ctx.stroke()
    }
  }
  for(var i = start_i;i != end_i;i += step_i) {
    var note_props = this.keyProps[i];
    var line = note_props.line;
    highest_line = line > highest_line ? line : highest_line;
    lowest_line = line < lowest_line ? line : lowest_line;
    if(last_line == null) {
      last_line = line
    }else {
      if(Math.abs(last_line - line) == 0.5) {
        displaced = !displaced
      }else {
        displaced = false;
        default_head_x = x
      }
    }
    last_line = line;
    var y = ys[i];
    if(y_top == null || y < y_top) {
      y_top = y
    }
    if(y_bottom == null || y > y_bottom) {
      y_bottom = y
    }
    var code_head = glyph.code_head;
    var head_x = x_begin + (displaced ? glyph.head_width * stem_direction : 0);
    if(note_props.code) {
      code_head = note_props.code;
      head_x = x_begin + note_props.shift_right
    }
    if(render_head) {
      head_x = Math.round(head_x);
      if(this.noteType == "s") {
        drawSlashNoteHead(this, ctx, head_x + (this.stem_direction == 1 ? 1 : 0), y)
      }else {
        Vex.Flow.renderGlyph(ctx, head_x, y, this.render_options.glyph_font_scale, code_head)
      }
      if(line <= 0 || line >= 6) {
        var line_y = y;
        var floor = Math.floor(line);
        if(line < 0 && floor - line == -0.5) {
          line_y -= 5
        }else {
          if(line > 6 && floor - line == -0.5) {
            line_y += 5
          }
        }
        ctx.fillRect(head_x - this.render_options.stroke_px, line_y, head_x + glyph.head_width - head_x + this.render_options.stroke_px * 2, 1)
      }
    }
  }
  if(!glyph.rest) {
    var that = this;
    function stroke(y) {
      if(default_head_x != null) {
        head_x = default_head_x
      }
      ctx.fillRect(head_x - that.render_options.stroke_px, y, head_x + glyph.head_width - head_x + that.render_options.stroke_px * 2, 1)
    }
    for(var line = 6;line <= highest_line;++line) {
      stroke(this.stave.getYForNote(line))
    }
    for(var line = 0;line >= lowest_line;--line) {
      stroke(this.stave.getYForNote(line))
    }
  }
  var note_stem_height = (y_bottom - y_top) * stem_direction + this.render_options.stem_height * stem_direction;
  if(glyph.stem && render_stem) {
    var stem_x, stem_y;
    if(stem_direction == Vex.Flow.StaveNote.STEM_DOWN) {
      stem_x = x_begin;
      stem_y = y_top;
      if(glyph.code_head == "v95" || glyph.code_head == "v3e") {
        stem_y += 4
      }
    }else {
      stem_x = x_end;
      stem_y = y_bottom;
      if(glyph.code_head == "v95" || glyph.code_head == "v3e") {
        stem_y -= 4
      }
    }
    ctx.fillRect(stem_x, stem_y - (note_stem_height < 0 ? 0 : note_stem_height), 1, Math.abs(note_stem_height))
  }
  if(glyph.flag && render_flag) {
    var flag_x, flag_y, flag_code;
    if(stem_direction == Vex.Flow.StaveNote.STEM_DOWN) {
      flag_x = x_begin + 1;
      flag_y = y_top - note_stem_height;
      flag_code = glyph.code_flag_downstem
    }else {
      flag_x = x_end + 1;
      flag_y = y_bottom - note_stem_height;
      flag_code = glyph.code_flag_upstem
    }
    Vex.Flow.renderGlyph(ctx, flag_x, flag_y, this.render_options.glyph_font_scale, flag_code)
  }
  for(var i = 0;i < this.modifiers.length;++i) {
    var mod = this.modifiers[i];
    mod.setContext(this.context);
    mod.draw()
  }
};
Vex.Flow.TabNote = function(tab_struct) {
  if(arguments.length > 0) {
    this.init(tab_struct)
  }
};
Vex.Flow.TabNote.prototype = new Vex.Flow.Note;
Vex.Flow.TabNote.superclass = Vex.Flow.Note.prototype;
Vex.Flow.TabNote.constructor = Vex.Flow.TabNote;
Vex.Flow.TabNote.prototype.init = function(tab_struct) {
  var superclass = Vex.Flow.TabNote.superclass;
  superclass.init.call(this, tab_struct);
  this.positions = tab_struct.positions;
  this.render_options = {glyph_font_scale:30};
  this.noteGlyph = Vex.Flow.durationToGlyph(this.duration, this.noteType);
  if(!this.noteGlyph) {
    throw new Vex.RuntimeError("BadArguments", "Invalid note initialization data (No glyph found): " + JSON.stringify(tab_struct));
  }
  this.ghost = false;
  this.updateWidth()
};
Vex.Flow.TabNote.prototype.setGhost = function(ghost) {
  this.ghost = ghost;
  this.updateWidth();
  return this
};
Vex.Flow.TabNote.prototype.updateWidth = function() {
  this.glyphs = [];
  this.width = 0;
  for(var i = 0;i < this.positions.length;++i) {
    var fret = this.positions[i].fret;
    if(this.ghost) {
      fret = "(" + fret + ")"
    }
    var glyph = Vex.Flow.tabToGlyph(fret);
    this.glyphs.push(glyph);
    this.width = glyph.width > this.width ? glyph.width : this.width
  }
};
Vex.Flow.TabNote.prototype.setStave = function(stave) {
  var superclass = Vex.Flow.TabNote.superclass;
  superclass.setStave.call(this, stave);
  this.context = stave.context;
  this.width = 0;
  if(this.context) {
    for(var i = 0;i < this.glyphs.length;++i) {
      var text = "" + this.glyphs[i].text;
      if(text.toUpperCase() != "X") {
        this.glyphs[i].width = this.context.measureText(text).width
      }
      this.width = this.glyphs[i].width > this.width ? this.glyphs[i].width : this.width
    }
  }
  var ys = [];
  for(var i = 0;i < this.positions.length;++i) {
    var line = this.positions[i].str;
    ys.push(this.stave.getYForLine(line - 1))
  }
  return this.setYs(ys)
};
Vex.Flow.TabNote.prototype.getPositions = function() {
  return this.positions
};
Vex.Flow.TabNote.prototype.addToModifierContext = function(mc) {
  this.setModifierContext(mc);
  for(var i = 0;i < this.modifiers.length;++i) {
    this.modifierContext.addModifier(this.modifiers[i])
  }
  this.preFormatted = false;
  return this
};
Vex.Flow.TabNote.prototype.getTieRightX = function() {
  var tieStartX = this.getAbsoluteX();
  var note_glyph_width = this.noteGlyph.head_width;
  tieStartX += note_glyph_width / 2;
  tieStartX += -this.width / 2 + this.width + 2;
  return tieStartX
};
Vex.Flow.TabNote.prototype.getTieLeftX = function() {
  var tieEndX = this.getAbsoluteX();
  var note_glyph_width = this.noteGlyph.head_width;
  tieEndX += note_glyph_width / 2;
  tieEndX -= this.width / 2 + 2;
  return tieEndX
};
Vex.Flow.TabNote.prototype.getModifierStartXY = function(position, index) {
  if(!this.preFormatted) {
    throw new Vex.RERR("UnformattedNote", "Can't call GetModifierStartXY on an unformatted note");
  }
  if(this.ys.length == 0) {
    throw new Vex.RERR("NoYValues", "No Y-Values calculated for this note.");
  }
  var x = 0;
  if(position == Vex.Flow.Modifier.Position.LEFT) {
    x = -1 * 2
  }else {
    if(position == Vex.Flow.Modifier.Position.RIGHT) {
      x = this.width + 2
    }else {
      if(position == Vex.Flow.Modifier.Position.BELOW || position == Vex.Flow.Modifier.Position.ABOVE) {
        var note_glyph_width = this.noteGlyph.head_width;
        x = note_glyph_width / 2
      }
    }
  }
  return{x:this.getAbsoluteX() + x, y:this.ys[index]}
};
Vex.Flow.TabNote.prototype.preFormat = function() {
  if(this.preFormatted) {
    return
  }
  if(this.modifierContext) {
    this.modifierContext.preFormat()
  }
  this.setPreFormatted(true)
};
Vex.Flow.TabNote.prototype.draw = function() {
  if(!this.context) {
    throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
  }
  if(!this.stave) {
    throw new Vex.RERR("NoStave", "Can't draw without a stave.");
  }
  if(this.ys.length == 0) {
    throw new Vex.RERR("NoYValues", "Can't draw note without Y values.");
  }
  var ctx = this.context;
  var x = this.getAbsoluteX();
  var ys = this.ys;
  for(var i = 0;i < this.positions.length;++i) {
    var y = ys[i];
    var glyph = this.glyphs[i];
    var note_glyph_width = this.noteGlyph.head_width;
    var tab_x = x + note_glyph_width / 2 - glyph.width / 2;
    ctx.clearRect(tab_x - 2, y - 3, glyph.width + 4, 6);
    if(glyph.code) {
      Vex.Flow.renderGlyph(ctx, tab_x, y + 5 + glyph.shift_y, this.render_options.glyph_font_scale, glyph.code)
    }else {
      var text = glyph.text.toString();
      ctx.fillText(text, tab_x, y + 5)
    }
  }
  for(var i = 0;i < this.modifiers.length;++i) {
    var modifier = this.modifiers[i];
    modifier.setContext(this.context);
    modifier.draw()
  }
};
Vex.Flow.Beam = function(notes, auto_stem) {
  if(arguments.length > 0) {
    this.init(notes, auto_stem)
  }
};
Vex.Flow.Beam.prototype.init = function(notes, auto_stem) {
  if(!notes || notes == []) {
    throw new Vex.RuntimeError("BadArguments", "No notes provided for beam.");
  }
  if(notes.length == 1) {
    throw new Vex.RuntimeError("BadArguments", "Too few notes for beam.");
  }
  this.unbeamable = false;
  if(!notes[0].hasStem() || !notes[notes.length - 1].hasStem()) {
    this.unbeamable = true;
    return
  }
  this.stem_direction = notes[0].getStemDirection();
  this.ticks = notes[0].getIntrinsicTicks();
  if(this.ticks >= Vex.Flow.durationToTicks("4")) {
    throw new Vex.RuntimeError("BadArguments", "Beams can only be applied to notes shorter than a quarter note.");
  }
  if(!auto_stem) {
    for(var i = 1;i < notes.length;++i) {
      var note = notes[i];
      if(note.getStemDirection() != this.stem_direction) {
        throw new Vex.RuntimeError("BadArguments", "Notes in a beam all have the same stem direction");
      }
    }
  }
  var stem_direction = -1;
  if(auto_stem) {
    this.min_line = 1E3;
    for(var i = 0;i < notes.length;++i) {
      var note = notes[i];
      this.min_line = Vex.Min(note.getKeyProps()[0].line, this.min_line)
    }
    if(this.min_line < 3) {
      stem_direction = 1
    }
  }
  for(var i = 0;i < notes.length;++i) {
    var note = notes[i];
    if(auto_stem) {
      note.setStemDirection(stem_direction);
      this.stem_direction = stem_direction
    }
    note.setBeam(this)
  }
  this.notes = notes;
  this.beam_count = this.notes[0].getGlyph().beam_count;
  this.render_options = {beam_width:5, max_slope:0.25, min_slope:-0.25, slope_iterations:20, slope_cost:25}
};
Vex.Flow.Beam.prototype.setContext = function(context) {
  this.context = context;
  return this
};
Vex.Flow.Beam.prototype.getNotes = function() {
  return this.notes
};
Vex.Flow.Beam.prototype.draw = function(notes) {
  if(!this.context) {
    throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
  }
  if(this.unbeamable) {
    return
  }
  var first_note = this.notes[0];
  var last_note = this.notes[this.notes.length - 1];
  var first_y_px = first_note.getStemExtents().topY;
  var last_y_px = last_note.getStemExtents().topY;
  var first_x_px = first_note.getStemX();
  var last_x_px = last_note.getStemX();
  var beam_width = this.render_options.beam_width * this.stem_direction;
  function getSlopeY(x) {
    return first_y_px + (x - first_x_px) * slope
  }
  var inc = (this.render_options.max_slope - this.render_options.min_slope) / this.render_options.slope_iterations;
  var min_cost = Number.MAX_VALUE;
  var best_slope = 0;
  var y_shift = 0;
  for(var slope = this.render_options.min_slope;slope <= this.render_options.max_slope;slope += inc) {
    var total_stem_extension = 0;
    var y_shift_tmp = 0;
    for(var i = 1;i < this.notes.length;++i) {
      var note = this.notes[i];
      var x_px = note.getStemX();
      var y_px = note.getStemExtents().topY;
      var slope_y_px = getSlopeY(x_px) + y_shift_tmp;
      if(y_px * this.stem_direction < slope_y_px * this.stem_direction) {
        var diff = Math.abs(y_px - slope_y_px);
        y_shift_tmp += diff * -this.stem_direction;
        total_stem_extension += diff * i
      }else {
        total_stem_extension += (y_px - slope_y_px) * this.stem_direction
      }
    }
    var cost = this.render_options.slope_cost * Math.abs(slope) + Math.abs(total_stem_extension);
    if(cost < min_cost) {
      min_cost = cost;
      best_slope = slope;
      y_shift = y_shift_tmp
    }
  }
  slope = best_slope;
  for(var i = 0;i < this.notes.length;++i) {
    var note = this.notes[i];
    if(!note.hasStem()) {
      continue
    }
    var x_px = note.getStemX();
    var y_extents = note.getStemExtents();
    var base_y_px = y_extents.baseY;
    base_y_px += this.stem_direction * note.glyph.stem_offset;
    this.context.fillRect(x_px, base_y_px, 1, Math.abs(base_y_px - (getSlopeY(x_px) + y_shift)) * -this.stem_direction)
  }
  var that = this;
  function getBeamLines(duration) {
    var beam_lines = [];
    var beam_started = false;
    for(var i = 0;i < that.notes.length;++i) {
      var note = that.notes[i];
      var ticks = note.getIntrinsicTicks();
      if(ticks < Vex.Flow.durationToTicks(duration)) {
        if(!beam_started) {
          beam_lines.push({start:note.getStemX(), end:null});
          beam_started = true
        }else {
          var current_beam = beam_lines[beam_lines.length - 1];
          current_beam.end = note.getStemX()
        }
      }else {
        if(!beam_started) {
        }else {
          var current_beam = beam_lines[beam_lines.length - 1];
          if(current_beam.end == null) {
            current_beam.end = current_beam.start + 10
          }else {
          }
        }
        beam_started = false
      }
    }
    if(beam_started == true) {
      var current_beam = beam_lines[beam_lines.length - 1];
      if(current_beam.end == null) {
        current_beam.end = current_beam.start - 10
      }
    }
    return beam_lines
  }
  var valid_beam_durations = ["4", "8", "16", "32"];
  for(var i = 0;i < valid_beam_durations.length;++i) {
    var duration = valid_beam_durations[i];
    var beam_lines = getBeamLines(duration);
    for(var j = 0;j < beam_lines.length;++j) {
      var beam_line = beam_lines[j];
      var first_x = beam_line.start;
      var first_y = getSlopeY(first_x);
      var last_x = beam_line.end;
      var last_y = getSlopeY(last_x);
      this.context.beginPath();
      this.context.moveTo(first_x, first_y + y_shift);
      this.context.lineTo(first_x, first_y + beam_width + y_shift);
      this.context.lineTo(last_x + 1, last_y + beam_width + y_shift);
      this.context.lineTo(last_x + 1, last_y + y_shift);
      this.context.closePath();
      this.context.fill()
    }
    first_y_px += beam_width * 1.5;
    last_y_px += beam_width * 1.5
  }
  return true
};
Vex.Flow.Beam.applyAndGetBeams = function(voice, stem_direction) {
  var unprocessedNotes = voice.tickables;
  var ticksPerGroup = 4096;
  var noteGroups = [];
  var currentGroup = [];
  function getTotalTicks(vf_notes) {
    return vf_notes.reduce(function(memo, note) {
      return note.getTicks().value() + memo
    }, 0)
  }
  function createGroups() {
    var nextGroup = [];
    unprocessedNotes.forEach(function(unprocessedNote) {
      nextGroup = [];
      if(unprocessedNote.shouldIgnoreTicks()) {
        noteGroups.push(currentGroup);
        currentGroup = nextGroup;
        return
      }
      currentGroup.push(unprocessedNote);
      if(getTotalTicks(currentGroup) > ticksPerGroup) {
        nextGroup.push(currentGroup.pop());
        noteGroups.push(currentGroup);
        currentGroup = nextGroup
      }else {
        if(getTotalTicks(currentGroup) == ticksPerGroup) {
          noteGroups.push(currentGroup);
          currentGroup = nextGroup
        }
      }
    });
    if(currentGroup.length > 0) {
      noteGroups.push(currentGroup)
    }
  }
  function getBeamGroups() {
    return noteGroups.filter(function(group) {
      return group.length > 1
    })
  }
  function formatStems() {
    noteGroups.forEach(function(group) {
      var stemDirection = determineStemDirection(group);
      applyStemDirection(group, stemDirection)
    })
  }
  function determineStemDirection(group) {
    if(stem_direction) {
      return stem_direction
    }
    var lineSum = 0;
    group.forEach(function(note) {
      note.keyProps.forEach(function(keyProp) {
        lineSum += keyProp.line - 3
      })
    });
    if(lineSum > 0) {
      return-1
    }
    return 1
  }
  function applyStemDirection(group, direction) {
    group.forEach(function(note) {
      note.setStemDirection(direction)
    })
  }
  function getTupletGroups() {
    return noteGroups.filter(function(group) {
      if(group[0]) {
        return group[0].tuplet
      }
    })
  }
  createGroups();
  formatStems();
  var beamedNoteGroups = getBeamGroups();
  var tupletGroups = getTupletGroups();
  var beams = [];
  beamedNoteGroups.forEach(function(group) {
    beams.push(new Vex.Flow.Beam(group))
  });
  tupletGroups.forEach(function(group) {
    var firstNote = group[0];
    var tuplet = firstNote.tuplet;
    if(firstNote.beam) {
      tuplet.setBracketed(false)
    }
    if(firstNote.stem_direction == -1) {
      tuplet.setTupletLocation(Vex.Flow.Tuplet.LOCATION_BOTTOM)
    }
  });
  return beams
};
Vex.Flow.Voice = function(time) {
  if(arguments.length > 0) {
    this.init(time)
  }
};
Vex.Flow.Voice.Mode = {STRICT:1, SOFT:2, FULL:3};
Vex.Flow.Voice.prototype.init = function(time) {
  this.time = time;
  this.totalTicks = new Vex.Flow.Fraction(this.time.num_beats * (this.time.resolution / this.time.beat_value), 1);
  this.resolutionMultiplier = 1;
  this.tickables = [];
  this.ticksUsed = new Vex.Flow.Fraction(0, 1);
  this.smallestTickCount = this.totalTicks.clone();
  this.largestTickWidth = 0;
  this.stave = null;
  this.boundingBox = null;
  this.mode = Vex.Flow.Voice.Mode.STRICT;
  this.voiceGroup = null
};
Vex.Flow.Voice.prototype.setStave = function(stave) {
  this.stave = stave;
  this.boundingBox = null;
  return this
};
Vex.Flow.Voice.prototype.getBoundingBox = function() {
  if(!this.boundingBox) {
    if(!this.stave) {
      throw Vex.RERR("NoStave", "Can't get bounding box without stave.");
    }
    stave = this.stave;
    var boundingBox = null;
    if(this.tickables[0]) {
      this.tickables[0].setStave(stave);
      boundingBox = this.tickables[0].getBoundingBox()
    }
    for(var i = 0;i < this.tickables.length;++i) {
      this.tickables[i].setStave(stave);
      if(i > 0 && boundingBox) {
        var bb = this.tickables[i].getBoundingBox();
        if(bb) {
          boundingBox.mergeWith(bb)
        }
      }
    }
    this.boundingBox = boundingBox
  }
  return this.boundingBox
};
Vex.Flow.Voice.prototype.getVoiceGroup = function() {
  if(!this.voiceGroup) {
    throw new Vex.RERR("NoVoiceGroup", "No voice group for voice.");
  }
  return this.voiceGroup
};
Vex.Flow.Voice.prototype.setVoiceGroup = function(g) {
  this.voiceGroup = g;
  return this
};
Vex.Flow.Voice.prototype.getResolutionMultiplier = function() {
  return this.resolutionMultiplier
};
Vex.Flow.Voice.prototype.getActualResolution = function() {
  return this.resolutionMultiplier * this.time.resolution
};
Vex.Flow.Voice.prototype.setStrict = function(strict) {
  this.mode = strict ? Vex.Flow.Voice.Mode.STRICT : Vex.Flow.Voice.Mode.SOFT;
  return this
};
Vex.Flow.Voice.prototype.setMode = function(mode) {
  this.mode = mode;
  return this
};
Vex.Flow.Voice.prototype.getMode = function() {
  return this.mode
};
Vex.Flow.Voice.prototype.isComplete = function() {
  if(this.mode == Vex.Flow.Voice.Mode.STRICT || this.mode == Vex.Flow.Voice.Mode.FULL) {
    return this.ticksUsed.equals(this.totalTicks)
  }else {
    return true
  }
};
Vex.Flow.Voice.prototype.getTotalTicks = function() {
  return this.totalTicks
};
Vex.Flow.Voice.prototype.getTicksUsed = function() {
  return this.ticksUsed
};
Vex.Flow.Voice.prototype.getLargestTickWidth = function() {
  return this.largestTickWidth
};
Vex.Flow.Voice.prototype.getSmallestTickCount = function() {
  return this.smallestTickCount
};
Vex.Flow.Voice.prototype.getTickables = function() {
  return this.tickables
};
Vex.Flow.Voice.prototype.addTickable = function(tickable) {
  if(!tickable.shouldIgnoreTicks()) {
    var ticks = tickable.getTicks();
    this.ticksUsed.add(ticks);
    if((this.mode == Vex.Flow.Voice.Mode.STRICT || this.mode == Vex.Flow.Voice.Mode.FULL) && this.ticksUsed.value() > this.totalTicks.value()) {
      this.totalTicks.subtract(ticks);
      throw new Vex.RERR("BadArgument", "Too many ticks.");
    }
    if(ticks.value() < this.smallestTickCount.value()) {
      this.smallestTickCount = ticks.clone()
    }
    this.resolutionMultiplier = this.ticksUsed.denominator;
    this.totalTicks.add(0, this.ticksUsed.denominator)
  }
  this.tickables.push(tickable);
  tickable.setVoice(this);
  return this
};
Vex.Flow.Voice.prototype.addTickables = function(tickables) {
  for(var i = 0;i < tickables.length;++i) {
    this.addTickable(tickables[i])
  }
  return this
};
Vex.Flow.Voice.prototype.draw = function(context, stave) {
  var boundingBox = null;
  if(this.tickables[0]) {
    this.tickables[0].setStave(stave);
    boundingBox = this.tickables[0].getBoundingBox()
  }
  for(var i = 0;i < this.tickables.length;++i) {
    this.tickables[i].setStave(stave);
    if(i > 0 && boundingBox) {
      tickable_bb = this.tickables[i].getBoundingBox();
      if(tickable_bb) {
        boundingBox.mergeWith(tickable_bb)
      }
    }
    this.tickables[i].setContext(context);
    this.tickables[i].setStave(stave);
    this.tickables[i].draw()
  }
  this.boundingBox = boundingBox
};
Vex.Flow.VoiceGroup = function() {
  this.init()
};
Vex.Flow.VoiceGroup.prototype.init = function(time, voiceGroup) {
  this.voices = [];
  this.modifierContexts = []
};
Vex.Flow.VoiceGroup.prototype.getVoices = function() {
  return this.voices
};
Vex.Flow.VoiceGroup.prototype.addVoice = function(voice) {
  if(!voice) {
    throw new Vex.RERR("BadArguments", "Voice cannot be null.");
  }
  this.voices.push(voice);
  voice.setVoiceGroup(this)
};
Vex.Flow.VoiceGroup.prototype.getModifierContexts = function() {
  return this.modifierContexts
};
Vex.Flow.Modifier = function() {
  this.init()
};
Vex.Flow.Modifier.Position = {LEFT:1, RIGHT:2, ABOVE:3, BELOW:4};
Vex.Flow.Modifier.prototype.init = function() {
  this.width = 0;
  this.context = null;
  this.note = null;
  this.index = null;
  this.text_line = 0;
  this.position = Vex.Flow.Modifier.Position.LEFT;
  this.modifier_context = null;
  this.x_shift = 0;
  this.y_shift = 0
};
Vex.Flow.Modifier.prototype.getCategory = function() {
  return"none"
};
Vex.Flow.Modifier.prototype.getWidth = function() {
  return this.width
};
Vex.Flow.Modifier.prototype.setWidth = function(width) {
  this.width = width;
  return this
};
Vex.Flow.Modifier.prototype.getNote = function() {
  return this.note
};
Vex.Flow.Modifier.prototype.setNote = function(note) {
  this.note = note;
  return this
};
Vex.Flow.Modifier.prototype.getIndex = function() {
  return this.index
};
Vex.Flow.Modifier.prototype.setIndex = function(index) {
  this.index = index;
  return this
};
Vex.Flow.Modifier.prototype.getContext = function() {
  return this.context
};
Vex.Flow.Modifier.prototype.setContext = function(context) {
  this.context = context;
  return this
};
Vex.Flow.Modifier.prototype.getModifierContext = function() {
  return this.modifier_context
};
Vex.Flow.Modifier.prototype.setModifierContext = function(c) {
  this.modifier_context = c;
  return this
};
Vex.Flow.Modifier.prototype.setTextLine = function(line) {
  this.text_line = line;
  return this
};
Vex.Flow.Modifier.prototype.setYShift = function(y) {
  this.y_shift = y;
  return this
};
Vex.Flow.Modifier.prototype.setXShift = function(x) {
  this.x_shift = 0;
  if(this.position == Vex.Flow.Modifier.Position.LEFT) {
    this.x_shift -= x
  }else {
    this.x_shift += x
  }
};
Vex.Flow.Modifier.prototype.draw = function() {
  if(!this.context) {
    throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
  }
  throw new Vex.RERR("MethodNotImplemented", "Draw() not implemented for this modifier.");
};
Vex.Flow.ModifierContext = function() {
  this.modifiers = {};
  this.preFormatted = false;
  this.width = 0;
  this.spacing = 0;
  this.state = {left_shift:0, right_shift:0, text_line:0}
};
Vex.Flow.ModifierContext.prototype.addModifier = function(modifier) {
  var type = modifier.getCategory();
  if(!this.modifiers[type]) {
    this.modifiers[type] = []
  }
  this.modifiers[type].push(modifier);
  modifier.setModifierContext(this);
  this.preFormatted = false;
  return this
};
Vex.Flow.ModifierContext.prototype.getModifiers = function(type) {
  return this.modifiers[type]
};
Vex.Flow.ModifierContext.prototype.getWidth = function() {
  return this.width
};
Vex.Flow.ModifierContext.prototype.getExtraLeftPx = function() {
  return this.state.left_shift
};
Vex.Flow.ModifierContext.prototype.getExtraRightPx = function() {
  return this.state.right_shift
};
Vex.Flow.ModifierContext.prototype.getMetrics = function(modifier) {
  if(!this.formatted) {
    throw new Vex.RERR("UnformattedModifier", "Unformatted modifier has no metrics.");
  }
  return{width:this.state.left_shift + this.state.right_shift + this.spacing, spacing:this.spacing, extra_left_px:this.state.left_shift, extra_right_px:this.state.right_shift}
};
Vex.Flow.ModifierContext.prototype.formatNotes = function() {
  var notes = this.modifiers["stavenotes"];
  if(!notes || notes.length < 2) {
    return this
  }
  if(notes[0].getStave() != null) {
    return this.formatNotesByY(notes)
  }
  Vex.Assert(notes.length == 2, "Got more than two notes in Vex.Flow.ModifierContext.formatNotes!");
  var top_note = notes[0];
  var bottom_note = notes[1];
  if(notes[0].getStemDirection() == Vex.Flow.StaveNote.STEM_DOWN) {
    bottom_note = notes[0];
    top_note = notes[1]
  }
  var top_keys = top_note.getKeyProps();
  var bottom_keys = bottom_note.getKeyProps();
  var x_shift = 0;
  if(top_keys[0].line <= bottom_keys[bottom_keys.length - 1].line + 0.5) {
    x_shift = top_note.getVoiceShiftWidth();
    bottom_note.setXShift(x_shift)
  }
  this.state.right_shift += x_shift;
  return this
};
Vex.Flow.ModifierContext.prototype.formatNotesByY = function(notes) {
  var hasStave = true;
  for(var i = 0;i < notes.length;i++) {
    hasStave = hasStave && notes[i].getStave() != null
  }
  if(!hasStave) {
    throw new Vex.RERR("Stave Missing", "All notes must have a stave - Vex.Flow.ModifierContext.formatMultiVoice!");
  }
  var x_shift = 0;
  for(var i = 0;i < notes.length - 1;i++) {
    var top_note = notes[i];
    var bottom_note = notes[i + 1];
    if(top_note.getStemDirection() == Vex.Flow.StaveNote.STEM_DOWN) {
      top_note = notes[i + 1];
      bottom_note = notes[i]
    }
    var top_keys = top_note.getKeyProps();
    var bottom_keys = bottom_note.getKeyProps();
    var topY = top_note.getStave().getYForLine(top_keys[0].line);
    var bottomY = bottom_note.getStave().getYForLine(bottom_keys[bottom_keys.length - 1].line);
    var line_space = top_note.getStave().options.spacing_between_lines_px;
    if(Math.abs(topY - bottomY) == line_space / 2) {
      x_shift = top_note.getVoiceShiftWidth();
      bottom_note.setXShift(x_shift)
    }
  }
  this.state.right_shift += x_shift;
  return this
};
Vex.Flow.ModifierContext.prototype.formatDots = function() {
  var right_shift = this.state.right_shift;
  var dots = this.modifiers["dots"];
  var dot_spacing = 1;
  if(!dots || dots.length == 0) {
    return this
  }
  var dot_list = [];
  for(var i = 0;i < dots.length;++i) {
    var dot = dots[i];
    var note = dot.getNote();
    var props = note.getKeyProps()[dot.getIndex()];
    var shift = props.displaced ? note.getExtraRightPx() : 0;
    dot_list.push({line:props.line, shift:shift, note:note, dot:dot})
  }
  dot_list.sort(function(a, b) {
    return b.line - a.line
  });
  var dot_shift = right_shift;
  var x_width = 0;
  var top_line = dot_list[0].line;
  var last_line = null;
  var last_note = null;
  for(var i = 0;i < dot_list.length;++i) {
    var dot = dot_list[i].dot;
    var line = dot_list[i].line;
    var note = dot_list[i].note;
    var shift = dot_list[i].shift;
    if(line != last_line || note != last_note) {
      dot_shift = right_shift + shift
    }
    dot.setXShift(dot_shift);
    dot_shift += dot.getWidth() + dot_spacing;
    x_width = dot_shift > x_width ? dot_shift : x_width;
    last_line = line;
    last_note = note
  }
  this.state.right_shift += x_width;
  return this
};
Vex.Flow.ModifierContext.prototype.formatAccidentals = function() {
  var left_shift = this.state.left_shift;
  var accidentals = this.modifiers["accidentals"];
  var accidental_spacing = 2;
  if(!accidentals || accidentals.length == 0) {
    return this
  }
  var acc_list = [];
  var hasStave = false;
  var prev_note = null;
  var shiftL = 0;
  for(var i = 0;i < accidentals.length;++i) {
    var acc = accidentals[i];
    var note = acc.getNote();
    var stave = note.getStave();
    var props = note.getKeyProps()[acc.getIndex()];
    if(note != prev_note) {
      for(var n = 0;n < note.keys.length;++n) {
        props_tmp = note.getKeyProps()[n];
        shiftL = props_tmp.displaced ? note.getExtraLeftPx() : shiftL
      }
      prev_note = note
    }
    if(stave != null) {
      hasStave = true;
      var line_space = stave.options.spacing_between_lines_px;
      var y = stave.getYForLine(props.line);
      acc_list.push({y:y, shift:shift, acc:acc, lineSpace:line_space})
    }else {
      acc_list.push({line:props.line, shift:shiftL, acc:acc})
    }
  }
  if(hasStave) {
    return this.formatAccidentalsByY(acc_list)
  }
  acc_list.sort(function(a, b) {
    return b.line - a.line
  });
  var acc_shift = acc_list[0].shift;
  var x_width = 0;
  var top_line = acc_list[0].line;
  for(var i = 0;i < acc_list.length;++i) {
    var acc = acc_list[i].acc;
    var line = acc_list[i].line;
    var shift = acc_list[i].shift;
    if(line < top_line - 3) {
      top_line = line;
      acc_shift = shift
    }
    acc.setXShift(left_shift + acc_shift);
    acc_shift += acc.getWidth() + accidental_spacing;
    x_width = acc_shift > x_width ? acc_shift : x_width
  }
  this.state.left_shift += x_width;
  return this
};
Vex.Flow.ModifierContext.prototype.formatAccidentalsByY = function(acc_list) {
  var left_shift = this.state.left_shift;
  var accidental_spacing = 2;
  acc_list.sort(function(a, b) {
    return b.y - a.y
  });
  var acc_shift = acc_list[0].shift;
  var x_width = 0;
  var top_y = acc_list[0].y;
  for(var i = 0;i < acc_list.length;++i) {
    var acc = acc_list[i].acc;
    var y = acc_list[i].y;
    var shift = acc_list[i].shift;
    if(top_y - y > 3 * acc_list[i].lineSpace) {
      top_y = y;
      acc_shift = shift
    }
    acc.setXShift(acc_shift + left_shift);
    acc_shift += acc.getWidth() + accidental_spacing;
    x_width = acc_shift > x_width ? acc_shift : x_width
  }
  this.state.left_shift += x_width;
  return this
};
Vex.Flow.ModifierContext.prototype.formatStrokes = function() {
  var left_shift = this.state.left_shift;
  var strokes = this.modifiers["strokes"];
  var stroke_spacing = 0;
  if(!strokes || strokes.length == 0) {
    return this
  }
  var str_list = [];
  for(var i = 0;i < strokes.length;++i) {
    var str = strokes[i];
    var note = str.getNote();
    if(note instanceof Vex.Flow.StaveNote) {
      var props = note.getKeyProps()[str.getIndex()];
      var shift = props.displaced ? note.getExtraLeftPx() : 0;
      str_list.push({line:props.line, shift:shift, str:str})
    }else {
      var props = note.getPositions()[str.getIndex()];
      str_list.push({line:props.str, shift:0, str:str})
    }
  }
  var str_shift = left_shift;
  var x_shift = 0;
  for(var i = 0;i < str_list.length;++i) {
    var str = str_list[i].str;
    var line = str_list[i].line;
    var shift = str_list[i].shift;
    str.setXShift(str_shift + shift);
    x_shift = Math.max(str.getWidth() + stroke_spacing, x_shift)
  }
  this.state.left_shift += x_shift;
  return this
};
Vex.Flow.ModifierContext.prototype.formatStringNumbers = function() {
  var left_shift = this.state.left_shift;
  var right_shift = this.state.right_shift;
  var nums = this.modifiers["stringnumber"];
  var num_spacing = 1;
  if(!nums || nums.length == 0) {
    return this
  }
  var nums_list = [];
  var prev_note = null;
  var shift_left = 0;
  var shift_right = 0;
  for(var i = 0;i < nums.length;++i) {
    var num = nums[i];
    var note = num.getNote();
    for(var i = 0;i < nums.length;++i) {
      var num = nums[i];
      var note = num.getNote();
      var props = note.getKeyProps()[num.getIndex()];
      var pos = num.getPosition();
      if(note != prev_note) {
        for(n = 0;n < note.keys.length;++n) {
          props_tmp = note.getKeyProps()[n];
          if(left_shift == 0) {
            shift_left = props_tmp.displaced ? note.getExtraLeftPx() : shift_left
          }
          if(right_shift == 0) {
            shift_right = props_tmp.displaced ? note.getExtraRightPx() : shift_right
          }
        }
        prev_note = note
      }
      nums_list.push({line:props.line, pos:pos, shiftL:shift_left, shiftR:shift_right, note:note, num:num})
    }
  }
  nums_list.sort(function(a, b) {
    return b.line - a.line
  });
  var num_shiftL = 0;
  var num_shiftR = 0;
  var x_widthL = 0;
  var x_widthR = 0;
  var last_line = null;
  var last_note = null;
  for(var i = 0;i < nums_list.length;++i) {
    var num_shift = 0;
    var num = nums_list[i].num;
    var line = nums_list[i].line;
    var note = nums_list[i].note;
    var shiftL = nums_list[i].shiftL;
    var shiftR = nums_list[i].shiftR;
    var pos = nums_list[i].pos;
    if(line != last_line || note != last_note) {
      num_shiftL = left_shift + shiftL;
      num_shiftR = right_shift + shiftR
    }
    var num_width = num.getWidth() + num_spacing;
    if(pos == Vex.Flow.Modifier.Position.LEFT) {
      num.setXShift(left_shift);
      num_shift = shift_left + num_width;
      x_widthL = num_shift > x_widthL ? num_shift : x_widthL
    }else {
      if(pos == Vex.Flow.Modifier.Position.RIGHT) {
        num.setXShift(num_shiftR);
        num_shift += num_width;
        x_widthR = num_shift > x_widthR ? num_shift : x_widthR
      }
    }
    last_line = line;
    last_note = note
  }
  this.state.left_shift += x_widthL;
  this.state.right_shift += x_widthR;
  return this
};
Vex.Flow.ModifierContext.prototype.formatFretHandFingers = function() {
  var left_shift = this.state.left_shift;
  var right_shift = this.state.right_shift;
  var nums = this.modifiers["frethandfinger"];
  var num_spacing = 1;
  if(!nums || nums.length == 0) {
    return this
  }
  var nums_list = [];
  var prev_note = null;
  var shift_left = 0;
  var shift_right = 0;
  for(var i = 0;i < nums.length;++i) {
    var num = nums[i];
    var note = num.getNote();
    var props = note.getKeyProps()[num.getIndex()];
    var pos = num.getPosition();
    if(note != prev_note) {
      for(n = 0;n < note.keys.length;++n) {
        props_tmp = note.getKeyProps()[n];
        if(left_shift == 0) {
          shift_left = props_tmp.displaced ? note.getExtraLeftPx() : shift_left
        }
        if(right_shift == 0) {
          shift_right = props_tmp.displaced ? note.getExtraRightPx() : shift_right
        }
      }
      prev_note = note
    }
    nums_list.push({line:props.line, pos:pos, shiftL:shift_left, shiftR:shift_right, note:note, num:num})
  }
  nums_list.sort(function(a, b) {
    return b.line - a.line
  });
  var num_shiftL = 0;
  var num_shiftR = 0;
  var x_widthL = 0;
  var x_widthR = 0;
  var last_line = null;
  var last_note = null;
  for(var i = 0;i < nums_list.length;++i) {
    var num_shift = 0;
    var num = nums_list[i].num;
    var line = nums_list[i].line;
    var note = nums_list[i].note;
    var shiftL = nums_list[i].shiftL;
    var shiftR = nums_list[i].shiftR;
    var pos = nums_list[i].pos;
    if(line != last_line || note != last_note) {
      num_shiftL = left_shift + shiftL;
      num_shiftR = right_shift + shiftR
    }
    var num_width = num.getWidth() + num_spacing;
    if(pos == Vex.Flow.Modifier.Position.LEFT) {
      num.setXShift(left_shift + num_shiftL);
      num_shift = left_shift + num_width;
      x_widthL = num_shift > x_widthL ? num_shift : x_widthL
    }else {
      if(pos == Vex.Flow.Modifier.Position.RIGHT) {
        num.setXShift(num_shiftR);
        num_shift = shift_right + num_width;
        x_widthR = num_shift > x_widthR ? num_shift : x_widthR
      }
    }
    last_line = line;
    last_note = note
  }
  this.state.left_shift += x_widthL;
  this.state.right_shift += x_widthR;
  return this
};
Vex.Flow.ModifierContext.prototype.formatBends = function() {
  var right_shift = this.state.right_shift;
  var bends = this.modifiers["bends"];
  if(!bends || bends.length == 0) {
    return this
  }
  var width = 0;
  var last_width = 0;
  var text_line = this.state.text_line;
  for(var i = 0;i < bends.length;++i) {
    var bend = bends[i];
    bend.setXShift(last_width);
    last_width = bend.getWidth();
    bend.setTextLine(text_line)
  }
  this.state.right_shift += last_width;
  this.state.text_line += 1;
  return this
};
Vex.Flow.ModifierContext.prototype.formatVibratos = function() {
  var vibratos = this.modifiers["vibratos"];
  if(!vibratos || vibratos.length == 0) {
    return this
  }
  var text_line = this.state.text_line;
  var width = 0;
  var shift = this.state.right_shift - 7;
  var bends = this.modifiers["bends"];
  if(bends && bends.length > 0) {
    text_line--
  }
  for(var i = 0;i < vibratos.length;++i) {
    var vibrato = vibratos[i];
    vibrato.setXShift(shift);
    vibrato.setTextLine(text_line);
    width += vibrato.getWidth();
    shift += width
  }
  this.state.right_shift += width;
  this.state.text_line += 1;
  return this
};
Vex.Flow.ModifierContext.prototype.formatAnnotations = function() {
  var annotations = this.modifiers["annotations"];
  if(!annotations || annotations.length == 0) {
    return this
  }
  var text_line = this.state.text_line;
  var max_width = 0;
  for(var i = 0;i < annotations.length;++i) {
    var annotation = annotations[i];
    annotation.setTextLine(text_line);
    var width = annotation.getWidth() > max_width ? annotation.getWidth() : max_width;
    text_line++
  }
  this.state.left_shift += width / 2;
  this.state.right_shift += width / 2;
  return this
};
Vex.Flow.ModifierContext.prototype.formatArticulations = function() {
  var articulations = this.modifiers["articulations"];
  if(!articulations || articulations.length == 0) {
    return this
  }
  var text_line = this.state.text_line;
  var max_width = 0;
  for(var i = 0;i < articulations.length;++i) {
    var articulation = articulations[i];
    articulation.setTextLine(text_line);
    var width = articulation.getWidth() > max_width ? articulation.getWidth() : max_width;
    text_line += 1.5
  }
  this.state.left_shift += width / 2;
  this.state.right_shift += width / 2;
  this.state.text_line = text_line;
  return this
};
Vex.Flow.ModifierContext.prototype.preFormat = function() {
  if(this.preFormatted) {
    return
  }
  this.formatNotes().formatDots().formatFretHandFingers().formatAccidentals().formatStrokes().formatStringNumbers().formatArticulations().formatAnnotations().formatBends().formatVibratos();
  this.width = this.state.left_shift + this.state.right_shift;
  this.preFormatted = true
};
Vex.Flow.Accidental = function(type) {
  if(arguments.length > 0) {
    this.init(type)
  }
};
Vex.Flow.Accidental.prototype = new Vex.Flow.Modifier;
Vex.Flow.Accidental.prototype.constructor = Vex.Flow.Accidental;
Vex.Flow.Accidental.superclass = Vex.Flow.Modifier.prototype;
Vex.Flow.Accidental.prototype.init = function(type) {
  var superclass = Vex.Flow.Accidental.superclass;
  superclass.init.call(this);
  this.note = null;
  this.index = null;
  this.type = type;
  this.position = Vex.Flow.Modifier.Position.LEFT;
  this.render_options = {font_scale:38, stroke_px:3, stroke_spacing:10};
  this.accidental = Vex.Flow.accidentalCodes(this.type);
  this.setWidth(this.accidental.width)
};
Vex.Flow.Accidental.prototype.getCategory = function() {
  return"accidentals"
};
Vex.Flow.Accidental.prototype.draw = function() {
  if(!this.context) {
    throw new Vex.RERR("NoContext", "Can't draw accidental without a context.");
  }
  if(!(this.note && this.index != null)) {
    throw new Vex.RERR("NoAttachedNote", "Can't draw accidental without a note and index.");
  }
  var start = this.note.getModifierStartXY(this.position, this.index);
  var acc_x = start.x + this.x_shift - this.width;
  var acc_y = start.y + this.y_shift;
  Vex.Flow.renderGlyph(this.context, acc_x, acc_y, this.render_options.font_scale, this.accidental.code)
};
Vex.Flow.Dot = function() {
  this.init()
};
Vex.Flow.Dot.prototype = new Vex.Flow.Modifier;
Vex.Flow.Dot.prototype.constructor = Vex.Flow.Dot;
Vex.Flow.Dot.superclass = Vex.Flow.Modifier.prototype;
Vex.Flow.Dot.prototype.init = function() {
  var superclass = Vex.Flow.Dot.superclass;
  superclass.init.call(this);
  this.note = null;
  this.index = null;
  this.position = Vex.Flow.Modifier.Position.RIGHT;
  this.radius = 2;
  this.setWidth(5)
};
Vex.Flow.Dot.prototype.getCategory = function() {
  return"dots"
};
Vex.Flow.Dot.prototype.draw = function() {
  if(!this.context) {
    throw new Vex.RERR("NoContext", "Can't draw dot without a context.");
  }
  if(!(this.note && this.index != null)) {
    throw new Vex.RERR("NoAttachedNote", "Can't draw dot without a note and index.");
  }
  var start = this.note.getModifierStartXY(this.position, this.index);
  var dot_x = start.x + this.x_shift + this.width - this.radius;
  var dot_y = start.y + this.y_shift;
  var ctx = this.context;
  ctx.beginPath();
  ctx.arc(dot_x, dot_y, this.radius, 0, Math.PI * 2, false);
  ctx.fill()
};
Vex.Flow.Formatter = function() {
  this.minTotalWidth = 0;
  this.hasMinTotalWidth = false;
  this.minTicks = null;
  this.pixelsPerTick = 0;
  this.totalTicks = new Vex.Flow.Fraction(0, 1);
  this.tContexts = null;
  this.mContexts = null;
  this.render_options = {perTickableWidth:15, maxExtraWidthPerTickable:40}
};
Vex.Flow.Formatter.FormatAndDraw = function(ctx, stave, notes, autobeam) {
  var voice = (new Vex.Flow.Voice(Vex.Flow.TIME4_4)).setMode(Vex.Flow.Voice.Mode.SOFT);
  voice.addTickables(notes);
  var beams = null;
  if(autobeam == true) {
    beams = Vex.Flow.Beam.applyAndGetBeams(voice)
  }
  var formatter = (new Vex.Flow.Formatter).joinVoices([voice]).formatToStave([voice], stave);
  voice.setStave(stave);
  voice.draw(ctx, stave);
  if(beams != null) {
    for(var i = 0;i < beams.length;++i) {
      beams[i].setContext(ctx).draw()
    }
  }
  return voice.getBoundingBox()
};
Vex.Flow.Formatter.FormatAndDrawTab = function(ctx, tabstave, stave, tabnotes, notes, autobeam) {
  var notevoice = (new Vex.Flow.Voice(Vex.Flow.TIME4_4)).setMode(Vex.Flow.Voice.Mode.SOFT);
  notevoice.addTickables(notes);
  var tabvoice = (new Vex.Flow.Voice(Vex.Flow.TIME4_4)).setMode(Vex.Flow.Voice.Mode.SOFT);
  tabvoice.addTickables(tabnotes);
  var beams = null;
  if(autobeam == true) {
    beams = Vex.Flow.Beam.applyAndGetBeams(notevoice)
  }
  var formatter = (new Vex.Flow.Formatter).joinVoices([notevoice]).joinVoices([tabvoice]).formatToStave([notevoice, tabvoice], stave);
  notevoice.draw(ctx, stave);
  tabvoice.draw(ctx, tabstave);
  if(beams != null) {
    for(var i = 0;i < beams.length;++i) {
      beams[i].setContext(ctx).draw()
    }
  }
  (new Vex.Flow.StaveConnector(stave, tabstave)).setContext(ctx).draw()
};
Vex.Flow.Formatter.prototype.preCalculateMinTotalWidth = function(voices) {
  if(this.hasMinTotalWidth) {
    return
  }
  if(!this.tContexts) {
    if(!voices) {
      throw new Vex.RERR("BadArgument", "'voices' required to run preCalculateMinTotalWidth");
    }
    this.createTickContexts(voices)
  }
  var contexts = this.tContexts;
  var contextList = contexts.list;
  var contextMap = contexts.map;
  this.minTotalWidth = 0;
  for(var i = 0;i < contextList.length;++i) {
    var context = contextMap[contextList[i]];
    context.preFormat();
    this.minTotalWidth += context.getWidth()
  }
  this.hasMinTotalWidth = true;
  return this.minTotalWidth
};
Vex.Flow.Formatter.prototype.getMinTotalWidth = function() {
  if(!this.hasMinTotalWidth) {
    throw new Vex.RERR("NoMinTotalWidth", "Need to call 'preCalculateMinTotalWidth' or 'preFormat' before" + " calling 'getMinTotalWidth'");
  }
  return this.minTotalWidth
};
Vex.Flow.Formatter.createContexts = function(voices, context_type, add_fn) {
  if(!voices || !voices.length) {
    throw new Vex.RERR("BadArgument", "No voices to format");
  }
  var totalTicks = voices[0].getTotalTicks();
  var tickToContextMap = {};
  var tickList = [];
  var resolutionMultiplier = 1;
  for(var i = 0;i < voices.length;++i) {
    var voice = voices[i];
    if(voice.getTotalTicks().value() != totalTicks.value()) {
      throw new Vex.RERR("TickMismatch", "Voices should have same time signature.");
    }
    if(voice.getMode() == Vex.Flow.Voice.Mode.STRICT && !voice.isComplete()) {
      throw new Vex.RERR("IncompleteVoice", "Voice does not have enough notes.");
    }
    var lcm = Vex.Flow.Fraction.LCM(resolutionMultiplier, voice.getResolutionMultiplier());
    if(resolutionMultiplier < lcm) {
      resolutionMultiplier = lcm
    }
  }
  for(var i = 0;i < voices.length;++i) {
    var voice = voices[i];
    var tickables = voice.getTickables();
    var ticksUsed = new Vex.Flow.Fraction(0, resolutionMultiplier);
    for(var j = 0;j < tickables.length;++j) {
      var tickable = tickables[j];
      var integerTicks = ticksUsed.numerator;
      if(!tickToContextMap[integerTicks]) {
        tickToContextMap[integerTicks] = new context_type
      }
      add_fn(tickable, tickToContextMap[integerTicks]);
      tickList.push(integerTicks);
      ticksUsed.add(tickable.getTicks())
    }
  }
  return{map:tickToContextMap, list:Vex.SortAndUnique(tickList, function(a, b) {
    return a - b
  }, function(a, b) {
    return a === b
  }), resolutionMultiplier:resolutionMultiplier}
};
Vex.Flow.Formatter.prototype.createModifierContexts = function(voices) {
  var contexts = Vex.Flow.Formatter.createContexts(voices, Vex.Flow.ModifierContext, function(tickable, context) {
    tickable.addToModifierContext(context)
  });
  this.mContexts = contexts;
  return contexts
};
Vex.Flow.Formatter.prototype.createTickContexts = function(voices) {
  var contexts = Vex.Flow.Formatter.createContexts(voices, Vex.Flow.TickContext, function(tickable, context) {
    context.addTickable(tickable)
  });
  this.totalTicks = voices[0].getTicksUsed().clone();
  this.tContexts = contexts;
  return contexts
};
Vex.Flow.Formatter.prototype.preFormat = function(justifyWidth, rendering_context) {
  var contexts = this.tContexts;
  var contextList = contexts.list;
  var contextMap = contexts.map;
  if(!justifyWidth) {
    justifyWidth = 0;
    this.pixelsPerTick = 0
  }else {
    this.pixelsPerTick = justifyWidth / (this.totalTicks.value() * contexts.resolutionMultiplier)
  }
  var x = 0;
  var white_space = 0;
  var tick_space = 0;
  var prev_tick = 0;
  var prev_width = 0;
  var lastMetrics = null;
  var initial_justify_width = justifyWidth;
  this.minTotalWidth = 0;
  for(var i = 0;i < contextList.length;++i) {
    var tick = contextList[i];
    var context = contextMap[tick];
    if(rendering_context) {
      context.setContext(rendering_context)
    }
    context.preFormat();
    var thisMetrics = context.getMetrics();
    var width = context.getWidth();
    this.minTotalWidth += width;
    var min_x = 0;
    var pixels_used = width;
    tick_space = Math.min((tick - prev_tick) * this.pixelsPerTick, pixels_used);
    var set_x = x + tick_space;
    if(lastMetrics != null) {
      min_x = x + prev_width - lastMetrics.extraLeftPx
    }
    set_x = context.shouldIgnoreTicks() ? min_x + context.getWidth() : Math.max(set_x, min_x);
    if(context.shouldIgnoreTicks() && justifyWidth) {
      justifyWidth -= context.getWidth();
      this.pixelsPerTick = justifyWidth / (this.totalTicks.value() * contexts.resolutionMultiplier)
    }
    var left_px = thisMetrics.extraLeftPx;
    if(lastMetrics != null) {
      white_space = set_x - x - (prev_width - lastMetrics.extraLeftPx)
    }
    if(i > 0) {
      if(white_space > 0) {
        if(white_space >= left_px) {
          left_px = 0
        }else {
          left_px -= white_space
        }
      }
    }
    set_x += left_px;
    context.setX(set_x);
    context.setPixelsUsed(pixels_used);
    lastMetrics = thisMetrics;
    prev_width = width;
    prev_tick = tick;
    x = set_x
  }
  this.hasMinTotalWidth = true;
  if(justifyWidth > 0) {
    var remaining_x = initial_justify_width - (x + prev_width);
    var leftover_pixels_per_tick = remaining_x / (this.totalTicks.value() * contexts.resolutionMultiplier);
    var prev_tick = 0;
    var accumulated_space = 0;
    for(var i = 0;i < contextList.length;++i) {
      var tick = contextList[i];
      var context = contextMap[tick];
      var tick_space = (tick - prev_tick) * leftover_pixels_per_tick;
      accumulated_space = accumulated_space + tick_space;
      context.setX(context.getX() + accumulated_space);
      prev_tick = tick
    }
  }
};
Vex.Flow.Formatter.prototype.joinVoices = function(voices) {
  this.createModifierContexts(voices);
  this.hasMinTotalWidth = false;
  return this
};
Vex.Flow.Formatter.prototype.format = function(voices, justifyWidth) {
  this.createTickContexts(voices);
  this.preFormat(justifyWidth);
  return this
};
Vex.Flow.Formatter.prototype.formatToStave = function(voices, stave) {
  var voice_width = stave.getNoteEndX() - stave.getNoteStartX() - 10;
  this.createTickContexts(voices);
  this.preFormat(voice_width, stave.getContext());
  return this
};
Vex.Flow.StaveTie = function(notes, text) {
  if(arguments.length > 0) {
    this.init(notes, text)
  }
};
Vex.Flow.StaveTie.prototype.init = function(notes, text) {
  this.notes = notes;
  this.context = null;
  this.text = text;
  this.render_options = {cp1:8, cp2:15, text_shift_x:0, first_x_shift:0, last_x_shift:0, y_shift:7, tie_spacing:0, font:{family:"Arial", size:10, style:""}};
  this.font = this.render_options.font;
  this.setNotes(notes)
};
Vex.Flow.StaveTie.prototype.setContext = function(context) {
  this.context = context;
  return this
};
Vex.Flow.StaveTie.prototype.setFont = function(font) {
  this.font = font;
  return this
};
Vex.Flow.StaveTie.prototype.setNotes = function(notes) {
  if(!notes.first_note && !notes.last_note) {
    throw new Vex.RuntimeError("BadArguments", "Tie needs to have either first_note or last_note set.");
  }
  if(!notes.first_indices) {
    notes.first_indices = [0]
  }
  if(!notes.last_indices) {
    notes.last_indices = [0]
  }
  if(notes.first_indices.length != notes.last_indices.length) {
    throw new Vex.RuntimeError("BadArguments", "Tied notes must have similar" + " index sizes");
  }
  this.first_note = notes.first_note;
  this.first_indices = notes.first_indices;
  this.last_note = notes.last_note;
  this.last_indices = notes.last_indices;
  return this
};
Vex.Flow.StaveTie.prototype.isPartial = function() {
  return!this.first_note || !this.last_note
};
Vex.Flow.StaveTie.prototype.renderTie = function(params) {
  if(params.first_ys.length == 0 || params.last_ys.length == 0) {
    throw new Vex.RERR("BadArguments", "No Y-values to render");
  }
  var ctx = this.context;
  var cp1 = this.render_options.cp1;
  var cp2 = this.render_options.cp2;
  if(Math.abs(params.last_x_px - params.first_x_px) < 10) {
    cp1 = 2;
    cp2 = 8
  }
  var first_x_shift = this.render_options.first_x_shift;
  var last_x_shift = this.render_options.last_x_shift;
  var y_shift = this.render_options.y_shift * params.direction;
  for(var i = 0;i < this.first_indices.length;++i) {
    var cp_x = (params.last_x_px + last_x_shift + (params.first_x_px + first_x_shift)) / 2;
    var first_y_px = params.first_ys[this.first_indices[i]] + y_shift;
    var last_y_px = params.last_ys[this.last_indices[i]] + y_shift;
    if(isNaN(first_y_px) || isNaN(last_y_px)) {
      throw new Vex.RERR("BadArguments", "Bad indices for tie rendering.");
    }
    var top_cp_y = (first_y_px + last_y_px) / 2 + cp1 * params.direction;
    var bottom_cp_y = (first_y_px + last_y_px) / 2 + cp2 * params.direction;
    ctx.beginPath();
    ctx.moveTo(params.first_x_px + first_x_shift, first_y_px);
    ctx.quadraticCurveTo(cp_x, top_cp_y, params.last_x_px + last_x_shift, last_y_px);
    ctx.quadraticCurveTo(cp_x, bottom_cp_y, params.first_x_px + first_x_shift, first_y_px);
    ctx.closePath();
    ctx.fill()
  }
};
Vex.Flow.StaveTie.prototype.renderText = function(first_x_px, last_x_px) {
  if(!this.text) {
    return
  }
  var center_x = (first_x_px + last_x_px) / 2;
  center_x -= this.context.measureText(this.text).width / 2;
  this.context.save();
  this.context.setFont(this.font.family, this.font.size, this.font.style);
  this.context.fillText(this.text, center_x + this.render_options.text_shift_x, (this.first_note || this.last_note).getStave().getYForTopText() - 1);
  this.context.restore()
};
Vex.Flow.StaveTie.prototype.draw = function() {
  if(!this.context) {
    throw new Vex.RERR("NoContext", "No context to render tie.");
  }
  var first_note = this.first_note;
  var last_note = this.last_note;
  var first_x_px, last_x_px, first_ys, last_ys, stem_direction;
  if(first_note) {
    first_x_px = first_note.getTieRightX() + this.render_options.tie_spacing;
    stem_direction = first_note.getStemDirection();
    first_ys = first_note.getYs()
  }else {
    first_x_px = last_note.getStave().getTieStartX();
    first_ys = last_note.getYs();
    this.first_indices = this.last_indices
  }
  if(last_note) {
    last_x_px = last_note.getTieLeftX() + this.render_options.tie_spacing;
    stem_direction = last_note.getStemDirection();
    last_ys = last_note.getYs()
  }else {
    last_x_px = first_note.getStave().getTieEndX();
    last_ys = first_note.getYs();
    this.last_indices = this.first_indices
  }
  this.renderTie({first_x_px:first_x_px, last_x_px:last_x_px, first_ys:first_ys, last_ys:last_ys, direction:stem_direction});
  this.renderText(first_x_px, last_x_px);
  return true
};
Vex.Flow.TabTie = function(notes, text) {
  if(arguments.length > 0) {
    this.init(notes, text)
  }
};
Vex.Flow.TabTie.prototype = new Vex.Flow.StaveTie;
Vex.Flow.TabTie.prototype.constructor = Vex.Flow.TabTie;
Vex.Flow.TabTie.superclass = Vex.Flow.StaveTie.prototype;
Vex.Flow.TabTie.createHammeron = function(notes) {
  return new Vex.Flow.TabTie(notes, "H")
};
Vex.Flow.TabTie.createPulloff = function(notes) {
  return new Vex.Flow.TabTie(notes, "P")
};
Vex.Flow.TabTie.prototype.init = function(notes, text) {
  Vex.Flow.TabTie.superclass.init.call(this, notes, text);
  this.render_options.cp1 = 9;
  this.render_options.cp2 = 11;
  this.render_options.y_shift = 3;
  this.setNotes(notes)
};
Vex.Flow.TabTie.prototype.draw = function() {
  if(!this.context) {
    throw new Vex.RERR("NoContext", "No context to render tie.");
  }
  var first_note = this.first_note;
  var last_note = this.last_note;
  var first_x_px, last_x_px, first_ys, last_ys;
  if(first_note) {
    first_x_px = first_note.getTieRightX() + this.render_options.tie_spacing;
    first_ys = first_note.getYs()
  }else {
    first_x_px = last_note.getStave().getTieStartX();
    first_ys = last_note.getYs();
    this.first_indices = this.last_indices
  }
  if(last_note) {
    last_x_px = last_note.getTieLeftX() + this.render_options.tie_spacing;
    last_ys = last_note.getYs()
  }else {
    last_x_px = first_note.getStave().getTieEndX();
    last_ys = first_note.getYs();
    this.last_indices = this.first_indices
  }
  this.renderTie({first_x_px:first_x_px, last_x_px:last_x_px, first_ys:first_ys, last_ys:last_ys, direction:-1});
  this.renderText(first_x_px, last_x_px);
  return true
};
Vex.Flow.TabSlide = function(notes, direction) {
  if(arguments.length > 0) {
    this.init(notes, direction)
  }
};
Vex.Flow.TabSlide.prototype = new Vex.Flow.TabTie;
Vex.Flow.TabSlide.prototype.constructor = Vex.Flow.TabSlide;
Vex.Flow.TabSlide.superclass = Vex.Flow.TabTie.prototype;
Vex.Flow.TabSlide.SLIDE_UP = 1;
Vex.Flow.TabSlide.SLIDE_DOWN = -1;
Vex.Flow.TabSlide.createSlideUp = function(notes) {
  return new Vex.Flow.TabSlide(notes, Vex.Flow.TabSlide.SLIDE_UP)
};
Vex.Flow.TabSlide.createSlideDown = function(notes) {
  return new Vex.Flow.TabSlide(notes, Vex.Flow.TabSlide.SLIDE_DOWN)
};
Vex.Flow.TabSlide.prototype.init = function(notes, direction) {
  Vex.Flow.TabSlide.superclass.init.call(this, notes, "sl.");
  if(!direction) {
    var first_fret = notes.first_note.getPositions()[0].fret;
    var last_fret = notes.last_note.getPositions()[0].fret;
    direction = parseInt(first_fret) > parseInt(last_fret) ? Vex.Flow.TabSlide.SLIDE_DOWN : Vex.Flow.TabSlide.SLIDE_UP
  }
  this.slide_direction = direction;
  this.render_options.cp1 = 11;
  this.render_options.cp2 = 14;
  this.render_options.y_shift = 0.5;
  this.setFont({font:"Times", size:10, style:"bold italic"});
  this.setNotes(notes)
};
Vex.Flow.TabSlide.prototype.renderTie = function(params) {
  if(params.first_ys.length == 0 || params.last_ys.length == 0) {
    throw new Vex.RERR("BadArguments", "No Y-values to render");
  }
  var ctx = this.context;
  var first_x_px = params.first_x_px;
  var first_ys = params.first_ys;
  var last_x_px = params.last_x_px;
  var center_x = (first_x_px + last_x_px) / 2;
  var direction = this.slide_direction;
  if(direction != Vex.Flow.TabSlide.SLIDE_UP && direction != Vex.Flow.TabSlide.SLIDE_DOWN) {
    throw new Vex.RERR("BadSlide", "Invalid slide direction");
  }
  for(var i = 0;i < this.first_indices.length;++i) {
    var slide_y = first_ys[this.first_indices[i]] + this.render_options.y_shift;
    if(isNaN(slide_y)) {
      throw new Vex.RERR("BadArguments", "Bad indices for slide rendering.");
    }
    ctx.beginPath();
    ctx.moveTo(first_x_px, slide_y + 3 * direction);
    ctx.lineTo(last_x_px, slide_y - 3 * direction);
    ctx.closePath();
    ctx.stroke()
  }
};
Vex.Flow.Bend = function(text, release, phrase) {
  if(arguments.length > 0) {
    this.init(text, release, phrase)
  }
};
Vex.Flow.Bend.UP = 0;
Vex.Flow.Bend.DOWN = 1;
Vex.Flow.Bend.prototype = new Vex.Flow.Modifier;
Vex.Flow.Bend.prototype.constructor = Vex.Flow.Bend;
Vex.Flow.Bend.superclass = Vex.Flow.Modifier.prototype;
Vex.Flow.Bend.prototype.init = function(text, release, phrase) {
  var superclass = Vex.Flow.Bend.superclass;
  superclass.init.call(this);
  this.text = text;
  this.x_shift = 0;
  this.release = release || false;
  this.font = "10pt Arial";
  this.render_options = {bend_width:8, release_width:8};
  if(phrase) {
    this.phrase = phrase
  }else {
    this.phrase = [{type:Vex.Flow.Bend.UP, text:this.text}];
    if(this.release) {
      this.phrase.push({type:Vex.Flow.Bend.DOWN, text:""})
    }
  }
  this.updateWidth()
};
Vex.Flow.Bend.prototype.setXShift = function(value) {
  this.x_shift = value;
  this.updateWidth()
};
Vex.Flow.Bend.prototype.getCategory = function() {
  return"bends"
};
Vex.Flow.Bend.prototype.getText = function() {
  return this.text
};
Vex.Flow.Bend.prototype.updateWidth = function() {
  var that = this;
  function measure_text(text) {
    var text_width;
    if(that.context) {
      text_width = that.context.measureText(text).width
    }else {
      text_width = Vex.Flow.textWidth(text)
    }
    return text_width
  }
  var total_width = 0;
  for(var i = 0;i < this.phrase.length;++i) {
    var bend = this.phrase[i];
    if("width" in bend) {
      total_width += bend.width
    }else {
      var additional_width = bend.type == Vex.Flow.Bend.UP ? this.render_options.bend_width : this.render_options.release_width;
      bend.width = Vex.Max(additional_width, measure_text(bend.text)) + 3;
      bend.draw_width = bend.width / 2;
      total_width += bend.width
    }
  }
  this.setWidth(total_width + this.x_shift);
  return this
};
Vex.Flow.Bend.prototype.setFont = function(font) {
  this.font = font;
  return this
};
Vex.Flow.Bend.prototype.draw = function() {
  if(!this.context) {
    throw new Vex.RERR("NoContext", "Can't draw bend without a context.");
  }
  if(!(this.note && this.index != null)) {
    throw new Vex.RERR("NoNoteForBend", "Can't draw bend without a note or index.");
  }
  var start = this.note.getModifierStartXY(Vex.Flow.Modifier.Position.RIGHT, this.index);
  start.x += 3;
  start.y += 0.5;
  var x_shift = this.x_shift;
  var ctx = this.context;
  var that = this;
  var bend_height = this.note.getStave().getYForTopText(this.text_line) + 3;
  var annotation_y = this.note.getStave().getYForTopText(this.text_line) - 1;
  function renderBend(x, y, width, height) {
    var cp_x = x + width;
    var cp_y = y;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(cp_x, cp_y, x + width, height);
    ctx.stroke()
  }
  function renderRelease(x, y, width, height) {
    ctx.beginPath();
    ctx.moveTo(x, height);
    ctx.quadraticCurveTo(x + width, height, x + width, y);
    ctx.stroke()
  }
  function renderArrowHead(x, y, direction) {
    var width = 3;
    var dir = direction || 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - width, y + width * dir);
    ctx.lineTo(x + width, y + width * dir);
    ctx.closePath();
    ctx.fill()
  }
  function renderText(x, text) {
    ctx.save();
    ctx.font = this.font;
    var render_x = x - ctx.measureText(text).width / 2;
    ctx.fillText(text, render_x, annotation_y);
    ctx.restore()
  }
  var last_bend = null;
  var last_drawn_width = 0;
  for(var i = 0;i < this.phrase.length;++i) {
    var bend = this.phrase[i];
    if(i == 0) {
      bend.draw_width += x_shift
    }
    last_drawn_width = bend.draw_width + (last_bend ? last_bend.draw_width : 0) - (i == 1 ? x_shift : 0);
    if(bend.type == Vex.Flow.Bend.UP) {
      if(last_bend && last_bend.type == Vex.Flow.Bend.UP) {
        renderArrowHead(start.x, bend_height)
      }
      renderBend(start.x, start.y, last_drawn_width, bend_height)
    }
    if(bend.type == Vex.Flow.Bend.DOWN) {
      if(last_bend && last_bend.type == Vex.Flow.Bend.UP) {
        renderRelease(start.x, start.y, last_drawn_width, bend_height)
      }
      if(last_bend && last_bend.type == Vex.Flow.Bend.DOWN) {
        renderArrowHead(start.x, start.y, -1);
        renderRelease(start.x, start.y, last_drawn_width, bend_height)
      }
      if(last_bend == null) {
        last_drawn_width = bend.draw_width;
        renderRelease(start.x, start.y, last_drawn_width, bend_height)
      }
    }
    renderText(start.x + last_drawn_width, bend.text);
    last_bend = bend;
    last_bend.x = start.x;
    start.x += last_drawn_width
  }
  if(last_bend.type == Vex.Flow.Bend.UP) {
    renderArrowHead(last_bend.x + last_drawn_width, bend_height)
  }else {
    if(last_bend.type == Vex.Flow.Bend.DOWN) {
      renderArrowHead(last_bend.x + last_drawn_width, start.y, -1)
    }
  }
};
Vex.Flow.Vibrato = function() {
  this.init()
};
Vex.Flow.Vibrato.prototype = new Vex.Flow.Modifier;
Vex.Flow.Vibrato.prototype.constructor = Vex.Flow.Vibrato;
Vex.Flow.Vibrato.superclass = Vex.Flow.Modifier.prototype;
Vex.Flow.Vibrato.prototype.init = function() {
  var superclass = Vex.Flow.Vibrato.superclass;
  superclass.init.call(this);
  this.harsh = false;
  this.position = Vex.Flow.Modifier.Position.RIGHT;
  this.render_options = {vibrato_width:20, wave_height:6, wave_width:4, wave_girth:2};
  this.setVibratoWidth(this.render_options.vibrato_width)
};
Vex.Flow.Vibrato.prototype.getCategory = function() {
  return"vibratos"
};
Vex.Flow.Vibrato.prototype.setVibratoWidth = function(width) {
  this.vibrato_width = width;
  this.setWidth(this.vibrato_width);
  return this
};
Vex.Flow.Vibrato.prototype.setHarsh = function(harsh) {
  this.harsh = harsh;
  return this
};
Vex.Flow.Vibrato.prototype.draw = function() {
  if(!this.context) {
    throw new Vex.RERR("NoContext", "Can't draw vibrato without a context.");
  }
  if(!this.note) {
    throw new Vex.RERR("NoNoteForVibrato", "Can't draw vibrato without an attached note.");
  }
  var start = this.note.getModifierStartXY(Vex.Flow.Modifier.Position.RIGHT, this.index);
  var ctx = this.context;
  var that = this;
  var vibrato_width = this.vibrato_width;
  function renderVibrato(x, y) {
    var wave_width = that.render_options.wave_width;
    var wave_girth = that.render_options.wave_girth;
    var wave_height = that.render_options.wave_height;
    var num_waves = vibrato_width / wave_width;
    ctx.beginPath();
    if(that.harsh) {
      ctx.moveTo(x, y + wave_girth + 1);
      for(var i = 0;i < num_waves / 2;++i) {
        ctx.lineTo(x + wave_width, y - wave_height / 2);
        x += wave_width;
        ctx.lineTo(x + wave_width, y + wave_height / 2);
        x += wave_width
      }
      for(var i = 0;i < num_waves / 2;++i) {
        ctx.lineTo(x - wave_width, y - wave_height / 2 + wave_girth + 1);
        x -= wave_width;
        ctx.lineTo(x - wave_width, y + wave_height / 2 + wave_girth + 1);
        x -= wave_width
      }
      ctx.fill()
    }else {
      ctx.moveTo(x, y + wave_girth);
      for(var i = 0;i < num_waves / 2;++i) {
        ctx.quadraticCurveTo(x + wave_width / 2, y - wave_height / 2, x + wave_width, y);
        x += wave_width;
        ctx.quadraticCurveTo(x + wave_width / 2, y + wave_height / 2, x + wave_width, y);
        x += wave_width
      }
      for(var i = 0;i < num_waves / 2;++i) {
        ctx.quadraticCurveTo(x - wave_width / 2, y + wave_height / 2 + wave_girth, x - wave_width, y + wave_girth);
        x -= wave_width;
        ctx.quadraticCurveTo(x - wave_width / 2, y - wave_height / 2 + wave_girth, x - wave_width, y + wave_girth);
        x -= wave_width
      }
      ctx.fill()
    }
  }
  var vx = start.x + this.x_shift;
  var vy = this.note.getStave().getYForTopText(this.text_line) + 2;
  renderVibrato(vx, vy)
};
Vex.Flow.Annotation = function(text) {
  if(arguments.length > 0) {
    this.init(text)
  }
};
Vex.Flow.Annotation.prototype = new Vex.Flow.Modifier;
Vex.Flow.Annotation.prototype.constructor = Vex.Flow.Annotation;
Vex.Flow.Annotation.superclass = Vex.Flow.Modifier.prototype;
Vex.Flow.Annotation.Justify = {LEFT:1, CENTER:2, RIGHT:3, CENTER_STEM:4};
Vex.Flow.Annotation.VerticalJustify = {TOP:1, CENTER:2, BOTTOM:3, CENTER_STEM:4};
Vex.Flow.Annotation.prototype.init = function(text) {
  var superclass = Vex.Flow.Annotation.superclass;
  superclass.init.call(this);
  this.note = null;
  this.index = null;
  this.text_line = 0;
  this.text = text;
  this.justification = Vex.Flow.Annotation.Justify.CENTER;
  this.vert_justification = Vex.Flow.Annotation.VerticalJustify.TOP;
  this.font = {family:"Arial", size:10, weight:""};
  this.setWidth(Vex.Flow.textWidth(text))
};
Vex.Flow.Annotation.prototype.getCategory = function() {
  return"annotations"
};
Vex.Flow.Annotation.prototype.setTextLine = function(line) {
  this.text_line = line;
  return this
};
Vex.Flow.Annotation.prototype.setFont = function(family, size, weight) {
  this.font = {family:family, size:size, weight:weight};
  return this
};
Vex.Flow.Annotation.prototype.setBottom = function(bottom) {
  if(bottom) {
    this.vert_justification = Vex.Flow.Annotation.VerticalJustify.BOTTOM
  }else {
    this.vert_justification = Vex.Flow.Annotation.VerticalJustify.TOP
  }
  return this
};
Vex.Flow.Annotation.prototype.setVerticalJustification = function(vert_justification) {
  this.vert_justification = vert_justification;
  return this
};
Vex.Flow.Modifier.prototype.getJustification = function() {
  return this.justification
};
Vex.Flow.Modifier.prototype.setJustification = function(justification) {
  this.justification = justification;
  return this
};
Vex.Flow.Annotation.prototype.draw = function() {
  if(!this.context) {
    throw new Vex.RERR("NoContext", "Can't draw text annotation without a context.");
  }
  if(!this.note) {
    throw new Vex.RERR("NoNoteForAnnotation", "Can't draw text annotation without an attached note.");
  }
  var start = this.note.getModifierStartXY(Vex.Flow.Modifier.Position.ABOVE, this.index);
  this.context.save();
  this.context.setFont(this.font.family, this.font.size, this.font.weight);
  var text_width = this.context.measureText(this.text).width;
  var text_height = this.context.measureText("m").width;
  if(this.justification == Vex.Flow.Annotation.Justify.LEFT) {
    var x = start.x
  }else {
    if(this.justification == Vex.Flow.Annotation.Justify.RIGHT) {
      var x = start.x - text_width
    }else {
      if(this.justification == Vex.Flow.Annotation.Justify.CENTER) {
        var x = start.x - text_width / 2
      }else {
        var x = this.note.getStemX() - text_width / 2
      }
    }
  }
  if(this.note.getStemExtents) {
    var stem_ext = this.note.getStemExtents();
    var spacing = this.note.stave.options.spacing_between_lines_px
  }
  if(this.vert_justification == Vex.Flow.Annotation.VerticalJustify.BOTTOM) {
    var y = this.note.stave.getYForBottomText(this.text_line);
    if(stem_ext) {
      y = Vex.Max(y, stem_ext.baseY + spacing * (this.text_line + 2))
    }
  }else {
    if(this.vert_justification == Vex.Flow.Annotation.VerticalJustify.CENTER) {
      var yt = this.note.getYForTopText(this.text_line) - 1;
      var yb = this.note.stave.getYForBottomText(this.text_line);
      var y = yt + (yb - yt) / 2 + text_height / 2
    }else {
      if(this.vert_justification == Vex.Flow.Annotation.VerticalJustify.TOP) {
        var y = this.note.stave.getYForTopText(this.text_line);
        if(stem_ext) {
          y = Vex.Min(y, stem_ext.topY - 5 - spacing * this.text_line)
        }
      }else {
        var extents = this.note.getStemExtents();
        var y = extents.topY + (extents.baseY - extents.topY) / 2 + text_height / 2
      }
    }
  }
  this.context.fillText(this.text, x, y);
  this.context.restore()
};
Vex.Flow.Articulation = function(type) {
  if(arguments.length > 0) {
    this.init(type)
  }
};
Vex.Flow.Articulation.prototype = new Vex.Flow.Modifier;
Vex.Flow.Articulation.prototype.constructor = Vex.Flow.Articulation;
Vex.Flow.Articulation.superclass = Vex.Flow.Modifier.prototype;
Vex.Flow.Articulation.prototype.init = function(type) {
  var superclass = Vex.Flow.Articulation.superclass;
  superclass.init.call(this);
  this.note = null;
  this.index = null;
  this.type = type;
  this.position = Vex.Flow.Modifier.Position.BELOW;
  this.render_options = {font_scale:38, stroke_px:3, stroke_spacing:10};
  this.articulation = Vex.Flow.articulationCodes(this.type);
  if(!this.articulation) {
    throw new Vex.RERR("InvalidArticulation", "Articulation not found: '" + this.type + "'");
  }
  this.setWidth(this.articulation.width)
};
Vex.Flow.Articulation.prototype.getCategory = function() {
  return"articulations"
};
Vex.Flow.Articulation.prototype.getPosition = function() {
  return this.position
};
Vex.Flow.Articulation.prototype.setPosition = function(position) {
  if(position == Vex.Flow.Modifier.Position.ABOVE || position == Vex.Flow.Modifier.Position.BELOW) {
    this.position = position
  }
  return this
};
Vex.Flow.Articulation.prototype.draw = function() {
  if(!this.context) {
    throw new Vex.RERR("NoContext", "Can't draw Articulation without a context.");
  }
  if(!(this.note && this.index != null)) {
    throw new Vex.RERR("NoAttachedNote", "Can't draw Articulation without a note and index.");
  }
  var stave = this.note.stave;
  var start = this.note.getModifierStartXY(this.position, this.index);
  var glyph_y = start.y;
  var shiftY = 0;
  if(this.note.getStemExtents) {
    var stem_ext = this.note.getStemExtents();
    var spacing = this.note.stave.options.spacing_between_lines_px;
    var top = stem_ext.topY;
    var bottom = stem_ext.baseY + 2;
    if(this.note.stem_direction == Vex.Flow.StaveNote.STEM_DOWN) {
      top = stem_ext.baseY;
      bottom = stem_ext.topY
    }
  }
  if(this.position == Vex.Flow.Modifier.Position.ABOVE) {
    shiftY = this.articulation.shift_up;
    glyph_y = this.note.stave.getYForTopText(this.text_line);
    if(stem_ext) {
      glyph_y = Vex.Min(glyph_y, top - 10 - spacing * this.text_line)
    }
  }else {
    shiftY = this.articulation.shift_down - 10;
    glyph_y = this.note.stave.getYForBottomText(this.text_line);
    if(stem_ext) {
      glyph_y = Vex.Max(glyph_y, bottom + spacing * (this.text_line + 2))
    }
  }
  var glyph_x = start.x + this.articulation.shift_right;
  glyph_y += shiftY + this.y_shift;
  Vex.Flow.renderGlyph(this.context, glyph_x, glyph_y, this.render_options.font_scale, this.articulation.code)
};
Vex.Flow.Tuning = function(tuningString) {
  this.init(tuningString)
};
Vex.Flow.Tuning.names = {"standard":"E/5,B/4,G/4,D/4,A/3,E/3", "dagdad":"D/5,A/4,G/4,D/4,A/3,D/3", "dropd":"E/5,B/4,G/4,D/4,A/3,D/3", "eb":"Eb/5,Bb/4,Gb/4,Db/4,Ab/3,Db/3"};
Vex.Flow.Tuning.prototype.init = function(tuningString) {
  this.setTuning(tuningString || "E/5,B/4,G/4,D/4,A/3,E/3")
};
Vex.Flow.Tuning.prototype.noteToInteger = function(noteString) {
  return Vex.Flow.keyProperties(noteString).int_value
};
Vex.Flow.Tuning.prototype.setTuning = function(noteString) {
  if(Vex.Flow.Tuning.names[noteString]) {
    noteString = Vex.Flow.Tuning.names[noteString]
  }
  this.tuningString = noteString;
  this.tuningValues = [];
  this.numStrings = 0;
  var keys = noteString.split(/\s*,\s*/);
  if(keys.length == 0) {
    throw new Vex.RERR("BadArguments", "Invalid tuning string: " + noteString);
  }
  this.numStrings = keys.length;
  for(var i = 0;i < this.numStrings;++i) {
    this.tuningValues[i] = this.noteToInteger(keys[i])
  }
};
Vex.Flow.Tuning.prototype.getValueForString = function(stringNum) {
  var s = parseInt(stringNum);
  if(s < 1 || s > this.numStrings) {
    throw new Vex.RERR("BadArguments", "String number must be between 1 and " + this.numStrings + ": " + stringNum);
  }
  return this.tuningValues[s - 1]
};
Vex.Flow.Tuning.prototype.getValueForFret = function(fretNum, stringNum) {
  var stringValue = this.getValueForString(stringNum);
  var f = parseInt(fretNum);
  if(f < 0) {
    throw new Vex.RERR("BadArguments", "Fret number must be 0 or higher: " + fretNum);
  }
  return stringValue + f
};
Vex.Flow.Tuning.prototype.getNoteForFret = function(fretNum, stringNum) {
  var noteValue = this.getValueForFret(fretNum, stringNum);
  var octave = Math.floor(noteValue / 12);
  var value = noteValue % 12;
  return Vex.Flow.integerToNote(value) + "/" + octave
};
Vex.Flow.StaveModifier = function() {
  this.init()
};
Vex.Flow.StaveModifier.prototype.init = function() {
  this.padding = 10
};
Vex.Flow.StaveModifier.prototype.getCategory = function() {
  return""
};
Vex.Flow.StaveModifier.prototype.makeSpacer = function(padding) {
  return{getContext:function() {
    return true
  }, setStave:function() {
  }, renderToStave:function() {
  }, getMetrics:function() {
    return{width:padding}
  }}
};
Vex.Flow.StaveModifier.prototype.placeGlyphOnLine = function(glyph, stave, line) {
  glyph.setYShift(stave.getYForLine(line) - stave.getYForGlyphs())
};
Vex.Flow.StaveModifier.prototype.setPadding = function(padding) {
  this.padding = padding
};
Vex.Flow.StaveModifier.prototype.addToStave = function(stave, firstGlyph) {
  if(!firstGlyph) {
    stave.addGlyph(this.makeSpacer(this.padding))
  }
  this.addModifier(stave);
  return this
};
Vex.Flow.StaveModifier.prototype.addModifier = function() {
  throw new Vex.RERR("MethodNotImplemented", "addModifier() not implemented for this stave modifier.");
};
Vex.Flow.KeySignature = function(keySpec) {
  if(arguments.length > 0) {
    this.init(keySpec)
  }
};
Vex.Flow.KeySignature.prototype = new Vex.Flow.StaveModifier;
Vex.Flow.KeySignature.prototype.constructor = Vex.Flow.KeySignature;
Vex.Flow.KeySignature.superclass = Vex.Flow.StaveModifier.prototype;
Vex.Flow.KeySignature.prototype.init = function(key_spec) {
  Vex.Flow.KeySignature.superclass.init();
  this.glyphFontScale = 38;
  this.accList = Vex.Flow.keySignature(key_spec)
};
Vex.Flow.KeySignature.prototype.addAccToStave = function(stave, acc) {
  var glyph = new Vex.Flow.Glyph(acc.glyphCode, this.glyphFontScale);
  this.placeGlyphOnLine(glyph, stave, acc.line);
  stave.addGlyph(glyph)
};
Vex.Flow.KeySignature.prototype.addModifier = function(stave) {
  this.convertAccLines(stave.clef, this.accList[0].glyphCode);
  for(var i = 0;i < this.accList.length;++i) {
    this.addAccToStave(stave, this.accList[i])
  }
};
Vex.Flow.KeySignature.prototype.addToStave = function(stave, firstGlyph) {
  if(this.accList.length == 0) {
    return this
  }
  if(!firstGlyph) {
    stave.addGlyph(this.makeSpacer(this.padding))
  }
  this.addModifier(stave);
  return this
};
Vex.Flow.KeySignature.prototype.convertAccLines = function(clef, code) {
  var offset = 0;
  var tenorSharps;
  var isTenorSharps = clef === "tenor" && code === "v18" ? true : false;
  switch(clef) {
    case "bass":
      offset = 1;
      break;
    case "alto":
      offset = 0.5;
      break;
    case "tenor":
      if(!isTenorSharps) {
        offset = -0.5
      }
      break
  }
  if(isTenorSharps) {
    tenorSharps = [3, 1, 2.5, 0.5, 2, 0, 1.5];
    for(var i = 0;i < this.accList.length;++i) {
      this.accList[i].line = tenorSharps[i]
    }
  }else {
    if(clef != "treble") {
      for(var i = 0;i < this.accList.length;++i) {
        this.accList[i].line += offset
      }
    }
  }
};
Vex.Flow.TimeSignature = function(timeSpec) {
  if(arguments.length > 0) {
    this.init(timeSpec)
  }
};
Vex.Flow.TimeSignature.glyphs = {"C":{code:"v41", point:40, line:2}, "C|":{code:"vb6", point:40, line:2}};
Vex.Flow.TimeSignature.prototype = new Vex.Flow.StaveModifier;
Vex.Flow.TimeSignature.prototype.constructor = Vex.Flow.TimeSignature;
Vex.Flow.TimeSignature.superclass = Vex.Flow.StaveModifier.prototype;
Vex.Flow.TimeSignature.prototype.init = function(timeSpec) {
  Vex.Flow.TimeSignature.superclass.init();
  this.setPadding(15);
  this.point = 40;
  this.topLine = 2;
  this.bottomLine = 4;
  this.timeSig = this.parseTimeSpec(timeSpec)
};
Vex.Flow.TimeSignature.prototype.parseTimeSpec = function(timeSpec) {
  if(timeSpec == "C" || timeSpec == "C|") {
    var glyphInfo = Vex.Flow.TimeSignature.glyphs[timeSpec];
    return{num:false, line:glyphInfo.line, glyph:new Vex.Flow.Glyph(glyphInfo.code, glyphInfo.point)}
  }
  var topNums = new Array;
  var i = 0;
  for(;i < timeSpec.length;++i) {
    var c = timeSpec.charAt(i);
    if(c == "/") {
      break
    }else {
      if(/[0-9]/.test(c)) {
        topNums.push(c)
      }else {
        throw new Vex.RERR("BadTimeSignature", "Invalid time spec: " + timeSpec);
      }
    }
  }
  if(i == 0) {
    throw new Vex.RERR("BadTimeSignature", "Invalid time spec: " + timeSpec);
  }
  ++i;
  if(i == timeSpec.length) {
    throw new Vex.RERR("BadTimeSignature", "Invalid time spec: " + timeSpec);
  }
  var botNums = new Array;
  for(;i < timeSpec.length;++i) {
    var c = timeSpec.charAt(i);
    if(/[0-9]/.test(c)) {
      botNums.push(c)
    }else {
      throw new Vex.RERR("BadTimeSignature", "Invalid time spec: " + timeSpec);
    }
  }
  return{num:true, glyph:this.makeTimeSignatureGlyph(topNums, botNums)}
};
Vex.Flow.TimeSignature.prototype.makeTimeSignatureGlyph = function(topNums, botNums) {
  var glyph = new Vex.Flow.Glyph("v0", this.point);
  glyph["topGlyphs"] = [];
  glyph["botGlyphs"] = [];
  var topWidth = 0;
  for(var i = 0;i < topNums.length;++i) {
    var num = topNums[i];
    var topGlyph = new Vex.Flow.Glyph("v" + num, this.point);
    glyph.topGlyphs.push(topGlyph);
    topWidth += topGlyph.getMetrics().width
  }
  var botWidth = 0;
  for(var i = 0;i < botNums.length;++i) {
    var num = botNums[i];
    var botGlyph = new Vex.Flow.Glyph("v" + num, this.point);
    glyph.botGlyphs.push(botGlyph);
    botWidth += botGlyph.getMetrics().width
  }
  var width = topWidth > botWidth ? topWidth : botWidth;
  var xMin = glyph.getMetrics().x_min;
  glyph.getMetrics = function() {
    return{x_min:xMin, x_max:xMin + width, width:width}
  };
  var topStartX = (width - topWidth) / 2;
  var botStartX = (width - botWidth) / 2;
  var that = this;
  glyph.renderToStave = function(x) {
    var start_x = x + topStartX;
    for(var i = 0;i < this.topGlyphs.length;++i) {
      var g = this.topGlyphs[i];
      Vex.Flow.Glyph.renderOutline(this.context, g.metrics.outline, g.scale, start_x + g.x_shift, this.stave.getYForLine(that.topLine));
      start_x += g.getMetrics().width
    }
    start_x = x + botStartX;
    for(var i = 0;i < this.botGlyphs.length;++i) {
      var g = this.botGlyphs[i];
      that.placeGlyphOnLine(g, this.stave, g.line);
      Vex.Flow.Glyph.renderOutline(this.context, g.metrics.outline, g.scale, start_x + g.x_shift, this.stave.getYForLine(that.bottomLine));
      start_x += g.getMetrics().width
    }
  };
  return glyph
};
Vex.Flow.TimeSignature.prototype.addModifier = function(stave) {
  if(!this.timeSig.num) {
    this.placeGlyphOnLine(this.timeSig.glyph, stave, this.timeSig.line)
  }
  stave.addGlyph(this.timeSig.glyph)
};
Vex.Flow.Clef = function(clef) {
  if(arguments.length > 0) {
    this.init(clef)
  }
};
Vex.Flow.Clef.types = {"treble":{code:"v83", point:40, line:3}, "bass":{code:"v79", point:40, line:1}, "alto":{code:"vad", point:40, line:2}, "tenor":{code:"vad", point:40, line:1}, "percussion":{code:"v59", point:40, line:2}};
Vex.Flow.Clef.prototype = new Vex.Flow.StaveModifier;
Vex.Flow.Clef.prototype.constructor = Vex.Flow.Clef;
Vex.Flow.Clef.superclass = Vex.Flow.StaveModifier.prototype;
Vex.Flow.Clef.prototype.init = function(clef) {
  var superclass = Vex.Flow.Clef.superclass;
  superclass.init.call(this);
  this.clef = Vex.Flow.Clef.types[clef]
};
Vex.Flow.Clef.prototype.addModifier = function(stave) {
  var glyph = new Vex.Flow.Glyph(this.clef.code, this.clef.point);
  this.placeGlyphOnLine(glyph, stave, this.clef.line);
  stave.addGlyph(glyph)
};
Vex.Flow.Music = function() {
  this.init()
};
Vex.Flow.Music.NUM_TONES = 12;
Vex.Flow.Music.roots = ["c", "d", "e", "f", "g", "a", "b"];
Vex.Flow.Music.root_values = [0, 2, 4, 5, 7, 9, 11];
Vex.Flow.Music.root_indices = {"c":0, "d":1, "e":2, "f":3, "g":4, "a":5, "b":6};
Vex.Flow.Music.canonical_notes = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
Vex.Flow.Music.diatonic_intervals = ["unison", "m2", "M2", "m3", "M3", "p4", "dim5", "p5", "m6", "M6", "b7", "M7", "octave"];
Vex.Flow.Music.diatonic_accidentals = {"unison":{note:0, accidental:0}, "m2":{note:1, accidental:-1}, "M2":{note:1, accidental:0}, "m3":{note:2, accidental:-1}, "M3":{note:2, accidental:0}, "p4":{note:3, accidental:0}, "dim5":{note:4, accidental:-1}, "p5":{note:4, accidental:0}, "m6":{note:5, accidental:-1}, "M6":{note:5, accidental:0}, "b7":{note:6, accidental:-1}, "M7":{note:6, accidental:0}, "octave":{note:7, accidental:0}};
Vex.Flow.Music.intervals = {"u":0, "unison":0, "m2":1, "b2":1, "min2":1, "S":1, "H":1, 2:2, "M2":2, "maj2":2, "T":2, "W":2, "m3":3, "b3":3, "min3":3, "M3":4, 3:4, "maj3":4, 4:5, "p4":5, "#4":6, "b5":6, "aug4":6, "dim5":6, 5:7, "p5":7, "#5":8, "b6":8, "aug5":8, 6:9, "M6":9, "maj6":9, "b7":10, "m7":10, "min7":10, "dom7":10, "M7":11, "maj7":11, 8:12, "octave":12};
Vex.Flow.Music.scales = {major:[2, 2, 1, 2, 2, 2, 1], dorian:[2, 1, 2, 2, 2, 1, 2], mixolydian:[2, 2, 1, 2, 2, 1, 2], minor:[2, 1, 2, 2, 1, 2, 2]};
Vex.Flow.Music.accidentals = ["bb", "b", "n", "#", "##"];
Vex.Flow.Music.noteValues = {"c":{root_index:0, int_val:0}, "cn":{root_index:0, int_val:0}, "c#":{root_index:0, int_val:1}, "c##":{root_index:0, int_val:2}, "cb":{root_index:0, int_val:11}, "cbb":{root_index:0, int_val:10}, "d":{root_index:1, int_val:2}, "dn":{root_index:1, int_val:2}, "d#":{root_index:1, int_val:3}, "d##":{root_index:1, int_val:4}, "db":{root_index:1, int_val:1}, "dbb":{root_index:1, int_val:0}, "e":{root_index:2, int_val:4}, "en":{root_index:2, int_val:4}, "e#":{root_index:2, int_val:5}, 
"e##":{root_index:2, int_val:6}, "eb":{root_index:2, int_val:3}, "ebb":{root_index:2, int_val:2}, "f":{root_index:3, int_val:5}, "fn":{root_index:3, int_val:5}, "f#":{root_index:3, int_val:6}, "f##":{root_index:3, int_val:7}, "fb":{root_index:3, int_val:4}, "fbb":{root_index:3, int_val:3}, "g":{root_index:4, int_val:7}, "gn":{root_index:4, int_val:7}, "g#":{root_index:4, int_val:8}, "g##":{root_index:4, int_val:9}, "gb":{root_index:4, int_val:6}, "gbb":{root_index:4, int_val:5}, "a":{root_index:5, 
int_val:9}, "an":{root_index:5, int_val:9}, "a#":{root_index:5, int_val:10}, "a##":{root_index:5, int_val:11}, "ab":{root_index:5, int_val:8}, "abb":{root_index:5, int_val:7}, "b":{root_index:6, int_val:11}, "bn":{root_index:6, int_val:11}, "b#":{root_index:6, int_val:0}, "b##":{root_index:6, int_val:1}, "bb":{root_index:6, int_val:10}, "bbb":{root_index:6, int_val:9}};
Vex.Flow.Music.prototype.init = function() {
};
Vex.Flow.Music.prototype.isValidNoteValue = function(note) {
  if(note == null || note < 0 || note >= Vex.Flow.Music.NUM_TONES) {
    return false
  }
  return true
};
Vex.Flow.Music.prototype.isValidIntervalValue = function(interval) {
  return this.isValidNoteValue(interval)
};
Vex.Flow.Music.prototype.getNoteParts = function(noteString) {
  if(!noteString || noteString.length < 1) {
    throw new Vex.RERR("BadArguments", "Invalid note name: " + noteString);
  }
  if(noteString.length > 3) {
    throw new Vex.RERR("BadArguments", "Invalid note name: " + noteString);
  }
  var note = noteString.toLowerCase();
  var regex = /^([cdefgab])(b|bb|n|#|##)?$/;
  var match = regex.exec(note);
  if(match != null) {
    var root = match[1];
    var accidental = match[2];
    return{"root":root, "accidental":accidental}
  }else {
    throw new Vex.RERR("BadArguments", "Invalid note name: " + noteString);
  }
};
Vex.Flow.Music.prototype.getKeyParts = function(keyString) {
  if(!keyString || keyString.length < 1) {
    throw new Vex.RERR("BadArguments", "Invalid key: " + keyString);
  }
  var key = keyString.toLowerCase();
  var regex = /^([cdefgab])(b|#)?(mel|harm|m|M)?$/;
  var match = regex.exec(key);
  if(match != null) {
    var root = match[1];
    var accidental = match[2];
    var type = match[3];
    if(!type) {
      type = "M"
    }
    return{"root":root, "accidental":accidental, "type":type}
  }else {
    throw new Vex.RERR("BadArguments", "Invalid key: " + keyString);
  }
};
Vex.Flow.Music.prototype.getNoteValue = function(noteString) {
  var value = Vex.Flow.Music.noteValues[noteString];
  if(value == null) {
    throw new Vex.RERR("BadArguments", "Invalid note name: " + noteString);
  }
  return value.int_val
};
Vex.Flow.Music.prototype.getIntervalValue = function(intervalString) {
  var value = Vex.Flow.Music.intervals[intervalString];
  if(value == null) {
    throw new Vex.RERR("BadArguments", "Invalid interval name: " + intervalString);
  }
  return value
};
Vex.Flow.Music.prototype.getCanonicalNoteName = function(noteValue) {
  if(!this.isValidNoteValue(noteValue)) {
    throw new Vex.RERR("BadArguments", "Invalid note value: " + noteValue);
  }
  return Vex.Flow.Music.canonical_notes[noteValue]
};
Vex.Flow.Music.prototype.getCanonicalIntervalName = function(intervalValue) {
  if(!this.isValidIntervalValue(intervalValue)) {
    throw new Vex.RERR("BadArguments", "Invalid interval value: " + intervalValue);
  }
  return Vex.Flow.Music.diatonic_intervals[intervalValue]
};
Vex.Flow.Music.prototype.getRelativeNoteValue = function(noteValue, intervalValue, direction) {
  if(direction == null) {
    direction = 1
  }
  if(direction != 1 && direction != -1) {
    throw new Vex.RERR("BadArguments", "Invalid direction: " + direction);
  }
  var sum = (noteValue + direction * intervalValue) % Vex.Flow.Music.NUM_TONES;
  if(sum < 0) {
    sum += Vex.Flow.Music.NUM_TONES
  }
  return sum
};
Vex.Flow.Music.prototype.getRelativeNoteName = function(root, noteValue) {
  var parts = this.getNoteParts(root);
  var rootValue = this.getNoteValue(parts.root);
  var interval = noteValue - rootValue;
  if(Math.abs(interval) > Vex.Flow.Music.NUM_TONES - 3) {
    var multiplier = 1;
    if(interval > 0) {
      multiplier = -1
    }
    var reverse_interval = (noteValue + 1 + (rootValue + 1)) % Vex.Flow.Music.NUM_TONES * multiplier;
    if(Math.abs(reverse_interval) > 2) {
      throw new Vex.RERR("BadArguments", "Notes not related: " + root + ", " + noteValue);
    }else {
      interval = reverse_interval
    }
  }
  if(Math.abs(interval) > 2) {
    throw new Vex.RERR("BadArguments", "Notes not related: " + root + ", " + noteValue);
  }
  var relativeNoteName = parts.root;
  if(interval > 0) {
    for(var i = 1;i <= interval;++i) {
      relativeNoteName += "#"
    }
  }else {
    if(interval < 0) {
      for(var i = -1;i >= interval;--i) {
        relativeNoteName += "b"
      }
    }
  }
  return relativeNoteName
};
Vex.Flow.Music.prototype.getScaleTones = function(key, intervals) {
  var tones = [];
  tones.push(key);
  var nextNote = key;
  for(var i = 0;i < intervals.length;++i) {
    nextNote = this.getRelativeNoteValue(nextNote, intervals[i]);
    if(nextNote != key) {
      tones.push(nextNote)
    }
  }
  return tones
};
Vex.Flow.Music.prototype.getIntervalBetween = function(note1, note2, direction) {
  if(direction == null) {
    direction = 1
  }
  if(direction != 1 && direction != -1) {
    throw new Vex.RERR("BadArguments", "Invalid direction: " + direction);
  }
  if(!this.isValidNoteValue(note1) || !this.isValidNoteValue(note2)) {
    throw new Vex.RERR("BadArguments", "Invalid notes: " + note1 + ", " + note2);
  }
  if(direction == 1) {
    var difference = note2 - note1
  }else {
    var difference = note1 - note2
  }
  if(difference < 0) {
    difference += Vex.Flow.Music.NUM_TONES
  }
  return difference
};
Vex.Flow.KeyManager = function(key) {
  this.init(key)
};
Vex.Flow.KeyManager.scales = {"M":Vex.Flow.Music.scales.major, "m":Vex.Flow.Music.scales.minor};
Vex.Flow.KeyManager.prototype.init = function(key) {
  this.music = new Vex.Flow.Music;
  this.setKey(key)
};
Vex.Flow.KeyManager.prototype.setKey = function(key) {
  this.key = key;
  this.reset();
  return this
};
Vex.Flow.KeyManager.prototype.getKey = function() {
  return this.key
};
Vex.Flow.KeyManager.prototype.reset = function() {
  this.keyParts = this.music.getKeyParts(this.key);
  this.keyString = this.keyParts.root;
  if(this.keyParts.accidental) {
    this.keyString += this.keyParts.accidental
  }
  var is_supported_type = Vex.Flow.KeyManager.scales[this.keyParts.type];
  if(!is_supported_type) {
    throw new Vex.RERR("BadArguments", "Unsupported key type: " + this.key);
  }
  this.scale = this.music.getScaleTones(this.music.getNoteValue(this.keyString), Vex.Flow.KeyManager.scales[this.keyParts.type]);
  this.scaleMap = {};
  this.scaleMapByValue = {};
  this.originalScaleMapByValue = {};
  var noteLocation = Vex.Flow.Music.root_indices[this.keyParts.root];
  for(var i = 0;i < Vex.Flow.Music.roots.length;++i) {
    var index = (noteLocation + i) % Vex.Flow.Music.roots.length;
    var rootName = Vex.Flow.Music.roots[index];
    var noteName = this.music.getRelativeNoteName(rootName, this.scale[i]);
    this.scaleMap[rootName] = noteName;
    this.scaleMapByValue[this.scale[i]] = noteName;
    this.originalScaleMapByValue[this.scale[i]] = noteName
  }
  return this
};
Vex.Flow.KeyManager.prototype.getAccidental = function(key) {
  var root = this.music.getKeyParts(key).root;
  var parts = this.music.getNoteParts(this.scaleMap[root]);
  return{note:this.scaleMap[root], accidental:parts.accidental}
};
Vex.Flow.KeyManager.prototype.selectNote = function(note) {
  note = note.toLowerCase();
  var parts = this.music.getNoteParts(note);
  var scaleNote = this.scaleMap[parts.root];
  var modparts = this.music.getNoteParts(scaleNote);
  if(scaleNote == note) {
    return{"note":scaleNote, "accidental":parts.accidental, "change":false}
  }
  var valueNote = this.scaleMapByValue[this.music.getNoteValue(note)];
  if(valueNote != null) {
    return{"note":valueNote, "accidental":this.music.getNoteParts(valueNote).accidental, "change":false}
  }
  var originalValueNote = this.originalScaleMapByValue[this.music.getNoteValue(note)];
  if(originalValueNote != null) {
    this.scaleMap[modparts.root] = originalValueNote;
    delete this.scaleMapByValue[this.music.getNoteValue(scaleNote)];
    this.scaleMapByValue[this.music.getNoteValue(note)] = originalValueNote;
    return{"note":originalValueNote, "accidental":this.music.getNoteParts(originalValueNote).accidental, "change":true}
  }
  if(modparts.root == note) {
    delete this.scaleMapByValue[this.music.getNoteValue(this.scaleMap[parts.root])];
    this.scaleMapByValue[this.music.getNoteValue(modparts.root)] = modparts.root;
    this.scaleMap[modparts.root] = modparts.root;
    return{"note":modparts.root, "accidental":null, "change":true}
  }
  delete this.scaleMapByValue[this.music.getNoteValue(this.scaleMap[parts.root])];
  this.scaleMapByValue[this.music.getNoteValue(note)] = note;
  delete this.scaleMap[modparts.root];
  this.scaleMap[modparts.root] = note;
  return{"note":note, "accidental":parts.accidental, "change":true}
};
Vex.Flow.Renderer = function(sel, backend) {
  if(arguments.length > 0) {
    this.init(sel, backend)
  }
};
Vex.Flow.Renderer.Backends = {CANVAS:1, RAPHAEL:2, SVG:3, VML:4};
Vex.Flow.Renderer.LineEndType = {NONE:1, UP:2, DOWN:3};
Vex.Flow.Renderer.buildContext = function(sel, backend, width, height, background) {
  var renderer = new Vex.Flow.Renderer(sel, backend);
  if(width && height) {
    renderer.resize(width, height)
  }
  if(!background) {
    background = "#eed"
  }
  var ctx = renderer.getContext();
  ctx.setBackgroundFillStyle(background);
  return ctx
};
Vex.Flow.Renderer.getCanvasContext = function(sel, width, height, background) {
  return Vex.Flow.Renderer.buildContext(sel, Vex.Flow.Renderer.Backends.CANVAS, width, height, background)
};
Vex.Flow.Renderer.getRaphaelContext = function(sel, width, height, background) {
  return Vex.Flow.Renderer.buildContext(sel, Vex.Flow.Renderer.Backends.RAPHAEL, width, height, background)
};
Vex.Flow.Renderer.bolsterCanvasContext = function(ctx) {
  ctx.clear = function() {
    ctx.clearRect(0, 0, 2E3, 2E3)
  };
  ctx.setFont = function(family, size, weight) {
    this.font = (weight || "") + " " + size + "pt " + family;
    return this
  };
  ctx.setFillStyle = function(style) {
    this.fillStyle = style;
    return this
  };
  ctx.setBackgroundFillStyle = function(style) {
    this.background_fillStyle = style;
    return this
  };
  ctx.setStrokeStyle = function(style) {
    this.strokeStyle = style;
    return this
  };
  return ctx
};
Vex.Flow.Renderer.prototype.init = function(sel, backend) {
  this.sel = sel;
  if(!this.sel) {
    throw new Vex.RERR("BadArgument", "Invalid selector for renderer.");
  }
  this.element = Vex.document.getElementById(sel);
  if(!this.element) {
    this.element = sel
  }
  this.ctx = null;
  this.paper = null;
  this.backend = backend;
  if(this.backend == Vex.Flow.Renderer.Backends.CANVAS) {
    if(!this.element.getContext) {
      throw new Vex.RERR("BadElement", "Can't get canvas context from element: " + sel);
    }
    this.ctx = Vex.Flow.Renderer.bolsterCanvasContext(this.element.getContext("2d"))
  }else {
    if(this.backend == Vex.Flow.Renderer.Backends.RAPHAEL) {
      this.ctx = new Vex.Flow.RaphaelContext(this.element)
    }else {
      throw new Vex.RERR("InvalidBackend", "No support for backend: " + this.backend);
    }
  }
};
Vex.Flow.Renderer.prototype.resize = function(width, height) {
  if(this.backend == Vex.Flow.Renderer.Backends.CANVAS) {
    if(!this.element.getContext) {
      throw new Vex.RERR("BadElement", "Can't get canvas context from element: " + sel);
    }
    this.element.width = width;
    this.element.height = height;
    this.ctx = Vex.Flow.Renderer.bolsterCanvasContext(this.element.getContext("2d"))
  }else {
    this.ctx.resize(width, height)
  }
  return this
};
Vex.Flow.Renderer.prototype.getContext = function() {
  return this.ctx
};
Vex.Flow.Renderer.drawDashedLine = function(context, fromX, fromY, toX, toY, dashPattern) {
  context.beginPath();
  var dx = toX - fromX;
  var dy = toY - fromY;
  var angle = Math.atan2(dy, dx);
  var x = fromX;
  var y = fromY;
  context.moveTo(fromX, fromY);
  var idx = 0;
  var draw = true;
  while(!((dx < 0 ? x <= toX : x >= toX) && (dy < 0 ? y <= toY : y >= toY))) {
    var dashLength = dashPattern[idx++ % dashPattern.length];
    var nx = x + Math.cos(angle) * dashLength;
    x = dx < 0 ? Math.max(toX, nx) : Math.min(toX, nx);
    var ny = y + Math.sin(angle) * dashLength;
    y = dy < 0 ? Math.max(toY, ny) : Math.min(toY, ny);
    if(draw) {
      context.lineTo(x, y)
    }else {
      context.moveTo(x, y)
    }
    draw = !draw
  }
  context.closePath();
  context.stroke()
};
Vex.Flow.RaphaelContext = function(element) {
  if(arguments.length > 0) {
    this.init(element)
  }
};
Vex.Flow.RaphaelContext.prototype.init = function(element) {
  this.element = element;
  this.paper = Raphael(element);
  this.path = "";
  this.pen = {x:0, y:0};
  this.lineWidth = 1;
  this.state = {scale:{x:1, y:1}, font_family:"Arial", font_size:8, font_weight:800};
  this.attributes = {"stroke-width":0.3, "fill":"black", "stroke":"black", "font":"10pt Arial"};
  this.background_attributes = {"stroke-width":0, "fill":"white", "stroke":"white", "font":"10pt Arial"};
  this.state_stack = []
};
Vex.Flow.RaphaelContext.prototype.setFont = function(family, size, weight) {
  this.state.font_family = family;
  this.state.font_size = size;
  this.state.font_weight = weight;
  this.attributes.font = (this.state.font_weight || "") + " " + this.state.font_size * this.state.scale.x + "pt " + this.state.font_family;
  return this
};
Vex.Flow.RaphaelContext.prototype.setFillStyle = function(style) {
  this.attributes.fill = style;
  return this
};
Vex.Flow.RaphaelContext.prototype.setBackgroundFillStyle = function(style) {
  this.background_attributes.fill = style;
  this.background_attributes.stroke = style;
  return this
};
Vex.Flow.RaphaelContext.prototype.setStrokeStyle = function(style) {
  this.attributes.stroke = style;
  return this
};
Vex.Flow.RaphaelContext.prototype.scale = function(x, y) {
  this.state.scale = {x:x, y:y};
  this.attributes.scale = x + "," + y + ",0,0";
  this.attributes.font = this.state.font_size * this.state.scale.x + "pt " + this.state.font_family;
  this.background_attributes.scale = x + "," + y + ",0,0";
  this.background_attributes.font = this.state.font_size * this.state.scale.x + "pt " + this.state.font_family;
  return this
};
Vex.Flow.RaphaelContext.prototype.clear = function() {
  this.paper.clear()
};
Vex.Flow.RaphaelContext.prototype.resize = function(width, height) {
  this.element.style.width = width;
  this.paper.setSize(width, height);
  return this
};
Vex.Flow.RaphaelContext.prototype.rect = function(x, y, width, height) {
  if(height < 0) {
    y += height;
    height = -height
  }
  var r = this.paper.rect(x, y, width - 0.5, height - 0.5).attr(this.attributes).attr("fill", "none").attr("stroke-width", this.lineWidth);
  return this
};
Vex.Flow.RaphaelContext.prototype.fillRect = function(x, y, width, height) {
  if(height < 0) {
    y += height;
    height = -height
  }
  var r = this.paper.rect(x, y, width - 0.5, height - 0.5).attr(this.attributes);
  return this
};
Vex.Flow.RaphaelContext.prototype.clearRect = function(x, y, width, height) {
  if(height < 0) {
    y += height;
    height = -height
  }
  var r = this.paper.rect(x, y, width - 0.5, height - 0.5).attr(this.background_attributes);
  return this
};
Vex.Flow.RaphaelContext.prototype.beginPath = function() {
  this.path = "";
  this.pen.x = 0;
  this.pen.y = 0;
  return this
};
Vex.Flow.RaphaelContext.prototype.moveTo = function(x, y) {
  this.path += "M" + x + "," + y;
  this.pen.x = x;
  this.pen.y = y;
  return this
};
Vex.Flow.RaphaelContext.prototype.lineTo = function(x, y) {
  this.path += "L" + x + "," + y;
  this.pen.x = x;
  this.pen.y = y;
  return this
};
Vex.Flow.RaphaelContext.prototype.bezierCurveTo = function(x1, y1, x2, y2, x, y) {
  this.path += "C" + x1 + "," + y1 + "," + x2 + "," + y2 + "," + x + "," + y;
  this.pen.x = x;
  this.pen.y = y;
  return this
};
Vex.Flow.RaphaelContext.prototype.quadraticCurveTo = function(x1, y1, x, y) {
  this.path += "Q" + x1 + "," + y1 + "," + x + "," + y;
  this.pen.x = x;
  this.pen.y = y;
  return this
};
Vex.Flow.RaphaelContext.prototype.arc = function(x, y, radius, startAngle, endAngle, antiClockwise) {
  function normalizeAngle(angle) {
    while(angle < 0) {
      angle += Math.PI * 2
    }
    while(angle > Math.PI * 2) {
      angle -= Math.PI * 2
    }
    return angle
  }
  startAngle = normalizeAngle(startAngle);
  endAngle = normalizeAngle(endAngle);
  if(startAngle > endAngle) {
    var tmp = startAngle;
    startAngle = endAngle;
    endAngle = tmp;
    antiClockwise = !antiClockwise
  }
  var delta = endAngle - startAngle;
  if(delta > Math.PI) {
    this.arcHelper(x, y, radius, startAngle, startAngle + delta / 2, antiClockwise);
    this.arcHelper(x, y, radius, startAngle + delta / 2, endAngle, antiClockwise)
  }else {
    this.arcHelper(x, y, radius, startAngle, endAngle, antiClockwise)
  }
  return this
};
Vex.Flow.RaphaelContext.prototype.arcHelper = function(x, y, radius, startAngle, endAngle, antiClockwise) {
  Vex.Assert(endAngle > startAngle, "end angle " + endAngle + " less than or equal to start angle " + startAngle);
  Vex.Assert(startAngle >= 0 && startAngle <= Math.PI * 2);
  Vex.Assert(endAngle >= 0 && endAngle <= Math.PI * 2);
  var x1 = x + radius * Math.cos(startAngle);
  var y1 = y + radius * Math.sin(startAngle);
  var x2 = x + radius * Math.cos(endAngle);
  var y2 = y + radius * Math.sin(endAngle);
  var largeArcFlag = 0;
  var sweepFlag = 0;
  if(antiClockwise) {
    sweepFlag = 1;
    if(endAngle - startAngle < Math.PI) {
      largeArcFlag = 1
    }
  }else {
    if(endAngle - startAngle > Math.PI) {
      largeArcFlag = 1
    }
  }
  this.path += "M" + x1 + "," + y1 + "," + "A" + +radius + "," + radius + "," + "0," + largeArcFlag + "," + sweepFlag + "," + x2 + "," + y2 + "M" + this.pen.x + "," + this.pen.y
};
Vex.Flow.RaphaelContext.prototype.fill = function() {
  this.paper.path(this.path).attr(this.attributes).attr("stroke-width", 0);
  return this
};
Vex.Flow.RaphaelContext.prototype.stroke = function() {
  this.paper.path(this.path).attr(this.attributes).attr("fill", "none").attr("stroke-width", this.lineWidth);
  return this
};
Vex.Flow.RaphaelContext.prototype.closePath = function() {
  this.path += "Z";
  return this
};
Vex.Flow.RaphaelContext.prototype.measureText = function(text) {
  var txt = this.paper.text(0, 0, text).attr(this.attributes).attr("fill", "none").attr("stroke", "none");
  return{width:txt.getBBox().width, height:txt.getBBox().height}
};
Vex.Flow.RaphaelContext.prototype.fillText = function(text, x, y) {
  this.paper.text(x + this.measureText(text).width / 2, y - this.state.font_size / (2.25 * this.state.scale.y), text).attr(this.attributes);
  return this
};
Vex.Flow.RaphaelContext.prototype.save = function() {
  this.state_stack.push({state:{font_family:this.state.font_family}, attributes:{font:this.attributes.font}});
  return this
};
Vex.Flow.RaphaelContext.prototype.restore = function() {
  var state = this.state_stack.pop();
  this.state.font_family = state.state.font_family;
  this.attributes.font = state.attributes.font;
  return this
};
Vex.Flow.Barline = function(type, x) {
  if(arguments.length > 0) {
    this.init(type, x)
  }
};
Vex.Flow.Barline.type = {SINGLE:1, DOUBLE:2, END:3, REPEAT_BEGIN:4, REPEAT_END:5, REPEAT_BOTH:6, NONE:7};
Vex.Flow.Barline.prototype = new Vex.Flow.StaveModifier;
Vex.Flow.Barline.prototype.constructor = Vex.Flow.Barline;
Vex.Flow.Barline.superclass = Vex.Flow.StaveModifier.prototype;
Vex.Flow.Barline.prototype.init = function(type, x) {
  var superclass = Vex.Flow.Barline.superclass;
  superclass.init.call(this);
  this.barline = type;
  this.x = x
};
Vex.Flow.Barline.prototype.getCategory = function() {
  return"barlines"
};
Vex.Flow.Barline.prototype.setX = function(x) {
  this.x = x;
  return this
};
Vex.Flow.Barline.prototype.draw = function(stave, x) {
  switch(this.barline) {
    case Vex.Flow.Barline.type.SINGLE:
      this.drawVerticalBar(stave, this.x, false);
      break;
    case Vex.Flow.Barline.type.DOUBLE:
      this.drawVerticalBar(stave, this.x, true);
      break;
    case Vex.Flow.Barline.type.END:
      this.drawVerticalEndBar(stave, this.x);
      break;
    case Vex.Flow.Barline.type.REPEAT_BEGIN:
      this.drawRepeatBar(stave, this.x, true);
      break;
    case Vex.Flow.Barline.type.REPEAT_END:
      this.drawRepeatBar(stave, this.x, false);
      break;
    case Vex.Flow.Barline.type.REPEAT_BOTH:
      this.drawRepeatBar(stave, this.x, false);
      this.drawRepeatBar(stave, this.x, true);
      break;
    default:
      break
  }
};
Vex.Flow.Barline.prototype.drawVerticalBar = function(stave, x, double_bar) {
  if(!stave.context) {
    throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
  }
  var top_line = stave.getYForLine(0);
  var bottom_line = stave.getYForLine(stave.options.num_lines - 1);
  if(double_bar) {
    stave.context.fillRect(x - 3, top_line, 1, bottom_line - top_line + 1)
  }
  stave.context.fillRect(x, top_line, 1, bottom_line - top_line + 1)
};
Vex.Flow.Barline.prototype.drawVerticalEndBar = function(stave, x) {
  if(!stave.context) {
    throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
  }
  var top_line = stave.getYForLine(0);
  var bottom_line = stave.getYForLine(stave.options.num_lines - 1);
  stave.context.fillRect(x - 5, top_line, 1, bottom_line - top_line + 1);
  stave.context.fillRect(x - 2, top_line, 3, bottom_line - top_line + 1)
};
Vex.Flow.Barline.prototype.drawRepeatBar = function(stave, x, begin) {
  if(!stave.context) {
    throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
  }
  var top_line = stave.getYForLine(0);
  var bottom_line = stave.getYForLine(stave.options.num_lines - 1);
  var x_shift = 3;
  if(!begin) {
    x_shift = -5
  }
  stave.context.fillRect(x + x_shift, top_line, 1, bottom_line - top_line + 1);
  stave.context.fillRect(x - 2, top_line, 3, bottom_line - top_line + 1);
  var dot_radius = 2;
  if(begin) {
    x_shift += 4
  }else {
    x_shift -= 4
  }
  var dot_x = x + x_shift + dot_radius / 2;
  var y_offset = (stave.options.num_lines - 1) * stave.options.spacing_between_lines_px;
  y_offset = y_offset / 2 - stave.options.spacing_between_lines_px / 2;
  var dot_y = top_line + y_offset + dot_radius / 2;
  stave.context.beginPath();
  stave.context.arc(dot_x, dot_y, dot_radius, 0, Math.PI * 2, false);
  stave.context.fill();
  dot_y += stave.options.spacing_between_lines_px;
  stave.context.beginPath();
  stave.context.arc(dot_x, dot_y, dot_radius, 0, Math.PI * 2, false);
  stave.context.fill()
};
Vex.Flow.StaveHairpin = function(notes, type) {
  if(arguments.length > 0) {
    this.init(notes, type)
  }
};
Vex.Flow.StaveHairpin.type = {CRESC:1, DECRESC:2};
Vex.Flow.StaveHairpin.prototype.init = function(notes, type) {
  this.notes = notes;
  this.hairpin = type;
  this.position = Vex.Flow.Modifier.Position.BELOW;
  this.context = null;
  this.render_options = {height:10, y_shift:0, left_shift_px:0, right_shift_px:0};
  this.setNotes(notes)
};
Vex.Flow.StaveHairpin.prototype.setContext = function(context) {
  this.context = context;
  return this
};
Vex.Flow.StaveHairpin.prototype.setPosition = function(position) {
  if(position == Vex.Flow.Modifier.Position.ABOVE || position == Vex.Flow.Modifier.Position.BELOW) {
    this.position = position
  }
  return this
};
Vex.Flow.StaveHairpin.prototype.setRenderOptions = function(options) {
  if(options.height != undefined && options.y_shift != undefined && options.left_shift_px != undefined && options.right_shift_px != undefined) {
    this.render_options = options
  }
  return this
};
Vex.Flow.StaveHairpin.prototype.setNotes = function(notes) {
  if(!notes.first_note && !notes.last_note) {
    throw new Vex.RuntimeError("BadArguments", "Hairpin needs to have either first_note or last_note set.");
  }
  this.first_note = notes.first_note;
  this.last_note = notes.last_note;
  return this
};
Vex.Flow.StaveHairpin.prototype.renderHairpin = function(params) {
  var ctx = this.context;
  var dis = this.render_options.y_shift + 20;
  var y_shift = params.first_y;
  if(this.position == Vex.Flow.Modifier.Position.ABOVE) {
    dis = -dis + 30;
    y_shift = params.first_y - params.staff_height
  }
  var l_shift = this.render_options.left_shift_px;
  var r_shift = this.render_options.right_shift_px;
  switch(this.hairpin) {
    case Vex.Flow.StaveHairpin.type.CRESC:
      ctx.moveTo(params.last_x + r_shift, y_shift + dis);
      ctx.lineTo(params.first_x + l_shift, y_shift + this.render_options.height / 2 + dis);
      ctx.lineTo(params.last_x + r_shift, y_shift + this.render_options.height + dis);
      break;
    case Vex.Flow.StaveHairpin.type.DECRESC:
      ctx.moveTo(params.first_x + l_shift, y_shift + dis);
      ctx.lineTo(params.last_x + r_shift, y_shift + this.render_options.height / 2 + dis);
      ctx.lineTo(params.first_x + l_shift, y_shift + this.render_options.height + dis);
      break;
    default:
      break
  }
  ctx.stroke()
};
Vex.Flow.StaveHairpin.prototype.draw = function() {
  if(!this.context) {
    throw new Vex.RERR("NoContext", "Can't draw Hairpin without a context.");
  }
  var first_note = this.first_note;
  var last_note = this.last_note;
  var start = first_note.getModifierStartXY(this.position, 0);
  var end = last_note.getModifierStartXY(this.position, 0);
  this.renderHairpin({first_x:start.x, last_x:end.x, first_y:first_note.getStave().y + first_note.getStave().height, last_y:last_note.getStave().y + last_note.getStave().height, staff_height:first_note.getStave().height});
  return true
};
Vex.Flow.StaveHairpin.FormatByTicksAndDraw = function(ctx, formatter, notes, type, position, options) {
  ppt = formatter.pixelsPerTick;
  if(ppt == undefined) {
    throw new Vex.RuntimeError("BadArguments", "A valid Formatter must be provide to draw offsets by ticks.");
  }
  l_shift_px = ppt * options.left_shift_ticks;
  r_shift_px = ppt * options.right_shift_ticks;
  hairpin_options = {height:options.height, y_shift:options.y_shift, left_shift_px:l_shift_px, right_shift_px:r_shift_px};
  (new Vex.Flow.StaveHairpin({first_note:notes.first_note, last_note:notes.last_note}, type)).setContext(ctx).setRenderOptions(hairpin_options).setPosition(position).draw()
};
Vex.Flow.Volta = function(type, number, x, y_shift) {
  if(arguments.length > 0) {
    this.init(type, number, x, y_shift)
  }
};
Vex.Flow.Volta.type = {NONE:1, BEGIN:2, MID:3, END:4, BEGIN_END:5};
Vex.Flow.Volta.prototype = new Vex.Flow.StaveModifier;
Vex.Flow.Volta.prototype.constructor = Vex.Flow.Volta;
Vex.Flow.Volta.superclass = Vex.Flow.StaveModifier.prototype;
Vex.Flow.Volta.prototype.init = function(type, number, x, y_shift) {
  var superclass = Vex.Flow.Volta.superclass;
  superclass.init.call(this);
  this.volta = type;
  this.x = x;
  this.y_shift = y_shift;
  this.number = number;
  this.font = {family:"sans-serif", size:9, weight:"bold"}
};
Vex.Flow.Volta.prototype.getCategory = function() {
  return"voltas"
};
Vex.Flow.Volta.prototype.setShiftY = function(y) {
  this.y_shift = y;
  return this
};
Vex.Flow.Volta.prototype.draw = function(stave, x) {
  if(!stave.context) {
    throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
  }
  var ctx = stave.context;
  var width = stave.width;
  var top_y = stave.getYForTopText(stave.options.num_lines) + this.y_shift;
  var vert_height = 1.5 * stave.options.spacing_between_lines_px;
  switch(this.volta) {
    case Vex.Flow.Volta.type.BEGIN:
      ctx.fillRect(this.x + x, top_y, 1, vert_height);
      break;
    case Vex.Flow.Volta.type.END:
      width -= 5;
      ctx.fillRect(this.x + x + width, top_y, 1, vert_height);
      break;
    case Vex.Flow.Volta.type.BEGIN_END:
      width -= 3;
      ctx.fillRect(this.x + x, top_y, 1, vert_height);
      ctx.fillRect(this.x + x + width, top_y, 1, vert_height);
      break
  }
  if(this.volta == Vex.Flow.Volta.type.BEGIN || this.volta == Vex.Flow.Volta.type.BEGIN_END) {
    ctx.save();
    ctx.setFont(this.font.family, this.font.size, this.font.weight);
    ctx.fillText(this.number, this.x + x + 5, top_y + 15);
    ctx.restore()
  }
  ctx.fillRect(this.x + x, top_y, width, 1);
  return this
};
Vex.Flow.Repetition = function(type, x, y_shift) {
  if(arguments.length > 0) {
    this.init(type, x, y_shift)
  }
};
Vex.Flow.Repetition.type = {NONE:1, CODA_LEFT:2, CODA_RIGHT:3, SEGNO_LEFT:4, SEGNO_RIGHT:5, DC:6, DC_AL_CODA:7, DC_AL_FINE:8, DS:9, DS_AL_CODA:10, DS_AL_FINE:11, FINE:12};
Vex.Flow.Repetition.prototype = new Vex.Flow.StaveModifier;
Vex.Flow.Repetition.prototype.constructor = Vex.Flow.Repetition;
Vex.Flow.Repetition.superclass = Vex.Flow.StaveModifier.prototype;
Vex.Flow.Repetition.prototype.init = function(type, x, y_shift) {
  var superclass = Vex.Flow.Repetition.superclass;
  superclass.init.call(this);
  this.symbol_type = type;
  this.x = x;
  this.x_shift = 0;
  this.y_shift = y_shift;
  this.font = {family:"times", size:12, weight:"bold italic"}
};
Vex.Flow.Repetition.prototype.getCategory = function() {
  return"repetitions"
};
Vex.Flow.Repetition.prototype.setShiftX = function(x) {
  this.x_shift = x;
  return this
};
Vex.Flow.Repetition.prototype.setShiftY = function(y) {
  this.y_shift = y;
  return this
};
Vex.Flow.Repetition.prototype.draw = function(stave, x) {
  switch(this.symbol_type) {
    case Vex.Flow.Repetition.type.CODA_RIGHT:
      this.drawCodaFixed(stave, x + stave.width);
      break;
    case Vex.Flow.Repetition.type.CODA_LEFT:
      this.drawSymbolText(stave, x, "Coda", true);
      break;
    case Vex.Flow.Repetition.type.SEGNO_LEFT:
      this.drawSignoFixed(stave, x);
      break;
    case Vex.Flow.Repetition.type.SEGNO_RIGHT:
      this.drawSignoFixed(stave, x + stave.width);
      break;
    case Vex.Flow.Repetition.type.DC:
      this.drawSymbolText(stave, x, "D.C.", false);
      break;
    case Vex.Flow.Repetition.type.DC_AL_CODA:
      this.drawSymbolText(stave, x, "D.C. al", true);
      break;
    case Vex.Flow.Repetition.type.DC_AL_FINE:
      this.drawSymbolText(stave, x, "D.C. al Fine", false);
      break;
    case Vex.Flow.Repetition.type.DS:
      this.drawSymbolText(stave, x, "D.S.", false);
      break;
    case Vex.Flow.Repetition.type.DS_AL_CODA:
      this.drawSymbolText(stave, x, "D.S. al", true);
      break;
    case Vex.Flow.Repetition.type.DS_AL_FINE:
      this.drawSymbolText(stave, x, "D.S. al Fine", false);
      break;
    case Vex.Flow.Repetition.type.FINE:
      this.drawSymbolText(stave, x, "Fine", false);
      break;
    default:
      break
  }
  return this
};
Vex.Flow.Repetition.prototype.drawCodaFixed = function(stave, x) {
  if(!stave.context) {
    throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
  }
  var y = stave.getYForTopText(stave.options.num_lines) + this.y_shift;
  Vex.Flow.renderGlyph(stave.context, this.x + x + this.x_shift, y + 25, 40, "v4d", true);
  return this
};
Vex.Flow.Repetition.prototype.drawSignoFixed = function(stave, x) {
  if(!stave.context) {
    throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
  }
  var y = stave.getYForTopText(stave.options.num_lines) + this.y_shift;
  Vex.Flow.renderGlyph(stave.context, this.x + x + this.x_shift, y + 25, 30, "v8c", true);
  return this
};
Vex.Flow.Repetition.prototype.drawSymbolText = function(stave, x, text, draw_coda) {
  if(!stave.context) {
    throw new Vex.RERR("NoCanvasContext", "Can't draw stave without canvas context.");
  }
  var ctx = stave.context;
  ctx.save();
  ctx.setFont(this.font.family, this.font.size, this.font.weight);
  var text_x = 0 + this.x_shift;
  var symbol_x = x + this.x_shift;
  if(this.symbol_type == Vex.Flow.Repetition.type.CODA_LEFT) {
    text_x = this.x + stave.options.vertical_bar_width;
    symbol_x = text_x + ctx.measureText(text).width + 12
  }else {
    symbol_x = this.x + x + stave.width - 5 + this.x_shift;
    text_x = symbol_x - +ctx.measureText(text).width - 12
  }
  var y = stave.getYForTopText(stave.options.num_lines) + this.y_shift;
  if(draw_coda) {
    Vex.Flow.renderGlyph(ctx, symbol_x, y, 40, "v4d", true)
  }
  ctx.fillText(text, text_x, y + 5);
  ctx.restore();
  return this
};
Vex.Flow.StaveSection = function(section, x, shift_y) {
  if(arguments.length > 0) {
    this.init(section, x, shift_y)
  }
};
Vex.Flow.StaveSection.prototype = new Vex.Flow.Modifier;
Vex.Flow.StaveSection.prototype.constructor = Vex.Flow.StaveSection;
Vex.Flow.StaveSection.superclass = Vex.Flow.Modifier.prototype;
Vex.Flow.StaveSection.prototype.init = function(section, x, shift_y) {
  var superclass = Vex.Flow.StaveSection.superclass;
  superclass.init.call(this);
  this.setWidth(16);
  this.section = section;
  this.position = Vex.Flow.Modifier.Position.ABOVE;
  this.x = x;
  this.shift_x = 0;
  this.shift_y = shift_y;
  this.font = {family:"sans-serif", size:12, weight:"bold"}
};
Vex.Flow.StaveSection.prototype.getCategory = function() {
  return"stavesection"
};
Vex.Flow.StaveSection.prototype.setStaveSection = function(section) {
  this.section = section;
  return this
};
Vex.Flow.StaveSection.prototype.setShiftX = function(x) {
  this.shift_x = x;
  return this
};
Vex.Flow.StaveSection.prototype.setShiftY = function(x) {
  this.shift_y = y;
  return this
};
Vex.Flow.StaveSection.prototype.draw = function(stave, shift_x) {
  if(!stave.context) {
    throw new Vex.RERR("NoContext", "Can't draw stave section without a context.");
  }
  var ctx = stave.context;
  ctx.save();
  ctx.lineWidth = 2;
  ctx.setFont(this.font.family, this.font.size, this.font.weight);
  var text_width = ctx.measureText("" + this.section).width;
  var width = text_width + 6;
  if(width < 18) {
    width = 18
  }
  var height = 20;
  var y = stave.getYForTopText(3) + this.shift_y;
  var x = this.x + shift_x;
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.rect(x, y, width, height);
  ctx.stroke();
  x += (width - text_width) / 2;
  ctx.fillText("" + this.section, x, y + 16);
  ctx.restore();
  return this
};
Vex.Flow.StaveTempo = function(tempo, x, shift_y) {
  if(arguments.length > 0) {
    this.init(tempo, x, shift_y)
  }
};
Vex.Flow.StaveTempo.prototype = new Vex.Flow.StaveModifier;
Vex.Flow.StaveTempo.prototype.constructor = Vex.Flow.StaveTempo;
Vex.Flow.StaveTempo.superclass = Vex.Flow.StaveModifier.prototype;
Vex.Flow.StaveTempo.prototype.init = function(tempo, x, shift_y) {
  var superclass = Vex.Flow.StaveTempo.superclass;
  superclass.init.call(this);
  this.tempo = tempo;
  this.position = Vex.Flow.Modifier.Position.ABOVE;
  this.x = x;
  this.shift_x = 10;
  this.shift_y = shift_y;
  this.font = {family:"times", size:14, weight:"bold"};
  this.render_options = {glyph_font_scale:30}
};
Vex.Flow.StaveTempo.prototype.getCategory = function() {
  return"stavetempo"
};
Vex.Flow.StaveTempo.prototype.setTempo = function(tempo) {
  this.tempo = tempo;
  return this
};
Vex.Flow.StaveTempo.prototype.setShiftX = function(x) {
  this.shift_x = x;
  return this
};
Vex.Flow.StaveTempo.prototype.setShiftY = function(x) {
  this.shift_y = y;
  return this
};
Vex.Flow.StaveTempo.prototype.draw = function(stave, shift_x) {
  if(!stave.context) {
    throw new Vex.RERR("NoContext", "Can't draw stave tempo without a context.");
  }
  var options = this.render_options;
  var scale = options.glyph_font_scale / 38;
  var name = this.tempo.name;
  var duration = this.tempo.duration;
  var dots = this.tempo.dots;
  var bpm = this.tempo.bpm;
  var font = this.font;
  var ctx = stave.context;
  var x = this.x + this.shift_x + shift_x;
  var y = stave.getYForTopText(1) + this.shift_y;
  ctx.save();
  if(name) {
    ctx.setFont(font.family, font.size, font.weight);
    ctx.fillText(name, x, y);
    x += ctx.measureText(name).width
  }
  if(duration && bpm) {
    ctx.setFont(font.family, font.size, "normal");
    if(name) {
      x += ctx.measureText(" ").width;
      ctx.fillText("(", x, y);
      x += ctx.measureText("(").width
    }
    var code = Vex.Flow.durationToGlyph(duration);
    x += 3 * scale;
    Vex.Flow.renderGlyph(ctx, x, y, options.glyph_font_scale, code.code_head);
    x += code.head_width * scale;
    if(code.stem) {
      var stem_height = 30;
      if(code.beam_count) {
        stem_height += 3 * (code.beam_count - 1)
      }
      stem_height *= scale;
      var y_top = y - stem_height;
      ctx.fillRect(x, y_top, scale, stem_height);
      if(code.flag) {
        Vex.Flow.renderGlyph(ctx, x + scale, y_top, options.glyph_font_scale, code.code_flag_upstem);
        if(!dots) {
          x += 6 * scale
        }
      }
    }
    for(var i = 0;i < dots;i++) {
      x += 6 * scale;
      ctx.beginPath();
      ctx.arc(x, y + 2 * scale, 2 * scale, 0, Math.PI * 2, false);
      ctx.fill()
    }
    ctx.fillText(" = " + bpm + (name ? ")" : ""), x + 3 * scale, y)
  }
  ctx.restore();
  return this
};
Vex.Flow.BarNote = function() {
  this.init()
};
Vex.Flow.BarNote.prototype = new Vex.Flow.Note;
Vex.Flow.BarNote.superclass = Vex.Flow.Note.prototype;
Vex.Flow.BarNote.constructor = Vex.Flow.BarNote;
Vex.Flow.BarNote.prototype.init = function() {
  var superclass = Vex.Flow.BarNote.superclass;
  superclass.init.call(this, {duration:"b"});
  var TYPE = Vex.Flow.Barline.type;
  this.metrics = {widths:{}};
  this.metrics.widths[TYPE.SINGLE] = 8;
  this.metrics.widths[TYPE.DOUBLE] = 12;
  this.metrics.widths[TYPE.END] = 15;
  this.metrics.widths[TYPE.REPEAT_BEGIN] = 14;
  this.metrics.widths[TYPE.REPEAT_END] = 14;
  this.metrics.widths[TYPE.REPEAT_BOTH] = 18;
  this.metrics.widths[TYPE.NONE] = 0;
  this.ignore_ticks = true;
  this.type = TYPE.SINGLE;
  this.setWidth(this.metrics.widths[this.type])
};
Vex.Flow.BarNote.prototype.setType = function(type) {
  this.type = type;
  this.setWidth(this.metrics.widths[this.type]);
  return this
};
Vex.Flow.BarNote.prototype.getType = function() {
  return this.type
};
Vex.Flow.BarNote.prototype.setStave = function(stave) {
  var superclass = Vex.Flow.BarNote.superclass;
  superclass.setStave.call(this, stave)
};
Vex.Flow.BarNote.prototype.getBoundingBox = function() {
  return new Vex.Flow.BoundingBox(0, 0, 0, 0)
};
Vex.Flow.BarNote.prototype.addToModifierContext = function(mc) {
  return this
};
Vex.Flow.BarNote.prototype.preFormat = function() {
  this.setPreFormatted(true);
  return this
};
Vex.Flow.BarNote.prototype.draw = function() {
  if(!this.stave) {
    throw new Vex.RERR("NoStave", "Can't draw without a stave.");
  }
  var barline = new Vex.Flow.Barline(this.type, this.getAbsoluteX());
  barline.draw(this.stave, this.getAbsoluteX())
};
Vex.Flow.Tremolo = function(num) {
  if(arguments.length > 0) {
    this.init(num)
  }
};
Vex.Flow.Tremolo.prototype = new Vex.Flow.Modifier;
Vex.Flow.Tremolo.prototype.constructor = Vex.Flow.Tremolo;
Vex.Flow.Tremolo.superclass = Vex.Flow.Modifier.prototype;
Vex.Flow.Tremolo.prototype.init = function(num) {
  var superclass = Vex.Flow.Tremolo.superclass;
  superclass.init.call(this);
  this.num = num;
  this.note = null;
  this.index = null;
  this.position = Vex.Flow.Modifier.Position.CENTER;
  this.code = "v74";
  this.shift_right = -2;
  this.y_spacing = 4;
  this.render_options = {font_scale:35, stroke_px:3, stroke_spacing:10};
  this.font = {family:"Arial", size:16, weight:""}
};
Vex.Flow.Tremolo.prototype.getCategory = function() {
  return"tremolo"
};
Vex.Flow.Tremolo.prototype.draw = function() {
  if(!this.context) {
    throw new Vex.RERR("NoContext", "Can't draw Tremolo without a context.");
  }
  if(!(this.note && this.index != null)) {
    throw new Vex.RERR("NoAttachedNote", "Can't draw Tremolo without a note and index.");
  }
  var start = this.note.getModifierStartXY(this.position, this.index);
  var x = start.x;
  var y = start.y;
  x += this.shift_right;
  for(var i = 0;i < this.num;++i) {
    Vex.Flow.renderGlyph(this.context, x, y, this.render_options.font_scale, this.code);
    y += this.y_spacing
  }
};
Vex.Flow.Tuplet = function(notes, options) {
  if(arguments.length > 0) {
    this.init(notes, options)
  }
};
Vex.Flow.Tuplet.LOCATION_TOP = 1;
Vex.Flow.Tuplet.LOCATION_BOTTOM = -1;
Vex.Flow.Tuplet.prototype.init = function(notes, options) {
  if(!notes || notes == []) {
    throw new Vex.RuntimeError("BadArguments", "No notes provided for tuplet.");
  }
  if(notes.length == 1) {
    throw new Vex.RuntimeError("BadArguments", "Too few notes for tuplet.");
  }
  this.options = Vex.Merge({}, options);
  this.notes = notes;
  this.num_notes = "num_notes" in this.options ? this.options.num_notes : notes.length;
  this.beats_occupied = "beats_occupied" in this.options ? this.options.beats_occupied : 2;
  this.bracketed = notes[0].beam == null;
  this.ratioed = false;
  this.point = 28;
  this.y_pos = 16;
  this.x_pos = 100;
  this.width = 200;
  this.location = Vex.Flow.Tuplet.LOCATION_TOP;
  this.resolveGlyphs();
  this.attach()
};
Vex.Flow.Tuplet.prototype.attach = function() {
  for(var i = 0;i < this.notes.length;i++) {
    var note = this.notes[i];
    note.setTuplet(this)
  }
};
Vex.Flow.Tuplet.prototype.detach = function() {
  for(var i = 0;i < this.notes.length;i++) {
    var note = this.notes[i];
    note.setTuplet(null)
  }
};
Vex.Flow.Tuplet.prototype.setContext = function(context) {
  this.context = context;
  return this
};
Vex.Flow.Tuplet.prototype.setBracketed = function(bracketed) {
  this.bracketed = bracketed ? true : false;
  return this
};
Vex.Flow.Tuplet.prototype.setRatioed = function(ratioed) {
  this.ratioed = ratioed ? true : false;
  return this
};
Vex.Flow.Tuplet.prototype.setTupletLocation = function(location) {
  if(!location) {
    location = Vex.Flow.Tuplet.LOCATION_TOP
  }else {
    if(location != Vex.Flow.Tuplet.LOCATION_TOP && location != Vex.Flow.Tuplet.LOCATION_BOTTOM) {
      throw new Vex.RERR("BadArgument", "Invalid tuplet location: " + location);
    }
  }
  this.location = location;
  return this
};
Vex.Flow.Tuplet.prototype.getNotes = function() {
  return this.notes
};
Vex.Flow.Tuplet.prototype.getNoteCount = function() {
  return this.num_notes
};
Vex.Flow.Tuplet.prototype.getBeatsOccupied = function() {
  return this.beats_occupied
};
Vex.Flow.Tuplet.prototype.setBeatsOccupied = function(beats) {
  this.detach();
  this.beats_occupied = beats;
  this.resolveGlyphs();
  this.attach()
};
Vex.Flow.Tuplet.prototype.resolveGlyphs = function() {
  this.num_glyphs = [];
  var n = this.num_notes;
  while(n >= 1) {
    this.num_glyphs.push(new Vex.Flow.Glyph("v" + n % 10, this.point));
    n = parseInt(n / 10)
  }
  this.denom_glyphs = [];
  n = this.beats_occupied;
  while(n >= 1) {
    this.denom_glyphs.push(new Vex.Flow.Glyph("v" + n % 10, this.point));
    n = parseInt(n / 10)
  }
};
Vex.Flow.Tuplet.prototype.draw = function() {
  if(!this.context) {
    throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
  }
  var first_note = this.notes[0];
  var last_note = this.notes[this.notes.length - 1];
  if(!this.bracketed) {
    this.x_pos = first_note.getStemX();
    this.width = last_note.getStemX() - this.x_pos
  }else {
    this.x_pos = first_note.getTieLeftX() - 5;
    this.width = last_note.getTieRightX() - this.x_pos + 5
  }
  if(this.location == Vex.Flow.Tuplet.LOCATION_TOP) {
    this.y_pos = first_note.getStave().getYForLine(0) - 15;
    for(var i = 0;i < this.notes.length;++i) {
      var top_y = this.notes[i].getStemExtents().topY - 10;
      if(top_y < this.y_pos) {
        this.y_pos = top_y
      }
    }
  }else {
    this.y_pos = first_note.getStave().getYForLine(4) + 20;
    for(var i = 0;i < this.notes.length;++i) {
      var bottom_y = this.notes[i].getYs()[0] + 20;
      if(bottom_y > this.y_pos) {
        this.y_pos = bottom_y
      }
    }
  }
  var width = 0;
  for(var glyph in this.num_glyphs) {
    width += this.num_glyphs[glyph].getMetrics().width
  }
  if(this.ratioed) {
    for(var glyph in this.denom_glyphs) {
      width += this.denom_glyphs[glyph].getMetrics().width
    }
    width += this.point * 0.32
  }
  var notation_center_x = this.x_pos + this.width / 2;
  var notation_start_x = notation_center_x - width / 2;
  if(this.bracketed) {
    var line_width = this.width / 2 - width / 2 - 5;
    if(line_width > 0) {
      this.context.fillRect(this.x_pos, this.y_pos, line_width, 1);
      this.context.fillRect(this.x_pos + this.width / 2 + width / 2 + 5, this.y_pos, line_width, 1);
      this.context.fillRect(this.x_pos, this.y_pos + (this.location == Vex.Flow.Tuplet.LOCATION_BOTTOM), 1, this.location * 10);
      this.context.fillRect(this.x_pos + this.width, this.y_pos + (this.location == Vex.Flow.Tuplet.LOCATION_BOTTOM), 1, this.location * 10)
    }
  }
  var x_offset = 0;
  var size = this.num_glyphs.length;
  for(var glyph in this.num_glyphs) {
    this.num_glyphs[size - glyph - 1].render(this.context, notation_start_x + x_offset, this.y_pos + this.point / 3 - 2);
    x_offset += this.num_glyphs[size - glyph - 1].getMetrics().width
  }
  if(this.ratioed) {
    var colon_x = notation_start_x + x_offset + this.point * 0.16;
    var colon_radius = this.point * 0.06;
    this.context.beginPath();
    this.context.arc(colon_x, this.y_pos - this.point * 0.08, colon_radius, 0, Math.PI * 2, true);
    this.context.closePath();
    this.context.fill();
    this.context.beginPath();
    this.context.arc(colon_x, this.y_pos + this.point * 0.12, colon_radius, 0, Math.PI * 2, true);
    this.context.closePath();
    this.context.fill();
    x_offset += this.point * 0.32;
    var size = this.denom_glyphs.length;
    for(var glyph in this.denom_glyphs) {
      this.denom_glyphs[size - glyph - 1].render(this.context, notation_start_x + x_offset, this.y_pos + this.point / 3 - 2);
      x_offset += this.denom_glyphs[size - glyph - 1].getMetrics().width
    }
  }
};
Vex.Flow.BoundingBox = function(x, y, w, h) {
  this.init(x, y, w, h)
};
Vex.Flow.BoundingBox.prototype.init = function(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h
};
Vex.Flow.BoundingBox.prototype.getX = function() {
  return this.x
};
Vex.Flow.BoundingBox.prototype.getY = function() {
  return this.y
};
Vex.Flow.BoundingBox.prototype.getW = function() {
  return this.w
};
Vex.Flow.BoundingBox.prototype.getH = function() {
  return this.h
};
Vex.Flow.BoundingBox.prototype.setX = function(x) {
  return this.x = x
};
Vex.Flow.BoundingBox.prototype.setY = function(y) {
  return this.y = y
};
Vex.Flow.BoundingBox.prototype.setW = function(w) {
  return this.w = w
};
Vex.Flow.BoundingBox.prototype.setH = function(h) {
  return this.h = h
};
Vex.Flow.BoundingBox.prototype.mergeWith = function(boundingBox, ctx) {
  var that = boundingBox;
  new_x = this.x < that.x ? this.x : that.x;
  new_y = this.y < that.y ? this.y : that.y;
  new_w = this.x + this.w < that.x + that.w ? that.x + that.w - this.x : this.x + this.w - Vex.Min(this.x, that.x);
  new_h = this.y + this.h < that.y + that.h ? that.y + that.h - this.y : this.y + this.h - Vex.Min(this.y, that.y);
  this.x = new_x;
  this.y = new_y;
  this.w = new_w;
  this.h = new_h;
  if(ctx) {
    this.draw(ctx)
  }
  return this
};
Vex.Flow.BoundingBox.prototype.draw = function(ctx) {
  ctx.rect(this.x, this.y, this.w, this.h);
  ctx.stroke()
};
Vex.Flow.TextNote = function(text_struct) {
  if(arguments.length > 0) {
    this.init(text_struct)
  }
};
Vex.Flow.TextNote.prototype = new Vex.Flow.Note;
Vex.Flow.TextNote.superclass = Vex.Flow.Note.prototype;
Vex.Flow.TextNote.constructor = Vex.Flow.TextNote;
Vex.Flow.TextNote.Justification = {LEFT:1, CENTER:2, RIGHT:3};
Vex.Flow.TextNote.GLYPHS = {"segno":{code:"v8c", point:40, x_shift:0, y_shift:-10}, "tr":{code:"v1f", point:40, x_shift:0, y_shift:0}, "mordent":{code:"v1e", point:40, x_shift:0, y_shift:0}, "f":{code:"vba", point:40, x_shift:0, y_shift:0}, "p":{code:"vbf", point:40, x_shift:0, y_shift:0}, "m":{code:"v62", point:40, x_shift:0, y_shift:0}, "s":{code:"v4a", point:40, x_shift:0, y_shift:0}, "coda":{code:"v4d", point:40, x_shift:0, y_shift:-8}};
Vex.Flow.TextNote.prototype.init = function(text_struct) {
  var superclass = Vex.Flow.TextNote.superclass;
  superclass.init.call(this, text_struct);
  this.text = text_struct.text;
  this.glyph_type = text_struct.glyph;
  this.glyph = null;
  this.font = {family:"Arial", size:12, weight:""};
  if(text_struct.font) {
    this.font = text_struct.font
  }
  if(this.glyph_type) {
    var struct = Vex.Flow.TextNote.GLYPHS[this.glyph_type];
    if(!struct) {
      throw new Vex.RERR("Invalid glyph type: " + this.glyph_type);
    }
    this.glyph = new Vex.Flow.Glyph(struct.code, struct.point, {cache:false});
    if(struct.width) {
      this.setWidth(struct.width)
    }else {
      this.setWidth(this.glyph.getMetrics().width)
    }
    this.glyph_struct = struct
  }else {
    this.setWidth(Vex.Flow.textWidth(this.text))
  }
  this.line = text_struct.line || 0;
  this.smooth = text_struct.smooth || false;
  this.ignore_ticks = text_struct.ignore_ticks || false;
  this.justification = Vex.Flow.TextNote.Justification.LEFT
};
Vex.Flow.TextNote.prototype.setJustification = function(just) {
  this.justification = just;
  return this
};
Vex.Flow.TextNote.prototype.setLine = function(line) {
  this.line = line;
  return this
};
Vex.Flow.TextNote.prototype.preFormat = function() {
  if(!this.context) {
    throw new Vex.RERR("NoRenderContext", "Can't measure text without rendering context.");
  }
  if(this.preFormatted) {
    return
  }
  if(this.smooth) {
    this.setWidth(0)
  }else {
    if(this.glyph) {
    }else {
      this.setWidth(this.context.measureText(this.text).width)
    }
  }
  if(this.justification == Vex.Flow.TextNote.Justification.CENTER) {
    this.extraLeftPx = this.width / 2
  }else {
    if(this.justification == Vex.Flow.TextNote.Justification.RIGHT) {
      this.extraLeftPx = this.width
    }
  }
  this.setPreFormatted(true)
};
Vex.Flow.TextNote.prototype.draw = function() {
  if(!this.context) {
    throw new Vex.RERR("NoCanvasContext", "Can't draw without a canvas context.");
  }
  if(!this.stave) {
    throw new Vex.RERR("NoStave", "Can't draw without a stave.");
  }
  var ctx = this.context;
  var x = this.getAbsoluteX();
  if(this.justification == Vex.Flow.TextNote.Justification.CENTER) {
    x -= this.getWidth() / 2
  }else {
    if(this.justification == Vex.Flow.TextNote.Justification.RIGHT) {
      x -= this.getWidth()
    }
  }
  if(this.glyph) {
    var y = this.stave.getYForLine(this.line + -3);
    this.glyph.render(this.context, x + this.glyph_struct.x_shift, y + this.glyph_struct.y_shift)
  }else {
    var y = this.stave.getYForLine(this.line + -3);
    ctx.save();
    ctx.setFont(this.font.family, this.font.size, this.font.weight);
    ctx.fillText(this.text, x, y);
    ctx.restore()
  }
};
Vex.Flow.FretHandFinger = function(number) {
  if(arguments.length > 0) {
    this.init(number)
  }
};
Vex.Flow.FretHandFinger.prototype = new Vex.Flow.Modifier;
Vex.Flow.FretHandFinger.prototype.constructor = Vex.Flow.FretHandFinger;
Vex.Flow.FretHandFinger.superclass = Vex.Flow.Modifier.prototype;
Vex.Flow.FretHandFinger.prototype.init = function(number) {
  var superclass = Vex.Flow.FretHandFinger.superclass;
  superclass.init.call(this);
  this.note = null;
  this.index = null;
  this.finger = number;
  this.width = 7;
  this.position = Vex.Flow.Modifier.Position.LEFT;
  this.x_shift = 0;
  this.y_shift = 0;
  this.x_offset = 0;
  this.y_offset = 0;
  this.font = {family:"sans-serif", size:8, weight:""}
};
Vex.Flow.FretHandFinger.prototype.getCategory = function() {
  return"frethandfinger"
};
Vex.Flow.FretHandFinger.prototype.getNote = function() {
  return this.note
};
Vex.Flow.FretHandFinger.prototype.setNote = function(note) {
  this.note = note;
  return this
};
Vex.Flow.FretHandFinger.prototype.getIndex = function() {
  return this.index
};
Vex.Flow.FretHandFinger.prototype.setIndex = function(index) {
  this.index = index;
  return this
};
Vex.Flow.FretHandFinger.prototype.getPosition = function() {
  return this.position
};
Vex.Flow.FretHandFinger.prototype.setPosition = function(position) {
  if(position >= Vex.Flow.Modifier.Position.LEFT && position <= Vex.Flow.Modifier.Position.BELOW) {
    this.position = position
  }
  return this
};
Vex.Flow.FretHandFinger.prototype.setFretHandFinger = function(number) {
  this.finger = number;
  return this
};
Vex.Flow.FretHandFinger.prototype.setOffsetX = function(x) {
  this.x_offset = x;
  return this
};
Vex.Flow.FretHandFinger.prototype.setOffsetY = function(y) {
  this.y_offset = y;
  return this
};
Vex.Flow.FretHandFinger.prototype.draw = function() {
  if(!this.context) {
    throw new Vex.RERR("NoContext", "Can't draw string number without a context.");
  }
  if(!(this.note && this.index != null)) {
    throw new Vex.RERR("NoAttachedNote", "Can't draw string number without a note and index.");
  }
  var ctx = this.context;
  var start = this.note.getModifierStartXY(this.position, this.index);
  var dot_x = start.x + this.x_shift + this.x_offset;
  var dot_y = start.y + this.y_shift + this.y_offset + 5;
  switch(this.position) {
    case Vex.Flow.Modifier.Position.ABOVE:
      dot_x -= 2;
      dot_y -= 12;
      break;
    case Vex.Flow.Modifier.Position.BELOW:
      dot_x -= 2;
      dot_y += 10;
      break;
    case Vex.Flow.Modifier.Position.LEFT:
      dot_x -= this.width;
      break;
    case Vex.Flow.Modifier.Position.RIGHT:
      dot_x += 2;
      break
  }
  ctx.save();
  ctx.setFont(this.font.family, this.font.size, this.font.weight);
  ctx.fillText("" + this.finger, dot_x, dot_y);
  ctx.restore()
};
Vex.Flow.StringNumber = function(number) {
  if(arguments.length > 0) {
    this.init(number)
  }
};
Vex.Flow.StringNumber.prototype = new Vex.Flow.Modifier;
Vex.Flow.StringNumber.prototype.constructor = Vex.Flow.StringNumber;
Vex.Flow.StringNumber.superclass = Vex.Flow.Modifier.prototype;
Vex.Flow.StringNumber.prototype.init = function(number) {
  var superclass = Vex.Flow.StringNumber.superclass;
  superclass.init.call(this);
  this.note = null;
  this.last_note = null;
  this.index = null;
  this.string_number = number;
  this.setWidth(18);
  this.position = Vex.Flow.Modifier.Position.ABOVE;
  this.x_shift = 0;
  this.y_shift = 0;
  this.x_offset = 0;
  this.y_offset = 0;
  this.dashed = true;
  this.leg = Vex.Flow.Renderer.LineEndType.NONE;
  this.radius = 7;
  this.font = {family:"sans-serif", size:9, weight:""}
};
Vex.Flow.StringNumber.prototype.getCategory = function() {
  return"stringnumber"
};
Vex.Flow.StringNumber.prototype.getNote = function() {
  return this.note
};
Vex.Flow.StringNumber.prototype.setNote = function(note) {
  this.note = note;
  return this
};
Vex.Flow.StringNumber.prototype.getIndex = function() {
  return this.index
};
Vex.Flow.StringNumber.prototype.setIndex = function(index) {
  this.index = index;
  return this
};
Vex.Flow.StringNumber.prototype.setLineEndType = function(leg) {
  if(leg >= Vex.Flow.Renderer.LineEndType.NONE && leg <= Vex.Flow.Renderer.LineEndType.DOWN) {
    this.leg = leg
  }
  return this
};
Vex.Flow.StringNumber.prototype.getPosition = function() {
  return this.position
};
Vex.Flow.StringNumber.prototype.setPosition = function(position) {
  if(position >= Vex.Flow.Modifier.Position.LEFT && position <= Vex.Flow.Modifier.Position.BELOW) {
    this.position = position
  }
  return this
};
Vex.Flow.StringNumber.prototype.setStringNumber = function(number) {
  this.string_number = number;
  return this
};
Vex.Flow.StringNumber.prototype.setOffsetX = function(x) {
  this.x_offset = x;
  return this
};
Vex.Flow.StringNumber.prototype.setOffsetY = function(y) {
  this.y_offset = y;
  return this
};
Vex.Flow.StringNumber.prototype.setLastNote = function(note) {
  this.last_note = note;
  return this
};
Vex.Flow.StringNumber.prototype.setDashed = function(dashed) {
  this.dashed = dashed;
  return this
};
Vex.Flow.StringNumber.prototype.draw = function() {
  if(!this.context) {
    throw new Vex.RERR("NoContext", "Can't draw string number without a context.");
  }
  if(!(this.note && this.index != null)) {
    throw new Vex.RERR("NoAttachedNote", "Can't draw string number without a note and index.");
  }
  var ctx = this.context;
  var start = this.note.getModifierStartXY(this.position, this.index);
  var dot_x = start.x + this.x_shift + this.x_offset;
  var dot_y = start.y + this.y_shift + this.y_offset;
  switch(this.position) {
    case Vex.Flow.Modifier.Position.ABOVE:
      dot_y = this.note.getYForTopText(1);
      break;
    case Vex.Flow.Modifier.Position.BELOW:
      var text_line = this.note.getStemDirection() == Vex.Flow.StaveNote.STEM_UP ? 2 : 12;
      dot_y = this.note.getYForBottomText(text_line) + 5;
      break;
    case Vex.Flow.Modifier.Position.LEFT:
      dot_x -= this.radius / 2 + 5;
      break;
    case Vex.Flow.Modifier.Position.RIGHT:
      dot_x += this.radius / 2 + 6;
      break
  }
  ctx.save();
  ctx.beginPath();
  ctx.arc(dot_x, dot_y, this.radius, 0, Math.PI * 2, false);
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.setFont(this.font.family, this.font.size, this.font.weight);
  var x = dot_x - ctx.measureText(this.string_number).width / 2;
  ctx.fillText("" + this.string_number, x, dot_y + 5);
  if(this.last_note != null) {
    var end = this.last_note.getStemX() - this.note.getX() + 5;
    ctx.strokeStyle = "#000000";
    ctx.lineCap = "round";
    ctx.lineWidth = 0.6;
    if(this.dashed) {
      Vex.Flow.Renderer.drawDashedLine(ctx, dot_x + 10, dot_y, dot_x + end, dot_y, [3, 3])
    }else {
      Vex.Flow.Renderer.drawDashedLine(ctx, dot_x + 10, dot_y, dot_x + end, dot_y, [3, 0])
    }
    switch(this.leg) {
      case Vex.Flow.Renderer.LineEndType.UP:
        var len = -10;
        var pattern = this.dashed ? [3, 3] : [3, 0];
        Vex.Flow.Renderer.drawDashedLine(ctx, dot_x + end, dot_y, dot_x + end, dot_y + len, pattern);
        break;
      case Vex.Flow.Renderer.LineEndType.DOWN:
        var len = 10;
        var pattern = this.dashed ? [3, 3] : [3, 0];
        Vex.Flow.Renderer.drawDashedLine(ctx, dot_x + end, dot_y, dot_x + end, dot_y + len, pattern);
        break
    }
  }
  ctx.restore()
};
Vex.Flow.Stroke = function(type) {
  if(arguments.length > 0) {
    this.init(type)
  }
};
Vex.Flow.Stroke.prototype = new Vex.Flow.Modifier;
Vex.Flow.Stroke.prototype.constructor = Vex.Flow.Stroke;
Vex.Flow.Stroke.superclass = Vex.Flow.Modifier.prototype;
Vex.Flow.Stroke.Type = {BRUSH_DOWN:1, BRUSH_UP:2, ROLL_DOWN:3, ROLL_UP:4, RASQUEDO_DOWN:5, RASQUEDO_UP:6};
Vex.Flow.Stroke.prototype.init = function(type) {
  var superclass = Vex.Flow.Stroke.superclass;
  superclass.init.call(this);
  this.note = null;
  this.note_end = null;
  this.index = null;
  this.type = type;
  this.position = Vex.Flow.Modifier.Position.LEFT;
  this.render_options = {font_scale:38, stroke_px:3, stroke_spacing:10};
  this.font = {family:"serif", size:10, weight:"bold italic"};
  this.setXShift(0);
  this.setWidth(10)
};
Vex.Flow.Stroke.prototype.getCategory = function() {
  return"strokes"
};
Vex.Flow.Stroke.prototype.getPosition = function() {
  return this.position
};
Vex.Flow.Stroke.prototype.addEndNote = function(note) {
  this.note_end = note;
  return this
};
Vex.Flow.Stroke.prototype.draw = function() {
  if(!this.context) {
    throw new Vex.RERR("NoContext", "Can't draw stroke without a context.");
  }
  if(!(this.note && this.index != null)) {
    throw new Vex.RERR("NoAttachedNote", "Can't draw stroke without a note and index.");
  }
  var start = this.note.getModifierStartXY(this.position, this.index);
  var ys = this.note.getYs();
  var topY = start.y;
  var botY = start.y;
  var x = start.x - 5;
  var line_space = this.note.stave.options.spacing_between_lines_px;
  for(var i = 0;i < ys.length;i++) {
    topY = Vex.Min(topY, ys[i]);
    botY = Vex.Max(botY, ys[i])
  }
  if(this.note_end != null) {
    ys = this.note_end.getYs();
    for(var i = 0;i < ys.length;i++) {
      topY = Vex.Min(topY, ys[i]);
      botY = Vex.Max(botY, ys[i])
    }
  }
  switch(this.type) {
    case Vex.Flow.Stroke.Type.BRUSH_DOWN:
      var arrow = "vc3";
      var arrow_shift_x = -3;
      var arrow_y = topY - line_space / 2 + 10;
      botY += line_space / 2;
      break;
    case Vex.Flow.Stroke.Type.BRUSH_UP:
      var arrow = "v11";
      var arrow_shift_x = 0.5;
      var arrow_y = botY + line_space / 2;
      topY -= line_space / 2;
      break;
    case Vex.Flow.Stroke.Type.ROLL_DOWN:
    ;
    case Vex.Flow.Stroke.Type.RASQUEDO_DOWN:
      var arrow = "vc3";
      var arrow_shift_x = -3;
      var text_shift_x = this.x_shift + arrow_shift_x - 2;
      if(this.note instanceof Vex.Flow.StaveNote) {
        topY += 1.5 * line_space;
        if((botY - topY) % 2 != 0) {
          botY += 0.5 * line_space
        }else {
          botY += line_space
        }
        var arrow_y = topY - line_space;
        var text_y = botY + line_space + 2
      }else {
        topY += 1.5 * line_space;
        botY += line_space;
        var arrow_y = topY - 0.75 * line_space;
        var text_y = botY + 0.25 * line_space
      }
      break;
    case Vex.Flow.Stroke.Type.ROLL_UP:
    ;
    case Vex.Flow.Stroke.Type.RASQUEDO_UP:
      var arrow = "v52";
      var arrow_shift_x = -4;
      var text_shift_x = this.x_shift + arrow_shift_x - 1;
      if(this.note instanceof Vex.Flow.StaveNote) {
        arrow_y = line_space / 2;
        topY += 0.5 * line_space;
        if((botY - topY) % 2 == 0) {
          botY += line_space / 2
        }
        var arrow_y = botY + 0.5 * line_space;
        var text_y = topY - 1.25 * line_space
      }else {
        topY += 0.25 * line_space;
        botY += 0.5 * line_space;
        var arrow_y = botY + 0.25 * line_space;
        var text_y = topY - line_space
      }
      break
  }
  if(this.type == Vex.Flow.Stroke.Type.BRUSH_DOWN || this.type == Vex.Flow.Stroke.Type.BRUSH_UP) {
    this.context.fillRect(x + this.x_shift, topY, 1, botY - topY)
  }else {
    if(this.note instanceof Vex.Flow.StaveNote) {
      for(var i = topY;i <= botY;i += line_space) {
        Vex.Flow.renderGlyph(this.context, x + this.x_shift - 4, i, this.render_options.font_scale, "va3")
      }
    }else {
      for(var i = topY;i <= botY;i += 10) {
        Vex.Flow.renderGlyph(this.context, x + this.x_shift - 4, i, this.render_options.font_scale, "va3")
      }
      if(this.type == Vex.Flow.Stroke.Type.RASQUEDO_DOWN) {
        text_y = i + 0.25 * line_space
      }
    }
  }
  Vex.Flow.renderGlyph(this.context, x + this.x_shift + arrow_shift_x, arrow_y, this.render_options.font_scale, arrow);
  if(this.type == Vex.Flow.Stroke.Type.RASQUEDO_DOWN || this.type == Vex.Flow.Stroke.Type.RASQUEDO_UP) {
    this.context.save();
    this.context.setFont(this.font.family, this.font.size, this.font.weight);
    this.context.fillText("R", x + text_shift_x, text_y);
    this.context.restore()
  }
};
/*

 Fermata 0.0.1

 Build ID: debug-4@3bf25b82773f596dd82239381a317f660d2b052e
 Build date: 2013-07-19 02:50:28.530369

*/
if(typeof require !== "undefined") {
  var jsondiffpatch = require("jsondiffpatch")
}
var Fermata = Fermata || {};
Fermata.Vex = Vex;
(function() {
  Fermata.Utils = {};
  Fermata.Utils.Clone = function(obj) {
    var newObj = Object.prototype.toString.call(obj) === "[object Array]" ? [] : {};
    for(var i in obj) {
      if(obj.hasOwnProperty(i)) {
        if(obj[i] && typeof obj[i] === "object") {
          newObj[i] = Fermata.Utils.Clone(obj[i])
        }else {
          newObj[i] = obj[i]
        }
      }
    }
    return newObj
  };
  Fermata.Utils.FirstLast = function(obj) {
    return{first:0, last:obj.length - 1}
  }
}).call(this);
(function() {
  Fermata.Utils.AttributeDiff = function(attr1, attr2) {
    this.attr1 = attr1;
    this.attr2 = attr2;
    this.delta = jsondiffpatch.diff(attr1, attr2);
    if(typeof this.delta !== "undefined") {
      this.result = {};
      this.fillResult()
    }else {
      this.result = null
    }
    this.hasProcessed = false
  };
  var AttributeDiff = Fermata.Utils.AttributeDiff;
  AttributeDiff.prototype.fillResult = function() {
    for(var i = 0;i < AttributeDiff.processorList.length;i++) {
      var attributesProcessor = AttributeDiff.processorList[i];
      if(attributesProcessor.canProcess(this.delta)) {
        attributesProcessor.process(this.attr1, this.attr2, this.delta, this.result);
        this.hasProcessed = true
      }
    }
  };
  AttributeDiff.prototype.getResult = function() {
    if(this.hasProcessed) {
      return this.result
    }else {
      return null
    }
  }
}).call(this);
(function() {
  Fermata.Utils.AttributeDiff.UpdateBase = function() {
  };
  var UpdateBase = Fermata.Utils.AttributeDiff.UpdateBase;
  UpdateBase.prototype.canProcess = function(delta) {
    return this.pathExists(delta)
  };
  UpdateBase.prototype.pathExists = function(obj) {
    for(var i = 0;i < this.diffPath.length;i++) {
      var pathElement = this.diffPath[i];
      if(typeof obj[pathElement] !== "undefined") {
        obj = obj[pathElement]
      }else {
        return false
      }
    }
    return true
  };
  UpdateBase.prototype.process = function(attr1, attr2, delta, result) {
    this.createPathsIfNotExists(result);
    this.updatePaths(attr2, result)
  };
  UpdateBase.prototype.createPathsIfNotExists = function(result) {
    for(var i = 0;i < this.changePaths.length;i++) {
      var changePath = this.changePaths[i];
      this.createPathIfNotExists(result, changePath)
    }
  };
  UpdateBase.prototype.createPathIfNotExists = function(result, changePath) {
    var i = 0;
    while(i < changePath.length - 1 && !this.exists(result, changePath, i)) {
      var pathElem = changePath[i];
      result[pathElem] = {};
      result = result[pathElem];
      i++
    }
  };
  UpdateBase.prototype.exists = function(result, changePath, i) {
    var pathElem = changePath[i];
    return typeof result[pathElem] !== "undefined"
  };
  UpdateBase.prototype.updatePaths = function(attr2, result) {
    for(var i = 0;i < this.changePaths.length;i++) {
      var changePath = this.changePaths[i];
      this.update(attr2, result, changePath)
    }
  };
  UpdateBase.prototype.update = function(attr2, result, changePath) {
    var pathElem = "";
    for(var i = 0;i < changePath.length - 1;i++) {
      pathElem = changePath[i];
      attr2 = attr2[pathElem];
      result = result[pathElem]
    }
    pathElem = changePath[i];
    result[pathElem] = attr2[pathElem]
  }
}).call(this);
(function() {
  var UpdateBase = Fermata.Utils.AttributeDiff.UpdateBase;
  Fermata.Utils.AttributeDiff.UpdateBeatType = function() {
    this.diffPath = ["time", "beat-type"];
    this.changePaths = [this.diffPath, ["time", "beats"]]
  };
  var UpdateBeatType = Fermata.Utils.AttributeDiff.UpdateBeatType;
  UpdateBeatType.prototype = new UpdateBase;
  UpdateBeatType.constructor = UpdateBeatType
}).call(this);
(function() {
  var UpdateBase = Fermata.Utils.AttributeDiff.UpdateBase;
  Fermata.Utils.AttributeDiff.UpdateBeats = function() {
    this.diffPath = ["time", "beats"];
    this.changePaths = [this.diffPath, ["time", "beat-type"]]
  };
  var UpdateBeats = Fermata.Utils.AttributeDiff.UpdateBeats;
  UpdateBeats.prototype = new UpdateBase;
  UpdateBeats.constructor = UpdateBeats
}).call(this);
(function() {
  var UpdateBase = Fermata.Utils.AttributeDiff.UpdateBase;
  Fermata.Utils.AttributeDiff.UpdateDivisions = function() {
    this.diffPath = ["divisions"];
    this.changePaths = [this.diffPath]
  };
  var UpdateDivisions = Fermata.Utils.AttributeDiff.UpdateDivisions;
  UpdateDivisions.prototype = new UpdateBase;
  UpdateDivisions.constructor = UpdateDivisions
}).call(this);
(function() {
  var UpdateBeatType = Fermata.Utils.AttributeDiff.UpdateBeatType;
  var UpdateBeats = Fermata.Utils.AttributeDiff.UpdateBeats;
  var UpdateDivisions = Fermata.Utils.AttributeDiff.UpdateDivisions;
  var AttributeDiff = Fermata.Utils.AttributeDiff;
  AttributeDiff.processorList = [new UpdateBeatType, new UpdateBeats, new UpdateDivisions]
}).call(this);
(function() {
  Fermata.Utils.epureAttributes = function(attr) {
    epureAttributesObj(attr)
  };
  var epureAttributesObj = function(obj) {
    for(var key in obj) {
      epureAttributesObjProcess(obj, key)
    }
  };
  var epureAttributesObjProcess = function(parent, key) {
    var elem = parent[key];
    if(elem === null || typeof elem === "undefined") {
      delete parent[key]
    }else {
      processCommon(parent, key)
    }
  };
  var epureAttributesArray = function(arr) {
    for(var i = 0;i < arr.length;i++) {
      epureAttributesArrayProcess(arr, i)
    }
  };
  var epureAttributesArrayProcess = function(parent, idx) {
    processCommon(parent, idx)
  };
  var processCommon = function(parent, key) {
    var elem = parent[key];
    if(typeof elem === "number") {
      parent[key] = elem.toString()
    }else {
      if(isArray(elem)) {
        epureAttributesArray(elem)
      }else {
        if(isObject(elem)) {
          epureAttributesObj(elem)
        }
      }
    }
  };
  var isArray = function(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]"
  };
  var isObject = function(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]"
  }
}).call(this);
(function() {
  Fermata.Utils.Call = {};
  var Call = Fermata.Utils.Call;
  Call.FuncTypes = {$0n:"*", $1n:"+", $01:"?", $1:"default"};
  var camelCaseHandler = function(c) {
    return c[1].toUpperCase()
  };
  Call.exploreSubNodes = function(p) {
    if(p === "undefined" || typeof p !== "object") {
      return false
    }
    if(p.out === undefined) {
      p.out = p.object
    }
    for(var i = 0;i < p.processes.length;i++) {
      var process = p.processes[i];
      var _arguments = [];
      if(arguments.length > 1) {
        for(var j = 1;j < arguments.length;j++) {
          _arguments.push(arguments[j])
        }
      }
      if(typeof process.dataType !== "undefined") {
        if(typeof process._key === "undefined") {
          if(typeof process.dataKey === "undefined" || process.dataKey === "CamelCase") {
            process._key = process.key.replace(/-([a-z])/g, camelCaseHandler)
          }else {
            if(typeof process.dataKey === "string") {
              process._key = process.dataKey
            }else {
              process._key = process.key
            }
          }
        }
        parseDataType(p, process)
      }
      if(process.type === Call.FuncTypes.$0n) {
        if(typeof p.object[process.key] !== "undefined") {
          callProcessMultiple(p.object[process.key], p.ctx, process.func, _arguments)
        }
      }else {
        if(process.type === Call.FuncTypes.$1n) {
          callProcessMultiple(p.object[process.key], p.ctx, process.func, _arguments)
        }else {
          if(process.type === Call.FuncTypes.$01) {
            if(typeof p.object[process.key] !== "undefined") {
              _arguments.unshift(p.object[process.key]);
              process.func.apply(p.ctx, _arguments)
            }
          }else {
            if(process.type === Call.FuncTypes.$1) {
              _arguments.unshift(p.object[process.key]);
              process.func.apply(p.ctx, _arguments)
            }
          }
        }
      }
    }
  };
  var parseDataType = function(parameter, process) {
    switch(process.dataType) {
      case "string":
        process.func = function(str) {
          parameter.out[process._key] = typeof parameter.object[process.key] === "string" ? parameter.object[process.key] : ""
        };
        break;
      case "int":
        process.func = function(str) {
          if(typeof parameter.object[process.key] === "number") {
            parameter.out[process._key] = parameter.object[process.key]
          }else {
            if(typeof parameter.object[process.key] === "string") {
              parameter.out[process._key] = parseInt(parameter.object[process.key], 10)
            }else {
              parameter.out[process._key] = 0
            }
          }
        };
        break;
      case "bool":
        process.func = function(str) {
          if(typeof parameter.object === "boolean") {
            parameter.out[process._key] = parameter.object[process.key]
          }else {
            if(parameter.object === "yes") {
              parameter.out[process._key] = true
            }else {
              parameter.out[process._key] = false
            }
          }
        };
        break
    }
  };
  var callProcessMultiple = function(child, _this, func, _arguments) {
    if(Object.prototype.toString.call(child) !== "[object Array]") {
      _arguments.unshift(child, 0);
      func.apply(_this, _arguments)
    }else {
      for(var i = 0;i < child.length;i++) {
        var _argumentsOne = [child[i], i];
        for(var j = 0;j < _arguments.length;j++) {
          _argumentsOne.push(_arguments[j])
        }
        func.apply(_this, _argumentsOne)
      }
    }
  }
}).call(this);
Fermata.Error = {};
(function() {
  Fermata.Error.NotImplementedError = function(message) {
    this.name = "NotImplementedError";
    this.message = message || "This feature in not yet implemented"
  };
  var NotImplementedError = Fermata.Error.NotImplementedError;
  NotImplementedError.prototype = Error.prototype
}).call(this);
(function() {
  Fermata.Error.PitchRangeError = function(message) {
    this.name = "PitchRangeError";
    this.message = message || "The pitch setted is outside authorized range"
  };
  var PitchRangeError = Fermata.Error.PitchRangeError;
  PitchRangeError.prototype = Error.prototype
}).call(this);
(function() {
  var PitchRangeError = Fermata.Error.PitchRangeError;
  Fermata.Error.OctaveRangeError = function(octave) {
    this.name = "OctaveRangeError";
    this.octave = octave;
    this.message = "octave value " + octave + " is outside authorized range"
  };
  var OctaveRangeError = Fermata.Error.OctaveRangeError;
  OctaveRangeError.prototype = PitchRangeError.prototype
}).call(this);
(function() {
  var PitchRangeError = Fermata.Error.PitchRangeError;
  Fermata.Error.StepRangeError = function(step) {
    this.name = "StepRangeError";
    this.step = step;
    this.message = "step value " + step + " is outside authorized range"
  };
  var StepRangeError = Fermata.Error.StepRangeError;
  StepRangeError.prototype = PitchRangeError
}).call(this);
Fermata.Values = {};
(function() {
  Fermata.Values.Octave = {};
  var Octave = Fermata.Values.Octave;
  Octave.values = [];
  Octave.MIN = 0;
  Octave.MAX = 9;
  Octave.check = function(octave) {
    return isInteger(octave) && Octave.MIN <= octave && octave <= Octave.MAX
  };
  var isInteger = function(value) {
    return parseFloat(value) === parseInt(value, 10) && !isNaN(value)
  };
  var fillValues = function() {
    for(var i = Octave.MIN;i <= Octave.MAX;i++) {
      Octave.values.push(i)
    }
  };
  fillValues()
}).call(this);
(function() {
  Fermata.Values.Step = {};
  var Step = Fermata.Values.Step;
  Step.values = ["C", "D", "E", "F", "G", "A", "B"];
  Step.idx = {};
  Step.check = function(step) {
    return step in Step.idx
  };
  var fillIdx = function(values, idx) {
    for(var i = 0;i < values.length;i++) {
      var value = values[i];
      idx[value] = i
    }
  };
  fillIdx(Step.values, Step.idx)
}).call(this);
(function() {
  Fermata.Values.SoundType = {PITCH:"pitch", UNPITCHED:"unpitched", REST:"rest"};
  var SoundType = Fermata.Values.SoundType;
  SoundType.getSoundType = function(noteData) {
    if(typeof noteData.pitch !== "undefined") {
      return SoundType.PITCH
    }else {
      if(typeof noteData.unpitched !== "undefined") {
        return SoundType.UNPITCHED
      }else {
        if(typeof noteData.rest !== "undefined") {
          return SoundType.REST
        }else {
          return null
        }
      }
    }
  }
}).call(this);
(function() {
  Fermata.Mapping = Fermata.Mapping || {};
  Fermata.Mapping.Clef = {};
  var musicXMLToVexflow = {"G":"treble", "F":"bass", "C":"alto", "TAB":"TAB", 4:{4:"C"}};
  var MAJOR_KEYS = ["C", "F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb", "G", "D", "A", "E", "B", "F#", "C#"];
  var MINOR_KEYS = ["Am", "Dm", "Gm", "Cm", "Fm", "Bbm", "Ebm", "Abm", "Em", "Bm", "F#m", "C#m", "G#m", "D#m", "A#m"];
  var vexFlowToMusicXml = {};
  for(var key in musicXMLToVexflow) {
    if(musicXMLToVexflow.hasOwnProperty(key)) {
      vexFlowToMusicXml[musicXMLToVexflow[key]] = key
    }
  }
  Fermata.Mapping.Clef.getVexflow = function(musicXml) {
    return musicXMLToVexflow[musicXml]
  };
  Fermata.Mapping.Clef.getMusicXml = function(vexflow) {
    return vexFlowToMusicXml[vexflow]
  };
  Fermata.Mapping.Clef.Sign = {};
  Fermata.Mapping.Clef.Sign.getVexflow = function(fifth, mode) {
    fifth = parseInt(fifth, 10);
    if(mode === "minor") {
      if(fifth <= 0) {
        return MINOR_KEYS[Math.abs(fifth)]
      }
      return MINOR_KEYS[fifth + 8]
    }else {
      if(fifth <= 0) {
        return MAJOR_KEYS[Math.abs(fifth)]
      }
      return MAJOR_KEYS[fifth + 7]
    }
  }
}).call(this);
(function() {
  Fermata.Mapping = Fermata.Mapping || {};
  Fermata.Mapping.Direction = {};
  Fermata.Mapping.Direction.musicXMLToVexflow = {"crescendo":1, "diminuendo":2, "above":3, "below":4};
  Fermata.Mapping.Direction.getVexflow = function(musicXml) {
    return Fermata.Mapping.Direction.musicXMLToVexflow[musicXml]
  }
}).call(this);
(function() {
  Fermata.Mapping = Fermata.Mapping || {};
  Fermata.Mapping.Connector = {};
  Fermata.Mapping.Connector.MusicXmlToVexflow = {"single":1, "double":2, "brace":3, "bracket":4};
  Fermata.Mapping.Connector.getVexflow = function(musicXML) {
    return Fermata.Mapping.Connector.MusicXmlToVexflow[musicXML]
  }
}).call(this);
(function() {
  Fermata.Mapping = Fermata.Mapping || {};
  Fermata.Mapping.Barline = {};
  Fermata.Mapping.Barline.MusicXmlToVexflow = {"normal":{"light-heavy":2}, "forward":{"heavy-light":4, "light-heavy":4}, "backward":{"heavy-light":5, "light-heavy":5}};
  Fermata.Mapping.Barline.getVexflow = function(type, style) {
    return Fermata.Mapping.Barline.MusicXmlToVexflow[type][style]
  }
}).call(this);
(function() {
  Fermata.Data = function(score) {
    this.score = Fermata.Utils.Clone(score) || {};
    this.scoreCache = {part:null};
    if(this.score["score-partwise"] === undefined) {
      this.score["score-partwise"] = {"$version":"3.0", "part-list":{"score-part":null}}
    }
  };
  var CacheParts = Fermata.Data.cacheParts = {IDX:0, ID:1, NAME:2};
  Fermata.Data.prototype = {cacheParts:function() {
    var cur, cached, i, parts;
    this.scoreCache.part = {idx:[], id:{}, name:{}};
    parts = this.score["score-partwise"]["part-list"]["score-part"];
    for(i = 0;i < parts.length;++i) {
      cur = parts[i];
      cached = {id:cur.$id, name:cur["part-name"], measure:null};
      this.scoreCache.part.id[cur.$id] = cached;
      this.scoreCache.part.name[cur["part-name"]] = cached;
      this.scoreCache.part.idx.push(cached)
    }
    for(i = 0;i < this.score["score-partwise"].part.length;++i) {
      cur = this.score["score-partwise"].part[i];
      this.scoreCache.part.id[cur.$id].measure = cur.measure
    }
    for(i = 0;i < this.scoreCache.part.idx.length;i++) {
      var part = this.scoreCache.part.idx[i];
      var measures = part.measure;
      this.reconstructAttributes(measures)
    }
    return this.scoreCache.part
  }, getScorePartWise:function() {
    return this.score["score-partwise"]
  }, getParts:function() {
    return this.scoreCache.part || this.cacheParts()
  }, getPart:function(id, type) {
    if(this.scoreCache.part === null) {
      this.cacheParts()
    }
    if(type !== undefined) {
      if(type === CacheParts.IDX) {
        return this.scoreCache.part.idx[id]
      }else {
        if(type === CacheParts.ID) {
          return this.scoreCache.part.id[id]
        }else {
          if(type === CacheParts.NAME) {
            return this.scoreCache.part.name[id]
          }
        }
      }
    }else {
      if(this.scoreCache.part.idx[id] !== undefined) {
        return this.scoreCache.part.idx[id]
      }else {
        if(this.scoreCache.part.id[id] !== undefined) {
          return this.scoreCache.part.id[id]
        }else {
          if(this.scoreCache.part.name[id] !== undefined) {
            return this.scoreCache.part.name[id]
          }
        }
      }
    }
  }, forEachPart:function(callback) {
    if(this.scoreCache.part === null) {
      this.cacheParts()
    }
    for(var i = 0;i < this.scoreCache.part.idx.length;i++) {
      callback(this.scoreCache.part.idx[i], i)
    }
  }, setBeat:function(measure_idx, beats) {
    this.forEachPart(function(part) {
      for(var i = 0;i < part.measure.length;i++) {
        var measureData = part.measure[i];
        var measure = new Fermata.Data.Measure(measureData);
        measure.setBeat(beats, measure.getBeatType())
      }
    })
  }, setBeatType:function(measure_idx, beatType) {
    this.forEachPart(function(part) {
      for(var i = 0;i < part.measure.length;i++) {
        var measureData = part.measure[i];
        var measure = new Fermata.Data.Measure(measureData);
        measure.setBeat(measure.getBeats(), beatType)
      }
    })
  }, setFifths:function(measure_idx, fifths) {
    this.forEachPart(function(part) {
      part.measure[measure_idx].$fermata.attributes.key.fifths = parseInt(fifths, 10)
    })
  }, setTitle:function(title) {
    this.score["score-partwise"]["movement-title"] = title + ""
  }}
}).call(this);
(function() {
  var Step = Fermata.Values.Step;
  var Octave = Fermata.Values.Octave;
  var PitchRangeError = Fermata.Error.PitchRangeError;
  var StepRangeError = Fermata.Error.StepRangeError;
  var OctaveRangeError = Fermata.Error.OctaveRangeError;
  var SoundType = Fermata.Values.SoundType;
  Fermata.Data.PitchPitched = function(noteData) {
    this.data = noteData
  };
  var PitchPitched = Fermata.Data.PitchPitched;
  PitchPitched.prototype.getType = function() {
    return SoundType.PITCH
  };
  PitchPitched.prototype.getStep = function() {
    return this.data.pitch.step
  };
  PitchPitched.prototype.getAlter = function() {
    if(typeof this.data.pitch.alter !== "undefined") {
      return this.data.pitch.alter
    }else {
      return null
    }
  };
  PitchPitched.prototype.getOctave = function() {
    return this.data.pitch.octave
  };
  PitchPitched.prototype.setStep = function(step) {
    if(!Step.check(step)) {
      throw new StepRangeError(step);
    }
    this.data.pitch.step = step
  };
  PitchPitched.prototype.setOctave = function(octave) {
    if(!Octave.check(octave)) {
      throw new OctaveRangeError(octave);
    }
    this.data.pitch.octave = octave
  };
  var calcOctaveShift = function(stepIdx) {
    stepIdx /= Step.values.length;
    return Math.floor(stepIdx)
  };
  var calcClearStep = function(shiftedStep) {
    var clearStep = shiftedStep % Step.values.length;
    if(clearStep < 0) {
      clearStep += Step.values.length
    }
    return clearStep
  };
  PitchPitched.prototype.changePitch = function(shiftVal) {
    var stepIdx = Step.idx[this.getStep()];
    var shiftedStep = stepIdx + parseInt(shiftVal, 10);
    var octaveShift = calcOctaveShift(shiftedStep);
    var newOctave = parseInt(this.getOctave(), 10) + octaveShift;
    var newStep = calcClearStep(shiftedStep);
    if(!Octave.check(newOctave)) {
      throw new PitchRangeError;
    }
    this.setOctave(newOctave);
    this.setStep(Step.values[newStep])
  }
}).call(this);
(function() {
  var Clef = Fermata.Mapping.Clef;
  var SoundType = Fermata.Values.SoundType;
  Fermata.Data.PitchRest = function(noteData, clef) {
    this.data = noteData;
    this.clef = clef
  };
  var PitchRest = Fermata.Data.PitchRest;
  PitchRest.ClefMapping = {"treble":4, "alto":4, "bass":3};
  PitchRest.prototype.getType = function() {
    return SoundType.REST
  };
  PitchRest.prototype.getStep = function() {
    if(typeof this.data["display-step"] !== "undefined") {
      return this.data["display-step"]
    }else {
      return Clef.getMusicXml(this.clef)
    }
  };
  PitchRest.prototype.getAlter = function() {
    return null
  };
  PitchRest.prototype.getOctave = function() {
    if(typeof this.data["display-octave"] !== "undefined") {
      return this.data["display-octave"]
    }else {
      return PitchRest.ClefMapping[this.clef]
    }
  }
}).call(this);
(function() {
  var SoundType = Fermata.Values.SoundType;
  Fermata.Data.PitchUnpitched = function(noteData) {
    this.data = noteData
  };
  var PitchUnpitched = Fermata.Data.PitchUnpitched;
  PitchUnpitched.prototype.getType = function() {
    return SoundType.UNPITCHED
  };
  PitchUnpitched.prototype.getStep = function() {
    return this.data["display-step"]
  };
  PitchUnpitched.prototype.getAlter = function() {
    return null
  };
  PitchUnpitched.prototype.getOctave = function() {
    return this.data["display-octave"]
  }
}).call(this);
(function() {
  var SoundType = Fermata.Values.SoundType;
  var PitchPitched = Fermata.Data.PitchPitched;
  var PitchRest = Fermata.Data.PitchRest;
  Fermata.Data.PitchEncapsulator = {};
  var PitchEncapsulator = Fermata.Data.PitchEncapsulator;
  PitchEncapsulator.encapsulate = function(noteData, clefName) {
    var soundType = SoundType.getSoundType(noteData);
    if(soundType === SoundType.PITCH) {
      return new PitchPitched(noteData)
    }else {
      if(soundType === SoundType.REST) {
        return new PitchRest(noteData, clefName)
      }else {
        return null
      }
    }
  }
}).call(this);
(function() {
  var Call = Fermata.Utils.Call;
  var Utils = Fermata.Utils;
  var Data = Fermata.Data;
  var defaultAttributes = {divisions:null, instrument:null, key:{cancel:null, fifths:null, mode:null}, time:{beats:null, "beat-type":null, interchangeable:null}, clef:[], staves:1, "part-symbol":{"top-staff":1, "bottom-staff":2, symbol:"brace"}};
  Data.prototype.reconstructAttributes = function(measures) {
    for(var i = 0;i < measures.length;i++) {
      var measure = measures[i];
      createAttributes(measure);
      if(i === 0) {
        initAttributesFirst(measure)
      }else {
        var previousMeasure = measures[i - 1];
        initAttributesOther(previousMeasure, measure)
      }
      if(hasAttributes(measure)) {
        fillAllAttributes(measure)
      }
    }
  };
  var createAttributes = function(measure) {
    if(typeof measure.$fermata === "undefined") {
      measure.$fermata = {}
    }
  };
  var initAttributesFirst = function(measure) {
    measure.$fermata.attributes = Utils.Clone(defaultAttributes)
  };
  var initAttributesOther = function(previousMeasure, measure) {
    measure.$fermata.attributes = Utils.Clone(previousMeasure.$fermata.attributes)
  };
  var hasAttributes = function(measure) {
    return typeof measure.attributes !== "undefined"
  };
  var fillAllAttributes = function(measure) {
    if(isArray(measure.attributes)) {
      for(var i = 0;i < measure.attributes.length;i++) {
        var attributesElem = measure.attributes[i];
        fillAttributes(attributesElem, measure.$fermata.attributes)
      }
    }else {
      fillAttributes(measure.attributes, measure.$fermata.attributes)
    }
  };
  var isArray = function(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]"
  };
  var fillAttributes = function(sourceAttr, destAttr) {
    var p = {object:sourceAttr, processes:attributesProcess, ctx:this, out:destAttr};
    Call.exploreSubNodes(p, destAttr)
  };
  var attributesKeys = function(node, i, attributes) {
    var processes = typeof node.fifths !== "undefined" ? attributesKeysTraditionalProcess : attributesKeysNonTraditionalProcess;
    var p = {object:node, ctx:this, processes:processes, out:attributes.key};
    Call.exploreSubNodes(p)
  };
  var attributesTime = function(node, i, attributes) {
    var p = {object:node, processes:attributesTimeProcess, ctx:this, out:attributes.time};
    Call.exploreSubNodes(p)
  };
  var attributesSymbol = function(node, attributes) {
    attributes["part-symbol"].symbol = typeof node === "string" ? node : node.$t;
    if(node["top-staff"]) {
      attributes["part-symbol"]["top-staff"] = node["top-staff"]
    }
    if(node["bottom-staff"]) {
      attributes["part-symbol"]["bottom-staff"] = node["bottom-staff"]
    }
  };
  var attributesClef = function(node, i, attributes) {
    var clef = {sign:null, line:null, "clef-octave-change":0};
    var p = {object:node, processes:attributesClefProcess, ctx:this, out:clef};
    Call.exploreSubNodes(p);
    attributes.clef.push(clef)
  };
  var attributesProcess = [{key:"divisions", type:Call.FuncTypes.$01, dataType:"int"}, {key:"key", type:Call.FuncTypes.$0n, func:attributesKeys}, {key:"time", type:Call.FuncTypes.$0n, func:attributesTime}, {key:"staves", type:Call.FuncTypes.$01, dataType:"int"}, {key:"part-symbol", type:Call.FuncTypes.$01, func:attributesSymbol}, {key:"instruments", type:Call.FuncTypes.$01, dataType:"string"}, {key:"clef", type:Call.FuncTypes.$0n, func:attributesClef}, {key:"staff-details", type:Call.FuncTypes.$0n, 
  func:null}, {key:"transpose", type:Call.FuncTypes.$0n, func:null}, {key:"directive", type:Call.FuncTypes.$0n, func:null}, {key:"dirmeasure-styleective", type:Call.FuncTypes.$0n, func:null}];
  var attributesKeysTraditionalProcess = [{key:"cancel", type:Call.FuncTypes.$01, func:null}, {key:"fifths", type:Call.FuncTypes.$1, dataType:"int"}, {key:"mode", type:Call.FuncTypes.$01, dataType:"string"}, {key:"key-octave", type:Call.FuncTypes.$0n, func:null}];
  var attributesKeysNonTraditionalProcess = [{key:"key-step", type:Call.FuncTypes.$1, func:null}, {key:"key-alter", type:Call.FuncTypes.$1, func:null}, {key:"key-accidental", type:Call.FuncTypes.$01, func:null}, {key:"key-octave", type:Call.FuncTypes.$0n, func:null}];
  var attributesTimeProcess = [{key:"beats", type:Call.FuncTypes.$1, dataType:"int"}, {key:"beat-type", type:Call.FuncTypes.$1, dataType:"int", dataKey:"beat-type"}];
  var attributesClefProcess = [{key:"sign", type:Call.FuncTypes.$1, dataType:"string"}, {key:"line", type:Call.FuncTypes.$01, dataType:"int"}, {key:"clef-octave-change", type:Call.FuncTypes.$01, dataType:"int", dataKey:"clef-octave-change"}, {key:"$number", type:Call.FuncTypes.$01, dataType:"int", dataKey:"$number"}]
}).call(this);
(function() {
  var AttributeDiff = Fermata.Utils.AttributeDiff;
  var BeatsValueError = Fermata.Error.BeatsValueError;
  var BeatTypeValueError = Fermata.Error.BeatTypeValueError;
  var SoundType = Fermata.Values.SoundType;
  var Utils = Fermata.Utils;
  Fermata.Data.Measure = function(measureData) {
    this.data = measureData;
    if(this.isRendered()) {
      this.attributes = measureData.$fermata.attributes
    }
  };
  var Measure = Fermata.Data.Measure;
  Measure.prototype.isRendered = function() {
    return typeof this.data.$fermata !== "undefined" && typeof this.data.$fermata.attributes !== "undefined"
  };
  Measure.prototype.isCompliant = function() {
    return this.getAuthorizedDuration() === this.getActualDuration()
  };
  Measure.prototype.initBeat = function(beats, beatType) {
    validateBeat(beats, beatType);
    if(typeof this.data.attributes === "undefined") {
      this.data.attributes = [{}]
    }
    if(typeof this.data.attributes[0].time === "undefined") {
      this.data.attributes[0].time = {}
    }
    this.data.attributes[0].time.beats = beats;
    this.data.attributes[0].time["beat-type"] = beatType
  };
  Measure.prototype.setBeat = function(beats, beatType) {
    validateBeat(beats, beatType);
    this.attributes.time.beats = beats;
    this.attributes.time["beat-type"] = beatType;
    this.adjustDivisions();
    this.adjustNotesDuration()
  };
  Measure.prototype.adjustDivisions = function() {
    var beatTypeDivisions = this.getBeatTypeDivisions();
    var currentDivisions = this.getDivisions();
    var newDivisions = lcm(beatTypeDivisions, currentDivisions);
    if(newDivisions !== currentDivisions) {
      this.multiplyDivisions(newDivisions / currentDivisions)
    }
  };
  var lcm = function(a, b) {
    var num1 = a > b ? a : b;
    var num2 = a > b ? b : a;
    for(var i = 1;i <= num2;i++) {
      if(num1 * i % num2 === 0) {
        return num1 * i
      }
    }
    return num2
  };
  Measure.prototype.multiplyDivisions = function(value) {
    var divisions = this.getDivisions();
    divisions *= value;
    this.setDivisions(divisions);
    for(var i = 0;i < this.data.note.length;i++) {
      var note = this.data.note[i];
      note.duration *= value
    }
  };
  Measure.prototype.getBeatTypeDivisions = function() {
    var quarterBeatType = wholeDivisionToQuarterCoeff(this.getBeatType());
    if(quarterBeatType >= 1) {
      return 1
    }else {
      return 1 / quarterBeatType
    }
  };
  Measure.prototype.adjustNotesDuration = function() {
    var authorizedDuration = this.getAuthorizedDuration();
    var actualDuration = this.getActualDuration();
    if(authorizedDuration > actualDuration) {
      this.fillMissingDivisionsWithRest(authorizedDuration - actualDuration)
    }else {
      if(authorizedDuration < actualDuration) {
        this.removeExcedentDivisionsInRest(actualDuration - authorizedDuration)
      }
    }
  };
  Measure.prototype.removeExcedentDivisionsInRest = function(divisionsToRemove) {
    var i = this.data.note.length - 1;
    while(i > 0 && isRest(this.data.note[i]) && divisionsToRemove > 0) {
      var note = this.data.note[i];
      if(divisionsToRemove < note.duration) {
        note.duration = divisionsToRemove
      }else {
        this.data.note.pop()
      }
      divisionsToRemove -= note.duration;
      i--
    }
  };
  var isRest = function(note) {
    return SoundType.getSoundType(note) === SoundType.REST
  };
  Measure.prototype.fillMissingDivisionsWithRest = function(divisionsToAdd) {
    var beatTypeDivisions = this.getBeatTypeDivisions();
    while(divisionsToAdd > 0) {
      var note = createRest();
      if(divisionsToAdd < beatTypeDivisions) {
        note.duration = divisionsToAdd
      }else {
        note.duration = beatTypeDivisions
      }
      divisionsToAdd -= note.duration;
      this.data.note.push(note)
    }
  };
  var createRest = function() {
    return{duration:1, rest:{}}
  };
  Measure.prototype.getAuthorizedDuration = function() {
    var quarterBeatType = wholeDivisionToQuarterCoeff(this.getBeatType());
    var divisionsBeatType = quarterBeatType * this.getDivisions();
    var authorizedDuration = divisionsBeatType * this.getBeats();
    return authorizedDuration
  };
  var wholeDivisionToQuarterCoeff = function(wholeDivision) {
    return 4 / wholeDivision
  };
  Measure.prototype.getActualDuration = function() {
    var actualDuration = 0;
    for(var i = 0;i < this.data.note.length;i++) {
      var note = this.data.note[i];
      var noteDuration = note.duration;
      actualDuration += noteDuration
    }
    return actualDuration
  };
  var validateBeat = function(beats, beatType) {
    if(!checkBeats(beats)) {
      throw new BeatsValueError(beats);
    }
    if(!checkBeatType(beatType)) {
      throw new BeatTypeValueError(beatType);
    }
  };
  var checkBeatType = function(beatType) {
    var intValue = parseInt(beatType, 10);
    return isInteger(beatType) && isPowerOfTwo(intValue)
  };
  var isPowerOfTwo = function(value) {
    return value !== 0 && (value & value - 1) === 0
  };
  var checkBeats = function(beats) {
    var intValue = parseInt(beats, 10);
    return intValue > 0 && isInteger(beats)
  };
  var isInteger = function(value) {
    return parseInt(value, 10) === parseFloat(value) && !isNaN(value)
  };
  Measure.prototype.getBeatType = function() {
    if(this.isRendered()) {
      return this.attributes.time["beat-type"]
    }else {
      return this.data.attributes[0].time["beat-type"]
    }
  };
  Measure.prototype.getBeats = function() {
    if(this.isRendered()) {
      return this.attributes.time.beats
    }else {
      return this.data.attributes[0].time.beats
    }
  };
  Measure.prototype.getDivisions = function() {
    if(this.isRendered()) {
      return this.attributes.divisions
    }else {
      return this.data.attributes[0].divisions
    }
  };
  Measure.prototype.setDivisions = function(divisions) {
    if(this.isRendered()) {
      this.attributes.divisions = divisions
    }else {
      this.data.attributes[0].divisions = divisions
    }
  };
  Measure.prototype.updateAttributes = function() {
    if(this.isRendered()) {
      this.data.attributes = [Utils.Clone(this.attributes)];
      Utils.epureAttributes(this.data.attributes[0]);
      filterAttributes(this.data.attributes[0])
    }
  };
  var filterAttributes = function(attr) {
    filterDefaultAttributes(attr);
    if(attr.clef.length === 1) {
      attr.clef = attr.clef[0]
    }else {
      if(attr.clef.length === 0) {
        delete attr.clef
      }
    }
  };
  var filterDefaultAttributes = function(attr) {
    var defaultClefOctaveChange = "0";
    var defaultStaves = "1";
    for(var i = 0;i < attr.clef.length;i++) {
      var clef = attr.clef[i];
      if(clef["clef-octave-change"] === defaultClefOctaveChange) {
        delete clef["clef-octave-change"]
      }
    }
    if(attr.staves === defaultStaves) {
      delete attr.staves
    }
    if(isDefaultPartSymbol(attr["part-symbol"])) {
      delete attr["part-symbol"]
    }
  };
  var isDefaultPartSymbol = function(partSymbol) {
    var defaultValues = [{key:"top-staff", value:"1"}, {key:"bottom-staff", value:"2"}, {key:"symbol", value:"brace"}];
    for(var i = 0;i < defaultValues.length;i++) {
      var defaultValue = defaultValues[i];
      if(partSymbol[defaultValue.key] !== defaultValue.value) {
        return false
      }
    }
    return true
  };
  Measure.prototype.updateFromPrevious = function(previousMeasureData) {
    var previousAttributes = previousMeasureData.$fermata.attributes;
    var attributes = this.attributes;
    var attributeDiff = new AttributeDiff(previousAttributes, attributes);
    var result = attributeDiff.getResult();
    if(result !== null) {
      this.data.attributes = [result];
      Utils.epureAttributes(this.data.attributes[0])
    }else {
      if(typeof this.data.attributes !== "undefined") {
        delete this.data.attributes
      }
    }
  };
  Measure.prototype.clearMeasure = function() {
    console.log(this.data);
    for(var i = 1;i < this.data.$fermata.vexNotes.length;i++) {
      for(var j = 1;j < this.data.$fermata.vexNotes[i].length;j++) {
        for(var k = 0;k < this.data.$fermata.vexNotes[i][j].length;k++) {
          this.data.$fermata.vexNotes[i][j][k].st.remove()
        }
      }
    }
  }
}).call(this);
(function() {
  var Utils = Fermata.Utils;
  Fermata.Data.prototype.addPart = function(instrument, id) {
    var _score = this.score["score-partwise"];
    if(id === undefined || id === null) {
      if(_score.hasOwnProperty("part-list") && _score["part-list"].hasOwnProperty("score-part") && _score["part-list"]["score-part"] !== null) {
        id = "P" + (this.score["score-partwise"]["part-list"]["score-part"].length + 1)
      }else {
        this.score["score-partwise"]["part-list"]["score-part"] = [];
        this.score["score-partwise"].part = [];
        id = "P1"
      }
    }
    var new_part_info = {"$id":id, "part-name":instrument["instrument-name"], "score-instrument":{"instrument-name":instrument["instrument-name"]}};
    var new_part = {"$id":id, "measure":[]};
    this.score["score-partwise"]["part-list"]["score-part"].push(new_part_info);
    this.score["score-partwise"].part.push(new_part)
  };
  Fermata.Data.prototype.updateMeasureNumber = function() {
    this.forEachPart(function(part) {
      for(var i = 0;i < part.measure.length;i++) {
        part.measure[i].$number = (i + 1).toString()
      }
    })
  };
  var defaultMeasure = {$number:"1", note:[], $fermata:{attributes:{divisions:"1", key:{"fifths":"0"}, time:{beats:4, "beat-type":4}, clef:[{sign:"G", line:"2"}], "part-symbol":{"top-staff":1, "bottom-staff":2, symbol:"brace"}}}};
  Fermata.Data.prototype.addMeasure = function(idx, number) {
    if(number === undefined) {
      number = 1
    }
    this.forEachPart(function(part) {
      if(!part.hasOwnProperty("measure") || part.measure === null || part.measure === undefined) {
        part.measure = [Utils.Clone(defaultMeasure)]
      }
      if(idx > part.measure.length) {
        idx = part.measure.length
      }
      var baseAttributes;
      if(part.measure.length === 0) {
        baseAttributes = defaultMeasure.$fermata.attributes
      }else {
        if(idx === 0) {
          baseAttributes = part.measure[0].$fermata.attributes
        }else {
          baseAttributes = part.measure[idx - 1].$fermata.attributes
        }
      }
      for(var i = 0;i < number;i++) {
        var measure = {"$number":(idx + i + 1).toString(), "note":[], $fermata:{attributes:Utils.Clone(baseAttributes)}};
        part.measure.splice(idx + i + 1, 0, measure);
        Fermata.Data.prototype.fillWithRest(part, idx)
      }
      for(i = number + idx;i < part.measure.length;i++) {
        part.measure[i].$number = (1 + i).toString()
      }
      if(idx + i >= part.measure.length) {
        part.measure[part.measure.length - 1].barline = {"bar-style":"light-heavy", "$location":"right"}
      }
    })
  };
  Fermata.Data.prototype.moveMeasure = function(idxFrom, idxDest) {
    if(idxDest > idxFrom) {
      idxDest--
    }
    this.forEachPart(function(part) {
      var measure = part.measure[idxFrom];
      part.measure.splice(idxFrom, 1);
      part.measure.splice(idxDest, 0, measure)
    })
  };
  Fermata.Data.prototype.removeMeasure = function(idx, number) {
    if(number === undefined) {
      number = 1
    }
    this.forEachPart(function(part) {
      if(idx >= 0 && idx < part.measure.length) {
        part.measure.splice(idx, number)
      }
      for(var i = idx;i < part.measure.length;i++) {
        part.measure[i].$number = (i + 1).toString()
      }
    })
  }
}).call(this);
(function() {
  var NotImplementedError = Fermata.Error.NotImplementedError;
  Fermata.Data.prototype.getTypeFromDuration = function(beats, duration) {
    if(duration === 8) {
      return"half"
    }else {
      if(duration === 4) {
        return"quarter"
      }else {
        if(duration === 2) {
          return"eighth"
        }else {
          var errorMsg = "error: can't access the number of stave, or beat in part. throw exception.";
          throw new NotImplementedError(errorMsg);
        }
      }
    }
  };
  Fermata.Data.prototype.fillWithRest = function(part, idx) {
    var nstave = 0;
    var time;
    var i = 0;
    if(part.measure[idx].$fermata !== undefined) {
      if(part.measure[idx].$fermata.attributes !== undefined && part.measure[idx].$fermata.attributes.time !== undefined) {
        time = part.measure[idx].$fermata.attributes.time
      }
      if(part.measure[idx].$fermata.vexStaves !== undefined) {
        nstave = part.mesure[idx].$fermata.vexStaves.length
      }
    }
    if(nstave === 0 || time === undefined) {
      for(i = 0;i < part.measure.length;i++) {
        if(part.measure[i].$fermata !== undefined) {
          if(part.measure[i].$fermata.attributes !== undefined && part.measure[i].$fermata.attributes.time !== undefined) {
            time = part.measure[i].$fermata.attributes.time
          }
          if(part.measure[i].$fermata.vexStaves !== undefined) {
            nstave = part.measure[i].$fermata.vexStaves.length
          }
          if(nstave !== 0 && time !== undefined) {
            break
          }
        }
      }
    }
    if(nstave === 0 || time === undefined) {
      var errorMsg = "error: can't access the number of stave, or beat in part. throw exception."
    }
    for(i = 0;i < nstave;i++) {
      var duration = time.beats * time.type;
      var rest = {"duration":duration, "rest":{}, "staff":i + 1, "type":this.getTypeFromDuration(time, duration), "voice":1};
      part.measure[idx].note.splice(i, 0, rest)
    }
  }
}).call(this);
(function() {
  var PitchEncapsulator = Fermata.Data.PitchEncapsulator;
  var SoundType = Fermata.Values.SoundType;
  var NotImplementedError = Fermata.Error.NotImplementedError;
  var Step = Fermata.Values.Step;
  var ValueLast = {FULL:0, HALF:1, QUARTER:2, EIGHTH:3};
  Fermata.Data.prototype.getDuration = function(type) {
    if(type === ValueLast.FULL) {
      return 4
    }else {
      if(type === ValueLast.HALF) {
        return 2
      }else {
        if(type === ValueLast.QUARTER) {
          return 1
        }else {
          if(type === ValueLast.EIGHTH) {
            return 0.5
          }else {
            var errorMsg = "this duration is not supported yet.";
            throw new NotImplementedError(errorMsg);
          }
        }
      }
    }
  };
  Fermata.Data.prototype.getQueue = function(voice) {
    return"up"
  };
  var distanceFromG = {"G":0, "C":Step.idx.G - Step.idx.C, "F":Step.idx.G - Step.idx.F + Step.values.length};
  var calcValueCorrection = function(sign, line) {
    var clefStepIdx = Step.idx[sign];
    var refGLine = 2;
    var gSign = "G";
    var refGStepFromOrigin = refGLine * 2;
    var signShift = distanceFromG[sign];
    var clefStepFromOrigin = line * 2;
    var actualGStepFromOrigin = clefStepFromOrigin + signShift;
    var stepCorrection = refGStepFromOrigin - actualGStepFromOrigin;
    var valueCorrection = stepCorrection / 2;
    return valueCorrection
  };
  Fermata.Data.prototype.getStep = function(val) {
    if(val === 0) {
      return"C"
    }
    if(val === 0.5 || val === -3) {
      return"D"
    }
    if(val === 1 || val === -2.5) {
      return"E"
    }
    if(val === 1.5 || val === -2) {
      return"F"
    }
    if(val === 2 || val === -1.5) {
      return"G"
    }
    if(val === 2.5 || val === -1) {
      return"A"
    }
    if(val === 3 || val === -0.5) {
      return"B"
    }
  };
  Fermata.Data.prototype.getPitch = function(pitch, sign, line) {
    var valueCorrection = calcValueCorrection(sign, line);
    pitch = parseInt(pitch, 10);
    pitch += valueCorrection;
    var p_octave = 3.5;
    var n_octave = -p_octave;
    var step = "L";
    if(pitch < 0) {
      step = this.getStep(pitch % n_octave)
    }else {
      step = this.getStep(pitch % p_octave)
    }
    var octave = 4 + Math.floor(pitch / p_octave);
    return{"octave":octave, "step":step}
  };
  Fermata.Data.prototype.getValue = function(type) {
    if(type === ValueLast.FULL) {
      return"full"
    }else {
      if(type === ValueLast.HALF) {
        return"half"
      }else {
        if(type === ValueLast.QUARTER) {
          return"quarter"
        }else {
          if(type === ValueLast.EIGHTH) {
            return"eighth"
          }else {
            return""
          }
        }
      }
    }
  };
  Fermata.Data.prototype.addNote = function(idxS, idxM, idxN, pitch, type, voice) {
    if(!(idxS === undefined || idxM === undefined || idxN === undefined || pitch === undefined || type === undefined)) {
      if(voice === undefined) {
        voice = 1
      }
      var part = this.getPart(idxS, Fermata.Data.cacheParts.IDX);
      if(part !== undefined) {
        if(idxM >= 0 && idxM < part.measure.length) {
          var measure = part.measure[idxM];
          var clef = measure.$fermata.attributes.clef[0];
          var divisions = measure.$fermata.attributes.divisions;
          var note = {"duration":this.getDuration(type) * divisions, "pitch":this.getPitch(pitch, clef.sign, clef.line), "stem":this.getQueue(voice), "type":this.getValue(type), "voice":voice};
          if(idxN < 0 || idxN > measure.note.length) {
            idxN = measure.note.length
          }
          part.measure[idxM].note.splice(idxN, 0, note);
          var _measure = new Fermata.Data.Measure(part.measure[idxM]);
          _measure.adjustNotesDuration()
        }
      }
    }
  };
  Fermata.Data.prototype.removeNote = function(idxS, idxM, idxN) {
    if(!(idxS === undefined || idxM === undefined || idxN === undefined)) {
      var part = this.getPart(idxS, Fermata.Data.cacheParts.IDX);
      if(part !== undefined) {
        if(idxM >= 0 && idxM < part.measure.length && idxN >= 0 && idxN < part.measure[idxM].note.length) {
          var rest = {"duration":part.measure[idxM].note[idxN].duration, "rest":{}, "staff":part.measure[idxM].note[idxN].staff, "type":part.measure[idxM].note[idxN].type, "voice":part.measure[idxM].note[idxN].voice};
          part.measure[idxM].note.splice(idxN, 1, rest);
          var _measure = new Fermata.Data.Measure(part.measure[idxM]);
          _measure.adjustNotesDuration()
        }
      }
    }
  };
  Fermata.Data.prototype.editNote = function(idxS, idxM, idxN, pitch, type, voice) {
    if(!(idxS === undefined || idxM === undefined || idxN === undefined)) {
      var part = this.getPart(idxS, Fermata.Data.cacheParts.IDX);
      if(part !== undefined) {
        if(idxM >= 0 && idxM < part.measure.length && idxN >= 0 && idxN < part.measure[idxM].note.length) {
          var measure = part.measure[idxM];
          var note = measure.note[idxN];
          var clef = measure.$fermata.attributes.clef[0];
          if(note.rest === undefined) {
            if(pitch !== undefined) {
              note.pitch = this.getPitch(pitch, clef.sign, clef.line)
            }
            if(type !== undefined) {
              note.type = this.getValue(type)
            }
            if(voice !== undefined) {
              note.voice = voice;
              note.stem = this.getQueue(voice)
            }
          }
        }
      }
    }
  };
  Fermata.Data.prototype.changeNotePitch = function(staveIdx, measureIdx, noteIdx, value) {
    var note = this.fetchNote(staveIdx, measureIdx, noteIdx);
    var pitch = PitchEncapsulator.encapsulate(note, null);
    if(pitch.getType() === SoundType.PITCH) {
      pitch.changePitch(value)
    }else {
      var errorMsg = "pitch change is not supported on this type of note";
      throw new NotImplementedError(errorMsg);
    }
  };
  Fermata.Data.prototype.fetchNote = function(staveIdx, measureIdx, noteIdx) {
    var part = this.getPart(staveIdx, Fermata.Data.cacheParts.IDX);
    var measure = part.measure[measureIdx];
    var note = measure.note[noteIdx];
    return note
  }
}).call(this);
(function() {
  var Measure = Fermata.Data.Measure;
  var Data = Fermata.Data;
  Data.prototype.saveAttributes = function() {
    this.forEachPart(function(part) {
      var measures = part.measure;
      var previousMeasure = null;
      for(var i = 0;i < measures.length;i++) {
        var measure = measures[i];
        if(i === 0) {
          saveAttributesFirst(measure)
        }else {
          saveAttributesOther(previousMeasure, measure)
        }
        previousMeasure = measure
      }
    })
  };
  var saveAttributesFirst = function(measureData) {
    var measure = new Measure(measureData);
    measure.updateAttributes()
  };
  var saveAttributesOther = function(previousMeasure, measureData) {
    var measure = new Measure(measureData);
    measure.updateFromPrevious(previousMeasure)
  }
}).call(this);
(function() {
  Fermata.Render = function(data) {
    this.data = data;
    this.parts = this.data.getParts()
  }
}).call(this);
(function() {
  Fermata.Render.prototype.Renderbackup = function(back) {
  }
}).call(this);
(function() {
  Fermata.Render.BeamType = {BEGIN:"begin", CONTINUE:"continue", END:"end"}
}).call(this);
(function() {
  Fermata.Render.BeamProcessor = function($fermata) {
    this.$fermata = $fermata;
    this.beamNumber = 0;
    this.beamType = "";
    this.vexNote = null;
    this.beamNotes = []
  };
  var BeamType = Fermata.Render.BeamType;
  var BeamProcessor = Fermata.Render.BeamProcessor;
  BeamProcessor.hasBeam = function(note) {
    return typeof note.beam !== "undefined"
  };
  BeamProcessor.prototype.addNote = function(note, vexNote) {
    this.vexNote = vexNote;
    if(note.beam instanceof Array) {
      this.processBeams(note.beam)
    }else {
      this.processBeam(note.beam)
    }
  };
  BeamProcessor.prototype.processBeams = function(beams) {
    for(var i = 0;i < beams.length;++i) {
      var beam = beams[i];
      this.processBeam(beam)
    }
  };
  BeamProcessor.prototype.processBeam = function(beam) {
    this.extractBeamData(beam);
    if(this.beamType === BeamType.BEGIN) {
      this.beginBeam()
    }else {
      if(this.beamType === BeamType.CONTINUE) {
        this.continueBeam()
      }else {
        this.endBeam()
      }
    }
  };
  BeamProcessor.prototype.beginBeam = function() {
    this.beamNotes[this.beamNumber] = [];
    this.beamNotes[this.beamNumber].push(this.vexNote)
  };
  BeamProcessor.prototype.continueBeam = function() {
    this.beamNotes[this.beamNumber].push(this.vexNote)
  };
  BeamProcessor.prototype.endBeam = function() {
    var notes = this.beamNotes[this.beamNumber];
    notes.push(this.vexNote);
    var vexBeam = new Vex.Flow.Beam(notes);
    this.$fermata.vexBeams.push(vexBeam)
  };
  BeamProcessor.prototype.extractBeamData = function(beam) {
    this.beamNumber = BeamProcessor.getBeamNumber(beam);
    this.beamType = BeamProcessor.getBeamType(beam)
  };
  BeamProcessor.getBeamNumber = function(beam) {
    return beam.$number
  };
  BeamProcessor.getBeamType = function(beam) {
    var values = [BeamType.BEGIN, BeamType.CONTINUE, BeamType.END];
    for(var i = 0;i < values.length;++i) {
      if(values[i] === beam.content) {
        return values[i]
      }
    }
    throw new Error("the beam type " + beam.content + " in not recognized");
  }
}).call(this);
(function() {
  Fermata.Render.TupletType = {START:"start", CONTINUE:"continue", STOP:"stop"}
}).call(this);
(function() {
  Fermata.Render.TupletProcessor = function($fermata) {
    this.currentVexNote = null;
    this.vexNotes = [];
    this.$fermata = $fermata
  };
  var TupletType = Fermata.Render.TupletType;
  var TupletProcessor = Fermata.Render.TupletProcessor;
  TupletProcessor.hasTuplet = function(note) {
    if(typeof note.notations === "undefined") {
      return false
    }else {
      if(TupletProcessor.isArray(note.notations)) {
        for(var i = 0;i < note.notations.length;i++) {
          var notation = note.notations[i];
          if(typeof notation.tuplet !== "undefined") {
            return true
          }
        }
        return false
      }else {
        return typeof note.notations.tuplet !== "undefined"
      }
    }
  };
  TupletProcessor.hasTimeModification = function(note) {
    return typeof note["time-modification"] !== "undefined"
  };
  TupletProcessor.getTuplet = function(note) {
    if(TupletProcessor.isArray(note.notations)) {
      for(var i = 0;i < note.notations.length;i++) {
        var notation = note.notations[i];
        if(typeof notation.tuplet !== "undefined") {
          return notation.tuplet
        }
      }
    }else {
      return note.notations.tuplet
    }
  };
  TupletProcessor.getTimeModification = function(note) {
    return note["time-modification"]
  };
  TupletProcessor.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]"
  };
  TupletProcessor.prototype.canProcess = function(note) {
    return TupletProcessor.hasTuplet(note) || TupletProcessor.hasTimeModification(note) && this.hasRunningTuplet()
  };
  TupletProcessor.prototype.addNote = function(note, vexNote) {
    this.currentVexNote = vexNote;
    var tupletType = this.getTupletType(note);
    if(tupletType === TupletType.START) {
      this.startTuplet()
    }else {
      if(tupletType === TupletType.CONTINUE) {
        this.continueTuplet()
      }else {
        if(tupletType === TupletType.STOP) {
          this.stopTuplet()
        }
      }
    }
  };
  TupletProcessor.prototype.getTupletType = function(note) {
    if(TupletProcessor.hasTuplet(note)) {
      var tuplet = TupletProcessor.getTuplet(note);
      if(tuplet.$type === TupletType.START) {
        return TupletType.START
      }else {
        if(tuplet.$type === TupletType.STOP) {
          return TupletType.STOP
        }
      }
    }else {
      if(TupletProcessor.hasTimeModification(note) && this.hasRunningTuplet()) {
        return TupletType.CONTINUE
      }
    }
  };
  TupletProcessor.prototype.hasRunningTuplet = function() {
    return this.vexNotes.length > 0
  };
  TupletProcessor.prototype.startTuplet = function() {
    this.vexNotes.push(this.currentVexNote)
  };
  TupletProcessor.prototype.continueTuplet = function() {
    this.vexNotes.push(this.currentVexNote)
  };
  TupletProcessor.prototype.stopTuplet = function() {
    this.vexNotes.push(this.currentVexNote);
    var vexTuplet = new Vex.Flow.Tuplet(this.vexNotes, {beats_occupied:this.vexNotes.length / 3 * 2});
    this.$fermata.vexTuplets.push(vexTuplet);
    this.vexNotes = []
  }
}).call(this);
(function() {
  Fermata.Render.SymbolSize = {FULL:"full", CUE:"cue", LARGE:"large"}
}).call(this);
(function() {
  Fermata.Render.NoteStorage = function() {
    this.init()
  };
  var NoteStorage = Fermata.Render.NoteStorage;
  NoteStorage.prototype.init = function() {
    this.data = [];
    this.allNotes = []
  };
  NoteStorage.prototype.clear = function() {
    this.data = []
  };
  NoteStorage.prototype.store = function(note, voice, staff) {
    this.checkCreateVoice(staff, voice);
    this.data[staff][voice].push(note);
    this.allNotes.push(note)
  };
  NoteStorage.prototype.getNotes = function(voice, staff) {
    if(!this.checkStaff(staff)) {
      throw new Error("there is no note stored for the staff" + staff.toString());
    }
    if(!this.checkVoice(staff, voice)) {
      throw new Error("there is no note stored for the voice " + voice.toString() + " of the staff " + staff.toString());
    }
    return this.data[staff][voice]
  };
  NoteStorage.prototype.getAllNotes = function() {
    return this.allNotes
  };
  NoteStorage.prototype.checkCreateVoice = function(staff, voice) {
    this.checkCreateStaff(staff);
    if(!this.checkVoice(staff, voice)) {
      this.data[staff][voice] = []
    }
  };
  NoteStorage.prototype.checkCreateStaff = function(staff) {
    if(!this.checkStaff(staff)) {
      this.data[staff] = []
    }
  };
  NoteStorage.prototype.checkVoice = function(staff, voice) {
    if(!this.checkStaff(staff)) {
      return false
    }
    return typeof this.data[staff][voice] !== "undefined"
  };
  NoteStorage.prototype.checkStaff = function(staff) {
    return typeof this.data[staff] !== "undefined"
  }
}).call(this);
(function() {
  Fermata.Render.NoteType = {NORMAL:"normal", CUE:"cue", GRACE:"grace"}
}).call(this);
(function() {
  var NoteType = Fermata.Render.NoteType;
  var SoundType = Fermata.Values.SoundType;
  var TupletProcessor = Fermata.Render.TupletProcessor;
  var PitchEncapsulator = Fermata.Data.PitchEncapsulator;
  Fermata.Render.NoteConverter = function() {
  };
  var NoteConverter = Fermata.Render.NoteConverter;
  NoteConverter.prototype.division = 0;
  NoteConverter.prototype.beats = 0;
  NoteConverter.prototype.beatType = 0;
  NoteConverter.prototype.clefName = "";
  NoteConverter.prototype.change = 0;
  NoteConverter.prototype.convert = function(noteData, attributes) {
    if(typeof attributes !== "undefined") {
      this.fillAttributes(attributes)
    }else {
      this.fillAttributesDefault()
    }
    var key = typeof noteData[0].staff === "undefined" ? 1 : noteData[0].staff;
    this.clefName = Fermata.Mapping.Clef.getVexflow(attributes.clef[key - 1].sign);
    this.change = attributes.clef[key - 1]["clef-octave-change"];
    var noteType = Fermata.Render.getNoteType(noteData[0]);
    if(noteType === NoteType.NORMAL) {
      return this.convertNormalNote(noteData)
    }
    return null
  };
  NoteConverter.prototype.fillAttributes = function(attributes) {
    this.beatType = attributes.time["beat-type"];
    this.beats = attributes.time.beats;
    this.divisions = attributes.divisions
  };
  NoteConverter.prototype.fillAttributesDefault = function() {
    this.beatType = 4;
    this.beats = 4;
    this.divisions = 1
  };
  NoteConverter.prototype.convertPitch = function(dataPitch) {
    var dataOctave = parseInt(dataPitch.getOctave(), 10) - parseInt(this.change, 10);
    var dataStep = dataPitch.getStep();
    var vexPitch = dataStep.toLowerCase() + "/" + dataOctave;
    return vexPitch
  };
  NoteConverter.prototype.convertDuration = function(noteData) {
    var dataDuration = this.getDuration(noteData);
    var actualDuration = dataDuration / this.divisions;
    var vexBaseDuration = Math.ceil(this.beatType / actualDuration);
    var baseDuration = this.beatType / vexBaseDuration;
    var dotDuration = actualDuration - baseDuration;
    var vexDuration = {vexBaseDuration:vexBaseDuration.toString(), dotDuration:dotDuration};
    if(dotDuration > 0) {
      vexDuration.vexBaseDuration += "d"
    }
    return vexDuration
  };
  NoteConverter.prototype.getDuration = function(noteData) {
    if(TupletProcessor.hasTimeModification(noteData)) {
      var timeModification = TupletProcessor.getTimeModification(noteData);
      var actualNotes = timeModification["actual-notes"];
      var normalNotes = timeModification["normal-notes"];
      return noteData.duration * actualNotes / normalNotes
    }else {
      return noteData.duration
    }
  };
  NoteConverter.prototype.convertNormalNote = function(noteData) {
    var dataPitch = PitchEncapsulator.encapsulate(noteData[0], this.clefName);
    var vexDuration = this.convertDuration(noteData[0]);
    var stem = null;
    if(typeof noteData[0].stem === "object") {
      stem = noteData[0].stem.content
    }else {
      stem = noteData[0].stem
    }
    var auto_stem = false;
    if(stem === "down") {
      stem = Vex.Flow.StaveNote.STEM_DOWN
    }else {
      if(stem === "up") {
        stem = Vex.Flow.StaveNote.STEM_UP
      }else {
        auto_stem = true
      }
    }
    if(dataPitch.getType() === SoundType.REST) {
      vexDuration.vexBaseDuration += "r"
    }
    var vexPitches = [];
    for(var i = 0;i < noteData.length;i++) {
      dataPitch = PitchEncapsulator.encapsulate(noteData[i], this.clefName);
      vexPitches.push(this.convertPitch(dataPitch))
    }
    var vexNote = new Vex.Flow.StaveNote({keys:vexPitches, duration:vexDuration.vexBaseDuration, stem_direction:stem, auto_stem:auto_stem, clef:this.clefName});
    if(vexDuration.dotDuration > 0) {
      vexNote.addDotToAll()
    }
    return vexNote
  }
}).call(this);
(function() {
  Fermata.Render.TieRenderer = function() {
    this.init()
  };
  var TieRenderer = Fermata.Render.TieRenderer;
  TieRenderer.prototype.init = function() {
    this.previousTieNotes = [];
    this.vexNote = null;
    this.voice = null
  };
  TieRenderer.prototype.render = function(note, vexNote, voice) {
    this.storeParams(note, vexNote, voice);
    if(this.isNoteTieStop(note)) {
      this.drawTie()
    }
    if(this.isNoteTieStart(note)) {
      this.saveTieNote()
    }
  };
  TieRenderer.prototype.storeParams = function(vexNote, voice) {
    this.vexNote = vexNote;
    this.voice = voice
  };
  TieRenderer.prototype.isNoteTieStart = function(note) {
    if(this.isNoteTie(note)) {
      if(note.tie instanceof Array) {
        return true
      }else {
        return note.tie.type === "start"
      }
    }else {
      return false
    }
  };
  TieRenderer.prototype.isNoteTieStop = function(note) {
    if(this.isNoteTie(note)) {
      if(note.tie instanceof Array) {
        return true
      }else {
        return note.tie.type === "stop"
      }
    }else {
      return false
    }
  };
  TieRenderer.prototype.isNoteTie = function(note) {
    return typeof note.tie !== "undefined"
  };
  TieRenderer.prototype.drawTie = function() {
    var previousVexNote = this.tieNoteStack[this.voice];
    var tie = new Vex.Flow.StaveTie({first_note:previousVexNote, last_note:this.vexNote, first_indices:[0], last_indices:[0]});
    tie.setContext(this.ctx);
    tie.draw()
  };
  TieRenderer.prototype.saveTieNote = function() {
    this.tieNoteStack[this.voice] = this.vexNote
  }
}).call(this);
(function() {
  var Call = Fermata.Utils.Call;
  Fermata.Render.prototype.renderGraceNote = function(graceNote) {
    var _this = this;
    var processes = [{key:"grace", type:Call.FuncTypes.$1, func:function(arg) {
      _this.renderGrace(arg)
    }}, {key:"tie", type:Call.FuncTypes.$0n, func:null}];
    Call.exploreSubNodes({object:graceNote, processes:processes, ctx:this});
    this.renderNoteCommon(graceNote);
    this.renderFullNote(graceNote)
  };
  Fermata.Render.prototype.renderGrace = function(grace) {
    this.renderGraceAttributes(grace)
  };
  Fermata.Render.prototype.renderGraceAttributes = function(grace) {
    var stealTimePrevious = 0;
    var stealTimeFollowing = 0;
    var makeTime = 0;
    var slash = false;
    if(typeof grace["steal-time-previous"] !== "undefined") {
      stealTimePrevious = grace["steal-time-previous"]
    }
    if(typeof grace["steal-time-following"] !== "undefined") {
      stealTimeFollowing = grace["steal-time-following"]
    }
    if(typeof grace["make-time"] !== "undefined") {
      makeTime = grace["make-time"]
    }
    if(typeof grace.slash !== "undefined") {
      if(grace.slash === "true") {
        slash = grace.slash
      }
    }
  }
}).call(this);
(function() {
  var Call = Fermata.Utils.Call;
  Fermata.Render.prototype.renderCueNote = function(cueNote) {
    var obj = this;
    var processes = [{key:"cue", type:Call.FuncTypes.$1, func:null}];
    Call.exploreSubNodes({object:cueNote, processes:processes, ctx:this});
    this.renderFullNote(cueNote);
    var duration = cueNote.duration
  }
}).call(this);
(function() {
  Fermata.Render.prototype.renderNormalNote = function(normalNote) {
    this.renderFullNote(normalNote);
    var duration = normalNote.duration;
    this.renderNoteCommon(normalNote)
  }
}).call(this);
(function() {
  var BeamProcessor = Fermata.Render.BeamProcessor;
  var Call = Fermata.Utils.Call;
  Fermata.Render.prototype.renderNoteProcess = {};
  Fermata.Render.prototype.renderNoteProcess[Fermata.Render.NoteType.NORMAL] = Fermata.Render.prototype.renderNormalNote;
  Fermata.Render.prototype.renderNoteProcess[Fermata.Render.NoteType.CUE] = Fermata.Render.prototype.renderCueNote;
  Fermata.Render.prototype.renderNoteProcess[Fermata.Render.NoteType.GRACE] = Fermata.Render.prototype.renderGraceNote;
  Fermata.Render.prototype.extractNoteVoice = function(note) {
    return typeof note[0].voice !== "undefined" ? note[0].voice : 1
  };
  Fermata.Render.prototype.extractNoteStaff = function(note) {
    return typeof note[0].staff !== "undefined" ? note[0].staff : 1
  };
  Fermata.Render.prototype.recordNote = function(vexNote, voice, staff) {
    if(typeof this.cur.measure.$fermata.vexNotes[staff] === "undefined") {
      this.cur.measure.$fermata.vexNotes[staff] = []
    }
    if(typeof this.cur.measure.$fermata.vexNotes[staff][voice] === "undefined") {
      this.cur.measure.$fermata.vexNotes[staff][voice] = []
    }
    this.cur.measure.$fermata.vexNotes[staff][voice].push(vexNote)
  };
  Fermata.Render.prototype.isChordNote = function(note) {
    return typeof note.chord !== "undefined"
  };
  Fermata.Render.prototype.renderNotes = function(notes) {
    var i = 0;
    while(i < notes.length) {
      var notesToRender = [];
      notesToRender.push(notes[i]);
      i++;
      while(i < notes.length && this.isChordNote(notes[i])) {
        notesToRender.push(notes[i]);
        i++
      }
      this.renderNote(notesToRender)
    }
  };
  Fermata.Render.prototype.renderNote = function(note) {
    var staff = this.extractNoteStaff(note);
    var voice = this.extractNoteVoice(note);
    var noteConverter = new Fermata.Render.NoteConverter;
    var vexNote = noteConverter.convert(note, this.cur.measure.$fermata.attributes);
    if(BeamProcessor.hasBeam(note[0])) {
      this.beamProcessor.addNote(note[0], vexNote)
    }
    if(this.tupletProcessor.canProcess(note[0])) {
      this.tupletProcessor.addNote(note[0], vexNote)
    }
    this.recordNote(vexNote, voice, staff)
  };
  Fermata.Render.getNoteType = function(note) {
    if(typeof note.grace !== "undefined") {
      return Fermata.Render.NoteType.GRACE
    }else {
      if(typeof note.cue !== "undefined") {
        return Fermata.Render.NoteType.CUE
      }else {
        return Fermata.Render.NoteType.NORMAL
      }
    }
  };
  Fermata.Render.prototype.renderFullNote = function(fullNote) {
    var _this = this;
    var processes = [{key:"pitch", type:Call.FuncTypes.$01, func:function(arg) {
      _this.renderPitch(arg)
    }}, {key:"unpitched", type:Call.FuncTypes.$01, func:null}, {key:"rest", type:Call.FuncTypes.$01, func:null}];
    Call.exploreSubNodes({object:fullNote, processes:processes, ctx:this});
    var chord = false;
    if(typeof fullNote.chord !== "undefined") {
      chord = true
    }
  };
  Fermata.Render.prototype.renderNoteCommon = function(note) {
    var _this = this;
    var processes = [{key:"type", type:Call.FuncTypes.$01, func:function(arg) {
      _this.renderType(arg)
    }}];
    Call.exploreSubNodes({object:note, processes:processes, ctx:this})
  };
  Fermata.Render.prototype.renderPitch = function(pitch) {
    var alter = 0;
    var step = pitch.step;
    var octave = pitch.octave;
    if(typeof pitch.alter !== "undefined") {
      alter = pitch.alter
    }
  };
  Fermata.Render.prototype.renderUnpitched = function(unpitched) {
    var displayStep = null;
    var displayOctave = null;
    if(typeof unpitched["display-step"] !== "undefined") {
      displayStep = unpitched["display-step"]
    }
    if(typeof unpitched["display-octave"] !== "undefined") {
      displayOctave = unpitched["display-octave"]
    }
  };
  Fermata.Render.prototype.renderRest = function(rest) {
    var displayStep = null;
    var displayOctave = null;
    var measure = false;
    if(typeof rest["display-step"] !== "undefined") {
      displayStep = rest["display-step"]
    }
    if(typeof rest["display-octave"] !== "undefined") {
      displayOctave = rest["display-octave"]
    }
    if(typeof rest.measure !== "undefined") {
      if(rest.measure === "yes") {
        measure = true
      }
    }
  };
  Fermata.Render.prototype.renderTie = function(tie) {
  };
  Fermata.Render.prototype.renderType = function(type) {
    var size = Fermata.Render.SymbolSize.FULL;
    if(typeof type.size !== "undefined") {
      if(type.size === Fermata.Render.SymbolSize.CUE) {
        size = Fermata.Render.SymbolSize.CUE
      }else {
        if(type.size === Fermata.Render.SymbolSize.LARGE) {
          size = Fermata.Render.SymbolSize.LARGE
        }
      }
    }
  };
  Fermata.Render.prototype.getNote = function(number) {
    var pos = 0;
    while(true) {
      for(var first in this.cur.measure.$fermata.vexNotes) {
        if(this.cur.measure.$fermata.vexNotes.hasOwnProperty(first)) {
          for(var second in this.cur.measure.$fermata.vexNotes[first]) {
            if(this.cur.measure.$fermata.vexNotes[first].hasOwnProperty(second)) {
              for(var third = 0;third < this.cur.measure.$fermata.vexNotes[first][second].length;third++) {
                if(pos === number) {
                  return this.cur.measure.$fermata.vexNotes[first][second][third]
                }
                pos++
              }
            }
          }
        }
      }
    }
  };
  Fermata.Render.prototype.getNoteTest = function(number, measure) {
    var pos = 0;
    while(true) {
      for(var first in measure.$fermata.vexNotes) {
        if(measure.$fermata.vexNotes.hasOwnProperty(first)) {
          for(var second in measure.$fermata.vexNotes[first]) {
            if(measure.$fermata.vexNotes[first].hasOwnProperty(second)) {
              for(var third = 0;third < measure.$fermata.vexNotes[first][second].length;third++) {
                if(pos === number) {
                  return measure.$fermata.vexNotes[first][second][third]
                }
                pos++
              }
            }
          }
        }
      }
    }
  };
  Fermata.Render.prototype.setNoteTest = function(number, measure, VexNote) {
    var pos = 0;
    while(true) {
      for(var first in measure.$fermata.vexNotes) {
        if(measure.$fermata.vexNotes.hasOwnProperty(first)) {
          for(var second in measure.$fermata.vexNotes[first]) {
            if(measure.$fermata.vexNotes[first].hasOwnProperty(second)) {
              for(var third = 0;third < measure.$fermata.vexNotes[first][second].length;third++) {
                if(pos === number) {
                  measure.$fermata.vexNotes[first][second][third] = VexNote;
                  return
                }
                pos++
              }
            }
          }
        }
      }
    }
  }
}).call(this);
(function() {
  var Call = Fermata.Utils.Call;
  Fermata.Render.prototype.renderDirectionDefault = {$placement:null, noteBefore:null, noteAfter:null, "direction-type":{wedge:{$type:null}, words:{content:null, "$default-y":0, "$font-size":0, "font-weight":null}}, offset:null, voice:1, staff:1};
  var _render = Fermata.Render.prototype;
  Fermata.Render.prototype.renderDirectionTypeWedgeProcess = [{key:"$type", type:Call.FuncTypes.$01, dataType:"string", dataKey:"$type"}];
  Fermata.Render.prototype.renderDirectionTypeWordProcess = [{key:"content", type:Call.FuncTypes.$1, dataType:"string", dataKey:"content"}];
  Fermata.Render.prototype.renderDirectionTypeWedge = function(node) {
    Call.exploreSubNodes({object:node, processes:_render.renderDirectionTypeWedgeProcess, ctx:this, out:this.cur.measure.$fermata.direction[this.cur.measure.$fermata.direction.length - 1]["direction-type"].wedge})
  };
  Fermata.Render.prototype.renderDirectionTypeWord = function(node) {
    Call.exploreSubNodes({object:node, processes:_render.renderDirectionTypeWordProcess, ctx:this, out:this.cur.measure.$fermata.direction[this.cur.measure.$fermata.direction.length - 1]["direction-type"].words})
  };
  Fermata.Render.prototype.renderDirectionTypeProcess = [{key:"wedge", type:Call.FuncTypes.$01, func:_render.renderDirectionTypeWedge}, {key:"words", type:Call.FuncTypes.$01, func:_render.renderDirectionTypeWord}];
  Fermata.Render.prototype.renderDirectionType = function(node) {
    Call.exploreSubNodes({object:node, processes:_render.renderDirectionTypeProcess, ctx:this, out:this.cur.measure.$fermata.direction[this.cur.measure.$fermata.direction.length - 1]["direction-type"]})
  };
  Fermata.Render.prototype.renderDirectionProcess = [{key:"direction-type", type:Call.FuncTypes.$1n, func:_render.renderDirectionType}, {key:"offset", type:Call.FuncTypes.$01, dataType:"int", dataKey:"offset"}, {key:"voice", type:Call.FuncTypes.$01, dataType:"int", dataKey:"voice"}, {key:"staff", type:Call.FuncTypes.$01, dataType:"int", dataKey:"staff"}, {key:"$placement", type:Call.FuncTypes.$1, dataType:"string", dataKey:"$placement"}, {key:"noteBefore", type:Call.FuncTypes.$1, dataType:"int", 
  dataKey:"noteBefore"}, {key:"noteAfter", type:Call.FuncTypes.$1, dataType:"int", dataKey:"noteAfter"}];
  Fermata.Render.prototype.renderDirection = function(direction) {
    if(this.cur.measure.$fermata.direction === undefined) {
      this.cur.measure.$fermata.direction = []
    }
    this.cur.measure.$fermata.direction.push(Fermata.Utils.Clone(_render.renderDirectionDefault));
    Call.exploreSubNodes({object:direction, processes:_render.renderDirectionProcess, ctx:this, out:this.cur.measure.$fermata.direction[this.cur.measure.$fermata.direction.length - 1]})
  }
}).call(this);
(function() {
  var Call = Fermata.Utils.Call;
  Fermata.Render.prototype.renderBarlineDefault = {location:"right", barStyle:null, repeat:{direction:null, time:1, winged:"none"}};
  var _render = Fermata.Render.prototype;
  Fermata.Render.prototype.renderBarlineRepeat = function(repeat) {
    Call.exploreSubNodes({object:repeat, processes:_render.renderBarlineRepeatProcess, ctx:this, out:this.cur.measure.$fermata.barline[this.cur.measure.$fermata.barline.length - 1].repeat})
  };
  Fermata.Render.prototype.barlineProcess = [{key:"$location", type:Call.FuncTypes.$01, dataType:"string", dataKey:"location"}, {key:"bar-style", type:Call.FuncTypes.$01, dataType:"string"}, {key:"repeat", type:Call.FuncTypes.$01, func:_render.renderBarlineRepeat}];
  Fermata.Render.prototype.renderBarlineRepeatProcess = [{key:"$direction", type:Call.FuncTypes.$1, dataType:"string", dataKey:"direction"}, {key:"time", type:Call.FuncTypes.$01, dataType:"int"}, {key:"winged", type:Call.FuncTypes.$01, dataType:"string"}];
  Fermata.Render.prototype.renderBarline = function(score) {
    if(this.cur.measure.$fermata.barline === undefined) {
      this.cur.measure.$fermata.barline = []
    }
    this.cur.measure.$fermata.barline.push(Fermata.Utils.Clone(_render.renderBarlineDefault));
    Call.exploreSubNodes({object:score, processes:_render.barlineProcess, ctx:this, out:this.cur.measure.$fermata.barline[this.cur.measure.$fermata.barline.length - 1]})
  }
}).call(this);
(function() {
  var Call = Fermata.Utils.Call;
  Fermata.Render.prototype.isPartGroupExist = function(number) {
    for(var i = 0;i < this.PartListData.length;i++) {
      if(this.PartListData[i].partGroup.number === number) {
        return i
      }
    }
    return-1
  };
  Fermata.Render.prototype.renderScorePart = function(part) {
    Call.exploreSubNodes({object:part, processes:this.renderScorePartProcess, ctx:this})
  };
  Fermata.Render.prototype.renderPartGroup = function(group) {
    var val;
    if(group.type === "start" && (val = this.isPartGroupExist(group)) > 0) {
      Call.exploreSubNodes({object:group, processes:this.renderPartGroupProcess, ctx:this})
    }
  };
  var _render = Fermata.Render.prototype;
  Fermata.Render.prototype.renderPartListProcess = [{key:"score-part", type:Call.FuncTypes.$1n, func:Fermata.Render.prototype.renderScorePart}, {key:"part-group", type:Call.FuncTypes.$0n, func:Fermata.Render.prototype.renderPartGroup}];
  Fermata.Render.prototype.renderScorePartProcess = [{key:"identification", type:Call.FuncTypes.$01, func:null}, {key:"part-name", type:Call.FuncTypes.$1, dataType:"string"}, {key:"part-name-display", type:Call.FuncTypes.$01, func:null}, {key:"part-abbreviation", type:Call.FuncTypes.$01, dataType:"string"}, {key:"part-abbreviation-display", type:Call.FuncTypes.$01, func:null}, {key:"group", type:Call.FuncTypes.$0n, func:null}, {key:"score-instrument", type:Call.FuncTypes.$0n, dataType:"string"}, 
  {key:"part-group", type:Call.FuncTypes.$0n, dataType:"string"}];
  Fermata.Render.prototype.RenderPartGroupProcess = [{key:"group-name", type:Call.FuncTypes.$01, func:null}, {key:"group-name-display", type:Call.FuncTypes.$01, func:null}, {key:"group-abbreviation", type:Call.FuncTypes.$01, func:null}, {key:"group-abbreviation-display", type:Call.FuncTypes.$01, func:null}, {key:"group-symbol", type:Call.FuncTypes.$01, dataType:"string"}, {key:"group-barline", type:Call.FuncTypes.$01, dataType:"bool"}, {key:"group-time", type:Call.FuncTypes.$01, func:null}];
  Fermata.Render.prototype.renderPartList = function(list) {
    Call.exploreSubNodes({object:list, processes:this.renderPartListProcess, ctx:this})
  };
  Fermata.Render.prototype.GroupPartData = {symbol:null, bairline:null};
  Fermata.Render.prototype.scorePartData = {id:null, partName:null, abbreviation:null, scoreInstrument:null, midiInstrument:null, partGroup:{number:null, symbol:null, bairline:null}};
  Fermata.Render.prototype.PartListData = []
}).call(this);
(function() {
  Fermata.Render.prototype.renderHeaderWork = function(work) {
  };
  Fermata.Render.prototype.renderHeaderMovNum = function(mov) {
  };
  Fermata.Render.prototype.renderHeaderMovTitle = function(mov) {
  };
  Fermata.Render.prototype.renderHeaderIdentifi = function(ident) {
  };
  Fermata.Render.prototype.renderHeaderdefaults = function(param) {
  };
  Fermata.Render.prototype.renderHeaderCredit = function(credit) {
  }
}).call(this);
(function() {
  var Call = Fermata.Utils.Call;
  Fermata.Render.prototype.renderAll = function() {
    this.renderScoreHeader(this.data.getScorePartWise());
    this.renderMeasures();
    this.renderMeasuresWidth();
    this.renderAllStaves()
  };
  Fermata.Render.prototype.renderOneMeasure = function(nbMeasure, nbPart, init) {
    if(init === true) {
      var _measure = new Fermata.Data.Measure(this.data.getPart(nbPart).measure[nbMeasure]);
      _measure.clearMeasure()
    }
    this.renderMeasure(nbMeasure, nbPart);
    this.renderMeasureWidth(nbMeasure);
    this.renderStaves(nbMeasure, nbPart)
  };
  var BeamProcessor = Fermata.Render.BeamProcessor;
  var TupletProcessor = Fermata.Render.TupletProcessor;
  var _render = Fermata.Render.prototype;
  Fermata.Render.prototype.renderScoreHeaderProcess = [{key:"attributes", type:Call.FuncTypes.$0n, func:null}, {key:"part-list", type:Call.FuncTypes.$1, func:_render.renderPartList}, {key:"work", type:Call.FuncTypes.$01, func:_render.renderPartList}, {key:"movement-number", type:Call.FuncTypes.$01, func:_render.renderHeaderMovNum}, {key:"movement-title", type:Call.FuncTypes.$01, func:_render.renderHeaderMovTitle}, {key:"identification", type:Call.FuncTypes.$01, func:_render.renderHeaderIdentifi}, 
  {key:"defaults", type:Call.FuncTypes.$01, func:_render.renderHeaderdefaults}, {key:"credit", type:Call.FuncTypes.$0n, func:_render.renderHeaderCredit}];
  Fermata.Render.prototype.renderScoreHeader = function(scoreHeader) {
    Call.exploreSubNodes({object:scoreHeader, processes:this.renderScoreHeaderProcess, ctx:this})
  };
  Fermata.Render.prototype.renderPart = function(partIdx) {
    for(var i = 0;i < this.parts.idx[partIdx].measure.length;++i) {
      this.renderMeasure(i, partIdx)
    }
  };
  Fermata.Render.prototype.renderPrint = function(print) {
    return
  };
  Fermata.Render.prototype.renderMeasures = function() {
    for(var i = 0;i < this.parts.idx.length;i++) {
      for(var j = 0;j < this.parts.idx[i].measure.length;++j) {
        this.renderMeasure(j, i)
      }
    }
  };
  Fermata.Render.prototype.renderMeasureProcess = [{key:"note", type:Call.FuncTypes.$01, func:_render.renderNotes}, {key:"backup", type:Call.FuncTypes.$0n, func:_render.Renderbackup}, {key:"forward", type:Call.FuncTypes.$0n, func:null}, {key:"direction", type:Call.FuncTypes.$0n, func:_render.renderDirection}, {key:"harmony", type:Call.FuncTypes.$0n, func:_render.renderHarmony}, {key:"figured-bass", type:Call.FuncTypes.$0n, func:null}, {key:"print", type:Call.FuncTypes.$0n, func:_render.renderPrint}, 
  {key:"sound", type:Call.FuncTypes.$0n, func:null}, {key:"barline", type:Call.FuncTypes.$0n, func:_render.renderBarline}, {key:"grouping", type:Call.FuncTypes.$0n, func:null}, {key:"link", type:Call.FuncTypes.$0n, func:null}, {key:"bookmark", type:Call.FuncTypes.$0n, func:null}];
  Fermata.Render.prototype.renderMeasure = function(measureIdx, partIdx) {
    this.cur = {measure:this.parts.idx[partIdx].measure[measureIdx], measureIdx:measureIdx, part:this.parts.idx[partIdx], partIdx:partIdx};
    var $fermata = this.cur.measure.$fermata;
    $fermata.vexNotes = [];
    $fermata.vexStaves = [];
    $fermata.vexVoices = [];
    $fermata.vexBeams = [];
    $fermata.vexHairpin = [];
    $fermata.vexTuplets = [];
    this.beamProcessor = new BeamProcessor(this.cur.measure.$fermata);
    this.tupletProcessor = new TupletProcessor(this.cur.measure.$fermata);
    Call.exploreSubNodes({object:this.cur.measure, processes:this.renderMeasureProcess, ctx:this})
  };
  Fermata.Render.prototype.renderMeasuresWidth = function() {
    if(this.parts.idx.length > 0) {
      for(var i = 0;i < this.parts.idx[0].measure.length;i++) {
        this.renderMeasureWidth(i)
      }
    }
  };
  Fermata.Render.prototype.renderMeasureWidth = function(columnId) {
    var maxWidth;
    var maxNotes = 0;
    var i, j;
    var notePerVoice = [];
    var curVoice = 1;
    for(j = 0;j < this.parts.idx.length;j++) {
      if(!isNaN(this.parts.idx[j].measure[columnId].$width)) {
        if(typeof maxWidth === "undefined" || this.parts.idx[j].measure[columnId].$width > maxWidth) {
          maxWidth = this.parts.idx[j].measure[columnId].$width
        }
      }
      for(i = 0;i < this.parts.idx[j].measure[columnId].note.length;i++) {
        curVoice = typeof this.parts.idx[j].measure[columnId].note[i].voice !== "undefined" ? this.parts.idx[j].measure[columnId].note[i].voice : 1;
        if(typeof notePerVoice[curVoice] === "undefined") {
          notePerVoice[curVoice] = this.noteWidth(this.parts.idx[j].measure[columnId].note[i])
        }else {
          notePerVoice[curVoice] += this.noteWidth(this.parts.idx[j].measure[columnId].note[i])
        }
      }
      for(i = 0;i < notePerVoice.length;i++) {
        if(typeof notePerVoice[i] !== "undefined" && notePerVoice[i] > maxNotes) {
          maxNotes = notePerVoice[i]
        }
      }
    }
    if(typeof maxWidth === "undefined") {
      maxWidth = maxNotes + this.armWidth(columnId);
      if(maxWidth === 0) {
        maxWidth = 40
      }
    }
    for(j = 0;j < this.parts.idx.length;j++) {
      this.parts.idx[j].measure[columnId].$width = maxWidth
    }
  };
  Fermata.Render.prototype.armWidth = function(columnId) {
    var width = 0;
    if(typeof this.parts.idx[0].measure[columnId].attributes !== "undefined") {
      if(typeof this.parts.idx[0].measure[columnId].attributes[0].clef !== "undefined") {
        width += 40
      }
      if(typeof this.parts.idx[0].measure[columnId].attributes[0].key !== "undefined") {
        width += 40
      }
      if(typeof this.parts.idx[0].measure[columnId].attributes[0].time !== "undefined") {
        width += 40
      }
    }
    return width
  };
  Fermata.Render.prototype.noteWidth = function(note) {
    var width = 40;
    if(typeof note.accidental !== "undefined") {
      width += 30
    }
    return width
  };
  Fermata.Render.prototype.renderAllStaves = function() {
    for(var i = 0;i < this.parts.idx.length;i++) {
      for(var j = 0;j < this.parts.idx[i].measure.length;++j) {
        this.renderStaves(j, i)
      }
    }
  };
  Fermata.Render.prototype.renderStaves = function(measureIdx, partIdx) {
    var part = this.parts.idx[partIdx], measure = part.measure[measureIdx], $fermata = measure.$fermata, $fermataLastMeasure = measureIdx === 0 ? null : part.measure[measureIdx - 1].$fermata;
    measure.$width = parseInt(measure.$width, 10);
    part.$fermata = part.$fermata || {};
    part.$fermata.staveY = partIdx === 0 ? 0 : this.parts.idx[partIdx - 1].$fermata.nextStaveY + 100;
    part.$fermata.nextStaveY = part.$fermata.staveY;
    for(var i = 0;i < $fermata.attributes.staves;i++) {
      if($fermata.vexStaves[i] === undefined) {
        if(measureIdx === 0) {
          $fermata.vexStaves[i] = new Vex.Flow.Stave(20, part.$fermata.nextStaveY += i * 100, measure.$width)
        }else {
          $fermata.vexStaves[i] = new Vex.Flow.Stave($fermataLastMeasure.vexStaves[i].x + $fermataLastMeasure.vexStaves[i].width, $fermataLastMeasure.vexStaves[i].y, measure.$width)
        }
      }
      var clefName = Fermata.Mapping.Clef.getVexflow($fermata.attributes.clef[i].sign);
      $fermata.voiceWidth = 0;
      if(measureIdx === 0 || clefName !== $fermataLastMeasure.vexStaves[i].clef) {
        $fermata.vexStaves[i].addClef(clefName);
        $fermata.voiceWidth += 25;
        if($fermata.attributes.key.mode !== null) {
          var keySign = Fermata.Mapping.Clef.Sign.getVexflow($fermata.attributes.key.fifths, $fermata.attributes.key.mode);
          (new Vex.Flow.KeySignature(keySign)).addToStave($fermata.vexStaves[i])
        }
        $fermata.vexStaves[i].addTimeSignature($fermata.attributes.time.beats + "/" + $fermata.attributes.time["beat-type"]);
        $fermata.voiceWidth += 25
      }else {
        $fermata.vexStaves[i].clef = clefName
      }
    }
    if($fermata.direction !== undefined) {
      for(i = 0;i < $fermata.direction.length;i++) {
        var data = $fermata.direction;
        if(data[i]["direction-type"].wedge.$type !== null && data[i]["direction-type"].wedge.$type !== "stop") {
          var renderOption = {height:10, y_shift:0, left_shift_px:0, right_shift_px:0};
          var tmpNote = {first_note:_render.getNoteTest(Fermata.Drawer.prototype.getGoodPos(data[i].noteAfter, data[i].noteBefore, renderOption, true), measure), last_note:_render.getNoteTest(Fermata.Drawer.prototype.getGoodPos(data[i + 1].noteAfter, data[i + 1].noteBefore, renderOption, false), measure)};
          if(tmpNote.first_note === tmpNote.last_note) {
            renderOption.right_shift_px += 70
          }
          var hp = new Vex.Flow.StaveHairpin(tmpNote, Fermata.Mapping.Direction.getVexflow(data[i]["direction-type"].wedge.$type));
          hp.setPosition(Fermata.Mapping.Direction.getVexflow(data[i].$placement));
          hp.setRenderOptions(renderOption);
          $fermata.vexHairpin.push(hp)
        }else {
          if(data[i]["direction-type"].words.content !== null) {
            var note = _render.getNoteTest(data[i].noteAfter, measure);
            note.addAnnotation(0, Fermata.Drawer.prototype.AddNotation(data[i]["direction-type"].words.content, 1, 1))
          }
        }
      }
    }
    for(var staffIdx = 1;staffIdx < $fermata.vexNotes.length;staffIdx++) {
      for(var voiceIdx in $fermata.vexNotes[staffIdx]) {
        if($fermata.vexNotes[staffIdx].hasOwnProperty(voiceIdx)) {
          var voice = new Vex.Flow.Voice({num_beats:measure.$fermata.attributes.time.beats, beat_value:measure.$fermata.attributes.time["beat-type"], resolution:Vex.Flow.RESOLUTION});
          voice.addTickables($fermata.vexNotes[staffIdx][voiceIdx]);
          var formatter = new Vex.Flow.Formatter;
          formatter.joinVoices([voice]);
          formatter.format([voice], measure.$width - $fermata.voiceWidth - 15);
          $fermata.vexVoices.push(voice)
        }
      }
    }
  }
}).call(this);
(function() {
  Fermata.document = Vex.document;
  Fermata.Drawer = function(data, container) {
    this.data = data;
    this.parts = this.data.getParts();
    this.staves = [];
    this.container = container;
    if(typeof module === "undefined") {
      this.renderer = new Vex.Flow.Renderer(this.container, Vex.Flow.Renderer.Backends.RAPHAEL)
    }else {
      this.renderer = new Vex.Flow.Renderer(this.container, Vex.Flow.Renderer.Backends.CANVAS)
    }
    this.ctx = this.renderer.getContext()
  }
}).call(this);
(function() {
  Fermata.Drawer.PART_HEIGHT = 100;
  var _render = Fermata.Render.prototype;
  Fermata.Drawer.prototype.drawAll = function() {
    this.renderer.ctx.clear();
    this.container.height += this.parts.idx.length * Fermata.Drawer.PART_HEIGHT;
    for(var i = 0;i < this.parts.idx.length;i++) {
      this.staves[i] = [];
      this.drawPart(this.parts.idx[i], i)
    }
    if(this.parts.idx.length > 1) {
      var lastPartlastMeasure = this.parts.idx[this.parts.idx.length - 1].measure[this.parts.idx[this.parts.idx.length - 1].measure.length - 1];
      var line = new Vex.Flow.StaveConnector(this.parts.idx[0].measure[0].$fermata.vexStaves[0], lastPartlastMeasure.$fermata.vexStaves[lastPartlastMeasure.$fermata.vexStaves.length - 1]);
      line.setType(Vex.Flow.StaveConnector.type.SINGLE);
      line.setContext(this.ctx);
      line.draw()
    }
  };
  Fermata.Drawer.prototype.drawPart = function(part, partIdx) {
    for(var i = 0;i < part.measure.length;++i) {
      this.drawMeasure(part.measure[i], i, partIdx)
    }
  };
  Fermata.Drawer.prototype.drawMeasure = function(measure, measureIdx, partIdx) {
    var i;
    for(i = 0;i < measure.$fermata.attributes.staves;i++) {
      if(measure.$fermata.barline !== undefined) {
        for(var u = 0;u < measure.$fermata.barline.length;u++) {
          var _barline = measure.$fermata.barline[u];
          var type = "normal";
          if(_barline.repeat.direction !== null) {
            type = _barline.repeat.direction
          }
          switch(_barline.location) {
            case "right":
              measure.$fermata.vexStaves[i].setEndBarType(Fermata.Mapping.Barline.getVexflow(type, _barline.barStyle));
              break;
            case "left":
              measure.$fermata.vexStaves[i].setBegBarType(Fermata.Mapping.Barline.getVexflow(type, _barline.barStyle));
              break;
            default:
              break
          }
        }
      }
      measure.$fermata.vexStaves[i].setContext(this.ctx);
      measure.$fermata.vexStaves[i].draw();
      if(measure.$fermata.attributes.staves > 1) {
        var line = new Vex.Flow.StaveConnector(measure.$fermata.vexStaves[0], measure.$fermata.vexStaves[i]);
        line.setType(Vex.Flow.StaveConnector.type.SINGLE);
        line.setContext(this.ctx);
        line.draw()
      }
    }
    if(measureIdx === 0 && measure.$fermata.attributes.staves > 1) {
      var connector = new Vex.Flow.StaveConnector(measure.$fermata.vexStaves[measure.$fermata.attributes["part-symbol"]["top-staff"] - 1], measure.$fermata.vexStaves[measure.$fermata.attributes["part-symbol"]["bottom-staff"] - 1]);
      connector.setType(Fermata.Mapping.Connector.getVexflow(measure.$fermata.attributes["part-symbol"].symbol));
      connector.setContext(this.ctx);
      connector.draw()
    }
    for(i = 0;i < measure.$fermata.vexVoices.length;i++) {
      measure.$fermata.vexVoices[i].draw(this.ctx, measure.$fermata.vexStaves[i])
    }
    for(i = 0;i < measure.$fermata.vexHairpin.length;++i) {
      measure.$fermata.vexHairpin[i].setContext(this.ctx);
      measure.$fermata.vexHairpin[i].draw()
    }
    this.drawBeam(measure);
    this.drawTuplet(measure)
  };
  Fermata.Drawer.prototype.getGoodPos = function(noteOne, noteTwo, renderOption, first) {
    if(noteOne !== 0 && noteTwo !== 0 && noteOne !== noteTwo) {
      if(first) {
        return noteOne
      }else {
        return noteTwo
      }
    }
    if(noteTwo === 0) {
      return noteOne
    }
    if(noteOne === 0) {
      return noteTwo
    }
  };
  Fermata.Drawer.prototype.drawBeam = function(measure) {
    for(var i = 0;i < measure.$fermata.vexBeams.length;++i) {
      var vexBeam = measure.$fermata.vexBeams[i];
      vexBeam.setContext(this.ctx).draw()
    }
  };
  Fermata.Drawer.prototype.drawTuplet = function(measure) {
    for(var i = 0;i < measure.$fermata.vexTuplets.length;++i) {
      var vexTuplet = measure.$fermata.vexTuplets[i];
      vexTuplet.setContext(this.ctx).draw()
    }
  };
  Fermata.Drawer.prototype.AddNotation = function(text, hJustifcation, vJustifcation) {
    var ret = new Vex.Flow.Annotation(text);
    ret.setJustification(hJustifcation);
    ret.setVerticalJustification(vJustifcation);
    return ret
  }
}).call(this);
if(typeof module !== "undefined" && module.exports) {
  module.exports = Fermata
}
;
