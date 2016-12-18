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

global.battleroyale = {
  commands: events.Call('get_command_manager')[0],
  chat: events.Call('get_chat')[0],
  config: require('./gm/config'),
  utils: require('./gm/utility'),
  colours: require('./vendor/randomColor'),
  workarounds: require('./gm/_workarounds'),
  spawns: require('./gm/spawns.js'),
  bans: new Set(),
  passiveModeBans: new Set(),
  timeManager: new (require('./gm/timeManager'))(13, 0),
  groupManager: new (require('./gm/groupManager'))()
};


//battleroyale variables
global.pInGame = []; // false = on Lobby
global.beingStart = false;
global.beingStartTimer;
global.g_pingame = [];
global.EndTimer;
global.Started = false;
global.g_pingame = [];
global.AreaTimer;
global.battleArea;
global.beingStartTimer;
global.timeLeft = { minutes: 0, seconds: 0 };

global.positions = [];
// player variables
global.PlayerInfo = [];
//Other player variables
global.ConfirmReg = [];
global.ConfirmPwd = [];
global.Registered = [];
global.pLogged    = [];

// add custom CSS
battleroyale.chat.addCustomCSS(`
.nanos-logo {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AoUCA8nY9qRVwAAAnBJREFUKM+FkltIk3EYxp/v/22zTW1b89jMsoOmQVObNoNaS125vJDUCHZhEZKdIKigI9RFkpQRZJ5uIoNUJJxB6QRNi6hVLg+ZOG3mxnTbZ6mlztzg34UoKkS/qxee533h4XlZLENACm/f43m9AnVO7pEyjUZbAMbfffxYvq2tzQzAQxecDABEx+wWqtUpEYGBfhq5fO251NQ9sYrtcQAAi+UbjMZX3202x/3ZWW9z++v3tp7ulmmsCYqT7EvXX796rXCkt89K/4VlwEZv3CwaS92vvyULjpWymQd15ZfzAk5u2zQmHXV74JkTIzRUtixAZ7cFw5YmJKzvEe1VBCZxM6EbWa02s1rI/FwV5m1BXKQdo84eNLfZEBIejclfHtRVV0JCa5EY9BYeew/6XRG8GTZyK1Na+mjmaN5hofFFPbiuEhxQjkO2JQpNptUAA+iSfmNyyI6XH6WQKQqQnpGFpzWGPzxCCIQiEbJy9XCqdairKkNUfw3SVBz4LB/tRi8GoUf2mQKEhUgAAIQQkKVZwkKkOHvhCvp4pzDl5DDHjaOL5uP0+UuLSwsQhiEEKxD7s2AIAUMIxAG8lTIIIYS4Oc63UqB0vme6ZF6K0+n2Eat1OLei8slXl4vD/3C5OFRUVvUODFiz2c7PpsGJSV/D0JDdTyqVJMvl4TB/MiNG9AYClo8vU7ugVCbC9MGM8oqqh42NrScaDI/NUMRrFi+qUjJy6huMI8XFD6ijdgP98SyW3rlbQg2GJsdOle7Qgk8Rr5n/1YREDcwdrWAYBoBgXbJKW7Q5eFzg9fGmbRNivund84sAHJRS7FCmwdzRgr9+GQdOhCFsLwAAAABJRU5ErkJggg==);
  margin-top: 4px;
  width: 14px;
  height: 14px;
  margin-right: 4px;
  float: left;
}

.nanos-logo-big {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AoUCCEOKm8AFwAABONJREFUSMe1lmlQU1cYht+bhEBIiAQwLIJYdgFRQJQAtSxOXVodQFpb7diiztQ6ioNYHWsV+oNap1IUsM50XFodHbWlLgMi4wLUyiIkMSziRkBkCQmQEC5kMZfTHwpT1Cra9vl1zl2e98w5353vUpgAzi6BdmKxk4948uRtAJx1AwNZ7e2dCo26Wfeqdzl/n8yNjIfZPAK5rBwAILDznGZjY/vhwoXzE6MksyXx8THg8/m4cqWi/GatvOH8ed4Fra7vDK1/WA8AwbOSYc3ugVR64/mk0LCYsXFQ8Fw/L++I31NXb6Lr62+PGAxG8ixGo4kolQ9JxpZvDD6+kRXTA6PGBGHhsWMuCgAi5sSzLBbKiW/LC7ET2u0ICPCL/WLdKvj6ek1kB6HR9OLgwWOorZM3DtF0llanr2axSI9MWmYZe8jXT1ISHbOMNDXdI2/Kg5aHJC5hBfHzj7qxdSubAgB2SMjbErGzz8WVK1OiUpcLqV1ZP4HDnYTgYH+8DidPnsN32ZnI3BIApykS97NnTR+4uE5tpqKil9TszV4/RyLeD4YygVjbIedQP1pU3kj5aC2io8LB5/NeKKVpA25U1uLXU4fg79aKzWtEoMzDYDEcyAe3YUPGD/fZHlP9clRqrXVPcxWmi/pgMVkQlyDG7MAhNCoqUHCoGqbHVggO8hm/4lMlKMjfBxebIqxJNmFBDA9Mlxqc/l4cPzeIolpArdHasCZNEjIHDuSg32Ublma7Q3FLB3WNHAJGh48XWeFwZifaG3KQvGwtlMp2PGhpQ1Lyaqju7MPhXV1YvsAKoscDGFLcRUMDjflZTlCL05Ff8D0cHUWEWrR4Rf/F4hMiAOhW9SI37xdYa4sR7XEXETNsYevqCp5YiNaOEew7OgxQBOmpAkxzBR73DcHc04u6JiPK2rwxbL8Am9M+hYuzIwAgMSmVHhcwSktrFy6cK4T82s/YsLAXIX5sENEUcB0cQACQfh2s6F4o7lqQW2yP0PhVWJKYBK9pbuO2MTEplea86PC833JDevpGPEpZhrSM3fCpqcb6+UoIHTWwYXNB64zYW+IApXEO9v+4He7urv9YXayXlZ6HhxvOnsnHlPB1uFxvA2KgQZmNKJKy4RHxOQpP571U/sqAUTw9JoNFWQCKAigKbIrBVHfxhL6PCQUQMn5OUQB59uK/CXhTKAAsQgj3/wpgRhguq6ura2fapq8HOzu7/zNxR2c3NqbtGGxra/+SU6+oyL13r+Xa/fvKb1NS3l+8ZvWKNxYTQnDkyCn8VnjhYlnZn9tNxo56DgAYDR2K8vKapRqNeuX1P2qO5uVls4RCwWvJ9XoaG9O+GmlsvP1Zc/ODkyZjBzPukAMDPRlp3dVjRcWlM+Pikm6WlpbDZDK/UmwymXGptAzvxCZVFxdfmiGTXj0eEODFjN5njw66u9sAAIbhPjWHyztx+fL17lZle0xo6AxrVY8aw21FCPIcAc/KCtIWwN5nCQQCAXZl7hkoKDicodf3bepR3VEBgOqpa6xlju/NcZDLygAAM2fN82SxuCWRc8OnV1VWDu/+RGNrMPKw87RQO29epKiqqq6BTTHvSWXlj5704gTIpFefK9UXMis0FrfkT/4u/AMk2235vCbtIOddBuh3tSc39YNDQXeaK/cAQFhYHGRPF/UsfwHlKUzj8KmjCwAAAABJRU5ErkJggg==');
  width: 24px;
  height: 24px;
  margin-top: 4px;
  margin-right: 8px;
  float: left;
}

.group-message {
  font-size: 16px;
}`)

process.on('uncaughtException', e => console.error(e.stack || e));

// load all commands from the 'commands' directory
battleroyale.commands.loadFromDirectory(`${__dirname}/commands`, (f, ...a) => require(f)(...a));
// load all event files from the 'events' directory
battleroyale.utils.loadFilesFromDirectory(`${__dirname}/events`);

battleroyale.timeManager.start();
battleroyale.groupManager.setRestrictedNames(battleroyale.config.groupRestrictedNames);

setInterval(() => {}, 500);
  Query(8080); //You can change your port

  setInterval(function() {   events.Call('Checks');}, 1000);
