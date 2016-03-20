var staticdata = require("./AI/ai.json");

module.exports = function(cake) {

    /* statics variable */
    var statics = [];

    /* Helper functions */
    function cleanString(inp) {
        //only keep a-z and spaces, and make all lowercase
        return inp.toLowerCase().replace(/[^a-zA-Z ]/g, "");
    }

    //parses all %variables%
    function prepareResponse(rawOut, messageData) {
        var username = messageData.author.name;

        var out;

        //if it's a string just move on, pick a random str from arr otherwise
        if(typeof someVar === 'string') {
            out = rawOut;
        } else {
            out = pickResponse(rawOut);
        }

        return out.replace("%username%", username);
    }

    //picks a random response from array
    function pickResponse(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    //if it is in an array
    function inArray(needle, haystck) {
        var array = [];

        //prepare our array for parse friendly strings
        haystck.forEach(function(element){
            array.push(element.toLowerCase());
        });

        return array.indexOf(needle) > -1;
    }

    //register static responses
    function registerStaticResponse(obj) {
        statics.push({
            "input": obj.read,
            "output": obj.res
        });
    }

    //sends a response if it matches a static response
    function tryStatic(parsable, message) {
        statics.forEach(function(element){
            if(inArray(parsable, element.input)) {
                cake.sendMessage(message.channel,
                    prepareResponse(element.output, message));
            }
        });
    }

    /* Register statics */

    //greetings
    registerStaticResponse(staticdata.greetings.normal);
    registerStaticResponse(staticdata.greetings.howareyou);

    //generic questions
    registerStaticResponse(staticdata.questions.help);

    //generic statements
    registerStaticResponse(staticdata.statements.negativity);

    //easter eggs
    registerStaticResponse(staticdata.questions.eastereggs.fox);
    registerStaticResponse(staticdata.questions.eastereggs.dogs);
    registerStaticResponse(staticdata.questions.eastereggs.wearing);
    registerStaticResponse(staticdata.questions.eastereggs.dirty);

    /* Event */
    cake.on("message", function(message){
        var parsable = cleanString(message.content);

        //do not respond in channels
        if(!message.channel.isPrivate) {
            if(!parsable.startsWith("hey cakebot")) {
                return;
            } else {
                if(parsable == "hey cakebot") {
                    parsable = "hey";
                } else {
                    parsable = parsable.replace("hey cakebot ", "");
                }
            }
        }

        tryStatic(parsable, message);
    });

    return {};
};
