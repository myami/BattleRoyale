'use strict';



events.Add("Checks", function()
{

   battleroyale.utility.print("Check!"); //print on the console that the event is run.

if(!Started)
{
  if(!beingStart && jcmp.players.length >= battleroyale.config.game.minPlayers)
  {
    battleroyale.chat.broadcast("Minimum number of players reached to start");
      battleroyale.chat.broadcast("Game is going to start in 3 minutes");
    beingStart = true;
    global.beingStartTimer = setTimeout(function() {
      battleroyale.events.OnBattleStart();
    }, battleroyale.utility.minutes(3));
  }

  if(beingStart && jcmp.players.length < battleroyale.config.game.minPlayers)
  {
    clearTimeout(beingStartTimer);
    let needplayers = battleroyale.config.game.minPlayers - jcmp.players.length;
    battleroyale.chat.broadcast("Need " + needplayers + " players more");
  }
} else { // if Started == true and the game is launch check if player is out of area

  for(let player of g_pingame) { // Check if player was in area.
    if(!battleroyale.utility.IsPointInCircle(player.position, battleArea.position, battleArea.radius)) {
      // Change player health -2
      setInterval(function() { battleroyale.events.OnPlayerOutArea(player); }, battleroyale.utility.seconds(15));
    }

    //timeLeft.seconds -= 1;

  }

    if(timeLeft.seconds <= 0) {
      timeLeft.minutes -= 1;
      timeLeft.seconds = 59;
    } else {
      timeLeft.seconds -= 1;
    }

    battleroyale.utility.print(timeLeft.minutes + ":" + timeLeft.seconds);
}


// Check if the players on the lobby was in lobby area or not.

for(let player of jcmp.players) {
  if(!battleroyale.utility.IsPointInCircle(player.position, battleroyale.config.game.lobbypos, battleroyale.config.game.lobbyradius) && !player.ingame) {

    console.log(player.name + " was not in lobby area");
    console.log("changing player position");
    player.position = battleroyale.config.game.lobbypos;
    console.log(player.name + " X: " + player.position.x + " Y: " + player.position.y + " Z: " + player.position.z);
  }
}


});

events.Add("OnBattleStart", function()
{


  timeLeft.minutes = battleroyale.utility.msToMinutes(battleroyale.config.game.roundTime);
battleroyale.utility.print("Battle started!!");

  Started = true;
  beingStart = false;

  global.EndTimer = setTimeout(function() {
    battleroyale.events.OnBattleEnd();
  }, battleroyale.config.game.roundTime);

  global.AreaTimer = setInterval(function() {
    battleroyale.events.OnBattleAreaChange();
  }, battleroyale.utility.minutes(3));

  let maxSpawn = battleroyale.spawns.spawn.length - 1;
  let rnd = battleroyale.utility.RandomInt(0, maxSpawn);
  //console.log("RANDOM INDEX: " + rnd);
  let data = battleroyale.spawns.spawn[rnd];
  let spawnPos = new Vector3f(data.x, data.y, data.z);

  for(let player of jcmp.players) {
    player.ingame = true;
    g_pingame.push(player);
    player.position = spawnPos;
  }

   global.battleArea = { position: battleroyale.config.game.areapos, radius: battleroyale.config.game.startAreaRadius }; // position here is useless

  //battleroyale.utility.LoadVehicles();

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

    battleroyale.chat.broadcast(g_pingame.length + " people survived to the battle");
    battleroyale.chat.broadcast("Survivors: ");

    /*for(let player of g_players) {
      if(player.ingame) {
        player.ingame = false
        player.position = battleroyale.config.game.lobbypos;
        battleroyale.chat.broadcast(" - " + player.name);
      }
    }*/

    for(let player of g_pingame) {
      player.ingame = false;
      player.position = battleroyale.config.game.lobbypos;
      battleroyale.chat.broadcast(" - " + player.name);
    }

  } else { // if round gots a winner
    battleroyale.chat.broadcast(player.name + "was the winner of battle royale!");
    player.ingame = false;
    player.position = battleroyale.config.game.lobbypos;


  }

  clearInterval(AreaTimer);
  Started = false;
  g_pingame = [];
  battleroyale.chat.broadcast("A new battle is going to start soon!");

});

events.Add("OnBattleAreaChange", function()
{


battleroyale.chat.broadcast("Battle area changed, look to the map");

let rnd = battleroyale.utility.RandomInt(0, g_pingame.length - 1);
let areaPos = g_pingame[rnd].position;
let rad = battleArea.radius / 2;
battleArea = { position: areaPos, radius: rad }


});

events.Add("OnPlayerOutArea", function(player)
{
  battleroyale.chat.send(player,"You not are in the area!! ");
  player.health -= 100;
  battleroyale.chat.broadcast(player.name + "Die because he is out of the area!");
// Die because he is out of the area

});
