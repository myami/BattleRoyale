'use strict';

module.exports = register => {
  register('incircle' , (player) => {
    if(gm.utility.IsPointInCircle(player.position, gm.config.game.lobbypos, 100.0)) {
        player.SendChatMessage("You in the circle");
      } else {
        player.SendChatMessage("You're not in the circle");
      }
};

register('setpos' , (player,args) => {
  let pos = { x: parseFloat(args[0]), y: parseFloat(args[1]), z: parseFloat(args[2]) }
    let setpos = new Vector3f(pos.x, pos.y, pos.z);
    player.position = setpos;
    console.log(player.name + " set to X:" + args[0] + " Y: " + args[1] + " Z: " + args[2]);
};
register('players' , (player) => {
  console.log("Players: " + g_players.length);
};

register('mypos' , (player) => {
  player.SendChatMessage("You position is: X: " + player.position.x + " Y: " + player.position.y + " Z: " + player.position.z);

};
register('startBattle' , (player) => {
  console.log("battle started!");
clearTimeout(beingStartTimer);
gm.events.OnBattleStart();
};

register('endBattle', function(player) {
	  clearTimeout(global.EndTimer);
	  gm.events.OnBattleEnd();
	});

register('seespawns' , (player) => {
  for(let i = 0; i < gm.spawns.spawn.length; i++) {
    let data = gm.spawns.spawn[i];
    player.SendChatMessage(i + ": " + " X: " + data.x + " Y: " + data.y + " Z: " + data.z);
  }
};

register('reduceArea' , (player) => {
  clearInterval(global.AreaTimer);

  gm.events.OnBattleAreaChange();


  // Start the interval again

  global.AreaTimer = setInterval(function() {
    gm.events.OnBattleAreaChange();
  }, gm.utility.minutes(3));

};


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
