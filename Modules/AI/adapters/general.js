//picks a random response from array
function pickResponse(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

//parses all globally used %variables%
function prepareResponse(res, messageData) {
    var username = messageData.author.name;

    var out;

    //if it's a string just move on, pick a random str from arr otherwise
    if(typeof someVar === 'string') {
        out = res;
    } else {
        out = pickResponse(res);
    }

    return out.replace("%username%", username);
}

module.exports.staticResponse = function(obj, variables, raw, cake) {
    cake.sendMessage(raw.channel, prepareResponse(obj.output, raw));
};
