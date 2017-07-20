/**
 * @file Command Manager for JC3:MP
 */

const CommandManager = require('./commandManager');
const manager = new CommandManager();
global.chat = jcmp.events.Call('get_chat')[0];

// make it available via an event
jcmp.events.Add('get_command_manager', () => manager);

// handle commands
jcmp.events.Add("chat_command", function(player, command) {
  const cmdInfo = CommandManager.parseCommandString(command);

  if (!manager.handleCommand(player, cmdInfo)) {
    chat.send(player, "Unknown command.", new RGB(255, 59, 59));
  }
});