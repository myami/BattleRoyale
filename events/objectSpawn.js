'use strict';

events.AddRemoteCallable('mouse_down', player => {
  if (typeof player.objectSpawner !== 'undefined') {
    if (!player.objectSpawner.active) {
      return;
    }
    new GameObject(player.objectSpawner.object, player.aimPosition);
  }
  
  const intv = setInterval(() => {
    if (typeof player.objectSpawner !== 'undefined') {
      if (!player.objectSpawner.active) {
        clearInterval(intv);
        return;
      }
      
      if (typeof player.objectSpawner._mouseUp !== 'undefined' && player.objectSpawner._mouseUp) {
        player.objectSpawner._mouseUp = false;
        clearInterval(intv);
        return;
      }
      new GameObject(player.objectSpawner.object, player.aimPosition);
    } else {
      clearInterval(intv);
    }
  }, 100);
});

events.AddRemoteCallable('mouse_up', player => {
  if (typeof player.objectSpawner !== 'undefined') {
    player.objectSpawner._mouseUp = true;
  }
});
