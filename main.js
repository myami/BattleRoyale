'use strict';















// player variables
global.PlayerInfo = [];
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
<<<<<<< HEAD
  commandManager: new (require('./commandManager'))(),
  config: require('./config'),
  utility: require('./utility'),
  mapHandler: null,
=======
  commandManager: new (require('./commandManager.js'))(),
  commands: require('./commands/commands.js'),
  events: require('./events.js'),
  utility: require('./utility.js'),
  config: require('./config.js'),
  spawns: require('./spawns.js')
  //mysql:   require('./node_modules/mysql'),
  //system: require('./system.js')

>>>>>>> origin/master
};

function main () {
<<<<<<< HEAD
  const retn = events.Call('MapHandler');
  if (retn.length > 0) {
    gm.mapHandler = retn[0];

    gm.mapHandler.load('exampleMap')
      .then(map => {
        console.log(`map ${map.name} loaded with ${map.items.size} items.`);
      })
      .catch(err => {
        console.log(`error loading example map: ${err.stack}`);
      });
  }


  console.info('loading commands from directory');
  gm.utility.rreaddir(__dirname + '/commands', (err, list) => {
    if (err) {
      console.log(err);
      return;
    }

    list.forEach(f => {
      require('./commands/' + f)(gm.commandManager.add.bind(gm.commandManager));
    });
    console.info(list.length + ' command files loaded.');
  }, true);

  console.info('loading events from directory');
  gm.utility.rreaddir(__dirname + '/events', (err, list) => {
    if (err) {
      console.log(err);
      return;
    }

    list.forEach(f => {
      require('./events/' + f);
    });
    console.info(list.length + ' event files loaded.');
  }, true);

/*
=======
  console.log("Registering Events...");
  gm.events.register();
  console.log('Registering Commands...');
  gm.commands(gm.commandManager.add.bind(gm.commandManager));
  console.log("Server started!");
  
>>>>>>> origin/master
  setInterval(function() {
    gm.events.Checks();
  }, 1000);   */



<<<<<<< HEAD

	console.log('Server started.');
=======
>>>>>>> origin/master
}

main();
// TEMPORARY WORKAROUND FOR nJC3MP SCRIPTING ISSUE (https://gitlab.nanos.io/jc3mp/scripting/issues/1)
setInterval(() => {}, 500);
