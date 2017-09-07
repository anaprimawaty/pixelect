// Fixed an error with character replacement, removed a dependency, included imports, throw errors, and fixed global variables
var crypto = require('crypto');

//remove a dependency on b64url
function atob(str) {
    return new Buffer(str, 'base64').toString('binary');
}

//this is not used here, but to leave it out would be like passing the salt without the pepper.
function btoa(str) {
    return new Buffer(str, 'utf8').toString('base64');
}

function parseSignedRequest(signedRequest, secret) {
    var encodedData = signedRequest.split('.');
    // decode the data
    var sig = encodedData[0];
    var json = atob(encodedData[1]);
    var data = JSON.parse(json); // ERROR Occurs Here!

    console.log(secret);		
    // check algorithm - not relevant to error
    if (!data.algorithm || data.algorithm.toUpperCase() != "HMAC-SHA256") {
        throw Error('Unknown algorithm: ' + data.algorithm + '. Expected HMAC-SHA256');
    }

    // check sig - not relevant to error
    var expectedSig = crypto.createHmac('sha256', secret).update(encodedData[1].toString()).digest('base64').replace(/\+/g,'-').replace(/\//g,'_').replace('=','');
    if (sig !== expectedSig) {
        throw Error('Invalid signature: ' + sig + '. Expected ' + expectedSig);
    }

    return data;
}

module.exports = parseSignedRequest;
