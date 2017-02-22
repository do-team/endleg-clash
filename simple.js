var AWS = require("aws-sdk");

exports.handler = function(event, context) {
dbCall = function(params) {
    console.log('Call DBWrite Update function with these parameters: ', params);
};

main = function() {
    for (i = 0; i <= 1; i++) {
        console.log('Prepare parameters to be written for player i');
        var params = i + " = something";
        console.log(params);
        dbCall(params);
    }
}

main();
};