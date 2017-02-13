console.log('Loading function');

exports.handler = function(event, context) {
    console.log(JSON.stringify(event, null, 2));
    event.Records.forEach(function(record) {
        // Kinesis data is base64 encoded so decode here BLABLABLA
        payload = new Buffer(record.kinesis.data, 'base64').toString('ascii');
        console.log('Decoded payload:', payload);
    });
    context.succeed();
};

/*
incoming event = [ array ]
// read array.0 object
// read array.1 object

for i loop 1 to 5 {

switch array.0.card.i rock
    switch array.1.card.i rock
        score.0 = 0
        score.1 = 0
    switch array.1.card.i paper
        score.0 = 0
        score.1 = 1
    switch array.1.card.i scissors
        score.0 = 1
        score.1 = 0

switch array.0.card.i paper
    switch array.1.card.i rock
        score.0 = 1
        score.1 = 0
    switch array.1.card.i paper
        score.0 = 0
        score.1 = 0
    switch array.1.card.i scissors
        score.0 = 0
        score.1 = 1
        
switch array.0.card.i scissors
    switch array.1.card.i rock
        score.0 = 0
        score.1 = 1
    switch array.1.card.i paper
        score.0 = 1
        score.1 = 0
    switch array.1.card.i scissors
        score.0 = 0
        score.1 = 0

next i
}

if score.0 = score.1
var array.0.user.draws +1
var array.1.user.draws +1

if score.0 > score.1
var array.0.user.wins +1
var array.1.user.lose +1

if score.0 < score.1
var array.0.user.lose +1
var array.1.user.wins +1

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