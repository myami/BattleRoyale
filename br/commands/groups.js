'use strict';

module.exports = ({ Command, manager }) => {
    manager.category('group', 'group commands')
    .add(new Command('creategroup')
    .description('create a new group')
    .parameter('name', 'string', 'group name', { isTextParameter: true })
    .handler((player, groupname) => {
        if (player.group !== null) {
            battleroyale.chat.send(player, `You are already part of a group.`, battleroyale.config.colours.command_fail);
            return;
        }

        let group = battleroyale.groupManager.create(groupname);
        if (group === null) {
            battleroyale.chat.send(player, battleroyale.groupManager.lastError, battleroyale.config.colours.command_fail);
            return;
        }

        group.addPlayer(player);
        battleroyale.chat.send(player, `You've created a group called '${groupname}'. Type '/help group' to view available commands.`, battleroyale.config.colours.command_success);
    }))

    .add(new Command('leavegroup')
    .description('leave your current group')
    .handler(player => {
        if (player.group === null) {
            battleroyale.chat.send(player, `You are not part of a group.`, battleroyale.config.colours.command_fail);
            return;
        }

        battleroyale.chat.send(player, `You have left the group '${player.group.name}'.`, battleroyale.config.colours.command_success);
        battleroyale.groupManager.handlePlayerLeave(player);
    }))

    .add(new Command('invitegroup')
    .description('invite a player to join your group')
    .parameter('target', 'string', 'networkId or (part of) name')
    .handler((player, target) => {
        if (player.group === null) {
            battleroyale.chat.send(player, `You are not part of a group.`, battleroyale.config.colours.command_fail);
            return;
        }

        if (!player.group.isLeader(player)) {
            battleroyale.chat.send(player, `You are not the leader of the group.`, battleroyale.config.colours.command_fail);
            return;
        }

        const res = battleroyale.utils.getPlayer(target);
        if (res.length === 0 || res.length > 1) {
            battleroyale.chat.send(player, `no / too many matching players!`, battleroyale.config.colours.command_fail);
            return;
        }

        if (res[0].networkId === player.networkId) {
            battleroyale.chat.send(player, `You can't invite yourself to the group.`, battleroyale.config.colours.command_fail);
            return;
        }

        if (res[0].group !== null) {
            battleroyale.chat.send(player, `That player is already part of a group.`, battleroyale.config.colours.command_fail);
            return;
        }

        if (res[0].groupInvite !== null) {
            battleroyale.chat.send(player, `That player has already been invited to a group.`, battleroyale.config.colours.command_fail);
            return;
        }

        if (player.group.isInvited(res[0])) {
            battleroyale.chat.send(player, `That player has already been invited to the group.`, battleroyale.config.colours.command_fail);
            return;
        }

        player.group.invitePlayer(res[0]);
        battleroyale.chat.send(player, `You have invited ${res[0].escapedNametagName} to the group '${player.group.name}'.`, battleroyale.config.colours.command_success);
        battleroyale.chat.send(res[0], `You have been invited to the group '${player.group.name}' by ${player.escapedNametagName}. (/joingroup to accept)`, battleroyale.config.colours.command_success);

    }))

    .add(new Command('joingroup')
    .description('accept an invite and join the group')
    .handler(player => {
        if (player.groupInvite === null) {
            battleroyale.chat.send(player, `You have not been invited to join a group.`, battleroyale.config.colours.command_fail);
            return;
        }

        if (player.group !== null) {
            battleroyale.chat.send(player, `You have already joined a group.`, battleroyale.config.colours.command_fail);
            return;
        }

        player.groupInvite.addPlayer(player);
        battleroyale.chat.send(player, `You have joined the group '${player.group.name}'.`, battleroyale.config.colours.command_success);
    }))

    .add(new Command(['group', 'g'])
    .description('send a chat message to your group')
    .parameter('message', 'string', 'message', { isTextParameter: true })
    .handler((player, message) => {
        if (player.group === null) {
            battleroyale.chat.send(player, `You are not part of a group.`, battleroyale.config.colours.command_fail);
            return;
        }

        player.group.players.forEach(p => {
            battleroyale.chat.send(p, `<span class="group-message">(Group) ${player.escapedNametagName}: ${message}</span>`, battleroyale.config.colours.group_message)
        });
    }));
};
