
const playersCache = [];

function createCache(id, name, colour) {

    playersCache[id] = {
        id: id,
        name: name,
        colour: colour,
        colour_rgb: hex2rgba(colour),
        flags: {
            isAdmin: false
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
    
    return playersCache[id];
    
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

// Nametags
function RenderNametag(renderer, playerCache, distance) {

    if (typeof playerCache !== 'undefined') {
        let distscale = (distance * 2.4);

        // build the name metric if needed
        if (playerCache.nametag.textMetric === null) {

            const metric = renderer.MeasureText(playerCache.name, 100, 'Arial');
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
        renderer.DrawText(playerCache.name, playerCache.nametag.textPos, nameTagTextSize, playerCache.colour_rgb, 100, 'Arial');
        renderer.DrawText(playerCache.name, playerCache.nametag.shadowPos, nameTagTextSize, black, 100, 'Arial');
        
        /*
        // draw admin icon
        if (playerCache.flags.isAdmin) {
            renderer.DrawTexture(admin_icon.texture, playerCache.nametag.iconPos);
        }*/

        // draw health bar
        //renderer.DrawRect(playerCache.nametag.healthBarPos, new Vector2f(healthBarSize.x * Math.max((player.health / player.maxHealth), 0), healthBarSize.y), red);
        //renderer.DrawRect(playerCache.nametag.healthBarBackPos, healthBarSize, darkred);
        //renderer.DrawRect(playerCache.nametag.healthBarShadowPos, healthBarShadowSize, black);
    }
}

function hex2rgba(colour) {
    colour = colour.replace('#', '');

    const r = parseInt(colour.substring(0, 2), 16);
    const g = parseInt(colour.substring(2, 4), 16);
    const b = parseInt(colour.substring(4, 6), 16);

    return new RGBA(r, g, b, 255);
}


function dist(start, end) {
    return end.sub(start).length;
}

jcmp.events.Add('GameUpdateRender', (renderer) => {
    const cam = jcmp.localPlayer.camera.position;

    jcmp.players.forEach(player => {
        //if (!player.localPlayer) {
            const playerCache = playersCache[player.networkId];
            if (typeof playerCache !== 'undefined') {
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
        //}
    });
});


jcmp.events.AddRemoteCallable('battleroyale_ready', function(data) {

    data = JSON.parse(data);

    data.players.forEach(function(p) {
        jcmp.events.CallRemote('battleroyale_debug', 'Cached player with id' + p.id);
        createCache(p.id,p.name,p.colour)
    });

    

});

jcmp.events.AddRemoteCallable('battleroyale_player_created', function(data) {

    data = JSON.parse(data);
    //const playerCache = createCache(data.id, data.name, data.colour);
    createCache(data.id, data.name, data.colour);
});

jcmp.events.AddRemoteCallable('battleroyale_player_destroyed', function(networkId) {

    if(playersCache[networkId] !== null) {
        delete playersCache[networkId];
    }
});

jcmp.events.AddRemoteCallable('battleroyale_cachelist', function() {
    jcmp.events.CallRemote('battleroyale_debug', JSON.stringify(playersCache));
});

jcmp.events.CallRemote('battleroyale_clientside_ready');