'use strict';

const util = require('../gm/utility');
const teleportLocations = require('../gm/defaultTeleports');
const spawnLocations = teleportLocations.map(loc => {
  return new Vector3f(loc.position.x, loc.position.y + 400, loc.position.z);
});

events.Add("PlayerCreated", player => {
    player.escapedNametagName = player.nametag.name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    console.log(`${player.escapedNametagName} has joined.`);
    battleroyale.chat.broadcast(`** ${player.escapedNametagName} has joined.`, battleroyale.config.colours.connection);

    const colour = battleroyale.colours.randomColor();
    player.battleroyale = {
        colour: colour,
        colour_rgb: battleroyale.utils.hexToRGB(colour),
        kills: 0,
        deaths: 0,
        custom_time_set: false,
        vehicle_nitro_toggled: false,
        vehicle_turbojump_toggled: false,
        id:0,
        adminlvl: 0,
        death: 0

    };

    player.group = null;
    player.groupInvite = null;

    const data = {
        id: player.networkId,
        name: player.escapedNametagName,
        colour: player.battleroyale.colour,
        isNanosOfficial: events.Call("is_nanos_official", player.client.steamId)[0],
    };

    events.CallRemote("battleroyale_player_created", null, JSON.stringify(data));
});

events.Add("PlayerDestroyed", player => {
    console.log(`${player.escapedNametagName} has left.`);
    battleroyale.chat.broadcast(`** ${player.escapedNametagName} has left.`, battleroyale.config.colours.connection);

    if (typeof player.spawnedVehicle !== 'undefined') {
        player.spawnedVehicle.Destroy();
    }

    battleroyale.groupManager.handlePlayerLeave(player);

    events.CallRemote("battleroyale_player_destroyed", null, player.networkId);
});

function randomSpawn(baseVec, radius) {
  const half = radius / 2;
  return new Vector3f(baseVec.x + battleroyale.utils.random(-half, half),
    baseVec.y,
    baseVec.z + battleroyale.utils.random(-half, half));
}

events.Add("PlayerReady", (player) => {
  player.escapedNametagName = player.nametag.name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  player.respawnPosition = new Vector3f(-13536.0, 1040, 14599) // spawn area
  player.world.weather = battleroyale.config.world.weather;
  player.world.timeScale = 1.0;
  battleroyale.timeManager.updatePlayer(player);
  player.Respawn();

  jcmp.players.forEach(p => {
    p.nametag.tagColor = new RGBA(p.battleroyale.colour_rgb.r, p.battleroyale.colour_rgb.g, p.battleroyale.colour_rgb.b, 255);
  });

  if (battleroyale.bans.has(player.client.steamId)) {
    battleroyale.chat.send(player, 'You are banned from the server until the next server restart. You will get kicked shortly.', battleroyale.config.colours.red);
    const done = battleroyale.workarounds.watchPlayer(player, setTimeout(() => {
      done();
      player.Kick('banned');
    }, 15000));
  }
});

events.Add("PlayerDeath", (player, killer, reason) => {
  let killer_data;
  let death_message = '';
  player.ingame = false;
  if (typeof killer !== 'undefined' && killer !== null) {
    if (killer.networkId === player.networkId) {
      death_message = 'killed themselves';
      events.CallRemote("battleroyale_deathui_show", player);
    } else {
      if (typeof killer.battleroyale !== 'undefined') {
        if (killer.battleroyale.passiveMode && !battleroyale.passiveModeBans.has(killer.client.steamId)) {
          if (killer.battleroyale.passiveModeKills >= 3) {
            const steamId = killer.client.steamId;
            battleroyale.passiveModeBans.add(steamId);
            killer.battleroyale.passiveModeKills = 0;
            killer.battleroyale.passiveMode = false;
            killer.invulnerable = false;

            // reset him from the vehicle
            if (player.vehicle) {
              player.vehicle.driver = null;
            }

            battleroyale.chat.broadcast(`${killer.name} has been kicked out of passive Mode for killing other players.`, battleroyale.config.colours.red);
            setTimeout(() => {
              battleroyale.passiveModeBans.delete(steamId);
              battleroyale.chat.send(killer, 'You can now go back to passive mode.', battleroyale.config.colours.green);
            }, 600000);
          }
          battleroyale.chat.send(killer, `<h2>Do not kill players in passive mode. Warning ${++killer.battleroyale.passiveModeKills}/3</h2>`, battleroyale.config.colours.red);
        }
      }
      if (typeof killer.escapedNametagName !== 'undefined') {
        killer.battleroyale.kills++;

        death_message = battleroyale.utils.randomArray(battleroyale.config.death_reasons);
        events.CallRemote("battleroyale_deathui_show", player, killer.escapedNametagName, death_message);
           killer.battleroyale.death =+1; // add one kill in the rank
        killer_data = {
          networkId: killer.networkId,
          kills: killer.battleroyale.kills,
          deaths: killer.battleroyale.deaths
        };
      } else {
        death_message = 'was squashed';
        events.CallRemote("battleroyale_deathui_show", player);
      }
    }
  } else {
    death_message = 'died';
    events.CallRemote("battleroyale_deathui_show", player);
  }

  player.battleroyale.deaths++;
  const data = {
    player: {
      networkId: player.networkId,
      kills: player.battleroyale.kills,
      deaths: player.battleroyale.deaths
    },
    killer: killer_data,
    death_reason: death_message
  };
  events.CallRemote("battleroyale_player_death", null, JSON.stringify(data));
  battleroyale.chat.send(player, 'You will be respawned where you died. If you get stuck, use /respawn to spawn at a random position again.', battleroyale.config.colours.purple);
  const pos = player.position;
  const done = battleroyale.workarounds.watchPlayer(player, setTimeout(() => {
    done();
    player.respawnPosition = pos;
    player.Respawn();
    events.CallRemote("battleroyale_deathui_hide", player);
  }, 4000));
});

events.Add("PlayerVehicleEntered", (player, vehicle, seat) => {
    if (seat === 0) {
        vehicle.nitroEnabled = player.battleroyale.vehicle_nitro_toggled;
        vehicle.turboJumpEnabled = player.battleroyale.vehicle_turbojump_toggled;
    }
});

events.Add("PlayerVehicleSeatChange", (player, vehicle, seat, oldseat) => {
    if (seat === 0) {
        vehicle.nitroEnabled = player.battleroyale.vehicle_nitro_toggled;
        vehicle.turboJumpEnabled = player.battleroyale.vehicle_turbojump_toggled;
    }
});

events.AddRemoteCallable("battleroyale_player_spawning", player => {
    // enable invulnerability
    player.invulnerable = true;
});

events.AddRemoteCallable("battleroyale_player_spawned", player => {
    // if the player isn't in passive mode, let them know spawn protection ends..
    if (!player.battleroyale.passiveMode)
        battleroyale.chat.send(player, 'Your spawn protection will end in 5 seconds.', battleroyale.config.colours.purple);

    const done = battleroyale.workarounds.watchPlayer(player, setTimeout(() => {
        done();
        events.CallRemote('battleroyale_spawn_protect_done', player);
        player.invulnerable = player.battleroyale.passiveMode;
    }, 5000));
})


events.Add('onPlayerLogin',function(player, dbData)  {
  console.log("dbData \n" + dbData);

  gm.utility.print("Player " + player.name + " logged in");




  player.battleroyale = {
    id: dbData.id,
    adminlvl: dbData.adminlvl,
    death: dbData.death



  };

});

events.Add('onPlayerUpdate',function(player, callback, info)   {

    info = typeof info !== 'undefined' ? info : true;
    let connection = gm.utility.dbConnect();



    connection.connect();

    let SQLQuery = "UPDATE users SET" +
    " adminlvl=" + player.battleroyale.adminlvl +
        " ,death=" + player.battleroyale.death +
    " WHERE id = " + PlayerInfo[player.name].id;

    connection.query(SQLQuery, function(err) {
      if(err) {
            gm.utility.print("An error ocurred trying to upload the info of " + player.name);
            gm.utility.print("QUERY: " + SQLQuery);
            gm.utility.print("[ERROR]: " + err);
            if(callback) callback(false);
          } else {
            if(info) { gm.utility.print("player data of " + player.name + " has been updated " + info); }
            if(callback) callback(true);
          }
    });

    connection.end();

});


events.Add('updateAllPlayers',function() {

      if(jcmp.players.length >= 1)
      {
       console.log("Uploading all players info...");
       for (let player of jcmp.players)
       {
        if(pLogged[player.name])
        {
          Events.onPlayerUpdate(player, false);
        }
      }

      console.log("info of all players has been uploaded");

    }
  });
