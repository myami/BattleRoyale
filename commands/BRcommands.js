'use strict';



const utility = require('../gm/utility');


module.exports = function({ Command, manager }) {
manager.category('battleroyale', 'BattleRoyale related commands')


// debug commands
    .add(new Command('incircle')
    .timeout(180000)
    .description('Check if you are in the circle')
    .handler((player) => {
    if(battleroyale.utility.IsPointInCircle(player.position, battleroyale.config.game.lobbypos, 100.0)) {
    battleroyale.chat.send(player,"You are in the circle");
    } else {
    battleroyale.chat.send(player,"You're not in the circle");
    }
    }))

      .add(new Command('restart')
      .timeout(180000)
      .description('Restart the server')
      .handler((player) => {
      battleroyale.chat.send(player,"Server restarting...");
      console.log("Server restarting...");
      server.Restarts();
      }))

       .add(new Command('roundTime')
       .timeout(180000)
       .description('Check the time of the round')
       .handler((player) => {
       battleroyale.chat.send(player,battleroyale.utility.PutCero(timeLeft.minutes) + ":" + battleroyale.utility.PutCero(timeLeft.seconds));
        }))

            .add(new Command('inbattlearea')
            .timeout(180000)
            .description('Check if you are in the area ')
            .handler((player) => {
            if(battleroyale.utility.IsPointInCircle(player.position, battleArea.position, battleArea.radius)) {
        	  battleroyale.chat.send(player,"You are in range of battle area circle");
            } else {
        	  battleroyale.chat.send(player,"You aren't in range of battle area circle");
        	  }
           }))
             .add(new Command('survival')
             .timeout(180000)
             .description('Check the time of the round')
             .handler((player) => {
             battleroyale.chat.send(player,battleroyale.utility.PutCero(timeLeft.minutes) + ":" + battleroyale.utility.PutCero(timeLeft.seconds));
             }))
                .add(new Command('reducearea')
                .timeout(180000)
                .description('Reduced area of battle')
                .handler((player) => {
                 clearInterval(global.AreaTimer);
                 battleroyale.events.OnBattleAreaChange();
                 // Start the interval again
                 global.AreaTimer = setInterval(function() {
                 battleroyale.events.OnBattleAreaChange();
                 }, battleroyale.utility.minutes(3));
                 }))

       .add(new Command('seespawns')
       .timeout(180000)
       .description('See the coordinate of the spawns')
       .handler((player) => {
       for(let i = 0; i < battleroyale.spawns.spawn.length; i++) {
       let data = battleroyale.spawns.spawn[i];
       battleroyale.chat.send(player,i + ": " + " X: " + data.x + " Y: " + data.y + " Z: " + data.z);
       }
       }))
         .add(new Command('endBattle')
         .timeout(180000)
         .description('End the battleroyale')
         .handler((player) => {
         clearTimeout(global.EndTimer);
   	     battleroyale.events.OnBattleEnd();
         }))

     .add(new Command('startBattle')
     .timeout(180000)
     .description('start the battleroyale')
     .handler((player) => {
     console.log("battle started!");
     clearTimeout(beingStartTimer);
     battleroyale.events.OnBattleStart();
     }))

  .add(new Command('gplayers')
  .timeout(180000)
  .description('Player in game')
  .handler((player) => {
   console.log("Players: " + g_players.length);
   }))

   .add(new Command('positions')
   .timeout(1)
   .description('Give the XYZ position of hte player')
   .handler((player) => {
        battleroyale.chat.send(player," X: " + player.position.x + " Y: " + player.position.y + " Z: " + player.position.z);

   }))

//normal commands

   .add(new Command('promoteadmin')
   .timeout(180000)
   .description('Promote an admin')
   .handler((player, args) => {

      if(PlayerInfo[player.name].adminlvl < 3) {
        return battleroyale.chat.send(player,"Vous n'avez pas accès a cette commande.");
      }

      if (args.length === 0) {
        return battleroyale.chat.send(player,"Utilisation: /promoteadmin [id or name] [adminlvl]", red);
      }

      let adminlvl = parseInt(args[1]);

      if(isNaN(adminlvl)) {
        battleroyale.chat.send(player,"Admin Level must be a number")
      }

      let targets = battleroyale.utility.getPlayer(args[0], false);

      if (targets.length === 0) {
        return battleroyale.chat.send(player,"Cible inconnue.", red);
      }
      else if (targets.length > 1) {
        let msg = "Plusieurs cibles trouvées: ";
        for (let p of targets) {
          msg += p.name + ", ";
        }
        msg = msg.slice(0, msg.length - 2);
        return battleroyale.chat.send(player,msg, red);
      }

      if(!pLogged[targets[0].name]) {
        return battleroyale.chat.send(player,"This user was not logged");
      }


      PlayerInfo[targets[0].name].adminlvl = adminlvl;

      if(battleroyale.events.onPlayerUpdate(targets[0])) {
        battleroyale.chat.send(player,"[ADMIN] Vous avez promu " + targets[0].name + " admin: " + adminlvl);
        targets[0].SendChatMessage("[ADMIN] Vou savez été promu admin: " + adminlvl + " par " + player.name);
      } else {
        battleroyale.chat.send(player,"[ERROR] An error ocurred when trying to upload player info of " + targets[0].name)
      }
    }))


    .add(new Command('register')
    .timeout(180000)
    .description('Create an ingame account')
    .handler((player, args) => {
      let password = args.join(" ");

    if(pLogged[player.name]) {
      return battleroyale.chat.send(player,"Vous êtes déjà enregistré.");
    }

    let connection = battleroyale.utility.dbConnect();

    connection.connect();

    connection.query("SELECT username FROM users WHERE username = '" + player.name + "'", function(err, results) {

      let numRows = results.length;

      if(numRows >= 1) {
        connection.end();
        return battleroyale.chat.send(player,"Vous etes déjà enregistré, connectez vous avec: /login [Motdepasse]");
      }
    });

    //let confirreg; // Variable que se asigna al jugador para que confirme la pwd

    if(ConfirmReg[player.name])
    {
      if(ConfirmPwd[player.name] == password)
      {
        var sha1 = require('sha1');
        password = connection.escape(password);
        let pwdhash = sha1(password);
        console.log("Hash created: " + pwdhash);
        let SQLQuery = "INSERT INTO users (username, password) VALUES ('" + player.name+ "','" + pwdhash + "');";
        connection.query(SQLQuery, function(err) {

          if(!err) {
              console.log("user "+ player.name + " registered sucesfull \n\n");
              battleroyale.chat.send(player,"Vous avez été inscrit avec succès");
              connection.query("SELECT id FROM users WHERE username = '" + player.name + "'", function(err2, results)
              {
                    PlayerInfo[player.name].id = results[0].id;


                    battleroyale.events.onPlayerUpdate(player);
                    pLogged[player.name]  = true;

                  });
                connection.end();
          } else {
              console.log("Ha ocurrido un error al registrar al jugador \n\n");
              console.log("Error: " + err)
              battleroyale.chat.send(player,"Une erreur est survenue pendant votre inscription, Essayez a nouveaux" + err);
          }

        });


      } else {
        battleroyale.chat.send(player,"Les mot de passes ne correspondent pas, Essayez à nouveaux");
        ConfirmPwd[player.name] = "";
        ConfirmReg[player.name] = false;
      }

    } else {
      ConfirmPwd[player.name] = password;
      ConfirmReg[player.name] = true;
      battleroyale.chat.send(player,"Pour confirmer votre inscription tapez à nouveaux la commande /register [motdepasse]");
    }
     }))




     .add(new Command('login')
     .timeout(180000)
     .description('login youre account')
     .handler((player, args) => {
       if(!Registered[player.name]) {
           return battleroyale.chat.send(player,"Vous n'etes pas inscrit, Pour vous inscrire tapez la commande: /register [motdepasse]");
         } else {

           let password = args.join(" ");

           let connection = battleroyale.utility.dbConnect();
           connection.connect();
           var sha1 = require('sha1');
           password = connection.escape(password);
           let pwdhash = connection.escape(sha1(password));
           let playername = connection.escape(player.name);
           console.log(playername);
           let SQLQuery = "SELECT * FROM users WHERE username = " + playername + " AND password = " + pwdhash;
           console.log(SQLQuery);

           connection.query(SQLQuery, function(err, results) {
             let num_rows = results.length;

             if(num_rows >= 1) {

               if(results[0].banned) {
                 player.Kick("Vous avez été bannis du serveur");
               }
               let stringLicenses = JSON.stringify(results[0]);
               console.log(stringLicenses);
               battleroyale.events.onPlayerLogin(player, results[0]);

               battleroyale.chat.send(player,"Connection réussie");

             } else {
               battleroyale.chat.send(player,"Mot de passe incorrect, Réessayez.")
             }

           });

           connection.end();

         }      }))


         .add(new Command('update')
         .timeout(180000)
         .description('update data')
         .handler((player,args) => {
           if (args.length < 1) {
               return battleroyale.chat.send(player,"Utilisation: /update");
             }
             if(PlayerInfo[player.name].adminlvl < 3) {
               return battleroyale.chat.send(player,"Vous n'avez pas accès a cette commande.");
             }
                 battleroyale.events.updateAllPlayers();          }))










};
