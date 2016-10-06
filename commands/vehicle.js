'use strict';

const utility = require('../utility');

const vehicles = require('../hashes/vehicles.json');

module.exports = function({ Command, manager }) {
  manager.category('vehicle', 'vehicle commands')
    .add(new Command(['vehicle', 'v'])
      .parameter('name', 'string', 'vehicle name (or parts of it)', {
        isTextParameter: true,
        hints: vehicles.map(v => v.name),
        })
      .description('spawns a vehicle')
      .handler((player, name) => {
        const v = vehicles.filter(vehicle => vehicle.name.match(new RegExp(name, 'ig')));
        if (v.length === 0) {
          gm.chat.send(player, 'found no matching vehicles!', gm.config.color.red);
          return;
        } else if (v.length > 1) {
          gm.chat.send(player, 'found too many vehicles. using the first available.', gm.config.color.purple);
        }

        if (typeof player.spawnedVehicle !== 'undefined') {
          player.spawnedVehicle.Destroy();
        }

        gm.chat.send(player, `have fun with your ${v[0].name}!`, gm.config.color.green);
        player.spawnedVehicle = new Vehicle(v[0].hash, player.aimPosition);
      }));
}
