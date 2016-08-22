'use strict';

module.exports = register => {
  register('position', player => {
    player.SendChatMessage(`x: <em>${player.position.x}</em>, y: <em>${player.position.y}</em>, z: <em>${player.position.z}</em>`, gm.config.colors.orange);
  });

  register('rotation', player => {
	 player.SendChatMessage(`x: <em>${player.rotation.x}</em>, y: <em>${player.rotation.y}</em>, z: <em>${player.rotation.z}</em>`, gm.config.colors.orange);
  });

  register('poi', player => {
    let pos = new Vector3f(player.position.x + 10.0, player.position.y, player.position.z);
    let p = new POI(20, pos, "test poi");
    p.minDistance = 1.0;
    p.maxDistance = 10.0;
    p.clampedToScreen = true;
  });

  register('checkpoint', player => {
      let pos = new Vector3f(3605.847, 1043.616, 1162.962);
      let rot = new Vector3f(0.0, -13.859, 0.0);

      let cp1 = new Checkpoint(0, 0x301477DB, pos, rot);
      cp1.radius = 5.0;

      pos.x = pos.x + 5.0;
      pos.z = pos.z - 20.0;
      let cp2 = new Checkpoint(0, 0xA17CB52D, pos, rot);
      cp2.radius = 5.0;

      pos.x = pos.x + 5.0;
      pos.z = pos.z - 20.0;
      let cp3 = new Checkpoint(0, 0xCFEF37DE, pos, rot);
      cp3.radius = 5.0;

      pos.x = pos.x + 5.0;
      pos.z = pos.z - 20.0;
      let cp4 = new Checkpoint(0, 0xCFEF37DE, pos, rot);
      cp4.radius = 5.0;
  });

  register('awesomeTune', player => {
      player.CallGameEvent('mission_outro_winning');
  });

  register('lockControls', player => {
      player.controlsEnabled = false;
  });

  register('unlockControls', player => {
      player.controlsEnabled = true;
  });

  register('weapons', player => {
    let i = 0;
    player.SendChatMessage('listing ' + player.weapons.length + ' weapons.', new RGB(255, 255, 0));
    player.weapons.forEach(w => {
      player.SendChatMessage((i % 2 == 0 ? '<i>' : '') + 'Slot ' + w.slot + ', Hash: ' + w.hash + ', MagAmmo: ' + w.magazineAmmo + ', ReserveAmmo: ' + w.reserveAmmo + (i % 2 == 0 ? '</i>' : ''));
      i++;
    });
  });
};
