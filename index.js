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

    for (i = 0; i < 2; i++) {
        incoming[i].winScore = 0;
        incoming[i].loseScore = 0;
        incoming[i].drawScore = 0;
        incoming[i].wins = 0;
        incoming[i].lose = 0;
        incoming[i].draw = 0;
    }

    // Main loop to cycle all cards, to find a winner and to prepare parameters for DB Update.
    main = function(callback) {
        for (battle = 1; battle < 6; battle++) {
            card = ["card" + battle];
            console.log(incoming[0][card], incoming[1][card]);
            if (incoming[0][card] === incoming[1][card]) {
                console.log("Draw! Round: ", battle);
                incoming[0].drawScore++;
                incoming[1].drawScore++;
            } else {
                var leadCard = combinations[incoming[0][card]];
                var victory = leadCard.defeats.indexOf(incoming[1][card]) > -1;
                //Display result
                if (victory) {
                    console.log("Player ", incoming[0].user, " defeats ", incoming[1].user, " (", incoming[0][card], " beats ", incoming[1][card], ").");
                    incoming[0].winScore++;
                    incoming[1].loseScore++;
                } else {
                    console.log("Player ", incoming[1].user, " defeats ", incoming[0].user, " (", incoming[1][card], " beats ", incoming[0][card], ").");
                    incoming[0].loseScore++;
                    incoming[1].winScore++;
                }
            }
        }
        // Evaluation of who is real overall winner (could be shortened).
        if (incoming[0].winScore > incoming[1].winScore) {
            incoming[0].wins = 1;
            incoming[1].lose = 1;
        } else if (incoming[0].winScore < incoming[1].winScore) {
            incoming[1].wins = 1;
            incoming[0].lose = 1;
        } else {
            incoming[1].draw = 1;
            incoming[0].draw = 1;
        }

        for (i = 0; i <= 1; i++) {
            var paramsScore = {
                "TableName": 'endleg-score',
                Item: {
                    "user": incoming[i].user,
                    "wins": incoming[i].wins,
                    "lose": incoming[i].lose,
                    "draw": incoming[i].draw,
                    "lastcombo": incoming[i].card1 + ", " + incoming[i].card2 + ", " + incoming[i].card3 + ", " + incoming[i].card4 + ", " + incoming[i].card5
                }
            }

            var paramsMain = {
                TableName: 'endleg-main',
                Key:{
                    "user": incoming[i].user
                },
                UpdateExpression: "set fightflag = :flag",
                ExpressionAttributeValues:{
                    ":flag":0
                },
                ReturnValues:"Updated FightFlag!"
            };


            docClient.put(paramsScore, function(err, data) {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                }
            });

            docClient.update(paramsMain, function(err, data) {
                            if (err) {
                                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                            } else {
                                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                            }
                        });
        }

    }

    main();
};
