jcmp.events.Add("PlayerCreated", function(player) {

    player.escapedNametagName = player.name.replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 40);
    console.log(`${player.escapedNametagName} has joined.`);

    var color = battleroyale.utils.randomColor();
    player.battleroyale = {
        ingame: false,
        colour: color,
        colour_rgb: battleroyale.utils.hexToRGB(color),
        warning: false,
        timers: [] // Daranix's workaround version 
    }

});

jcmp.events.Add('PlayerDestroyed', function(player) {

    console.log(`${player.escapedNametagName} has left.`);

    // Daranix's workaround clearinterval / timer

    if(player.battleroyale.timers.length >= 1) {
        for(let timer in player.battleroyale.timers) {
            console.log(timer);
        }
    }

    if(player.battleroyale.ingame) {
        jcmp.events.Call('battleroyale_player_leave_game', player, true);
    } else {
        battleroyale.game.players.onlobby.removePlayer(player);
        jcmp.events.Call('battleroyale_update_needplayers');
    }

});

jcmp.events.Add('PlayerReady', function(player) {

    battleroyale.game.players.onlobby.push(player);
    player.respawnPosition = battleroyale.utils.randomSpawn(battleroyale.config.game.lobby.pos, battleroyale.config.game.lobby.radius / 2);
    player.Respawn();

    console.log("Player added to lobby list");
    console.log(" * " + battleroyale.game.players.onlobby.length + " on lobby waiting");

    jcmp.events.Call('battleroyale_update_needPlayers');

});

jcmp.events.Add('PlayerDeath', function(player, killer, reason) {

    if(player.battleroyale.ingame) {
        jcmp.events.Call('battleroyale_player_leave_game', player);
    }

    let killerName = 'the enviroment';
    if(killer != null) {
        killerName = killer.escapedNametagName;
    }
    
    jcmp.events.CallRemote('battleroyale_deathui_show', player, killerName);

    battleroyale.chat.send(player, "You die. Respawning in 5 seconds ...")

    const done = battleroyale.workarounds.watchPlayer(player, setTimeout(() => {
        done();
        // NOTE: The death UI hides automatically
        console.log("Respawning player");
        player.Respawn();
    }, 5000));

});