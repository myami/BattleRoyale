'use strict';

// player created
events.Add("PlayerCreated", function(player) {
  console.log("Player " + player.name + " has successfully joined the server.");
  gm.utility.broadcastMessage(player.name + " has joined the server.", gm.config.colors.orange);

  player.ingame = false;  // BR

  player.SendChatMessage("Welcome to the server BattleRoyale :", new RGB(0, 255, 0));
  player.SendChatMessage("<em>Type /help to see a list of all commands</em>");
});

// player ready
events.Add("PlayerReady", function(player) {
  player.respawnPosition = new Vector3f(3604.17163, 1043.61633, 1178.84021);
  player.Respawn();
  player.world.weather = gm.config.world.weather;
  player.world.SetTime(gm.config.world.timeHour, gm.config.world.timeMinute, gm.config.world.timeSecond);
  console.log("Player " + player.name + " has spawned.");
  /*setTimeout(() => {
    player.GiveWeapon(0xcb75ff26, 1000, true); Donne arme tout les X secondes
  }, 500); */
});

// player death
events.Add("PlayerDeath", function(player, killer, reason) {

  if(player.ingame) {
    player.ingame = false;
    player.position = gm.config.game.lobbypos;
    let index = g_pingame.indexOf(player);
    g_pingame.splice(index, 1);
    gm.utility.broadcastMessage(player.name + "was killed by " + killer.name + " " + g_pingame.length + " survivors left");
  }
  
  let message = player.name + " ";
  if (typeof killer !== "undefined") {
    if (killer === player) {
      message += "killed himself. (" + gm.utility.deathReasonToString(reason) + ")";
    } else {
      if (typeof killer.name !== "undefined") {
        message += "has been killed by " + killer.name + ". (" + gm.utility.deathReasonToString(reason) + ")";
      } else {
        message += "has been run over by a vehicle (probably).";
      }
    }
  } else {
    message += "died. (" + gm.utility.deathReasonToString(reason) + ")";
  }


  gm.utility.broadcastMessage(message);

  player.Respawn();
});

// player destroyed
events.Add("PlayerDestroyed", function(player) {
  console.log("Player " + player.name + " is leaving the server.");
  gm.utility.broadcastMessage(player.name + " has left the server.", gm.config.colors.orange);
});

// player enter vehicle
events.Add("PlayerEnterVehicle", function(player, vehicle) {
  console.log(player.name + " entered vehicle " + vehicle.networkId);
});

// player exit vehicle
events.Add("PlayerExitVehicle", function(player, vehicle) {
  console.log(player.name + " exited vehicle " + vehicle.networkId);
});
