(function($, document, window, undefined) {
    $(function() {

        var $window = $(window),
            $initialised = false,
            $deathui = $('#deathui'),
            $spawnprot = $('#spawn');


            jcmp.AddEvent('battleroyale_deathui_toggle', function(toggle) {
          if (toggle) {
              $deathui.addClass('visible');
          } else {
              $deathui.removeClass('visible');
          }
      });

jcmp.AddEvent('battleroyale_accueil_toggle', (screen_visible) => {
  if(screen_visible) {
      $('#accueil').show();
  } else {
      $('#accueil').hide();

  }
});
jcmp.AddEvent('battleroyale_winner_toggle', (screen_visible) => {
  if(screen_visible) {
      $('#winner').show();

  } else {
      $('#winner').hide();

  }
});

jcmp.AddEvent('battleroyale_winner_toggleforall', (screen_visible) => {
  if(screen_visible) {
      $('#isthewinner').show();

  } else {
      $('#isthewinner').hide();

  }
});

jcmp.AddEvent('battleroyale_win_playername',(playername)=>{
   $("#winnername").text(playername);
 });


      jcmp.AddEvent('outarea_toggle', (screen_visible) => {
        if(screen_visible) {
            $('#area').show();
            $('#timerdiv').show();

        } else {
            $('#area').hide();
            $('#timerdiv').hide();

        }
      });

            jcmp.AddEvent('limitareavisible', (screen_visible) => {
                if(screen_visible) {
                    $('#radiusdiv').show();
                    $('#areadiv').show();
                    $('#numberplayercontainer').show();
                    $('#peoplebeforelanunch').hide();

                } else {
                    $('#radiusdiv').hide();
                    $('#areadiv').hide();
                    $('#numberplayercontainer').hide();
                    $('#peoplebeforelanunch').show();
                }
            });

            jcmp.AddEvent('battleroyale_outarea_timer_html',(time)=>{
              $("#timer").text(parseInt(time) + " Sec");
            });


            jcmp.AddEvent('battleroyale_healthbar_update', (num) => {
              let hp = ((1 - num) * 100) + "%";
              let path = "polygon(0 " + hp + ", 100% " + hp + ", 100% 100%, 0 100%)";
              $("div.inside").css({"clip-path": path});
            });

            jcmp.AddEvent('battleroyale_distance_update',(distance)=>{
               $("#radiusdistance").text(parseInt(distance));
             });


             jcmp.AddEvent('battleroyale_radius_update',(distance)=>{
                $("#areadistance").text(distance);
              });
              Array.prototype.remove = function(val) {
                var index = this.indexOf(val);
                if(index >= 0) this.splice(index, 1);
                return this;
              }

              let arraydie = [];
              let removename = false;
              jcmp.AddEvent('battleroyale_die_update',(playedie)=>{
                arraydie.push(playedie);
                if (arraydie.length > 0){
                  $("#playerdie").text(arraydie[0] + " died");
                  setTimeout(() => {   removename = true;   $("#playerdie").text(" ");}, 6000);
                  if (removename){
                    arraydie.remove(arraydie[0]);
                    removename = false;
                  }
                }
               });

               jcmp.AddEvent('battleroyale_die_list', (screen_visible) => {
                   if(screen_visible) {
                       $('#peopledielist').show();
                   } else {
                       $('#peopledielist').hide();
                   }
               });

               jcmp.AddEvent('battleroyale_area_reduced', (screen_visible) => {
                   if(screen_visible) {
                       $('#reducearea').show();
                   } else {
                       $('#reducearea').hide();
                   }
               });

            jcmp.CallEvent('battleroyale_ready'); // Ui Ready

            jcmp.AddEvent('battleroyale_playerneed_launch',(numberplayerneed)=>{
               $("#intplayerneed").text(numberplayerneed);
             });




    });
})(jQuery, document, window);
