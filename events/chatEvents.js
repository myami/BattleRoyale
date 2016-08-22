'use strict';

// chat message
events.Add("ChatMessage", function(player, message) {
  console.log(`${player.name}: ${message}`);
  return `${player.name}: ${message}`;
});

// command message
events.Add("ChatCommand", function(player, command) {
  let args = command.match(/('(\\'|[^'])*'|"(\\"|[^"])*"|\/(\\\/|[^\/])*\/|(\\ |[^ ])+|[\w-]+)/g) || [];
  for(var i=1;i<args.length;i++)
  {
    if( args[i].substr(0, 1) === '"' || args[i].substr(0,1) === "'" ) {
      args[i] = JSON.parse(args[i]);
    }
  }

  // Let's check if this crazy thing ever happens.
  if (args.length === 0) {
    throw "This should NEVER happen.";
  }
  
  let commandName = args.splice(0, 1)[0];
  if (!gm.commandManager.handle(player, commandName, args)) {
    player.SendChatMessage("Unknown command.", new RGB(255, 59, 59));
  }
});