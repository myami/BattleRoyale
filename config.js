'use strict';

module.exports = {
  badWords: ['fuck', 'shit'],
  color: {
    red: new RGB(255, 0, 0),
    green: new RGB(0, 255, 0),
    orange: new RGB(255, 140, 0),
    purple: new RGB(155, 89, 182),
  },
  /*mysql: {
host     : '127.0.0.1',
user     : 'root',
password : 'root',
database : 'gamemode'
},*/
game: {
minPlayers: 5,
//roundTime: gm.utility.minutes(15),
roundTime: (1 * 1000) * 60,
lobbypos: new Vector3f(3365.0, 2345.0, 0.0),
startAreaRadius: 300.0
},
debug: true
};
