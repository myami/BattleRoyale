var Errors = module.exports;

Errors.MORE_THAN_ONE = function(player) {
  jcmp.events.Call('toast_show', player,  {
      heading: 'Error',
      text: "Was more than one player with name like that",
      icon: 'error',
      loader: true,
      loaderBg: '#9EC600',
      position: 'top-right',
      hideAfter: 3000
  });
}

Errors.NO_PERMISSION = function(player) {
  jcmp.events.Call('toast_show', player,  {
      heading: 'Error',
      text: "You're not allowed to use this command",
      icon: 'error',
      loader: true,
      loaderBg: '#9EC600',
      position: 'top-right',
      hideAfter: 3000
  });
}

Errors.NO_PLAYER = function(player) {
  jcmp.events.Call('toast_show', player,  {
      heading: 'Error',
      text: "Can't find the player",
      icon: 'error',
      loader: true,
      loaderBg: '#9EC600',
      position: 'top-right',
      hideAfter: 3000
  });
}
