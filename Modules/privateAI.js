var staticdata = require("./AI/ai.json");

module.exports = function(cake) {
    function cleanString(inp) {
        return inp.toLowerCase().replace(/[^a-zA-Z ]/g, "");
    }

    function prepareResponse(rawOut, messageData) {
        var username = messageData.author.name;

        var out;

        if(typeof someVar === 'string') {
            out = rawOut;
        } else {
            out = pickResponse(rawOut);
        }

        return out.replace("%username%", username);
    }

    function pickResponse(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    cake.on("message", function(message){
        var parsable = cleanString(message.content);

        //do not respond in channels
        if(!message.channel.isPrivate) return;
        console.log(parsable);

        if(staticdata.greetings.normal.indexOf(parsable) > -1) {
            cake.sendMessage(message.author,
                prepareResponse(staticdata.greetings.normalresponses, message));
        }
    });

    return {};
};
