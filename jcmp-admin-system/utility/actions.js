var Action = module.exports;
var errMsg = require('./message_errors.js');

/// -------------------  BAN PLAYER  ---------------------------- ///

Action.banPlayer = function(player, data) {

    //console.log("Banning player ")
    //console.log(data);

    if (player.admin.rank < 1) {
      errMsg.NO_PERMISSION(player);
      return;
    }

    const res = adminsys.utils.getPlayer(data.target.networkId.toString());
    if (res.length === 0) {
      errMsg.NO_PLAYER(player);
      return;
    }

    if(res.length >= 2) {
      errMsg.MORE_THAN_ONE(player);
      return;
    }

    var target = res[0];

    // Add player to ban list

    if(isNaN(data.time)) {
      jcmp.events.Call('toast_show', player, {
          heading: 'Error',
          text: 'Time or time type are not numbers',
          icon: 'error',
          loader: true,
          loaderBg: '#9EC600',
          position: 'top-right',
          hideAfter: 3000
      });
      return;
    }

    if(typeof(data.timeType) === 'undefined') {
      data.timeType = 'minutes';
    }

    var time = parseInt(data.time);
    if(time >= 1) {
      var banEndMs;
      switch (data.timeType) {
        case 'seconds':
          banEndMs = adminsys.utils.secondsToMs(time);
          break;
        case 'minutes':
          banEndMs = adminsys.utils.minutesToMs(time);
          break;
        case 'hours':
          banEndMs = adminsys.utils.hoursToMs(time);
          break;
        case 'days':
          banEndMs = adminsys.utils.daysToMs(time);
          break;
        default:
          jcmp.events.Call('toast_show', player, {
              heading: 'Error',
              text: 'Time type not valid',
              icon: 'error',
              loader: true,
              loaderBg: '#9EC600',
              position: 'top-right',
              hideAfter: 3000
          });
          return;
          //break;
      } // End switch
      time = Date.now() + banEndMs;
    } else {
      time = 0;
    }


    var banData = {
      name: target.escapedNametagName,
      steamId: target.client.steamId,
      reason: data.reason,
      bannedby: {
        name: player.escapedNametagName,
        steamId: player.client.steamId
      },
      date_start: Date.now(),
      date_end: time
    };

    //console.log("Ban Data:");
    //console.log(banData);

    adminsys.databaseSys.actions.banPlayer(player, target, data, banData);

} // End of ban player action

/// -------------------  KICK PLAYER  ---------------------------- //

Action.kickPlayer = function(player, data) {

  if (player.admin.rank < 1) {
    errMsg.NO_PERMISSION(player);
    return;
  }

  const res = adminsys.utils.getPlayer(data.target.networkId.toString());
  if (res.length === 0) {
    errMsg.NO_PLAYER(player);
    return;
  }

  if(res.length >= 2) {
    errMsg.MORE_THAN_ONE(player);
    return;
  }

  var target = res[0];

  jcmp.events.Call('toast_show', target, {
      heading: 'Kicked',
      text:  `<b>${player.escapedNametagName}</b> kicked you <br>` + (data.reason.length > 0 ? ` <b>Reason:</b> <i>${data.reason}</i>` : ''),
      icon: 'error',
      loader: true,
      loaderBg: '#9EC600',
      position: 'mid-center',
      hideAfter: 4500
  });

  adminsys.chat.broadcast(`${player.escapedNametagName} kicked ${target.escapedNametagName}.` + (data.reason.length > 0 ? ` Reason: ${data.reason}` : ''), adminsys.config.colours.orange);
  adminsys.workarounds.watchPlayer(target, setTimeout(() => target.Kick(data.reason), 5000));

} // End of kick player action

// ----- SET ADMIN RANK ----- //

Action.setAdminRank = function(player, data) {

  if(player.admin.rank < 3) {
    errMsg.NO_PERMISSION(player);
    return;
  }

  const res = adminsys.utils.getPlayer(data.target.networkId.toString());

  if(res.length === 0) {
    errMsg.NO_PLAYER(player);
    return;
  }

  if(res.length >= 2) {
    errMsg.MORE_THAN_ONE(player);
    return;
  }

  if(isNaN(data.rank)) {
    jcmp.events.Call('toast_show', player, {
        heading: 'Error',
        text: 'The rank should be a number',
        icon: 'error',
        loader: true,
        loaderBg: '#9EC600',
        position: 'top-right',
        hideAfter: 3000
    });
    return;
  }


  var target = res[0];

  if(target.admin.rank === data.rank) {
    jcmp.events.Call('toast_show', player, {
        heading: 'Error',
        text: 'This player already have that rank!',
        icon: 'error',
        loader: true,
        loaderBg: '#9EC600',
        position: 'top-right',
        hideAfter: 3000
    });
    return;
  }

  // Insert new Admin

  if(!adminsys.config.useDatabase) {
    adminsys.config.admins.push(target.client.steamId);
    return;
  }


  adminsys.databaseSys.actions.setAdminRank(target, data);

}

// --- TP PLAYER --- //
Action.tpPlayer = function(player, data) {

  if(player.admin.rank < 1) {
    errMsg.NO_PERMISSION(player);
    return;
  }

  const res = adminsys.utils.getPlayer(data.target.networkId.toString());

  if(res.length === 0) {
    errMsg.NO_PLAYER(player);
    return;
  }

  if(res.length >= 2) {
    errMsg.MORE_THAN_ONE(player);
    return;
  }

  var target = res[0];

  if(data.here) {
    adminsys.chat.send(target, "You have been teleported by an admin");
    target.position = player.position;
  } else {
    adminsys.chat.send(player, `You have been teleported to ${target.escapedNametagName}`);
    player.position = target.position;
  }

};

Action.setHP = function(player, data) {

  if(player.admin.rank < 1) {
    errMsg.NO_PERMISSION(player);
    return;
  }

  const res = adminsys.utils.getPlayer(data.target.networkId.toString());

  if(res.length === 0) {
    errMsg.NO_PLAYER(player);
    return;
  }

  if(res.length >= 2) {
    errMsg.MORE_THAN_ONE(player);
    return;
  }

  var target = res[0];

  target.health = data.hp;

  jcmp.events.Call('toast_show', player, {
      heading: 'Action completed',
      text: `${target.escapedNametagName} HP is now ${target.health}`,
      icon: 'success',
      loader: true,
      loaderBg: '#9EC600',
      position: 'top-right',
      hideAfter: 3000
  });

}

Action.unbanPlayer = function(player, targetData) {

  if(player.admin.rank < 1) {
    errMsg.NO_PERMISSION(player);
    return;
  }

  // Try to find the player, and unban it

  /*
  var target = JSON.parse(targetData);
  console.log(target);*/

  if(!adminsys.config.useDatabase) {
    return;
  }

  adminsys.databaseSys.actions.unbanPlayer(targetData);

}

Action.spawnVehicle = function(player, hash) {

  if(player.admin.rank < 1) {
    errMsg.NO_PERMISSION(player);
    return;
  }

  var vehPos = new Vector3f(player.position.x + 300, player.position.y, player.position.z);
  const vehicle = new Vehicle(hash, vehPos, player.rotation);

}

Action.spawnWeapon = function(player, data) {

  if(player.admin.rank < 1) {
    errMsg.NO_PERMISSION(player);
    return;
  }

  //data = JSON.parse(data);
  //console.log(data);
  var res = adminsys.utils.getPlayer(data.target.networkId.toString());
  //console.log(res);
  if(res.length < 1) {
    errMsg.NO_PLAYER(player);
    return;
  }

  if(res.length >= 2) {
    errMsg.MORE_THAN_ONE(player)
    return;
  }

  var target = res[0];
  target.GiveWeapon(data.hash, data.ammo, true);

}
