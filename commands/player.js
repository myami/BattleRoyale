'use strict';

function randomSpawn(baseVec, radius) {
  const half = radius / 2;
  return new Vector3f(baseVec.x + battleroyale.utils.random(-half, half),
    baseVec.y,
    baseVec.z + battleroyale.utils.random(-half, half));
}

module.exports = ({ Command, manager }) => {
  manager.category('player', 'commands that directly affect you')
    .add(new Command('suicide')
      .description('kills you')
      .handler(player => {
        player.health = 0;
        battleroyale.chat.send(player, 'sleep well.', battleroyale.config.colours.green);
    }))

    .add(new Command('passive')
      .description('enables or disables the passive mode (no weapons allowed here!)')
      .handler(player => {
        if (typeof player.battleroyale.passiveMode === 'undefined') {
          player.battleroyale.passiveMode = false;
          player.battleroyale.passiveModeKills = 0;
        }

        if (battleroyale.passiveModeBans.has(player.client.steamId)) {
          battleroyale.chat.send(player, 'You are banned from going to the passive mode. Try again later.', battleroyale.config.colours.red);
          return;
        }

        player.battleroyale.passiveMode = !player.battleroyale.passiveMode;

        if (player.battleroyale.passiveMode) {
          battleroyale.chat.broadcast(`${player.escapedNametagName} went to passive mode (/passive)`, battleroyale.config.colours.orange);
          player.invulnerable = true;

          player.weapons.forEach(w => {
            w.magazineAmmo = 0;
            w.reserveAmmo = 0;
          });
        } else {
          battleroyale.chat.broadcast(`${player.escapedNametagName} left passive mode (/passive)`, battleroyale.config.colours.orange);
          player.invulnerable = false;
        }
      }))

    .add(new Command('respawn')
      .description('respawns you at a random position')
      .handler(player => {
        player.respawnPosition = randomSpawn(new Vector3f(3604.17, 1343.61, 1178.84), 900);
        player.Respawn();
        battleroyale.chat.send(player, 'Respawning you at a random position.', battleroyale.config.colours.purple);
    }));
};
