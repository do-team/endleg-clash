var AWS = require("aws-sdk");

exports.handler = function(event, context) {
    //console.log('Pure event:', event);
    //console.log('Event Records:', event.Records);
    //console.log('Event Records SNS:', event.Records[0].Sns);
    //console.log('Event Records SNS Message:', event.Records[0].Sns.Message); // This contains exactly the message we are sending by batch.
    var incoming = JSON.parse(event.Records[0].Sns.Message);
    console.log('Player one: ', incoming[0].user, 'VS Player two: ', incoming[1].user);
    console.log(incoming[0].card1);
    console.log(incoming[1].card1);

    var combinations = {rock : {name: "rock", defeats: ["scissors","lizard"]},
                     paper: {name: "paper", defeats: ["rock", "spock"]},
                     scissors: {name: "scissors", defeats: ["paper", "lizard"]},
                     lizard: {name: "lizard", defeats:["paper","spock"]},
                     spock: {name: "spock", defeats:["scissors","rock"]}
                    };

    var p1WinScore = 0;
    var p2WinScore = 0;
    var p1DrawScore = 0;
    var p2DrawScore = 0;
    var p1LoseScore = 0;
    var p2LoseScore = 0;

    for (battle = 1; battle < 6; battle++) {
        var card = 'card' + battle;
        console.log(card);
        console.log(incoming[0].card, incoming[1].card);
        if(incoming[0].card === incoming[1].card){
            console.log("It's a tie on round: ", battle);
            p1DrawScore++;
            p2DrawScore++;
        } else {
        var leadCard = combinations[incoming[0].card];
        var victory = leadCard.defeats.indexOf(incoming[1].card) > -1;

            //Display result
            if(victory) {
                console.log("Player ", incoming[0].user, " defeats ", incoming[1].user, " (", incoming[0].card, " beats ", incoming[1].card ,")." );
                p1WinScore++;
                p2LoseScore++;
            }else{
                console.log("Player ", incoming[1].user, " defeats ", incoming[0].user, " (", incoming[1].card, " beats ", incoming[0].card ,")." );
                p1LoseScore++;
                p2WinScore++;
            }
        }
    }
};


/*
    //Improved check, inspired by Mke Spa Guy
    var victory = userChoice.defeats.indexOf(computerChoice) > -1;

    //Display result
    if(victory) {
        alert("Vitory! " + userChoice.name + " wins!")
    }else{
        alert("Defeat, " + computerChoice + " wins!");
    }
}

*/



/*


db user update: key array.0.user.fighflag = 0
db user update: key array.1.user.fighflag = 0

db score update key array.0.user {
    wins
    draws
    lose
    history [array.0.card.1 + array.0.card.2 + array.0.card.3 + array.0.card.4 + array.0.card.5 VS array.1.card.1 + array.1.card.2 + array.1.card.3 + array.1.card.4 + array.1.card.5]
}

db score update key array.1.user {
    wins
    draws
    lose
    history [array.1.card.1 + array.1.card.2 + array.1.card.3 + array.1.card.4 + array.1.card.5 VS array.0.card.1 + array.0.card.2 + array.0.card.3 + array.0.card.4 + array.0.card.5]
}


*/


/*

//Check for a tie
if(computerChoice == userChoice){
    alert("It's a tie");
//Check for a valid choice
}else if(choices[userChoice] === undefined){
    alert("Invalid Choice");
}else{
    //Get the chosen one as an object
    userChoice = choices[userChoice];



    //Check For a win
    /*var victory = false;
    for(var i = 0; i < userChoice.defeats.length; i++){
        if(computerChoice == userChoice.defeats[i])
        {
            victory = true;
            break;
        }
    }*/
/*
    //Improved check, inspired by Mke Spa Guy
    var victory = userChoice.defeats.indexOf(computerChoice) > -1;

    //Display result
    if(victory) {
        alert("Vitory! " + userChoice.name + " wins!")
    }else{
        alert("Defeat, " + computerChoice + " wins!");
    }
}

*/