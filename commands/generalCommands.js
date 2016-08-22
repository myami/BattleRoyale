'use strict';

module.exports = register => {
  register('help', player => {
    let str = 'List of available commands:<br /><table><thead><tr>';
    let i = 1;
    gm.commandManager.commands.forEach((_, key) => {
      str += `<td>/${key}</td>`;
      if (i % 3 === 0) {
        str += '</tr><tr>';
      }
      i++;
    });
    str = `${str.substr(0, str.length - 3)}/table>`;
    player.SendChatMessage(str);
  });
  
  register('weather', (player, id) => {
      id = parseInt(id, 10);
      
      if (isNaN(id)) {
          player.SendChatMessage('expected a number.', new RGB(255, 0, 0));
          return;
      }
      player.SendChatMessage('setting your weather to ' + id + '.', new RGB(255, 255, 0));
      player.world.weather = id;
  });
  
  register('time', (player, h, m, s) => {
      h = parseInt(h, 10);
      m = parseInt(m, 10);
      s = parseInt(m, 10);
      
      if (isNaN(h) || isNaN(m) || isNaN(s)) {
          player.SendChatMessage('expected three(3) numbers.', new RGB(255, 0, 0));
          return;
      }
      player.SendChatMessage('setting your time to ' + h + ':' + m + ':' + s + '.', new RGB(255, 255, 0));
      player.world.SetTime(h, m, s);
  });
  
  register('timeScale', (player, s) => {
      s = parseFloat(s);
      
      if (isNaN(s)) {
          player.SendChatMessage('expected a float.', new RGB(255, 0, 0));
          return;
      }
      player.SendChatMessage('setting your time scale to ' + s + '.', new RGB(255, 255, 0));
      player.world.timeScale = s;
  });
  
  register('awesomeCam', player => {
      events.CallRemote('SetCameraToPos', player, JSON.stringify({
          pos: { x: 2895, y: 1125, z: 1372},
          rot: { x: 0, y: -68, z: 0},
      }));
  });
  
  register('unlockCam', player => {
      events.CallRemote('FreeCamera', player);
  });

  register(['weapon', 'w'], (player, hash, ammo) => {
      ammo = parseInt(ammo, 10);
      if (isNaN(ammo)) {
          player.SendChatMessage('expected a valid ammo. using 1000 by default', gm.config.colors.orange);
          ammo = 1000;
      }
      
      if (hash.indexOf('0x') === 0) {
          hash = parseInt(hash.substr(2), 16);
      } else {
          hash = parseInt(hash, 16);
      }
      
      if (isNaN(hash)) {
          player.SendChatMessage('expected a valid weapon hash', gm.config.colors.red);
          return;
      }
      
      player.GiveWeapon(hash, ammo, true);
      player.SendChatMessage('weapon given');
  });
};
