/**
 * @overview package-minimap Main
 * @author Lukas 'derbl4ck' Berwanger
 * @copyright (c) derbl4ck
 * @license
 */

'use strict';

let drawcalls = [];

jcmp.events.AddRemoteCallable('minimap_ready', () => {
  jcmp.events.CallRemote('minimap_draw', JSON.stringify(drawcalls));
});

/**
 * Registers a new Drawcall
 * 
 * @param {string} pkg name of pkg which want's to add sth. to the minimap
 * @param {string} identifier to identify the drawcall if you want to edit or remove them later
 * @param {string} type type of Object
 * @param {Object} data 
 * 
 * Expl jcmp.events.CallRemote('minimap_addDrawcall', 'billboards', 'billboards_board1', 'drawText', { x: 12, y: 13, text: 'Hello', fontSize: 5});
 * Expl jcmp.events.CallRemote('minimap_addDrawcall', 'hungergames', 'hungergames_spawnradius', 'drawCircle', { x: 12, y: 15, radius: 10, color: '#000'});
 * Expl jcmp.events.CallRemote('minimap_addDrawcall', 'billboards', 'billboards_css', 'addCustomCSS', { css: 'body { color: #fff; }'});
 * 
 */
jcmp.events.AddRemoteCallable('minimap_addDrawcall', (pkg, identifier, type, data) => {
  if(pkg == '' || identifier == '') {
    console.log(`[minimap]\x1b[31mA Package requested to add a Drawcall without giving correct Informations!\x1b[0m`);
  } else {
    if(!(type == 'drawText' || type == 'drawCircle' || type == 'addCustomCSS')){
      console.log(`[minimap]\x1b[31mThe Package ${pkg} requested to add a unknown Type of Drawcall (${identifier})(${type})\x1b[0m`);
    } else {
      drawcalls[identifier] = {
        pkg: pkg,
        identifier: identifier,
        type: type,
        data: data
      };

      jcmp.events.CallRemote('minimap_draw', JSON.stringify(drawcalls));
    }
  }
});

/**
 * Removes a Drawcall
 * 
 * @param {string} pkg name of pkg which want's to remove sth. from the minimap
 * @param {string} identifier to identify the drawcall if you want to edit or remove them later
 * 
 * Expl jcmp.events.CallRemote('minimap_removeDrawcall', 'billboards', 'billboards_board1');
 * Expl jcmp.events.CallRemote('minimap_removeDrawcall', 'hungergames', 'hungergames_spawnradius');
 * Expl jcmp.events.CallRemote('minimap_removeDrawcall', 'billboards', 'billboards_css');
 * 
 */
jcmp.events.AddRemoteCallable('minimap_removeDrawcall', (pkg, identifier) => {
  if(pkg == '' || identifier == '') {
    console.log(`[minimap]\x1b[31mA Package requested to remove a Drawcall without giving correct Informations!\x1b[0m`);
  } else {
      const idofshit = drawcalls.indexOf(identifier);
      
      if (idofshit > -1) {
        if(drawcalls[idofshit].type == 'addCustomCSS') {
          jcmp.events.CallRemote('minimap_removeCSS', identifier);
        }

        drawcalls.splice(idofshit, 1);
      }

      jcmp.events.CallRemote('minimap_draw', JSON.stringify(drawcalls));
    }
});

console.log('[minimap] initialized!');