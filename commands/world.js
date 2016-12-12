'use strict';

const utility = require('../gm/utility');

module.exports = ({ Command, manager }) => {
  let globalWeather = 0;
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
    .handler((player, hour, minute) => {
      if (hour < 0 || hour > 24 || minute < 0 || minute > 60) {
        return 'usage';
      }

      player.world.SetTime(hour, minute, 0);
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
      const idx = weathers.indexOf(weather);
      if (idx === -1) {
        return 'usage';
      }

      // assign the weather to all players
      jcmp.players.forEach(p => {
        if (typeof p.battleroyale !== 'undefined' && p.battleroyale.custom_weather_set) {
          return;
        }
        p.world.weather = idx;
      });

      globalWeather = idx;
      battleroyale.chat.broadcast(`${player.escapedNametagName} has set the weather to '${weather}'!`, battleroyale.config.colours.orange);
  }))


  // /localweather [preset name]
  .add(new Command('localweather')
    .parameter('weather', 'string', 'available presets: base, rain, overcast, thunderstorm, fog, snow', {
    hints: ['base', 'rain', 'overcast', 'thunderstorm', 'fog', 'snow'] })
    .description('sets the local weather preset')
    .handler((player, weather) => {
      const idx = weathers.indexOf(weather);
      if (idx === -1) {
        return 'usage';
      }

      player.battleroyale.custom_weather_set = true;
      player.world.weather = idx;
      battleroyale.chat.send(player, `Set your weather to ${weather}.`, battleroyale.config.colours.command_success);
  }))

  .add(new Command('resettime')
    .description('resets your local time')
    .handler(player => {
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
      if (typeof player.battleroyale !== 'undefined' && player.battleroyale.custom_weather_set) {
        player.battleroyale.custom_weather_set = false;
        player.world.weather = globalWeather;

        battleroyale.chat.send(player, `Resetting your weather.`, battleroyale.config.colours.command_success);
      }
    }));
};
