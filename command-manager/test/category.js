const { TestEnvironment } = require('jcmp-test-env');
new TestEnvironment('server', { logLevel: 5 }).initializeEnvironment((k, v) => global[k] = v);

const assert = require('assert');

const Category = require('../category');

class FakeCommand {
  constructor() {
    this.trigger = new Set(['test', 't']);
  }
}

describe('Category', () => {
  const cat = new Category('test', 'mocha test');
  const map = new Map();

  cat.setLookupMap(map);

  const fakeCmd = new FakeCommand();

  it('should be able to add commands', () => {
    cat.add(fakeCmd);
    assert.equal(cat.commands.size, 1);
    assert.equal(cat.commands.values().next().value, fakeCmd);
  });

  it('should not add the same command twice', () => {
    cat.add(fakeCmd);
    cat.add(fakeCmd);
    cat.add(fakeCmd);
    assert.equal(cat.commands.size, 1);
  });

  it('should be able to remove commands', () => {
    cat.remove(fakeCmd);
    assert.equal(cat.commands.size, 0);
  });

  it('should add all triggers to the lookup map', () => {
    cat.add(fakeCmd);

    assert.equal(map.size, fakeCmd.trigger.size);
    fakeCmd.trigger.forEach(trig => {
      assert.ok(map.has(trig));
    });
  });

  it('should remove all triggers from the lookup map when removing a Command', () => {
    cat.remove(fakeCmd);

    assert.equal(map.size, 0);
  });

  it('should remove all triggers from the lookup map upon removing the Category', () => {
    cat.add(fakeCmd);

    assert.equal(map.size, fakeCmd.trigger.size);
    cat.unregister();
    assert.equal(map.size, 0);
  });
});