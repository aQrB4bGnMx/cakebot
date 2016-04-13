global.config = require('./config.json');
var Discord = require("discord.js");
global.version = "v1.0.3";

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
    require("./Modules/moderation.js")(cake);

    cake.setStatus("here", version + " by nickforall");
});

cake.on("message", function(message) {
    if(message.content.startsWith("!cake")) {
        var cakeparsable = message.content.slice(5).toLowerCase();
        var _cakecmd = cakeparsable.split(" ");

        var cakecmdname = _cakecmd[1];
        var cakecmdargs = _cakecmd.slice(2);

        if(cakecmdargs === undefined) cakecmdargs = [];

        cake.emit("cakecmd", cakecmdname, cakecmdargs, message);
    } else  if(message.content.startsWith("!")) {
        var parsable = message.content.slice(1).toLowerCase();
        var _cmd = parsable.split(" ");

        var cmdname = _cmd[0];
        var cmdargs = _cmd.slice(1);

        if(cmdargs === undefined) cmdargs = [];

        cake.emit("generalcmd", cmdname, cmdargs, message);
        }
});

cake.on("generalcmd", function(name, args, message){
    if(name == "bots") {
        cake.sendMessage(message.channel,
            "Hello I am cakebot, a machine learning project by Nickforall. " +
            "I am collecting anonymous data from various discord servers. " +
            "Don't worry, only in the servers where I got permission! and " +
            "besides my AI module that is gonna take over the world I am a " +
            "moderater too!");
    }
});
