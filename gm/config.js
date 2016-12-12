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
    }
  },
  mysql: {
host     : 'web.sql.servergamers.net',
user     : 'sql_web_SRKyBQnF',
password : 'iHqlXY2I',
database : 'sql_web_SRKyBQnF'
},
game: {
minPlayers: 1,
//roundTime: gm.utility.minutes(15),
roundTime: (1 * 1000) * 60,
lobbypos: new Vector3f(-13536.0, 1026.0, 14599),
lobbyradius: 1000,
areapos: new Vector3f(-1780,1240,-6483),
startAreaRadius: 4000.0,
debug: true
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
  ]
};
