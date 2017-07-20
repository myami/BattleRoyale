'use strict';

const ui = new WebUIWindow('command-hints', 'package://command-hints/ui/index.html', new Vector2(Math.round(jcmp.viewportSize.x * 0.3), (jcmp.viewportSize.y - 320)));
ui.position = new Vector2(0, 320);
ui.autoResize = true;
ui.BringToFront();

jcmp.events.AddRemoteCallable('CommandList', cmds => {
    jcmp.ui.CallEvent('CommandList', cmds);
});

jcmp.ui.AddEvent('RequestCommands', () => {
    jcmp.events.CallRemote('RequestCommands');
});