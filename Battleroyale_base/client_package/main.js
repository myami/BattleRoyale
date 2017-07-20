// TODO LIST
// TODO: Disable/change the health regen on the start on the battle boost on wingsuit and grapel
// TODO: Random weather on the arena
// NOTE: Group all the things on the client side UI's etc etc ...

// Loadscreen UI
try {

var loadScreenUI = new WebUIWindow("Battleroyale LoadScreen", "package://battleroyale/ui/loadscreen.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
loadScreenUI.autoResize = true;
loadScreenUI.captureMouseInput = false;

jcmp.events.Add('GameTeleportCompleted', function() {
    jcmp.ui.CallEvent('battleroyale_loadscreen_toggle', false);
});

jcmp.events.Add('GameTeleportInitiated', function() {
    jcmp.ui.CallEvent('battleroyale_loadscreen_toggle', true);
})

// HEALTHBAR ---

var healthBarUI = new WebUIWindow("Battleroyale Healthbar", "package://battleroyale/ui/healthbar.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
healthBarUI.autoResize = true;
healthBarUI.captureMouseInput = false;

jcmp.events.AddRemoteCallable('battleroyale_healthbar_update', function(data) {
    jcmp.ui.CallEvent('battleroyale_healthbar_update', data);
});

// ------------------ INFO TEXT --------------------- //

var infoTextUI = new WebUIWindow("Battleroyale screen text", "package://battleroyale/ui/inscreenText.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
infoTextUI.autoResize = true;
infoTextUI.captureMouseInput = false;

jcmp.events.AddRemoteCallable('battleroyale_txt_general', function(text, hideTimeMS) {
    jcmp.ui.CallEvent('battleroyale_txt_general', text, hideTimeMS);
});

jcmp.events.AddRemoteCallable('battleroyale_txt_leftplayers_toggle', function(status) {
    jcmp.ui.CallEvent('battleroyale_txt_leftplayers_toggle', status);
});

jcmp.events.AddRemoteCallable('battleroyale_txt_timeleft_toggle', function(status) {
    jcmp.ui.CallEvent('battleroyale_txt_timeleft_toggle', status);
    
});

jcmp.events.AddRemoteCallable('battleroyale_txt_timerStart', function(start) {
    jcmp.ui.CallEvent('battleroyale_txt_timerStart', start);
})

jcmp.events.AddRemoteCallable('battleroyale_txt_needPlayers', function(need) {
    jcmp.ui.CallEvent('battleroyale_txt_needPlayers', need);
});

jcmp.events.AddRemoteCallable('battleroyale_txt_updateTime', function(ms) {
    jcmp.ui.CallEvent('battleroyale_txt_updateTime', ms);
});

jcmp.ui.AddEvent('battleroyale_txt_ready', function() {
    jcmp.events.CallRemote('battleroyale_txt_ready');
});

jcmp.events.Add("battleroyale_txt_gameleftplayers_setnpstart", function(npstart) {
    jcmp.ui.CallEvent("battleroyale_txt_gameleftplayers_setnpstart", npstart);
});

jcmp.events.AddRemoteCallable('battleroyale_txt_gameleftplayers_show', function(nleft) {
    jcmp.ui.CallEvent('battleroyale_txt_gameleftplayers_show', nleft);
})

// --------------------- DEATH UI ---------------- //

var deathUI = new WebUIWindow("Battleroyale deathui", "package://battleroyale/ui/deathui.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
deathUI.autoResize = true;
deathUI.captureMouseInput = false;

jcmp.events.AddRemoteCallable('battleroyale_deathui_show', function(killerName) {
    jcmp.ui.CallEvent('battleroyale_deathui_show', killerName);
});

jcmp.events.CallRemote('battleroyale_debug', 'DeathUI LOADED');

//  --------------------- Area circle texture render ----------------- //

const border = new WebUIWindow("Battleroyale - border area texture", "package://battleroyale/ui/border.html", new Vector2(1000, 1000));
border.autoRenderTexture = false;
border.autoResize = false;
border.captureMouseInput = false;
border.hidden = true;

var lplayer = {
    ingame: false
};

let center = new Vector3f(0,0,0);
let m = CreateNewBorderMatrix();
let delta = 0;
let diameter = new Vector2f(0,0);
let shrink_border = false;
let shrink_size = 0;
let maxY = 0;

jcmp.events.AddRemoteCallable('battleroyale_client_gameStart', function(data) {

    //jcmp.events.CallRemote('battleroyale_debug', data);

    

    data = JSON.parse(data);
    jcmp.events.Call('battleroyale_txt_gameleftplayers_setnpstart', data.npstart);
    
    maxY = data.maxY;
    center = new Vector3f(data.center.x, data.center.y, data.center.z);
    diameter = new Vector2f(data.diameter, data.diameter);
    m = CreateNewBorderMatrix();

    // DIAMETER = AREA SIZE

    lplayer.ingame = true;

    // Disable lobby static text

    jcmp.ui.CallEvent('battleroyale_txt_timerStart', false);
    jcmp.ui.CallEvent('battleroyale_txt_leftplayers_toggle', false);
    renderBarrels = data.spawnWeaponsRenderPoints.map(b => ({
        position: new Vector3f(b.position.x, b.position.y, b.position.z)
    }));

    //jcmp.events.CallRemote('battleroyale_debug', JSON.stringify(renderBarrels));
    
});

jcmp.events.AddRemoteCallable('battleroyale_render_setColor', function(color) {
    jcmp.ui.CallEvent('battleroyale_render_setColor', color);
});

jcmp.events.AddRemoteCallable('battleroyale_client_gameEnd', function() {
    lplayer.ingame = false;
});


jcmp.events.AddRemoteCallable('battleroyale_render_updateDiameter', function(newDiameter, newCenter) {
    newCenter = JSON.parse(newCenter);
    center = new Vector3f(newCenter.x, newCenter.y, newCenter.z);
    diameter = new Vector2f(newDiameter, newDiameter);
    m = CreateNewBorderMatrix();
});

function RenderCircle(renderer, texture, translation, size)
{
    renderer.DrawTexture(texture, translation, size);
}

function CreateNewBorderMatrix()
{
    let m2 = new Matrix().Translate(center);
    m2 = m2.Rotate(Math.PI / 2, new Vector3f(1, 0, 0));
    return m2;
}


// WORK IN PROGRESS 

const barrelTextureUI = new WebUIWindow("Barrel","package://battleroyale/ui/barrel.html", new Vector2(1405, 1405));
//const barrelTexture = new Texture("package://battleroyale/ui/img/barrel.png");
barrelTextureUI.autoRenderTexture = false;
const barrelTexture = barrelTextureUI.texture;

var renderBarrels = [];

// RENDER CICRLES

function RenderBarrels(renderer) {

    //jcmp.events.CallRemote("battleroyale_debug", "Rendering barrel");
    let barrel, barrelPos, m;
    for (let i = 0; i < renderBarrels.length; i++) {
        barrel = renderBarrels[i];
        barrelPos = new Vector3f(barrel.position.x, barrel.position.y + 1.74, barrel.position.z);
        //barrelPos.y += 1.5;
        m = new Matrix().Translate(barrelPos);
        //m = m.Rotate(0.082, new Vector3f(0,1,0));
        m = m.LookAt(barrelPos, jcmp.localPlayer.camera.position, new Vector3f(0, 1, 0));
        renderer.SetTransform(m);
        renderer.DrawTexture(barrelTexture, new Vector3f(0,0,0), new Vector2f(1.8, 1.8));
        //jcmp.events.CallRemote('battleroyale_debug', 'Rendeing barrel ' + JSON.stringify(barrelPos));
    }
}

jcmp.events.AddRemoteCallable('battleroyale_render_barrels', function(barrels) {
    //jcmp.events.CallRemote('battleroyale_debug', barrels);
    renderBarrels = JSON.parse(barrels).map(b => ({
        position: new Vector3f(b.position.x, b.position.y, b.position.z)
    }));
    //jcmp.events.CallRemote('battleroyale_debug', JSON.stringify(renderBarrels));
});


jcmp.events.Add("GameUpdateRender", function(renderer) {

        try {
        RenderBarrels(renderer);
    } catch(err) {
        jcmp.events.CallRemote('battleroyale_debug', err.message)
    }
    
    if(!lplayer.ingame) {
        return;
    }
    
    renderer.SetTransform(m);
    const max_circles = 10;
    const max_delta = maxY;
    for (let i = 1; i <= max_circles; i++)
    {
        let d = delta + (max_delta / max_circles) * i;
        if (d > max_delta)
        {
            d -= max_delta;
        }
        RenderCircle(renderer, border.texture, new Vector3f(-diameter.x / 2, -diameter.x / 2, d), diameter);
    }
    delta += 1 / 2;
    if (delta > max_delta)
    {
        delta = 0;
    }
    if (shrink_border)
    {
        let new_size = (diameter.x > shrink_size) ? diameter.x - 0.75 : shrink_size;
        diameter = new Vector2f(new_size, new_size);
    }



});

// Loadscreen is the first thing to load but always when is visible, should be on the front
loadScreenUI.BringToFront();
} catch(err) {
 jcmp.events.CallRemote('battleroyale_debug', `CLIENTSIDE ERROR: ${err.message} on line: ${err.lineNumber}`);  
}