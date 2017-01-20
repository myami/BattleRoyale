;(function($, document, window, undefined) {
    $(function() {

        var $window = $(window),
            $scoreboard = $('#scoreboard'),
            $players_el = $('#scoreboard .players'),
            $players = [],
            $initialised = false,
            $chat_input_visible = false,
            $toggle_key = 80,
            $is_key_down = false,
            $deathui = $('#deathui'),
            $helpmessage = $('#helpmessage'),
            $deathlist = $('#deathlist'),
            $spawnProtection = $('#spawn-protection'),
            $death_messages = [],
            $deathlist_timeout = false;

        function addPlayer(player) {

            if (typeof findPlayer(player.id) !== 'undefined') {
                return false;
            }

            /*var $el = $('<div class="row" style="color:' + player.colour + ';"> \
                <div class="column" data-element="networkId">' + player.id + '</div> \
                <div class="column" data-element="name">' + player.name + '</div> \
                <div class="column" data-element="kills">' + player.kills + '</div> \
                <div class="column" data-element="deaths">' + player.deaths + '</div> \
            </div>');

            // if they're a nanos official member, insert the nanos icon
            if (player.isAdmin) {
                $el.find('[data-element="name"]').prepend('<img src="imgs/admin.png" />');
            }

            $el.appendTo($players_el);*/
            //player.element = $el;
            $players.push(player);
            return true;
        }

        function destroyPlayer(networkId) {
            var player = findPlayer(networkId);
            if (typeof player === 'undefined') {
                return false;
            }

            //player.element.remove();
            $players.splice($players.indexOf(player), 1);
            return true;
        }

        function updatePlayer(networkId, kills, deaths) {
            var player = findPlayer(networkId);
            if (typeof player === 'undefined') {
                return false;
            }

            /*player.kills = kills;
            player.deaths = deaths;
            player.element.find('[data-element="kills"]').text(player.kills);
            player.element.find('[data-element="deaths"]').text(player.deaths);*/
        }

        function findPlayer(networkId) {
            var result = $.grep($players, function(obj) {
                return obj.id == networkId;
            });

            if (result.length === 0) {
                return undefined;
            }

            return result[0];
        }

        function formatPlayerName(name, colour, isKiller) {
            var format;

            if (typeof name !== 'undefined') {
                format = $('<span />', {
                    text: name,
                    class: isKiller ? 'killer' : 'victim',
                    style: 'color: ' + colour
                });

                if (name.length > 20) {
                    format.addClass('small');
                }
            }

            return format;
        }

        function addDeathMessage(victimId, killerId, reason) {
            jcmp.events.CallRemote("battleroyale_debug_message", "Hola");
            var message = '';
            var found_atleast_one_player = false;

            if (typeof killerId !== 'undefined' && killerId !== victimId) {
                var killer = findPlayer(killerId);
                if (typeof killer !== 'undefined') {
                    var format = formatPlayerName(killer.name, killer.colour, true);
                    message += format[0].outerHTML + ' ';
                    found_atleast_one_player = true;
                }

                message += reason;

                var victim = findPlayer(victimId);
                if (typeof victim !== 'undefined') {
                    var format = formatPlayerName(victim.name, victim.colour, false);
                    message += ' ' + format[0].outerHTML;
                    found_atleast_one_player = true;
                }
            } else {
                var victim = findPlayer(victimId);
                if (typeof victim !== 'undefined') {
                    var format = formatPlayerName(victim.name, victim.colour, false);
                    message += format[0].outerHTML + ' ';
                    found_atleast_one_player = true;
                }

                message += reason;
            }

            // only add the message if we found the player.
            // this fixes issues with empty names in the death list when kills are added before the scoreboard
            // is initialised.
            if (found_atleast_one_player) {
                var message_el = $('<p />').html(message);
                message_el.appendTo($deathlist);
                $deathlist.removeClass('hidden');

                if ($deathlist_timeout) {
                    clearTimeout($deathlist_timeout);
                    $deathlist_timeout = false;
                }

                $death_messages.push(message_el);
                if ($death_messages.length >= 9) {
                    removeDeathMessage($death_messages[0]);
                }

                $deathlist_timeout = setTimeout(function() {
                    $deathlist.addClass('hidden');
                    $deathlist_timeout = false;
                }, 6000);

                return message_el;
            }

            return false;
        }

        function removeDeathMessage(element) {
            element.remove();
            $death_messages.splice($death_messages.indexOf(element), 1);
        }

        jcmp.AddEvent('battleroyale_scoreboard_addplayer', function(data) {
            addPlayer($.parseJSON(data));
        });

        jcmp.AddEvent('battleroyale_scoreboard_updateplayer', function(networkId, kills, deaths) {
            updatePlayer(networkId, kills, deaths);
        });

        jcmp.AddEvent('battleroyale_scoreboard_removeplayer', function(networkId) {
            destroyPlayer(networkId);
        });

        jcmp.AddEvent('battleroyale_initialised', function() {
            $initialised = true;
        });

        jcmp.AddEvent('chat_input_state', function(b) {
            $chat_input_visible = b;
        });

        jcmp.AddEvent('battleroyale_deathui_toggle', function(toggle, killer_name, death_message) {
            if (toggle) {
                if (typeof killer_name !== 'undefined') {
                    $deathui.find('h1').text('You\'ve been ' + death_message + ' by ' + killer_name + '!');
                } else {
                    $deathui.find('h1').text('You\'re dead.');
                }

                $deathui.addClass('visible');
            } else {
                $deathui.removeClass('visible');
            }
        });

        jcmp.AddEvent('battleroyale_player_death', function(networkId, killerId, reason) {
            addDeathMessage(networkId, killerId, reason);
        });

        jcmp.AddEvent('battleroyale_spawn_protection', function(toggle) {
            $spawnProtection.css('opacity', toggle ? '1.0' : '0.0');
        });

        setTimeout(function() {
            jcmp.CallEvent('battleroyale_ready');
        }, 1000);

        $window.keydown(function(event) {
            if (event.which === $toggle_key && $initialised && !$chat_input_visible && !$is_key_down && !$deathui.hasClass('visible')) {
                $scoreboard.addClass('visible');
                $is_key_down = true;
            }
        });

        $window.keyup(function(event) {
            if (event.which === $toggle_key && $initialised && $is_key_down) {
                $scoreboard.removeClass('visible');
                $is_key_down = false;
            }

            // 'x'
            if (event.which === 88 && !$chat_input_visible && $helpmessage.hasClass('visible')) {
                $helpmessage.removeClass('visible');
            }
        });

    });
})(jQuery, document, window);
