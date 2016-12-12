'use strict';

events.Add("spawn_menu_try_spawn_vehicle", player => {
    if (typeof player.spawnedVehicle !== 'undefined') {
        player.spawnedVehicle.Destroy();
    }
});

events.Add("spawn_menu_vehicle_spawned", (player, vehicle) => {
    vehicle.primaryColor = battleroyale.utils.random(0, 60);
    player.spawnedVehicle = vehicle;
});

events.Add("spawn_menu_try_spawn_weapon", (player, hash) => {
    if (player.battleroyale.passiveMode) {
        battleroyale.chat.send(player, 'You cannot spawn weapons in /passive.', battleroyale.config.colours.red);
        return false;
    }
});

events.Add("spawnmenu_toggle_vehicle_attr", (player, nitrous, enabled) => {
    if (nitrous) {
        player.battleroyale.vehicle_nitro_toggled = enabled;

        if (typeof player.vehicle !== 'undefined') {
            player.vehicle.nitroEnabled = player.battleroyale.vehicle_nitro_toggled;
        }

        battleroyale.chat.send(player, `Vehicle nitro ${player.battleroyale.vehicle_nitro_toggled ? 'enabled' : 'disabled'}.`, battleroyale.config.colours.command_success);
    } else {
        player.battleroyale.vehicle_turbojump_toggled = enabled;

        if (typeof player.vehicle !== 'undefined') {
            player.vehicle.turboJumpEnabled = player.battleroyale.vehicle_turbojump_toggled;
        }

        battleroyale.chat.send(player, `Vehicle turbo jump ${player.battleroyale.vehicle_turbojump_toggled ? 'enabled' : 'disabled'}.`, battleroyale.config.colours.command_success);
    }
});
