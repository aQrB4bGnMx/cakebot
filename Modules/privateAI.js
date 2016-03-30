var datafile = require("./AI/ai.json");

var generic = require("./AI/adapters/general.js");

module.exports = function(cake) {

    /* statics variable */
    var statics = [];
    /* dynamic inputs */
    var dynamics = [];

    /* Helper functions */
    function cleanString(inp) {
        //only keep a-z and spaces, and make all lowercase
        return inp.toLowerCase().replace(/[^a-zA-Z ]/g, "");
    }

    //parses all globally used %variables%
    function prepareResponse(rawOut, messageData) {
        var username = messageData.author.name;

        var out;

        //if it's a string just move on, pick a random str from arr otherwise
        if(typeof rawOut === 'string') {
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
            "output": obj.res,
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

    //registers a dynamic input
    function registerDynamicListener(obj, callback, scope){
        var re;

        if(typeof obj.read === 'string') {
            re = new RegExp(obj.read.replace(/%var%/g, '([a-z0-9\\s]+)'));
        } else {
            re = [];
            obj.read.forEach(function(element) {
                re.push(new RegExp(element.replace(/%var%/g, '([a-z0-9\\s]+)')));
            });
        }

        dynamics.push({
            "input": re,
            "output": obj.res,
            "callback": callback,
            "scope": scope
        });
    }

    //finds a match with dynamic inputs
    function tryDynamic(parsable, message, scope) {
        dynamics.forEach(function(element) {
            try {
                if(typeof element.input === 'string') {

                    if(element.input.test(parsable))
                        element.callback.apply(element.scope, [element, getVariables(element.input, parsable), message, cake]);

                } else {
                    element.input.forEach(function(el) {
                        if(el.test(parsable)) element.callback.apply(element.scope, [element, getVariables(el, parsable), message, cake]);
                    });
                }

            } catch(err) {
                console.log("[MODULES][AI][ERROR] " + err.stack);
            }
        });
    }

    //gets the variables from our regex pattern
    function getVariables(repattern, input){
        return repattern.exec(input).slice(1);
    }

    /* Start constant event readers */

    var GameWatcher = require("./AI/adapters/games");
    var games = new GameWatcher(cake);

    /* Register statics */

    //greetings
    registerStaticResponse(datafile.greetings.normal);
    registerStaticResponse(datafile.greetings.howareyou);

    //generic questions
    registerStaticResponse(datafile.questions.help);

    //generic statements
    registerStaticResponse(datafile.statements.negativity);

    //easter eggs
    registerStaticResponse(datafile.questions.eastereggs.fox);
    registerStaticResponse(datafile.questions.eastereggs.dogs);
    registerStaticResponse(datafile.questions.eastereggs.wearing);
    registerStaticResponse(datafile.questions.eastereggs.dirty);
    registerStaticResponse(datafile.questions.eastereggs.meaninglife);

    /* Register dynamics */

    //generic questions
    registerDynamicListener(datafile.questions.opinion, generic.staticResponse, this);
    registerDynamicListener(datafile.questions.whybecause, generic.staticResponse, this);

    //actual data questions
    registerDynamicListener(datafile.questions.info.games, games.respondPlayedGames, games);

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

        try {
            tryStatic(parsable, message);
            tryDynamic(parsable, message);
        } catch(err) {
            console.log("[MODULES][AI][ERROR] " + err.stack);
        }
    });

    return {};
};
