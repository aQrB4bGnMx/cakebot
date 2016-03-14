var config = require('./config.json');
var Discord = require("discord.js");

var cake = new Discord.Client();

cake.loginWithToken(config.token, config.email, config.pass, function(error, token) {
    if(error) {
        console.log("[AUTH] Failed");
        console.log(error.stack);
        return;
    }

    console.log("[AUTH] Logged in!");
    console.log("[AUTH] Token: " + token);
});

cake.on("ready", function(){
    cake.setStatus("here", "owned by @nickforall", function(err){
        if(err) console.log(err.stack);
    });

    require("./modules/cakeinfo")(cake);
    require("./modules/soundboard")(cake);

});
