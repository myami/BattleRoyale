'use strict';

jcmp.events.Add('chat_message', (player, message) => {
    if (typeof player.battleroyale === 'undefined')
        return `${player.escapedNametagName}: ${message}`;

    console.log(`${player.escapedNametagName}: ${message}`);
    //return `${battleroyale.utils.isAdmin(player) ? '<div class="admin-logo"></div>' : ''}[${player.battleroyale.colour}] ${player.escapedNametagName}[#FFFFFF]: ${message}`;
    //return `[${player.battleroyale.colour}] ${player.escapedNametagName}[#FFFFFF]: ${message}`;

    var message = `[${player.battleroyale.colour}] ${player.escapedNametagName}[#FFFFFF]: ${message}`;
    if (battleroyale.utils.isAdmin(player)) {
        message = '[Admin]' + message;
    }


    console.log(message);

    return message;
});