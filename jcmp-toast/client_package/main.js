const ui = new WebUIWindow('daranix-clientdebug_package', 'package://jcmp-toast/ui/index.html', new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
ui.autoResize = true;


jcmp.events.AddRemoteCallable('toast_show', function(opts) {
  jcmp.ui.CallEvent('ui_toast_show', opts);
});

jcmp.ui.AddEvent('cef_toast_show', function(opts) {
  jcmp.ui.CallEvent('ui_toast_show', opts);
})

jcmp.events.Add('client_toast_show', function(opts) {
  jcmp.ui.CallEvent('ui_toast_show', JSON.stringify(opts));
});

/*
jcmp.ui.AddEvent('client_toast_show', function(opts) {
  var string = JSON.stringify(opts);
  jcmp.events.CallRemote('d4log_sendlog', string);
  jcmp.ui.CallEvent('toast_show', opts);
});*/
