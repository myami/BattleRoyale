'use strict';

const util = require('../gm/utility');


jcmp.events.Add("PlayerCreated", player => {
    player.escapedNametagName = player.name.replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 40);;
    console.log(`${player.escapedNametagName} has joined.`);
    battleroyale.chat.broadcast(`** ${player.escapedNametagName} has joined.`, battleroyale.config.colours.connection);

    const colour = battleroyale.colours.randomColor();
    player.battleroyale = {
        colour: colour,
        colour_rgb: battleroyale.utils.hexToRGB(colour),
        kills: 0,
        deaths: 0,
        outside: 60, // time before you die if you go out of the area
        outsidetimeout: null,
        custom_time_set: false,
        ingame: false,
        warning: false,
        warningmessage: false,
        exp: 0,
        ready: false,
        game: false
    };



});

jcmp.events.Add("PlayerDestroyed", player => {
    console.log(`${player.escapedNametagName} has left.`);
    battleroyale.chat.broadcast(`** ${player.escapedNametagName} has left.`, battleroyale.config.colours.connection);

    if (typeof player.spawnedVehicle !== 'undefined') {
        player.spawnedVehicle.Destroy();
    }

    if(player.battleroyale.ingame) {// if the player is ingame

      jcmp.events.Call('battleroyale_player_leave_game', player, true);
    } else {
      battleroyale.game.players.onlobby.removePlayer(player);
    }

jcmp.events.CallRemote("battleroyale_player_destroyed", null, player.networkId);

});


function randomSpawn(baseVec, radius) {
    const half = radius / 2;
    return new Vector3f(baseVec.x + battleroyale.utils.random(-half, half), baseVec.y, baseVec.z + battleroyale.utils.random(-half, half));
}
jcmp.events.Add("PlayerReady", (player) => {
    player.escapedNametagName = player.name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    //player.respawnPosition = randomSpawn(util.randomArray(spawnLocations), 900);
    player.respawnPosition = randomSpawn(battleroyale.config.game.lobbypos, battleroyale.config.game.lobbyRadius / 2);
    jcmp.events.CallRemote('battleroyale_set_weather', player, battleroyale.config.world.weather);
    battleroyale.timeManager.updatePlayer(player);
    player.Respawn();
    player.battleroyale.ready = true;
    battleroyale.game.players.onlobby.push(player); // add the player to the lobby array
    console.log("Player added to lobby list");
    console.log(" * " + battleroyale.game.players.onlobby.length + " on lobby waiting");
    if (battleroyale.bans.has(player.client.steamId)) {
        battleroyale.chat.send(player, 'You are banned from the server until the next server restart. You will get kicked shortly.', battleroyale.config.colours.red);
            const done = battleroyale.workarounds.watchPlayer(player, setTimeout(() => {
            done();
            player.Kick('banned');
        }, 15000));
    }
    const data = {
      id: player.networkId,
      name: player.escapedNametagName,
      colour: player.battleroyale.colour,
      isAdmin: battleroyale.utils.isAdmin(player)
  };


    console.log("Sending battleroyale_player_created");
    console.log("Sending " + JSON.stringify(data));
    jcmp.events.CallRemote("battleroyale_player_created", null, JSON.stringify(data));
    jcmp.events.CallRemote("battleroyale_accueil_appear",player);



});

jcmp.events.AddRemoteCallable("battleroyale_UI_ready", (player) => { // when UI is ready
console.log("battleroyale_UI_ready" + player);
  jcmp.events.CallRemote('battleroyale_UI_Hide',player);
  battleroyale.chat.send(player, "Welcome to the Official BattleRoyale server created by Daranix and Myami .", battleroyale.config.colours.green);
  //battleroyale.chat.send(player, "Player need before game start :" + battleroyale.game.players.onlobby.length + "/" + battleroyale.config.game.minPlayers, battleroyale.config.colours.red);

  let dataneed = {
    ingame:battleroyale.game.players.onlobby.length,
    need:battleroyale.config.game.minPlayers
};
jcmp.events.CallRemote("battleroyale_playerneed_client",null,JSON.stringify(dataneed));
});

jcmp.events.Add("PlayerDeath", (player, killer, reason,BRGame) => {

  player.battleroyale.ready = false;

  let killer_data;
  let death_message = '';
  if (typeof killer !== 'undefined' && killer !== null) {
    if (killer.networkId === player.networkId) {
      death_message = 'killed themselves';
      jcmp.events.CallRemote("battleroyale_deathui_show", player);
    } else {
      if (typeof killer.escapedNametagName !== 'undefined') {
        killer.battleroyale.kills++;

        jcmp.events.CallRemote("battleroyale_deathui_show", player);
      } else {
        death_message = 'was squashed';
        jcmp.events.CallRemote("battleroyale_deathui_show", player);
      }
    }
  } else {
    death_message = 'died';
    jcmp.events.CallRemote("battleroyale_deathui_show", player);
  }
  jcmp.events.CallRemote("battleroyale_die_client_appear", null, player.escapedNametagName);




  if(player.battleroyale.ingame) {
    jcmp.events.Call('battleroyale_player_leave_game', player);
  }

  battleroyale.chat.send(player, 'You will be respawned in the lobby.', battleroyale.config.colours.purple);

  const pos = battleroyale.config.game.lobbypos;
  const done = battleroyale.workarounds.watchPlayer(player, setTimeout(() => {
    done();
    player.respawnPosition = pos;
    player.Respawn();
    jcmp.events.CallRemote("battleroyale_deathui_hide", player);
  }, 4000));
  let dataneed = {
    ingame:battleroyale.game.players.onlobby.length,
    need:battleroyale.config.game.minPlayers
};
jcmp.events.CallRemote("battleroyale_playerneed_client",null,JSON.stringify(dataneed));
});

jcmp.events.AddRemoteCallable("battleroyale_player_spawning", player => {
    player.invulnerable = true;
});
jcmp.events.AddRemoteCallable("battleroyale_player_spawned", player => {
    // if the player isn't in passive mode, let them know spawn protection ends..

    battleroyale.chat.send(player, 'Your spawn protection will end in 5 seconds.', battleroyale.config.colours.purple);

    const done = battleroyale.workarounds.watchPlayer(player, setTimeout(() => {
        done();
        player.invulnerable = false;
    }, 5000));
});


jcmp.events.AddRemoteCallable("battleroyale_random_weapon", player => {
    var randomweapon = battleroyale.config.weaponhash[battleroyale.utils.random(0, battleroyale.config.weaponhash.length - 1)];
    player.GiveWeapon(parseInt(randomweapon), 500, true);

});
