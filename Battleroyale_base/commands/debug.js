'use strict';

module.exports = ({ Command, manager }) => {
  manager.category('debug', 'commands for debug purposes')
  
  .add(new Command('startbattle').description('Start a battle').handler(function(player) {

    if(!battleroyale.utils.isAdmin(player)) {
      return battleroyale.chat.send(player, "You're not allowed to use this command");
    }
    jcmp.events.Call('battleroyale_start_battle');
    battleroyale.chat.send(player, "Battle Start");

  }))

  .add(new Command('gotolobby').description('Teleport the player to the lobby').handler(function(player) {

    if(!battleroyale.utils.isAdmin(player)) {
      return battleroyale.chat.send(player, "You're not allowed to use this command!");
    }

    player.position = battleroyale.config.game.lobby.pos;
    battleroyale.chat.send(player, "You've teleported to the lobby position");

  }))

  .add(new Command('showmyinfo').description('Shows player object to the console').handler(function(player) {
    console.log(player);
  }))

  
  .add(new Command('showgameinfo').description('Shows game object to the console').handler(function(player) {
    console.log(player.battleroyale.game);
  }))

  .add(new Command('distancetogamereal').description('Shows the distance to the game').handler(function(player) {
    battleroyale.chat.send(player, battleroyale.utils.GetDistanceBetweenPointsXZ(player.position, player.battleroyale.game.position))
  }))

  .add(new Command('distantetogame').description('Shows the distance to the game based on the circle render formula').handler(function(player) {
    console.log(battleroyale.utils.GetDistanceBetweenPointsXZ(player.position, player.battleroyale.game.position))
    console.log(player.battleroyale.game.radius * 0.95/2);
  }))

  .add(new Command('updatearea').description('updates the current area of the battle').handler(function(player) {
    jcmp.events.Call('battleroyale_update_area', player.battleroyale.game);
  }))


  .add(new Command('showtimestart').description('shows the time to start in milisenconds').handler(function(player) {
    console.log(battleroyale.game.timeToStart);
  }))


  .add(new Command('playersonlobby').description('Shows the array players onlobby to the console').handler(function(player) {
    console.log(battleroyale.game.players.onlobby);
  }))

  .add(new Command('pareanowarn').description('Check the players in area with no warning').handler(function(player) {

    
    console.log(player.battleroyale.game.players.filter(function(p) {
      var comparation = (p.battleroyale.warning == false);
      return comparation;
    }));
  }))

  .add(new Command('timertype').description('testing the workaround2').handler(function(player) {
    /*var timer = setTimeout(function() {}, 60000);
    console.log(timer);*/

    var timer = battleroyale.workarounds2.createInterval(player, function() {
      console.log("Prueba");
    }, 10000);

    console.log(timer);

    battleroyale.workarounds2.deleteTimer(player, timer);

  }))

  .add(new Command('createBarrel').description('Create a barrel texture').parameter("y", "number", "y axis increment").handler(function(player, y) {
    jcmp.events.CallRemote('battleroyale_render_barrels', player, JSON.stringify([{position: { x: player.position.x, y: player.position.y + y, z: player.position.z }}]));
  }))

  .add(new Command('gotobarrel').description('Goto a barrel in game').parameter("index", "number", "index of the barrel ingame").handler(function(player, index) {
    const barrel = player.battleroyale.game.spawnWeaponPoints[index];
    player.position = barrel.position;
  }))

  .add(new Command('distancetobarrel').description('Goto a barrel in game').parameter("index", "number", "index of the barrel ingame").handler(function(player, index) {
    const barrel = player.battleroyale.game.spawnWeaponPoints[index];
    //player.position = barrel.position;
    console.log(battleroyale.utils.GetDistanceBetweenPoints(player.position, barrel.position));
  }))


  .add(new Command('setx').parameter('z','number','Z axis').handler(function(player, x) {
    console.log(player.position);
    player.position = new Vector3f(x,player.position.y, player.position.z);
    console.log(player.position);
  }))

  .add(new Command('playerscacheshow').handler(function(player) {
    jcmp.events.CallRemote('battleroyale_cachelist', player);
  }))

  .add(new Command('getrotandpos').handler(function(player) {
    console.log(player.position);
    console.log(player.rotation);
  }))

  .add(new Command('setminplayers').parameter('minplayers', 'number', 'minplayers').handler(function(player, minplayers) {
      battleroyale.config.game.minPlayers = minplayers;
      var needplayers = battleroyale.game.players.onlobby.length - minplayers;
      jcmp.events.CallRemote('battleroyale_txt_needPlayers', null, needplayers);
      battleroyale.chat.send(player, 'Min players set to ' + battleroyale.config.game.minPlayers);
  }))

  .add(new Command('gotopos').parameter('x', 'number', 'X axis').parameter('y', 'number', 'X axis').parameter('z', 'number', 'X axis').handler(function(player, x,y,z) {
    player.position = new Vector3f(x,y,z);
  }))

}
