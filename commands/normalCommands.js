/**
 */
'use strict';

module.exports = function(register) {

	register(['players', 'who', 'playerlist'], function(player) {
		player.SendChatMessage("Was " + gtamp.players.length + " player(s) connected");
		for(let i = 0; i < gtamp.players.length; i++) {
			let target = gtamp.players[i];
			player.SendChatMessage(target.name);
		}
	});

	register("roundTime", function(player) {
	  player.SendChatMessage(gm.utility.PutCero(timeLeft.minutes) + ":" + gm.utility.PutCero(timeLeft.seconds));
	});
}