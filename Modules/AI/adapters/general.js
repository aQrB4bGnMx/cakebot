var aiUtils = require("../AiUtils");

module.exports.staticResponse = function(obj, variables, raw, cake) {
    cake.sendMessage(raw.channel, aiUtils.prepareResponse(obj.output, raw));
};
