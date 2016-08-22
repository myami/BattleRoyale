'use strict';

module.exports = register => {
  register(['vehicle', 'v'], (player, name) => {
    if (typeof name === 'undefined') {
      return player.SendChatMessage('USAGE: /vehicle [name or hash]', gm.config.colors.orange);
    }

    let model;
    if (isNaN(name) && !(typeof name === 'string' && name.indexOf('0x') === 0)) {
        model = gm.utility.hashes.findByPartOfName(gm.utility.hashes.vehicles, name);
    }
    else {
        let hash;
        if ((typeof name === 'string' && name.indexOf('0x') === 0)) {
            hash = parseInt(name, 16);
        }
        else {
            hash = parseInt(name);
        }

        if (isNaN(hash)) {
            return player.SendChatMessage('USAGE: /vehicle [name or hash]', gm.config.colors.orange);
        }

        model = gm.utility.hashes.findByHash(gm.utility.hashes.vehicles, hash);
    }

    if (typeof model === 'undefined') {
        return player.SendChatMessage('USAGE: /vehicle [name or hash]', gm.config.colors.orange);
    }

    const vehicle = new Vehicle(model.hash, player.aimPosition);
    vehicle.primaryColor = gm.utility.random(0, 255);
  });
};
