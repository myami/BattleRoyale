'use strict';

class PointOfInterest {
    constructor(uid, type, label, position) {
        this.uid = uid;
        this.type = type;
        this.label = label;
        this.position = position;
    }

    createForPlayer(player) {
        // could just JSON.stringify(this) but then we get some un-needed vector stuff
        jcmp.events.CallRemote('battleroyale_create_poi', player, JSON.stringify({
            uid: this.uid,
            type: this.type,
            label: this.label,
            x: this.position.x,
            y: this.position.y,
            z: this.position.z
        }));
    }

    destroyForPlayer(player) {
        jcmp.events.CallRemote('battleroyale_destroy_poi', player, this.uid);
    }
}

module.exports = class PointOfInterestManager {
    constructor() {
        this.pois = new Map();
    }

    create(uid, type, label, position) {
        if (this.pois.has(uid)) {
            return false;
        }

        const poi = new PointOfInterest(uid, type, label, position);
        this.pois.set(uid, poi);

        jcmp.players.forEach(player => {
            poi.createForPlayer(player);
        });
        return poi;
    }

    destroy(uid) {
        if (!this.pois.has(uid)) {
            return false;
        }

        const poi = this.get(uid);
        jcmp.players.forEach(player => {
            poi.destroyForPlayer(player);
        });

        this.pois.delete(uid);
    }

    get(uid) {
        return this.pois.get(uid);
    }

    has(uid) {
        return this.pois.has(uid);
    }

    handlePlayerJoin(player) {
        this.pois.forEach(poi => {
            poi.createForPlayer(player);
        });
    }
}
