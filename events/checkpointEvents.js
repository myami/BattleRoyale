'use strict';

// checkpoint enter
events.Add("CheckpointEnter", function(checkpoint, player) {
    player.SendChatMessage("enter checkpoint " + checkpoint.networkId, new RGB(0, 255, 0));
});

// checkpoint leave
events.Add("CheckpointLeave", function(checkpoint, player) {
    player.SendChatMessage("leave checkpoint " + checkpoint.networkId, new RGB(0, 255, 0));
});
