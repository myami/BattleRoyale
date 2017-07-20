const watched = new Map();

jcmp.events.Add('PlayerDestroyed', player => {
    if (watched.has(player.client.steamId)) {
        const tms = watched.get(player.client.steamId);
        tms.forEach(t => {
            if (t.timeout) {
                clearTimeout(t.timeout);
            }
            if (t.interval) {
                clearInterval(t.interval);
            }
        });
        watched.delete(player.client.steamId);
    }
});

exports.watchPlayer = function watchPlayer(player, timeout) {
    let idx = 0;
    let arr = null;

    function done() {
        arr.splice(idx, 1);
    }

    if (watched.has(player.client.steamId)) {
        arr = watched.get(player.client.steamId);
        idx = arr.length;
        arr.push({ timeout, interval: null });
        return done;
    }
    arr = [{ timeout, interval: null}];
    watched.set(player.client.steamId, arr);

    return done;
}

exports.watchPlayerIntv = function watchPlayerIntv(player, interval) {
    let idx = 0;
    let arr = null;

    function done() {
        arr.splice(idx, 1);
    }

    if (watched.has(player.client.steamId)) {

        arr = watched.get(player.client.steamId);
        idx = arr.length;
        arr.push({ interval, timeout: null });

        return done;
    }
    arr = [{ interval, timeout: null }];
    watched.set(player.client.steamId, arr);

    return done;
}

exports.playerExists = function playerExists(player) {
    const r = typeof jcmp.players.find(p => p.networkId === player.networkId) !== 'undefined';
    return r;
}

exports.playerIdExists = function playerIdExists(id) {
    const r = typeof jcmp.players.find(p => p.networkId === id) !== 'undefined';
    return r;
}