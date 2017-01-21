'use strict';

module.exports = ({ Command, manager }) => {
  manager.category('admin', 'commands for administration purposes')

  .add(new Command('tphere').parameter('target', 'string', 'networkId or (part of) name').description('Save a position to file').handler(function(player, target) {

    if(!battleroyale.utils.isAdmin(player)) {
      return battleroyale.chat.send(player, "You're not allowed to use this command", battleroyale.config.colours.red);
    }

    const res = battleroyale.utils.getPlayer(target);
    if(res.length === 0 || res.length > 1) {
      return battleroyale.chat.send(player, "No / too many matching players!", battleroyale.config.colours.red);
    }

    // TP

    res[0].position = player.position;
    battleroyale.chat.send(res[0], player.escapedNametagName + " TP you to his position");
    battleroyale.chat.send(player, res[0].escapedNametagName + "Has been taken to your position");
  }))

  .add(new Command('apromote').parameter('target', 'string', 'networkId or (part of) name').description('Promotes someone to admin').handler(function(player, target) {

    if(!battleroyale.utils.isAdmin(player)) {
      return battleroyale.chat.send(player, "You're not allowed to use this command", battleroyale.config.colours.red);
    }

    const res = battleroyale.utils.getPlayer(target);
    if(res.length === 0 || res.length > 1) {
      return battleroyale.chat.send(player, "No / too many matching players!", battleroyale.config.colours.red);
    }

    // Add to config admins THIS IS TEMP

    battleroyale.config.admins.push(res[0].client.steamId);
    battleroyale.chat.send(player, "You promoted " + res[0].escapedNametagName + " to admin");
    battleroyale.chat.send(res[0], "You've promoted to admin by " + player.escapedNametagName);
  }))

  .add(new Command('spawnmenu').parameter('menu', 'string', 'weapons/vehicles').description('Show the spawn menu').handler(function(player, menu) {

    if(!battleroyale.utils.isAdmin(player)) {
      return battleroyale.chat.send(player, "You're not allowed to use this command");
    }

    var valid = ["weapons", "vehicles"];
    if(valid.indexOf(menu) !== -1) {
      battleroyale.chat.send(player, "For hide the menu write /spawnmenu again");
      jcmp.events.CallRemote('spawnmenu_show_menu', player, menu)
    } else {
      battleroyale.chat.send(player, "Invalid menu type");
    }


  }))

  .add(new Command('tp').parameter('target', 'string', 'networkId or (part of) name').description('tp urself to a player').handler(function(player, target) {

    if(!battleroyale.utils.isAdmin(player)) {
      return battleroyale.chat.send(player, "You're not allowed to use this command", battleroyale.config.colours.red);
    }

    const res = battleroyale.utils.getPlayer(target);
    if(res.length === 0 || res.length > 1) {
      return battleroyale.chat.send(player, "No / too many matching players!", battleroyale.config.colours.red);
    }

    player.position = res[0].position;
    battleroyale.chat.send(player, "You've been TP to player " + res[0].escapedNametagName);

  }))

  //.add(new Command('startime').description('Changes how much time (minutes) need to a new round start when reach the min amount of players'))




}
