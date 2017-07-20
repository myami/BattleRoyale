/**
 * @file Command Class
 */
'use strict';
const playerCleanup = require('./playerCleanup');
const CommandTimeout = require('./commandTimeout');

const GLOBAL_TIMEOUT_KEY = "__glob";

/**
 * @callback CommandHandler
 * @param {Player} player
 * @param {*} ...args
 * @returns {boolean} - whether the command was executed successfully
 */

// type conversion helper
const convert = {
  string: s => ({ ok: true, value: s }),
  number: s => {
    // always parse them as float because it is less lossy(?)
    const parsed = parseFloat(s, 10);
    if (isNaN(parsed)) {
      return { ok: false };
    }
    return { ok: true, value: parsed };
  },
  object: s => {
    try {
      return { ok: true, value: JSON.parse(s) };
    } catch(e) {
      return { ok: false };
    }
  },
  boolean: s => {
    // look for literals first
    if (s === 'true' || s === 'false') {
      return { ok: true, value: Boolean(s) };
    }
    // try to parse it as a number
    const parsed = parseInt(s, 10);
    if (isNaN(parsed)) {
      return { ok: false };
    }
    return { ok: true, value: parsed > 0 };
  },
};

// default handler
function defaultHandler() {
  console.warn(`WARNING: command ${this.trigger.values().next().value} has no handler`);
}

class Parameter {
  /**
   * Creates a new Parameter
   * 
   * @constructor
   * @param {string} name - parameter name
   * @param {string} type - parameter type using string representation of JS type ('string', 'number'... see @{link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof})
   * @param {string} description - parameter description
   * @param {Object} [options={}] - additional options
   * @param {boolean} options.isOptional - is the parameter optional?
   * @param {Array<string>} options.hints - hints for client side suggestions
   * @param {*} options.default - CURRENTLY UNUSED default value
   * @param {boolean} options.isTextParameter - absorbs all further parameters and adds them to one string.
   */
  constructor(name, type, description, options) {
    /** @type {string} */ this.name = name;
    /** @type {string} */ this.type = type;
    /** @type {string} */ this.description = description;
    /** @type {Object} */ this.options = options;

    if (typeof convert[this.type] === 'undefined') {
      throw new Error(`in parameter ${this.name}: type ${this.type} is not supported`);
    }
  }
}

const defaultOptions = {
  isOptional: false,
  isTextParameter: false,
}

class Command {
  /**
   * Creates a new Command
   * 
   * @constructor
   * @param {string|Array<string>} _trigger
   * @param {Object} [options={}]
   * @param {String} [options.description='']
   * @param {CommandHandler} [options.handler=defaultHandler]
   * @param {Array<Parameter>} [options.parameter=[]]
   */
  constructor(_trigger, { description = '', handler = defaultHandler, parameters = [] } = {}) {
    const trigger = typeof _trigger === 'string' ? [_trigger] : _trigger;
    this.trigger = new Set(trigger);
    this._handler = handler;
    this._description = description;
    this._timeout = {
      perPlayer: false,
      active: false,
      delay: 0,
      timeouts: new Map(),
    };

    // add the timeouts to our cleanup
    playerCleanup.maps.set(this._timeout.timeouts, timeout => timeout.stop());
    

    if (this.trigger.size === 0) {
      throw new Error('Command must at least have one trigger');
    }

    /** @private {Array<Parameter>} */ this._parameters = [];

    parameters.forEach(param => this.parameter(param.name, param.type, param.description, param.options));
  }

  /**
   * Adds the Handler for the Command
   * 
   * @param {CommandHandler} func - handler function
   * @returns {this}
   */
  handler(func) {
    this._handler = func;
    return this;
  }

  /**
   * Adds a parameter
   * 
   * @param {string} name - parameter name
   * @param {string} type - parameter type using string representation of JS type ('string', 'number'... see @{link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof})
   * @param {string} [description=''] - parameter description
   * @param {Object} [_options={}] - additional options
   * @param {boolean} _options.isOptional - is the parameter optional?
   * @param {*} _options.default - default value
   * @param {boolean} _options.isTextParameter - absorbs all further parameters and adds them to one string.
   * 
   * @returns {this}
   */
  parameter(name, type, description = '', _options = {}) {
    const options = {};
    for (const key in defaultOptions) {
      options[key] = defaultOptions[key];
    }
    for (const key in _options) {
      options[key] = _options[key];
    }

    // check whether any parameter has the same name.
    // while this behavior isn't forbidden, we should print a warning at least.
    const countSameName = this._parameters.filter(param => param.name === name);
    if (countSameName > 0) {
      console.warn(`there already exist ${countSameName} parameter(s) with the name '${name}`);
    }

    // sanity check:
    //  - is the previous parameter an optional while the current is not?
    //  - is the previous parameter a textCommand?
    const previousParameter = this._parameters.length > 0 ? this._parameters[this._parameters.length - 1] : null;
    if (previousParameter) {
      if (previousParameter.options.isOptional && !options.isOptional) {
        throw new Error(`parameter '${name}': cannot have a mandatory parameter after an optional parameter`);
      }
      if (previousParameter.options.isTextParameter) {
        throw new Error(`parameter '${name}': previous parameter '${previousParameter.name}' is a textParameter`);
      }
    }

    this._parameters.push(new Parameter(name, type, description, options));

    return this;
  }
  
  /**
   * Adds an optional parameter
   * 
   * @param {string} name - parameter name
   * @param {string} type - parameter type using string representation of JS type ('string', 'number'... see @{link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof})
   * @param {Object} [options={}] - additional options
   * @param {boolean} options.isOptional - is the parameter optional?
   * @param {*} options.default - default value
   * @param {boolean} options.isTextParameter - absorbs all further parameters and adds them to one string.
   * 
   * @returns {this}
   */
  optional(name, type, description = '', options = {}) {
    options.isOptional = true;
    return this.parameter(name, type, description, options);
  }

  /**
   * Sets the description of the command.
   * 
   * @param {string} text - description of the command that will be displayed in the usage
   * @returns {this}
   */
  description(text) {
    this._description = text;
    return this;
  }

  /**
   * Only allow the command to be run every X milliseconds.
   * 
   * @param {Number} time - milliseconds until the command can be run again
   * @param {boolean} [perPlayer=false] - whether the timeout should only be applied to the executing player
   * @returns {this}
   */
  timeout(time, perPlayer = false) {
    this._timeout.perPlayer = perPlayer;
    this._timeout.active = true;
    this._timeout.delay = time;

    return this;
  }

  /**
   * Handles the command
   * 
   * @param {Player} player
   * @param {Array<string>} args
   */
  handle(player, args) {
    if (this._timeout.active) {
      const timeout = this._timeout.timeouts.get(this._timeout.perPlayer ? player.client.steamId : GLOBAL_TIMEOUT_KEY);
      if (timeout && timeout.active) {
        chat.send(player, timeout.getFailMessage(), new RGB(255, 0, 0));
        return;
      }
    }

    let minParams = 0;
    this._parameters.forEach(p => p.options.isOptional ? '' : minParams++ );

    if (args.length < minParams) {
      chat.send(player, this.getUsage());
      return;
    }

    const finalArgs = [];

    let failed = false;
    this._parameters.forEach((param, i) => {
      if (failed) {
        return;
      }
      if (param.options.isTextParameter) {
        finalArgs.push(args.join(' '));
        return;
      }

      const arg = args.shift();
      const result = convert[param.type](arg);

      if (!result.ok && !param.options.isOptional) {
        console.warn(`Command ${this.trigger.values().next().value} parameter '${param.name}': cannot convert to type '${param.type}`);
        failed = true;
        return;
      }

      finalArgs.push(result.value);
    });

    if (failed) {
      chat.send(player, this.getUsage());
      return;
    }

    finalArgs.unshift(player);
    try {
      if (this._handler.apply(this, finalArgs) === 'usage') {
        chat.send(player, this.getUsage());
        return;
      }

      if (this._timeout.active) {
        const key = this._timeout.perPlayer ? player.client.steamId : GLOBAL_TIMEOUT_KEY;
        const timeout = this._timeout.timeouts.get(key);
        if (timeout) {
          timeout.start();
        } else {
          const timeout = new CommandTimeout(this._timeout.delay);
          timeout.start();
          this._timeout.timeouts.set(key, timeout);
        }
      }
    } catch(e) {
      console.warn(`error handling command ${this.trigger.values().next().value}: ${e.stack || e}`);
    }

  }

  /**
   * Returns the Usage message of the Command
   * 
   * @returns {string}
   */
  getUsage() {
    const trigger = Array.from(this.trigger.values());
    let msg = `<div>
    <style scoped>
      th,td {
        padding-right: 8px;
      }
    </style>
    
    <h2>Usage for command <strong style="color: #E9D460">/${trigger.splice(0,1)[0]}</strong></h2><br />`;
    if (trigger.length > 0) {
      const altTrigger = trigger.map(t => `<span style="color: #E9D460">/${t}</span>`).join(', ');
      msg += `<h3 style="margin-top: -10px">alternative: ${altTrigger}</h3><br />`;
    }
    if (this._description.length > 0) {
      msg += `<h3>Description</h3>${this._description}<br />`;
    }
    if (this._parameters.length > 0) {
      const paramStr = this._parameters.map(param => 
        `<tr>
          <td>${param.name}</td>
          <td>${param.options.isOptional ? '<em>(optional)</em> ' : '' }${param.description.length > 0 ? param.description : '<em>no description</em>'}</td>
        </tr>`).join('');
      msg += `<br />
        <h3>Parameters</h3>
        <table style="text-align: left">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${paramStr}
          </tbody>
        </table></div>
      `;
    }

    msg = msg.replace(/(?:\r\n|\r|\n)/g, '');
    return msg;
  }
}

module.exports = Command;