var DiscordClient = require('discord.io');
var config = require('./config.json');
var events;

var bot = new DiscordClient({
    autorun: config.autorun,
    email: config.email,
    password: config.pass
});



bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ")");
});

bot.on('message', function(user, userID, channelID, message, rawEvent) {

});
