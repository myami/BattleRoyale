'use strict';

  jcmp.events.Add('battleroyale_updates', function() {

 // About launch the game

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


// End about launch the br Game

  // For everyone on the lobby
  battleroyale.game.players.onlobby.forEach(function(player) {


    try {

 // If they are out of area
      if(!battleroyale.utils.IsPointInCircle(player.position, battleroyale.config.game.lobbypos, battleroyale.config.game.lobbyRadius) && player.battleroyale.ready) {
    //    battleroyale.chat.send(player, "You're not in the lobby area, returning you to the lobby area");
        player.respawnPosition = battleroyale.utils.randomSpawn(battleroyale.config.game.lobbypos, battleroyale.config.game.lobbyRadius / 2);
        player.Respawn();
      } else {

      }

    } catch(ex) {
      console.log("Cant hold loop");
      console.log(ex);
    }

  })

  // for everyone ingame
  battleroyale.game.players.ingame.forEach(function(player) {





    try {
      // If they are not on the area
      if(!battleroyale.utils.IsPointInCircle(player.position, player.battleroyale.game.position, player.battleroyale.game.radius) && !player.battleroyale.warning) {

        player.battleroyale.warning = true;



      }
// If the player is in the area remove the warning message
      if(player.battleroyale.warning && battleroyale.utils.IsPointInCircle(player.position, player.battleroyale.game.position, player.battleroyale.game.radius) || !player.battleroyale.ingame) {
        player.battleroyale.warning = false;
        jcmp.events.CallRemote('outarea_toggle', player, false);
        player.battleroyale.outside = 60;
        player.battleroyale.warningmessage = false;
        clearInterval(player.battleroyale.outsidetimeout);

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


  var listname = battleroyale.config.arenalist[battleroyale.utils.random(0,battleroyale.config.arenalist.length -1)];
  var areaname = battleroyale.arena[listname].defaults.name;
  var spawnplayer = battleroyale.arena[listname].playerSpawnPoints; // take all the player spawn
  var spawnwbarrel = battleroyale.arena[listname].barrelSpawnPoints; //all the weapon spawn
  var radius = battleroyale.arena[listname].defaults.radius; // the default radius of the arena
  var centerposition = battleroyale.arena[listname].defaults.center;




  console.log("Center position X: " + battleroyale.arena[listname].defaults.center.x + " Y: " + battleroyale.arena[listname].defaults.center.y + " Z: " + battleroyale.arena[listname].defaults.center.z);

  console.log(battleroyale.game.players.onlobby.length);

  var BRGame = new battleroyale.BRGame(battleroyale.game.gamesCount, centerposition, radius, spawnplayer, spawnwbarrel); // send everything into a class
  console.log("Creating new game with ID: " + battleroyale.game.gamesCount + "Name of the arena: "+ areaname );


  var playersToTP = battleroyale.game.players.onlobby; // save all the player into a new array
  battleroyale.game.players.onlobby = []; // onlobby array make it clean
  playersToTP.forEach(function(p) {
    jcmp.events.CallRemote("battleroyale_Brgame_client", p, JSON.stringify(BRGame.barrelSpawnPoints),BRGame.id); // send the weapon position to the client
    jcmp.events.CallRemote('battleroyale_UI_Show',p);
    jcmp.events.CallRemote("battleroyale_distance_player_center_server", p, JSON.stringify(centerposition)); // send the center position to the client
    jcmp.events.CallRemote('battleroyale_radius_client',p,radius); // send the radius
    jcmp.events.CallRemote('battleroyale_playeringame_true',p);
    p.battleroyale.game = BRGame;
    p.battleroyale.ingame = true;
    p.dimension = BRGame.id;
    p.health = 800;
    battleroyale.game.players.ingame.push(p);
    BRGame.players.push(p);
    let randomspawn  = spawnplayer[battleroyale.utils.random(0, spawnplayer.length -1)]; // take a random spawn
    p.position = new Vector3f (randomspawn.x,randomspawn.y,randomspawn.z);
    p.weapons.forEach(function(weapon){
       p.RemoveWeapon(weapon.modelHash);
     })
  })

  BRGame.aliveStarted = BRGame.players.length;

  BRGame.broadcast("Battle started players alive with : " + BRGame.players.length + " players", battleroyale.config.colours.green); // need to replace by UI

  // Timer to set the area battle

  BRGame.reduceArea_timer = setInterval(function() { // launch the timer to reduce the area
    jcmp.events.Call('battleroyale_update_area', BRGame);
  }, battleroyale.utils.MinToMs(2));

  battleroyale.game.games.push(BRGame);
});

jcmp.events.Add('battleroyale_update_area', function(BRGame) {

//  BRGame.broadcast("The battle area is reduce check area distance", battleroyale.config.colours.red);
  BRGame.radius = BRGame.radius / 2;
  for(let player of BRGame.players) {
    jcmp.events.CallRemote('battleroyale_radius_client',player,BRGame.radius);
    jcmp.events.CallRemote('battleroyale_area_reduced_client_true',player);
    setTimeout(() => {
      jcmp.events.CallRemote("battleroyale_area_reduced_client_false", player);
    }, 8000);


  }

});


jcmp.events.Add('battleroyale_end_battle', function(BRGame)
{
  console.log('Battle end left players ' + BRGame.players.length);
  if(BRGame.players.length >= 2) {
    // if they are 2 guys stay ( for team battle)

  } else if(BRGame.players.length < 1) {
    console.log("No winner :(")
  } else if (BRGame.players.length == 1) {
    //console.log(BRGame.players);
    var player = BRGame.players[0];
    jcmp.events.CallRemote('battleroyale_UI_Hide',player);
    jcmp.events.CallRemote('outarea_toggle', player, false);
    jcmp.events.CallRemote('battleroyale_playeringame_false',player);
    jcmp.events.CallRemote('battleroyale_POI_Delete',player);

    // Winner
  //  battleroyale.utils.broadcastToLobby(player + " was the winner of a battle");
    jcmp.events.CallRemote('battleroyale_winner_client_name',null,player.escapedNametagName);


  //  battleroyale.chat.send(player, "You won a battle");
    jcmp.events.CallRemote('battleroyale_winner_client_true',player);
    jcmp.events.CallRemote('battleroyale_winner_client_true_all',null);


    setTimeout(() => {
      jcmp.events.CallRemote("battleroyale_winner_client_false", player);
      jcmp.events.CallRemote('battleroyale_winner_client_false_all',null);
    }, 10000);




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
  jcmp.events.CallRemote('battleroyale_UI_Hide',player);
  jcmp.events.CallRemote('outarea_toggle', player, false);
  jcmp.events.CallRemote('battleroyale_playeringame_false',player);
  jcmp.events.CallRemote('battleroyale_POI_Delete',player);
  battleroyale.game.players.ingame.removePlayer(player);
  player.battleroyale.game.broadcast((player.battleroyale.game.players.length) + " of " + player.battleroyale.game.aliveStarted + " left "); // need to replace by UI
  player.dimension = 0;
  if(player.battleroyale.game.players.length <= 1) { // if he whas the last guys ingame
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

});

jcmp.events.Add('battleroyale_player_outarea', function() {

  battleroyale.game.players.ingame.forEach(function(player) {
if (player.battleroyale.warning){
          if (!player.battleroyale.warningmessage){
              //    battleroyale.chat.send(player, "You're not in the battle area, if u dont return to the battle area we're gonna kill u in 1 minute");// have a warning message
                  player.battleroyale.warningmessage = true
          }

          jcmp.events.CallRemote('outarea_toggle', player, true);
          jcmp.events.CallRemote('battleroyale_outarea_timer_client',player,player.battleroyale.outside);
          player.battleroyale.outside --;
          if (player.battleroyale.outside <= 0)
          {
            player.health = 0;
          }
}

})
});
