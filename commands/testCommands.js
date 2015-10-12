/**
 */
'use strict';

module.exports = function(register) {
	register('incircle', function(player) {
		 if(gm.utility.IsPointInCircle(player.position, gm.config.game.lobbypos, 100.0)) {
		    player.SendChatMessage("You in the circle");
		  } else {
		    player.SendChatMessage("You're not in the circle");
		  }
	});

	register(['broadcast', 'b'], function(player) {
		let str = "";
	    for (let i = 1; i < arguments.length; i++) {
	      str += arguments[i] + ' ';
	    }
	    gm.utility.broadcastMessage(`((BROADCAST)) ${player.name}: ${str}`, new RGB(255,0,0));
	});

	register('setpos', function(player,x,y,z) {
		let pos = { x: parseFloat(x), y: parseFloat(y), z: parseFloat(z) }
		let setpos = new Vector3f(pos.x, pos.y, pos.z);
		player.position = setpos;
		console.log(player.name + " set to X:" + x + " Y: " + y + " Z: " + z);
	});

	register('mypos', function(player) {
		player.SendChatMessage("You position is: X: " + player.position.x + " Y: " + player.position.y + " Z: " + player.position.z);
	});

	register('startBattle', function(player) {
		console.log("battle started!");
		clearTimeout(global.beingStartTimer);
		gm.events.OnBattleStart();
	});

	register('endBattle', function(player) {
	  clearTimeout(EndBattle);
	  gm.events.OnBattleEnd();
	});

	register('seespawns', function(player) {

	  for(let i = 0; i < gm.spawns.spawn.length; i++) {
	    let data = gm.spawns.spawn[i];
	    player.SendChatMessage(i + ": " + " X: " + data.x + " Y: " + data.y + " Z: " + data.z);
	  }

	});

	register("reduceArea", function(player) {
	  clearInterval(global.AreaTimer);

	  gm.events.OnBattleAreaChange();


	  // Start the interval again

	  global.AreaTimer = setInterval(function() { 
	    gm.events.OnBattleAreaChange();
	  }, gm.utility.minutes(3));

	});

	register("inbattlearea", function(player) {
	  if(gm.utility.IsPointInCircle(player.position, battleArea.position, battleArea.radius)) {
	    player.SendChatMessage("You are in range of battle area circle");
	  } else {
	    player.SendChatMessage("You aren't in range of battle area circle");
	  }
	});

	register("survival" , function(player) {
	  console.log(g_pingame.length);
	});

	register("msToMinutes", function(player) {
	  let tim = (15 * 1000) * 60;
	  player.SendChatMessage("15000 ms = " + gm.utility.msToMinutes(tim))
	});

	register("roundTime", function(player) {
	  player.SendChatMessage(gm.utility.PutCero(timeLeft.minutes) + ":" + gm.utility.PutCero(timeLeft.seconds));
	});

	register("reboot", function(player) {
		player.SendChatMessage("Server restarting...");
		console.log("Server restarting...");
		server.Restarts();
	});

	register("customshit", function(player) {
		player.shit = true;
		if(player.shit) { player.SendChatMessage("Player gots shit") }
	});

}