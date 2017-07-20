
module.exports = ({ Command, manager }) => {
  manager.category('admin', 'only usable by admins')
    .add(new Command('showbans').description('List 50 bans from the database order by day desc').handler(function() {

      adminsys.mongodb.connect(adminsys.config.mongodb.url, function(err, db) {
        var collection = db.collection('banlist');

        //collection.find({ $query: {}, $orderby: { "date_ban": -1 } }).limit(35).toArray(function(err, result) {
        collection.find({}).sort({ date_start: -1 }).limit(35).toArray(function(err, result) {
          console.log("BanList result:");
          if(err) {
            console.log(err);
          } else {
            console.log(result);
          }
          db.close();
        });
      });

  }))

  .add(new Command('createRandomBans').description('Insert random people into the banlist').handler(function(player) {

      //Creates a first name with 2-3 syllables

      var firstNameSyllables = new Array();
      firstNameSyllables.push("mon");
      firstNameSyllables.push("fay");
      firstNameSyllables.push("shi");
      firstNameSyllables.push("zag");
      firstNameSyllables.push("blarg");
      firstNameSyllables.push("rash");
      firstNameSyllables.push("izen");

      var banList = [];


      for(var c = 0; c < 100; c++) {

        var firstName = "";
        var numberOfSyllablesInFirstName = Math.floor(Math.random() * (2 - 4)) + 4;
        for (var i = 0; i < numberOfSyllablesInFirstName; i++)
        {
            firstName += firstNameSyllables[Math.floor(Math.random() * (2 - firstNameSyllables.length)) + firstNameSyllables.length];
        }

        var firstNameLetter = "";
        firstNameLetter = firstName.substring(0,1);
        firstName = firstName.slice(0,1);
        firstNameLetter = firstNameLetter.toUpperCase();
        firstName = firstNameLetter + firstName;


        var randomSteamId = Math.floor(Math.random() * (76561198030848247 - 77000000000000000)) + 77000000000000000;
        console.log(randomSteamId);

        var dateVariablities = [1000, 60000, 3600000, 86400000];
        var dateType = Math.floor(Math.random() * (0 - (dateVariablities.length - 1)) + (dateVariablities.length - 1));
        console.log(dateType);
        var dateTimeRndNumber = Math.floor(Math.random() * (1 - 20) + 20);
        var randomDateEnd = new Date().getTime() + dateVariablities[dateType];
        console.log(randomDateEnd)
        var randomDateStart = new Date().getTime() - (dateVariablities[dateType]*dateTimeRndNumber);
        //76561198030848245
        //77000000000000000
        banList.push({ name: firstName, steamId: randomSteamId.toString(),  date_start: randomDateStart, date_end: randomDateEnd, bannedby: { name: 'Jhon cena', steamId: '289593298347'} });
      }

      //console.log(banList);

      // Insert data


      adminsys.mongodb.connect(adminsys.config.mongodb.url, function(err, db) {


        var collection = db.collection('banlist');

        collection.insert(banList, function(err, records) {
          adminsys.chat.send(player, "Inserted " + records.length + " records");
        });

      });


      // Store name in array generate random steamId
      // Insert into database
  }))

}
