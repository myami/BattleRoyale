/**
 * @overview package-outarea Main
 * @author myami
 * @copyright (c) myami
 * @license
 */

'use strict';

console.log('[outarea] initialized!');
jcmp.events.AddRemoteCallable('outarea_ready', (msg) => {
  console.log(msg);
jcmp.events.CallRemote('outarea_toggle', true);
});
