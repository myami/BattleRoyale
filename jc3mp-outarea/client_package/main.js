/**
 * @overview package-outarea
 * @author myami
 * @copyright (c) myami
 * @license
 */

'use strict';

const ui = new WebUIWindow('outarea', 'package://jc3mp-outarea/ui/index.html', new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
ui.autoResize = true;

jcmp.events.AddRemoteCallable('outarea_toggle', (toggle) => {
  jcmp.ui.CallEvent('outarea_toggle', toggle);
});

/*jcmp.ui.AddEvent('outarea_ready', msg => {
  jcmp.events.CallRemote('outarea_ready', msg);
});*/
jcmp.events.AddRemoteCallable('outarea_ready', () => {

    jcmp.ui.CallEvent('outarea_ready');
});
=======

