/*
 * THIS CODE IS DEPRECATED AND NOT USED IN CAKEBOT ANYMORE!
 *
 * CODE SHOULD NOT BE REMOVED, BECAUSE IT MIGHT COME BACK IN NEWER CAKEBOT
 * VERSIONs.
 */

var jsonfile = require('jsonfile');
var path = require("path");
var aiUtils = require("../AiUtils");

function timestamp() {
    return Math.floor(Date.now() / 1000);
}

function timediff(time) {
    return timestamp() - time;
}

function GameWatcher(bot) {
    var self = this;
    this.bot = bot;
    this.playdata = {};
    this.file = path.join(__dirname, "games", "data.json");

    this.loadReachedUsers();

    try{
        this.data = jsonfile.readFileSync(this.file);
    } catch(e) {
        console.log("[GAMES] Fatal exception, turn off games.js module or restart after fixing.");
        throw e;
    }

    this.bot.on("presence", function(userbefore, user) {
        if(userbefore.game === user.game) return;

        //dude is no longer playing x
        if(user.game !== null && userbefore.game === null) {
            if(self.playdata[user.id] === undefined) return;
            try {
                //save old game
                self.save(user.game.name, user.id, timediff(self.playdata[user.id]));
                //unset local data
                self.playdata[user.id] = undefined;
                return;
            } catch(e) {
                console.log("[GAMES] Could not log " + user.name + "'s game switch :('");
                console.log(e.stack);
            }
        }

        //dude is now playing x
        if(user.game === null && userbefore.game !== null) {
            try {
                self.playdata[user.id] = timestamp();
                return;
            } catch(e) {
                console.log("[GAMES] Could not log " + user.name + "'s game switch :('");
                console.log(e.stack);
            }
        }

        //dude switched from game x to game y
        if(user.game !== userbefore.game) {
            try {
                //save old game
                if(self.playdata[user.id] !== undefined)
                    self.save(userbefore.game.name, user.id, timediff(self.playdata[user.id]));
                //reset localdata
                self.playdata[user.id] = timestamp();

                return;
            } catch(e) {
                console.log("[GAMES] Could not log " + user.name + "'s game switch :('");
                console.log(e.stack);
            }
        }
    });

    setInterval(function () {
        self.saveToFile();
    }, 15 * 1000);

    //fancy stops when ctrl+c or when someone pushes the big red button
    /*process.on('exit', function(code) {
        self.exitProcedure();
    });

    process.on('SIGHUP', function () {
        self.exitProcedure();
    });

    process.on('SIGINT', function () {
        self.exitProcedure();
    });*/

    console.log("[MODULE][GAMES] Initialized!");
}

GameWatcher.prototype.save = function(game, user, diff){
    if(this.data[user] === undefined) this.data[user] = {};

    var escapedGame = game.replace(new RegExp("\n", "g"), " ");

    if(this.data[user][escapedGame] === undefined) {
        this.data[user][escapedGame] = diff;
    } else if(this.data[user][escapedGame] > 0) {
        this.data[user][escapedGame] += diff;
    }
};

GameWatcher.prototype.saveToFile = function() {
    try {
        jsonfile.writeFileSync(this.file, this.data, {spaces: 2});
        return;
    } catch(e) {
        console.log("[GAMES] Could not save memory data to hard drive :('");
        console.log(e.stack);
        return;
    }
};

GameWatcher.prototype.loadReachedUsers = function() {
    var self = this;
    var users = this.bot.users;
    //get all the users in reach
    for (var i = 0; i < users.length; i++) {
        if(users[i].game !== null)
            self.playdata[users[i].id] = timestamp();
    }
};

GameWatcher.prototype.exitProcedure = function() {
    var self = this;
    var users = this.bot.users;

    //get all the users in reach that are registered by playerdata
    for (var i = 0; i < users.length; i++) {
        if(users[i].game !== null && self.playdata[users[i].id])
            this.save(users[i].game.name, users[i].id, timediff(self.playdata[users[i].id]));
            //save all the data!
    }

    jsonfile.writeFileSync(this.file, this.data, {spaces: 2});
    return;
};

GameWatcher.prototype.respondPlayedGames = function(obj, variables, raw, cake) {
    if(this.data[raw.author.id] === undefined && raw.author.game === null) {
        cake.sendMessage(raw.channel, "It doesn't look like you play games... What a sad life...");
    } else {
        var res = "";
        var dataobj;

        if(this.data[raw.author.id] !== undefined){
            dataobj = this.data[raw.author.id];
        } else  {
            dataobj = {};
        }

        res+= "To my knowledge, you played these games:";
        res+= "```";

        //if the game is not in data file nor is finished playing
        if(raw.author.game !== null && dataobj[escapeTomsGames(raw.author.game.name)] === undefined) {
            res+= createGameListLine(raw.author.game.name, timediff(this.playdata[raw.author.id]));
        }

        for (var game in dataobj) {
            var secs = dataobj[game];

            //if the dude is still playing.
            if(raw.author.game !== null && escapeTomsGames(raw.author.game.name) == game) {
                secs += timediff(this.playdata[raw.author.id]);
            }

            res += createGameListLine(game, secs);
        }

        res += "```";

        cake.sendMessage(raw.channel, res);
    }
};

function createGameListLine(game, secs){
    var out = "";

    var readable = aiUtils.secondsToReadable(secs);

    out += escapeTomsGames(game) + " - " + readable.h + "h " + readable.m + "m " + readable.s + "s ";

    switch(game.toLowerCase()) {
        case "portal 2":
            out += "(Probably a lie..)";
            break;
        case "portal":
            out += "(I am so delicious and moist)";
            break;
        case "half life 3":
            out += "(Confirmed?!)";
            break;
        case "space engineers":
            out += "(Trust me, I'm an engineer he said)";
            break;
        case "with cakebot":
            out += "(Can confirm.)";
            break;
    }

    out += '\n';

    return out;
}

function escapeTomsGames(game){
    var escapedGame = game.replace(new RegExp("\n", "g"), " ");
    return escapedGame;
}

module.exports = GameWatcher;
