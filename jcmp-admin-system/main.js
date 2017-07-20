jcmp.events.AddRemoteCallable('adminsys_doAction', function (player, action, argsData) {
  console.log(action);
  console.log(argsData);
});

console.log("adminSys started");


global.adminsys = {
  config: require('./config.js'),
  commands: jcmp.events.Call('get_command_manager')[0],
  chat: jcmp.events.Call('get_chat')[0],
  utils: require('./utility/utility.js'),
  workarounds: require('./utility/workarounds'),
  actions: require('./utility/actions.js')
}

if (adminsys.config.useDatabase) {


  adminsys.databaseSys = require('./database_methods/' + adminsys.config.databaseSys + '.js');
  switch (adminsys.config.databaseSys) {
    case 'mongodb':
      adminsys.mongodb = require('mongodb').MongoClient;
      adminsys.databaseSys.databaseConnection();
      break;
    case 'mysql':
      adminsys.databaseSys.databaseConnection();
      break;
  }
} else {
  global.bannedPlayers = [];
}


// load all commands from the 'commands' directory
adminsys.commands.loadFromDirectory(`${__dirname}/commands`, (f, ...a) => require(f)(...a));

// load all event files from the 'events' directory
adminsys.utils.loadFilesFromDirectory(`${__dirname}/events`);




jcmp.events.Add('adminsys_isAdmin', function(player) {
  return adminsys.utils.isAdmin(player);
});