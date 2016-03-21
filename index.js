global.config = require('./config.json');
var Discord = require("discord.js");
global.version = "v0.3.11";

var cake = new Discord.Client();

cake.login(config.email, config.pass, function(error, token) {
    if(error) {
        console.log("[AUTH] Failed");
        console.log(error.stack);
        return;
    }

    console.log("[AUTH] Logged in!");
    console.log("[AUTH] Token: " + token);
});

cake.on("ready", function(){
    require("./Modules/privateAI")(cake);
    require("./Modules/twitch")(cake);
    require("./Modules/cake")(cake);

    cake.setStatus("here", version + " by nickforall");
});
