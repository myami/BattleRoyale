/**
 * @overview package-outarea
 * @author myami
 * @copyright (c) myami
 * @license
 */

'use strict';

const ui = new WebUIWindow('outarea', 'package://jc3mp-outarea/ui/index.html', new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
ui.autoResize = true;

jcmp.events.AddRemoteCallable('outarea_toggle',function(toggle) {
  //jcmp.print("Called outarea toggle value: " + toggle);
  jcmp.ui.CallEvent('outarea_toggle', toggle);
});
