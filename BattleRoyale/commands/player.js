module.exports = ({ Command, manager }) => {
  manager.category('player', 'commands that directly affect you')
    .add(new Command('suicide')
      .description('kills you')
      .handler(player => {
        player.health = 0;
        battleroyale.chat.send(player, 'sleep well.', battleroyale.config.colours.green);
    }))
    .add(new Command('exit').description('Exit the server and return to the main menu').handler(function(player) {
   player.Kick('exit');
 }))
}
