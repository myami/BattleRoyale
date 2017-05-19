
global.battleroyale = {
    commands: jcmp.events.Call('get_command_manager')[0],
    chat: jcmp.events.Call('get_chat')[0],
    config: require('./gm/config'),
    utils: require('./gm/utility'),
    colours: require('./vendor/randomColor'),
    workarounds: require('./gm/_workarounds'),
    bans: new Set(),
    timeManager: new (require('./gm/timeManager'))(13, 0),
    poiManager: new (require('./gm/poiManager'))(),
    BRGame: require('./gm/BRGame.js'),
    game: {
      players: {
        onlobby: [],
        ingame: []
      },
      toStart: false,
      StartTimer: null,
      TimerArea : 2,
      games: [],
      gamesCount: 0,
    },
    arena:{
      volcano: require('./arena/volcano.js'),
      city: require('./arena/city.js')
    }
};

function main() {
  console.log("+==========================================================================================+");
  console.log('\
  888888b.            888    888    888          8888888b.                             888\n\
  888  "88b           888    888    888          888   Y88b                            888          \n\
  888  .88P           888    888    888          888    888                            888          \n\
  8888888K.   8888b.  888888 888888 888  .d88b.  888   d88P  .d88b.  888  888  8888b.  888  .d88b.  \n\
  888  "Y88b     "88b 888    888    888 d8P  Y8b 8888888P"  d88""88b 888  888     "88b 888 d8P  Y8b \n\
  888    888 .d888888 888    888    888 88888888 888 T88b   888  888 888  888 .d888888 888 88888888 \n\
  888   d88P 888  888 Y88b.  Y88b.  888 Y8b.     888  T88b  Y88..88P Y88b 888 888  888 888 Y8b.     \n\
  8888888P"  "Y888888  "Y888  "Y888 888  "Y8888  888   T88b  "Y88P"   "Y88888 "Y888888 888  "Y8888  \n\
                                                                        888                       \n\
                                                                   Y8b d88P                       \n\
                                                                    "Y88P"                        ');
  console.log("+==========================================================================================+");


  process.on('uncaughtException', e => console.error(e.stack || e));


  // load all commands from the 'commands' directory
  battleroyale.commands.loadFromDirectory(`${__dirname}/commands`, (f, ...a) => require(f)(...a));
  // load all event files from the 'events' directory
  battleroyale.utils.loadFilesFromDirectory(`${__dirname}/events`);

  battleroyale.timeManager.start();

  setInterval(function() {
    jcmp.events.Call("battleroyale_updates");
  }, 1000) //every second call this event
  setInterval(function() {
    jcmp.events.Call("battleroyale_player_outarea");
  }, 1000) //every second call this event

}


main();
