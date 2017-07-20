'use strict';

module.exports = ({ Command, manager }) => {
  manager.category('admin', 'only usable by admins')
    .add(new Command('akick').parameter('target', 'string', 'networkId or (part of) name').optional('reason', 'string', 'reason', { isTextParameter: true }).description('kicks one or more players').handler((player, target, reason) => {
      adminsys.actions.kickPlayer(player, {target: { networkId: target }, reason: reason});
    }))

    .add(new Command('asetrank').description('Set the admin rank of a player').parameter('target', 'string', 'networkId or (part of) name').parameter('rank', 'number', 'Rank number').description('Set the admin rank of a player').handler(function(player, target, rank) {
      adminsys.actions.setAdminRank(player, {target: { networkId: target }, rank: rank});
    }))

    .add(new Command('aban').description('Ban a player ').parameter('target', 'string', 'networkId or (part of) name').parameter('time', 'number', 'Time of the ban 0 = Permanent').optional('timetype', 'string', 'days, hours, minutes or seconds').optional('reason', 'string', 'reason', { isTextParameter: true }).handler(function(player, target, time, timetype, reason) {
      adminsys.actions.banPlayer(player, {target: { networkId: target }, time: time, timeType: timetype, reason: reason});
    }))

    .add(new Command('atp').description('Teleport yourself to a player').parameter('target', 'string', 'networkId or (part of) name').handler(function(player, target) {
      adminsys.actions.tpPlayer(player, {target: { networkId: target }, here: false})
    }))

    .add(new Command('atphere').description('Teleport a player to your position').parameter('target', 'string', 'networkId or (part of) name').handler(function(player, target) {
      adminsys.actions.tpPlayer(player, {target: { networkId: target }, here: true})
    }))

    .add(new Command(['aoe', 'ab', 'abroadcast']).parameter('text', 'string', 'text', { isTextParameter: true }).description('send a message to all players').handler((player, text) => {
      //adminsys.actions.kickPlayer(player, {target: target, reason: reason});
      if(player.admin.rank < 1) {
        return require('../utility/message_errors.js').NO_PERMISSION;
      }
      adminsys.chat.broadcast(`[ADMIN] ${player.escapedNametagName}: ${text}`, new RGB(255, 153, 51));
    }))

    .add(new Command(['a', 'asay']).parameter('text', 'string', 'text', { isTextParameter: true }).description('Talk to the admin chat').handler((player, text) => {
      //adminsys.actions.kickPlayer(player, {target: target, reason: reason});
      if(player.admin.rank < 1) {
        return require('../utility/message_errors.js').NO_PERMISSION;
      }
      for(var i = 0; i < jcmp.players.length; i++) {
        adminsys.chat.send(jcmp.players[i], `${player.escapedNametagName}: ${text}`, new RGB(255, 102, 102));
      }
    }))

    .add(new Command('amenu').description('Opens the admin UI menu').handler(function(player) {

      if(player.admin.rank < 1) {
        adminsys.chat.send(player, "You're not allowed to use this command");
        return;
      }

      adminsys.chat.send(player, "Loading admin UI ... ");
      jcmp.events.CallRemote('adminsys_toggle_adminui', player);

    }))

    .add(new Command('nid').parameter('target', 'string', 'networkId or (part of) name').handler(function(player, target) {

      const res = adminsys.utils.getPlayer(target);

      if(res.length === 0) {
          jcmp.events.Call('toast_show', player,  {
              heading: 'Error',
              text: "Can't find player",
              icon: 'danger',
              loader: true,
              loaderBg: '#9EC600',
              position: 'top-right',
              hideAfter: 3000
          });
          return;
      }

      if(res.length >= 2) {
        jcmp.events.Call('toast_show', player,  {
            heading: 'Error',
            text: "Exists more one than player with a name like that",
            icon: 'danger',
            loader: true,
            loaderBg: '#9EC600',
            position: 'top-right',
            hideAfter: 3000
        });
        return;
      }

      adminsys.chat.send(player, `${res[0].escapedNametagName} network ID: ${res[0].networkId}`);
      console.log(player);

    }))

};
