const { TestEnvironment } = require('jcmp-test-env');
new TestEnvironment('server', { logLevel: 5 }).initializeEnvironment((k, v) => global[k] = v);

// get the command manager
const CommandManager = require('../commandManager');
const Command = require('../command');

// setup done, let's create our definitions
const assert = require('assert');

describe('CommandManager', () => {

  // imitate the chat dependency
  jcmp.events.Add('get_chat', () => {
      return {
          send(target, msg) {
              console.log(`chat.send(${target}, "${msg}")`);
          },
          broadcast(target, msg) {
              console.log(`chat.broadcast(${target}, "${msg}")`);
          }
      };
  });

  // import the whole thing
  require('../main');
  const commandManager = jcmp.events.Call('get_command_manager')[0];

  describe('#parseCommandString()', () => {
    it('should parse a command without arguments', () => {
      const info = CommandManager.parseCommandString('/test');

      assert.equal(info.name, 'test');
      assert.equal(info.args.length, 0);
    });
    
    // https://gitlab.nanos.io/jc3mp-packages/command-manager/issues/1
    it('should parse a command including special characters', () => {
      const info = CommandManager.parseCommandString('//.*!,qwe');

      assert.equal(info.name, '/.*!,qwe');
      assert.equal(info.args.length, 0);
    });

    it('should parse a command with a single argument', () => {
      const info = CommandManager.parseCommandString('/test hello');

      assert.equal(info.name, 'test');
      assert.equal(info.args.length, 1);
      assert.equal(info.args[0], 'hello');
    });

    it('should parse a double-quoted string as one argument', () => {
      const info = CommandManager.parseCommandString('/test "hello world"');

      assert.equal(info.name, 'test');
      assert.equal(info.args.length, 1);
      assert.equal(info.args[0], 'hello world');
    });

    it('should parse a double-quoted string containing an escaped double-quote as one argument', () => {
      const info = CommandManager.parseCommandString('/test "hello\\" world"');

      assert.equal(info.name, 'test');
      assert.equal(info.args.length, 1);
      assert.equal(info.args[0], 'hello" world');
    });

    it('should parse a double-quoted string containing a single-quoted string as one argument', () => {
      const info = CommandManager.parseCommandString(`/test "hello' world'"`);

      assert.equal(info.name, 'test');
      assert.equal(info.args.length, 1);
      assert.equal(info.args[0], `hello' world'`);
    });

    // https://gitlab.nanos.io/jc3mp-packages/command-manager/issues/1
    it('should parse a single-quoted string as one argument', () => {
      const info = CommandManager.parseCommandString(`/test 'hello world'`);

      assert.equal(info.name, 'test');
      assert.equal(info.args.length, 1);
      assert.equal(info.args[0], 'hello world');
    });

    it('should parse a single-quoted string containing an escaped single-quote as one argument', () => {
      const info = CommandManager.parseCommandString(`/test 'hello\\' world'`);

      assert.equal(info.name, 'test');
      assert.equal(info.args.length, 1);
      assert.equal(info.args[0], `hello' world`);
    });

    it('should parse a single-quoted string containing a double-quoted string as one argument', () => {
      const info = CommandManager.parseCommandString(`/test 'hello" world"'`);

      assert.equal(info.name, 'test');
      assert.equal(info.args.length, 1);
      assert.equal(info.args[0], `hello" world"`);
    });

  });

  describe('categories', () => {
    it('should have a help category', () => {
      assert.ok(commandManager.categories.has('help'));
    });

    it('should be able to create new categories', () => {
      const cat = commandManager.category('cmdManagerTest', 'mocha test category');

      assert.ok(commandManager.categories.has('cmdManagerTest'));
      assert.equal(commandManager.categories.get('cmdManagerTest'), cat);
    });

    it('should be able to remove a category', () => {
      commandManager.removeCategory('cmdManagerTest');

      assert.ok(!commandManager.categories.has('cmdManagerTest'));
    });
  });

  describe('commands', () => {
    const cat = commandManager.category('cmdManagerTest', 'mocha test');
    const cmd = new Command('testy');

    it('should register commands on the global lookup map', () => {
      cat.add(cmd);
      assert.ok(commandManager.commands.has('testy'));
    });

    it('should call a command in #handleCommand', function(done) {
      cat.add(cmd);
      cmd.handler(() => {
        done();
      });

      assert.ok(commandManager.handleCommand(null, { name: 'testy', args: []}));
    });

    it('should not call a non-existing command', () => {
      cmd.handler(() => {
        throw new Error('called wrong command');
      });

      assert.ok(!commandManager.handleCommand(null, { name: 'doesntExist', args: []}));
    });
  });
});