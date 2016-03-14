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

        if(message.content === ":cake kill" && message.author.id == config.owner)
            process.exit(1);

        if(message.content === ":cake info server") {
            var server = message.channel.server;
            var chanString = "";

            for (i = 0; i < server.channels.length; i++) {
                var c = server.channels[i];
                chanString += c.type + "#" + c.id + " > " + c.name + "\n";
            }

            cake.sendMessage(message.channel, "```" + server.id + ": \n\n" + chanString + "```");
        }

    });

    return {};
};
