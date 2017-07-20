console.log(" ---------------- Nametags loaded");

jcmp.events.Add('PlayerCreated', function(player) {

    var dsend = {
        id: player.networkId,
        name: player.escapedNametagName,
        colour: player.battleroyale.colour
    };

    jcmp.events.CallRemote('battleroyale_player_created', null, JSON.stringify(dsend));
})

jcmp.events.Add('PlayerDestroyed', function(player) {
    jcmp.events.CallRemote('battleroyale_player_destroyed', null, player.networkId);
});

jcmp.events.AddRemoteCallable('battleroyale_debug', function(player, text) {
    console.log(text);
});

jcmp.events.AddRemoteCallable('battleroyale_clientside_ready', function(player) {
    
    const data = {
        players: jcmp.players.map(p => ({
            id: p.networkId,
            name: p.escapedNametagName,
            colour: p.battleroyale.colour
        }))
    };

    console.log(data);

    jcmp.events.CallRemote('battleroyale_ready', player, JSON.stringify(data));

});

