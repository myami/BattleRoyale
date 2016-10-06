'use strict';

module.exports = function({ Command, manager }) {
  const objects = [ 'barrel', 'corpse_rebel_001' ];
  manager.category('object', 'object commands')
    .add(new Command('object')
      .description('this commands creates an object where you aim.')
      .parameter("name", "string", "object name", { hints: objects })
      .handler((player, object) => {
        if (!objects.includes(object)) {
          return 'usage';
        }

        const obj = new GameObject(object, player.aimPosition);
        obj.dimension = player.dimension;

        gm.chat.send(player, `Created object '${object}'.`, gm.config.color.green);
      }));
};
