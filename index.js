global.config = require('./config.json');
var Discord = require("discord.js");
global.version = "v0.4.7";

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

var bot = SinqBot;

cake.on("message", function(message) {
    console.log(message.content)
    if(message.content.startsWith("!") || message.content.startsWith("!cake")) {
        var parsable = message.content.slice(1).toLowerCase();
        var _cmd = parsable.split(" ");

        var cmdname = _cmd[0];
        var cmdargs = _cmd.slice(1);

        if(cmdargs === undefined) cmdargs = [];

        bot.emit("generalcmd", cmdname, cmdargs, message);
    }
});

cake.on("generalcmd", function(name, args, message){
    if(name == "bots") {
        bot.sendMessage(message.channel,
            "Hello I am cakebot, a machine learning project by Nickforall. " +
            "I am collecting anonymous data from various discord servers, and" +
            "besides my AI module that is gonna take over the world I am a " +
            "moderater too!");
    }
});
