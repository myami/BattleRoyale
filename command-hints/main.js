'use strict';

const manager = jcmp.events.Call('get_command_manager')[0];

jcmp.events.AddRemoteCallable('RequestCommands', player => {
  const cmds = [];
  manager.categories.forEach(cat => {
    cat.commands.forEach(cmd => {
      cmds.push({
        trigger: cmd.trigger.values().next().value,
        parameters: cmd._parameters,
        description: cmd._description,
        category: cat.name,
        options: cmd.options,
        usage: cmd.getUsage(),
      })
    });
  });

  jcmp.events.CallRemote('CommandList', player, JSON.stringify(cmds));
});