'use strict';

const utility = require('../utility');

module.exports = function({ Command, manager }) {
  manager.category('world', 'world related commands')
    // /time [hour] [minute]
    .add(new Command('time')
      .parameter('hour', 'number', 'hour (0-24)')
      .parameter('minute', 'number', 'minute (0-59)')
      .timeout(180000)
      .description('sets the global time')
      .handler((player, hour, minute) => {
        if (hour < 0 || hour > 24 || minute < 0 || minute > 60) {
          return 'usage';
        }

        // assign the time to all players
        jcmp.players.forEach(p => {
          p.world.SetTime(hour, minute, 0);
        });
        mode.world.time.hour = hour;
        mode.world.time.minute = minute;

        chat.broadcast(`${player.name} has set the time to ${hour}:${minute}!`, mode.config.color.orange);
      }))

    // /weather [preset name]
    .add(new Command('weather')
      .parameter('weather', 'string', 'available presets: base, rain, overcast, thunderstorm, fog, snow', {
        hints: ['base', 'rain', 'overcast', 'thunderstorm', 'fog', 'snow'] })
      .timeout(180000)
      .description('sets the global weather preset')
      .handler((player, weather) => {
        // check for available weathers
        const available = [
          'base',
          'rain',
          'overcast',
          'thunderstorm',
          'fog',
          'snow'
        ];

        const idx = available.indexOf(weather);
        if (idx === -1) {
          return 'usage';
        }

        // assign the weather to all players
        jcmp.players.forEach(p => {
          p.world.weather = idx;
        });
        mode.world.weather = idx;

        chat.broadcast(`${player.name} has set the weather to '${weather}'!`, mode.config.color.orange);
      }))
};
