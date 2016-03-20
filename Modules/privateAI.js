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

    function inArray(needle, haystck) {
        var array = [];

        haystck.forEach(function(element){
            array.push(element.toLowerCase());
        });

        return array.indexOf(needle) > -1;
    }

    cake.on("message", function(message){
        var parsable = cleanString(message.content);

        //do not respond in channels
        if(!message.channel.isPrivate) return;

        //greetings
        if(inArray(parsable, staticdata.greetings.normal)) {
            cake.sendMessage(message.author,
                prepareResponse(staticdata.greetings.normalresponses, message));
        }

        if(inArray(parsable, staticdata.greetings.howareyou)) {
            cake.sendMessage(message.author,
                prepareResponse(staticdata.greetings.howareyouresponses, message));
        }

        if(inArray(parsable, staticdata.questions.help)) {
            cake.sendMessage(message.author,
                prepareResponse(staticdata.questions.helpresponses, message));
        }
    });

    return {};
};
