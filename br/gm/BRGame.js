'use strict';

module.exports = class BRGame {

  constructor(id, position, players) {
    this.id = id;
    this.position = position;
    this.radius = battleroyale.config.game.battle_StartRadius;
    //this.players = []; // This is a array;ç
    this.players = players;
    this.aliveStarted = this.players.length;

    // Create poi
    this.poi = new POI(21, position, "Battle circle center"); // Doesnt matter the position beacuse for some reason in the constructor doesnt work =/
    this.poi.dimension = id;
    this.poi.position = new Vector3f(position.x, 0.0, position.z);
    this.poi.visible = true;
    this.poi.clampedToScreen = true;
    this.poi.minDistance = 1;
    this.poi.maxDistance = 20000;

    console.log("Showing poi");
    console.log(this.poi);

  }

  broadcast(msg, color) {
    for(let player of this.players) {
      battleroyale.chat.send(player, msg, color);
    }
  }


}
