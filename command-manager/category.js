/**
 * @file Command Categories
 */
'use strict';

const Command = require('./command');

class Category {
  /**
   * Creates a new Category
   *
   * @param {string} name
   * @param {string} description
   */
  constructor(name, description) {
    this.name = name;
    this.description = description;
    
    /**
     * Lookup Map from the CommandManager
     *
     * @type {Map<string, Command>}
     */
    this._lookupMap = null;
  
    /** @type {Set<Command>} */ this.commands = new Set();
  }
  
  /**
   * Sets the Lookup Map
   *
   * @param {Map<string, Command>} map
   */
  setLookupMap(map) {
    this._lookupMap = map;
  }
  
  /**
   * Adds a new Command. Chainable.
   * 
   * @param {Command} cmd
   * @returns {this}
   */
  add(cmd) {
    if (this.commands.has(cmd)) {
      return this;
    }

    if (this._lookupMap) {
      cmd.trigger.forEach(t => {
        if (this._lookupMap.has(t)) {
          console.warn(`trigger '${t}' already exists in the lookup map. skipping.`);

          // remove the trigger from this command
          cmd.trigger.delete(t);
          return;
        }
        this._lookupMap.set(t, cmd);
      });
    }
    this.commands.add(cmd);
    console.log(`Command /${cmd.trigger.values().next().value} added to category '${this.name}'`);

    return this;
  }

  /**
   * Removes a Command from this Category. Chainable.
   * 
   * @param {Command} cmd
   * @returns {this}
   */
  remove(cmd) {
    if (!this.commands.has(cmd)) {
      return this;
    }

    if (this._lookupMap) {
      cmd.trigger.forEach(trig => {
        this._lookupMap.delete(trig);
      });
    }
    this.commands.delete(cmd);

    return this;
  }

  /**
   * Unregisters all Commands of this category
   */
  unregister() {
    if (this._lookupMap) {
      this.commands.forEach(command => {
        command.trigger.forEach(trig => {
          this._lookupMap.delete(trig);
        });
      });
    }

    this.commands.clear();
  }
}

module.exports = Category;