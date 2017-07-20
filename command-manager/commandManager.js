/**
 * @file Command Manager
 */
'use strict';

const utility = require('./utility');
const Category = require('./category');
const Command = require('./command');

class CommandManager {
  constructor() {
    /** @type {Map<string, Command>} */ this.commands = new Map();
    /** @type {Map<string, Category>} */ this.categories = new Map();

    // Add a global help command
    this.category('help', 'supporting commands').add(new Command('help', { handler: (player, topic) => {
      if (typeof topic === 'undefined') {
        let msg = `<h2>Command Help</h2><h3 style="color: #eee;">List of Categories</h3><ul>`;
        this.categories.forEach((c, name) => {
          msg += `<li>/help [#E9D460]<strong>${name}</strong>[#FFFFFF]`;
          if (c.description.length > 0) {
            msg += ` - <em>${c.description}</em>`;
          }
          msg += '</li>';
        });
        msg += '</ul>';

        chat.send(player, msg);
        return;
      }

      if (this.categories.has(topic)) {
        let msg = `<h2>Category Help</h2><h3 style="color: #eee;">List of Commands in <em>${topic}</em></h3><ul>`;
        this.categories.get(topic).commands.forEach(cmd => {
          msg += `<li>/help [#E9D460]<strong>${cmd.trigger.values().next().value}</strong>[#FFFFFF]`;
          if (cmd._description.length > 0) {
            msg += ` - <em>${cmd._description}</em>`;
          }
          msg += '</li>';
        });
        msg += '</ul>';

        chat.send(player, msg);
        return;
      }

      if (this.commands.has(topic)) {
        chat.send(player, this.commands.get(topic).getUsage());
        return;
      }

      this.handle(player, 'help', []);
    }})
      .description('displays an overview of all commands')
      .optional('category / command', 'string', 'help topic'));
  }

  /**
   * Parses a Command string
   *
   * @param {string} command - command string
   * @returns {object} commandInfo
   * @returns {string} commandInfo.name
   * @returns {Array<string>} comamndInfo.args
   */
  static parseCommandString(command) {
    let args = command.match(/(?=["'])(?:"[^"\\]*(?:\\[\s\S][^"\\]*)*"|'[^'\\]*(?:\\[\s\S][^'\\]*)*')|(\S+)/g) || [];
    for(var i=1;i<args.length;i++)
    {
      if( args[i].substr(0, 1) === '"' || args[i].substr(0,1) === "'" ) {
        args[i] = JSON.parse(args[i]);
      }
    }

    // Let's check if this crazy thing ever happens.
    if (args.length === 0) {
      throw "This should NEVER happen.";
    }

    let commandName = args.splice(0, 1)[0].substr(1);

    return {
      args,
      name: commandName,
    };
  }

  get Command() {
    return Command;
  }

  /**
   * Creates a new Category or returns an existing one.
   *
   * @param {string} name
   * @param {?string} description
   * @returns {Category}
   */
  category(name, description) {
    if (this.categories.has(name)) {
      const c = this.categories.get(name);
      if (typeof description !== 'undefined') {
        c.description = description;
      }
      return c;
    }
    const c = new Category(name, description);
    c.setLookupMap(this.commands);
    this.categories.set(name, c);
    return c;
  }

  /**
   * Removes a category and its commands
   *
   * @param {string} name
   */
  removeCategory(name) {
    if (this.categories.has(name)) {
      this.categories.get(name).unregister();
    }
    this.categories.delete(name);
  }

  /**
   * Handles a Command
   *
   * @param {Player} player
   * @param {object} commandInfo
   * @param {string} commandInfo.name
   * @param {Array<string>} comamndInfo.args
   * @returns {boolean} whether the command was handled
   */
  handleCommand(player, { name, args }) {
    const cmd = this.commands.get(name);
    if (typeof cmd === 'undefined') {
      return false;
    }

    cmd.handle(player, args);

    return true;
  }

  /**
   * Loads all Commands from a directory
   *
   * @param {string} path - commands directory path
   * @param {function(string, object)} loader - loader function. this is used to preserve the global scope
   */
  loadFromDirectory(path, loader) {
    utility.rreaddir(path, (err, list) => {
      if (err) {
        console.log(err);
        return;
      }

      list.forEach(f => {
        loader(`${path}/${f}`, {
          Command,
          manager: this,
        });
      });
      console.info(list.length + ' command files loaded.');
    }, true);
  }
}

module.exports = CommandManager;
