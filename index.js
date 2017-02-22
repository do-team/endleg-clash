var AWS = require("aws-sdk");
module.exports.dbCall = dbCall;
exports.handler = function(event, context) {
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

    var p1WinScore = 0;
    var p2WinScore = 0;
    var p1DrawScore = 0;
    var p2DrawScore = 0;
    var p1LoseScore = 0;
    var p2LoseScore = 0;

    // Main loop to cycle all cards, to find a winner
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
        if (p1WinScore > p2WinScore) {
        var ultimateWinnerP1 = 1;
        var ultimateLoserP2 = 1;
        }
        if (p2WinScore > p1WinScore) {
        var ultimateLoserP1 = 1;
        var ultimateWinnerP2 = 1;
        }
        if (p2WinScore = p1WinScore) {
        var ultimateDrawP1 = 1;
        var ultimateDrawP2 = 1;
        }
        console.log('P1 Score: ', p1WinScore);
        console.log('P2 Score: ', p2WinScore);

        callback();
    };

    // This function will perform DynamoDB write
    dbCall = function(params) {
        console.log('Call DBWrite Update function with these parameters: ', params);
    };

    // We would like to prepare parameters for both players, based on output of MAIN function.
    main(function(dbCall) {
        for (i = 0; i <= 1; i++) {
            console.log('Poskladej parametry pro hrace i');
            params = i + " = cislo cyklu";
            console.log(params);
            dbCall(params);
        }

    });

};
// Callback function to store data into dynamo.
/*
var updateUserParams = {
    TableName:endleg-main,
    Key:{
        "user": incoming[0].user,
    },
    UpdateExpression: "remove info.actors[0]",
    ConditionExpression: "fightflag > :flag",
    ExpressionAttributeValues:{
        ":flag":0
    },
    ReturnValues:"UPDATED_NEW"
};



updateScoreParams Table = endleg-score
                Key: user
                Update: Wins
                        Draws
                        Lose
                        History = []
                        LastCombination

var params = {
    TableName:table,
    Key:{
        "year": year,
        "title": title
    },
    UpdateExpression: "remove info.actors[0]",
    ConditionExpression: "size(info.actors) > :num",
    ExpressionAttributeValues:{
        ":num":3
    },
    ReturnValues:"UPDATED_NEW"
};

console.log("Attempting a conditional update...");
docClient.update(params, function(err, data) {
    if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    }
});

*/