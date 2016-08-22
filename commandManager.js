'use strict';

module.exports = class CommandManager {
  constructor() {
    this.commands = new Map();
  }

  /**
   * Handles a Command.
   *
   * @param {Player} player the executing player
   * @param {string} command the command name
   * @param {Array<string>} args command arguments
   */
  handle(player, command, args) {
    // We can't just use this.commands.has because we have to be insensitive here :(
    const low = command.toLowerCase();
    args.unshift(player);

    // Not using forEach either as we want to break early
    for (const cmd of this.commands.entries()) {
      if (cmd[0].toLowerCase() === low) {
        cmd[1].apply(null, args);
        return true;
      }
    }
    return false;
  }

  /**
   * Adds a new Command.
   *
   * @param {string|Array<string>} trigger one or multiple trigger (e.g. 'setWeather' or ['sw', 'setWeather'])
   */
  add(trigger, handler) {
    if (trigger instanceof Array || trigger instanceof Set) {
      // Looooooop
      trigger.forEach(trig => this.add(trig, handler));
      return;
    }

    if (this.commands.has(trigger)) {
      console.warn(`Trigger ${trigger} is already in use. Skipping it.`);
      return;
    }
    this.commands.set(trigger, handler);
    console.log(`Added Command '${trigger}'`);
  }
}