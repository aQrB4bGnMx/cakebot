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
    process.on('exit', function(code) {
        self.exitProcedure();
    });

    process.on('SIGHUP', function () {
        self.exitProcedure();
    });

    process.on('SIGINT', function () {
        self.exitProcedure();
    });

    console.log("[MODULE][GAMES] Initialized!");
}

GameWatcher.prototype.save = function(game, user, diff){
    if(this.data[user] === undefined) this.data[user] = {};

    if(this.data[user][game] === undefined) {
        this.data[user][game] = diff;
    } else if(this.data[user][game] > 0) {
        this.data[user][game] += diff;
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
    if(this.data[raw.author.id] === undefined) {
        cake.sendMessage(raw.channel, "It doesn't look like you play games... What a sad life...");
    } else {
        var res = "";
        var dataobj = this.data[raw.author.id];

        res+= "To my knowledge, you played these games:";
        res+= "```";

        for (var game in dataobj) {
            var readable = aiUtils.secondsToReadable(dataobj[game]);
            res += game + " - " + readable.h + "h " + readable.m + "m " + readable.s + "s ";

            switch(game.toLowerCase()) {
                case "portal 2":
                    res += "(Probably a lie..)";
                    break;
                case "portal":
                    res += "(I am so delicious and moist)";
                    break;
                case "half life 3":
                    res += "(Confirmed?!)";
                    break;
                case "space engineers":
                    res += "(Trust me, I'm an engineer he said)";
                    break;
                case "with cakebot":
                    res += "(Can confirm.)";
                    break;
            }

            res += '\n';
        }

        res += "```";

        cake.sendMessage(raw.channel, res);
    }
};



module.exports = GameWatcher;
