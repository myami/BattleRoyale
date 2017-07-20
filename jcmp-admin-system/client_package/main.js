
var localPlayerEx = {}; // Local Player extended

jcmp.ui.AddEvent('adminsys_doAction', function(action, argsData) {
  jcmp.events.CallRemote('adminsys_server_doAction', action, argsData);
});


jcmp.events.AddRemoteCallable('adminsys_ready', function(data) {

    var pLocal = JSON.parse(data);

    if(pLocal.admin.rank >= 1) {
      const adminui = new WebUIWindow('adminsys_adminui', 'package://jcmp-adminsys/ui/adminui.html', new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
      adminui.autoResize = true;
    }

    localPlayerEx = pLocal;

    //jcmp.ui.CallEvent('adminsys/ui/updateInfo/localPlayer', data);

});


// AdminUI Ready

jcmp.ui.AddEvent('adminsys/client/adminui_ready', function() {
  jcmp.ui.CallEvent('adminsys/ui/updateInfo/localPlayer', JSON.stringify(localPlayerEx));
  jcmp.events.CallRemote('adminsys/client/req/update_banlist');
});

// Toggle ui

jcmp.events.AddRemoteCallable('adminsys_toggle_adminui', function(status) {
  jcmp.ui.CallEvent('adminsys/ui/adminui_toggle');
});

// Update player list

jcmp.ui.AddEvent('adminsys/client/request_update_playerList', function() {
  jcmp.events.CallRemote('adminsys/server/client_request_update_playerList');
});

jcmp.events.AddRemoteCallable('adminsys/client/response_update_playerList', function(String_playerList) {
  jcmp.ui.CallEvent('adminsys/ui/response_update_playerList', String_playerList)
});

// Update ban players list

jcmp.ui.AddEvent('adminsys/client/req/update_banlist', function() {
  jcmp.events.CallRemote('adminsys/client/req/update_banlist');
});

jcmp.events.AddRemoteCallable('adminsys/server/res/update_banlist', function(data) {
  jcmp.ui.CallEvent('adminsys/ui/update_banlist', data);
});

jcmp.ui.AddEvent('adminsys/client/searchBanPlayer', function(data) { // Request search player ban
  jcmp.events.CallRemote('adminsys/server/searchBanPlayer', data);
});

// Spawn things

jcmp.ui.AddEvent('adminsys/client/spawnVehicle', function(hash) {
  jcmp.events.CallRemote('adminsys/server/spawnVehicle', hash)
});
