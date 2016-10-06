'use strict';
// global error handler: if we do not catch an exception, log it here. don't rely on this, though.




process.on('uncaughtException', e => console.error(e.stack || e));


// player variables
global.PlayerInfo = [];
global.pInGame = []; // false = on Lobby
global.beingStart = false;
global.beingStartTimer;
//global.StartTimer;
//battleroyale variables
global.EndTimer;
global.Started = false;
global.g_pingame = [];
global.AreaTimer;
global.battleArea;
global.timeLeft = { minutes: 0, seconds: 0 };


// making 'gm' available in all files
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
}

main();
