'use strict';



events.Add("Checks", function()
{
  //console.log("Check!");
//gm.utility.print("Check!");

if(!Started)
{
  if(!beingStart && gtamp.players.length >= gm.config.game.minPlayers)
  {
    gm.utility.broadcastMessage("Minimum number of players reached to start");
    gm.utility.broadcastMessage("Game is going to start in 3 minutes");
    beingStart = true;
    global.beingStartTimer = setTimeout(function() {
      gm.events.OnBattleStart();
    }, gm.utility.minutes(3));
  }

  if(beingStart && gtamp.players.length < gm.config.game.minPlayers)
  {
    clearTimeout(beingStartTimer);
    let needplayers = gm.config.game.minPlayers - gtamp.players.length;
    gm.utility.broadcastMessage("Need " + needplayers + " players more");
  }
} else { // if Started == true

  for(let player of g_pingame) { // Check if player was in area.
    if(!gm.utility.IsPointInCircle(player.position, battleArea.position, battleArea.radius)) {
      // Change player health -2
      setInterval(function() { gm.events.OnPlayerOutArea(player); }, gm.utility.seconds(15));
    }

    //timeLeft.seconds -= 1;

  }

    if(timeLeft.seconds <= 0) {
      timeLeft.minutes -= 1;
      timeLeft.seconds = 59;
    } else {
      timeLeft.seconds -= 1;
    }

    gm.utility.print(timeLeft.minutes + ":" + timeLeft.seconds);
}


// Check if the players on the lobby was in lobby area or not.

for(let player of gtamp.players) {
  if(!gm.utility.IsPointInCircle(player.position, gm.config.game.lobbypos, 100.0) && !player.ingame) {

    console.log(player.name + " was not in lobby area");
    console.log("changing player position");
    player.position = gm.config.game.lobbypos;
    console.log(player.name + " X: " + player.position.x + " Y: " + player.position.y + " Z: " + player.position.z);
  }
}


});

events.Add("OnBattleStart", function()
{


  timeLeft.minutes = gm.utility.msToMinutes(gm.config.game.roundTime);

  console.log("Battle started!");
  Started = true;
  beingStart = false;

  global.EndTimer = setTimeout(function() {
    gm.events.OnBattleEnd();
  }, gm.config.game.roundTime);

  global.AreaTimer = setInterval(function() {
    gm.events.OnBattleAreaChange();
  }, gm.utility.minutes(3));

  let maxSpawn = gm.spawns.spawn.length - 1;
  let rnd = gm.utility.RandomInt(0, maxSpawn);
  //console.log("RANDOM INDEX: " + rnd);
  let data = gm.spawns.spawn[rnd];
  let spawnPos = new Vector3f(data.x, data.y, data.z);

  for(let player of gtamp.players) {
    player.ingame = true;
    g_pingame.push(player);
    player.position = spawnPos;
  }

   global.battleArea = { position: spawnPos, radius: gm.config.game.startAreaRadius }; // position here is useless

  //gm.utility.LoadVehicles();

});

events.Add("OnBattleEnd", function()
{

  if(typeof player === 'undefined') { // if the round ends with more than 1 player alive.

    /*let survivorcount;
    for(let player of g_players) {
      if(player.ingame) {
        survivorcount++;
      }
    }*/

    gm.utility.broadcastMessage(g_pingame.length + " people survived to the battle");
    gm.utility.broadcastMessage("Survivors: ");

    /*for(let player of g_players) {
      if(player.ingame) {
        player.ingame = false
        player.position = gm.config.game.lobbypos;
        gm.utility.broadcastMessage(" - " + player.name);
      }
    }*/

    for(let player of g_pingame) {
      player.ingame = false;
      player.position = gm.config.game.lobbypos;
      gm.utility.broadcastMessage(" - " + player.name);
    }

  } else { // if round gots a winner
    gm.utility.broadcastMessage(player.name + "was the winner of battle royale!");
    player.ingame = false;
    player.position = gm.config.game.lobbypos;
  }

  clearInterval(AreaTimer);
  Started = false;
  g_pingame = [];
  gm.utility.broadcastMessage("A new battle is going to start soon!");

});

events.Add("OnBattleAreaChange", function()
{
  /*for(let player of g_pingame) {

}*/

gm.utility.broadcastMessage("Battle area changed, look to the map");

let rnd = gm.utility.RandomInt(0, g_pingame.length - 1);
let areaPos = g_pingame[rnd].position;
let rad = battleArea.radius / 2;
battleArea = { position: areaPos, radius: rad }


});

events.Add("OnPlayerOutArea", function(player)
{
  player.SendChatMessage("You not are in the area!!");
// Change health -2 for example

});
