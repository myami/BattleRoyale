'use strict';

module.exports = {
<<<<<<< HEAD
  badWords: ['fuck', 'shit', 'BitEmE'],
  colors: {
    red: new RGB(255, 0, 0),
    green: new RGB(0, 255, 0),
    orange: new RGB(255, 140, 0),
    purple: new RGB(155, 89, 182),
  },
  world: {
    weather: 0,
    timeHour: 13,
    timeMinute: 0,
    timeSecond: 0
=======
  badWords: ["fuck", "shit", "BitEmE"],
  world: {
    weather: 1,
    windLevel: 0.0,
    rainLevel: 0.0,
    snowLevel: 0.0,
    timeScale: 1.0,
    IPLs: ['shr_int', 'FIBlobby', 'bh1_47_joshhse_firevfx', 'jewel2fake', 'RC12B_HospitalInterior', 'canyonriver01', 'railing_start', 'LInvader'],
    interiors: [],
    capInteriors: true
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
>>>>>>> origin/master
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
