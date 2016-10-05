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
  commandManager: new (require('./commandManager'))(),
  config: require('./config'),
  utility: require('./utility'),
  sphere: require('./sphere.js'),
  mapHandler: null,
};

function main () {
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
  setInterval(function() {
    gm.events.Checks();
  }, 1000);   */




	console.log('Server started.');
}

main();
// TEMPORARY WORKAROUND FOR nJC3MP SCRIPTING ISSUE (https://gitlab.nanos.io/jc3mp/scripting/issues/1)
setInterval(() => {}, 500);
