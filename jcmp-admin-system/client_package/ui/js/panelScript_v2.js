function loadVue() {

    var adminSys = {
        footerOptions: [
            { name: "Ban", minrank: 1, action: 'banPlayer' },
            { name: "Kick", minrank: 1, action: 'kickPlayer' },
            { name: "Teleport", minrank: 1, action: 'tpPlayer' },
            //{ name: "Freeze", minrank: 1, action: 'freezePlayer'},
            { name: "Set HP", minrank: 1, action: 'setHP'},
            { name: "Set admin rank", minrank: 2, action: 'setAdminRank'},
            { name: "Give Weapon", minrank: 1, action: 'weaponMenu'}
        ],
        localPlayer: {}
    }

    jcmp.AddEvent('adminsys/ui/updateInfo/localPlayer', function(pLocalData) {
        console.log('Update local player info');
        //console.log(pLocalData);
        adminSys.localPlayer = JSON.parse(pLocalData);
        $('#welcomeMsg').html('Welcome ' + adminSys.localPlayer.name);
    });

    //var welcomeMessageCtrl = new Vue({});

    var spawnVehMenuCtrl = new Vue({
        el: '#spawnmenu',
        data: {
            categories: ['Car', 'Motorbike', 'Helicopter', 'Plane', 'Boat']
        },
        methods: {
            getVehicles: function(category) {
                return vehicles.filter(function(v) {
                    return (v.dlc === null && v.type === category.toLowerCase());
                })
            },

            refCategory: function(category) {
                return '#spawn-'+category.toLowerCase();
            },

            generateTooltip: function(vehicle) {
                return `<span class='title'>${vehicle.name}</span><br><img src='./img/vehicles/${vehicle.model_name}.png'/>`;
            },

            spawnVehicle: function(hash) {
                jcmp.CallEvent('adminsys/client/spawnVehicle', hash);
            }
        },
        mounted() {
            
            $('.nav-tabs a[href="#spawn-' + this.categories[0].toLowerCase() + '"]').tab('show'); // Show first tab of spawn menu
            $('[data-toggle="tooltip"]').tooltip({ html: true, template: `<div class="tooltip tooltip-cars" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>` })
        }
    })

    var optionBoxCtrl = new Vue({
        el: '#OptionsBox',
        data: {
            footerOptions: adminSys.footerOptions
        },
        methods: {

            executeAction: function(event, index) {

                var el = event.target;
                console.log(el);
                var option = index;

                var playerId = playerInfoCtrl.selectedPlayer.networkId;
                console.log(playerId)

                if(playerId < 0 || playerId == undefined || playerId == null) {
                    return console.log('Invalid player ID');
                }

                var player = playerInfoCtrl.selectedPlayer;
                console.log(option);
                console.log("Option ID selected:" + option);

                var action = adminSys.footerOptions[option].action;

                if(Object.keys(Action).indexOf(action) < 0) {
                    return console.log("Invalid option to execute");
                }

                Action[action](player);
            },
        }
    });

    var playerListCtrl = new Vue({
        el: '#playerList',
        data: {
            playerList: []
        },
        
        methods: {
            selectPlayer: function(index) {
                playerInfoCtrl.selectedPlayer = this.playerList[index];
                $('.listPlayers').removeClass('clicked');
                document.getElementsByClassName('listPlayers')[index].classList.add('clicked');
            },

            refreshPlayerList: function() {
                jcmp.CallEvent('adminsys/client/request_update_playerList');
            }
        }
    });

    jcmp.AddEvent('adminsys/ui/response_update_playerList', function(String_playerList) {
        console.log('Update player list');
        //console.log(String_playerList);

        playerListCtrl.playerList = JSON.parse(String_playerList);
        if(typeof(playerInfoCtrl.selectedPlayer.networkId) === 'undefined' || playerInfoCtrl.selectedPlayer.networkId === null) {
            playerInfoCtrl.selectedPlayer = playerListCtrl.playerList[0];
        }

    });

    var playerInfoCtrl = new Vue({
        el: '#playerInfo',
        data: {
            selectedPlayer: {},
        }
    });

    /*
    function generateRandomPlayers() {
        var player;
        var pList = [];
        for(var i = 1; i <= 15; i++) {
            player = { name: 'Player' + i, networkId: i, steamId: 32409238, adminlevel: 2 };
            pList.push(player);
        }

        jcmp.CallEvent('adminsys/ui/response_update_playerList', JSON.stringify(pList));
    }

    generateRandomPlayers();*/

    var banlistCtrl = new Vue({
        el: '#banlist',
        data: {
            players_banlist: [],
            searchPlayer: '',
            bannedPlayer_info: { bannedby: {} } // Example
        },
        methods: {
            banDetails: function(index) {
                this.bannedPlayer_info = this.players_banlist[index];
                this.$nextTick(function() {
                    Action.unbanPlayer(this.players_banlist[index]);
                });
            }
        },
        watch: {
            searchPlayer: function(val, oldVal) {
                var filter = $("#filterType").html().toLowerCase().replace(" ", "");
                var data = {
                    filter: filter,
                    value: val
                }

                jcmp.CallEvent('adminsys/client/searchBanPlayer', JSON.stringify(data));
            }
        }
    });

    jcmp.AddEvent('adminsys/ui/update_banlist', function(data) {
        console.log('Update banList');
        console.log(data);
        banlistCtrl.players_banlist = JSON.parse(data);
    });

    /*
    function generateRandomBans() {
        var player;
        var pList = [];
        for(var i = 1; i <= 15; i++) {
            player = { name: 'Player' + i, networkId: i, steamId: 32409238, date_start: 249308423, date_end: 249308423, bannedby: { name: 'Daranix', steamId: 92438209483 } };
            pList.push(player);
        }

        jcmp.CallEvent('adminsys/ui/update_banlist', JSON.stringify(pList));
    }

    generateRandomBans();*/

    var orderWeapons = weapons.GroupBy('class');
    var weapon_groups = Object.keys(orderWeapons);

    var spawnMenuCtrl = new Vue({
        el: '#weaponContainer',
        data: {
            weaponsGrouped: orderWeapons,
            weapon_groups: weapon_groups,
            ammoQuantity: 300
        },
        methods: {
            spawnWeapon: function(weaponhash) {
                Action.spawnWeapon(selectedPlayer, weaponhash, this.ammoQuantity);
            }
        }
    });

      
    vueLoaded();

}



