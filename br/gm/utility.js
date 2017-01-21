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

  static hexToRGB(hex) {
    var shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthand, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    return new RGB(r, g, b);
  }

  static RGBToHex(rgb) {
    return '#' + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
  }

  static random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static randomArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static clamp(min, val, max) {
    return Math.min(Math.max(val, min), max);
  }

  static SecondsToMs(n) {
    return 1000 * n;
  }

  static MinToMs(n) {
    return this.SecondsToMs(60) * n;
  }

  static zeroPadding(num, size) {
    let zero = (size - num.toString().length + 1);
    return Array(+(zero > 0 && zero)).join('0') + num;
  }

  static timeFormat(hour, minute, second) {
    let timeStr = '';

    if (typeof hour !== 'undefined')
      timeStr = battleroyale.utils.zeroPadding(hour, 2).toString();

    if (typeof minute !== 'undefined')
      timeStr += ':' + battleroyale.utils.zeroPadding(minute, 2).toString();
    else
      timeStr += ':00';

    if (typeof second !== 'undefined')
      timeStr += ':' + battleroyale.utils.zeroPadding(second, 2).toString();

    return timeStr;
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
        return (battleroyale.config.admins.indexOf(player.client.steamId) !== -1);
    }

    static randomSpawn(baseVec, radius) {
      const half = radius / 2;
      return new Vector3f(baseVec.x + battleroyale.utils.random(-half, half),
        baseVec.y,
        baseVec.z + battleroyale.utils.random(-half, half));
    }

    static broadcastToLobby(msg) {
      for(let player of battleroyale.game.players.onlobby) {
        battleroyale.chat.send(player, msg);
      }
    }

    static inRangeOfPoint(ppos, bpos, radius) {
      return(Math.pow((ppos.x - bpos.x), 2) +
              Math.pow((ppos.y - bpos.y), 2) +
              Math.pow((ppos.z - bpos.z), 2) < Math.pow(radius, 2));
    }

    static findBySteamId(id) {
      var index = jcmp.players.map(function(player) { return player.client.steamId; }).indexOf(id);
      return jcmp.players[index];
    }

    /*static deleteFromArray(array, value) {
      index = array.indexOf(value);
      array.splice(index, 1);
    }*/

    static IsPointInCircle(v1, v2, radius) {
      //console.log(battleroyale.utils.GetDistanceBetweenPointsXY(v1, v2));
      return battleroyale.utils.GetDistanceBetweenPointsXY(v1, v2) <= radius;
      /*var distsq = (v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y);
      return distsq <= radius * radius;*/
    }

    static IsPointInCircle2D(v1, v2, radius) {
      return this.GetDistanceBetweenPointsX(v1, v2) <= radius;
    }

    static IsPointInCylinder(v1, v2, radius, h) { // h is the height of the cylinder radius in altitude
        if(this.GetDistanceBetweenPointsXY(v1, v2) <= radius && v1.z >= v2.z && v2.z <= (v2.z + h)) {
          return true;
        }
        return false;
    }

    static GetDistanceBetweenPointsX(v1, v2) {
      return this.GetDistanceBetweenPoints(new Vector3f(v1.x,0,0), new Vector3f(v2.x,0,0));
    }

    static GetDistanceBetweenPoints(v1, v2)
    {
        let dx = v1.x - v2.x;
        let dy = v1.y - v2.y;
        let dz = v1.z - v2.z;

        return Math.sqrt( dx * dx + dy * dy + dz * dz );
        //return Math.sqrt(Math.pow(Math.abs(v1.x-v2.x),2) + Math.pow(Math.abs(v1.y-v2.y),2)+ Math.pow(Math.abs(v1.z-v2.z),2))
    }

    static GetDistanceBetweenPointsXY(v1, v2) {
      let v13f = new Vector3f(v1.x, v1.y, 0.0);
      let v14f = new Vector3f(v2.x, v2.y, 0.0);
      return battleroyale.utils.GetDistanceBetweenPoints(v13f, v14f);

    }
};

Array.prototype.removePlayer = function(player) {

  var index = this.findIndex(function(e) {
    return e.client.steamId === player.client.steamId;
  });

  if(index >= 0) this.splice(index, 1);
  return this;
}

Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if(index >= 0) this.splice(index, 1);
  return this;
}
