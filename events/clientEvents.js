'use strict';

// client connect
events.Add("ClientConnected", function(client) {
  console.log("Client (ip: " + client.ipAddress + ") connected.");
});

// client disconnect
events.Add("ClientDisconnected", function(client, reason) {
  console.log("Client (ip: " + client.ipAddress + ") disconnected. Reason: " + (reason === 1 ? "Timeout" : "Normal quit"));
});