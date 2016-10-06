'use strict';

events.Add('PlayerCreated', function(player) {
  console.log('Player ' + player.name + ' has successfully joined the server.');
  gm.chat.broadcast(player.name + ' has joined the server.', gm.config.color.orange);
});

function randomPos(basePos, range) {
  return new Vector3f(basePos.x + gm.utility.random(-(range / 2), range / 2), basePos.y, basePos.z + gm.utility.random(-(range / 2), range / 2));
}

// player ready
events.Add('PlayerReady', function(player) {
  player.respawnPosition = randomPos(new Vector3f(3604.17163, 1300.0, 1178.84021), 1400);
  player.Respawn();

  // set the time and weather for the player
  player.world.weather = gm.world.weather;
  player.world.SetTime(gm.world.time.hour, gm.world.time.minute, 0);

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
      message += 'killed himself. (' + gm.utility.deathReasonToString(reason) + ')';
    } else {
      if (typeof killer.name !== 'undefined') {
        message += 'has been killed by ' + killer.name + '. (' + gm.utility.deathReasonToString(reason) + ')';
      } else {
        message += 'has been run over by a vehicle (probably).';
      }
    }
  } else {
    message += 'died. (' + gm.utility.deathReasonToString(reason) + ')';
  }

  gm.chat.broadcast(message, gm.config.color.orange);
  player.respawnPosition = randomPos(new Vector3f(3604.17163, 1300.0, 1178.84021), 1400);
  player.Respawn();
});
