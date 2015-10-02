
"use strict";

/**
 * @namespace
 */
let Events = module.exports;
let commands = require('./commands');

/**
 * Registers all Events.
 *
 */
Events.register = () => {
  // Note: 'events' is the GTA:MP Event-System.
  events.Add("ClientConnected", Events.onClientConnected);
  events.Add("ClientDisconnected", Events.onClientDisconnected);

  events.Add("ChatMessage", Events.onChatMessage);
  events.Add("ChatCommand", Events.onChatCommand);

  events.Add("PlayerCreated", Events.onPlayerCreated);
  events.Add("PlayerDestroyed", Events.onPlayerDestroyed);

  events.Add("PlayerShot", Events.onPlayerShot);
  events.Add("PlayerDeath", Events.onPlayerDeath);
};

/**
 * Called when a Client connects
 *
 * @param {Client} client the new client
 */
Events.onClientConnected = client => {
  console.log("Client (ip: " + client.ipAddress + ") connected.");
};

/**
 * Called when a Client disconnects
 *
 * @param {Client} client the new client
 * @param {integer} reason disconnect reason
 */
Events.onClientDisconnected = (client, reason) => {
  console.log("Client (ip: " + client.ipAddress + ") disconnected. Reason: " + (reason === 1 ? "Timeout" : "Normal quit"));
};

/**
 * Called when a Player typed a message in the chat.
 *
 * @param {Player} player the player
 * @param {string} message the message
 * @returns {boolean} whether the chat message should be blocked or not.
 */
Events.onChatMessage = (player, message) => {
  // basic example on blocking swearing players
  let lowMsg = message.toLowerCase();
  for (let badWord of gm.config.badWords) {
    if (lowMsg.indexOf(badWord.toLowerCase()) !== -1) {
      player.SendChatMessage("Please be nice.", new RGB(255, 59, 59));
      return true;
    }
  }

  let fmsg = player.name + ": " + message;
  return fmsg;
};

/**
 * Called when a Player types in a chat command (e.g. /command)
 *
 * @param {Player} player the player
 * @param {string} command the command
 */
Events.onChatCommand = (player, command) => {
  let args = command.split(" ");

  // Let's check if this crazy thing ever happens.
  if (args.length === 0) {
    throw "This should NEVER happen.";
  }
  let commandName = args.splice(0, 1)[0];

  for (const command of commands) {
    if (command[0].toLowerCase() === commandName.toLowerCase()) {
      command[1](player, args);
      return true;
    }
  }
  player.SendChatMessage("Unknown command.", new RGB(255, 59, 59));
};

/**
 * Called when a new Player was created (after he connected)
 *
 * @param {Player} player the new player
 */
Events.onPlayerCreated = player => {
  console.log(player.name + " it's connected.");

  // Set world for the player
  let now = new Date();
  player.world.SetTime(now.getHours(), now.getMinutes(), now.getSeconds());
  player.world.timeScale = gm.config.world.timeScale;
  player.world.weather = gm.config.world.defaultWeather;

  for (let ipl of gm.config.world.IPLs) {
    player.world.RequestIPL(ipl);
  }
  for (let interior of gm.config.world.interiors) {
    player.world.EnableInterior(interior);
    if (!gm.config.world.capInteriors) {
      player.world.UnCapInterior(interior);
    }
  }

  pInGame[player.name] = false;
  player.SendChatMessage("Welcome to the server battleroyale : ", new RGB(0, 255, 0));
  player.SendChatMessage("<em>Write /help to see the commands</em>");
};

/**
 * Called when a Player dies
 *
 * @param {Player} player the player that is no more :'(
 * @param {integer} reason the reason (hash)
 */
Events.onPlayerDeath = (player, reason, killer) => {

  /*let message = "~r~" + player.name + "~s~ ";
  if (typeof killer !== "undefined") {
    if (killer === player) {
      message += "killed himself.";
    } else {
      if(typeof killer.name !== "undefined") {
        message += "has been killed by ~r~" + killer.name + "~s~.";
      } else {
        message += "has been run over by a vehicle (probably).";
      }
    }
  } else {
    message += "died.";
  }


  for (let tempPlayer of g_players) {
    tempPlayer.graphics.ui.DisplayMessage(message);
  }*/

  if(pInGame[player.name]) {
    pInGame[player.name] = false;
    player.position = gm.config.game.lobbypos;
    let index = g_pingame.indexOf(player);
    g_pingame.splice(index, 1);
    gm.utility.broadcastMessage(player.name + "was killed by " + killer.name + " " + g_pingame.length + " survivors left");
  }


};

/**
 * Called when a Player shot
 *
 * @param {Player} player the shooting player
 * @param {integer} weaponType the weapon he used to shoot
 * @param {Vector3f} aimPos aim position
 */
Events.onPlayerShot = player => {
  player.graphics.ui.DisplayMessage("~r~SHOTS FIRED");
};

/**
 * Called when a Player is leaving the Server
 *
 * @param {Player} player the leaving player
 */
Events.onPlayerDestroyed = player => {
  console.log(player.name + " is disconnect.");
};

/*
 Check every second for changes on the server/players
*/

 Events.Checks = () => {

  //console.log("Check!");
  gm.utility.print("Check!");

  if(!Started)
  {
    if(!beingStart && g_players.length >= gm.config.game.minPlayers)
    {
      gm.utility.broadcastMessage("Minimum number of players reached to start");
      gm.utility.broadcastMessage("Game is going to start in 3 minutes");
      beingStart = true;
      global.beingStartTimer = setTimeout(function() {
        gm.events.OnBattleStart();
      }, gm.utility.minutes(3));
    }

    if(beingStart && g_players.length < gm.config.game.minPlayers)
    {
      clearTimeout(beingStartTimer);
      let needplayers = gm.config.game.minPlayers - g_players.length;
      gm.utility.broadcastMessage("Need " + needplayers + " players more");
    }
  } else { // if Started == true

    for(let player of g_pingame) { // Check if player was in area.
      if(!gm.utility.IsPointInCircle(player.position, battleArea.position, battleArea.radius)) {
        // Change player health -2
        setInterval(function() { gm.events.OnPlayerOutArea(player); }, gm.utility.seconds(15));
      }
    }
  }


  // Check if the players on the lobby was in lobby area or not.

  for(let player of g_players) {
    if(!gm.utility.IsPointInCircle(player.position, gm.config.game.lobbypos, 100.0) && !pInGame[player.name]) {

      console.log(player.name + " was not in lobby area"); 
      console.log("changing player position");
      player.position = gm.config.game.lobbypos;
      console.log(player.name + " X: " + player.position.x + " Y: " + player.position.y + " Z: " + player.position.z);
    }


  }

  // Here check if player was on the area ...

 };

/*
 Called when battle royale starts
*/

Events.OnBattleStart = () => {

  console.log("Battle started!");
  Started = true;
  beingStart = false;

  global.EndTimer = setTimeout(function() {
    gm.events.OnBattleEnd();
  }, gm.config.game.roundTime);

  global.AreaTimer = setInterval(function() { 
    gm.events.OnBattleAreaChange();
  }, gm.utility.minutes(3));

  let maxSpawn = gm.spawns.spawn.length - 1;
  let rnd = gm.utility.RandomInt(0, maxSpawn);
  //console.log("RANDOM INDEX: " + rnd);
  let data = gm.spawns.spawn[rnd];
  let spawnPos = new Vector3f(data.x, data.y, data.z);

  for(let player of g_players) {
    pInGame[player.name] = true;
    g_pingame.push(player);
    player.position = spawnPos;
  }

   global.battleArea = { position: spawnPos, radius: gm.config.game.startAreaRadius }; // position here is useless

  //gm.utility.LoadVehicles();

};

/*
 Called when battle royale ends.
*/

 Events.OnBattleEnd = (player) => {

  if(typeof player === 'undefined') { // if the round ends with more than 1 player alive.
    let survivorcount;
    for(let player of g_players) {
      if(pInGame[player.name]) {
        survivorcount++;
      }
    }

    gm.utility.broadcastMessage(survivorcount + " people survived to the battle");
    gm.utility.broadcastMessage("Survivors: ");

    for(let player of g_players) {
      if(pInGame[player.name]) {
        pInGame[player.name] = false
        player.position = gm.config.game.lobbypos;
        gm.utility.broadcastMessage(" - " + player.name);
      }
    }

  } else { // if round gots a winner
    gm.utility.broadcastMessage(player.name + "was the winner of battle royale!");
    pInGame[player.name] = false;
    player.position = gm.config.game.lobbypos;
  }

  gm.utility.broadcastMessage("A new battle is going to start soon!");
};

/*
 Called when the battle area changes
*/

Events.OnBattleAreaChange = () => {
  /*for(let player of g_pingame) {

  }*/

  gm.utility.broadcastMessage("Battle area changed, look to the map");

  let rnd = gm.utility.RandomInt(0, g_pingame.length);
  let areaPos = g_pingame[rnd].position;
  let rad = battleArea.radius / 2
  battleArea = { position: areaPos, radius: rad }


};

Events.OnPlayerOutArea = (player) => {
  player.SendChatMessage("You not are in the area!!");
  // Change health -2 for example
};