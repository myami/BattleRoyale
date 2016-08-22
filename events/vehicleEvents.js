'use strict';

// vehicle destroyed
events.Add("VehicleDestroyed", function(vehicle) {
    console.log("Vehicle " + vehicle.networkId + " was destroyed.");

    setTimeout(() => {
        vehicle.Respawn();
    }, 5000);
});
