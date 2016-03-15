require("../config.json");

module.exports = function(cake) {
    cake.on("message", function(message){
        if(message.content === ":cake info")
            cake.sendMessage(message.channel, "Hello, my name is Cakebot. \nI am a bot configured to automoderate, provide info, and have some fun. \nFor any issues contact @Nickforall");

        if(message.content === ":cake info channel")
            cake.sendMessage(message.channel, "```" + message.channel + " "+ message.channel.name + ": " +
            message.channel.topic + " - P" + message.channel.position + "```");

        if(message.content === ":cake info me"){
            var rolesString = "";
            var roles = message.channel.server.rolesOfUser(message.author);
            for (i = 0; i < roles.length; i++) {
                rolesString += (i === 0 ? "" : " ,") + roles[i].name;
            }
            cake.sendMessage(message.channel, "```#" + message.author.id + " " + message.author.username + ":" +
            message.author.discriminator + "\nRoles: " + rolesString + "```");
        }

        if(message.content === ":cake kill" && message.author.id == config.owner) {
            cake.sendMessage(message.channel, "You just keep on trying \n'til you run out of cake.\n" +
                                              "And the science gets done\nFor the people who are still alive.");
            setTimeout(function(){
                process.exit(0);
            }, 1000);
        }

        if(message.content === ":cake source")
            cake.sendMessage(message.channel, "You wanna see my source code? If you know what I mean \n" +
                                              "https://github.com/Nickforall/cakebot");

        if(message.content === ":cake info server") {
            var server = message.channel.server;
            var str = serializeServerChannels(server);

            cake.sendMessage(message.channel, "```" + server.id + ": \n\n" + str + "```");
        }

        if(message.content === ":cake dev servers") {
            var out = "";

            message.client.servers.forEach(function(element) {
                var s = element;
                out += "```#" + s.id + " > " + s.name + "\n\n" + serializeServerChannels(s) + "```\n";
            });

            cake.sendMessage(message.author, out);
        }

        function serializeServerChannels(server) {
            var chanString = "";

            for (i = 0; i < server.channels.length; i++) {
                var c = server.channels[i];
                chanString += c.type + "#" + c.id + " > " + c.name + "\n";
            }

            return chanString;
        }

    });

    return {};
};
