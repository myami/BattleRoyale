'use strict';

module.exports = register => {
  register('setObject', (player, str) => {
    player.SendChatMessage('object set to "' + str + '". enabled left-click spawn mode', gm.config.colors.orange);
    player.objectSpawner = {
      active: true,
      object: str,
    };
  });  
  
  register('objectSpawning', player => {
    if (typeof player.objectSpawner !== 'undefined') {
      if (player.objectSpawner.active) {
        player.SendChatMessage('disabled left-click spawn mode', gm.config.colors.orange);
        player.objectSpawner.active = false;
      } else {
        player.SendChatMessage('enabled left-click spawn mode', gm.config.colors.orange);
        player.objectSpawner.active = true;
      }
    } else {
      player.SendChatMessage('enabled left-click spawn mode', gm.config.colors.orange);
      player.objectSpawner = {
        active: true,
        object: 'glowstick_blue',
      };
    }
  });
  
  register('object', (player, str) => {
    const o = new GameObject(str, player.aimPosition, player.rotation);
    
    setTimeout(() => {
      console.log('updating position');
      o.position = new Vector3f(player.aimPosition.x + 3.0, player.aimPosition.y + 3.0, player.aimPosition.z + 3.0);
    }, 1000);
  });  
};