'use strict';

module.exports = {
    colours: {
        connection: new RGB(255, 140, 0),
        command_success: new RGB(0, 255, 0),
        command_fail: new RGB(255, 0, 0),
        group_message: new RGB(255, 204, 195),
        red: new RGB(255, 0, 0),
        green: new RGB(0, 255, 0),
        orange: new RGB(255, 140, 0),
        purple: new RGB(220, 198, 224),
    },
    world: {
        time: {
            hour: 13,
            minute: 0
        },
        weather: 0
    },

    game: {
      lobbypos: new Vector3f(-13574.3154296875, 1267.666748046875, 15097.6630859375),
      lobbyRadius: 1000,
      battle_StartRadius: 2000,
      minPlayers: 5
    },

    death_reasons: [
        'rekt',
        'owned',
        'killed',
        'neutralized',
        'executed',
        'assassinated',
        'slaughtered',
        'obliterated'
    ],
    groupRestrictedNames: [
        'admin',
        'nanos'
    ],
    admins: [
        '76561198030848245', // Daranix
        "76561198065687510" // Myami
    ],
    nano: [
        '76561198008906997',
        '76561198052240610',
        '76561197972906092',
        '76561198313774143',
        '76561197999882482',
        '76561198042740316',
        '76561198056356246',
        '76561198148702054',
        '76561198052751311',


    ]
};
