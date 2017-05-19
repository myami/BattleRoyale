'use strict';

module.exports = class BRGame {
  constructor(id, position, radius, psp, wsp, players) {
    this.id = id;
    this.position = position;
    this.radius = radius;
    this.players = [];
    this.aliveStarted = this.players.length;
    this.playerSpawnPoints = psp;
    this.barrelSpawnPoints = wsp;

  }

  broadcast(msg, color) {
    for(let player of this.players) {
      battleroyale.chat.send(player, msg, color);
    }
  }


}
