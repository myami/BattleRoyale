'use strict';

module.exports = ({ Command, manager }) => {
  manager.category('admin', 'commands for administration purposes')

  .add(new Command('tphere').parameter('target', 'string', 'networkId or (part of) name').description('Summon player to youre position').handler(function(player, target) {

    if(!battleroyale.utils.isAdmin(player)) {
      return battleroyale.chat.send(player, "You're not allowed to use this command");
    }

    const res = battleroyale.utils.getPlayer(target);
    if(res.length === 0 || res.length > 1) {
      return battleroyale.chat.send(player, "No / too many matching players!");
    }

    // TP

    res[0].position = player.position;
    battleroyale.chat.send(res[0], player.escapedNametagName + " TP you to his position");
    battleroyale.chat.send(player, res[0].escapedNametagName + "Has been taken to your position");
  }))

  .add(new Command('apromote').parameter('target', 'string', 'networkId or (part of) name').description('Promotes someone to admin').handler(function(player, target) {

    if(!battleroyale.utils.isAdmin(player)) {
      return battleroyale.chat.send(player, "You're not allowed to use this command");
    }

    const res = battleroyale.utils.getPlayer(target);
    if(res.length === 0 || res.length > 1) {
      return battleroyale.chat.send(player, "No / too many matching players!");
    }

    // Add to config admins THIS IS TEMP

    battleroyale.config.admins.push(res[0].client.steamId);
    battleroyale.chat.send(player, "You promoted " + res[0].escapedNametagName + " to admin");
    battleroyale.chat.send(res[0], "You've promoted to admin by " + player.escapedNametagName);

  }))



  .add(new Command('tp').parameter('target', 'string', 'networkId or (part of) name').description('tp urself to a player').handler(function(player, target) {

    if(!battleroyale.utils.isAdmin(player)) {
      return battleroyale.chat.send(player, "You're not allowed to use this command");
    }

    const res = battleroyale.utils.getPlayer(target);
    if(res.length === 0 || res.length > 1) {
      return battleroyale.chat.send(player, "No / too many matching players!");
    }

    player.position = res[0].position;
    battleroyale.chat.send(player, "You've been TP to player " + res[0].escapedNametagName);

  }))
  
}
