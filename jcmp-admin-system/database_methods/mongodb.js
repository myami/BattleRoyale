'use strict';

var MongoMethods = class Mongo {

    static databaseConnection() {
        console.log("[AdminSYS] Checking the connection to the mongoDB Server");
        adminsys.mongodb.connect(adminsys.config.mongodb.url, function (err, db) {
            if (err) {
                console.error(err);

            } else {
                console.log("[AdminSYS] MongoDB Server: " + adminsys.config.mongodb.url + " is connected");
            }

            db.close();
        });
    }

    static PlayerReady(player) {
        adminsys.mongodb.connect(adminsys.config.mongodb.url, function (err, db) {

            var collection = db.collection('banlist');
            collection.find({
                steamId: player.client.steamId
            }).toArray(function (err, result) {
                if (result.length >= 1 && adminsys.config.banonjoin) {
                    if (result[0].date_end < Date.now() && result[0].date_end !== 0) {
                        collection.deleteOne({
                            steamId: player.client.steamId
                        }, function (err, result) {
                            console.log("Ban for " + player.name + " ended, deleting from banlist collection");
                            db.close();
                        });
                    } else {
                        // Kick player

                        var banReason = (typeof (result[0].reason) !== 'undefined' ? "<br>Reason: " + result[0].reason : '')
                        adminsys.chat.send(player, "You are banned until: " + (result[0].date_end >= 1 ? new Date(result[0].date_end) : 'Permanent'));

                        var toastData = {
                            heading: "You're banned",
                            text: "You are banned until: <br>" + (result[0].date_end >= 1 ? new Date(result[0].date_end) : 'Permanent') + "<br><br>" + banReason,
                            icon: 'error',
                            showHideTransition: 'slide',
                            position: 'mid-center',
                            hideAfter: 4500
                        };

                        //console.log(toastData);
                        jcmp.events.Call('toast_show', player, toastData);
                        adminsys.workarounds.watchPlayer(player, setTimeout(() => player.Kick(banReason), 5000));
                        db.close();
                    }
                } else {
                    if (player.admin.rank >= 1) {
                        //console.log("Calling to the adminsys ready event");
                        jcmp.events.CallRemote('adminsys_ready', player, JSON.stringify({
                            name: player.escapedNametagName,
                            networkId: player.networkId,
                            admin: player.admin
                        }))
                    }
                    db.close();
                }
            });
        });
    }

    static PlayerCreated(player) {
        adminsys.mongodb.connect(adminsys.config.mongodb.url, function (err, db) {
            var collection = db.collection('admins');

            collection.find({
                steamId: player.client.steamId
            }).toArray(function (err, result) {
                if (err) {
                    //console.error(err);
                    db.close();
                    return console.log(err);
                }

                if (result.length === 0) {
                    player.admin.rank = 0;
                } else {
                    player.admin.rank = result[0].rank;
                }
                db.close();
            });
        });
    }

    static updateBanlist(player) {
        adminsys.mongodb.connect(adminsys.config.mongodb.url, function (err, db) {
            var collection = db.collection('banlist');

            collection.find({}).sort({
                date_start: -1
            }).limit(35).toArray(function (err, result) {
                if (!err) {
                    /*console.log("BanList result:");
                    console.log(result);*/

                    jcmp.events.CallRemote('adminsys/server/res/update_banlist', player, JSON.stringify(result));
                }
                db.close();
            });
        });
    }

    static searchBanPlayer(player, data) {

        adminsys.mongodb.connect(adminsys.config.mongodb.url, function (err, db) {

            var collection = db.collection('banlist');

            var findQuery = {};
            // '' + data.filter + '': new RegExp('^' + data.value, 'i')
            findQuery[data.filter] = new RegExp('^' + data.value, 'i');
            //console.log(findQuery);

            collection.find(findQuery).sort({
                date_start: -1
            }).limit(35).toArray(function (err, result) { // Limited to 35 more can crash server
                //console.log(result);
                if (!err) {
                    jcmp.events.CallRemote('adminsys/server/res/update_banlist', player, JSON.stringify(result));
                }
                db.close();
            });
        });
    }

}

MongoMethods.actions = class Actions {

    static banPlayer(player, target, data, banData) {
        adminsys.mongodb.connect(adminsys.config.mongodb.url, function (err, db) {

            // If is admin delete from admin list

            if (target.admin.rank >= 1) {
                var admcollection = db.collection('admins');
                admcollection.deleteOne({
                    steamId: target.client.steamId
                }, function (err, result) {
                    db.close();
                });
            }

            var collection = db.collection('banlist');
            // Insert ban
            collection.insertOne(banData, function (err, result) {
                var banTime;

                if (parseInt(data.time) === 0) {
                    banTime = 'permanent';
                } else {
                    banTime = data.time + " " + data.timeType;
                }

                var banText = `${player.escapedNametagName} banned ${target.escapedNametagName}. ` + banTime + " " + (data.reason.length > 0 ? `Reason: ${data.reason}` : '');

                var banToastText = `<b>${player.escapedNametagName}<b> banned you ${banTime} <br>` + (data.reason.length > 0 ? `REASON: ${data.reason}` : '');

                jcmp.events.Call('toast_show', target, {
                    heading: 'Banned',
                    text: banToastText,
                    icon: 'error',
                    loader: true,
                    loaderBg: '#9EC600',
                    position: 'mid-center',
                    hideAfter: 4500
                });

                adminsys.chat.broadcast(banText, adminsys.config.colours.orange);
                adminsys.workarounds.watchPlayer(target, setTimeout(() => target.Kick(data.reason), 5000));
                console.log(banText);
                db.close();
            });
        });
    }

    static setAdminRank(target, data) {

        adminsys.mongodb.connect(adminsys.config.mongodb.url, function (err, db) {

            // Get the documents collection
            var collection = db.collection('admins');
            // Insert some documents

            collection.find({
                steamId: target.client.steamId
            }).toArray(function (err, result) {

                if (err) {
                    console.error(err);
                    db.close();
                    return;
                }

                if (result.length == 0) {
                    // Insert admin
                    if (data.rank >= 1) {
                        collection.insertOne({
                            name: target.name,
                            rank: data.rank,
                            steamId: target.client.steamId
                        }, function (err, result) {
                            console.log("Added admin to the database")
                            db.close();
                        });
                    }
                } else {
                    if (data.rank === 0) {
                        // Delete from admin table
                        collection.deleteOne({
                            steamId: target.client.steamId
                        }, function (err, result) {
                            console.log("Deleted admin from table");
                            db.close();
                        });
                    } else {
                        // Update from admin table
                        collection.updateOne({
                            steamId: target.client.steamId
                        }, {
                            $set: {
                                rank: data.rank
                            }
                        }, function (err, result) {
                            console.log("Updated admin rank!");
                            db.close();
                        });
                    }
                }

                target.admin.rank = data.rank;

                db.close();

            });
        });
    }

    static unbanPlayer(targetData) {
          adminsys.mongodb.connect(adminsys.config.mongodb.url, function(err, db) {

        var collection = db.collection('banlist');

        collection.deleteOne({ steamId: targetData.steamId.toString() }, function(err, result) { // Limited to 35 more can crash server
        //console.log(result);
        if(!err) {
            //jcmp.events.CallRemote('adminsys/server/res/update_banlist', player, JSON.stringify(result));
            console.log(result.result.n);
            // FIXME Add msg to cnfirm the unban
        }
        db.close();
        });
    });
    }

}

module.exports = MongoMethods;