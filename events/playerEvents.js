'use strict';

events.Add('PlayerCreated', function(player) {
  console.log('Player ' + player.name + ' has successfully joined the server.');
  mode.chat.broadcast(player.name + ' has joined the server.', mode.config.color.orange);
});

function randomPos(basePos, range) {
  return new Vector3f(basePos.x + mode.utility.random(-(range / 2), range / 2), basePos.y, basePos.z + mode.utility.random(-(range / 2), range / 2));
}

// player ready
events.Add('PlayerReady', function(player) {
  player.respawnPosition = randomPos(new Vector3f(3604.17163, 1300.0, 1178.84021), 1400);
  player.Respawn();

  // set the time and weather for the player
  player.world.weather = mode.world.weather;
  player.world.SetTime(mode.world.time.hour, mode.world.time.minute, 0);

  console.log('Player ' + player.name + ' has spawned.');
});

// player respawns
events.Add('PlayerRespawn', function(player) {
  // Give the player an assault rifle
  player.GiveWeapon(0xcb75ff26, 1000, true);
});

// player death
events.Add('PlayerDeath', function(player, killer, reason) {
  let message = player.name + ' ';
  if (typeof killer !== 'undefined' && killer !== null) {
    if (killer === player) {
      message += 'killed himself. (' + mode.utility.deathReasonToString(reason) + ')';
    } else {
      if (typeof killer.name !== 'undefined') {
        message += 'has been killed by ' + killer.name + '. (' + mode.utility.deathReasonToString(reason) + ')';
      } else {
        message += 'has been run over by a vehicle (probably).';
      }
    }
  } else {
    message += 'died. (' + mode.utility.deathReasonToString(reason) + ')';
  }

  mode.chat.broadcast(message, mode.config.color.orange);
  player.respawnPosition = randomPos(new Vector3f(3604.17163, 1300.0, 1178.84021), 1400);
  player.Respawn();
});
