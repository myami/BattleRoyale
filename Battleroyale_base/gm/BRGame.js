'use strict';

module.exports = class BRGame {
  constructor(id, position, radius, maxY ,spawnWeaponPoints ,players) {
    this.id = id;
    this.position = position;
    this.radius = radius;
    this.players = players;
    this.aliveStarted = players.length;
    /*this.playerSpawnPoints = psp;
    this.barrelSpawnPoints = wsp;*/
    this.maxY = maxY;
    this.spawnWeaponPoints = spawnWeaponPoints;
  }

  start() {

    battleroyale.game.players.onlobby = [];
    let self = this;

    
    const spawnWeaponRenderPoints = this.spawnWeaponPoints.map(wp => ({
      position: { x: wp.position.x, y: wp.position.y, z: wp.position.z }
    }));
    
    const gameData = {
      center: { x: self.position.x, y: self.position.y, z: self.position.z },
      diameter: self.radius,
      maxY: self.maxY,
      spawnWeaponsRenderPoints: spawnWeaponRenderPoints,
      npstart: this.players.length
    };

    let spawnArea = this.position;
    spawnArea.y += 1000; // More altitude


    
    for(let player of this.players) {

      /*jcmp.events.CallRemote('battleroyale_txt_timerStart', player, false);
      jcmp.events.CallRemote('battleroyale_txt_leftplayers_toggle', false);*/
      //console.log(gameData);
      jcmp.events.CallRemote('battleroyale_client_gameStart', player, JSON.stringify(gameData));

      player.battleroyale.game = this;
      player.battleroyale.ingame = true;

      player.dimension = this.id;
      player.position = battleroyale.utils.randomSpawn(spawnArea, this.radius / 1.5);

    }

    //battleroyale.game.players.ingame.push(...this.players);
    // NOTE: Concat seems to be more faster than push with the spread operator
    // REFERENCE: https://jsperf.com/array-prototype-push-apply-vs-concat/13

    battleroyale.game.players.ingame = battleroyale.game.players.ingame.concat(this.players);

    //console.log(battleroyale.game.players.ingame);

    // TODO: Close more faster the area depending of the time elapsed in the game
    const time = battleroyale.utils.MinToMs(2);
    this.closeArea = setInterval(function() {
      jcmp.events.Call('battleroyale_update_area', self);
    }, time);

    console.log(this.spawnWeaponPoints);

  }

  updatePlayers() {

    let newCenter = JSON.stringify({
      x: this.position.x,
      y: this.position.y,
      z: this.position.z
    });

    

    for(let player of this.players) {

      jcmp.events.Call('toast_show', player, {
        heading: 'Battle update',
        text: "The new battle area has been designated",
        showHideTransition : 'fade',
        icon: 'warning',
        loader: true,
        loaderBg: '#9EC600',
        position: 'top-right',
        hideAfter: 5000
      });

      jcmp.events.CallRemote('battleroyale_render_updateDiameter', player, this.radius, newCenter);
    }

  }

  broadcast(msg, color) {
    for(let player of this.players) {
      battleroyale.chat.send(player, msg, color);
    }
  }

  showLeftPlayers() {
    for(let player of this.players) {
      jcmp.events.CallRemote('battleroyale_txt_gameleftplayers_show', player, this.players.length)
    }
  }

  removeBarrel(barrel) {

    let index = this.spawnWeaponPoints.indexOf(barrel);
    if (index >= 0) {
      const barrel = this.spawnWeaponPoints.splice(index, 1);

      const self = this;

      setTimeout(function() {
        self.spawnWeaponPoints.push(barrel[0]);
        self.updateBarrels();
      }, battleroyale.utils.random(60000, 120000)) // Respawn time between 1 and 2 minutes
    }


    this.updateBarrels();
    
  }

  updateBarrels() {

    /*const spawnWeaponRenderPoints = this.spawnWeaponPoints.map(wp => ({
      position: { x: wp.position.x, y: wp.position.y, z: wp.position.z }
    }));*/

    const spawnWeaponRenderPoints = this.spawnWeaponPoints.map(function(wp) {
      return { position: { x: wp.position.x, y: wp.position.y, z: wp.position.z } }
    })


    for(let player of this.players) {
      jcmp.events.CallRemote('battleroyale_render_barrels', player, JSON.stringify(spawnWeaponRenderPoints));
    }
  }


}
