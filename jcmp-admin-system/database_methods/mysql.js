var MySQLMethods = class MySQLMethods {

    static databaseConnection() {

        this.mysql = require('mysql');
        this.connection = this.mysql.createConnection(adminsys.config.mysql);
        var self = this;

        this.connection.connect(function (err) {
            if (err) {
                console.log("Can't find the database trying to create it automatically");

                this.end();

                self.connection = self.mysql.createConnection({
                    host: adminsys.config.mysql.host,
                    user: adminsys.config.mysql.user,
                    password: adminsys.config.mysql.password,
                    multipleStatements: true
                });

                self.connection.connect(function (err) {
                    if (err) throw err;

                    var query = `CREATE DATABASE IF NOT EXISTS ${adminsys.config.mysql.database} DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;`
                    //console.log(query);

                    self.connection.query(query, function (err) {
                        if (err) throw err;

                        const fs = require('fs');
                        let SQL = fs.readFileSync(__dirname + '/../adminsys.sql', "utf8");

                        self.connection.changeUser(adminsys.config.mysql, function (err) {
                            if (err) throw err;


                            self.connection.query(SQL, function (err) {
                                if (err) throw err;
                                console.log("Database schema created sucesfully");
                            });
                        });
                    });
                });
            } else {

                // TODO: Check if the table exists
                console.log("[AdminSYS] MYSQL Database connected");
            }
        })
    }

    static PlayerReady(player) {

        var query = `SELECT * FROM banlist WHERE steamId = ?`

        this.connection.query(query, player.client.steamId, function (err, result) {

            if (err) return console.log(err);

            if (result.length >= 1 && adminsys.config.banonjoin) {
                if (result[0].date_end < Date.now() && result[0].date_end !== 0) {
                    var query = `DELETE FROM banlist WHERE steamid = ?`;

                    this.connection.query(query, player.client.steamId, function (err, result) {
                        if (err) {
                            return console.log(err)
                        }
                        console.log("Ban for " + player.name + " ended, deleting from banlist collection");
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

                    jcmp.events.Call('toast_show', player, toastData);
                    adminsys.workarounds.watchPlayer(player, setTimeout(() => player.Kick(banReason), 5000));
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
            }
        });
    }

    static PlayerCreated(player) {

        var query = `SELECT rank FROM admins WHERE steamid = ?;`;
        this.connection.query(query, player.client.steamId, function (err, result) {
            if (result.length >= 1) {
                player.admin.rank = result[0].rank;
            } else {
                player.admin.rank = 0;
            }
        });
    }

    static updateBanlist(player) {
        var query = `SELECT * FROM banlist ORDER BY date_start DESC LIMIT 35;`;

        this.connection.query(query, function (err, result) {
            if (!err) {
                jcmp.events.CallRemote('adminsys/server/res/update_banlist', player, JSON.stringify(result));
            } else {
                console.log(err);
            }
        })
    }

    static searchBanPlayer(player, data) {

        var validFilters = ['steamid', 'name'];

        if (validFilters.indexOf(data.filter) === -1) {
            return console.log(new Error('Invalid filter type: ' + data.filter));
        }

        var query = `SELECT * FROM banlist WHERE LOWER(${data.filter}) LIKE LOWER(?) ORDER BY date_start DESC LIMIT 35;`;

        this.connection.query(query, (data.value + '%'), function (err, result) {
            if (err) return console.log(err);

            jcmp.events.CallRemote('adminsys/server/res/update_banlist', player, JSON.stringify(result));
        });
    }

}

MySQLMethods.actions = class Actions {

    static banPlayer(player, target, data, banData) {

        if (target.admin.rank >= 1) {
            var query = `DELETE FROM admins WHERE steamid = ?;`;
            MySQLMethods.connection.query(query, target.client.steamId, function (err, result) {
                if(err) { console.log(query); return console.log(err); }
                console.log(target.name + " demoted as admin REASON: banned");
            });

        }

        var query2 = `INSERT INTO banlist (name, steamid, reason, bannedby_name, bannedby_steamId, date_start, date_end) VALUES (?,?,?,?,?,${banData.date_start},${banData.date_end});`;

        MySQLMethods.connection.query(query2, banData.name, banData.steamId, banData.reason, banData.bannedby.name, banData.bannedby.steamId,
            function (err, result) {
                if (err) { console.log("QUERY: " + query2); return console.log(err); }

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

            });

    }

    static setAdminRank(target, data) {
        var query = `SELECT * FROM admins WHERE steamid = ?`
        MySQLMethods.connection.query(query, target.client.steamId, function(err, result) {
            if(result.length >= 1) {
                // UPDATE
                var query2 = `UPDATE admins SET rank = ? WHERE steamid = ?`;
                MySQLMethods.connection.query(query2, data.rank, target.client.steamId, function(err, result) {
                    if(err) return console.log(err);

                    console.log("Player updated");                   
                });
            } else {
                // INSERT

                var query2 = `INSERT INTO admins VALUES(?,?,${data.rank})`;
                MySQLMethods.connection.query(query2, target.client.steamId, target.name, function(err, result) {
                    if(err) return console.log(err);

                    console.log("Inserted new admin");
                });
            }
        });
    }

    static unbanPlayer(targetData) {
        var query = `DELETE FROM banlist WHERE steamid = ?`;

        MySQLMethods.connection.query(query, targetData.client.steamId, function(err, result) {
            if(err) return console.log(err);

            console.log(targetData.name + " removed from the banlist");
        });
    }

}

module.exports = MySQLMethods;