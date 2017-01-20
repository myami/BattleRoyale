'use strict';

module.exports = class BRGame {
  constructor(id, position, players) {
    this.id = id;
    this.position = position;
    this.radius = battleroyale.config.game.battle_StartRadius;
    this.players = []; // This is a array;
    this.aliveStarted = this.players.length;
  }

  broadcast(msg, color) {
    for(let player of this.players) {
      battleroyale.chat.send(player, msg, color);
    }
  }


}
