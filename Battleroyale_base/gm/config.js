module.exports = {
    // Admin basic list
    admins: [
        "76561198030848245", // Daranix
        "76561198065687510" // Myami
    ],

    game: {
        lobby: {
            pos: new Vector3f(-13574.3154296875, 1267.666748046875, 15097.6630859375),
            radius: 1000
        },
        battle_StartRadius: 2000,
        minPlayers: 10,
        timeToStart: 120000, // Start time of the battle when reach the min players on miliseconds
        airplanes: false // TODO: Battles with airplanes ^^
    }

    
}