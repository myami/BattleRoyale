'use strict';

const utility = require('../utility');

module.exports = function({ Command, manager }) {
  const markers = new Map();

  manager.category('teleport', 'teleporting commands')
    .add(new Command('marker')
      .description('creates a map marker on your position for 60s that allows other people to teleport there.')
      .parameter('name', 'string', 'marker name', { isTextParameter: true })
      .handler((player, name) => {
        if (tmMarker.active) {
          gm.chat.send(player, tmTime.getFailMessage(), gm.config.color.red);
          return;
        }

        if (markers.has(name)) {
          gm.chat.send(player, 'A marker with that name already exists.', gm.config.color.red);
          return;
        }

        const poi = new POI(20, player.position, `${player.name}'s  Marker (/teleport ${name})`);
        gm.chat.send(player, `Marker '${name}' created and will be active for 60 seconds.`, gm.config.color.green);
        gm.chat.broadcast(`${player.name} created map marker '${name}'. Use /teleport ${name} to get there!`, gm.config.color.orange);
        poi.clampedToScreen = false;
        markers.set(name, poi);

        setTimeout(() => {
          gm.chat.send(player, `Your marker '${name}' has been removed.`, gm.config.color.orange);
          markers.delete(name);
        }, 60000);

        tmMarker.start();
      }))

    .add(new Command('teleport')
      .parameter('name', 'string', 'teleports to a marker')
      .description('teleports you to a map marker', { isTextParameter: true })
      .handler((player, name) => {
        if (!markers.has(name)) {
          gm.chat.send(player, 'This marker does not exist.', gm.config.color.red);
          return;
        }

        gm.chat.send(player, `Teleporting you to marker '${name}'`, gm.config.color.green);
        player.position = markers.get(name).position;
      }))

    .add(new Command('goto')
      .parameter('target', 'string', 'target player (name or part of name)', { isTextParameter: true })
      .description('teleports you to another player using a part of his name')
      .handler((player, target) => {
        const res = gm.utility.getPlayer(target);
        if (res.length === 0 || res.length > 1) {
          gm.chat.send(player, 'no / too many matching players!', gm.config.color.red);
          return;
        }

        if (player.blockGoto) {
          gm.chat.send(player, 'this player disabled teleportation to his position.', gm.config.color.red);
          return;
        }

        gm.chat.send(player, `teleporting you to '${res[0].name}'.`, gm.config.color.green);
        player.position = res[0].position;
      }))

    .add(new Command('toggleGoto')
      .description('toggles the ability of other players to teleport to your position')
      .handler(player => {
        if (typeof player.blockGoto === 'undefined') {
          player.blockGoto = true;
          gm.chat.send(player, `other players will not be able to teleport to your position.`, gm.config.color.green);
          return;
        }
        player.blockGoto = !player.blockGoto;
        gm.chat.send(player, `other players will now be able to teleport to your position again.`, gm.config.color.green);
      }));
}
