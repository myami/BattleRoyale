'use strict';

const fs = require('fs');
const path = require('path');
const sphere = require ('../sphere');

module.exports = class Utility {

  /**
  * Returns the player from his id or (part of his) Name
  *
  * @param  {string/number} idOrName Networkid or name of the player (or some digits of the name)
  * @param  {boolean=} [allowDuplicates=false] False: If multiple players have the same Name only the first one found is returned.
  *                                            True: Returns an array with all duplicate players with the name
  * @param  {boolean=} [caseSensitive=false] True if case sensitive, false if not
  * @return {Player} An array with the players found with the id or the name,
  *                  only contains the first one found if allowDuplicates was false, empty array if no player was found
  */
  static getPlayer(idOrName, opt_allowDuplicates, opt_caseSensitive) {
    let allowDuplicates = opt_allowDuplicates || false;
    let caseSensitive = opt_caseSensitive || false;
    let id = parseInt(idOrName);
    let fnCheck;

    if (isNaN(id)) {
      if(caseSensitive === false) {
        idOrName = idOrName.toLowerCase();
      }

      // define fnCheck to check the players name
      fnCheck = target => {
        let targetName;
        if(caseSensitive === false) {
          //ignore capital letters
          targetName = target.name.toLowerCase();
        }
        else {
          // do not ignore capital letters
          targetName = target.name;
        }
        if (targetName.indexOf(idOrName) === 0) {
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
   * Returns a random number (inclusive - inclusive)
   *
   * @param {integer} min - minimum number
   * @param {integer} max - maximum number
   * @returns {integer}
   */
  static random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Returns a string representation of a death reason
   *
   * @param {integer} deathReason - The reason of the death
   * @returns {string}
   */
  static deathReasonToString(deathReason) {
    switch (deathReason) {
      case 1: return 'Gunshot';
      case 2: return 'Explosion';
      case 3: return 'Vehicle';
      case 4: return 'Falling';
      case 5: return 'Drowning';
    }

    return 'Unknown';
  }

  /**
   * Recursively reads a directory.
   *
   * @param {string} dir - dir
   * @param {function(err: Error, list: Array.<string>)} done - callback
   * @param {boolean} [filesOnly=false] - whether to include only files in the result
   */
  static rreaddir(dir, done, filesOnly = false) {
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
    })
  }

  /**
   * Loads all files from a directory recursively.
   *
   * @param {string} path - path to the directory
   */
  static  loadFilesFromDirectory(path) {
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

  static RandomInt  (min, max) {
  	return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // probleme here
  /*sphere.prototype.inRangeOfPoint (position) {

  	return (Math.pow((position.x - this.x), 2) +
              Math.pow((position.y - this.y), 2) +
              Math.pow((position.z - this.z), 2) < Math.pow(this.radius, 2));
  }*/
//
 
  
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
    //console.log("Distante between points" + Utility.GetDistanceBetweenPoints(v13f, v14f));
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



































}
