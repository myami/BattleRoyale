'use strict';

const MAX_MESSAGE_LENGTH = 1024;

jcmp.events.AddRemoteCallable('chat_submit_message', (player, message) => {
  if (message.length > MAX_MESSAGE_LENGTH) {
    return;
  }

  if (message.startsWith('/')) {
    jcmp.events.Call('chat_command', player, message);
    return;
  }
  
  const returns = jcmp.events.Call('chat_message', player, message);

  if (returns.some(r => r === false)) {
    // rejecting the message; dont send it
    return;
  }

  const retnString = returns.filter(r => typeof r === 'string').join('\n');

  if (retnString.length > 0) {
    jcmp.events.CallRemote('chat_message', null, retnString);
  } else {
    jcmp.events.CallRemote('chat_message', null, message);
  }
});

let customCSS = '';

jcmp.events.AddRemoteCallable('chat_ready', player => {
  jcmp.events.CallRemote('chat_settings', player, MAX_MESSAGE_LENGTH);
  jcmp.events.CallRemote(`chat_set_custom_css`, player, customCSS);
});


jcmp.events.Add('get_chat', () => {
  const chatObj = {
    send(target, message, color = new RGB(255, 255, 255)) {
      jcmp.events.CallRemote('chat_message', target, message, color.r, color.g, color.b);
    },
    addCustomCSS(stylesheet) {
      customCSS += `\n${stylesheet}`;
      jcmp.events.CallRemote('chat_set_custom_css', null, customCSS);
    }
  };

  chatObj.broadcast = (message, color) => {
    chatObj.send(null, message, color);
  };

  return chatObj;
});