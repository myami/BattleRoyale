'use strict';

const ui = new WebUIWindow('chat', 'package://chat/ui/index.html', new Vector2(Math.round(jcmp.viewportSize.x * 0.3), 320));
ui.autoResize = true;

// Gets overridden by the server anyway
let MAX_MESSAGE_LENGTH = 1024;

jcmp.events.AddRemoteCallable('chat_message', (msg, r, g, b) => {
  jcmp.ui.CallEvent('chat_message', msg, r, g, b);
});

jcmp.events.AddRemoteCallable('chat_settings', maxLength => {
  MAX_MESSAGE_LENGTH = maxLength;
  jcmp.ui.CallEvent('chat_settings', MAX_MESSAGE_LENGTH);
});

jcmp.ui.AddEvent('chat_ready', () => {
  jcmp.events.CallRemote('chat_ready');
});

jcmp.ui.AddEvent('chat_input_state', s => {
  // Ask the main menu to stop opening. It will still open at the second time (in a short period), though
  jcmp.ui.CallEvent('mainui_prevent_open_menu', s);
  if (s) {
    jcmp.localPlayer.controlsEnabled = true;
    jcmp.localPlayer.controlsEnabled = false;
  } else {
    jcmp.localPlayer.controlsEnabled = true;
  }
});

jcmp.events.AddRemoteCallable('chat_set_custom_css', css => {
  jcmp.ui.CallEvent('chat_set_custom_css', css);
});

jcmp.ui.AddEvent('chat_submit_message', msg => {
  if (msg.length > MAX_MESSAGE_LENGTH) {
    return;
  }

  jcmp.events.CallRemote('chat_submit_message', msg);
});