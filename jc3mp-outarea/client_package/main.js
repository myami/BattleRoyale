/**
 * @overview package-outarea
 * @author myami
 * @copyright (c) myami
 * @license
 */

'use strict';

const ui = new WebUIWindow('outarea', 'package://jc3mp-outarea/ui/index.html', new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
ui.autoResize = true;

jcmp.events.AddRemoteCallable('showingUI', () => {

screen_visible = true;
print(screen_visible);

})
jcmp.events.AddRemoteCallable('deleteUI', () => {

screen_visible = false;
print(screen_visible);

})
