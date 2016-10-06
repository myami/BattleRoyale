'use strict';

const utility = require('../utility');

const weapons = require('../hashes/weapons.json');

module.exports = function({ Command, manager }) {
  manager.category('weapon', 'weapon commands')
    .add(new Command(['weapon', 'w'])
      .parameter('name', 'string', 'weapon name (or parts of it)', {
        isTextParameter: true,
        hints: weapons.map(w => w.name),
        })
      .description('spawns a weapon')
      .handler((player, name) => {
        const w = weapons.filter(weapon => weapon.name.match(new RegExp(name, 'ig')));
        if (w.length === 0) {
          gm.chat.send(player, 'found no matching weapons!', gm.config.color.red);
          return;
        } else if (w.length > 1) {
          gm.chat.send(player, 'found too many weapons. using the first available.', gm.config.color.purple);
        }

        gm.chat.send(player, `have fun with your ${w[0].name}!`, gm.config.color.green);
        player.GiveWeapon(w[0].hash, 300, true);
      }));
}
