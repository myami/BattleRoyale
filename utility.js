
"use strict";

let Utility = module.exports;
Utility.hashes = require('./hashes/hashes');

/**
 * Broadcasts a Message to all Players.
 *
 * @param {string} message the message to broadcast.
 * @param {RGB=} [opt_color] color of the message
 */
Utility.broadcastMessage = (message, opt_color) => {
  for (let player of g_players) {
    player.SendChatMessage(message, opt_color);
  }
};

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
Utility.getPlayer = (idOrName, opt_allowDuplicates, opt_caseSensitive) => {
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
	for (let tempPlayer of g_players) {
		if (fnCheck(tempPlayer)) {
			playerArray.push(tempPlayer);
			if(allowDuplicates === false) {
				// exit the loop, because we just return the first player found
				break;
			}
		}
	}
	return playerArray;
};

Utility.print = (msg) => {
  let fmsg = Utility.timestamp() + " " + msg;
  console.log(fmsg);
  /*let f = gm.fs("./logs/general.txt");
  f.write(fmsg+ "\n");
  f.end();*/
};

Utility.timestamp = () => {
	let d = new Date();
	let year = d.getFullYear();
	let month = d.getMonth();
	let day = d.getDate();
	let hour = d.getHours();
	let min = d.getMinutes();
	let secs = d.getSeconds();
	let time = "[" + day + "/" + month + "/" + year + "][" + hour + ":" + min + ":" + secs + "]";
	return time;
};

Utility.seconds = (seconds) => {
	return seconds * 1000;
};

Utility.minutes = (minutes) => {
	return Utility.seconds(60) * minutes;
};

Utility.isInArray = (value, array) => {
  //return array.indexOf(value) > -1;

  let result = array.indexOf(value);

  if(result >= 0) return true;
  else return false;

};

Utility.RandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

Utility.sphere = class Sphere { // By Tirus

    constructor(x, y, z, opt_radius) {
	    this.x = x;
	    this.y = y;
	    this.z = z;
	    this.radius = opt_radius || 1;
    }

};

Utility.sphere.prototype.inRangeOfPoint = function(position) { // By Tirus

	console.log(position.x);
	return (Math.pow((position.x - this.x), 2) +
            Math.pow((position.y - this.y), 2) +
            Math.pow((position.z - this.z), 2) < Math.pow(this.radius, 2));
}

Utility.RandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};



Utility.IsPointInCircle = function(v1, v2, radius) {
  if(Utility.GetDistanceBetweenPointsXY(v1, v2) <= radius) return false;
  else return true;
}

Utility.GetDistanceBetweenPoints = function(v1, v2) {
  //return (Math.sqrt(Math.pow(Math.abs(v1.x, v2.x),2)) + Math.sqrt(Math.pow(Math.abs(v1.y, v2.y),2))) + Math.sqrt(Math.pow(Math.abs(v1.z, v2.z),2));
  return (Math.sqrt(Math.pow(Math.abs(v1.x, v2.x),2)) + Math.sqrt(Math.pow(Math.abs(v1.y, v2.y),2))) + Math.sqrt(Math.pow(Math.abs(v1.z, v2.z),2));
}

Utility.GetDistanceBetweenPointsXY = function(v1, v2) {
  let v13f = new Vector3f(v1.x, v1.y, 0.0);
  let v14f = new Vector3f(v2.x, v2.y, 0.0);
  return Utility.GetDistanceBetweenPoints(v13f, v14f);

}

Utility.debugMsg = function(msg) {
	if(gm.config.debug) console.log("[DEBUG] " + msg);
}