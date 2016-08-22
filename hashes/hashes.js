/**
 * @overview GTA:Multiplayer Default Package: Hashes
 * @author Jan "Waffle" C.
 * @author Martin "funkrusha" S.
 * @copyright (c) GTA:Multiplayer [gta-mp.net]
 * @license https://master.gta-mp.net/LICENSE
 */
"use strict";

let vehicles = require('./vehicles');

class Hashes {
  /**
   * Returns all Vehicle hashes (and their names, see vehicles.js)
   *
   * @returns {Array} array of all vehicle models
   */
  static get vehicles() {
    return vehicles;
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
      if (typeof obj.name === "undefined" || typeof obj.hash === "undefined") {
        continue;
      }
      if (obj.name === name) {
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
	  if (objName.indexOf(partOfName) != -1) {
	    return true;
	  }
	  return false;
	};

    for (let obj of target) {
      if (typeof obj.name === "undefined" || typeof obj.hash === "undefined") {
        continue;
      }
      if (obj.name === partOfName || fnCheck(obj.name)) {
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
      if (typeof obj.name === "undefined" || typeof obj.hash === "undefined") {
        continue;
      }
      if (obj.hash === hash) {
        return obj;
      }
    }
    return;
  }
}

module.exports = Hashes;
