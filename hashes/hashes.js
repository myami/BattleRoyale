/**
 * @overview GTA:Multiplayer Default Package: Hashes
 * @author Jan "Waffle" C.
 * @copyright (c) GTA:Multiplayer [gta-mp.net]
 * @license https://master.gta-mp.net/LICENSE
 */
"use strict";

let peds = require('./peds');
let weapons = require('./weapons');
let vehicles = require('./vehicles');
let objects = require('./objects');

class Hashes {
  /**
   * Returns all Ped hashes (and their names, see peds.js)
   *
   * @returns {Array} array of all ped models
   */
  static get peds() {
    return peds;
  }
  /**
   * Returns all Weapon hashes (and their names, see weapons.js)
   *
   * @returns {Array} array of all weapon models
   */
  static get weapons() {
    return weapons;
  }
  /**
   * Returns all Vehicle hashes (and their names, see vehicles.js)
   *
   * @returns {Array} array of all vehicle models
   */
  static get vehicles() {
    return vehicles;
  }
  /**
   * Returns all Objects hashes (and their names, see objects.js)
   *
   * @returns {Array} array of all object models
   */
  static get objects() {
    return objects;
  }
  /**
   * Finds a certain hash by its name
   *
   * @param {Array} target the array of hashes in which we will look
   * @param {string} name the name of the item
   * @returns {Object|undefined} hash/name object
   */
  static findByName(target, name) {
    for (let obj of target) {
      if (typeof obj.n === "undefined" || typeof obj.h === "undefined") {
        continue;
      }
      if (obj.n === name) {
        return obj;
      }
    }
    return;
  }
  
  /**
   * Finds a certain hash by part of its name
   *
   * @param {Array} target the array of hashes in which we will look
   * @param {string} partOfName part of the name of the item
   * @returns {Object|undefined} hash/name object
   */
  static findByPartOfName(target, partOfName) {
	partOfName = partOfName.toLowerCase();
	
	let fnCheck = objName => {
	  objName = objName.toLowerCase();
	  if (objName.indexOf(partOfName) === 0) {
	    return true;
	  }
	  return false;
	};
	
    for (let obj of target) {
      if (typeof obj.n === "undefined" || typeof obj.h === "undefined") {
        continue;
      }
      if (obj.n === partOfName || fnCheck(obj.n)) {
        return obj;
      }
    }
    return;
  }

  /**
   * Finds a name in the given array of hashes.
   *
   * @param {Array} target the array of hashes in which we will look
   * @param {integer} hash hash representation
   * @returns {Object|undefined} hash/name object
   */
  static findByHash(target, hash) {
    for (let obj of target) {
      if (typeof obj.n === "undefined" || typeof obj.h === "undefined") {
        continue;
      }
      if (obj.n === hash) {
        return obj;
      }
    }
    return;
  }
}

module.exports = Hashes;