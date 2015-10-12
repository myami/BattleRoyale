
"use strict";
let commands = module.exports = new Map();

let red = new RGB(255, 59, 59);
commands.set("help", (player) => {
  let str = "list of commands:";
  let i = 1;
  commands.forEach((_, key) => {
    str += " /" + key;
    if (i % 3 === 0) {
      str;
    }
    i++;
  });
  str = str.substr(0, str.length - 0);
  player.SendChatMessage(str);
});

commands.set("incircle", (player) => {
  if(gm.utility.IsPointInCircle(player.position, gm.config.game.lobbypos, 100.0)) {
    player.SendChatMessage("You in the circle");
  } else {
    player.SendChatMessage("You're not in the circle");
  }
});

commands.set("setpos", (player, args) => {
  let pos = { x: parseFloat(args[0]), y: parseFloat(args[1]), z: parseFloat(args[2]) }
  let setpos = new Vector3f(pos.x, pos.y, pos.z);
  player.position = setpos;
  console.log(player.name + " set to X:" + args[0] + " Y: " + args[1] + " Z: " + args[2]);
});

commands.set("players", (player) => {
  console.log("Players: " + g_players.length);
});

commands.set("mypos", (player) => {
  player.SendChatMessage("You position is: X: " + player.position.x + " Y: " + player.position.y + " Z: " + player.position.z);
});

commands.set("startBattle", (player) => {
  console.log("battle started!");
  clearTimeout(beingStartTimer);
  gm.events.OnBattleStart();
});

commands.set("endBattle", (player) => {
  clearTimeout(EndBattle);
  gm.events.OnBattleEnd();
});

commands.set("seespawns", (player) => {

  for(let i = 0; i < gm.spawns.spawn.length; i++) {
    let data = gm.spawns.spawn[i];
    player.SendChatMessage(i + ": " + " X: " + data.x + " Y: " + data.y + " Z: " + data.z);
  }

});

commands.set("reduceArea", (player) => {
  clearInterval(global.AreaTimer);

  gm.events.OnBattleAreaChange();


  // Start the interval again

  global.AreaTimer = setInterval(function() { 
    gm.events.OnBattleAreaChange();
  }, gm.utility.minutes(3));

});

commands.set("inbattlearea", (player) => {
  if(gm.utility.IsPointInCircle(player.position, battleArea.position, battleArea.radius)) {
    player.SendChatMessage("You are in range of battle area circle");
  } else {
    player.SendChatMessage("You aren't in range of battle area circle");
  }
});

commands.set("survival" , (player) => {
  console.log(g_pingame.length);
});

commands.set("msToMinutes", (player) => {
  let tim = (15 * 1000) * 60;
  player.SendChatMessage("15000 ms = " + gm.utility.msToMinutes(tim))
});

commands.set("roundTime", (player) => {
  player.SendChatMessage(gm.utility.PutCero(timeLeft.minutes) + ":" + gm.utility.PutCero(timeLeft.seconds));
});