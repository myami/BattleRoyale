'use strict';

const utility = require('../gm/utility');

module.exports = ({ Command, manager }) => {
  const weathers = [
    'base',
    'rain',
    'overcast',
    'thunderstorm',
    'fog',
    'snow'
  ];

  manager.category('world', 'world related commands')
  // /localtime [hour] [minute]
  .add(new Command('localtime')
    .parameter('hour', 'number', 'hour (0-24)')
    .parameter('minute', 'number', 'minute (0-59)')
    .description('sets the local time. use /resetTime to reset it')
    if(!battleroyale.utils.isAdmin(player)) {
      return battleroyale.chat.send(player, "You're not allowed to use this command", battleroyale.config.colours.red);
    }
    .handler((player, hour, minute) => {
      if (hour < 0 || hour > 24 || minute < 0 || minute > 60) {
        return 'usage';
      }

      battleroyale.timeManager.setTimeForPlayer(player, hour, minute);
      player.battleroyale.custom_time_set = true;

      let formattedTime = battleroyale.utils.timeFormat(hour, minute);
      battleroyale.chat.send(player, `Set your time to ${formattedTime}.`, battleroyale.config.colours.command_success);
  }))

    // /weather [preset name]
    .add(new Command('weather')
        .parameter('weather', 'string', 'available presets: base, rain, overcast, thunderstorm, fog, snow', {
        hints: ['base', 'rain', 'overcast', 'thunderstorm', 'fog', 'snow'] })
        .description('sets the global weather preset')
        .timeout(180000)
        .handler((player, weather) => {
          if(!battleroyale.utils.isAdmin(player)) {
            return battleroyale.chat.send(player, "You're not allowed to use this command", battleroyale.config.colours.red);
          }
            const idx = weathers.indexOf(weather);
            if (idx === -1) {
                return 'usage';
            }

            // assign the weather to all players
            jcmp.players.forEach(p => {
                if (typeof p.battleroyale !== 'undefined' && p.battleroyale.custom_weather_set) {
                    return;
                }
                jcmp.events.CallRemote('battleroyale_set_weather', p, idx);
            });

            battleroyale.config.world.weather = idx;
            battleroyale.chat.broadcast(`${player.escapedNametagName} has set the weather to '${weather}'!`, battleroyale.config.colours.orange);
        }))


  // /localweather [preset name]
  .add(new Command('localweather')
    .parameter('weather', 'string', 'available presets: base, rain, overcast, thunderstorm, fog, snow', {
    hints: ['base', 'rain', 'overcast', 'thunderstorm', 'fog', 'snow'] })
    .description('sets the local weather preset')
    .handler((player, weather) => {
      if(!battleroyale.utils.isAdmin(player)) {
        return battleroyale.chat.send(player, "You're not allowed to use this command", battleroyale.config.colours.red);
      }
      const idx = weathers.indexOf(weather);
      if (idx === -1) {
        return 'usage';
      }

      player.battleroyale.custom_weather_set = true;
      jcmp.events.CallRemote('battleroyale_set_weather', player, idx);
      battleroyale.chat.send(player, `Set your weather to ${weather}.`, battleroyale.config.colours.command_success);
  }))

  .add(new Command('resettime')
    .description('resets your local time')
    .handler(player => {
      if(!battleroyale.utils.isAdmin(player)) {
        return battleroyale.chat.send(player, "You're not allowed to use this command", battleroyale.config.colours.red);
      }
      if (typeof player.battleroyale !== 'undefined' && player.battleroyale.custom_time_set) {
        player.battleroyale.custom_time_set = false;
        battleroyale.timeManager.updatePlayer(player);

        let formattedTime = battleroyale.utils.timeFormat(battleroyale.timeManager.hour, battleroyale.timeManager.minute);
        battleroyale.chat.send(player, `Resetting your time to ${formattedTime}`, battleroyale.config.colours.command_success);
      }
    }))

  .add(new Command('resetweather')
    .description('resets your local weather')
    .handler(player => {
      if(!battleroyale.utils.isAdmin(player)) {
        return battleroyale.chat.send(player, "You're not allowed to use this command", battleroyale.config.colours.red);
      }
      if (typeof player.battleroyale !== 'undefined' && player.battleroyale.custom_weather_set) {
        player.battleroyale.custom_weather_set = false;
        jcmp.events.CallRemote('battleroyale_set_weather', player, battleroyale.config.world.weather);

        battleroyale.chat.send(player, `Resetting your weather.`, battleroyale.config.colours.command_success);
      }
    }));
};
