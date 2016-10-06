'use strict';



const utility = require('../utility');


module.exports = function({ Command, manager }) {
  manager.category('battleroyale', 'BattleRoyale related commands')
    // /time [hour] [minute]
    .add(new Command('incircle')
      .timeout(180000)
      .description('Check if you are in the circle')
      .handler((player) => {
        if(gm.utility.IsPointInCircle(player.position, gm.config.game.lobbypos, 100.0)) {
      player.SendChatMessage("You in the circle");
    } else {
      player.SendChatMessage("You're not in the circle");
    }
      }))

    // /weather [preset name]
    .add(new Command('restart')
      .timeout(180000)
      .description('Restart the server')
      .handler((player) => {
        player.SendChatMessage("Server restarting...");
  console.log("Server restarting...");
  server.Restarts();

      }))

      .add(new Command('roundTime')
        .timeout(180000)
        .description('Check the time of the round')
        .handler((player) => {
          player.SendChatMessage(gm.utility.PutCero(timeLeft.minutes) + ":" + gm.utility.PutCero(timeLeft.seconds));
        }))

        .add(new Command('inbattlearea')
          .timeout(180000)
          .description('Check if you are in the area ')
          .handler((player) => {
            if(gm.utility.IsPointInCircle(player.position, battleArea.position, battleArea.radius)) {
        	    player.SendChatMessage("You are in range of battle area circle");
        	  } else {
        	    player.SendChatMessage("You aren't in range of battle area circle");
        	  }
           }))
           .add(new Command('survival')
             .timeout(180000)
             .description('Check the time of the round')
             .handler((player) => {
               player.SendChatMessage(gm.utility.PutCero(timeLeft.minutes) + ":" + gm.utility.PutCero(timeLeft.seconds));
             }))
             .add(new Command('reducearea')
               .timeout(180000)
               .description('Reduced area of battle')
               .handler((player) => {
                 clearInterval(global.AreaTimer);
                 gm.events.OnBattleAreaChange();
                 // Start the interval again
                 global.AreaTimer = setInterval(function() {
                   gm.events.OnBattleAreaChange();
                 }, gm.utility.minutes(3));
                 }))

                 .add(new Command('seespawns')
                   .timeout(180000)
                   .description('See the coordinate of the spawns')
                   .handler((player) => {
                     for(let i = 0; i < gm.spawns.spawn.length; i++) {
         let data = gm.spawns.spawn[i];
         player.SendChatMessage(i + ": " + " X: " + data.x + " Y: " + data.y + " Z: " + data.z);
       }
                     }))
                     .add(new Command('endBattle')
                       .timeout(180000)
                       .description('End the battleroyale')
                       .handler((player) => {
                         clearTimeout(global.EndTimer);
   	                     gm.events.OnBattleEnd();

                         }))

                         .add(new Command('startBattle')
                           .timeout(180000)
                           .description('start the battleroyale')
                           .handler((player) => {
                             console.log("battle started!");
                             clearTimeout(beingStartTimer);
                             gm.events.OnBattleStart();

                             }))

                             .add(new Command('gplayers')
                               .timeout(180000)
                               .description('Player in game')
                               .handler((player) => {
                                 console.log("Players: " + g_players.length);
                                 }))
                                








};
