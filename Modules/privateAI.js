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
    function registerStaticResponse(inp, outp) {
        statics.push({
            "input": inp,
            "output": outp
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
    registerStaticResponse(staticdata.greetings.normal, staticdata.greetings.normalresponses);
    registerStaticResponse(staticdata.greetings.howareyou, staticdata.greetings.howareyouresponses);

    //generic questions
    registerStaticResponse(staticdata.questions.help, staticdata.questions.helpresponses);

    //generic statements
    registerStaticResponse(staticdata.statements.negativity, staticdata.statements.negativityres);

    //easter eggs
    registerStaticResponse(staticdata.questions.eastereggs.fox, staticdata.questions.eastereggs.foxres);
    registerStaticResponse(staticdata.questions.eastereggs.dogsout, staticdata.questions.eastereggs.dogsoutres);
    registerStaticResponse(staticdata.questions.eastereggs.wearing, staticdata.questions.eastereggs.wearingres);
    registerStaticResponse(staticdata.questions.eastereggs.talkdirty, staticdata.questions.eastereggs.talkdirtyres);

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
