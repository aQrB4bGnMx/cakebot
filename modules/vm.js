var vm = require("vm");
var util = require('util');


module.exports = function(cake) {
    var cleanSand = {cake: "A lie"};
    var sandbox = {cake: "A lie"};

    cake.on("message", function(message) {
        var cmd = message.content.toLowerCase().split(" ");

        if(cmd[0] == ":js") {
            if(cmd[1] == "manage") {
                if(cmd[2] == "reset") {
                    sandbox = cleanSand;
                }
            } else {
                var js = message.content.replace(":js ", "");
                console.log("[JSVM] " + message.author + " ran :js");
                try {
                    var result = vm.runInNewContext(js, sandbox);
                    cake.sendMessage(message.channel, "```-> " + result + "```");
                } catch(err) {
                    cake.sendMessage(message.channel, "Error:\n" + "`" + err.name + "`");
                    cake.sendMessage(message.author, "Error while executing. ```" + err.stack + "```");
                }
            }
        }
    });

    return {};
};
