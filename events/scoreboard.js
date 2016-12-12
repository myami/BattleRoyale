'use strict';

events.AddRemoteCallable("battleroyale_ready", player => {
    const data = {
        serverName: '', //events.Call('masterlist.config')[0].displayName,
        players: jcmp.players.map(p => ({
            id: p.networkId,
            name: p.escapedNametagName,
            colour: p.battleroyale.colour,
            kills: p.battleroyale.kills,
            deaths: p.battleroyale.deaths,
            passiveMode: p.battleroyale.passiveMode,
            isNanosOfficial: events.Call("is_nanos_official", p.client.steamId)[0],
        }))
    };

    events.CallRemote("battleroyale_init", player, JSON.stringify(data));
});
