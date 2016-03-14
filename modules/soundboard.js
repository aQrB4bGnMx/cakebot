var path = require("path");
var fs = require("fs");

module.exports = function(cake) {
    var server = cake.servers.get("id", config.voip.server);
    var channel = server.channels[1]; //static because cache didn't work

    var files = fs.readdirSync(path.join(__dirname, "sound"));

    cake.joinVoiceChannel(channel, function(error, conn){
        console.log("[VOIP] Joined voicechannel");
        conn.playFile(path.join(__dirname, "sound", "active.wav"), function(err){
        });

        cake.on("message", function(message){
            var cmd = message.content.toLowerCase().split(" ");

            if(cmd[0] == ":voip") {
                if(cmd.length == 1) {
                    var response = "";
                    for (i = 0; i < files.length; i++) {
                        response += "(" + i + ") " + files[i] + "\n";
                    }
                    cake.sendMessage(message.channel, "Available sounds: \n" + response);
                } else {
                    //:voip play
                    if(cmd[1] == "play") {
                        if(cmd[2] !== undefined) {
                            //check whether the file exists
                            fs.stat(path.join(__dirname, "sound", cmd[2] + ".wav"), function(err, stats) {
                                if(err) {
                                    cake.reply(message, "Could not access that file :(");
                                    return;
                                } else {
                                    conn.playFile(path.join(__dirname, "sound", cmd[2] + ".wav"), function(err){
                                        console.log("[VOIP] " + message.author.name + " played " + cmd[2]);
                                    });
                                }
                            });
                        }
                    } else if (cmd[1] == "stahp" || cmd[1] == "stop") {
                        conn.stopPlaying();
                    }
                }
            }
        });
    });

    return {};
};
