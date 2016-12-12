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


    static print (message){
      let fmsg = Utility.timestamp() + " " + message;
      console.log(fmsg);
      /*let f = gm.fs("./logs/general.txt");
      f.write(fmsg+ "\n");
      f.end();*/
    }
    static timestamp (){
      let d = new Date();
    	let year = d.getFullYear();
    	let month = Utility.PutCero(d.getMonth());
    	let day = Utility.PutCero(d.getDate());
    	let hour = Utility.PutCero(d.getHours());
    	let min = Utility.PutCero(d.getMinutes());
    	let secs = Utility.PutCero(d.getSeconds());
    	let time = "[" + day + "/" + month + "/" + year + "][" + hour + ":" + min + ":" + secs + "]";
    	return time;

    }

    static seconds (seconds){
      return seconds * 1000;
    }
    static minutes (minutes){
    return utility.seconds(60) * minutes
    }

    static isInArray (value, array){
      //return array.indexOf(value) > -1;

    let result = array.indexOf(value);

    if(result >= 0) return true;
    else return false;

    }

    static IsPointInCircle(v1, v2, radius) {
      if(Utility.GetDistanceBetweenPointsXY(v1, v2) <= radius) return true;
      else return false;
    }
    static GetDistanceBetweenPoints(v1, v2) {
    	const dx = Math.abs(v1.x - v2.x);
    	const dy = Math.abs(v1.y - v2.y);
    	const dz = Math.abs(v1.z - v2.z);
    	return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
    }
    static GetDistanceBetweenPointsXY (v1, v2) {
      let v13f = new Vector3f(v1.x, v1.y, 0.0);
      let v14f = new Vector3f(v2.x, v2.y, 0.0);
      return Utility.GetDistanceBetweenPoints(v13f, v14f);

    }

    static debugMsg (message) {
    	if(gm.config.debug) console.log("[DEBUG] " + message);
    }
    static msToMinutes (ms) {
    	return (ms / 1000) / 60;
    }
    static PutCero (n) {
    	if(n >= 0 && n <= 9) {
    		return "0" + n;
    	} else return n;
    }
    static round (value, decimals) {
    	return parseFloat(Math.round(value+'e'+decimals)+'e-'+decimals);
    }
    static RandomFloat (min, max) {
    	return (Math.random() * (min - max) + max);
    }



    static dbConnect () {
        gm.utility.print("Server wants to connect");
      	return gm.mysql.createConnection({
              host     : gm.config.mysql.host,
              user     : gm.config.mysql.user,
              password : gm.config.mysql.password,
              database : gm.config.mysql.database
          });
      }

      static ban (player) {

      	let connection = Utility.dbConnect();

      	connection.connect();

      	let SQLQuery = "UPDATE users SET banned = 1 WHERE id = " + PlayerInfo[player.name].id;
      	printf(player.name + "a été bannis");
      	connection.query(SQLQuery);

      	connection.end();

      }

      static unban (player) {

      	let connection = Utility.dbConnect();


      	connection.connect();

      	let SQLQuery = "UPDATE users SET banned = 0 WHERE id = " + PlayerInfo[player.name].id;
      	printf(player.name + "a été débannis");
      	connection.query(SQLQuery);

      	connection.end();

      }
      static adminMessage (message, opt_color) {
          for (let player of jc3mp.players) {
          if(PlayerInfo[player.name].adminlvl >= 1) {
            player.SendChatMessage(message, opt_color);
        }
        }
        }























};
