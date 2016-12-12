'use strict';

var ui = new WebUIWindow("battleroyale_ui", "package://battleroyale/ui/index.html", new Vector2(viewportSize.x, viewportSize.y));
ui.autoResize = true;

const playersCache = [];
function createCache(id, name, colour) {
    playersCache[name] = {
        id: id,
        name: name,
        colour: colour,
        colour_rgb: hex2rgba(colour),
        stats: {
            kills: 0,
            deaths: 0
        },
        flags: {
            passiveMode: false,
            isNanosOfficial: false,
            isInMyGroup: false
        },
        nametag: {
            textMetric: null,
            textPos: null,
            shadowPos: null,
            iconPos: null,
            healthBarPos: null,
            healthBarBackPos: null,
            healthBarShadowPos: null
        }
    };

    return playersCache[name];
}

function getPlayerCache(networkId) {
    for (let item in playersCache) {
        if (playersCache[item].id === networkId) {
            return playersCache[item];
        }
    }

    return null;
}

//
const up = new Vector3f(0, 1, 0);
const scaleFactor = new Vector3f(0.0001, 0.0001, 0.0001);
const minScale = new Vector3f(0.001, 0.001, 0.001);
const maxScale = new Vector3f(0.008, 0.008, 0.008);
const maxScaleGroup = new Vector3f(0.014, 0.014, 0.014);

// colours
const white = new RGBA(255, 255, 255, 255);
const black = new RGBA(0, 0, 0, 255);
const red = new RGBA(255, 0, 0, 255);
const darkred = new RGBA(40, 0, 0, 255);

// nametags
const nameTagTextSize = new Vector2f(100000, 1000000);
const healthBarSize = new Vector2f(394, 14);
const healthBarPos = new Vector3f(-(healthBarSize.x / 2), -277, 0);
const healthBarBackPos = new Vector3f(-(healthBarSize.x / 2), -277, 0.05);
const healthBarShadowSize = new Vector2f(400, 20);
const healthBarShadowPos = new Vector3f(-(healthBarShadowSize.x / 2), -280, 0.1);

function hex2rgba(colour) {
    colour = colour.replace('#', '');

    const r = parseInt(colour.substring(0, 2), 16);
    const g = parseInt(colour.substring(2, 4), 16);
    const b = parseInt(colour.substring(4, 6), 16);

    return new RGBA(r, g, b, 255);
}

jcmp.ui.AddEventHandler("battleroyale_ready", () => {
    events.CallRemote("battleroyale_ready");
});

events.AddRemoteCallable("battleroyale_init", (data) => {
    data = JSON.parse(data);

    jcmp.ui.BroadcastEvent("battleroyale_server_name", data.serverName);

    data.players.forEach(p => {
        const playerCache = createCache(p.id, p.name, p.colour);
        playerCache.stats.kills = p.kills;
        playerCache.stats.deaths = p.deaths;
        playerCache.flags.passiveMode = p.passiveMode;
        playerCache.flags.isNanosOfficial = p.isNanosOfficial;

        jcmp.ui.BroadcastEvent("battleroyale_scoreboard_addplayer", JSON.stringify({
            id: p.id,
            name: p.name,
            colour: p.colour,
            kills: p.kills,
            deaths: p.deaths,
            isNanosOfficial: p.isNanosOfficial
        }));
    });

    jcmp.ui.BroadcastEvent("battleroyale_initialised");
});

events.AddRemoteCallable("battleroyale_player_created", (data) => {
    data = JSON.parse(data);

    const playerCache = createCache(data.id, data.name, data.colour);
    playerCache.flags.isNanosOfficial = data.isNanosOfficial;

    jcmp.ui.BroadcastEvent("battleroyale_scoreboard_addplayer", JSON.stringify({
        id: data.id,
        name: data.name,
        colour: data.colour,
        kills: 0,
        deaths: 0,
        isNanosOfficial: data.isNanosOfficial
    }));
});

events.AddRemoteCallable("battleroyale_player_destroyed", (networkId) => {
    jcmp.ui.BroadcastEvent("battleroyale_scoreboard_removeplayer", networkId);

    let cache = getPlayerCache(networkId);
    if (cache !== null) {
        delete playersCache[cache.name];
    }
});

events.AddRemoteCallable("battleroyale_deathui_show", (killer_name, death_message) => {
    jcmp.ui.BroadcastEvent("battleroyale_deathui_toggle", true, killer_name, death_message);
});

events.AddRemoteCallable("battleroyale_deathui_hide", () => {
    jcmp.ui.BroadcastEvent("battleroyale_deathui_toggle", false, "");
});

events.AddRemoteCallable("battleroyale_player_death", (data) => {
    data = JSON.parse(data);

    let cache = getPlayerCache(data.player.networkId);
    if (cache !== null) {
        jcmp.ui.BroadcastEvent("battleroyale_scoreboard_updateplayer", data.player.networkId, data.player.kills, data.player.deaths);
        cache.stats.kills = data.player.kills;
        cache.stats.deaths = data.player.deaths;
    }

    if (typeof data.killer !== "undefined") {
        cache = getPlayerCache(data.killer.networkId);
        if (cache !== null) {
            jcmp.ui.BroadcastEvent("battleroyale_scoreboard_updateplayer", data.killer.networkId, data.killer.kills, data.killer.deaths);
            cache.stats.kills = data.killer.kills;
            cache.stats.deaths = data.killer.deaths;
        }
    }

    jcmp.ui.BroadcastEvent("battleroyale_player_death", data.player.networkId, typeof data.killer !== "undefined" ? data.killer.networkId : data.player.networkId, data.death_reason);
});

// Spawn Protection
events.Add("GameTeleportInitiated", () => {
    events.CallRemote("battleroyale_player_spawning");
    jcmp.ui.BroadcastEvent("battleroyale_spawn_protection", true);
});

events.Add("GameTeleportCompleted", () => {
    events.CallRemote("battleroyale_player_spawned");
});

events.AddRemoteCallable("battleroyale_spawn_protect_done", () => {
    jcmp.ui.BroadcastEvent("battleroyale_spawn_protection", false);
});

// TEMP TEXTURE RENDER
var nanos_icon = new WebUIWindow("battleroyale_nanos_icon", "package://battleroyale/ui/icon.html", new Vector2(64, 65));
nanos_icon.autoRenderTexture = false;

const passiveModeText = "(passive mode)";
const passiveModeTextSize = new Vector2f(80000, 800000)
let passiveModeTextMetric = null;
let passiveModeTextPos = null;

// Nametags
function RenderNametag(renderer, playerCache, distance) {
    if (playerCache !== null) {
        let distscale = (distance * 2.4);

        // build the name metric if needed
        if (playerCache.nametag.textMetric === null) {
            const metric = renderer.MeasureText(playerCache.name, 100, "Arial");
            playerCache.nametag.textMetric = metric;
            playerCache.nametag.textPos = new Vector3f(-(metric.x / 2), -400, 0);
            playerCache.nametag.shadowPos = new Vector3f(-(metric.x / 2) + 5, -395, 1);
            playerCache.nametag.iconPos = new Vector3f(-(metric.x / 2) - 100, -363, 0);
            //playerCache.nametag.healthBarPos = new Vector3f(-(healthBarSize.x / 2), -277, 0);
            //playerCache.nametag.healthBarBackPos = new Vector3f(-(healthBarSize.x / 2), -277, 0.05);
            //playerCache.nametag.healthBarShadowPos = new Vector3f(-(healthBarShadowSize.x / 2), -280, 0.1);
        }

        if (distscale >= 350) {
            distscale = 350;
        }

        // adjust position based on distance
        playerCache.nametag.textPos.y = (-400 + distscale);
        playerCache.nametag.shadowPos.y = (-395 + distscale);
        playerCache.nametag.iconPos.y = (-363 + distscale);
        //playerCache.nametag.healthBarPos.y = (-277 + distscale);
        //playerCache.nametag.healthBarBackPos.y = (-277 + distscale);
        //playerCache.nametag.healthBarShadowPos.y = (-280 + distscale);

        // draw player name
        renderer.DrawText(playerCache.name, playerCache.nametag.textPos, nameTagTextSize, playerCache.colour_rgb, 100, "Arial");
        renderer.DrawText(playerCache.name, playerCache.nametag.shadowPos, nameTagTextSize, black, 100, "Arial");

        // draw nanos icon
        if (playerCache.flags.isNanosOfficial) {
            renderer.DrawTexture(nanos_icon.texture, playerCache.nametag.iconPos);
        }

        // draw health bar
        //if (!playerCache.flags.passiveMode) {
            //renderer.DrawRect(playerCache.nametag.healthBarPos, new Vector2f(healthBarSize.x * Math.max((player.health / player.maxHealth), 0), healthBarSize.y), red);
            //renderer.DrawRect(playerCache.nametag.healthBarBackPos, healthBarSize, darkred);
            //renderer.DrawRect(playerCache.nametag.healthBarShadowPos, healthBarShadowSize, black);
        //} else {
            // draw passive text
        //}
    }

    /*
    if (!passiveModeTextMetric) {
        passiveModeTextMetric = renderer.MeasureText(passiveModeText, 80, "Arial");
        passiveModeTextPos = {
            pos: new Vector3f(-passiveModeTextMetric.x / 2, -277, 0),
            shadowPos: new Vector3f(-passiveModeTextMetric.x / 2, -272, 1),
        };
    }

    renderer.DrawText(passiveModeText, passiveModeTextPos.pos, passiveModeTextSize, playerNametagsColour[playerName] ? playerNametagsColour[playerName] : white, 80, "Arial");
    renderer.DrawText(passiveModeText, passiveModeTextPos.shadowPos, passiveModeTextSize, black, 80, "Arial");
    */
}

function dist(start, end) {
    return end.sub(start).length;
}

let cachedPlayer = null;
events.Add("GameUpdateRender", (renderer) => {
    const cam = localPlayer.camera.position;

    players.forEach(player => {
        if (!player.localPlayer) {
            const playerCache = playersCache[player.name];
            if (playerCache !== null && typeof playerCache !== 'undefined') {
                let head = player.GetBoneTransform(0xA877D9CC, renderer.dtf);

                const d = dist(head.position, cam);
                let scale = new Vector3f(d, d, d).mul(scaleFactor);
                if (scale.x >= maxScaleGroup.x) {
                    scale = maxScaleGroup;
                } else if (scale.x <= minScale.x) {
                    scale = minScale;
                }

                const mat = head.LookAt(head.position, cam, up).Scale(scale);
                renderer.SetTransform(mat);

                RenderNametag(renderer, playerCache, d);
            }
        }
    });
});
