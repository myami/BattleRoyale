
// Actions

var Action = {};

Action.banPlayer = function(player) {

  BootstrapDialog.show({
      type: BootstrapDialog.TYPE_DANGER,
      title: 'Ban player',
      message: function(dialogRef) {
        return $($("#confirm_banPlayer").html());
      },
      buttons: [{
          label: 'Ban',
          icon: 'glyphicon glyphicon-ban-circle',
          cssClass: 'btn-danger',
          action: function(dialogRef){
              // Doing shit

              var data = {
                target: player,
                reason: dialogRef.$modalBody[0].querySelector('#banReason').value,
                time: dialogRef.$modalBody[0].querySelector('#banTime').value,
                timeType: dialogRef.$modalBody[0].querySelector('#banTimeType').getAttribute('timeSelected')
              }
              console.log(data);

              jcmp.CallEvent('adminsys_doAction', 'banPlayer', JSON.stringify(data));

              dialogRef.close();
          }
      }, {
          label: 'Cancel',
          icon: 'glyphicon glyphicon-remove',
          action: function(dialogRef){
              dialogRef.close();
          }
      }]
  });
} // End of banPlayer func

Action.kickPlayer = function(player) {

  BootstrapDialog.show({
      type: BootstrapDialog.TYPE_WARNING,
      title: 'Kick Player',
      message: function(dialogRef) {
        return $($("#confirm_kickPlayer").html());
      },
      buttons: [{
          label: '&#127935; Kick',
          cssClass: 'btn-danger',
          action: function(dialogRef){
              var data = {
                target: player,
                reason: dialogRef.$modalBody[0].querySelector('#kickReason').value,
              }
              console.log(data);
              jcmp.CallEvent('adminsys_doAction', 'kickPlayer', JSON.stringify(data));
              dialogRef.close();
          }
      }, {
          label: 'Cancel',
          icon: 'glyphicon glyphicon-remove',
          action: function(dialogRef){
              dialogRef.close();
          }
      }]
  });
} // End of kickPlayer func

Action.tpPlayer = function(player) {
  var dialog = new BootstrapDialog({
    title: 'Teleport player',
    message: function(dialogRef){

        var $message = $('<div>Select:</div>');
        var $divButtons = $(`<div style="margin-top:10px; text-align:center;">`);
        var $buttonToPlayer = $(`<button class="btn btn-warning" style="margin-right: 10px;">&#8618; TP To player</button>`);
        var $buttonToHere = $(`<button class="btn btn-info"><span class="glyphicon glyphicon-arrow-down"></span> TP player here</button></div>`);

        $buttonToPlayer.on('click', {dialogRef: dialogRef}, function(event){

            // Go to player
            var data = {
              target: player,
              here: false
            }

            jcmp.CallEvent('adminsys_doAction', 'tpPlayer', JSON.stringify(data));

            event.data.dialogRef.close();
        });

        $buttonToHere.on('click', {dialogRef: dialogRef}, function(event) {

          // TP Player Here
          var data = {
            target: player,
            here: true
          }

          jcmp.CallEvent('adminsys_doAction', 'tpPlayer', JSON.stringify(data));

          event.data.dialogRef.close();
        });

        $divButtons.append($buttonToPlayer);
        $divButtons.append($buttonToHere);
        $message.append($divButtons);

        return $message;
    },
  });
  dialog.realize();
  //dialog.getModalHeader().hide();
  dialog.getModalFooter().hide();
  dialog.getModalBody().css('background-color', '#0088cc');
  dialog.getModalBody().css('color', '#fff');
  dialog.open();
}

Action.freezePlayer = function(player) { // FIXME Not implemented yet
  BootstrapDialog.show({
      type: BootstrapDialog.TYPE_INFO,
      title: 'Freeze player',
      message: function(dialogRef) {
        return $($("#confirm_freezePlayer").html());
      },
      buttons: [{
          label: '&#10052; Freeze player',
          cssClass: 'btn-info',
          action: function(dialogRef){
              var data = {
                target: player,
                time: parseInt(dialogRef.$modalBody[0].querySelector('#freezeTime').value),
                timeType: parseInt(dialogRef.$modalBody[0].querySelector('#freezeTimeType').getAttribute('timeSelected'))
              }
              console.log(data);
              dialogRef.close();
          }
      }, {
          label: 'Cancel',
          icon: 'glyphicon glyphicon-remove',
          action: function(dialogRef){
              dialogRef.close();
          }
      }]
  });
}

Action.setHP = function(player) {
  BootstrapDialog.show({
      title: 'Set player HP',
      type: BootstrapDialog.TYPE_DANGER,
      message: function(dialogRef) { return $($("#confirm_setHP").html()); },
      buttons: [{
          label: 'Set HP',
          cssClass: 'btn-danger',
          icon: 'glyphicon glyphicon-plus',
          action: function(dialogRef){
              var data = {
                target: player,
                hp: parseInt(dialogRef.$modalBody[0].querySelector('#HPPoints').value)
              }
              console.log(data);
              jcmp.CallEvent('adminsys_doAction', 'setHP', JSON.stringify(data));

              dialogRef.close();
          }
      }, {
          label: 'Cancel',
          icon: 'glyphicon glyphicon-remove',
          action: function(dialogRef){
              dialogRef.close();
          }
      }]
  });
}

Action.setAdminRank = function(player) {

  if(typeof(player.adminlevel) === 'undefined') {
    player.adminlevel = 0;
  }

  BootstrapDialog.show({
      title: 'Set admin rank level',
      message: function(dialogRef) {
        return $(`
              <div class="input-group">
                <span class="input-group-addon" id="basic-addon1">Rank:</span>
                <input type="text" id="newRank" class="form-control" placeholder="0" value="${player.adminlevel}" aria-describedby="basic-addon1">
              </div>`);
      },
      buttons: [{
          label: '&#128110; Set admin rank',
          cssClass: 'btn-info',
          action: function(dialogRef){
              var data = {
                target: player,
                rank: parseInt(dialogRef.$modalBody[0].querySelector('#newRank').value)
              }
              console.log(data);
              jcmp.CallEvent('adminsys_doAction', 'setAdminRank', JSON.stringify(data));

              dialogRef.close();
          }
      },
      {
          label: 'Cancel',
          icon: 'glyphicon glyphicon-remove',
          action: function(dialogRef){
              dialogRef.close();
          }
      }
    ]
  });
}

Action.setHabilities = function(player, hability) {
  // Coming soon
}


Action.unbanPlayer = function(playerBanned) {

  BootstrapDialog.show({
      title: 'Ban details',
      type: BootstrapDialog.TYPE_WARNING,
      message: function(dialogRef) {
        return $($("#banDetails").html());
      },
      buttons: [{
          label: 'Unban',
          icon: 'glyphicon glyphicon-remove-circle',
          cssClass: 'btn-info',
          action: function(dialogRef){
              // Heres the shit to unban the player
              jcmp.CallEvent('adminsys_doAction', 'unbanPlayer', JSON.stringify({ steamId: playerBanned.steamId }));
              dialogRef.close();
          }
      },
      {
          label: 'Cancel',
          icon: 'glyphicon glyphicon-remove',
          action: function(dialogRef){
              dialogRef.close();
          }
      }
    ]
  });

};

Action.weaponMenu = function(target) {
  $("#weaponMenuModal").modal('show');
}

Action.spawnWeapon = function(target, hash, ammo) {

  var data = {
    target: target,
    hash: hash,
    ammo: ammo
  }

  console.log(data);
  jcmp.CallEvent('adminsys_doAction', 'spawnWeapon', JSON.stringify(data));
}
