if (typeof require !== 'undefined') {
  var Fermata,
          fs = require('fs'),
          assert = require('assert');

  // Use Scons build version or devel version (using node vm)
  if (fs.existsSync(__dirname + '/../build/fermata/fermata.node.js')) {
    Fermata = require('..');
  }
  else {
    Fermata = require((process.env['FERMATA_COV'] ? '../src-cov' : '../src') +
            '/Fermata.Dev.Node.js');
  }

  // Test utils
  Fermata.Tests = require('./Fermata.Tests.Utils.js').Tests;
}

(function () {

  var Call = Fermata.Utils.Call;

// Missing: helpers, out
  describe('Fermata.Utils.Call', function () {
    var helloWorld, fermataRender, _render = Fermata.Render.prototype;
    before(function (done) {
      Fermata.Tests.Utils.LoadJSONFixture('hello-world.min.json', function (fixture) {
        helloWorld = new Fermata.Data(fixture);
        fermataRender = new Fermata.Render(helloWorld);
        done();
      });
    });

    describe('Test "*", "+", "?"', function () {
      it('should call all functions one time', function (done) {
        var foo = function (node) {
          assert.equal(node, undefined);
        };

        var bar = function (node) {
          assert.equal(node, 84);
          done();
        };

        var processes = [
          {key: "foo", type: Call.FuncTypes.$1, func: foo},
          {key: "bar", type: Call.FuncTypes.$1, func: bar}
        ];

        var obj = {bar: 84};
        Call.exploreSubNodes({object: obj, processes: processes, ctx: fermataRender});
      });

      it('should call all functions (?)', function (done) {
        var foo = function (node) {
          assert.equal(node, 42);
        };

        var bar = function (node) {
          assert.equal(node, 84);
          done();
        };

        var processes = [
          {key: "foo", type: Call.FuncTypes.$01, func: foo},
          {key: "bar", type: Call.FuncTypes.$01, func: bar}
        ];

        var obj = {foo: 42, bar: 84};
        Call.exploreSubNodes({object: obj, processes: processes, ctx: fermataRender});
      });

      it('should call functions with subnodes only (?)', function (done) {
        var foo = function (node) {
          assert.ok(false);
        };

        var bar = function (node) {
          assert.equal(node, 84);
          done();
        };

        var processes = [
          {key: "foo", type: Call.FuncTypes.$01, func: foo},
          {key: "bar", type: Call.FuncTypes.$01, func: bar}
        ];

        var obj = {bar: 84};
        Call.exploreSubNodes({object: obj, processes: processes, ctx: fermataRender});
      });

      it('should call all functions one time (no subnode) (+)', function (done) {
        var foo = function (node, i) {
          assert.equal(node, undefined);
          assert.equal(i, 0);
          done();
        };

        var processes = [
          {key: "foo", type: Call.FuncTypes.$1n, func: foo}
        ];

        Call.exploreSubNodes({object: {}, processes: processes, ctx: fermataRender});
      });

      it('should call all functions one time (one subnode) (+)', function (done) {
        var foo = function (node, i) {
          assert.equal(node, 42);
          assert.equal(i, 0);
          done();
        };

        var processes = [
          {key: "foo", type: Call.FuncTypes.$1n, func: foo}
        ];

        var obj = {foo: 42};
        Call.exploreSubNodes({object: obj, processes: processes, ctx: fermataRender});
      });

      it('should call all functions several time (several subnode) (+)', function (done) {
        var obj = {foo: [40, 41, 42, 43]}, idx = 0;
        var foo = function (node, i) {
          assert.equal(idx++, i);
          assert.equal(node, obj.foo[i]);

          if (idx >= obj.foo.length) {
            done();
          }
        };

        var processes = [
          {key: "foo", type: Call.FuncTypes.$1n, func: foo}
        ];

        Call.exploreSubNodes({object: obj, processes: processes, ctx: fermataRender});
      });

      it('shouln\'t call function foo (no subnode) (*)', function (done) {
        var foo = function () {
          assert.ok(false);
        };

        var bar = function (node, i) {
          assert.equal(node, 42);
          assert.equal(i, 0);
          done();
        };

        var processes = [
          {key: "foo", type: Call.FuncTypes.$0n, func: foo},
          {key: "bar", type: Call.FuncTypes.$0n, func: bar}
        ];

        var obj = {bar: 42};
        Call.exploreSubNodes({object: obj, processes: processes, ctx: fermataRender});
      });

      it('should call all functions one time (one subnode) (*)', function (done) {
        var foo = function (node, i) {
          assert.equal(node, 42);
          assert.equal(i, 0);
          done();
        };

        var processes = [
          {key: "foo", type: Call.FuncTypes.$0n, func: foo}
        ];

        var obj = {foo: 42};
        Call.exploreSubNodes({object: obj, processes: processes, ctx: fermataRender});
      });

      it('should call all functions several time (several subnode) (*)', function (done) {
        var obj = {foo: [40, 41, 42, 43]}, idx = 0;
        var foo = function (node, i) {
          assert.equal(idx++, i);
          assert.equal(node, obj.foo[i]);

          if (idx >= obj.foo.length) {
            done();
          }
        };

        var processes = [
          {key: "foo", type: Call.FuncTypes.$0n, func: foo}
        ];

        Call.exploreSubNodes({object: obj, processes: processes, ctx: fermataRender});
      });
    });

    describe('Test context (this)', function () {
      var obj = {foo: 42, bar: 84}, ctx = {foo: 42};

      it('should have good context (1)', function (done) {
        var foo = function () {
          assert.equal(this.foo, 42);
        },
                bar = function () {
          done();
        };

        var processes = [
          {key: "foo", type: Call.FuncTypes.$1, func: foo},
          {key: "bar", type: Call.FuncTypes.$1, func: bar}
        ];

        Call.exploreSubNodes({object: obj, processes: processes, ctx: ctx});
      });

      it('should have good context (?)', function (done) {
        var foo = function () {
          assert.equal(this.foo, 42);
        },
                bar = function () {
          done();
        };

        var processes = [
          {key: "foo", type: Call.FuncTypes.$01, func: foo},
          {key: "bar", type: Call.FuncTypes.$01, func: bar}
        ];

        Call.exploreSubNodes({object: obj, processes: processes, ctx: ctx});
      });

      it('should have good context (+)', function (done) {
        var foo = function () {
          assert.equal(this.foo, 42);
        },
                bar = function () {
          done();
        };

        var processes = [
          {key: "foo", type: Call.FuncTypes.$0n, func: foo},
          {key: "bar", type: Call.FuncTypes.$0n, func: bar}
        ];

        Call.exploreSubNodes({object: obj, processes: processes, ctx: ctx});
      });

      it('should have good context (*)', function (done) {
        var foo = function () {
          assert.equal(this.foo, 42);
        },
                bar = function () {
          done();
        };

        var obj = {foo: [42, 43], bar: 84};

        var processes = [
          {key: "foo", type: Call.FuncTypes.$1n, func: foo},
          {key: "bar", type: Call.FuncTypes.$1n, func: bar}
        ];

        Call.exploreSubNodes({object: obj, processes: processes, ctx: ctx});
      });
    });

    describe('Test arguments', function () {
      var obj = {foo: 42, bar: 84};

      it('should pass arguments (1)', function (done) {
        var foo = function (node, a, b, c) {
          assert.equal(node, 42);
          assert.equal(a, 43);
          assert.equal(b, 44);
          assert.equal(c, 45);
        };

        var bar = function (node, a, b, c) {
          assert.equal(node, undefined);
          assert.equal(a, 43);
          assert.equal(b, 44);
          assert.equal(c, 45);
          done();
        };

        var processes = [
          {key: "foo", type: Call.FuncTypes.$1, func: foo},
          {key: "bar", type: Call.FuncTypes.$1, func: bar}
        ];

        var obj = {foo: 42};
        Call.exploreSubNodes({object: obj, processes: processes, ctx: fermataRender}, 43, 44, 45);
      });

      it('should pass arguments (?)', function (done) {
        var foo = function (node, a, b, c) {
          assert.equal(node, 42);
          assert.equal(a, 43);
          assert.equal(b, 44);
          assert.equal(c, 45);
        };

        var bar = function (node, a, b, c) {
          assert.equal(node, 84);
          assert.equal(a, 43);
          assert.equal(b, 44);
          assert.equal(c, 45);
          done();
        };

        var processes = [
          {key: "foo", type: Call.FuncTypes.$01, func: foo},
          {key: "bar", type: Call.FuncTypes.$01, func: bar}
        ];

        Call.exploreSubNodes({object: obj, processes: processes, ctx: fermataRender}, 43, 44, 45);
      });

      it('should pass arguments (*)', function (done) {
        var obj = {foo: [40, 41, 42, 43], bar: 43}, idx = 0;
        var foo = function (node, i, a, b, c) {
          assert.equal(idx++, i);
          assert.equal(node, obj.foo[i]);

          assert.equal(a, 44);
          assert.equal(b, 45);
          assert.equal(c, 46);

          if (idx > obj.foo.length) {
            assert.ok(false);
          }
        };

        var bar = function (node, i, a, b, c) {
          assert.equal(i, 0);
          assert.equal(node, obj.bar);

          assert.equal(a, 44);
          assert.equal(b, 45);
          assert.equal(c, 46);

          done();
        };

        var processes = [
          {key: "foo", type: Call.FuncTypes.$0n, func: foo},
          {key: "bar", type: Call.FuncTypes.$0n, func: bar},
        ];

        Call.exploreSubNodes({object: obj, processes: processes, ctx: fermataRender}, 44, 45, 46);
      });

      it('should pass arguments (*)', function (done) {
        var obj = {foo: [40, 41, 42, 43]}, idx = 0;
        var foo = function (node, i, a, b, c) {
          assert.equal(idx++, i);
          assert.equal(node, obj.foo[i]);

          assert.equal(a, 44);
          assert.equal(b, 45);
          assert.equal(c, 46);

          if (idx > obj.foo.length) {
            assert.ok(false);
          }
        };

        var bar = function (node, i, a, b, c) {
          assert.equal(i, 0);
          assert.equal(node, undefined);

          assert.equal(a, 44);
          assert.equal(b, 45);
          assert.equal(c, 46);

          done();
        };

        var processes = [
          {key: "foo", type: Call.FuncTypes.$1n, func: foo},
          {key: "bar", type: Call.FuncTypes.$1n, func: bar},
        ];

        Call.exploreSubNodes({object: obj, processes: processes, ctx: fermataRender}, 44, 45, 46);
      });
    });
  });
}).call(this);
