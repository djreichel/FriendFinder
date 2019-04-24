// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var friends = require("../data/friends.js");


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {

    // app.use "public" to access html and css docs
    app.use(express.static("app/public"));

    // API GET Requests
    app.get("/api/survey", function(req, res) {
        res.json(survey);
    });


  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a survey... this data is then sent to the server...
  // Then the server saves the data to the friends array)
  // ---------------------------------------------------------------------------

  app.post("/api/friends", function(req, res) {
   
        //Comparing user with their best friend match 
        var totalDifference = 0;
        //Object to hold the best match
        var bestMatch = {
            name: "",
            photo: "",
            friendDifference: 1000
        };

        // Here we take the result of the user's survey POST and parse it.
        var userData = req.body;
        var userName = userData.name;
        var userScores = userData.scores;
        // Converting the users score to a number (Instead of string)
        var b = userScores.map(function(item) {
            return parseInt(item, 10);
        });
        
        userData = {
            "name": req.body.name,
            "photo": req.body.photo,
            "scores": b
        }
        console.log("Name: " + userName);
        console.log("User Score " + userScores);
        // Converting the users score to a sum number (Adds up all the numbers in array)
        var sum = b.reduce((a, b) => a + b, 0);
        console.log("Sum of users score " + sum);
        console.log("Best match friend diff " + bestMatch.friendDifference);

        // Loop through all the friend possibilities in the database. 
        for (var i = 0; i < friends.length; i++) {

            console.log(friends[i].name);
            totalDifference = 0;
            console.log("Total Diff " + totalDifference);
            console.log("Best match friend diff " + bestMatch.friendDifference);
        
            var bfriendScore = friends[i].scores.reduce((a, b) => a + b, 0);
            console.log("Total friend score " + bfriendScore);
            totalDifference += Math.abs(sum - bfriendScore);
            console.log(" -------------------> " + totalDifference);
            if (totalDifference <= bestMatch.friendDifference) {

                // Reset the bestMatch to be the new friend. 
                bestMatch.name = friends[i].name;
                bestMatch.photo = friends[i].photo;
                bestMatch.friendDifference = totalDifference;
                // }

            }
            console.log(totalDifference + " Total Difference");

        }
        console.log(bestMatch);
        // Finally save the user's data to the database (this has to happen AFTER the check. otherwise,
        // the database will always return that the user is the user's best friend).
        friends.push(userData);
        console.log("New User added");
        console.log(userData);
        // Return a JSON with the user's bestMatch. This will be used by the HTML in the next page. 
        res.json(bestMatch);

    });
}

