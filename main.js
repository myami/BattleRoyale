
"use strict";

/*
    A few notes from Jan:
    The default package is using the strict mode. If you need more information about the strict mode, read this:
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
    We are also using ES6 features:
        https://iojs.org/en/es6.html

    This package is split up into multiple files. This was a personal choice. You *could* append all content into one single file.
    However, this would become kind of messy somewhen. In order to keep your code as readable as possible, I decided to split it up.

    This package is also conform to Google's Javascript Style Guide:
        https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

// Creating a global namespace to prevent naming issues with GTA:MP
/**
 * @namespace
 */

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
  commandManager: new (require('./commandManager.js'))(),
  commands: require('./commands/commands.js'),
  events: require('./events.js'),
  utility: require('./utility.js'),
  config: require('./config.js'),
  spawns: require('./spawns.js')
  //mysql:   require('./node_modules/mysql'),
  //system: require('./system.js')

};

/**
 * The main function of this package.
 */

function main () {
  console.log("Registering Events...");
  gm.events.register();
  console.log('Registering Commands...');
  gm.commands(gm.commandManager.add.bind(gm.commandManager));
  console.log("Server started!");
  
  setInterval(function() {
    gm.events.Checks();
  }, 1000);

}

main();
