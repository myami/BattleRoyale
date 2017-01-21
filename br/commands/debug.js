'use strict';

module.exports = ({ Command, manager }) => {
  manager.category('debug', 'commands for debug purposes')
  .add(new Command('savepos').description('Save a position to file').handler(function(player) {

    if(!battleroyale.utils.isAdmin(player)) {
      return battleroyale.chat.send(player, "You're not allowed to use this command", battleroyale.config.colours.red);
    }

    var fs = require('fs');

    var text = "new Vector3f(" + player.position.x + ", " + player.position.y + ", " +player.position.z + ")\n";
    if(!fs.existsSync('./savepos.txt')) {
      fs.writeFileSync("./savepos.txt", text + ",\n");
    } else {
      fs.appendFileSync("./savepos.txt", text+ ",\n");
    }

    battleroyale.chat.send(player, "Position saved sucesfully", battleroyale.config.colours.command_success);
  }))
  .add(new Command('exit').description('Exit from the server').handler(function(player) {
    player.Kick('exit');
  }))

  .add(new Command('gotoLobby').description('Go to the lobby position').handler(function(player) {

    if(!battleroyale.utils.isAdmin(player)) {
      return battleroyale.chat.send(player, "You're not allowed to use this command", battleroyale.config.colours.red);
    }

    player.position = new Vector3f(-13568.4765625, 1235.1798095703125, 15075.5048828125);
    battleroyale.chat.send(player, "TP To lobby position");

  }))

  .add(new Command('gotoLobbyrnd').description('Go to the lobby position').handler(function(player) {

    if(!battleroyale.utils.isAdmin(player)) {
      return battleroyale.chat.send(player, "You're not allowed to use this command", battleroyale.config.colours.red);
    }

    player.position = battleroyale.utils.randomSpawn(new Vector3f(-13568.4765625, 1235.1798095703125, 15075.5048828125), battleroyale.config.game.lobbyRadius / 2);
    battleroyale.chat.send(player, "TP To lobby position");

  }))

  .add(new Command('admins').description('Show active admins').handler(function(player) {
    battleroyale.chat.send(player, 'List of active admins : <div class="admin-logo"></div><ul>');
    for(var i = 0; i < jcmp.players.length; i++) {

      if(battleroyale.utils.isAdmin(jcmp.players[i])) {
        battleroyale.chat.send(player, "<li> " + jcmp.players[i].escapedNametagName + "</li>");
      }
    }
    battleroyale.chat.send(player, "</ul>");
  }))

  .add(new Command('demotemy').description('Demote urself').handler(function(player) {

    if(!battleroyale.utils.isAdmin(player)) {
      return battleroyale.chat.send(player, "You're not admin");
    }

    battleroyale.chat.send(player, "You removed ur admin permissions");
    // --

    var index = battleroyale.config.admins.indexOf(player.client.steamId);
    battleroyale.config.admins.splice(index, 1);
  }))

  .add(new Command('promotemy').description('Promote urself').handler(function(player) {

    battleroyale.chat.send(player, "You promoted ur admin permissions");
    battleroyale.config.admins.push(player.client.steamId);
  }))

  .add(new Command('inlobbypos').description('Check if ur in lobby pos').handler(function(player) {

    if(battleroyale.utils.IsPointInCircle2D(player.position, battleroyale.config.game.lobbypos, battleroyale.config.game.lobbyRadius)) {
      battleroyale.chat.send(player, "You're in lobby pos");
    } else {
      battleroyale.chat.send(player, "You're not in lobby pos");
    }

  }))

  .add(new Command('setminplayers').parameter('number', 'number', 'number of min players').description('Save a position to file').handler(function(player, namber) {

    battleroyale.config.game.minPlayers = parseInt(namber);
    battleroyale.chat.send(player, "Min number set to " + namber)
  }))

  .add(new Command('forcestart').description('Forces the battle start').handler(function(player) {

    clearTimeout(battleroyale.game.toStart);
    jcmp.events.Call('battleroyale_start_battle');

  }))

  .add(new Command(['lobbybroadcast', 'lbrod'])
  .description('Send a message to the lobby')
  .parameter('message', 'string', 'message', { isTextParameter: true })
  .handler((player, message) => {

    battleroyale.utils.broadcastToLobby(message);

  }))

  .add(new Command('lobbyPlayers').description('Shows the player on the lobby').handler(function(player) {
    battleroyale.chat.send(player, "List of players on lobby (" + battleroyale.game.players.onlobby.length + ")" );
    for(let target of battleroyale.game.players.onlobby) {
      battleroyale.chat.send(player, target.escapedNametagName);
    }
  }))

  .add(new Command('ingamepos').description('Check if ur in game pos radius').handler(function(player) {

    if(player.battleroyale.ingame) {
      if(battleroyale.utils.IsPointInCircle(player.position, player.battleroyale.game.position, player.battleroyale.game.radius)) {
        battleroyale.chat.send(player, "You're in game pos");
      } else {
        battleroyale.chat.send(player, "You're not in game pos");
      }
    } else {
      return battleroyale.chat.send(player, "You're not in a game");
    }
  }))

  .add(new Command('warningui').description('Shows the UI of warning').handler(function(player) {

    if(typeof player.battleroyale.showui === 'undefined') {
      player.battleroyale.showui = false;
    }

    player.battleroyale.showui = !player.battleroyale.showui;
    console.log("Command executed");
    jcmp.events.CallRemote('outarea_toggle', player, player.battleroyale.showui);
  }))

  .add(new Command('playersinlobby').description('Show the players in the lobby').handler(function(player) {
    battleroyale.chat.send(player, battleroyale.game.players.onlobby.length + " players in lobby room waiting <u");

    for(let p of battleroyale.game.players.onlobby) {
      battleroyale.chat.send(player, " - " + p.escapedNametagName)
    }

  }))

  .add(new Command('playersingame').description('Show the players in the lobby').handler(function(player) {
    battleroyale.chat.send(player, battleroyale.game.players.ingame.length + " players in some game playing <u");

    for(let p of battleroyale.game.players.ingame) {
      battleroyale.chat.send(player, " - " + p.escapedNametagName)
    }

  }))

  .add(new Command('showgamesinfo').description('Show the info of the games').handler(function(player) {
    console.log("Showing info of " + battleroyale.game.games.length)
    for(let game of battleroyale.game.games) {
      console.log("+++++++++++++++++++++");
      console.log("Game ID: " + game.id);
      console.log("Number of players: " + game.players.length)
      console.log("Player list:")
      for(let p of game.players) {
        console.log(" - " + p.name);
      }
      console.log("--------------------")
    }

  }))

  .add(new Command('storecurrentgame').description("Stores game in a var").handler(function(player) {
    console.log(player.battleroyale.game);
    player.battleroyale.storeGame = player.battleroyale.game;
    battleroyale.chat.send(player, "Game stored");
  }))

  .add(new Command('showstoredgameinfo').description("Shows the info of the stored game").handler(function(player) {
      var game = player.battleroyale.storedGame;
      console.log("+++++++++++++++++++++");
      console.log("Game ID: " + game.id);
      console.log("Number of players: " + game.players.length)
      console.log("Player list:")
      for(let p of game.players) {
        console.log(" - " + p.name);
      }
      console.log("--------------------")

  }))

  .add(new Command('gameIndexData').description("Shows the info of the stored game").handler(function(player) {
    console.log(battleroyale.game.players.ingame[0]);
  }))

  .add(new Command('distancetolobby').description("Shows the distance between you and the lobby point").handler(function(player) {
    battleroyale.chat.send(player, "Distance: " + battleroyale.utils.GetDistanceBetweenPointsX(player.position, battleroyale.config.game.lobbypos));
  }))

  .add(new Command('spawnObject').description("Spawns a object in ur position").parameter('objectName', 'string').handler(function(player, objectName) {
    var gameObject = new GameObject(objectName, player.position);
  }))

  .add(new Command('tpvulcan').description("Tp yourself to the vulcan").handler(function(player) {
    player.position = new Vector3f(-12561.109375, 4301.36865234375, -12055.4267578125);
    battleroyale.chat.send(player, "Tped to the vulcan");
  }))

  .add(new Command('distancetogame').description("Checks the distance to the game position").handler(function(player) {

    if(!player.battleroyale.ingame) {
      return battleroyale.chat.send(player, "You're not in a game");
    }

    console.log("Distance to game pos " + battleroyale.utils.GetDistanceBetweenPointsX(player.position, player.battleroyale.game.position))
    console.log("Player position: " + JSON.stringify(player.position));
    console.log("Battle position: " + JSON.stringify(player.battleroyale.game.position));

  }))

  .add(new Command('createPOI').description('Creates a POI').parameter('type', 'number', 'POI type').parameter('name', 'string', 'POI name', { isTextParameter: true }).handler(function(player, type, name) {
    var aPOI = new POI(type, player.position, name);
    aPOI.visible = false;
    aPOI.clampedToScreen = true;
    aPOI.dimension = player.dimension;


  }));




}
