var AWS = require("aws-sdk");

exports.handler = function(event, context) {
    // Update of AWS config to reach DynamoDB
    AWS.config.update({
      region: "eu-central-1",
      endpoint: "dynamodb.eu-central-1.amazonaws.com"
    });
    var docClient = new AWS.DynamoDB.DocumentClient();
    // Parsing incoming object from SNS, result is incoming array with two users and their cards.
    var incoming = JSON.parse(event.Records[0].Sns.Message);
    console.log('Player one >>> ', incoming[0].user, ' <<<   VS   Player two >>> ', incoming[1].user + ' <<< ');
    // Definitions of winning conditions
    var combinations = {
        rock: {
            name: "rock",
            defeats: ["scissors", "lizard"]
        },
        paper: {
            name: "paper",
            defeats: ["rock", "spock"]
        },
        scissors: {
            name: "scissors",
            defeats: ["paper", "lizard"]
        },
        lizard: {
            name: "lizard",
            defeats: ["paper", "spock"]
        },
        spock: {
            name: "spock",
            defeats: ["scissors", "rock"]
        }
    };

    // Call DBWrite Update function with these parameters
    docClient.update(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
    var params0 = [];
    var params1 = [];
    // Main loop to cycle all cards, to find a winner and to prepare parameters for DB Update.
    main = function(callback) {
        for (battle = 1; battle < 6; battle++) {
            card = ["card" + battle];
            console.log(incoming[0][card], incoming[1][card]);
            if (incoming[0][card] === incoming[1][card]) {
                console.log("Draw! Round: ", battle);
                p1DrawScore++;
                p2DrawScore++;
            } else {
                var leadCard = combinations[incoming[0][card]];
                var victory = leadCard.defeats.indexOf(incoming[1][card]) > -1;

                //Display result
                if (victory) {
                    console.log("Player ", incoming[0].user, " defeats ", incoming[1].user, " (", incoming[0][card], " beats ", incoming[1][card], ").");
                    p1WinScore++;
                    p2LoseScore++;
                } else {
                    console.log("Player ", incoming[1].user, " defeats ", incoming[0].user, " (", incoming[1][card], " beats ", incoming[0][card], ").");
                    p1LoseScore++;
                    p2WinScore++;
                }
            }
        }

        var params0 = {
        "user" : incoming[0].user,
        "wins" : p1WinScore,
        "lose" : p1LoseScore,
        "draw" : p1DrawScore,
        "lastcombo" : incoming[0].card1 + incoming[0].card2 + incoming[0].card3 + incoming[0].card4 + incoming[0].card5,
        }

        var params1 = {
        "user" : incoming[1].user,
        "wins" : p2WinScore,
        "lose" : p2LoseScore,
        "draw" : p2DrawScore,
        "lastcombo" : incoming[1].card1 + incoming[1].card2 + incoming[1].card3 + incoming[1].card4 + incoming[1].card5,
        }
        docClient.update(params0, function(err, data) {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                }
            });
        docClient.update(params1, function(err, data) {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                }
            });
    }

/*    main = function() {
        for (i = 0; i <= 1; i++) {
            console.log('Prepare parameters to be written for player i');
            var params = i + " = something";
            console.log(params);
            dbCall(params);
        }
   }
*/
    main();
};