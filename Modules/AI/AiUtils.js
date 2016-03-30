//picks a random response from array
module.exports.pickResponse = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
};

//parses all globally used %variables%
module.exports.prepareResponse = function(res, messageData) {
    var username = messageData.author.name;

    var out;

    //if it's a string just move on, pick a random str from arr otherwise
    if(typeof someVar === 'string') {
        out = res;
    } else {
        out = module.exports.pickResponse(res);
    }

    return out.replace("%username%", username);
};

module.exports.secondsToReadable = function(secs){
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return obj;
}
