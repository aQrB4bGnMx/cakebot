global.config = require('./config.json');
var Discord = require("discord.js");
global.version = "v0.4.2b";

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

//fancy stops when ctrl+c or when someone pushes the big red button
//TODO: de-uglify.. worst code ever. Sorry
process.on('exit', function(code) {
    if(code == 500) {
        process.exit(0);
        return;
    }

    cake.logout();
    console.log("Please wait...");
    console.log("While we ready your cakebot instance for a safe quit...");
    setTimeout(function () {
        process.exit(500);
    }, 2000);
});

process.on('SIGHUP', function () {
    cake.logout();
    console.log("Please wait...");
    console.log("While we ready your cakebot instance for a safe quit...");
    setTimeout(function () {
        process.exit(500);
    }, 2000);
});

process.on('SIGINT', function () {
    cake.logout();
    console.log("Please wait...");
    console.log("While we ready your cakebot instance for a safe quit...");
    setTimeout(function () {
        process.exit(500);
    }, 2000);
});
