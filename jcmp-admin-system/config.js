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
  useDatabase: false, // IF U DONT USE A DATABASE THE BANS ARE GOING TO BE ALLOWED ONLY SINCE THE SERVER IS UP
  databaseSys: 'mongodb', // mongodb or mysql
  mongodb: {
    url: 'mongodb://192.168.1.211:27017/jcmp_adminsys'
  },
  mysql: {
    host: '192.168.1.211',
    user: 'root',
    password: 'root',
    database: 'jcmp_adminsys',
  },
  admins: [
    "76561198030848245" // Daranix
  ],
  banonjoin: true // For debug purposes
}
