'use strict';

events.Add('PlayerCreated', function(player) {
  pLogged[player.name]    = false;
  ConfirmReg[player.name] = false;

  PlayerInfo[player.name] = {
    id: 0,
    adminlvl: 0,
    death : 0,
    banned: 0


  };

  // REG SYSTEM

    let connection = gm.utility.dbConnect();

    connection.connect(function(err){

      if(!err) {
          console.log("Database is connected ... \n\n");
      } else {
          console.log("Error connecting database ... \n\n");
      }

    });

    connection.query("SELECT username FROM users WHERE username = '" + player.name + "'", function(err, results) {

        let numRows = results.length;

        if(numRows >= 1) {
          player.SendChatMessage("Use /login [PASSWORD] to connect");   // show the login UI
          Registered[player.name] = true;

        } else {
          player.SendChatMessage("You are not registered, use /register [PASSWORD] to register");      // show the register UI
          Registered[player.name] = false;
        }
    });
    connection.end();




  console.log('Player ' + player.name + ' has successfully joined the server.');
  gm.chat.broadcast(player.name + ' has joined the server.', gm.config.color.orange);

});

/*function randomPos(basePos, range) {
  return new Vector3f(basePos.x + gm.utility.random(-(range / 2), range / 2), basePos.y, basePos.z + gm.utility.random(-(range / 2), range / 2));
}*/

// player ready
events.Add('PlayerReady', function(player) {
    player.respawnPosition = config.lobbypos;
  //player.respawnPosition = new Vector3f(3604.17163, 1300.0, 1178.84021);
  player.Respawn();

  // set the time and weather for the player
  player.world.weather = gm.world.weather;
  player.world.SetTime(gm.world.time.hour, gm.world.time.minute, 0);

  console.log('Player ' + player.name + ' has spawned.');
});

// player respawns
events.Add('PlayerRespawn', function(player) {
  // Give the player an assault rifle
//  player.GiveWeapon(0xcb75ff26, 1000, true);
});

// player death
events.Add('PlayerDeath', function(player, killer, reason) {
  let message = player.name + ' ';
  if (typeof killer !== 'undefined' && killer !== null) {
    if (killer === player) {
      message += 'killed himself. (' + gm.utility.deathReasonToString(reason) + ')';
    } else {
      if (typeof killer.name !== 'undefined') {
        message += 'has been killed by ' + killer.name + '. (' + gm.utility.deathReasonToString(reason) + ')';
      } else {
        message += 'has been run over by a vehicle (probably).';
      }
    }
  } else {
    message += 'died. (' + gm.utility.deathReasonToString(reason) + ')';
  }
    PlayerInfo[killer.name].death += 1; // 1 point par mort

  gm.chat.broadcast(message, gm.config.color.orange);
//  player.respawnPosition = randomPos(new Vector3f(3604.17163, 1300.0, 1178.84021), 1400);
    player.respawnPosition = config.lobbypos;
  player.Respawn();
});

events.Add('onPlayerLogin',function(player, dbData)  {
  console.log("dbData \n" + dbData);

  gm.utility.print("Player " + player.name + " logged in");




  PlayerInfo[player.name] = {
    id: dbData.id,
    adminlvl: dbData.adminlvl,
    death: dbData.death,
    banned: dbData.banned


  };

});

events.Add('onPlayerUpdate',function(player, callback, info)   {

    info = typeof info !== 'undefined' ? info : true;
    let connection = gm.utility.dbConnect();



    connection.connect();

    let SQLQuery = "UPDATE users SET" +
    " adminlvl=" + PlayerInfo[player.name].adminlvl +
        " ,death=" + PlayerInfo[player.name].death +
        " ,banned=" + PlayerInfo[player.name].banned +
    " WHERE id = " + PlayerInfo[player.name].id;

    connection.query(SQLQuery, function(err) {
      if(err) {
            gm.utility.print("An error ocurred trying to upload the info of " + player.name);
            gm.utility.print("QUERY: " + SQLQuery);
            gm.utility.print("[ERROR]: " + err);
            if(callback) callback(false);
          } else {
            if(info) { gm.utility.print("player data of " + player.name + " has been updated " + info); }
            if(callback) callback(true);
          }
    });

    connection.end();

});


events.Add('updateAllPlayers',function() {

      if(jcmp.players.length >= 1)
      {
       console.log("Uploading all players info...");
       for (let player of jcmp.players)
       {
        if(pLogged[player.name])
        {
          Events.onPlayerUpdate(player, false);
        }
      }

      console.log("info of all players has been uploaded");

    }
  });
