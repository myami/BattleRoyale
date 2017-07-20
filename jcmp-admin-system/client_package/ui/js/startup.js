
new Event('vueReady');

$(document).on('click', '.timeTypeSelector li a', function() {
  console.log("Type selected changed");

  var element = $(this).parent().parent().parent().children('#timeButton').children('.TimeType');

  element.html($(this).html());
  element.attr('timeSelected', $(this).attr('timetype'));
  $(this).parent().parent().children('li').children('.dropdown-active').removeClass("dropdown-active");
  $(this).addClass('dropdown-active');
});

$(document).on('click', '.filterSelector li a', function() {
  console.log("Type selected changed");

  var element = $("#filterType");

  element.html($(this).html());
  $(this).parent().parent().children('li').children('.dropdown-active').removeClass("dropdown-active");
  $(this).addClass('dropdown-active');
});

jcmp.AddEvent('adminsys/ui/adminui_toggle', function() {
  // Modal show
  jcmp.CallEvent('adminsys/client/request_update_playerList');

  $('#adminPanel').modal({backdrop: 'static', keyboard: false})
  jcmp.ShowCursor();
});

/*
$(document).ready(function() {
  jcmp.CallEvent('adminsys/client/adminui_ready');

  $("#adminPanel").on("hidden.bs.modal", function() {
    jcmp.HideCursor();
  });
  
});*/

function vueLoaded() {

  jcmp.CallEvent('adminsys/client/adminui_ready');
  

  $("#adminPanel").on("hidden.bs.modal", function() {
    jcmp.HideCursor();
  });

  //$('#adminPanel').modal({backdrop: 'static', keyboard: false});

}