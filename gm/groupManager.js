'use strict';

class Group {
    constructor(name) {
        this.name = name;
        this.players = [];
        this.leader = null;
        this.invitedPlayers = [];
    }

    addPlayer(player) {
        if (this.hasPlayer(player)) {
            return false;
        }

        this.players.push(player);
        player.group = this;
        this.sendMessage(`${player.name} has joined your group.`, battleroyale.config.colours.orange, player);

        // if there is no current leader, make this player the leader
        if (this.leader === null) {
            this.leader = player;
        }

        // remove any invites
        if (this.isInvited(player)) {
            this.removePlayerInvite(player);
        }

        return true;
    }

    removePlayer(player) {
        if (!this.hasPlayer(player)) {
            return false;
        }

        this.players = this.players.filter(p => {
            return p.networkId !== player.networkId;
        });

        player.group = null;
        this.sendMessage(`${player.escapedNametagName} has left your group.`, battleroyale.config.colours.orange, player);

        // update the leader if this player was the current leader
        if (this.leader.networkId === player.networkId) {
            this.leader = null;

            // only set the new leader if we have any players left
            if (this.players.length !== 0) {
                this.leader = this.players[0];
            }
        }

        return true;
    }

    invitePlayer(player) {
        if (this.isInvited(player)) {
            return false;
        }

        player.groupInvite = this;
        this.invitedPlayers.push(player);

        const done = battleroyale.workarounds.watchPlayer(player, setTimeout(() => {
            done();

            if (player.group === null && player.groupInvite !== null) {
                let group = player.groupInvite;
                player.groupInvite.removePlayerInvite(player);

                group.sendMessage(`${player.escapedNametagName}'s invite to join your group has expired.`, battleroyale.config.colours.red, player);
                battleroyale.chat.send(player, `Your invite to join '${group.name}' has expired.`, battleroyale.config.colours.red);
            }
        }, 30000));

        return true;
    }

    removePlayerInvite(player) {
        if (!this.isInvited(player)) {
            return false;
        }

        this.invitedPlayers = this.invitedPlayers.filter(p => {
            return p.networkId !== player.networkId;
        });

        player.groupInvite = null;
        return true;
    }

    sendMessage(message, colour, exclude = array()) {
        this.players.forEach(p => {
            if ((typeof exclude === 'array' && !exclude.includes(p)) || (typeof exclude === 'object' && exclude.networkId !== p.networkId)) {
                battleroyale.chat.send(p, message, colour);
            }
        });
    }

    /* NOTE: Temp until we have a working way to compare JC3MP objects to each other */
    hasPlayer(player) {
        return this.players.some(p => p.networkId === player.networkId);
    }

    isLeader(player) {
        if (this.leader === null) {
            return false;
        }

        return this.leader.networkId === player.networkId;
    }

    isInvited(player) {
        return this.invitedPlayers.some(p => p.networkId === player.networkId);
    }
}

module.exports = class GroupManager {
    constructor() {
        this.groups = new Set();
        this.restrictedNames = [];
        this.lastError = '';
    }

    setRestrictedNames(restrictedNames) {
        this.restrictedNames = restrictedNames;
    }

    create(name) {
        if (this.restrictedNames.includes(name)) {
            this.lastError = `The group name '${name}' is not allowed.`;
            return null;
        }

        for (const group of this.groups.values()) {
            if (group.name === name) {
                this.lastError = `A group named '${name}' already exists!`;
                return null;
            }
        }

        let group = new Group(name);
        this.groups.add(group);
        return group;
    }

    destroy(group) {
        if (this.groups.has(group)) {
            this.groups.delete(group);

            group.players.forEach(p => {
                p.group = null;
            });

            group.invitedPlayers.forEach(p => {
                p.groupInvite = null;
            });

            group.players = group.players.splice(0, group.players.length);
            group.invitedPlayers = group.invitedPlayers.splice(0, group.invitedPlayers.length);
        }
    }

    handlePlayerLeave(player) {
        if (player.group !== null) {
            let group = player.group;

            // remove player from the group
            group.removePlayer(player);

            // delete group if there are no players left
            if (group.players.length === 0) {
                this.destroy(group);
            }
        }

        // remove the player from the group invites if we need to
        if (player.groupInvite !== null) {
            player.groupInvite.removePlayerInvite(player);
        }
    }
}
