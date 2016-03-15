var vm = require("vm");
var util = require('util');
var path = require('path');
var rootDir = path.dirname(require.main.filename);

module.exports = function(cake) {
    var cleanSand = {cake: "A lie", version: version}; //when resetting object
    var sandbox = JSON.parse(JSON.stringify(cleanSand));

    cake.on("message", function(message) {
        var cmd = message.content.toLowerCase().split(" ");

        if(cmd[0] == ":js") {
            if(cmd[1] == "manage") {
                if(cmd[2] == "reset") {
                    sandbox = JSON.parse(JSON.stringify(cleanSand)); //ugly way of copying object
                    cake.sendMessage(message.channel, "The sandbox has been reset");
                    console.log("[JSVM] " + message.author.name + "@" + message.channel.id + " resetted sandbox");
                }
            } else {
                var js = message.content.replace(":js ", "");
                console.log("[JSVM] " + message.author.name + "@" + message.channel.id + " executed javascript: " + js);
                try {
                    var result = vm.runInNewContext(js, sandbox, {timeout: 10000});
                    cake.sendMessage(message.channel, "```-> " + result + "```");
                } catch(err) {
                    //if execution failed, send stack in pm
                    var stack = err.stack.replace(new RegExp(rootDir, 'g'), "cakebot-vm"); //replace server directory
                    cake.sendMessage(message.channel, "Error: " + "`" + err.toString() + "`\nStack in PM");
                    cake.sendMessage(message.author, "Error while executing. ```" + stack + "```");
                }
            }
        }
    });

    return {};
};
