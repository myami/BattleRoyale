'use strict';

const fs = require('fs');
const path = require('path');

module.exports = class Utility {

  static rreaddir(dir, done, filesOnly) {
    filesOnly = filesOnly || false;
    let pending = 0;
    let files = [];
    fs.readdir(dir, (err, list) => {
      if (err) {
        return done(err, files);
      }
      pending = list.length;

      list.forEach(f => {
        fs.stat(path.join(dir, f), (err, stat) => {
          if (err) {
            console.warn('skipping file because we couldnt stat it in rreaddir: ' + err);
            if (!pending--) {
              return done(undefined, files);
            }

            return;
          }

          if (stat.isDirectory()) {
            if (!filesOnly) {
              files.push(f);
            }

            Utility.rreaddir(f, (err, rlist) => {
              rlist.forEach(rf => files.push(rf));

              pending--;
              if (!pending) {
                return done(undefined, files);
              }
            }, filesOnly);
          } else {
            files.push(f);

            pending--;
            if (!pending) {
              return done(undefined, files);
            }
          }
        });
      });
    });
  }

  /**
   * Returns the player from his id or (part of his) Name
  *
  * @param  {string/number} idOrName Networkid or name of the player (or some digits of the name)
  * @param  {boolean=} [allowDuplicates=false] False: If multiple players have the same Name only the first one found is returned.
  *                      True: Returns an array with all duplicate players with the name
  * @param  {boolean=} [caseSensitive=false] True if case sensitive, false if not
  * @return {Player} An array with the players found with the id or the name,
  *          only contains the first one found if allowDuplicates was false, empty array if no player was found
  */
  static getPlayer(idOrName, opt_allowDuplicates, opt_caseSensitive) {
    let allowDuplicates = opt_allowDuplicates || false;
    let caseSensitive = opt_caseSensitive || false;
    let id = parseInt(idOrName);
    let fnCheck;

    if (typeof idOrName === 'undefined') {
      return [];
    }

    if (isNaN(id)) {
    if(caseSensitive === false) {
      idOrName = idOrName.toLowerCase();
    }

    // define fnCheck to check the players name
    fnCheck = target => {
      let targetName;
      if(caseSensitive === false) {
      //ignore capital letters
      targetName = target.escapedNametagName.toLowerCase();
      }
      else {
      // do not ignore capital letters
      targetName = target.escapedNametagName;
      }
      if (targetName.includes(idOrName)) {
      return true;
      }
      return false;
    };
    }
    else {
    fnCheck = target => target.client.networkId === id;
    }

    let playerArray = [];
    for (let i = 0; i < jcmp.players.length; i++) {
    const tempPlayer = jcmp.players[i];
    if (fnCheck(tempPlayer)) {
      playerArray.push(tempPlayer);
      if(allowDuplicates === false) {
      // exit the loop, because we just return the first player found
      break;
      }
    }
    }
    return playerArray;
  }

  /**
   * Loads all files from a directory recursively.
   *
   * @param {string} path - path to the directory
   */
  static loadFilesFromDirectory(path) {
    Utility.rreaddir(path, (err, list) => {
      if (err) {
        console.log(err);
        return;
      }
      list.forEach(f => {
        require(`${path}/${f}`);
      });
      console.info(`${list.length} files loaded from '${path}'.`);
    }, true);
  }

    /**
    * Checks if the given player is an admin on the server.
    *
    * @param {Player} player - the player to check
    */
    static isAdmin(player) {
        return (adminsys.config.admins.indexOf(player.client.steamId) !== -1);
    }

    static secondsToMs(n) {
      return n * 1000;
    }

    static minutesToMs(n) {
      return this.secondsToMs(n * 60);
    }

    static hoursToMs(n) {
      return this.minutesToMs(n * 60);
    }

    static daysToMs(n) {
      return this.hoursToMs(24 * n);
    }
};


