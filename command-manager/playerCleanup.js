/**
 * @file Support file to clean up after a player disconnect
 */
'use strict';

module.exports = new (class PlayerCleanup {
    /**
     * Creates a new PlayerCleanup instance.
     */
    constructor() {
        /** @type {Map<Map<string, *>, function>} */ this.maps = new Map();

        jcmp.events.Add('PlayerDestroyed', player => {
            console.log(`cleaning up after player ${player.client.steamId}`);
            // find the steam id of the player here and delete all map entries
            let removed = 0;
            this.maps.forEach((fn, map) => {
                if (map.has(player.client.steamId)) {
                    fn(map.get(player.client.steamId));
                    map.delete(player.client.steamId);
                    removed++;
                }
            });
            console.log(`removed ${removed} entries for that player.`);
        });
    }
})();
