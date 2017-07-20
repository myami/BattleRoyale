const { TestEnvironment } = require('jcmp-test-env');
new TestEnvironment('server', { logLevel: 5 }).initializeEnvironment((k, v) => global[k] = v);

const assert = require('assert');

const Command = require('../command');

describe('Command', () => {
  describe('#constructor()', () => {
    it('should generate a new Command', () => {
      const cmd = new Command('test');

      assert.equal(cmd.trigger.size, 1);
      assert.equal(cmd.trigger.values().next().value, 'test');
    });

    it('should generate a new Command with multiple triggers', () => {
      const cmd = new Command(['test', 'test2', 't', 'testy']);

      assert.equal(cmd.trigger.size, 4);

      const trigger = [...cmd.trigger.values()];
      assert.deepEqual(trigger, ['test', 'test2', 't', 'testy']);
    });

    it('should not allow the same trigger twice', () => {
      const cmd = new Command(['test', 'test']);

      assert.equal(cmd.trigger.size, 1);
      assert.equal(cmd.trigger.values().next().value, 'test');
    });
  });

  describe('parameters', () => {
    const cmd = new Command('test');

    it('should add new parameters', () => {
      cmd.parameter('test_param', 'string');

      assert.equal(cmd._parameters.length, 1);

      const p = cmd._parameters[0];
      assert.equal(p.name, 'test_param');
      assert.equal(p.type, 'string');
    });

    ['string', 'number', 'object', 'boolean'].forEach(type => {
      it(`should add a new parameter with type ${type}`, () => {
        
        cmd.parameter('test_param', type);
        const p = cmd._parameters[cmd._parameters.length - 1];
        assert.equal(p.name, 'test_param');
        assert.equal(p.type, type);
      });
    });

    it(`should not allow unsupported parameter type 'function'`, () => {
      assert.throws(() => cmd.parameter('test_param', 'function'), `Command parameters should not allow unsupported parameter type 'function'`);
    });

    it('should add optional parameters', () => {
      cmd.optional('optional_test', 'string');
        const p = cmd._parameters[cmd._parameters.length - 1];
        assert.equal(p.name, 'optional_test');
        assert.equal(p.options.isOptional, true);
    });
  });

  describe('#handle()', () => {
    const cmd = new Command('test')
      .parameter('test_param', 'string')

    let done = null;

    it('should send parameters to the handler', function(done) {
      const expected = 'hello!';

      cmd.handler((_, value) => {
        assert.strictEqual(value, expected);
        done();
      });

      cmd.handle(null, [expected]);
    });

    [['number', '1', 1], ['boolean', '1', true], ['boolean', 'true', true]].forEach(function(conv) {
      it(`should convert ${conv[0]} parameters`, done => {
        const expected = conv[2];
        cmd._parameters[cmd._parameters.length - 1].type = conv[0];

        cmd.handler((_, value) => {
          assert.strictEqual(value, expected);
          done();
        });

        cmd.handle(null, [conv[1]]);
      });
    });

    it(`should convert JSON objects`, done => {
      const expected = { key: "value", key2: 1 };
      cmd._parameters[cmd._parameters.length - 1].type = 'object';

      cmd.handler((_, value) => {
        assert.deepEqual(value, expected);
        done();
      });

      cmd.handle(null, [JSON.stringify(expected)]);
    });

    it('should join all remaining arguments for a isTextParameter', function(done) {
      cmd.parameter('text', 'string', 'bla', { isTextParameter: true });

      const expected = [1, 'hello world !'];
      cmd.handler((_, ...args) => {
        assert.deepEqual(args, expected);

        cmd._parameters.splice(-1);
        done();
      });

      cmd.handle(null, ['1', 'hello', 'world', '!']);
    });

    it('should allow not supplying an optional parameter', function(done) {
      cmd._parameters[cmd._parameters.length - 1].options.isOptional = true;
      cmd._parameters[cmd._parameters.length - 1].type = 'number';

      cmd.handler((_, value = null) => {
        assert.strictEqual(value, null);
        done();
      });

      cmd.handle(null, []);
    });
    it('should allow supplying an optional parameter', function(done) {
      const expected = 1234;

      cmd._parameters[cmd._parameters.length - 1].options.isOptional = true;
      cmd._parameters[cmd._parameters.length - 1].type = 'number';

      cmd.handler((_, value = null) => {
        assert.strictEqual(value, expected);
        done();
      });

      cmd.handle(null, [expected]);
    });
  });
});