/**
 * @overview package-minimap Main
 * @author Lukas 'derbl4ck' Berwanger
 * @contributor Sebastian 'Sebihunter' Mühlbauer
 * @contributor Darwood37
 * @copyright (c) derbl4ck
 * @license
 */

'use strict';
/*
var quaternion = require('./lib/quaternion.js');

setTimeout(function() {
  jcmp.events.CallRemote('battleroyale_debug', 'setTimeout works!')
}, 1000)*/

const ui = new WebUIWindow('minimap', 'package://jc3mp-minimap/ui/index.html', new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
ui.autoResize = true;

jcmp.ui.AddEvent('minimap_getLocalPlayerPos', () => {
  const x = jcmp.localPlayer.position.x;
  const y = jcmp.localPlayer.position.z;
  const posi = [(-(y / 100)), (x / 100)];

  jcmp.ui.CallEvent('minimap_setLocalPlayerPos', JSON.stringify(posi));
});

jcmp.ui.AddEvent('minimap_getLocalPlayerRot', () => {

  let rotation;
  let x = jcmp.localPlayer.rotation.x;
  let z = jcmp.localPlayer.rotation.z;
  let y = jcmp.localPlayer.rotation.y;

  //let convertRadiansToDegrees = 180.0 / Math.PI;
  //Due to a missing polar coordinate it's not possible to solve it via acos/asin

  // FIXME: When the player is moving on parachute, grappel or wingsuit, tha arrow beacomes crazy

  rotation = Math.abs(y) * (180 / Math.PI);
  if (z == 0) {
    if (y < 0) rotation = 90 - rotation + 270;
  } else {
    rotation = (y > 0) ? 90 - rotation + 90 : rotation + 180;
  }

  //rotation = rotation;
  
  //jcmp.events.CallRemote('battleroyale_debug', rotation);

  jcmp.ui.CallEvent('minimap_setLocalPlayerRot', rotation);
});

jcmp.ui.AddEvent('minimap_ready', () => {
  jcmp.events.CallRemote('minimap_ready');
});

jcmp.events.AddRemoteCallable('minimap_draw', drawcalls => {
  let tdrawcalls;

  if (drawcalls == 'undefined' || drawcalls == null) {
    tdrawcalls = {};
  } else {
    tdrawcalls = JSON.parse(drawcalls);
  }

  jcmp.ui.CallEvent('minimap_clear', 'Dennis best dude EUWEST');

  for (let drawcall in tdrawcalls) {
    if(drawcall['type'] == 'addCustomCSS') {
      jcmp.ui.CallEvent('minimap_addCustomCSS', JSON.stringify(drawcall));
    }

    if(drawcall['type'] == 'drawText') {
      jcmp.ui.CallEvent('minimap_addText', JSON.stringify(drawcall['data']));
    }

    if(drawcall['type'] == 'drawCircle') {
      jcmp.ui.CallEvent('minimap_addCircle', JSON.stringify(drawcall['data']));
    }
  }
});

jcmp.events.AddRemoteCallable('minimap_removeCSS', identifier => {
  jcmp.ui.CallEvent('minimap_removeCSS', identifier);
});

jcmp.events.AddRemoteCallable('minimap_setVisible', toggle => {
  jcmp.ui.CallEvent('minimap_setVisible', toggle);
});

jcmp.events.AddRemoteCallable('minimap_changeStyle', style => {
  jcmp.ui.CallEvent('minimap_changeStyle', style);
});
