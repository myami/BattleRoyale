/**
 * @file Command Timeout class
 */
'use strict';

class CommandTimeout {
  /**
   * Creates a new Command Timeout
   * 
   * @param {number} delay - delay in milliseconds
   */
  constructor(delay) {
    this.timeout = null;
    this._start = null;
    this.delay = delay;
  }

  /**
   * Starts the timeout if it did not start already.
   */
  start() {
    if (this.timeout) {
      return;
    }

    this._start = new Date().getTime();
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this._start = null;
    }, this.delay);
  }

  /**
   * @type {boolean}
   */
  get active() {
    return this.timeout !== null;
  }

  /**
   * Returns the message of remaining timeout
   * 
   * @returns {string}
   */
  getFailMessage() {
    if (!this.active) {
      return '';
    }
    return `this command can be used again in ${Math.floor((this.delay - (new Date().getTime() - this._start)) / 1000)} seconds.`;
  }

  /**
   * Stops the timeout and clears it.
   */
  stop() {
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
      this._start = null;
      this.timeout = null;
    }
  }
}

module.exports = CommandTimeout;