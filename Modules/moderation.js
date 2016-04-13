module.exports = function(cake) {

    //TODO: static tests should be not so static
    var watchservers = ["133648084671528961", "158962769545134081"];
    var logchans = {
        "133648084671528961": "169827730802737153", //1EC7, 7879, whatevers
        "158962769545134081": "159062873434357760" //Cake batter server
    };

    function isWatching(message){
        if(message.channel.server === undefined) return false;
        if(watchservers.indexOf(message.channel.server.id) > -1) return true;
    }

    cake.on("messageUpdated", function(msg1, msg2){
        if(isWatching(msg1)) {
            cake.sendMessage(logchans[msg1.channel.server.id], "On " + new Date().toString() +
                msg1.author.name + " edited ```" + msg1.content + "``` to ```" + msg2.content + "```.");
        }
    });
};
