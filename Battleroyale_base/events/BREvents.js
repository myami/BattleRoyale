jcmp.events.Add('battleroyale_updates', function () {

    //console.log("Im working");

    if (battleroyale.game.toStart) {
        battleroyale.game.timeToStart -= 500;
    }


    if (battleroyale.game.players.onlobby.length >= battleroyale.config.game.minPlayers && !battleroyale.game.toStart) {
        // Start a new interval
        battleroyale.game.toStart = true;
        battleroyale.utils.broadcastToLobby("The game is going to start in 2 minutes!");

        // Show and start timer and hide left players text on UI
        //Show the vote

        for (let player of battleroyale.game.players.onlobby) {
            jcmp.events.CallRemote('battleroyale_txt_timerStart', player, true);
            jcmp.events.CallRemote('battleroyale_txt_leftplayers_toggle', player, false);
            jcmp.events.CallRemote('battleroyale_vote_toggle_text_client',player,true);

        }


        battleroyale.game.timeToStart = battleroyale.config.game.timeToStart;
        battleroyale.game.StartTimer = setTimeout(function () {
            jcmp.events.Call('battleroyale_start_battle');
        }, battleroyale.config.game.timeToStart);
    }

    if (battleroyale.game.players.onlobby.length < battleroyale.config.game.minPlayers && battleroyale.game.toStart) {
        // Delete timeout

        clearTimeout(battleroyale.game.StartTimer);

        // Hide and reset timer and show left players text on UI for players on the lobby

        for (let player of battleroyale.game.players.onlobby) {

            jcmp.events.CallRemote('battleroyale_txt_timerStart', player, false);
            jcmp.events.CallRemote('battleroyale_txt_leftplayers_toggle', player, true);

            jcmp.events.Call('toast_show', player, {
                heading: 'Need more players',
                text: "More players are needed to start the battle",
                icon: 'info',
                loader: true,
                loaderBg: '#9EC600',
                position: 'top-right',
                hideAfter: 5000
            });

        }

        // --

        //battleroyale.utils.broadcastToLobby("Need more players to start the game ... ");

        battleroyale.game.toStart = false;
        battleroyale.game.timeToStart = battleroyale.config.game.timeToStart;
    }

    try { // Possible errors when disconnect meanwhile is calling this

        for (let player of jcmp.players) {
            //console.log("Player on game");
            //console.log(player);

            // Update health bar
            // TODO: What is this fucking shit i write lol
            jcmp.events.CallRemote('battleroyale_healthbar_update', player, JSON.stringify({
                health: player.health,
                maxHealth: 800
            }));

            if (player.battleroyale.ingame) {
                // This check if the player is in the area of the game for all the players on the game

                for(let barrel of player.battleroyale.game.spawnWeaponPoints) {

                    if(battleroyale.utils.GetDistanceBetweenPoints(player.position, barrel.position) < 3.0) {
                        jcmp.events.Call('battleroyale_pickup_barrel', player, barrel);
                    }
                }

                if (!battleroyale.utils.IsPointInCircleRender(player.position, player.battleroyale.game.position, player.battleroyale.game.radius)) {
                    jcmp.events.Call('battleroyale_player_outarea', player);
                } else {

                    if (player.battleroyale.warning) {
                        jcmp.events.Call('battleroyale_disable_warning', player);
                    } // Player has warning end
                } // Player in area end

            } else {
                // Players on lobby
            }

        } // For loop into players

    } catch (e) {
        console.log(e);
    }


});

jcmp.events.Add('battleroyale_start_battle', function () {

    battleroyale.utils.broadcastToLobby("Battle starting! ... ");
    battleroyale.game.toStart = false;
    battleroyale.game.timeToStart = battleroyale.config.game.timeToStart;

    const arenaIndex = temphighindex;
    const battlePosition = battleroyale.game.arenaList[arenaIndex].position;
    const maxY = battleroyale.game.arenaList[arenaIndex].maxY;
    const battleArea_start = battleroyale.game.arenaList[arenaIndex].radius_start;
    const spawnWeaponPoints = battleroyale.game.arenaList[arenaIndex].itemSpawns.map(wp => ({
        id: wp.id,
        position: new Vector3f(wp.x, wp.y, wp.z)
    }));

    let BRGame = new battleroyale.BRGame(
        battleroyale.game.games.length + 1,
        battlePosition,
        battleArea_start,
        maxY,
        spawnWeaponPoints,
        battleroyale.game.players.onlobby
    );

    battleroyale.game.games.push(BRGame);
    BRGame.start();

    //console.log(BRGame);
});

jcmp.events.Add('battleroyale_update_area', function (BRGame) {


    console.log(BRGame);


    let playersInArea = BRGame.players.filter(function(p) {
        return p.battleroyale.warning === false;
    });

    //console.log(playersInArea);
    let randomPosition;
    if(playersInArea.length >= 1) {
        const rndIndex = battleroyale.utils.random(0, playersInArea.length - 1);
        randomPosition = playersInArea[rndIndex].position;
        console.log(randomPosition);
    } else {
       randomPosition = battleroyale.utils.randomSpawn(BRGame.position, BRGame.radius);
    }


    BRGame.position = randomPosition;

    if (BRGame.radius / 2 >= (BRGame.radius / (2 * 5))) {
        BRGame.radius = BRGame.radius / 2;
    } else {
        clearInterval(BRGame.closeArea);
    }

    BRGame.updatePlayers();
    console.log(BRGame);

});

jcmp.events.Add('battleroyale_end_battle', function (BRGame) {
    console.log("[BATTLEROYALE] Battle end ID: " + BRGame.id);

    if (BRGame.players.length >= 1) {
        const player = BRGame.players[0];
        battleroyale.utils.broadcastToLobby("The winner of the battleroyale number" + BRGame.id + " is " + player.escapedNametagName);
        player.battleroyale.ingame = false;
        if (player.battleroyale.warning) {
            jcmp.events.Call('battleroyale_disable_warning', player);
        }

        console.log(player.dimension);
        player.Respawn();
        player.dimension = 0;

        battleroyale.game.players.onlobby.push(player);

        if (battleroyale.game.toStart) {
            jcmp.events.CallRemote('battleroyale_txt_updateTime', player, battleroyale.game.timeToStart);
            jcmp.events.CallRemote('battleroyale_txt_timeleft_toggle', player, true);
        } else {
            jcmp.events.CallRemote('battleroyale_txt_leftplayers_toggle', player, true);
        }

        let needPlayers = battleroyale.config.game.minPlayers - battleroyale.game.players.onlobby.length;
        jcmp.events.CallRemote('battleroyale_txt_needPlayers', player, needPlayers);
    }

    clearInterval(BRGame.closeArea);

});

jcmp.events.Add('battleroyale_player_leave_game', function (player, destroy) {

    // Destroy on TRUE = No put the player into de lobby again

    const BRGame = player.battleroyale.game;
    BRGame.players.removePlayer(player);
    battleroyale.game.players.ingame.removePlayer(player);

    if (BRGame.players.length <= 1) {
        jcmp.events.Call('battleroyale_end_battle', BRGame);
    }

    if (player.battleroyale.warning) {
        jcmp.events.Call('battleroyale_disable_warning', player);
    }

    if (!destroy) {
        jcmp.events.CallRemote('battleroyale_client_gameEnd', player);
        battleroyale.utils.removeAllWeapons(player);
        battleroyale.game.players.onlobby.push(player);
        player.battleroyale.ingame = false;
        player.dimension = 0;
        player.weapons.forEach(function(weapon){
      player.RemoveWeapon(weapon.modelHash);
    })
        const done = battleroyale.workarounds.watchPlayer(player, setTimeout(() => {
            done();
            // NOTE: Maybe include here the update needPlayers update event and the lobby push
            player.Respawn();
        }, 5000));

        battleroyale.utils.showLobbyUI(player);
        jcmp.events.Call('battleroyale_update_needPlayers');
    }

    BRGame.showLeftPlayers();

});

jcmp.events.Add('battleroyale_player_outarea', function (player) {

    // TODO: Show warning to the player on UI

    if (!player.battleroyale.warning) { // If the played wasn't warned on a first time

        jcmp.events.CallRemote('battleroyale_render_setColor', player, 'red');

        player.battleroyale.warning = true;
        battleroyale.chat.send(player, "Return to the battle zone, if you do not return in 60 seconds you will be considered a deserter!");



        player.battleroyale.warningTS = battleroyale.workarounds2.createTimeout(player, function () {
            player.battleroyale.warningINTV = battleroyale.workarounds2.createInterval(player, function () {
                console.log("Player loosing HP");
                player.health -= 20;
            }, 1000);
        }, 60000);
    }

});

jcmp.events.Add('battleroyale_disable_warning', function (player) {

    // TODO: Disable warning for the player from UI

    console.log("Player returned to the area!!!!!!!!!!!!!!!!")
    jcmp.events.CallRemote('battleroyale_render_setColor', player, 'white');
    player.battleroyale.warning = false;

    // Timeout

    if (player.battleroyale.warningTS != null) {
        //clearTimeout(player.battleroyale.warningTS);
        battleroyale.workarounds2.deleteTimer(player, player.battleroyale.warningTS)
        player.battleroyale.warningTS = null;
    }

    // Interval

    if (player.battleroyale.warningINTV != null) {
        battleroyale.workarounds2.deleteTimer(player, player.battleroyale.warningINTV);
        player.battleroyale.warningINTV = null;
    }

});

jcmp.events.Add('battleroyale_update_needPlayers', function () {
    let needPlayers = battleroyale.config.game.minPlayers - battleroyale.game.players.onlobby.length;
    jcmp.events.CallRemote('battleroyale_txt_needPlayers', null, needPlayers);
});

jcmp.events.AddRemoteCallable('battleroyale_txt_ready', function (player) {

    if (battleroyale.game.toStart) {
        jcmp.events.CallRemote('battleroyale_txt_updateTime', player, battleroyale.game.timeToStart);
        jcmp.events.CallRemote('battleroyale_txt_timerStart', player, true);
    } else {
        jcmp.events.CallRemote('battleroyale_txt_leftplayers_toggle', player, true);
    }

    let needPlayers = battleroyale.config.game.minPlayers - battleroyale.game.players.onlobby.length;
    jcmp.events.CallRemote('battleroyale_txt_needPlayers', player, needPlayers);
});

jcmp.events.Add('battleroyale_pickup_barrel', function(player, barrel) {
    //console.log("Picked weapon!")
    player.battleroyale.game.removeBarrel(barrel);
    const weaponList = battleroyale.hashes.get('weapons');
    const weaponHash = weaponList[battleroyale.utils.random(0, weaponList.length - 1)].hash;
    player.GiveWeapon(weaponHash, battleroyale.utils.random(10, 300), true);
});

jcmp.events.AddRemoteCallable('battleroyale_vote_volcano_server', function (player) {
  let tempc = votearray[0] + 1;
  votearray.splice(0,0,tempc);
  jcmp.events.CallRemote('battleroyale_vote_toggle_text_client',player,false);
  jcmp.events.CallRemote('battleroyale_vote_toggle_text_client',null,JSON.stringify(votearray));

});

jcmp.events.AddRemoteCallable('battleroyale_vote_city_server', function (player) {
  let tempc = votearray[1] + 1;
  votearray.splice(1,0,tempc);
  jcmp.events.CallRemote('battleroyale_vote_toggle_text_client',player,false);
  jcmp.events.CallRemote('battleroyale_vote_toggle_text_client',null,JSON.stringify(votearray));


});
