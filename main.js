'use strict';

function Query(port) {
    let http = require('http');

    //We need a function which handles requests and send response
    function handleRequest(request, response){
        let param = request.url.split("/");
        let action = param[param.length - 1];
        if(action == "serverInfo") {
            let server_config = JSON.parse(g_server.config);
            let server_info = GetServer();
            let data = {  // Not yet added only the playersonline work
                name: server_info.serverName,
                maxPlayers: server_info.maxPlayers,
                serverMode: server_config.mode,
                serverMap: server_config.map,
                playersOnline: jcmp.players.length
            };
            return response.end(JSON.stringify(data));
        }
        else if(action == "playersList") {
            let players = [];
            for(let p of jcmp.players) {
                players.push({id: p.client.networkId, name: p.name});
            }
            return response.end(JSON.stringify(players));
        }
        return response.end("/serverInfo - Server info\n/playerList - List of players");
    }

    let server = http.createServer(handleRequest);
    server.listen(port, function(){
        console.log("Server listening on: http://localhost:%s", port);
    });
}


process.on('uncaughtException', e => console.error(e.stack || e));
// global error handler: if we do not catch an exception, log it here. don't rely on this, though.


// player variables
global.PlayerInfo = [];
//battleroyale variables
global.pInGame = []; // false = on Lobby
global.beingStart = false;
global.beingStartTimer;
//global.StartTimer;
global.EndTimer;
global.Started = false;
global.g_pingame = [];
global.AreaTimer;
global.battleArea;
global.timeLeft = { minutes: 0, seconds: 0 };


global.gm = {
  commands: events.Call('get_command_manager')[0],
  chat: events.Call('get_chat')[0],
  config: require('./config'),
  utility: require('./utility'),

  world: {
    time: { hour: 12, minute: 0 },
    weather: 0,
  },
};

function main () {
  // load all commands from the 'commands' directory
  gm.commands.loadFromDirectory(`${__dirname}/commands`, (f, ...a) => require(f)(...a));

  // load all event files from the 'events' directory
  gm.utility.loadFilesFromDirectory(`${__dirname}/events`);
  console.log('Server started.');
  Query(8080); //You can change your port

}

main();
