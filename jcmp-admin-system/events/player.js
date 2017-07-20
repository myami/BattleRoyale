jcmp.events.Add("PlayerCreated", function (player) {
  player.escapedNametagName = player.name.replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 40);
  player.admin = {};



  if (adminsys.utils.isAdmin(player)) {
    player.admin.rank = 3; // This happens if the player is in array admins
  } else {
    
    // Fnc to check if is admin on DB

    if(adminsys.config.useDatabase) {

      switch (adminsys.config.databaseSys) {
        case 'mongodb':
            adminsys.databaseSys.PlayerCreated(player);
          break;
        case 'mysql':
          break;
      }

    }
  }

});

jcmp.events.Add("PlayerReady", function (player) {
  //player.escapedNametagName = player.name.replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 40);

  // Call here UI For Admins

  // Check if player is banned

  if (adminsys.config.useDatabase) {
    adminsys.databaseSys.PlayerReady(player);
  } else {
    
    // TODO: Check in memory variable of bans

    if (player.admin.rank >= 1) {
      //console.log("Calling to the adminsys ready event");
      jcmp.events.CallRemote('adminsys_ready', player, JSON.stringify({
        name: player.escapedNametagName,
        networkId: player.networkId,
        admin: player.admin
      }))
    }

  }




});