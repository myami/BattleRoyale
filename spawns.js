
"use strict";

let spawns = module.exports;

spawns.spawn = [
  {x: 3360.0, y: 3342.0, z: 0.0 },
  {x: 3450.0, y: 3242.0, z: 0.0 }
];

spawns.possibleDrops = [
  {n: 'WEAPON_COUGAR', h: 0x08D4BE52, ammo: 1 },
  {n: 'WEAPON_KNIFE', h: 0x99B507EA, ammo: 1 },
  {n: 'WEAPON_NIGHTSTICK', h: 0x678B81B1, ammo: 1 },
  {n: 'WEAPON_HAMMER', h: 0x4E875F73, ammo: 1 },
  {n: 'WEAPON_BAT', h: 0x958A4A8F, ammo: 1 },
  {n: 'WEAPON_GOLFCLUB', h: 0x440E4788, ammo: 1 },
  {n: 'WEAPON_CROWBAR', h: 0x84BD7BFD, ammo: 1 },
  {n: 'WEAPON_PISTOL', h: 0x1B06D571, ammo: 80 },
  {n: 'WEAPON_COMBATPISTOL', h: 0x5EF9FEC4, ammo: 80 },
  {n: 'WEAPON_APPISTOL', h: 0x22D8FE39, ammo: 80 },
  {n: 'WEAPON_PISTOL50', h: 0x99AEEB3B, ammo: 80 },
  {n: 'WEAPON_MICROSMG', h: 0x13532244, ammo: 250 },
  {n: 'WEAPON_SMG', h: 0x2BE6766B, ammo: 250 },
  {n: 'WEAPON_ASSAULTSMG', h: 0xEFE7E2DF, ammo: 110 },
  {n: 'WEAPON_ASSAULTRIFLE', h: 0xBFEFFF6D, ammo: 250 },
  {n: 'WEAPON_CARBINERIFLE', h: 0x83BF0278, ammo: 250 },
  {n: 'WEAPON_ADVANCEDRIFLE', h: 0xAF113F99, ammo: 5 },
  {n: 'WEAPON_MG', h: 0x9D07F764, ammo: 200 },
  {n: 'WEAPON_COMBATMG', h: 0x7FD62962, ammo: 200 },
  {n: 'WEAPON_PUMPSHOTGUN', h: 0x1D073A89, ammo: 80 },
  {n: 'WEAPON_SAWNOFFSHOTGUN', h: 0x7846A318, ammo: 110 },
  {n: 'WEAPON_ASSAULTSHOTGUN', h: 0xE284C527, ammo: 110 },
  {n: 'WEAPON_BULLPUPSHOTGUN', h: 0x9D61E50F, ammo: 110 },
  {n: 'WEAPON_STUNGUN', h: 0x3656C8C1, ammo: 1 },
  {n: 'WEAPON_SNIPERRIFLE', h: 0x05FC3C11, ammo: 20 },
  {n: 'WEAPON_HEAVYSNIPER', h: 0x0C472FE2, ammo: 10 },
  {n: 'WEAPON_GRENADELAUNCHER', h: 0xA284510B, ammo: 5 },
  {n: 'WEAPON_GRENADELAUNCHER_SMOKE', h: 0x4DD2DC56, ammo: 7 },
  {n: 'WEAPON_RPG', h: 0xB1CA77B1, ammo: 5 },
  {n: 'WEAPON_STINGER', h: 0x687652CE, ammo: 5 },
  {n: 'WEAPON_GRENADE', h: 0x93E220BD, ammo: 10 },
  {n: 'WEAPON_STICKYBOMB', h: 0x2C3731D9, ammo: 5 },
  {n: 'WEAPON_SMOKEGRENADE', h: 0xFDBC8A50, ammo: 20 },
  {n: 'WEAPON_BZGAS', h: 0xA0973D5E, ammo: 1 },
  {n: 'WEAPON_MOLOTOV', h: 0x24B17070, ammo: 15 },
  {n: 'WEAPON_BRIEFCASE', h: 0x88C78EB7, ammo: 1 },
  {n: 'WEAPON_BRIEFCASE_02', h: 0x01B79F17, ammo: 1 },
  {n: 'WEAPON_FLARE', h: 0x497FACC3, ammo: 15 },
  {n: 'WEAPON_SPECIALCARBINE', h: 0xC0A3098D, ammo: 200 },
  {n: 'WEAPON_HEAVYPISTOL', h: 0xD205520E, ammo: 80 },
  {n: 'WEAPON_SNSPISTOL', h: 0xBFD21232, ammo: 80 },
  {n: 'WEAPON_BULLPUPRIFLE', h: 0x7F229F94, ammo: 200 },
  {n: 'WEAPON_DAGGER', h: 0x92A27487, ammo: 1 },
  {n: 'WEAPON_VINTAGEPISTOL', h: 0x083839C4, ammo: 80 },
  {n: 'WEAPON_FIREWORK', h: 0x7F7497E5, ammo: 5} ,
  {n: 'WEAPON_MUSKET', h: 0xA89CB99E, ammo: 50 },
  {n: 'WEAPON_HEAVYSHOTGUN', h: 0x3AABBBAA, ammo: 110 },
  {n: 'WEAPON_MARKSMANRIFLE', h: 0xC734385A, ammo: 10 },
  {n: 'WEAPON_HOMINGLAUNCHER', h: 0x63AB0442, ammo: 5 },
  {n: 'WEAPON_PROXMINE', h: 0xAB564B93, ammo: 4 },
  {n: 'WEAPON_RAILGUN', h: 0x6D544C99, ammo: 1 },
  {n: 'WEAPON_HATCHET', h: 0xF9DCBF2D, ammo: 1 }
];

spawns.dropSpawn = [
	{x: 3360.0, y: 1114.0, z: 0.0 }
];

spawns.LoadDrops = function() {
	
  // Just for test more spawns than 1
  /*for(let i = 0; i < 100; i++) {
    let dropSpawnRND = { x: gm.utility.RandomFloat(0.0, 5550.0), y: gm.utility.RandomFloat(0.0, 2000.0), z: gm.utility.RandomFloat(0.0, 100.0) };
    spawns.dropSpawn.push(dropSpawnRND); 
  }*/
  // -----------

	for(let dropPos of spawns.dropSpawn) {
		let spawnPos = new Vector3f(dropPos.x, dropPos.y, dropPos.z);
		let rnd = gm.utility.RandomInt(0, spawns.possibleDrops.length - 1);
		let rndAmmo = gm.utility.RandomInt(1, spawns.possibleDrops[rnd].ammo);
    //console.log("Spawning in pos " + spawnPos.x + ", " + spawnPos.y + ", " + spawnPos.z + "\nweapon: " + spawns.possibleDrops[rnd].n + " ammo: " + rndAmmo + "\n");
	}

};

