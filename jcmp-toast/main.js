jcmp.events.Add('toast_show', function(player, opts) {
  jcmp.events.CallRemote('toast_show', player, JSON.stringify(opts));
});
