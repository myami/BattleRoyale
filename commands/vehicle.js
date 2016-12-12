'use strict';

module.exports = ({ Command, manager }) => {
  manager.category('vehicle', 'vehicle commands')
    .add(new Command(['color', 'colour'])
      .parameter('colour', 'number', 'vehicle colour')
      .description('changes your vehicle colour')
      .handler((player, colour) => {
        if (typeof player.vehicle === 'undefined') {
          battleroyale.chat.send(player, 'You must be in a vehicle to use this command.', battleroyale.config.colours.command_fail);
          return;
        }

        battleroyale.chat.send(player, `Setting your vehicles colour to ${colour}.`, battleroyale.config.colours.command_success);
        player.vehicle.primaryColor = colour;
    }))
};
