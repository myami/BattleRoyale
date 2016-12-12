'use strict';

const utility = require('../gm/utility');
const locations = require('../gm/defaultTeleports');

module.exports = ({ Command, manager }) => {
  const markers = new Map();

  locations.forEach(loc => {
    const poi = new POI(20, loc.position, `${loc.label} (/tp ${loc.command})`);
    poi.minDistance = 10.0;
    poi.maxDistance = 100000.0;
    poi.clampedToScreen = false;
    markers.set(loc.command, poi);
  });

  manager.category('teleport', 'teleportation commands')
    .add(new Command('marker')
      .description('creates a map marker on your position for 60s that allows other people to teleport there.')
      .parameter('name', 'string', 'marker name', { isTextParameter: true })
      .timeout(60000, true)
      .handler((player, name) => {
        if (markers.has(name)) {
          battleroyale.chat.send(player, 'A marker with that name already exists.', battleroyale.config.colours.red);
          return;
        }

        const poi = new POI(20, player.position, `${player.escapedNametagName}'s  Marker (/teleport ${name})`);
        battleroyale.chat.send(player, `Marker '${name}' created and will be active for 60 seconds.`, battleroyale.config.colours.green);
        battleroyale.chat.broadcast(`${player.escapedNametagName} created map marker '${name}'. Use /teleport ${name} to get there!`, battleroyale.config.colours.orange);
        poi.minDistance = 10.0;
        poi.maxDistance = 100000.0;
        poi.clampedToScreen = false;
        markers.set(name, poi);

        setTimeout(() => {
          battleroyale.chat.send(player, `Your marker '${name}' has been removed.`, battleroyale.config.colours.orange);
          if (markers.has(name)) {
            markers.get(name).Destroy();
          }
          markers.delete(name);
        }, 60000);
      }))

    .add(new Command(['teleport', 'tp'])
      .parameter('name', 'string', 'teleports to a marker')
      .description('teleports you to a map marker', { isTextParameter: true })
      .handler((player, name) => {
        if (!markers.has(name)) {
          battleroyale.chat.send(player, 'This marker does not exist.', battleroyale.config.colours.red);
          return;
        }

        battleroyale.chat.send(player, `Teleporting you to marker '${name}'`, battleroyale.config.colours.green);
        player.position = markers.get(name).position;
      }))

    .add(new Command('goto')
      .parameter('target', 'string', 'target player (name or part of name)', { isTextParameter: true })
      .description('teleports you to another player using a part of his name')
      .handler((player, target) => {
        const res = battleroyale.utils.getPlayer(target);
        if (res.length === 0 || res.length > 1) {
          battleroyale.chat.send(player, 'no / too many matching players!', battleroyale.config.colours.red);
          return;
        }

        if (res[0].blockGoto) {
          battleroyale.chat.send(player, 'this player disabled teleportation to his position.', battleroyale.config.colours.red);
          return;
        }

        battleroyale.chat.send(player, `teleporting you to '${res[0].escapedNametagName}'.`, battleroyale.config.colours.green);
        player.position = res[0].position;
      }))

    .add(new Command('togglegoto')
      .description('toggles the ability of other players to teleport to your position')
      .handler(player => {
        if (typeof player.blockGoto === 'undefined' || !player.blockGoto) {
          player.blockGoto = true;
          battleroyale.chat.send(player, `other players will not be able to teleport to your position.`, battleroyale.config.colours.green);
          return;
        }
        player.blockGoto = !player.blockGoto;
        battleroyale.chat.send(player, `other players will now be able to teleport to your position again.`, battleroyale.config.colours.green);
      }));
};
