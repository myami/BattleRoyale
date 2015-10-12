/**
 * @overview GTA:Multiplayer Default Package
 * @author Jan 'Waffle' C.
 * @copyright (c) GTA:Multiplayer [gta-mp.net]
 * @license https://master.gta-mp.net/LICENSE
 */
'use strict';

module.exports = function(register) {
  require('./testCommands')(register);
  require('./normalCommands')(register);

  register('help', player => {
    let str = 'List of available commands:';
    let i = 1;
    gm.commandManager.commands.forEach((_, key) => {
      str += key + "\n";
      i++;
    });
    player.SendChatMessage(str);
  });
};