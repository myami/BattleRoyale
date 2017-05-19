'use strict';
// UI
const ui = new WebUIWindow('battleroyale_ui', 'package://battleroyale/ui/index.html', new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));

ui.autoResize = true;
//Nametag
const up = new Vector3f(0, 1, 0);
const scaleFactor = new Vector3f(0.0001, 0.0001, 0.0001);
const minScale = new Vector3f(0.001, 0.001, 0.001);
const maxScale = new Vector3f(0.008, 0.008, 0.008);
const maxScaleGroup = new Vector3f(0.014, 0.014, 0.014);
const nameTagTextSize = new Vector2f(100000, 1000000);
// colours
const white = new RGBA(255, 255, 255, 255);
const black = new RGBA(0, 0, 0, 255);
const red = new RGBA(255, 0, 0, 255);
const darkred = new RGBA(40, 0, 0, 255);
const playersCache = [];
//POI
let pois = [];
// player
let playeringame = false;
let centerc = new Vector3f(0, 0, 0);
jcmp.localPlayer.healthEffects.regenRate = 0;
// function
function createCache(id, name, colour) {
    playersCache[id] = {
        id: id,
        name: name,
        colour: colour,
        colour_rgb: hex2rgba(colour),
        isAdmin: false,
        nametag: {
            textMetric: null,
            textPos: null,
            shadowPos: null,
            iconPos: null,

        }
    };
    return playersCache[id];
}

function hex2rgba(colour) {
    colour = colour.replace('#', '');
    const r = parseInt(colour.substring(0, 2), 16);
    const g = parseInt(colour.substring(2, 4), 16);
    const b = parseInt(colour.substring(4, 6), 16);
    return new RGBA(r, g, b, 255);
}

function GetDistanceBetweenPoints(v1, v2) {
        let dx = v1.x - v2.x;
        let dy = v1.y - v2.y;
        let dz = v1.z - v2.z;

        return Math.sqrt( dx * dx + dy * dy + dz * dz );
    }

function GetDistanceBetweenPointsXY(v1, v2) {
      let v13f = new Vector3f(v1.x, v1.y, 0.0);
      let v14f = new Vector3f(v2.x, v2.y, 0.0);
      return GetDistanceBetweenPoints(v13f, v14f);
    }

function IsPointInCircle(v1, v2, radius) {
      if(GetDistanceBetweenPointsXY(v1, v2) <= radius) return true;
      return false;
    }


    jcmp.events.AddRemoteCallable('outarea_toggle',function(toggle) {
      jcmp.ui.CallEvent('outarea_toggle', toggle);
  });

  jcmp.events.AddRemoteCallable('battleroyale_player_created', function(data) {
    data = JSON.parse(data);
    const playerCache = createCache(data.id, data.name, data.colour);
    playerCache.isAdmin = data.isAdmin;
    playersCache[data.id] = playerCache;
  });

  jcmp.events.AddRemoteCallable('battleroyale_Brgame_client', function(data,id) {
    let datapoiserver = [];
    datapoiserver = JSON.parse(data);
    for (let i = 0; i < datapoiserver.length; i++) {
    var  bposition = datapoiserver[i];
    const poi = new POI(10,new Vector3f(bposition.x,bposition.y,bposition.z));
    poi.minDistance = 10.0;
    poi.maxDistance = 100000.0;
    poi.clampedToScreen = false;
    poi.text = "Weapon";
    poi.weapongive = true;
    poi.dimension = id;//BRGame.id
    pois[bposition.id] = poi;
    }
  });

  jcmp.events.AddRemoteCallable('battleroyale_POI_Delete', function(data) {
      pois.forEach(poi => {
      poi.Destroy();
      })
      pois = [];
    });

    jcmp.events.AddRemoteCallable('battleroyale_playeringame_true', function() {
      playeringame = true ;
    });

    jcmp.events.AddRemoteCallable('battleroyale_playeringame_false', function() {
      playeringame = false ;
    });


function battleroyale_check_poi(){
    if (playeringame){
    pois.forEach(poi => {
    if (poi.weapongive){
           if(IsPointInCircle(jcmp.localPlayer.position, poi.position, 10)) // 10 is the distance of the radius aroud each object
           {
               jcmp.events.CallRemote('battleroyale_random_weapon');
               poi.Destroy();
               poi.weapongive = false;
            }
        }
    })
  }
};

  jcmp.events.AddRemoteCallable('battleroyale_distance_player_center_server', function(center) {
    //calcul distance between player and center of the area

    let c = JSON.parse(center);
    centerc = new Vector3f(c.x, c.y, c.z);

});

  jcmp.events.Add('battleroyale_distance_player_center', function() {
    //calcul distance between player and center of the area
      if (playeringame){
        jcmp.ui.CallEvent('battleroyale_distance_update',GetDistanceBetweenPointsXY(jcmp.localPlayer.position,centerc));
          }
        });

  jcmp.events.AddRemoteCallable('battleroyale_radius_client', function(radiusclient) {
        //send to the client the radius of the battle
        let radius = 0;
        radius = radiusclient;
        jcmp.ui.CallEvent('battleroyale_radius_update',radius);
      });

    jcmp.events.AddRemoteCallable('battleroyale_outarea_timer_client', function(timer) {
        let times = 60;
        times = timer;
        jcmp.ui.CallEvent('battleroyale_outarea_timer_html',times);
      });

      jcmp.events.AddRemoteCallable('battleroyale_UI_Show', function() {
        jcmp.ui.CallEvent('limitareavisible',true);
      });

      jcmp.events.AddRemoteCallable('battleroyale_UI_Hide', function() {
        jcmp.ui.CallEvent('limitareavisible',false);
      });

      jcmp.events.AddRemoteCallable('battleroyale_deathui_show', () => {
        jcmp.ui.CallEvent('battleroyale_deathui_toggle', true);
      });

      jcmp.events.AddRemoteCallable('battleroyale_deathui_hide', () => {
        jcmp.ui.CallEvent('battleroyale_deathui_toggle', false);
      });

      jcmp.events.Add('GameTeleportInitiated', () => {
        jcmp.events.CallRemote('battleroyale_player_spawning');
      });

      jcmp.events.Add('GameTeleportCompleted', () => {
        jcmp.events.CallRemote('battleroyale_player_spawned');
      });

      jcmp.ui.AddEvent('battleroyale_ready', () => {
        jcmp.events.CallRemote('battleroyale_UI_ready');
      });

      jcmp.events.AddRemoteCallable('battleroyale_set_time', (hour, minute) => {
        jcmp.world.SetTime(hour, minute, 0);
      });

      jcmp.events.AddRemoteCallable('battleroyale_set_weather', weather => {
        jcmp.world.weather = weather;
      });

      jcmp.events.AddRemoteCallable('battleroyale_player_destroyed', (networkId) => {
        if (playersCache[networkId] !== null)
        delete playersCache[networkId];
      });

      jcmp.events.AddRemoteCallable('battleroyale_die_client_appear', (kill) => {
        jcmp.ui.CallEvent('battleroyale_die_update', kill);
        jcmp.ui.CallEvent('battleroyale_die_list', true);
      });

      jcmp.events.AddRemoteCallable('battleroyale_die_client_remove', () => {
        jcmp.ui.CallEvent('battleroyale_die_list', false);
      });

      jcmp.events.AddRemoteCallable('battleroyale_playerneed_client', (data) => {
        let playersneed = 0;
        let c = JSON.parse(data);
        playersneed = c.need - c.ingame ;
        jcmp.ui.CallEvent('battleroyale_playerneed_launch', playersneed);
      });


jcmp.events.AddRemoteCallable('battleroyale_area_reduced_client_true', () => {
  jcmp.ui.CallEvent('battleroyale_area_reduced', true);
});
jcmp.events.AddRemoteCallable('battleroyale_area_reduced_client_false', () => {
  jcmp.ui.CallEvent('battleroyale_area_reduced', false);
});

jcmp.events.AddRemoteCallable('battleroyale_winner_client_true', () => {
  jcmp.ui.CallEvent('battleroyale_winner_toggle', true);
});
jcmp.events.AddRemoteCallable('battleroyale_winner_client_false', () => {
  jcmp.ui.CallEvent('battleroyale_winner_toggle', false);
});
jcmp.events.AddRemoteCallable('battleroyale_winner_client_name', (playername) => {
  jcmp.ui.CallEvent('battleroyale_win_playername', playername);
});

jcmp.events.AddRemoteCallable('battleroyale_winner_client_true_all', () => {
  jcmp.ui.CallEvent('battleroyale_winner_toggleforall', true);
});
jcmp.events.AddRemoteCallable('battleroyale_winner_client_false_all', () => {
  jcmp.ui.CallEvent('battleroyale_winner_toggleforall', false);
});





// end of Basics

//Admin icon start
const admin_icon = new WebUIWindow('battleroyale_admin_icon', 'package://battleroyale/ui/icon.html', new Vector2(41, 42));
admin_icon.autoRenderTexture = false;


function RenderNametag(renderer, playerCache, distance,player) {
    if (typeof playerCache !== 'undefined') {
        let distscale = (distance * 2.4);
        // build the name metric if needed
        if (playerCache.nametag.textMetric === null) {
            const metric = renderer.MeasureText(playerCache.name, 100, 'Arial');
            playerCache.nametag.textMetric = metric;
            playerCache.nametag.textPos = new Vector3f(-(metric.x / 2), -400, 0);
            playerCache.nametag.shadowPos = new Vector3f(-(metric.x / 2) + 5, -395, 1);
            playerCache.nametag.iconPos = new Vector3f(-(metric.x / 2) - 100, -363, 0);

        }
        if (distscale >= 350) {
            distscale = 350;
        }
        // adjust position based on distance
        playerCache.nametag.textPos.y = (-400 + distscale);
        playerCache.nametag.shadowPos.y = (-395 + distscale);




        // draw player name
        renderer.DrawText(playerCache.name, playerCache.nametag.textPos, nameTagTextSize, playerCache.colour_rgb, 100, 'Arial');
        renderer.DrawText(playerCache.name, playerCache.nametag.shadowPos, nameTagTextSize, black, 100, 'Arial');
        if(playerCache.isAdmin) {
          renderer.DrawTexture(admin_icon.texture, playerCache.nametag.iconPos);
        }


    }
}




function dist(start, end) {
    return end.sub(start).length;
}
let myplayer = null;
/* same as myplayer
let networkplayerid ;
for (let i = 0; i < jcmp.players.length; i++) {
  if (jcmp.localPlayer.networkId == jcmp.player[i].networkId){
    networkplayerid = jcmp.players[i];
  }
}
*/
let cachedPlayer = null;
jcmp.events.Add('GameUpdateRender', (renderer) => {
    const cam = jcmp.localPlayer.camera.position;

   jcmp.players.forEach(player => {

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
      })

        if (myplayer != null ){
            jcmp.ui.CallEvent('battleroyale_healthbar_update', (myplayer.health / myplayer.maxHealth));
        } else {
           myplayer = jcmp.players.find(p => p.networkId == jcmp.localPlayer.networkId);
        }

        jcmp.events.Call('battleroyale_distance_player_center');
        battleroyale_check_poi();
    });
