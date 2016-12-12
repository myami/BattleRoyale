'use strict';

events.Add('chat_message', (player, message) => {
  if (typeof player.battleroyale === 'undefined')
    return `${player.escapedNametagName}: ${message}`;

  console.log(`${player.escapedNametagName}: ${message}`);
  return `${player.client.isNanosOfficial ? '<div class="nanos-logo"></div>' : ''}[${player.battleroyale.colour}] ${player.escapedNametagName}[#FFFFFF]: ${message}`;
});

events.AddRemoteCallable('chat_ready', player => {
  battleroyale.chat.send(player, 'Welcome to the Battleroyale server hosted by servergamers.net', battleroyale.config.colours.green);
  battleroyale.chat.send(player, 'Spawning might take a while. Please wait and enjoy the view.', battleroyale.config.colours.purple);

  if (battleroyale.bans.has(player.client.steamId)) {
    battleroyale.chat.send(player, 'You are banned from the server until the next server restart. You will get kicked shortly.', battleroyale.config.colours.red);
    const done = battleroyale.workarounds.watchPlayer(player, setTimeout(() => {
      done();
      player.Kick('banned')
    }, 15000));
  }
});
