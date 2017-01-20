'use strict';

jcmp.events.Add('battleroyale_updates', function() {

  //console.log("Battleroyale update called!");

  if(battleroyale.game.players.onlobby.length >= battleroyale.config.game.minPlayers && !battleroyale.game.toStart) {
    battleroyale.game.toStart = true;
    battleroyale.chat.broadcast("battleroyale is going to start in 3 minutes");
    battleroyale.game.StartTimer = setTimeout(function() {
      // Start a new game
      jcmp.events.Call('battleroyale_start_battle');
    }, battleroyale.utils.MinToMs(1)) // 3 = TIME TO START WHEN REACH THE MIN PLAYERS QUANTITY
  }

  if(battleroyale.config.game.minPlayers > battleroyale.game.players.onlobby.length && battleroyale.game.toStart) {
    clearTimeout(battleroyale.game.StartTimer);
    console.log("Game start cancelled")
    battleroyale.game.toStart = false;
    battleroyale.utils.broadcastToLobby("Need more players to start, the start timer was clear");
  }

  //for(var i = 0; i < battleroyale.game.players.onlobby.length; i++) {
  //console.log(battleroyale.game.players.onlobby);
  battleroyale.game.players.onlobby.forEach(function(player) {


    //var player = battleroyale.game.players.onlobby[i];
    try {

      /*if(typeof(player) === 'undefined') {
        console.log("Es undefined premo 2");
        //continue;
      }*/

      if(!battleroyale.utils.IsPointInCircle(player.position, battleroyale.config.game.lobbypos, battleroyale.config.game.lobbyRadius) && player.battleroyale.ready && !battleroyale.utils.isAdmin(player)) {
        battleroyale.chat.send(player, "You're not in the lobby area, returning you to the lobby area");
        player.respawnPosition = battleroyale.utils.randomSpawn(battleroyale.config.game.lobbypos, battleroyale.config.game.lobbyRadius / 2);
        player.Respawn();
      } else {
        /*console.log(player.name + " is on lobby");
        console.log(player);*/
      }

    } catch(ex) {
      console.log("Cant hold loop");
      console.log(ex);
    }

  })

  //for(let player of battleroyale.game.players.ingame) {
  //for(var i = 0; i < battleroyale.game.players.ingame.length; i++) {
  battleroyale.game.players.ingame.forEach(function(player) {
    /*var player = battleroyale.game.players.ingame[i];
    console.log(battleroyale.game.players.ingame[i]);
    console.log(player);*/

    /*if(typeof(player === 'undefined')) {
      //console.log("Es undefined premo");
      //continue;
    }*/

    try {
      if(!battleroyale.utils.IsPointInCircle(player.position, player.battleroyale.game.position, player.battleroyale.game.radius) && !player.battleroyale.warning) {

        player.battleroyale.warning = true;
        battleroyale.chat.send(player, "You're not in the battle area, if u dont return to the battle area we're gonna kill u in 1 minute");
        jcmp.events.CallRemote('outarea_toggle', player, true);
        //battleroyale.chat.send(player, "You're not in the battle area, if u dont return to the battle area we're gonna kill u in 1 minute");
        // Timer in X minute
        // Make var for check if the player was already warned
        // And blah blah blah
      }

      if(player.battleroyale.warning && battleroyale.utils.IsPointInCircle(player.position, player.battleroyale.game.position, player.battleroyale.game.radius) || !player.battleroyale.ingame) {
        player.battleroyale.warning = false;
        jcmp.events.CallRemote('outarea_toggle', player, false);
      }

    } catch(ex) {
      console.log("Can't handle loop");
      console.log(ex);
    }

  })



});

jcmp.events.Add('battleroyale_start_battle', function() {

  battleroyale.game.gamesCount++;
  battleroyale.game.toStart = false;

  var spawnPositions = require('../gm/BRSpawnList.js');
  //var startPosition = spawnPositions[battleroyale.utils.random(0, spawnPositions.length - 1)];
  var startPosition = new Vector3f(-12561.109375, 4301.36865234375, -12055.4267578125);

  console.log("Start position X: " + startPosition.x + " Y: " + startPosition.y + " Z: " + startPosition.z);
  //console.log(battleroyale.game.players.onlobby);
  console.log(battleroyale.game.players.onlobby.length);

  var BRGame = new battleroyale.BRGame(battleroyale.game.gamesCount, startPosition);
  console.log("Creating new game with ID: " + battleroyale.game.gamesCount);
  //for(var i = 0; i <= battleroyale.game.players.onlobby.length; i++) {
  var playersToTP = battleroyale.game.players.onlobby;
  battleroyale.game.players.onlobby = [];
  playersToTP.forEach(function(p) {
    //let p = battleroyale.game.players.onlobby[i];

    //console.log("+ ================= +")
    //console.log("Player " + i);
    //console.log(p);
    p.battleroyale.game = BRGame;
    p.battleroyale.ingame = true;
    p.dimension = BRGame.id;
    battleroyale.game.players.ingame.push(p);
    BRGame.players.push(p);

    p.position = battleroyale.utils.randomSpawn(startPosition, battleroyale.config.game.battle_StartRadius);
    p.GiveWeapon(2621157955, 398, true); // CS Preador
    //battleroyale.game.players.onlobby.remove(p);
    //console.log(" + ============= + ");
  })

  BRGame.aliveStarted = BRGame.players.length;

  BRGame.broadcast("Battle started players alive " + BRGame.players.length, battleroyale.config.colours.green);

  // Timer to set the area battle

  BRGame.reduceArea_timer = setInterval(function() {
    jcmp.events.Call('battleroyale_update_area', BRGame);
  }, battleroyale.utils.MinToMs(2));

  battleroyale.game.games.push(BRGame);
});

jcmp.events.Add('battleroyale_update_area', function(BRGame) {

  BRGame.broadcast("The battle area is gonna be reduced", battleroyale.config.colours.red);
  //console.log(BRGame);
  BRGame.radius = BRGame.radius / 2;

  //BRGame.position = // Random position of some of the players alive

});

jcmp.events.Add('battleroyale_end_battle', function(BRGame)
{
  console.log('Battle end left players ' + BRGame.players.length);
  if(BRGame.players.length >= 2) {
    // Wtf
    // Maybe coming soon
  } else if(BRGame.players.length < 1) {
    console.log("No winner :(")
  } else {
    //console.log(BRGame.players);
    var player = BRGame.players[0];

    // Winner
    battleroyale.utils.broadcastToLobby(player + " was the winner of a battle");
    battleroyale.chat.send(player, "You won a battle");

    // Delete interval
    battleroyale.game.players.ingame.removePlayer(player);
    player.dimension = 0;
    player.battleroyale.game = undefined;
    player.battleroyale.ingame = false;
    battleroyale.game.players.onlobby.push(player);

  }

  clearInterval(BRGame.reduceArea_timer);
  battleroyale.game.games.remove(BRGame);


});

jcmp.events.Add("battleroyale_player_leave_game", function(player, destroy) {

  // Broadcast msg to all players on that game with the current players left
  // Delete player from game the BRGame object

  player.battleroyale.game.players.removePlayer(player);
  player.battleroyale.ready = false;
  player.battleroyale.ingame = false;

  battleroyale.game.players.ingame.removePlayer(player);
  player.battleroyale.game.broadcast((player.battleroyale.game.players.length) + " of " + player.battleroyale.game.aliveStarted + " left ");
  player.dimension = 0;

  if(player.battleroyale.game.players.length <= 1) {
    // End the battle
    console.log("Ending battle " + player.battleroyale.game.id);
    console.log(player.battleroyale.game);
    jcmp.events.Call('battleroyale_end_battle', player.battleroyale.game);
  }


  console.log("Removing player from game array players");

  console.log("Players in array: " + player.battleroyale.game.players.length);
  if(!destroy) {
    battleroyale.game.players.onlobby.push(player);
  }


  //player.battleroyale.ready = false;

  //       player.battleroyale.game = false;
});


jcmp.events.AddRemoteCallable("battleroyale_ready", player => {
    const data = {
        players: jcmp.players.map(p => ({
            id: p.networkId,
            name: p.escapedNametagName,
            colour: p.battleroyale.colour,
            isAdmin: battleroyale.utils.isAdmin(p)
        }))
    };
    console.log(JSON.stringify(data));
    jcmp.events.CallRemote("battleroyale_init", player, JSON.stringify(data));
});
