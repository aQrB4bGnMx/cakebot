var staticdata = require("./AI/ai.json");
var request = require("request");
var jsonfile = require('jsonfile');
var path = require("path");

module.exports = function(cake) {
    var twitchuser = "sinqnew";
    var url = "https://api.twitch.tv/kraken/streams/" + twitchuser;
    var dataobj = {"live": false};
    var chan = "125322705837883392";
    var datafile = path.join(__dirname, "twitch", "data.json");

    try {
        dataobj = jsonfile.readFileSync(datafile);
    } catch(err) {
        console.log(err.stack);
    }

    function testLive() {
        request({
        url: url,
        json: true
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                processBody(body);
            } else {
                if(error) {
                    console.log(error.stack);
                    return;
                }
                console.log("STATUS: " +  response.statusCode);
            }
        });
    }

    function processBody(body) {
        if(body.stream === null) {
            dataobj.live = false;
            jsonfile.writeFileSync(datafile, dataobj);
            //console.log("BETA: Sinq not live");
            return;
        }

        if(dataobj.live === true) {
            return;
        }

        dataobj.live = true;
        try {
            jsonfile.writeFileSync(datafile, dataobj);
            console.log(body);
            cake.sendMessage(chan, "Sinq is now live: https://www.twitch.tv/sinqnew ! \nPlaying: " +
                                    body.stream.game + "\nTitle: " + body.stream.channel.status);
        } catch(err) {
            console.log(err.stack);
        }
    }

    setInterval(testLive, 20000);

    return {};
};
