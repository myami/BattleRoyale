

var workaround2 = module.exports;

jcmp.events.Add('PlayerDestroyed', function(player) {
    for(let timer of player.workaround2.timers) {
        workaround2.deleteTimer(player, timer);
    }
});

jcmp.events.Add('PlayerCreated', function(player) {
    player.workaround2 = {
        timers: []
    };
})

workaround2.createInterval = function(player, callback, time) {

    //var interval = setInterval(callback, time);
    var interval = new Interval(callback, time);
    player.workaround2.timers.push(interval)
    return interval;
}

workaround2.createTimeout = function(player, callback, time) {

    var timeout = new Timeout(function() {
        callback();
        workaround2.deleteTimer(player, timeout, false);
    }, time);

    player.workaround2.timers.push(timeout);
    return timeout;

}

workaround2.deleteTimer = function(player, timer, clear = true) {

    var index = player.workaround2.timers.indexOf(timer);

    if(clear) {
        if(timer instanceof Interval) {
            clearInterval(timer.timer);
        } else if (timer instanceof Timeout) {
            clearTimeout(timer.timer);
        } else {
            console.error('Timer type invalid');
        }
    }

    if(index >= 0) {
        player.workaround2.timers.splice(index, 1);
    }

}

class Interval {
    constructor(callback, time) {
        this.timer = setInterval(callback, time);
    }
}

class Timeout {
    constructor (callback, time) {
        this.timer = setInterval(callback, time);
    }
}