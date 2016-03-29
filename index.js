global.config = require('./config.json');
var Discord = require("discord.js");
global.version = "v0.4.0";

var cake = new Discord.Client();

if(config.bot.isbot) {
    cake.loginWithToken("Bot " + config.bot.bottoken, authCallback);
} else {
    cake.login(config.email, config.pass, authCallback);
}

function authCallback(error, token){
    if(error) {
        console.log("[AUTH] Failed");
        console.log(error.stack);
        return;
    }

    console.log("[AUTH] Logged in!");
    console.log("[AUTH] Token: " + token);
}

cake.on("ready", function(){
    require("./Modules/privateAI")(cake);
    require("./Modules/twitch")(cake);
    require("./Modules/cake")(cake);

    cake.setStatus("here", version + " by nickforall");
});
